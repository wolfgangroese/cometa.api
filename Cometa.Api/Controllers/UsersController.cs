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
        
        // Neue Methode für Benutzerbelohnungen
        [HttpGet("me/rewards")]
        //[Authorize ( Roles = "Performer")]
        public async Task<ActionResult<int>> GetUserRewards()
        {
            var testUserId = "0195ce83-25eb-726f-8129-a59d6cb427b0";
            var userGuid = Guid.Parse(testUserId);
    
            var user = await _userManager.FindByIdAsync(testUserId);
            if (user == null)
            {
                return NotFound("User not found");
            }
    
            return Ok(new { totalRewards = user.TotalRewards });
        }
    }
}