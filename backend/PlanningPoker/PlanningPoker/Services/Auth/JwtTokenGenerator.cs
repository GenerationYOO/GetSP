using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using PlanningPoker.Models;
using System.Security.Claims;
using System.Text;

namespace PlanningPoker.Services.Auth
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly IConfiguration configuration;
        public string GenerateToken(User user)
        {
            var key = configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
                throw new Exception("JWT ключ не найден");
            var bytesOfKey = Encoding.UTF8.GetBytes(key);
            var print = new SymmetricSecurityKey(bytesOfKey);
            var creds = new SigningCredentials(print, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: "PlanningPoker.Api",      
                audience: "PlanningPoker.Web",    
                claims: claims,                   
                expires: DateTime.UtcNow.AddMinutes(15), 
                signingCredentials: creds        
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
        }
        public string GenerateRefreshToken();

        public JwtTokenGenerator(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
    }
}
