namespace PlanningPoker.Models;
public class Session
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    public string InviteCode { get; set; } = string.Empty;
    public SessionStatus Status { get; set; } = SessionStatus.Draft;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<SessionTask> Tasks { get; set; } = new List<SessionTask>();
    public ICollection<SessionParticipant> Participants { get; set; } = new List<SessionParticipant>();
}
