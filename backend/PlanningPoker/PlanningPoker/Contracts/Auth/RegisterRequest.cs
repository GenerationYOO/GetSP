using System.ComponentModel.DataAnnotations;
namespace PlanningPoker.Contracts.Auth
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Имя пользователя обязательно для заполнения")]
        [RegularExpression(pattern: @"^[a-zA-Z0-9_]+$", ErrorMessage = "Имя пользователя может содержать только буквы, цифры и символ подчеркивания")]
        [StringLength(maximumLength: 15, MinimumLength = 3, ErrorMessage = "Длина имени пользователя должна быть от 3 до 15 символов")]
        public required string Username { get; set; }
        [RegularExpression(pattern: @"^[a-zA-Z]{2,20}[0-9]{5,20}[_!]+$", ErrorMessage = "Пароль может содержать только буквы, цифры и символы _!. Букв 2+, цифр 5+, символов _! 1+")]
        [Required(ErrorMessage = "Пароль обязателен для заполнения")]
        [StringLength(maximumLength: 20, MinimumLength = 8, ErrorMessage = "Длина пароля должна быть от 8 до 20 символов")]
        public required string Password { get; set; }
        [Required(ErrorMessage = "Email обязателен для заполнения")]
        [EmailAddress(ErrorMessage = "Некорректный формат email")]
        public required string Email { get; set; }
    }
}
