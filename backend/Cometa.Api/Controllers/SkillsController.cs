using Cometa.Api.DTOs;
using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;

namespace Cometa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly CometaDbContext _context;

    public SkillsController(CometaDbContext context)
    {
        _context = context;
    }

    // GET: api/Skills
    [HttpGet(Name = "GetSkills")]
    public async Task<IEnumerable<SkillDto>> GetSkills(string? search = null)
    {
        var skillsQuery = _context.Skills.AsQueryable();
        
        // Apply search filter if provided
        if (!string.IsNullOrEmpty(search))
        {
            search = search.ToLower();
            skillsQuery = skillsQuery.Where(s => s.Name != null && s.Name.ToLower().Contains(search));
        }
        
        var skills = await skillsQuery.ToListAsync();
        
        return skills.Select(skill => new SkillDto
        {
            Id = skill.Id,
            Name = skill.Name ?? string.Empty,
            Description = skill.Description,
            Prevalence = (int)skill.Prevalence
        });
    }

    // GET: api/Skills/{id}
    [HttpGet("{id}", Name = "GetSkillById")]
    public async Task<ActionResult<SkillDto>> GetSkillById(Guid id)
    {
        var skill = await _context.Skills.FindAsync(id);
        
        if (skill == null)
        {
            return NotFound();
        }
        
        return Ok(new SkillDto
        {
            Id = skill.Id,
            Name = skill.Name ?? string.Empty,
            Description = skill.Description,
            Prevalence = (int)skill.Prevalence
        });
    }
    
    // GET: api/Skills/Names
    [HttpGet("names", Name = "GetSkillNames")]
    public async Task<ActionResult<IEnumerable<string>>> GetSkillNames()
    {
        var skillNames = await _context.Skills
            .Where(s => s.Name != null)
            .Select(s => s.Name)
            .ToListAsync();
            
        return Ok(skillNames);
    }

    // POST: api/Skills
    [HttpPost]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> CreateSkill([FromBody] SkillDto skillDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var skill = new Skill
        {
            Name = skillDto.Name,
            Description = skillDto.Description,
            Prevalence = (Persistence.Enums.Prevalence)skillDto.Prevalence
        };
        
        _context.Skills.Add(skill);
        await _context.SaveChangesAsync();

        skillDto.Id = skill.Id;
        return CreatedAtRoute("GetSkillById", new { id = skill.Id }, skillDto);
    }

    // PUT: api/Skills/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> UpdateSkill(Guid id, [FromBody] SkillDto skillDto)
    {
        if (id != skillDto.Id)
            return BadRequest("ID mismatch");
            
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null)
            return NotFound();

        skill.Name = skillDto.Name;
        skill.Description = skillDto.Description;
        skill.Prevalence = (Persistence.Enums.Prevalence)skillDto.Prevalence;
        
        _context.Skills.Update(skill);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Skills/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> DeleteSkill(Guid id)
    {
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null)
            return NotFound();

        // Check if skill is in use
        var isInUse = await _context.TaskSkills.AnyAsync(ts => ts.SkillId == id);
        if (isInUse)
        {
            return BadRequest("Cannot delete skill because it is associated with one or more tasks.");
        }

        _context.Skills.Remove(skill);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    
    // GET: api/Skills/{id}/tasks
    [HttpGet("{id}/tasks")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<ActionResult<IEnumerable<object>>> GetTasksUsingSkill(Guid id)
    {
        // Check if skill exists
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null)
            return NotFound();
            
        // Get tasks that use this skill through the TaskSkill relationship
        var tasksWithSkill = await _context.TaskSkills
            .Where(ts => ts.SkillId == id)
            .Select(ts => ts.Task)
            .Select(t => new
            {
                Id = t.Id,
                Name = t.Name,
                Description = t.Description,
                Status = t.TaskStatus,
                IsCompleted = t.IsCompleted,
                AssigneeName = t.Assignee != null ? t.Assignee.UserName : null
            })
            .ToListAsync();
            
        return Ok(tasksWithSkill);
    }
}