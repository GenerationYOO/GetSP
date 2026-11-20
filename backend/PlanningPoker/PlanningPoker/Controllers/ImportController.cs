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
        if (file == null || file.Length == 0)
        {
            return Problem(
                type: "https://example.com",
                title: "Ошибка валидации файла",
                statusCode: StatusCodes.Status400BadRequest,
                detail: "Файл не выбран или пуст.",
                instance: HttpContext.Request.Path
            );
        }

        if (file.Length > MaxFileSizeBytes)
        {
            return Problem(
                type: "https://example.com",
                title: "Ошибка валидации файла",
                statusCode: StatusCodes.Status400BadRequest,
                detail: "Превышен максимальный размер файла (10 МБ).",
                instance: HttpContext.Request.Path
            );
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (extension != ".csv" && extension != ".xlsx")
        {
            return Problem(
                type: "https://example.com",
                title: "Ошибка валидации файла",
                statusCode: StatusCodes.Status400BadRequest,
                detail: "Поддерживаются только файлы CSV и XLSX.",
                instance: HttpContext.Request.Path
            );
        }

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
            {
                return Problem(
                    type: "https://example.com",
                    title: "Ошибка валидации файла",
                    statusCode: StatusCodes.Status400BadRequest,
                    detail: "В файле не найдено ни одной корректной задачи.",
                    instance: HttpContext.Request.Path
                );
            }

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
            return Problem(
                type: "https://example.com",
                title: "Ошибка валидации файла",
                statusCode: StatusCodes.Status400BadRequest,
                detail: ex.Message,
                instance: HttpContext.Request.Path
            );
        }
        catch (Exception)
        {
            return Problem(
                type: "https://example.com",
                title: "Ошибка чтения файла",
                statusCode: StatusCodes.Status400BadRequest,
                detail: "Не удалось прочитать файл. Возможно, он повреждён или имеет неверную кодировку.",
                instance: HttpContext.Request.Path
            );
        }
    }
}
