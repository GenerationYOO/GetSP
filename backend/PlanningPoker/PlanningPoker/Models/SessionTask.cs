namespace PlanningPoker.Models
{
    public class SessionTask
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SessionId { get; set; }
        public Session Session { get; set; } = null!;
        public string ExternalId { get; set; } = string.Empty; 
        public string Title { get; set; } = string.Empty;      
        public string? Project { get; set; }           
        public string? Tags { get; set; }             
        public string? Assignee { get; set; }          
        public string? Reporter { get; set; }          
        public string? Type { get; set; }            
        public string? State { get; set; }             
        public string? Sprints { get; set; }         
        public string? Description { get; set; }    
        public string? OriginalEstimation { get; set; }
        public string? IdealDays { get; set; }         
        public TaskPriority Priority { get; set; } = TaskPriority.Normal; 
        public int? StoryPoints { get; set; }          
        public int? Votes { get; set; }                
        public DateTime? CreatedAtSource { get; set; } 
        public DateTime? UpdatedAtSource { get; set; } 
        public bool IsCompleted { get; set; }          
        public int Order { get; set; }                 
        public int? FinalStoryPoints { get; set; }     
    }
}