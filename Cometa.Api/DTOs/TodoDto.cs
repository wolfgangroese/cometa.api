namespace Cometa.Api.DTOs;

public class TodoDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public List<string?> Skills { get; set; } = new(); // Nur Skill-Namen
}