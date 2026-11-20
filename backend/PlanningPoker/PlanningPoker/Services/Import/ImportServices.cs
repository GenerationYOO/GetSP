using ClosedXML.Excel;
using CsvHelper;
using PlanningPoker.Models;
using System.Globalization;

namespace PlanningPoker.Services;

public class ImportService
{
    private const int MaxTasksLimit = 500;

    private static readonly Dictionary<string, string> MonthMap = new(StringComparer.OrdinalIgnoreCase)
    {
        { "янв.", "01" }, { "февр.", "02" }, { "фев.", "02" },
        { "мар.", "03" }, { "марта", "03" }, { "апр.", "04" },
        { "мая", "05" },  { "май", "05" },   { "июн.", "06" },
        { "июл.", "07" }, { "авг.", "08" },  { "сент.", "09" },
        { "сен.", "09" }, { "окт.", "10" },  { "нояб.", "11" },
        { "ноя.", "11" }, { "дек.", "12" }
    };

    public ImportResult ParseExcel(Stream fileStream)
    {
        using var workbook = new XLWorkbook(fileStream);
        var result = new ImportResult();
        var orderCounter = 1;

        var sheet = workbook.Worksheets.FirstOrDefault();
        if (sheet == null)
            throw new FileValidationException("Excel-файл не содержит листов.");

        var headersRow = sheet.FirstRowUsed();
        if (headersRow == null)
            throw new FileValidationException("В файле отсутствует строка заголовков.");

        var columns = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        foreach (var cell in headersRow.CellsUsed())
        {
            var headerName = cell.GetString().Trim();
            if (!string.IsNullOrEmpty(headerName))
                columns[headerName] = cell.Address.ColumnNumber;
        }

        if (!columns.ContainsKey("ID задачи"))
            throw new FileValidationException("Отсутствует обязательный столбец 'ID задачи'.");

        if (!columns.ContainsKey("Заголовок"))
            throw new FileValidationException("Отсутствует обязательный столбец 'Заголовок'.");

        foreach (var row in sheet.RowsUsed().Skip(1))
        {
            var rowNumber = row.RowNumber();
            var externalId = GetCellString(row, columns, "ID задачи");
            var title = GetCellString(row, columns, "Заголовок");

            if (string.IsNullOrWhiteSpace(externalId))
            {
                result.Warnings.Add($"Строка {rowNumber}: пропущена, так как отсутствует 'ID задачи'.");
                continue;
            }

            if (string.IsNullOrWhiteSpace(title))
            {
                result.Warnings.Add($"Строка {rowNumber} (ID: {externalId}): пропущена, так как отсутствует 'Заголовок'.");
                continue;
            }

            if (result.Tasks.Count >= MaxTasksLimit)
                throw new FileValidationException($"Превышено максимальное количество задач ({MaxTasksLimit}).");

            var task = new ImportedTaskDto
            {
                ExternalId = externalId,
                Title = title.Length > 255 ? title[..255] : title,
                Project = GetCellString(row, columns, "Проект"),
                Tags = ParseTags(GetCellString(row, columns, "Теги")),
                Reporter = GetCellString(row, columns, "Заявитель"),
                Type = GetCellString(row, columns, "Тип"),
                State = GetCellString(row, columns, "Состояние"),
                Assignee = GetCellString(row, columns, "Исполнитель"),
                OriginalEstimation = GetCellString(row, columns, "Original estimation"),
                Sprints = GetCellString(row, columns, "Sprints"),
                IdealDays = GetCellString(row, columns, "Ideal days"),
                Description = GetCellString(row, columns, "Описание"),
                StoryPoints = ParseNullableInt(GetCellString(row, columns, "Story points")),
                Votes = ParseNullableInt(GetCellString(row, columns, "Голоса")),
                CreatedAtSource = GetCellDate(row, columns, "Создана", rowNumber, result.Warnings),
                UpdatedAtSource = GetCellDate(row, columns, "Обновлена", rowNumber, result.Warnings),
                IsCompleted = !string.IsNullOrWhiteSpace(GetCellString(row, columns, "Завершенная")),
                Priority = ParsePriority(GetCellString(row, columns, "Приоритет"), rowNumber, result.Warnings),
                Order = orderCounter++
            };

            result.Tasks.Add(task);
        }

        return result;
    }
    public ImportResult ParseCsv(Stream fileStream)
    {
        var result = new ImportResult();
        var orderCounter = 1;

        using var reader = new StreamReader(fileStream);
        var content = reader.ReadToEnd();
        if (string.IsNullOrWhiteSpace(content))
            throw new FileValidationException("Загруженный файл пуст.");

        var options = new CsvReaderOptions { FormatProvider = CultureInfo.InvariantCulture };
        using var csv = CsvReader.FromText(content, options);

        if (!csv.Read())
            throw new FileValidationException("В файле отсутствует строка заголовков.");
        csv.ReadHeader();

        var idIndex = GetRequiredCsvIndex(csv, "ID задачи");
        var titleIndex = GetRequiredCsvIndex(csv, "Заголовок");

        var projectIndex = GetOptionalCsvIndex(csv, "Проект");
        var tagsIndex = GetOptionalCsvIndex(csv, "Теги");
        var reporterIndex = GetOptionalCsvIndex(csv, "Заявитель");
        var createdAtIndex = GetOptionalCsvIndex(csv, "Создана");
        var updatedAtIndex = GetOptionalCsvIndex(csv, "Обновлена");
        var isCompletedIndex = GetOptionalCsvIndex(csv, "Завершенная");
        var priorityIndex = GetOptionalCsvIndex(csv, "Приоритет");
        var typeIndex = GetOptionalCsvIndex(csv, "Тип");
        var stateIndex = GetOptionalCsvIndex(csv, "Состояние");
        var assigneeIndex = GetOptionalCsvIndex(csv, "Исполнитель");
        var origEstIndex = GetOptionalCsvIndex(csv, "Original estimation");
        var storyPointsIndex = GetOptionalCsvIndex(csv, "Story points");
        var sprintsIndex = GetOptionalCsvIndex(csv, "Sprints");
        var idealDaysIndex = GetOptionalCsvIndex(csv, "Ideal days");
        var descriptionIndex = GetOptionalCsvIndex(csv, "Описание");
        var votesIndex = GetOptionalCsvIndex(csv, "Голоса");

        var rowNumber = 1;
        while (csv.Read())
        {
            rowNumber++;
            var externalId = csv.GetString(idIndex)?.Trim();
            var title = csv.GetString(titleIndex)?.Trim();

            if (string.IsNullOrWhiteSpace(externalId))
            {
                result.Warnings.Add($"Строка {rowNumber}: пропущена, так как отсутствует 'ID задачи'.");
                continue;
            }

            if (string.IsNullOrWhiteSpace(title))
            {
                result.Warnings.Add($"Строка {rowNumber} (ID: {externalId}): пропущена, так как отсутствует 'Заголовок'.");
                continue;
            }

            if (result.Tasks.Count >= MaxTasksLimit)
                throw new FileValidationException($"Превышено максимальное количество задач ({MaxTasksLimit}).");

            var task = new ImportedTaskDto
            {
                ExternalId = externalId,
                Title = title.Length > 255 ? title[..255] : title,
                Project = GetCsvString(csv, projectIndex),
                Tags = ParseTags(GetCsvString(csv, tagsIndex)),
                Reporter = GetCsvString(csv, reporterIndex),
                Type = GetCsvString(csv, typeIndex),
                State = GetCsvString(csv, stateIndex),
                Assignee = GetCsvString(csv, assigneeIndex),
                OriginalEstimation = GetCsvString(csv, origEstIndex),
                Sprints = GetCsvString(csv, sprintsIndex),
                IdealDays = GetCsvString(csv, idealDaysIndex),
                Description = GetCsvString(csv, descriptionIndex),
                StoryPoints = ParseNullableInt(GetCsvString(csv, storyPointsIndex)),
                Votes = ParseNullableInt(GetCsvString(csv, votesIndex)),
                CreatedAtSource = ParseNullableDate(GetCsvString(csv, createdAtIndex), rowNumber, "Создана", result.Warnings),
                UpdatedAtSource = ParseNullableDate(GetCsvString(csv, updatedAtIndex), rowNumber, "Обновлена", result.Warnings),
                IsCompleted = !string.IsNullOrWhiteSpace(GetCsvString(csv, isCompletedIndex)),
                Priority = ParsePriority(GetCsvString(csv, priorityIndex), rowNumber, result.Warnings),
                Order = orderCounter++
            };

            result.Tasks.Add(task);
        }

        return result;
    }

