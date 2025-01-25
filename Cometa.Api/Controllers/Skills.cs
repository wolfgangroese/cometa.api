using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;    

namespace Cometa.Api.Controllers;

[ApiController]
[Route("[controller]")]

public class Skills : ControllerBase
{
    private readonly CometaDbContext _context;
    
    public Skills(CometaDbContext context)
    {
        _context = context;
    }
    
    [HttpGet( Name = "Skills")]
    public async Task<IEnumerable<Skill>> GetSkills()
    {
        return await _context.Skills.ToListAsync();
    }
}