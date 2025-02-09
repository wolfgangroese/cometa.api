using System.ComponentModel.DataAnnotations;
using Cometa.Persistence.Enums;

namespace Cometa.Persistence.Model;

public class Todo : BaseEntity
{
    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    public TodoStatus TodoStatus { get; set; } = TodoStatus.Waiting;
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
    
    public Guid? ParentTodoId { get; set; }
    public Todo? ParentTodo { get; set; } // Navigations-Property

    public Guid? ChildTodoId { get; set; }
    public Todo? ChildTodo { get; set; } // Navigations-Property

    public Guid? NextTodoId { get; set; }
    public Todo? NextTodo { get; set; } // Navigations-Property

    public Guid? PreviousTodoId { get; set; }
    public Todo? PreviousTodo { get; set; } // Navigations-Property
    
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
