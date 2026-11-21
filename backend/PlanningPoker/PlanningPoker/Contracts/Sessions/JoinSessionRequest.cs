using System.ComponentModel.DataAnnotations;

namespace PlanningPoker.Contracts.Sessions;

public class JoinSessionRequest
{
    [Required(ErrorMessage = "Имя гостя не может быть пустым")]
    [RegularExpression(pattern: @"^[а-яА-ЯёЁ]+$", ErrorMessage = "Имя гостя может содержать только русские буквы")]
    [StringLength(maximumLength: 20, MinimumLength = 1, ErrorMessage = "Длина имени гостя должна быть от 1 до 20 символов")]
    public required string GuestName { get; set; }
}