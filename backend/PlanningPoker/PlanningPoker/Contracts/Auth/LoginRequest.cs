using System.ComponentModel.DataAnnotations;

namespace PlanningPoker.Contracts.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email обязателен для заполнения")]
        [EmailAddress(ErrorMessage = "Некорректный формат email")]
        public required string Email { get; set; }
        [Required(ErrorMessage = "Пароль обязателен для ввода")]
        public required string Password { get; set; }
    }
}
