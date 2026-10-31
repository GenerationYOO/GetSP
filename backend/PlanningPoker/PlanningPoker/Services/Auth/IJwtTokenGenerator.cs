using PlanningPoker.Models;

namespace PlanningPoker.Services.Auth
{
    public interface IJwtTokenGenerator
    {
        public string GenerateToken(User user);
        public string GenerateRefreshToken();
    }
}
