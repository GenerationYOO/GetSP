using Microsoft.EntityFrameworkCore;
using PlanningPoker.Contracts.Auth;
using PlanningPoker.Data;
using PlanningPoker.Exceptions;
using PlanningPoker.Models;

namespace PlanningPoker.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext db;
        private readonly IJwtTokenGenerator jwtGenerator;

        public AuthService(AppDbContext db, IJwtTokenGenerator jwtGenerator)
        {
            this.db = db;
            this.jwtGenerator = jwtGenerator;
        }
        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var email = request.Email.Trim().ToLowerInvariant();
            if (await db.Users.AnyAsync(u => u.Email == email))
                throw new ConflictException("Такой email уже есть");
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User 
            {
                Email = email,
                PasswordHash = passwordHash,
                Role = "User",
                Username = request.Username
            };
            db.Users.Add(user);
            await db.SaveChangesAsync();
            var authResponse = new AuthResponse
            {
                AccessToken = jwtGenerator.GenerateToken(user),
                RefreshToken = jwtGenerator.GenerateRefreshToken(),
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Username = user.Username,
                    Role = user.Role
                },
                ExpiresIn = 900
            };
            return authResponse;
        }
        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var email = request.Email.Trim().ToLowerInvariant();
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedException("Неверный email или пароль");
            return new AuthResponse
            {
                AccessToken = jwtGenerator.GenerateToken(user),
                RefreshToken = jwtGenerator.GenerateRefreshToken(),
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Username = user.Username,
                    Role = user.Role
                },
                ExpiresIn = 900
            };
        }
        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            throw new UnauthorizedException("Функция обновления токена пока не реализована");
        }
    }
}
