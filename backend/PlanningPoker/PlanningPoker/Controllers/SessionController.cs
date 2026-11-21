using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Contracts.Sessions;
using PlanningPoker.Services.Session;
using System.Security.Claims;

namespace PlanningPoker.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
[Authorize] 
public class SessionsController : ControllerBase
{
    private readonly ISessionService sessionService;

    public SessionsController(ISessionService sessionService)
    {
        this.sessionService = sessionService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSessionRequest request)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var result = await sessionService.CreateSessionAsync(request, userId);

        return StatusCode(201, result);
    }
}