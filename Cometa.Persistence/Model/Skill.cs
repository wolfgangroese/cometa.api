using System.ComponentModel.DataAnnotations;
using Cometa.Persistence.Enums;

namespace Cometa.Persistence.Model;

public class Skill : BaseEntity
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public Prevalence Prevalence { get; set; } = Prevalence.None; // Standardwert

    // ❌ Entfernt: Direkte Many-to-Many Beziehung zu TaskEntity
    // public ICollection<TaskEntity> Tasks { get; set; } = new List<TaskEntity>();

    // ✅ Korrekt: Beziehung über TaskSkill
    public ICollection<TaskSkill> TaskSkills { get; set; } = new List<TaskSkill>();

    public void AddTask(TaskEntity taskEntity)
    {
        TaskSkills.Add(new TaskSkill { Task = taskEntity, Skill = this });
    }

    public void RemoveTask(TaskEntity taskEntity)
    {
        var taskSkill = TaskSkills.FirstOrDefault(ts => ts.Task == taskEntity);
        if (taskSkill != null)
        {
            TaskSkills.Remove(taskSkill);
        }
    }
}