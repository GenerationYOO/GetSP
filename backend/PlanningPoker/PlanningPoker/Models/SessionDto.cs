namespace PlanningPoker.Contracts.Sessions;

public class SessionDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int ParticipantCount { get; set; }
}