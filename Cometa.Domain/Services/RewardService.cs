using Cometa.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cometa.Domain.Services;

public class RewardService
{
    private readonly CometaDbContext _context;

    public RewardService(CometaDbContext context)
    {
        _context = context;
    }

    public async Task<int> UpdateUserRewardsAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new ArgumentException("User not found");

        // Get all completed tasks assigned to this user
        var completedTasks = await _context.Tasks
            .Where(t => t.AssigneeId == userId && t.IsCompleted == true)
            .ToListAsync();

        // Calculate total rewards
        var totalRewards = completedTasks.Sum(t => t.Rewards ?? 0);
        
        // Update user's total rewards
        user.TotalRewards = totalRewards;
        await _context.SaveChangesAsync();
        
        return totalRewards;
    }
}