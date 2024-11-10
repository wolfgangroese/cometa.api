using System.ComponentModel.DataAnnotations;
using Cometa.Persistence.Enums;

namespace Cometa.Persistence.Model;

public class Todo : BaseEntity
{
    [Required]
    [MaxLength(120)]
    public string? Name { get; init; }
    
    [MaxLength(500)]
    public string? Description { get; init; }

    public TodoStatus TodoStatus { get; init; } = TodoStatus.Waiting;
    public Priority Priority { get; init; } = Priority.Medium;
    public Complexity Complexity { get; init; } = Complexity.Medium;
    public ICollection<Skill> Skills { get; init; } = new List<Skill>();
    public int Rewards { get; init; }
    public int EstimatedTime { get; init; }
    public int SpentTime { get; init; }
    public DateTime? DueDate { get; init; } = DateTime.Now.AddDays(5);
    public DateTime? StartDate { get; init; } = DateTime.Now;
    public DateTime? EndDate { get; init; }
    public DateTime? CompletedDate { get; init; }
    public DateTime? EarliestStartDate { get; init; }
    public Todo? ParentTodo { get; init; }
    public Guid? ParentTodoId { get; init; }
    public Todo? ChildTodo { get; init; }
    public Guid? ChildTodoId { get; init; }
    public Todo? NextTodo { get; init; }
    public Guid? NextTodoId { get; init; }
    public Todo? PreviousTodo { get; init; }
    public Guid? PreviousTodoId { get; init; }
    
    [MaxLength(500)]
    public string? Notes { get; init; }
    
    public CreationStatus CreationStatus { get; init; } = CreationStatus.Draft;
    
    public Todo()
    {
        EndDate = DueDate?.AddDays(-1);
    }   
    public void AddSkill(Skill skill)
    {
        Skills.Add(skill);
    }

    public void RemoveSkill(Skill skill)
    {
        Skills.Remove(skill);
    }
}