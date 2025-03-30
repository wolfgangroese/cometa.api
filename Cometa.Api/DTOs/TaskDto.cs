using Cometa.Persistence.Enums;
using TaskStatus = Cometa.Persistence.Enums.TaskStatus;

namespace Cometa.Api.DTOs;

public class TaskDto
{
    public Guid Id { get; set; } 
    public required string Name { get; set; } 
    public string? Description { get; set; } 
    public DateTime? StartDate { get; set; } 
    public DateTime? DueDate { get; set; }  
    public List<string> Skills { get; set; } = new(); 
    public List<string> SkillNames { get; set; } = new(); 
    public bool IsCompleted { get; set; } 
    public int Rewards { get; set; } 
    public TaskStatus Status { get; set; } = TaskStatus.Waiting;
    public CreationStatus CreationStatus { get; set; } = CreationStatus.Draft;
    public Guid? AssigneeId { get; set; }
    public string? AssigneeName { get; set; }

}