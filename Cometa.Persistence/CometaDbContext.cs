using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Cometa.Persistence.Model;
using Task = Cometa.Persistence.Model.Task;

namespace Cometa.Persistence;

// Erweiterung des DbContext für Identity
public class CometaDbContext : IdentityDbContext<ApplicationUser>
{
    public CometaDbContext(DbContextOptions<CometaDbContext> options) : base(options)
    {
    }

    public DbSet<Task> Task { get; set; }
    public DbSet<Skill> Skills { get; set; }

    // Füge ApplicationUser als DbSet hinzu
    public DbSet<ApplicationUser> ApplicationUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // Identity-Tabellen konfigurieren

        // Self-Referencing Beziehungen für Tasks
        modelBuilder.Entity<Task>()
            .HasOne(t => t.ParentTask)
            .WithMany()
            .HasForeignKey(t => t.ParentTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Task>()
            .HasOne(t => t.ChildTask)
            .WithMany()
            .HasForeignKey(t => t.ChildTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Task>()
            .HasOne(t => t.NextTask)
            .WithMany()
            .HasForeignKey(t => t.NextTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Task>()
            .HasOne(t => t.PreviousTask)
            .WithMany()
            .HasForeignKey(t => t.PreviousTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        // Todo -> Skills Beziehung
        modelBuilder.Entity<Task>()
            .HasMany(t => t.Skills)
            .WithMany(s => s.Tasks)
            .UsingEntity<Dictionary<string, object>>(
                "TaskSkill",
                j => j.HasOne<Skill>()
                      .WithMany()
                      .HasForeignKey("SkillId")
                      .OnDelete(DeleteBehavior.Cascade),
                j => j.HasOne<Task>()
                      .WithMany()
                      .HasForeignKey("TaskId")
                      .OnDelete(DeleteBehavior.Cascade)
            );

        // Indizes für die Zwischentabelle TaskSkill
        modelBuilder.Entity("TaskSkill")
            .HasIndex("SkillId")
            .HasDatabaseName("IX_TaskSkill_SkillId");

        modelBuilder.Entity("TaskSkill")
            .HasIndex("TaskId")
            .HasDatabaseName("IX_TaskSkill_TaskId");

        // Optionale Indizes für Performance
        modelBuilder.Entity<Task>()
            .HasIndex(t => t.ParentTaskId)
            .HasDatabaseName("IX_Tasks_ParentTaskId");

        modelBuilder.Entity<Task>()
            .HasIndex(t => t.ChildTaskId)
            .HasDatabaseName("IX_Tasks_ChildTaskId");

        modelBuilder.Entity<Task>()
            .HasIndex(t => t.NextTaskId)
            .HasDatabaseName("IX_Tasks_NextTaskId");

        modelBuilder.Entity<Task>()
            .HasIndex(t => t.PreviousTaskId)
            .HasDatabaseName("IX_Tasks_PreviousTaskId");
    }
    
    public override int SaveChanges()
    {
        ConvertDatesToUtc();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ConvertDatesToUtc();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ConvertDatesToUtc()
    {
        foreach (var entry in ChangeTracker.Entries()
                     .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
        {
            foreach (var property in entry.Properties)
            {
                if (property.Metadata.ClrType == typeof(DateTime) || property.Metadata.ClrType == typeof(DateTime?))
                {
                    var currentValue = property.CurrentValue as DateTime?;

                    if (currentValue.HasValue)
                    {
                        // Konvertiere ALLE DateTime-Werte zu UTC, auch wenn sie schon Local sind
                        property.CurrentValue = currentValue.Value.ToUniversalTime();
                    }
                }
            }
        }
    }

}

// Benutzerklasse erweitern für zusätzliche Felder
public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = "Initial Admin"; // Beispiel für ein benutzerdefiniertes Feld
}



