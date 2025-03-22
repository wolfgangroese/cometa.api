using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Cometa.Persistence.Model;

namespace Cometa.Persistence;

public class CometaDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public CometaDbContext(DbContextOptions<CometaDbContext> options) : base(options)
    {
    }

    public DbSet<TaskEntity> Tasks { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<TaskSkill> TaskSkills { get; set; } 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); 

        modelBuilder.Entity<TaskEntity>()
            .HasOne(t => t.Assignee)
            .WithMany()
            .HasForeignKey(t => t.AssigneeId)
            .OnDelete(DeleteBehavior.SetNull);
        
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

        modelBuilder.Entity<TaskSkill>()
            .HasKey(ts => new { ts.TaskId, ts.SkillId });

        modelBuilder.Entity<TaskSkill>()
            .HasOne(ts => ts.Task)  
            .WithMany(t => t.TaskSkills)
            .HasForeignKey(ts => ts.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskSkill>()
            .HasOne(ts => ts.Skill) 
            .WithMany(s => s.TaskSkills)
            .HasForeignKey(ts => ts.SkillId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskSkill>()
            .HasIndex(ts => ts.SkillId)
            .HasDatabaseName("IX_TaskSkill_SkillId");

        modelBuilder.Entity<TaskSkill>()
            .HasIndex(ts => ts.TaskId)
            .HasDatabaseName("IX_TaskSkill_TaskId");
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
            foreach (var property in entry.Properties
                         .Where(p => p.Metadata.ClrType == typeof(DateTime) || p.Metadata.ClrType == typeof(DateTime?)))
            {
                if (property.CurrentValue is DateTime dt)
                {
                    Console.WriteLine($"DEBUG: {property.Metadata.Name} -> {dt} (Kind: {dt.Kind})");
                
                    if (dt.Kind == DateTimeKind.Unspecified)
                    {
                        property.CurrentValue = DateTime.SpecifyKind(dt, DateTimeKind.Utc).ToUniversalTime();
                    }
                    else if (dt.Kind != DateTimeKind.Utc)
                    {
                        property.CurrentValue = dt.ToUniversalTime();
                    }
                }
            }
        }
    }
}