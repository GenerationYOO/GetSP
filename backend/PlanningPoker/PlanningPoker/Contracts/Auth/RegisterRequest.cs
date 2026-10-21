using System.ComponentModel.DataAnnotations;
namespace PlanningPoker.Contracts.Auth
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Имя пользователя обязательно для заполнения")]
        [RegularExpression(pattern: @"^[a-zA-Z0-9_]+$", ErrorMessage = "Имя пользователя может содержать только буквы, цифры и символ подчеркивания")]
        [StringLength(maximumLength: 15, MinimumLength = 3, ErrorMessage = "Длина имени пользователя должна быть от 3 до 15 символов")]
        public required string Username { get; set; }
        [RegularExpression(pattern: @"^(?=.*[a-zA-Z])(?=.*\d)(?=.*[_!]).{8,20}$", ErrorMessage = "Пароль должен содержать хотя бы одну букву, одну цифру и один из символов _!")]
        [Required(ErrorMessage = "Пароль обязателен для заполнения")]
        public required string Password { get; set; }
        [Required(ErrorMessage = "Email обязателен для заполнения")]
        [EmailAddress(ErrorMessage = "Некорректный формат email")]
        public required string Email { get; set; }
    }
}
