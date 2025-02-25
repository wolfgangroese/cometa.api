using Cometa.Api.DTOs;
using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Cometa.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SkillsController : ControllerBase
{
    private readonly CometaDbContext _context;

    public SkillsController(CometaDbContext context)
    {
        _context = context;
    }

    // GET: /Skills
    [HttpGet(Name = "GetSkills")]
    public async Task<IEnumerable<Skill>> GetSkills()
    {
        return await _context.Skills.ToListAsync();
    }

    // POST: /Skills
    [HttpPost]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> CreateSkill([FromBody] SkillDto skillDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var skill = new Skill { Name = skillDto.Name };
        _context.Skills.Add(skill);
        await _context.SaveChangesAsync();

        return CreatedAtRoute("GetSkills", new { id = skill.Id }, skill);
    }

    // PUT: /Skills/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> UpdateSkill(int id, [FromBody] SkillDto skillDto)
    {
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null)
            return NotFound();

        skill.Name = skillDto.Name;
        _context.Skills.Update(skill);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /Skills/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> DeleteSkill(int id)
    {
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null)
            return NotFound();

        _context.Skills.Remove(skill);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
