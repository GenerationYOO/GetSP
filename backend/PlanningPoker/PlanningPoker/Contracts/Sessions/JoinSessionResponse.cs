namespace PlanningPoker.Contracts.Sessions;

public class JoinSessionResponse
{
    public Guid ParticipantId { get; set; }
    public string GuestName { get; set; } = string.Empty;
    public Guid SessionId { get; set; }
    public string AccessToken { get; set; } = string.Empty;
}