using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cometa.Api.DTOs;
using Cometa.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Cometa.Persistence.Enums;
using Microsoft.AspNetCore.Identity;

namespace Cometa.Api.Controllers;

[ApiController]
[Route("api/tasks")]
//[Authorize]
public class TasksController : ControllerBase
{
    private readonly CometaDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;


    public TasksController(CometaDbContext context,  UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet(Name = "Tasks")]
    [Authorize(Roles = "Admin,Staff,Performer")]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
    {
        // Aktuelle Organisation des Benutzers ermitteln
        var user = await _userManager.GetUserAsync(User);
        if (user?.CurrentOrganizationId == null)
        {
            return BadRequest("Keine aktive Organisation ausgewählt");
        }

        // Nur Tasks der aktuellen Organisation zurückgeben
        var orgTasks = await _context.Tasks
            .Where(t => t.OrganizationId == user.CurrentOrganizationId)
            .Include(t => t.TaskSkills)
            .ThenInclude(ts => ts.Skill)
            .Include(t => t.Assignee)
            .ToListAsync();

        var taskDtos = orgTasks.Select(task => new TaskDto
        {
            Id = task.Id,
            Name = task.Name,
            Description = task.Description,
            StartDate = task.StartDate,
            DueDate = task.DueDate,
            Skills = task.TaskSkills.Select(ts => ts.Skill!.Name ?? string.Empty).ToList(),
            SkillNames = task.TaskSkills.Select(ts => ts.Skill!.Name ?? string.Empty).ToList(),
            IsCompleted = task.IsCompleted ?? false,
            Rewards = task.Rewards ?? 0,
            Status = task.TaskStatus,
            AssigneeId = task.AssigneeId,
            AssigneeName = task.Assignee?.UserName,
            EffortMin = task.EffortMin,
            EffortMax = task.EffortMax
        });

        return Ok(taskDtos);
    }
    private async Task<List<TaskSkill>> MapSkillNamesToTaskSkills(List<string> skillNames, TaskEntity task)
    {
        var normalizedNames = skillNames
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Select(name => name.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var existingSkills = await _context.Skills
            .Where(s => normalizedNames.Contains(s.Name!))
            .ToListAsync();

        var taskSkills = new List<TaskSkill>();

        foreach (var name in normalizedNames)
        {
            var skill = existingSkills.FirstOrDefault(s => s.Name!.Equals(name, StringComparison.OrdinalIgnoreCase));
            if (skill == null)
            {
                skill = new Skill { Name = name };
                _context.Skills.Add(skill);
            }

            taskSkills.Add(new TaskSkill { Skill = skill, Task = task });
        }

        return taskSkills;
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
            AssigneeName = task.Assignee?.UserName,
            EffortMin = task.EffortMin,
            EffortMax = task.EffortMax
        };

        return Ok(taskDto);
    }

    [HttpPost(Name = "CreateTask")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<ActionResult<TaskDto>> CreateTask([FromBody] TaskDto newTaskDto)
    {
        if (newTaskDto == null || string.IsNullOrEmpty(newTaskDto.Name))
        {
            return BadRequest("Invalid Task object.");
        }
        
        if (newTaskDto.EffortMin.HasValue && newTaskDto.EffortMax.HasValue && newTaskDto.EffortMin > newTaskDto.EffortMax)
        {
            return BadRequest("Minimum effort cannot be greater than maximum effort.");
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
            CreationStatus = CreationStatus.Draft, 
            TaskSkills = new List<TaskSkill>(),
            AssigneeId = newTaskDto.AssigneeId,
            EffortMin = newTaskDto.EffortMin,
            EffortMax = newTaskDto.EffortMax
        };

        // 🆕 Skills werden via SkillNames gesucht oder angelegt
        var taskSkills = await MapSkillNamesToTaskSkills(newTaskDto.SkillNames, newTask);
        newTask.TaskSkills = taskSkills;

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
    
    if (updatedTaskDto.EffortMin.HasValue && updatedTaskDto.EffortMax.HasValue && updatedTaskDto.EffortMin > updatedTaskDto.EffortMax)
    {
        return BadRequest("Minimum effort cannot be greater than maximum effort.");
    }

    bool wasCompletedBefore = existingTask.IsCompleted ?? false;

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
    existingTask.AssigneeId = updatedTaskDto.AssigneeId;
    existingTask.CreationStatus = updatedTaskDto.CreationStatus; 
    existingTask.EffortMin = updatedTaskDto.EffortMin;
    existingTask.EffortMax = updatedTaskDto.EffortMax;
    
    var taskSkills = await MapSkillNamesToTaskSkills(updatedTaskDto.SkillNames, existingTask);
    existingTask.TaskSkills = taskSkills;

    await _context.SaveChangesAsync();

    if (!wasCompletedBefore && existingTask.IsCompleted == true && existingTask.AssigneeId.HasValue)
    {
        try
        {
            var rewardService = HttpContext.RequestServices.GetRequiredService<RewardService>();
            var newRewards = await rewardService.UpdateUserRewardsAsync(existingTask.AssigneeId.Value);
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

    
    
    
    
    // TESTING AND DEBUGGING 
    
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