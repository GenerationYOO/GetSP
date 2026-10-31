using System.ComponentModel.DataAnnotations;
namespace PlanningPoker.Contracts.Auth
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Имя пользователя обязательно для заполнения")]
        [RegularExpression(pattern: @"^[а-яА-ЯёЁ]+$", ErrorMessage = "Имя может содержать только русские буквы")]
        [StringLength(maximumLength: 15, MinimumLength = 3, ErrorMessage = "Длина имени пользователя должна быть от 3 до 15 символов")]
        public required string Username { get; set; }
        [RegularExpression(pattern: @"^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,20}$", ErrorMessage =
            "Пароль должен содержать хотя бы одну букву, одну цифру и один спецсимвол, длина от 8 до 20!")]
        [Required(ErrorMessage = "Пароль обязателен для заполнения")]
        public required string Password { get; set; }
        [Required(ErrorMessage = "Email обязателен для заполнения")]
        [EmailAddress(ErrorMessage = "Некорректный формат email")]
        public required string Email { get; set; }
    }
}
