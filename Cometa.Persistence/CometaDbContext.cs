using Microsoft.EntityFrameworkCore;
using Cometa.Persistence.Model;
namespace Cometa.Persistence;

public class CometaDbContext:DbContext
{
    public CometaDbContext(DbContextOptions options) : base(options) { }   
    public DbSet<Todo>Todos { get; set; }
}

