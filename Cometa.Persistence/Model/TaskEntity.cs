using System.ComponentModel.DataAnnotations;
using Cometa.Persistence.Enums;
using TaskStatus = Cometa.Persistence.Enums.TaskStatus;

namespace Cometa.Persistence.Model;

public class TaskEntity : BaseEntity
{
    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    public TaskStatus TaskStatus { get; set; } = TaskStatus.Waiting;
    public int? Priority { get; set; } 
    public int? Complexity { get; set; } 

    // ❌ Entfernen: Many-to-Many über direkte Skills-Verknüpfung
    // public ICollection<Skill> Skills { get; set; } = new List<Skill>();

    // ✅ Hinzufügen: Verknüpfung über `TaskSkill`
    public ICollection<TaskSkill> TaskSkills { get; set; } = new List<TaskSkill>();

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
    public TaskEntity? ParentTask { get; set; } // Navigations-Property

    public Guid? ChildTaskId { get; set; }
    public TaskEntity? ChildTask { get; set; } // Navigations-Property

    public Guid? NextTaskId { get; set; }
    public TaskEntity? NextTask { get; set; } // Navigations-Property

    public Guid? PreviousTaskId { get; set; }
    public TaskEntity? PreviousTask { get; set; } // Navigations-Property
    
    [MaxLength(500)]
    public string? Notes { get; set; }
    
    public CreationStatus CreationStatus { get; set; } = CreationStatus.Draft;

    public bool? IsCompleted { get; set; } = false;
    
    public void AddSkill(Skill skill)
    {
        // ❌ Entfernen: Direkte Manipulation der Skills-Liste
        // Skills.Add(skill);

        // ✅ Stattdessen `TaskSkill`-Verknüpfung hinzufügen
        TaskSkills.Add(new TaskSkill { Task = this, Skill = skill });
    }

    public void RemoveSkill(Skill skill)
    {
        // ❌ Entfernen: Direkte Manipulation der Skills-Liste
        // Skills.Remove(skill);

        // ✅ Stattdessen `TaskSkill`-Eintrag entfernen
        var taskSkill = TaskSkills.FirstOrDefault(ts => ts.Skill == skill);
        if (taskSkill != null)
        {
            TaskSkills.Remove(taskSkill);
        }
    }
}
