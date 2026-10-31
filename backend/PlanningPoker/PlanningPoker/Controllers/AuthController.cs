using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Contracts.Auth;
using PlanningPoker.Services.Auth;

namespace PlanningPoker.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await _authService.RegisterAsync(request);
            SetRefreshTokenCookie(response.RefreshToken); 
            return StatusCode(201, response); 
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            SetRefreshTokenCookie(response.RefreshToken);
            return Ok(response);
        }
        private void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, 
                Secure = true,   
                SameSite = SameSiteMode.Strict, 
                Expires = DateTime.UtcNow.AddDays(30)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}