namespace PlanningPoker.Contracts.Sessions;

public class CreateSessionResponse
{
    public Guid SessionId { get; set; }
    public required string Name { get; set; }
    public required string InviteCode { get; set; } 
    public required string InviteLink { get; set; }
    public required string QrCodeBase64 { get; set; }
}