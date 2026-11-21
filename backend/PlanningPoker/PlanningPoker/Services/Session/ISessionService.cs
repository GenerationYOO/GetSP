using PlanningPoker.Contracts.Sessions;

namespace PlanningPoker.Services.Session;

public interface ISessionService
{
    public Task<CreateSessionResponse> CreateSessionAsync(CreateSessionRequest request, Guid userId);
}