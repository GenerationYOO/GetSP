using System.Text.Json.Serialization;

namespace PlanningPoker.Contracts.Auth
{
    public class AuthResponse
    {
        public UserDto User { get; set; } = new UserDto();
        public string AccessToken { get; set; } = string.Empty;
        [JsonIgnore]
        public string RefreshToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; } = 900;
    }
}
