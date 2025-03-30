using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cometa.Api.DTOs;
using Cometa.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace Cometa.Api.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly CometaDbContext _context;

    public TasksController(CometaDbContext context)
    {
        _context = context;
    }

    [HttpGet(Name = "Tasks")]
    [Authorize(Roles = "Admin,Staff,Performer")]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
    {
        var tasks = await _context.Tasks
            .Include(t => t.TaskSkills)
            .ThenInclude(ts => ts.Skill)
            .Include(t => t.Assignee)
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
            Status = task.TaskStatus,
            AssigneeId = task.AssigneeId,
            AssigneeName = task.Assignee?.UserName
        });

        return Ok(taskDtos);
    }

    [HttpGet("{id}", Name = "GetTaskById")]
    [Authorize(Roles = "Admin,Staff,Performer")]
    public async Task<ActionResult<TaskDto>> GetTaskById(Guid id)
    {
        var task = await _context.Tasks
            .Include(t => t.TaskSkills)
            .ThenInclude(ts => ts.Skill)
            .Include(t => t.Assignee)
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
            Status = task.TaskStatus,
            AssigneeId = task.AssigneeId,
            AssigneeName = task.Assignee?.UserName
        };

        return Ok(taskDto);
    }

    [HttpPost(Name = "CreateTask")]
   // [Authorize(Roles = "Admin,Staff")]
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
            TaskSkills = new List<TaskSkill>(),
            AssigneeId = newTaskDto.AssigneeId
        };

        var existingSkills = await _context.Skills
            .Where(s => newTaskDto.Skills.Contains(s.Name ?? string.Empty))
            .ToListAsync();

        foreach (var skillName in newTaskDto.Skills)
        {
            var skill = existingSkills.FirstOrDefault(s => s.Name == skillName) ?? new Skill { Name = skillName };
            newTask.TaskSkills.Add(new TaskSkill { Task = newTask, Skill = skill });
        }

        _context.Tasks.Add(newTask);
        await _context.SaveChangesAsync();

        newTaskDto.Id = newTask.Id;

        // If task is created as already completed, update rewards
        if (newTask.IsCompleted == true && newTask.AssigneeId.HasValue)
        {
            try
            {
                var rewardService = HttpContext.RequestServices.GetRequiredService<RewardService>();
                await rewardService.UpdateUserRewardsAsync(newTask.AssigneeId.Value);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating rewards on task creation: {ex.Message}");
            }
        }

        return CreatedAtRoute("GetTaskById", new { id = newTask.Id }, newTaskDto);
    }

    [HttpPut("{id}", Name = "UpdateTask")]
    [Authorize(Roles = "Admin,Staff")]
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

        // Get the completion status BEFORE updating
        bool wasCompletedBefore = existingTask.IsCompleted ?? false;
        
        // Ensure DateTime values are converted to UTC
        DateTime? ConvertToUtc(DateTime? date) =>
            date.HasValue && date.Value.Kind == DateTimeKind.Unspecified 
                ? DateTime.SpecifyKind(date.Value, DateTimeKind.Utc) 
                : date;

        _context.TaskSkills.RemoveRange(existingTask.TaskSkills);
        existingTask.TaskSkills.Clear();

        existingTask.TaskStatus = updatedTaskDto.Status;
        existingTask.Name = updatedTaskDto.Name;
        existingTask.Description = updatedTaskDto.Description;
        existingTask.StartDate = ConvertToUtc(updatedTaskDto.StartDate);
        existingTask.DueDate = ConvertToUtc(updatedTaskDto.DueDate);
        existingTask.IsCompleted = updatedTaskDto.IsCompleted;
        existingTask.Rewards = updatedTaskDto.Rewards;
        existingTask.TaskSkills = new List<TaskSkill>();
        existingTask.AssigneeId = updatedTaskDto.AssigneeId;

        var updatedSkills = await _context.Skills
            .Where(s => updatedTaskDto.Skills.Contains(s.Name ?? string.Empty))
            .ToListAsync();

        foreach (var skillName in updatedTaskDto.Skills)
        {
            var skill = updatedSkills.FirstOrDefault(s => s.Name == skillName) ?? new Skill { Name = skillName };
            existingTask.TaskSkills.Add(new TaskSkill { Task = existingTask, Skill = skill });
        }

        await _context.SaveChangesAsync();
        
        // Check if the task was just completed
        if (!wasCompletedBefore && existingTask.IsCompleted == true && existingTask.AssigneeId.HasValue)
        {
            Console.WriteLine($"Task {id} completed by user {existingTask.AssigneeId}. Updating rewards...");
            try 
            {
                var rewardService = HttpContext.RequestServices.GetRequiredService<RewardService>();
                var newRewards = await rewardService.UpdateUserRewardsAsync(existingTask.AssigneeId.Value);
                Console.WriteLine($"Updated rewards: {newRewards}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating rewards: {ex.Message}");
            }
        }

        return Ok(new { message = "Task updated successfully." });
    }

    // Special endpoint for Performers to only update task status
    [HttpPatch("{id}/status", Name = "UpdateTaskStatus")]
    [Authorize(Roles = "Admin,Staff,Performer")]
    public async Task<IActionResult> UpdateTaskStatus(Guid id, [FromBody] TaskStatusUpdateDto statusUpdate)
    {
        if (id == Guid.Empty || statusUpdate == null)
        {
            return BadRequest("Invalid request.");
        }

        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound(new { message = $"Task with ID {id} not found." });
        }

        // Update only the status field
        task.TaskStatus = statusUpdate.Status;
        
        // If task is being marked as completed, update the IsCompleted flag too
        if (statusUpdate.Status == Cometa.Persistence.Enums.TaskStatus.Done)
        {
            bool wasCompletedBefore = task.IsCompleted ?? false;
            task.IsCompleted = true;
            
            // If the task was just completed and has an assignee, update rewards
            if (!wasCompletedBefore && task.AssigneeId.HasValue)
            {
                try
                {
                    var rewardService = HttpContext.RequestServices.GetRequiredService<RewardService>();
                    await rewardService.UpdateUserRewardsAsync(task.AssigneeId.Value);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error updating rewards: {ex.Message}");
                }
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Task status updated successfully." });
    }

    [HttpDelete("{id}", Name = "DeleteTask")]
    [Authorize(Roles = "Admin,Staff")]
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

        // If a completed task is deleted, we should update the user's rewards
        if (task.IsCompleted == true && task.AssigneeId.HasValue)
        {
            try
            {
                var rewardService = HttpContext.RequestServices.GetRequiredService<RewardService>();
                await rewardService.UpdateUserRewardsAsync(task.AssigneeId.Value);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating rewards after task deletion: {ex.Message}");
            }
        }

        return Ok(new { message = "Task deleted successfully." });
    }

    [HttpGet("test-rewards/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> TestRewards(Guid userId)
    {
        try
        {
            var rewardService = HttpContext.RequestServices.GetRequiredService<RewardService>();
            var rewards = await rewardService.UpdateUserRewardsAsync(userId);
            return Ok(new { rewards });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    
    [HttpGet("debug-roles")]
    [AllowAnonymous] // Allow without auth to debug
    public IActionResult DebugRoles()
    {
        var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
        var username = User.Identity?.Name;
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    
        var allClaims = User.Claims.Select(c => new { Type = c.Type, Value = c.Value }).ToList();
    
        var isInAdminRole = User.IsInRole("Admin");
        var isInStaffRole = User.IsInRole("Staff");
        var isInPerformerRole = User.IsInRole("Performer");
    
        return Ok(new
        {
            IsAuthenticated = isAuthenticated,
            Username = username,
            UserId = userId,
            Claims = allClaims,
            Roles = new
            {
                IsAdmin = isInAdminRole,
                IsStaff = isInStaffRole,
                IsPerformer = isInPerformerRole
            }
        });
    }
    
    [HttpGet("auth-test")]
    [AllowAnonymous] // No authorization required for this test endpoint
    public IActionResult AuthTest()
    {
        // Get the Authorization header
        var authHeader = Request.Headers.Authorization.ToString();
    
        // Try to parse the JWT token
        var token = authHeader.Replace("Bearer ", "");
        var tokenHandler = new JwtSecurityTokenHandler();
    
        try {
            // Just read the token to see what's in it (no validation)
            var jwtToken = tokenHandler.ReadJwtToken(token);
        
            // Get all claims
            var claims = jwtToken.Claims.Select(c => new { c.Type, c.Value }).ToList();
        
            // Get role claims specifically
            var roleClaims = jwtToken.Claims
                .Where(c => c.Type == ClaimTypes.Role || 
                            c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" ||
                            c.Type == "role")
                .Select(c => c.Value)
                .ToList();
            
            return Ok(new { 
                Message = "Token parsed successfully",
                IsAuthenticated = User.Identity?.IsAuthenticated ?? false,
                UserName = User.Identity?.Name,
                Claims = claims,
                RoleClaims = roleClaims,
                Roles = new {
                    IsAdmin = User.IsInRole("Admin"),
                    IsStaff = User.IsInRole("Staff"),
                    IsPerformer = User.IsInRole("Performer")
                }
            });
        }
        catch (Exception ex) {
            return BadRequest(new { Error = ex.Message });
        }
    }
}