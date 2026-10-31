using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Contracts.Auth;
using PlanningPoker.Services.Auth;

namespace PlanningPoker.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly IWebHostEnvironment env;

        public AuthController(IAuthService authService, IWebHostEnvironment env)
        {
            this.authService = authService;
            this.env = env;
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var response = await authService.RefreshTokenAsync(refreshToken);
            SetRefreshTokenCookie(response.RefreshToken);
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await authService.RegisterAsync(request);
            SetRefreshTokenCookie(response.RefreshToken);
            return StatusCode(201, response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await authService.LoginAsync(request);
            SetRefreshTokenCookie(response.RefreshToken);
            return Ok(response);
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var isDev = env.IsDevelopment();

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDev,
                SameSite = isDev ? SameSiteMode.Lax : SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(30)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}