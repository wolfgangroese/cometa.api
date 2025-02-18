using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cometa.Api.DTOs;

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
        var tasks = await _context.Tasks
            .Include(t => t.TaskSkills)
            .ThenInclude(ts => ts.Skill)
            .ToListAsync();

        var taskDtos = tasks.Select(task => new TaskDto
        {
            Id = task.Id,
            Name = task.Name,
            Description = task.Description,
            StartDate = task.StartDate,
            DueDate = task.DueDate,
            Skills = task.TaskSkills
                .Select(ts => ts.Skill.Name ?? string.Empty)
                .ToList(),
            IsCompleted = task.IsCompleted ?? false,
            Rewards = task.Rewards ?? 0,
            Status = task.TaskStatus
        });

        return Ok(taskDtos);
    }

    [HttpGet("{id}", Name = "GetTaskById")]
    public async Task<ActionResult<TaskDto>> GetTaskById(Guid id)
    {
        var task = await _context.Tasks
            .Include(t => t.TaskSkills)
            .ThenInclude(ts => ts.Skill)
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
            Skills = task.TaskSkills
                .Select(ts => ts.Skill.Name ?? string.Empty)
                .ToList(),
            IsCompleted = task.IsCompleted ?? false,
            Rewards = task.Rewards ?? 0,
            Status = task.TaskStatus
        };

        return Ok(taskDto);
    }

    
    [HttpPost(Name = "CreateTask")]
    public async Task<ActionResult<TaskDto>> CreateTask([FromBody] TaskDto newTaskDto)
    {
        if (newTaskDto == null || string.IsNullOrEmpty(newTaskDto.Name))
        {
            return BadRequest("Invalid Task object.");
        }

        var newTask = new TaskEntity
        {
            Name = newTaskDto.Name,
            Description = newTaskDto.Description,
            StartDate = newTaskDto.StartDate,
            DueDate = newTaskDto.DueDate,
            IsCompleted = newTaskDto.IsCompleted,
            Rewards = newTaskDto.Rewards,
            TaskStatus = newTaskDto.Status,
            TaskSkills = new List<TaskSkill>()
        };

        var existingSkills = await _context.Skills
            .Where(s => newTaskDto.Skills.Contains(s.Name))
            .ToListAsync();

        foreach (var skillName in newTaskDto.Skills)
        {
            var skill = existingSkills.FirstOrDefault(s => s.Name == skillName) ?? new Skill { Name = skillName };
            newTask.TaskSkills.Add(new TaskSkill { Task = newTask, Skill = skill });
        }

        _context.Tasks.Add(newTask);
        await _context.SaveChangesAsync();

        newTaskDto.Id = newTask.Id;

        return CreatedAtRoute("GetTaskById", new { id = newTask.Id }, newTaskDto);
    }

    [HttpPut("{id}", Name = "UpdateTask")]
    public async Task<IActionResult> UpdateTask(Guid id, [FromBody] TaskDto updatedTaskDto)
    {
        if (updatedTaskDto == null || id == Guid.Empty)
        {
            return BadRequest("Invalid request.");
        }

        var existingTask = await _context.Tasks
            .Include(t => t.TaskSkills)
            .ThenInclude(ts => ts.Skill)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (existingTask == null)
        {
            return NotFound(new { message = $"Task with ID {id} not found." });
        }

        _context.TaskSkills.RemoveRange(existingTask.TaskSkills);
        existingTask.TaskSkills.Clear();
        existingTask.TaskStatus = updatedTaskDto.Status;
        existingTask.Name = updatedTaskDto.Name;
        existingTask.Description = updatedTaskDto.Description;
        existingTask.StartDate = updatedTaskDto.StartDate;
        existingTask.DueDate = updatedTaskDto.DueDate;
        existingTask.IsCompleted = updatedTaskDto.IsCompleted;
        existingTask.Rewards = updatedTaskDto.Rewards;
        existingTask.TaskSkills = new List<TaskSkill>();


        var updatedSkills = await _context.Skills
            .Where(s => updatedTaskDto.Skills.Contains(s.Name))
            .ToListAsync();

        foreach (var skillName in updatedTaskDto.Skills)
        {
            var skill = updatedSkills.FirstOrDefault(s => s.Name == skillName) ?? new Skill { Name = skillName };
            existingTask.TaskSkills.Add(new TaskSkill { Task = existingTask, Skill = skill });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Task updated successfully." });
    }

    [HttpDelete("{id}", Name = "DeleteTask")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest("Invalid task ID.");
        }

        var task = await _context.Tasks
            .Include(t => t.TaskSkills)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound(new { message = $"Task with ID {id} not found." });
        }

        _context.TaskSkills.RemoveRange(task.TaskSkills);
        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Task deleted successfully." });
    }
}
