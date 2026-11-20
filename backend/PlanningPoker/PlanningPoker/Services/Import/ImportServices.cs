using ClosedXML.Excel;
using CsvHelper;
using PlanningPoker.Models;
using System.Globalization;
using System.IO;

namespace PlanningPoker.Services
{
    public class ImportService
    {
        public List<SessionTask> ParseExcel(Stream fileStream)
        {
            using var workbook = new XLWorkbook(fileStream);
            var tasks = new List<SessionTask>();
            var orderCounter = 1;

            foreach (var sheet in workbook.Worksheets)
            {
                var headersRow = sheet.FirstRowUsed();
                if (headersRow == null)
                    continue;

                var columns = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                foreach (var cell in headersRow.CellsUsed())
                {
                    var headerName = cell.GetString().Trim();
                    if (!string.IsNullOrEmpty(headerName))
                        columns[headerName] = cell.Address.ColumnNumber;
                }

                foreach (var row in sheet.RowsUsed().Skip(1))
                {
                    var externalId = GetCellString(row, columns, "ID задачи");
                    var title = GetCellString(row, columns, "Заголовок");

                    if (string.IsNullOrWhiteSpace(externalId) || string.IsNullOrWhiteSpace(title))
                        continue;

                    var task = new SessionTask
                    {
                        ExternalId = externalId,
                        Title = title,
                        Project = GetCellString(row, columns, "Проект"),
                        Tags = GetCellString(row, columns, "Теги"),
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
                        CreatedAtSource = GetCellDate(row, columns, "Создана"),
                        UpdatedAtSource = GetCellDate(row, columns, "Обновлена"),
                        IsCompleted = !string.IsNullOrWhiteSpace(GetCellString(row, columns, "Завершенная")),
                        Priority = ParsePriority(GetCellString(row, columns, "Приоритет")),
                        Order = orderCounter++
                    };

                    tasks.Add(task);
                }
            }

            return tasks;
        }

        private string? GetCellString(IXLRow row, Dictionary<string, int> columns, string columnName)
        {
            if (!columns.TryGetValue(columnName, out var colIndex))
                return null;

            var value = row.Cell(colIndex).GetString();
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }

        private DateTime? GetCellDate(IXLRow row, Dictionary<string, int> columns, string columnName)
        {
            if (!columns.TryGetValue(columnName, out var colIndex))
                return null;

            var cell = row.Cell(colIndex);
            if (cell.TryGetValue<DateTime>(out var excelDate))
                return excelDate;

            return ParseNullableDate(cell.GetString());
        }

        public List<SessionTask> ParseCsv(Stream fileStream)
        {
            var tasks = new List<SessionTask>();
            var orderCounter = 1;

            using var reader = new StreamReader(fileStream);
            var options = new CsvReaderOptions { FormatProvider = CultureInfo.InvariantCulture };
            using var csv = CsvReader.FromText(reader.ReadToEnd(), options);

            csv.Read();
            csv.ReadHeader();

            var idIndex = csv.GetFieldIndex("ID задачи");
            var projectIndex = csv.GetFieldIndex("Проект");
            var tagsIndex = csv.GetFieldIndex("Теги");
            var titleIndex = csv.GetFieldIndex("Заголовок");
            var reporterIndex = csv.GetFieldIndex("Заявитель");
            var createdAtIndex = csv.GetFieldIndex("Создана");
            var updatedAtIndex = csv.GetFieldIndex("Обновлена");
            var isCompletedIndex = csv.GetFieldIndex("Завершенная");
            var priorityIndex = csv.GetFieldIndex("Приоритет");
            var typeIndex = csv.GetFieldIndex("Тип");
            var stateIndex = csv.GetFieldIndex("Состояние");
            var assigneeIndex = csv.GetFieldIndex("Исполнитель");
            var origEstIndex = csv.GetFieldIndex("Original estimation");
            var storyPointsIndex = csv.GetFieldIndex("Story points");
            var sprintsIndex = csv.GetFieldIndex("Sprints");
            var idealDaysIndex = csv.GetFieldIndex("Ideal days");
            var descriptionIndex = csv.GetFieldIndex("Описание");
            var votesIndex = csv.GetFieldIndex("Голоса");

            while (csv.Read())
            {
                var externalId = csv.GetString(idIndex);
                var title = csv.GetString(titleIndex);

                if (string.IsNullOrWhiteSpace(externalId) || string.IsNullOrWhiteSpace(title))
                    continue;

                var task = new SessionTask
                {
                    ExternalId = externalId.Trim(),
                    Title = title.Trim(),
                    Project = csv.GetString(projectIndex)?.Trim(),
                    Tags = csv.GetString(tagsIndex)?.Trim(),
                    Reporter = csv.GetString(reporterIndex)?.Trim(),
                    Type = csv.GetString(typeIndex)?.Trim(),
                    State = csv.GetString(stateIndex)?.Trim(),
                    Assignee = csv.GetString(assigneeIndex)?.Trim(),
                    OriginalEstimation = csv.GetString(origEstIndex)?.Trim(),
                    Sprints = csv.GetString(sprintsIndex)?.Trim(),
                    IdealDays = csv.GetString(idealDaysIndex)?.Trim(),
                    Description = csv.GetString(descriptionIndex)?.Trim(),

                    StoryPoints = ParseNullableInt(csv.GetString(storyPointsIndex)),
                    Votes = ParseNullableInt(csv.GetString(votesIndex)),

                    CreatedAtSource = ParseNullableDate(csv.GetString(createdAtIndex)),
                    UpdatedAtSource = ParseNullableDate(csv.GetString(updatedAtIndex)),

                    IsCompleted = !string.IsNullOrWhiteSpace(csv.GetString(isCompletedIndex)),

                    Priority = ParsePriority(csv.GetString(priorityIndex)),

                    Order = orderCounter++
                };

                tasks.Add(task);
            }

            return tasks;
        }

        private TaskPriority ParsePriority(string? priority)
        {
            if (string.IsNullOrWhiteSpace(priority)) return TaskPriority.Normal;
            return priority.Trim() switch
            {
                "Обычная" => TaskPriority.Normal,
                "Неотложная" => TaskPriority.Urgent,
                "Критическая" => TaskPriority.Critical,
                "Серьезная" => TaskPriority.Major,
                "Незначительная" => TaskPriority.Minor,
                _ => TaskPriority.Normal
            };
        }

        private int? ParseNullableInt(string? value)
        {
            if (int.TryParse(value, out var result)) return result;
            return null;
        }

        private static readonly Dictionary<string, string> MonthMap = new(StringComparer.OrdinalIgnoreCase)
        {
            { "янв.", "01" }, { "февр.", "02" }, { "фев.", "02" },
            { "мар.", "03" }, { "марта", "03" }, { "апр.", "04" },
            { "мая", "05" },  { "май", "05" },   { "июн.", "06" },
            { "июл.", "07" }, { "авг.", "08" },  { "сент.", "09" },
            { "сен.", "09" }, { "окт.", "10" },  { "нояб.", "11" },
            { "ноя.", "11" }, { "дек.", "12" }
        };

        private DateTime? ParseNullableDate(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            var parts = value.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length != 4)
                return null;

            if (!MonthMap.TryGetValue(parts[1], out var monthNumber))
                return null;

            var normalizedDate = $"{parts[0].PadLeft(2, '0')}.{monthNumber}.{parts[2]} {parts[3]}";

            if (DateTime.TryParseExact(
                normalizedDate,
                "dd.MM.yyyy HH:mm",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var result))
            {
                return result;
            }

            return null;
        }

    }
}