    private string? GetCellString(IXLRow row, Dictionary<string, int> columns, string columnName)
    {
        if (!columns.TryGetValue(columnName, out var colIndex))
            return null;

        var value = row.Cell(colIndex).GetString();
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private DateTime? GetCellDate(IXLRow row, Dictionary<string, int> columns, string columnName, int rowNumber, List<string> warnings)
    {
        if (!columns.TryGetValue(columnName, out var colIndex))
            return null;

        var cell = row.Cell(colIndex);
        if (cell.IsEmpty())
            return null;

        if (cell.TryGetValue<DateTime>(out var excelDate))
            return DateTime.SpecifyKind(excelDate, DateTimeKind.Utc);

        return ParseNullableDate(cell.GetString(), rowNumber, columnName, warnings);
    }

    private int GetRequiredCsvIndex(CsvReader csv, string columnName)
    {
        var index = GetOptionalCsvIndex(csv, columnName);
        if (index < 0)
            throw new FileValidationException($"Отсутствует обязательный столбец '{columnName}'.");
        return index;
    }

    private int GetOptionalCsvIndex(CsvReader csv, string columnName)
    {
        try
        {
            return csv.GetFieldIndex(columnName);
        }
        catch
        {
            return -1;
        }
    }

    private string? GetCsvString(CsvReader csv, int index)
    {
        if (index < 0) return null;
        var val = csv.GetString(index);
        return string.IsNullOrWhiteSpace(val) ? null : val.Trim();
    }

    private List<string> ParseTags(string? rawTags)
    {
        if (string.IsNullOrWhiteSpace(rawTags))
            return new List<string>();

        return rawTags
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(t => t.Trim())
            .Where(t => !string.IsNullOrEmpty(t))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private TaskPriority ParsePriority(string? priority, int rowNumber, List<string> warnings)
    {
        if (string.IsNullOrWhiteSpace(priority))
            return TaskPriority.Normal;

        switch (priority.Trim())
        {
            case "Обычная": return TaskPriority.Normal;
            case "Неотложная": return TaskPriority.Urgent;
            case "Критическая": return TaskPriority.Critical;
            case "Серьезная": return TaskPriority.Major;
            case "Незначительная": return TaskPriority.Minor;
            default:
                warnings.Add($"Строка {rowNumber}: неизвестный приоритет '{priority}', установлено значение 'Normal'.");
                return TaskPriority.Normal;
        }
    }

    private int? ParseNullableInt(string? value)
    {
        if (int.TryParse(value, out var result)) return result;
        return null;
    }

    private DateTime? ParseNullableDate(string? value, int rowNumber, string fieldName, List<string> warnings)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var parts = value.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 4 && MonthMap.TryGetValue(parts[1], out var monthNumber))
        {
            var normalizedDate = $"{parts[0].PadLeft(2, '0')}.{monthNumber}.{parts[2]} {parts[3]}";

            if (DateTime.TryParseExact(
                normalizedDate,
                "dd.MM.yyyy HH:mm",
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                out var result))
            {
                return result;
            }
        }

        warnings.Add($"Строка {rowNumber}: некорректный формат даты '{value}' в поле '{fieldName}'.");
        return null;
    }
}
