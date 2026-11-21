using ClosedXML.Excel;
using CsvHelper;
using Microsoft.VisualBasic.FileIO;
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
            var headerName = cell.GetString().Trim().Trim('\uFEFF', ' ', '"');
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
        var content = reader.ReadToEnd().TrimStart('\uFEFF');

        if (string.IsNullOrWhiteSpace(content))
            throw new FileValidationException("Загруженный файл пуст.");

        // Если каждая строка обёрнута в лишние тройные кавычки
        if (content.StartsWith("\"\"\""))
        {
            var lines = content.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);
            for (int i = 0; i < lines.Length; i++)
            {
                var line = lines.ElementAt(i).Trim();
                if (line.StartsWith("\"") && line.EndsWith("\"") && line.Length >= 2)
                    lines.SetValue(line[1..^1].Replace("\"\"", "\""), i);
            }
            content = string.Join("\n", lines);
        }

        var firstLine = content.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? "";
        var delimiter = firstLine.Count(c => c == ';') > firstLine.Count(c => c == ',') ? ";" : ",";

        using var stringReader = new StringReader(content);
        using var parser = new TextFieldParser(stringReader);
        parser.SetDelimiters(delimiter);
        parser.HasFieldsEnclosedInQuotes = true;

        if (parser.EndOfData)
            throw new FileValidationException("В файле отсутствует строка заголовков.");

        var rawHeaders = parser.ReadFields();
        if (rawHeaders == null || rawHeaders.Length == 0)
            throw new FileValidationException("Не удалось прочитать заголовки файла.");

        var columns = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        for (int i = 0; i < rawHeaders.Length; i++)
        {
            var cleanHeader = rawHeaders.ElementAt(i).Trim('\uFEFF', ' ', '"', '\r', '\n');
            if (!string.IsNullOrEmpty(cleanHeader))
                columns[cleanHeader] = i;
        }

        if (!columns.ContainsKey("ID задачи"))
            throw new FileValidationException("Отсутствует обязательный столбец 'ID задачи'.");

        if (!columns.ContainsKey("Заголовок"))
            throw new FileValidationException("Отсутствует обязательный столбец 'Заголовок'.");

        string? GetVal(string[] fields, string colName)
        {
            if (!columns.TryGetValue(colName, out var idx) || idx >= fields.Length)
                return null;
            var val = fields.ElementAt(idx)?.Trim();
            return string.IsNullOrWhiteSpace(val) ? null : val;
        }

        var rowNumber = 1;
        while (!parser.EndOfData)
        {
            rowNumber++;
            var fields = parser.ReadFields();
            if (fields == null) continue;

            var externalId = GetVal(fields, "ID задачи");
            var title = GetVal(fields, "Заголовок");

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
                Project = GetVal(fields, "Проект"),
                Tags = ParseTags(GetVal(fields, "Теги")),
                Reporter = GetVal(fields, "Заявитель"),
                Type = GetVal(fields, "Тип"),
                State = GetVal(fields, "Состояние"),
                Assignee = GetVal(fields, "Исполнитель"),
                OriginalEstimation = GetVal(fields, "Original estimation"),
                Sprints = GetVal(fields, "Sprints"),
                IdealDays = GetVal(fields, "Ideal days"),
                Description = GetVal(fields, "Описание"),
                StoryPoints = ParseNullableInt(GetVal(fields, "Story points")),
                Votes = ParseNullableInt(GetVal(fields, "Голоса")),
                CreatedAtSource = ParseNullableDate(GetVal(fields, "Создана"), rowNumber, "Создана", result.Warnings),
                UpdatedAtSource = ParseNullableDate(GetVal(fields, "Обновлена"), rowNumber, "Обновлена", result.Warnings),
                IsCompleted = !string.IsNullOrWhiteSpace(GetVal(fields, "Завершенная")),
                Priority = ParsePriority(GetVal(fields, "Приоритет"), rowNumber, result.Warnings),
                Order = orderCounter++
            };

            result.Tasks.Add(task);
        }

        return result;
    }

    private int GetCsvIndex(CsvReader csv, string columnName)
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

    private string? GetCsvString(CsvReader csv, int index)
    {
        if (index < 0) return null;
        var val = csv.GetString(index)?.Trim(' ', '"');
        return string.IsNullOrWhiteSpace(val) ? null : val;
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
        if (parts.Length == 4)
        {
            var day = parts[0].PadLeft(2, '0');
            var monthText = parts[1];
            var year = parts[2];
            var time = parts[3];

            if (MonthMap.TryGetValue(monthText, out var monthNumber))
            {
                var normalizedDate = $"{day}.{monthNumber}.{year} {time}";

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
        }

        warnings.Add($"Строка {rowNumber}: некорректный формат даты '{value}' в поле '{fieldName}'.");
        return null;
    }
}
