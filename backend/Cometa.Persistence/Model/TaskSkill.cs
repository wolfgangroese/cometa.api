using System;
using Cometa.Persistence.Model; // ✅ Stellt sicher, dass `TaskEntity` gefunden wird

namespace Cometa.Persistence.Model;

// Diese Klasse repräsentiert die Many-to-Many-Zwischentabelle zwischen Tasks und Skills
public class TaskSkill
{
    public Guid TaskId { get; set; }
    public TaskEntity Task { get; set; } = null!; // ✅ Stellt sicher, dass `TaskEntity` existiert

    public Guid SkillId { get; set; }
    public Skill Skill { get; set; } = null!; // ✅ Stellt sicher, dass `Skill` existiert
}