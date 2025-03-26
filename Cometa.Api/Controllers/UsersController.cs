using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Cometa.Persistence;

namespace Cometa.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly CometaDbContext _context;
        
        public UsersController(
            UserManager<ApplicationUser> userManager,
            CometaDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            
            var userDtos = users.Select(user => new
            {
                id = user.Id,
                userName = user.UserName,
                email = user.Email,
                fullName = user.FullName
            });
            
            return Ok(userDtos);
        }
        
        [HttpGet("leaderboard")]
        public async Task<ActionResult<IEnumerable<object>>> GetLeaderboard()
        {
            var users = await _userManager.Users
                .OrderByDescending(u => u.TotalRewards)
                .ToListAsync();
            
            var leaderboardDtos = users.Select(user => new
            {
                id = user.Id,
                userName = user.UserName,
                fullName = user.FullName,
                totalRewards = user.TotalRewards
            });
            
            return Ok(leaderboardDtos);
        }
        
        [HttpGet("me/rewards")]
        [Authorize]
        public async Task<ActionResult<int>> GetUserRewards()
        {
            try 
            {
                // Debug output
                Console.WriteLine("GetUserRewards called. User authenticated: " + User.Identity?.IsAuthenticated);
        
                // Get user ID from the authenticated user
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Console.WriteLine("User ID from claim: " + userId);
        
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }
        
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                return Ok(new { totalRewards = user.TotalRewards });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in GetUserRewards: " + ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}