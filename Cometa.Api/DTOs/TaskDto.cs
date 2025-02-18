namespace Cometa.Api.DTOs;

public class TaskDto
{
    public Guid Id { get; set; } // Eindeutige ID, Non-Nullable
    public required string Name { get; set; } // Name ist erforderlich
    public string? Description { get; set; } // Optionale Beschreibung
    public DateTime? StartDate { get; set; } // Optionales Startdatum
    public DateTime? DueDate { get; set; }  // Optionales Fälligkeitsdatum
    public List<string> Skills { get; set; } = new(); // Keine nullable Items in der Liste
    public bool IsCompleted { get; set; } // Standardmäßig false
    public int Rewards { get; set; } // Anzahl der Belohnungen
}