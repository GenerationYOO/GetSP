using PlanningPoker.Contracts.Auth;

namespace PlanningPoker.Services.Auth
{
    public interface IAuthService
    {
        public Task<AuthResponse> RegisterAsync(RegisterRequest request);
        public Task<AuthResponse> LoginAsync(LoginRequest request);
        public Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    }
}
