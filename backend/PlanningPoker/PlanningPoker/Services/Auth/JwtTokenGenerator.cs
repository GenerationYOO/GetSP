using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.IdentityModel.Tokens;
using PlanningPoker.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PlanningPoker.Services.Auth
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly IConfiguration configuration;
        public string GenerateToken(User user)
        {
            var creds = GetCreds();
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            return GetToken(creds, claims, 15);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public string GenerateTokenForGuest(SessionParticipant sessionParticipant)
        {
            var creds = GetCreds();
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, sessionParticipant.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, sessionParticipant.GuestName),
                new Claim(ClaimTypes.Role, "Guest"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            return GetToken(creds, claims, 240);
        }

        private static string GetToken(SigningCredentials creds, List<Claim> claims, int minutes)
        {
            var token = new JwtSecurityToken(
                issuer: "PlanningPoker.Api",
                audience: "PlanningPoker.Web",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(minutes),
                signingCredentials: creds
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
        }

        private SigningCredentials GetCreds()
        {
            var key = configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
                throw new Exception("JWT ключ не найден");
            var bytesOfKey = Encoding.UTF8.GetBytes(key);
            var print = new SymmetricSecurityKey(bytesOfKey);
            var creds = new SigningCredentials(print, SecurityAlgorithms.HmacSha256);
            return creds;
        }

        public JwtTokenGenerator(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
    }
}
