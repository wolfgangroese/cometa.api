namespace Cometa.Api.DTOs;

public class SkillDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Prevalence { get; set; } = -1; // Default to None (-1)
}