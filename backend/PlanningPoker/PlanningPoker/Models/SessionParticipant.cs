namespace PlanningPoker.Models;

public class SessionParticipant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SessionId { get; set; }
    public Session Session { get; set; } = null!;
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public string? GuestName { get; set; }
    public ParticipantRole Role { get; set; } = ParticipantRole.Participant;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
