using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Cometa.Persistence.Model;

// Verwende TaskEntity anstatt Task, um Konflikte mit System.Threading.Tasks.Task zu vermeiden

namespace Cometa.Persistence;

// Erweiterung des DbContext für Identity
public class CometaDbContext : IdentityDbContext<ApplicationUser>
{
    public CometaDbContext(DbContextOptions<CometaDbContext> options) : base(options)
    {
    }

    // ✅ KORREKT: Nur EINE DbSet-Definition pro Modell
    public DbSet<TaskEntity> Tasks { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<TaskSkill> TaskSkills { get; set; } // 🔹 Neu hinzugefügt

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // Identity-Tabellen konfigurieren

        // ✅ Self-Referencing Beziehungen für Tasks
        modelBuilder.Entity<TaskEntity>()
            .HasOne(t => t.ParentTask)
            .WithMany()
            .HasForeignKey(t => t.ParentTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TaskEntity>()
            .HasOne(t => t.ChildTask)
            .WithMany()
            .HasForeignKey(t => t.ChildTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TaskEntity>()
            .HasOne(t => t.NextTask)
            .WithMany()
            .HasForeignKey(t => t.NextTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TaskEntity>()
            .HasOne(t => t.PreviousTask)
            .WithMany()
            .HasForeignKey(t => t.PreviousTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        // ✅ Many-to-Many-Verknüpfung über `TaskSkill`
        modelBuilder.Entity<TaskSkill>()
            .HasKey(ts => new { ts.TaskId, ts.SkillId });

        modelBuilder.Entity<TaskSkill>()
            .HasOne(ts => ts.Task)  // ✅ Hier korrekt!
            .WithMany(t => t.TaskSkills)
            .HasForeignKey(ts => ts.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskSkill>()
            .HasOne(ts => ts.Skill)  // ✅ Hier korrekt!
            .WithMany(s => s.TaskSkills)
            .HasForeignKey(ts => ts.SkillId)
            .OnDelete(DeleteBehavior.Cascade);

        // ✅ Indizes für Performance
        modelBuilder.Entity<TaskSkill>()
            .HasIndex(ts => ts.SkillId)
            .HasDatabaseName("IX_TaskSkill_SkillId");

        modelBuilder.Entity<TaskSkill>()
            .HasIndex(ts => ts.TaskId)
            .HasDatabaseName("IX_TaskSkill_TaskId");
    }

    // ✅ KORREKT: SaveChanges & SaveChangesAsync ohne Konflikte mit .NET Task
    public override int SaveChanges()
    {
        ConvertDatesToUtc();
        return base.SaveChanges();
    }

    public override System.Threading.Tasks.Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ConvertDatesToUtc();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ConvertDatesToUtc()
    {
        foreach (var entry in ChangeTracker.Entries()
                 .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
        {
            foreach (var property in entry.Properties
                 .Where(p => p.Metadata.ClrType == typeof(DateTime) || p.Metadata.ClrType == typeof(DateTime?)))
            {
                if (property.CurrentValue is DateTime dt)
                {
                    property.CurrentValue = dt.Kind == DateTimeKind.Utc ? dt : dt.ToUniversalTime();
                }
            }
        }
    }
}

// ✅ KORREKT: Benutzerklasse mit Identity
public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
}
