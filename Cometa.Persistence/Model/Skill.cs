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

    public ICollection<Todo> Todos { get; set; } = new List<Todo>();

    public void AddTodo(Todo todo)
    {
        Todos.Add(todo);
    }

    public void RemoveTodo(Todo todo)
    {
        Todos.Remove(todo);
    }
}
