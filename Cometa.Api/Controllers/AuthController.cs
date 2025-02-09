using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Cometa.Api.DTOs;
using Cometa.Persistence;

namespace Cometa.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        // Registrierung
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var user = new ApplicationUser() { UserName = registerDto.Email, Email = registerDto.Email };
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Performer");

                var token = GenerateJwtToken(user);
                return Ok(new 
                { 
                    Token = token, 
                    User = new 
                    { 
                        Id = user.Id, 
                        UserName = user.UserName, 
                        Email = user.Email 
                    } 
                });
            }

            return BadRequest(result.Errors);
        }

        // Anmeldung
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
                return Unauthorized("Invalid credentials");

            var passwordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!passwordValid)
                return Unauthorized("Invalid credentials");

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token, User = new { user.Id, user.UserName, user.Email } });
        }


        // GET-Endpunkt für den aktuellen Benutzer
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            // Der aktuell authentifizierte Benutzer wird aus dem JWT-Token extrahiert, das im Header mitgesendet wird.
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound("Benutzer nicht gefunden");
            }
            
            return Ok(new 
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email
            });
        }

        // JWT Token generieren
        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),  // ✅ Identity sucht mit `NameIdentifier`
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
