using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization; // Neue Direktive für [Authorize]
using System.Security.Claims; // Neue Direktive für ClaimTypes

namespace Cometa.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        
        public UsersController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
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
        
        [HttpGet("me/rewards")]
        [Authorize] // Diese Zeile aktivieren!
        public async Task<ActionResult<int>> GetUserRewards()
        {
            try 
            {
                // Debug-Ausgabe
                Console.WriteLine("GetUserRewards called. User authenticated: " + User.Identity.IsAuthenticated);
        
                // Hole die Benutzer-ID aus dem authentifizierten Benutzer
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