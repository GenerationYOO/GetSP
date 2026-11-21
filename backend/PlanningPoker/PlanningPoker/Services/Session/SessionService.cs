using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using PlanningPoker.Contracts.Sessions;
using PlanningPoker.Data;
using PlanningPoker.Exceptions;
using PlanningPoker.Models;
using PlanningPoker.Services.Auth;
using PlanningPoker.Services.Generate;
using QRCoder;

namespace PlanningPoker.Services.Session;

public class SessionService : ISessionService
{
    private readonly IConfiguration configuration;
    private readonly IMemoryCache cache;
    private readonly AppDbContext db;
    private readonly CodeGeneratorService codeGenerator;
    private readonly IJwtTokenGenerator jwtGenerator;

    public SessionService(AppDbContext db, IMemoryCache cache, CodeGeneratorService codeGenerator, IConfiguration configuration, IJwtTokenGenerator jwtGenerator)
    {
        this.db = db;
        this.cache = cache;
        this.codeGenerator = codeGenerator;
        this.configuration = configuration;
        this.jwtGenerator = jwtGenerator;
    }

    public async Task<SessionDto> GetSessionByCodeAsync(string inviteCode)
    {
        var session = await db.Sessions
            .Include(s => s.Owner)
            .Include(s => s.Participants)
            .FirstOrDefaultAsync(s => s.InviteCode == inviteCode);
        if (session == null)
            throw new NotFoundException("Сессия с таким кодом не найдена");
        return new SessionDto
        {
            Id = session.Id,
            Name = session.Name,
            OwnerName = session.Owner.Username,
            Status = session.Status.ToString(),
            ParticipantCount = session.Participants.Count
        };
    }

    public async Task<CreateSessionResponse> CreateSessionAsync(CreateSessionRequest request, Guid userId)
    {
        var tasks = new List<ImportedTaskDto>();
        if (request.Tasks != null && request.Tasks.Any())
            tasks = request.Tasks;
        else if (!string.IsNullOrEmpty(request.ImportId))
        {
            var importTasks = cache.Get<List<ImportedTaskDto>>(request.ImportId);
            if (importTasks == null || !importTasks.Any())
                throw new ValidationException("Задачи не найдены или срок их действия истек.");
            tasks = importTasks;
        }
        else
            throw new ValidationException("Задачи не переданы.");

        string inviteCode;
        var attempts = 0;
        const int maxAttempts = 10;
        do
        {
            inviteCode = codeGenerator.GenerateInviteCode();
            attempts++;

            if (attempts > maxAttempts)
                throw new Exception("Не удалось сгенерировать уникальный код приглашения.");

        } while (await db.Sessions.AnyAsync(s => s.InviteCode == inviteCode));

        using var transaction = await db.Database.BeginTransactionAsync();

        try
        {
            var session = new Models.Session
            {
                Name = request.Name,
                InviteCode = inviteCode,
                OwnerId = userId,
                Status = Models.SessionStatus.Active,
                CreatedAt = DateTime.UtcNow,

                Tasks = tasks.Select(t => new Models.SessionTask
                {
                    ExternalId = t.ExternalId,
                    Title = t.Title,
                    Description = t.Description,
                    Project = t.Project,
                    Tags = t.Tags != null ? string.Join(",", t.Tags) : null,
                    Priority = t.Priority,
                    Reporter = t.Reporter,
                    Type = t.Type,
                    State = t.State,
                    Assignee = t.Assignee,
                    OriginalEstimation = t.OriginalEstimation,
                    StoryPoints = t.StoryPoints,
                    Sprints = t.Sprints,
                    IdealDays = t.IdealDays,
                    Votes = t.Votes,
                    CreatedAtSource = t.CreatedAtSource,
                    UpdatedAtSource = t.UpdatedAtSource,
                    IsCompleted = t.IsCompleted,
                    Order = t.Order
                }).ToList(),

                Participants = new List<Models.SessionParticipant>
                {
                    new Models.SessionParticipant
                    {
                        UserId = userId,
                        Role = Models.ParticipantRole.Owner,
                        JoinedAt = DateTime.UtcNow
                    }
                }
            };

            db.Sessions.Add(session);
            await db.SaveChangesAsync();

            await transaction.CommitAsync();

            var frontendUrl = configuration["FrontendUrl"] ?? "http://localhost:5173";
            var inviteLink = $"{frontendUrl}/join/{session.InviteCode}"; 

            using var qrGenerator = new QRCodeGenerator();
            using var qrCodeData = qrGenerator.CreateQrCode(inviteLink, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new PngByteQRCode(qrCodeData);
            var qrCodeBytes = qrCode.GetGraphic(20);
            var base64 = Convert.ToBase64String(qrCodeBytes);

            return new CreateSessionResponse
            {
                SessionId = session.Id,
                Name = session.Name,
                InviteCode = session.InviteCode,
                InviteLink = inviteLink,
                QrCodeBase64 = base64
            };
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<JoinSessionResponse> JoinAsGuestAsync(string inviteCode, JoinSessionRequest request)
    {
        var session = await db.Sessions
            .FirstOrDefaultAsync(s => s.InviteCode == inviteCode);

        if (session == null)
            throw new NotFoundException("Сессия с таким кодом не найдена");


        var participant = new Models.SessionParticipant
        {
            SessionId = session.Id,
            GuestName = request.GuestName, 
            Role = Models.ParticipantRole.Guest,
            JoinedAt = DateTime.UtcNow
        };

        db.SessionParticipants.Add(participant);
        await db.SaveChangesAsync();
        var token = jwtGenerator.GenerateTokenForGuest(participant);

        return new JoinSessionResponse
        {
            ParticipantId = participant.Id,
            GuestName = participant.GuestName,
            SessionId = session.Id,
            AccessToken = token
        };
    }
}