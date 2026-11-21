using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using PlanningPoker.Services;

namespace PlanningPoker.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
[Authorize]
public class ImportController : ControllerBase
{
    private readonly ImportService importService;
    private readonly IMemoryCache cache;
    private const long MaxFileSizeBytes = 10 * 1024 * 1024;

    public ImportController(ImportService importService, IMemoryCache cache)
    {
        this.importService = importService;
        this.cache = cache;
    }

    [HttpPost("preview")]
    [RequestSizeLimit(MaxFileSizeBytes)]
    public IActionResult Preview(IFormFile? file)
    {
        if (file == null)
            return GenerateProblem("Ошибка валидации файла", "Файл не был загружен.");
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var validationResult = ValidateFile(
            (isValid: () => file.Length > 0, detail: "Файл пуст."),
            (isValid: () => file.Length <= MaxFileSizeBytes, detail: "Превышен максимальный размер файла (10 МБ)."),
            (isValid: () => extension == ".csv" || extension == ".xlsx", detail: "Поддерживаются только файлы CSV и XLSX.")
        );
        if (validationResult != null)
            return validationResult;

        try
        {
            ImportResult importResult;
            using (var stream = file.OpenReadStream())
            {
                if (extension == ".csv")
                    importResult = importService.ParseCsv(stream);
                else
                    importResult = importService.ParseExcel(stream);
            }
            if (importResult.Tasks.Count == 0)
                return GenerateProblem("Ошибка валидации файла", "В файле не найдено ни одной корректной задачи.");
            var importId = Guid.NewGuid().ToString();
            cache.Set(importId, importResult.Tasks, TimeSpan.FromMinutes(30));
            return Ok(new
            {
                importId = importId,
                tasks = importResult.Tasks,
                warnings = importResult.Warnings
            });
        }
        catch (FileValidationException ex)
        {
            return GenerateProblem("Ошибка валидации файла", ex.Message);
        }
        catch (Exception)
        {
            return GenerateProblem("Ошибка чтения файла", "Не удалось прочитать файл. Возможно, он повреждён или имеет неверную кодировку.");
        }
    }
    private ObjectResult? ValidateFile(params (Func<bool> isValid, string? detail)[] validators)
    {
        foreach (var (isValid, detail) in validators)
        {
            if (!isValid())
                return GenerateProblem("Ошибка валидации файла", detail);
        }
        return null;
    }

    private ObjectResult? GenerateProblem(string? title, string? detail)
    {
        return Problem(
            type: "https://example.com",
            title: title,
            statusCode: StatusCodes.Status400BadRequest,
            detail: detail,
            instance: HttpContext.Request.Path
        );
    }
}
