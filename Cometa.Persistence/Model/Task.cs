using System.ComponentModel.DataAnnotations;
using Cometa.Persistence.Enums;
using TaskStatus = Cometa.Persistence.Enums.TaskStatus;

namespace Cometa.Persistence.Model;

public class Task : BaseEntity
{
    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    public TaskStatus TaskStatus { get; set; } = TaskStatus.Waiting;
    public int? Priority { get; set; } 
    public int? Complexity { get; set; } 
    public ICollection<Skill> Skills { get; set; } = new List<Skill>();
    
    [Range(0, int.MaxValue)]
    public int? Rewards { get; set; }

    [Range(0, int.MaxValue)]
    public int? EstimatedTime { get; set; }

    [Range(0, int.MaxValue)]
    public int? SpentTime { get; set; }

    public DateTime? DueDate { get; set; }
    public DateTime? StartDate { get; set; } 
    public DateTime? EndDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public DateTime? EarliestStartDate { get; set; }
    
    public Guid? ParentTaskId { get; set; }
    public Task? ParentTask { get; set; } // Navigations-Property

    public Guid? ChildTaskId { get; set; }
    public Task? ChildTask { get; set; } // Navigations-Property

    public Guid? NextTaskId { get; set; }
    public Task? NextTask { get; set; } // Navigations-Property

    public Guid? PreviousTaskId { get; set; }
    public Task? PreviousTask { get; set; } // Navigations-Property
    
    [MaxLength(500)]
    public string? Notes { get; set; }
    
    public CreationStatus CreationStatus { get; set; } = CreationStatus.Draft;

    public bool? IsCompleted { get; set; } = false;
    
    public void AddSkill(Skill skill)
    {
        Skills.Add(skill);
    }

    public void RemoveSkill(Skill skill)
    {
        Skills.Remove(skill);
    }
}
