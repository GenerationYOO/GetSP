using PlanningPoker.Services;
using System.ComponentModel.DataAnnotations;

namespace PlanningPoker.Contracts.Sessions;
public class CreateSessionRequest
{
    [Required(ErrorMessage = "Название сессии обязательно для заполнения")]
    [RegularExpression(@"^[^<>]+$", ErrorMessage = "Название сессии не может содержать символы < и >")]
    [StringLength(maximumLength: 255, MinimumLength = 1, ErrorMessage = "Длина названия сессии должна быть от 1 до 255 символов")]
    public required string Name { get; set; }
    public string? ImportId { get; set; }
    public List<ImportedTaskDto>? Tasks { get; set; }
}

