using Microsoft.EntityFrameworkCore;
using Cometa.Persistence.Model;

namespace Cometa.Persistence;

public class CometaDbContext : DbContext
{
    public CometaDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Todo> Todos { get; set; }
    public DbSet<Skill> Skills { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Self-Referencing Beziehung für ParentTodo
    modelBuilder.Entity<Todo>()
        .HasOne(t => t.ParentTodo)
        .WithMany()
        .HasForeignKey(t => t.ParentTodoId)
        .OnDelete(DeleteBehavior.Restrict);

    // Self-Referencing Beziehung für ChildTodo
    modelBuilder.Entity<Todo>()
        .HasOne(t => t.ChildTodo)
        .WithMany()
        .HasForeignKey(t => t.ChildTodoId)
        .OnDelete(DeleteBehavior.Restrict);

    // Self-Referencing Beziehung für NextTodo
    modelBuilder.Entity<Todo>()
        .HasOne(t => t.NextTodo)
        .WithMany()
        .HasForeignKey(t => t.NextTodoId)
        .OnDelete(DeleteBehavior.Restrict);

    // Self-Referencing Beziehung für PreviousTodo
    modelBuilder.Entity<Todo>()
        .HasOne(t => t.PreviousTodo)
        .WithMany()
        .HasForeignKey(t => t.PreviousTodoId)
        .OnDelete(DeleteBehavior.Restrict);

    // Definiere Todo -> Skills Beziehung
    modelBuilder.Entity<Todo>()
        .HasMany(t => t.Skills)
        .WithMany(s => s.Todos)
        .UsingEntity<Dictionary<string, object>>(
            "TodoSkill",
            j => j.HasOne<Skill>()
                  .WithMany()
                  .HasForeignKey("SkillId")
                  .OnDelete(DeleteBehavior.Cascade),
            j => j.HasOne<Todo>()
                  .WithMany()
                  .HasForeignKey("TodoId")
                  .OnDelete(DeleteBehavior.Cascade)
        );

    // Definiere Indizes für die Zwischentabelle TodoSkill
    modelBuilder.Entity("TodoSkill")
        .HasIndex("SkillId")
        .HasDatabaseName("IX_TodoSkill_SkillId");

    modelBuilder.Entity("TodoSkill")
        .HasIndex("TodoId")
        .HasDatabaseName("IX_TodoSkill_TodoId");

    // Optionale Indizes für Performance
    modelBuilder.Entity<Todo>()
        .HasIndex(t => t.ParentTodoId)
        .HasDatabaseName("IX_Todos_ParentTodoId");

    modelBuilder.Entity<Todo>()
        .HasIndex(t => t.ChildTodoId)
        .HasDatabaseName("IX_Todos_ChildTodoId");

    modelBuilder.Entity<Todo>()
        .HasIndex(t => t.NextTodoId)
        .HasDatabaseName("IX_Todos_NextTodoId");

    modelBuilder.Entity<Todo>()
        .HasIndex(t => t.PreviousTodoId)
        .HasDatabaseName("IX_Todos_PreviousTodoId");
}


}