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

            var accessToken = jwtGenerator.GenerateToken(user);
            var refreshToken = jwtGenerator.GenerateRefreshToken();
            await SaveRefreshTokenAsync(user, refreshToken);

            return new AuthResponse
            {
                AccessToken = accessToken,       
                RefreshToken = refreshToken,     
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

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var email = request.Email.Trim().ToLowerInvariant();
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedException("Неверный email или пароль");

            var accessToken = jwtGenerator.GenerateToken(user);
            var refreshToken = jwtGenerator.GenerateRefreshToken();
            await SaveRefreshTokenAsync(user, refreshToken);

            return new AuthResponse
            {
                AccessToken = accessToken,       
                RefreshToken = refreshToken,   
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
            var existingToken = await db.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (existingToken == null || existingToken.IsRevoked || existingToken.ExpiresAt < DateTime.UtcNow)
                throw new UnauthorizedException("Неверный или истекший токен обновления");

            existingToken.IsRevoked = true;

            var newAccessToken = jwtGenerator.GenerateToken(existingToken.User);
            var newRefreshTokenString = jwtGenerator.GenerateRefreshToken();
            await SaveRefreshTokenAsync(existingToken.User, newRefreshTokenString);
            return new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshTokenString,
                User = new UserDto
                {
                    Id = existingToken.User.Id,
                    Email = existingToken.User.Email,
                    Username = existingToken.User.Username,
                    Role = existingToken.User.Role
                },
                ExpiresIn = 900
            };
        }

        private async Task SaveRefreshTokenAsync(User user, string token)
        {
            var refreshToken = new RefreshToken
            {
                Token = token,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(30),
                IsRevoked = false
            };
            db.RefreshTokens.Add(refreshToken);
            await db.SaveChangesAsync();
        }
    }
}