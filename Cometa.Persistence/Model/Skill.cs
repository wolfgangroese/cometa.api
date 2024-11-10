using System.ComponentModel.DataAnnotations;
using Cometa.Persistence.Enums;

namespace Cometa.Persistence.Model;

public class Skill : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string? Name { get; init; }
    
    [MaxLength(500)]
    public string? Description { get; init; }
    
    public Prevalence Prevalence { get; init; }

    public ICollection<Todo> Todos { get; init; } = new List<Todo>();
    public void AddTodo(Todo todo)
    {
        Todos.Add(todo);
    }

    public void RemoveTodo(Todo todo)
    {
        Todos.Remove(todo);
    }
}