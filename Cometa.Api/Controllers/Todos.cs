using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cometa.Api.DTOs;

namespace Cometa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class Todos : ControllerBase
{
    private readonly CometaDbContext _context;

    public Todos(CometaDbContext context)
    {
        _context = context;
    }

    [HttpGet(Name = "Todos")]
    public async Task<ActionResult<IEnumerable<TodoDto>>> GetTodos()
    {
        var todos = await _context.Todos
            .Include(t => t.Skills)
            .ToListAsync();

        var todoDtos = todos.Select(todo => new TodoDto
        {
            Id = todo.Id,
            Name = todo.Name,
            Description = todo.Description,
            StartDate = todo.StartDate,
            DueDate = todo.DueDate,
            Skills = todo.Skills?.Select(s => s.Name ?? string.Empty).ToList() ?? new List<string>(), 
            IsCompleted = todo.IsCompleted ?? false,
            Rewards = todo.Rewards ?? 0,
            Status = todo.TodoStatus

        });

        return Ok(todoDtos);
    }

    [HttpGet("{id}", Name = "GetTodoById")]
    public async Task<ActionResult<TodoDto>> GetTodoById(Guid id)
    {
        var todo = await _context.Todos
            .Include(t => t.Skills)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (todo == null)
        {
            return NotFound();
        }

        var todoDto = new TodoDto
        {
            Id = todo.Id,
            Name = todo.Name,
            Description = todo.Description,
            StartDate = todo.StartDate,
            DueDate = todo.DueDate,
            Skills = todo.Skills?.Select(s => s.Name ?? string.Empty).ToList() ?? new List<string>(), 
            IsCompleted = todo.IsCompleted ?? false,
            Rewards = todo.Rewards ?? 0,
            Status = todo.TodoStatus
            
        };

        return Ok(todoDto);
    }

    [HttpPost(Name = "CreateTodo")]
    public async Task<ActionResult<TodoDto>> CreateTodo([FromBody] TodoDto newTodoDto)
    {
        if (newTodoDto == null || string.IsNullOrEmpty(newTodoDto.Name))
        {
            return BadRequest("Invalid Todo object.");
        }

        var newTodo = new Todo
        {
            Name = newTodoDto.Name,
            Description = newTodoDto.Description,
            StartDate = newTodoDto.StartDate,
            DueDate = newTodoDto.DueDate,
            IsCompleted = newTodoDto.IsCompleted,
            Skills = newTodoDto.Skills.Select(skillName => new Skill { Name = skillName }).ToList(),
            Rewards = newTodoDto.Rewards,
            TodoStatus = newTodoDto.Status
        };

        _context.Todos.Add(newTodo);
        await _context.SaveChangesAsync();

        newTodoDto.Id = newTodo.Id; // ID vom gespeicherten Todo setzen

        return CreatedAtRoute("GetTodoById", new { id = newTodo.Id }, newTodoDto);
    }

    [HttpPut("{id}", Name = "UpdateTodo")]
    public async Task<IActionResult> UpdateTodo(Guid id, [FromBody] TodoDto updatedTodoDto)
    {
        if (updatedTodoDto == null || id == Guid.Empty)
        {
            return BadRequest("Invalid request.");
        }

        var existingTodo = await _context.Todos
            .Include(t => t.Skills)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (existingTodo == null)
        {
            return NotFound(new { message = $"Todo with ID {id} not found." });
        }

        Console.WriteLine($"🔄 UpdateTodo: isCompleted = {updatedTodoDto.IsCompleted}");

        
        // Aktualisieren der Felder
        existingTodo.Name = updatedTodoDto.Name;
        existingTodo.Description = updatedTodoDto.Description;
        existingTodo.StartDate = updatedTodoDto.StartDate;
        existingTodo.DueDate = updatedTodoDto.DueDate;
        existingTodo.IsCompleted = updatedTodoDto.IsCompleted;
        existingTodo.Rewards = updatedTodoDto.Rewards;
        existingTodo.TodoStatus = updatedTodoDto.Status;

        // Skills aktualisieren
        if (updatedTodoDto.Skills != null)
        {
            existingTodo.Skills.Clear(); // Alte Skills entfernen
            foreach (var skillName in updatedTodoDto.Skills)
            {
                existingTodo.Skills.Add(new Skill { Name = skillName });
            }
        }

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = "Todo updated successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the Todo.", details = ex.Message });
        }
    }

    [HttpDelete("{id}", Name = "DeleteTodo")]
    public async Task<IActionResult> DeleteTodo(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
        {
            return NotFound(new { message = $"Todo with ID {id} not found." });
        }

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Todo with ID {id} deleted successfully." });
    }
}
