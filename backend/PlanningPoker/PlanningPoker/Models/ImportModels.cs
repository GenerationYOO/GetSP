using PlanningPoker.Models;

namespace PlanningPoker.Services;

public class ImportResult
{
    public List<ImportedTaskDto> Tasks { get; set; } = new();
    public List<string> Warnings { get; set; } = new();
}

public class ImportedTaskDto
{
    public string ExternalId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Project { get; set; }
    public List<string> Tags { get; set; } = new();
    public string? Reporter { get; set; }
    public DateTime? CreatedAtSource { get; set; }
    public DateTime? UpdatedAtSource { get; set; }
    public bool IsCompleted { get; set; }
    public TaskPriority Priority { get; set; }
    public string? Type { get; set; }
    public string? State { get; set; }
    public string? Assignee { get; set; }
    public string? OriginalEstimation { get; set; }
    public int? StoryPoints { get; set; }
    public string? Sprints { get; set; }
    public string? IdealDays { get; set; }
    public string? Description { get; set; }
    public int? Votes { get; set; }
    public int Order { get; set; }
}

public class FileValidationException : Exception
{
    public FileValidationException(string message) : base(message) { }
}
