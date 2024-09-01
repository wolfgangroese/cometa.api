using Microsoft.EntityFrameworkCore;
using Cometa.Persistence.Model;

namespace Cometa.Persistence;

public class CometaDbContext:DbContext
{
    public CometaDbContext(DbContextOptions options) : base(options) { }   
    public DbSet<Todo>Todos { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Todo>()
            .HasOne(t => t.ChildTodo)
            .WithOne()
            .HasForeignKey<Todo>(t => t.ChildTodoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Todo>()
            .HasOne(t => t.ParentTodo)
            .WithOne()
            .HasForeignKey<Todo>(t => t.ParentTodoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Todo>()
            .HasOne(t => t.NextTodo)
            .WithOne()
            .HasForeignKey<Todo>(t => t.NextTodoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Todo>()
            .HasOne(t => t.PreviousTodo)
            .WithOne()
            .HasForeignKey<Todo>(t => t.PreviousTodoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

