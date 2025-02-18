using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cometa.Api.DTOs;

// Alias für die eigene Task-Klasse, um Konflikte mit System.Threading.Tasks.Task zu vermeiden
using TaskEntity = Cometa.Persistence.Model.Task;

namespace Cometa.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class Tasks : ControllerBase
{
    private readonly CometaDbContext _context;

    public Tasks(CometaDbContext context)
    {
        _context = context;
    }

    [HttpGet(Name = "Tasks")]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
    {
        var tasks = await _context.Task
            .Include(t => t.Skills)
            .ToListAsync();

        var taskDtos = tasks.Select(task => new TaskDto
        {
            Id = task.Id,
            Name = task.Name,
            Description = task.Description,
            StartDate = task.StartDate,
            DueDate = task.DueDate,
            Skills = task.Skills.Select(s => s.Name).Where(s => s != null).Cast<string>().ToList(),
            IsCompleted = task.IsCompleted ?? false,
            Rewards = task.Rewards ?? 0
        });

        return Ok(taskDtos);
    }

    [HttpGet("{id}", Name = "GetTaskById")]
    public async Task<ActionResult<TaskDto>> GetTaskById(Guid id)
    {
        var task = await _context.Task
            .Include(t => t.Skills)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        var taskDto = new TaskDto
        {
            Id = task.Id,
            Name = task.Name,
            Description = task.Description,
            StartDate = task.StartDate,
            DueDate = task.DueDate,
            Skills = task.Skills.Select(s => s.Name).Where(s => s != null).Cast<string>().ToList(),
            IsCompleted = task.IsCompleted ?? false,
            Rewards = task.Rewards ?? 0
        };

        return Ok(taskDto);
    }

    [HttpPost(Name = "CreateTask")]
    public async Task<ActionResult<TaskDto>> CreateTask([FromBody] TaskDto newTaskDto)
    {
        if (string.IsNullOrEmpty(newTaskDto.Name))
        {
            return BadRequest("Name is required");
        }


        // Hier wird TaskEntity anstelle von Task verwendet
        var newTask = new TaskEntity
        {
            Name = newTaskDto.Name,
            Description = newTaskDto.Description,
            StartDate = newTaskDto.StartDate,
            DueDate = newTaskDto.DueDate,
            IsCompleted = newTaskDto.IsCompleted,
            Skills = newTaskDto.Skills.Select(skillName => new Skill { Name = skillName }).ToList(),
            Rewards = newTaskDto.Rewards
        };

        _context.Task.Add(newTask);
        await _context.SaveChangesAsync();

        newTaskDto.Id = newTask.Id; 

        return CreatedAtRoute("GetTaskById", new { id = newTask.Id }, newTaskDto);
    }

    [HttpPut("{id}", Name = "UpdateTask")]
    public async Task<IActionResult> UpdateTask(Guid id, [FromBody] TaskDto updatedTaskDto)
    {
        if (id == Guid.Empty)
        {
            return BadRequest("Invalid ID.");
        }


        var existingTask = await _context.Task
            .Include(t => t.Skills)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (existingTask == null)
        {
            return NotFound(new { message = $"Task with ID {id} not found." });
        }

        Console.WriteLine($"🔄 UpdateTask: isCompleted = {updatedTaskDto.IsCompleted}");

        // Aktualisieren der Felder
        existingTask.Name = updatedTaskDto.Name;
        existingTask.Description = updatedTaskDto.Description;
        existingTask.StartDate = updatedTaskDto.StartDate;
        existingTask.DueDate = updatedTaskDto.DueDate;
        existingTask.IsCompleted = updatedTaskDto.IsCompleted;
        existingTask.Rewards = updatedTaskDto.Rewards;

        // Skills aktualisieren
        existingTask.Skills.Clear(); // Alte Skills entfernen
        foreach (var skillName in updatedTaskDto.Skills)
        {
            existingTask.Skills.Add(new Skill { Name = skillName });
        }


        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = "Task updated successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the task.", details = ex.Message });
        }
    }

    [HttpDelete("{id}", Name = "DeleteTask")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var task = await _context.Task.FindAsync(id);
        if (task == null)
        {
            return NotFound(new { message = $"Task with ID {id} not found." });
        }

        _context.Task.Remove(task);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Task with ID {id} deleted successfully." });
    }
}
