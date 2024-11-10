using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cometa.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class Todos : ControllerBase
{
    private readonly CometaDbContext _context;

    public Todos(CometaDbContext context)
    {
        _context = context;
    }
    
    [HttpGet( Name = "Todos")]
    public async Task<IEnumerable<Todo>> GetTodos()
    {
        return await _context.Todos.ToListAsync();
    }
}
