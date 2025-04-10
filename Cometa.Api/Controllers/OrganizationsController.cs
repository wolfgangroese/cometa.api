using Cometa.Api.DTOs;
using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cometa.Api.Controllers
{
    [ApiController]
    [Route("api/organizations")]
    [Authorize]
    public class OrganizationsController : ControllerBase
    {
        private readonly CometaDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrganizationsController(
            CometaDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/organizations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrganizationDto>>> GetOrganizations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Hole alle Organisationen, in denen der Benutzer Mitglied ist
            var userOrganizations = await _context.OrganizationMembers
                .Where(m => m.UserId == Guid.Parse(userId))
                .Include(m => m.Organization)
                .Select(m => new OrganizationDto
                {
                    Id = m.Organization.Id,
                    Name = m.Organization.Name,
                    Description = m.Organization.Description,
                    Slug = m.Organization.Slug,
                    MemberCount = m.Organization.Members.Count,
                    Role = m.Role.ToString(),
                    IsOwner = m.Role == OrganizationRole.Owner
                })
                .ToListAsync();

            return Ok(userOrganizations);
        }

        // GET: api/organizations/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrganizationDto>> GetOrganization(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Prüfe, ob der Benutzer Mitglied der Organisation ist
            var membership = await _context.OrganizationMembers
                .Include(m => m.Organization)
                .FirstOrDefaultAsync(m => m.OrganizationId == id && m.UserId == Guid.Parse(userId));

            if (membership == null)
                return NotFound("Organization not found or you don't have access to it.");

            var organization = membership.Organization;
            var memberCount = await _context.OrganizationMembers
                .CountAsync(m => m.OrganizationId == id);

            return Ok(new OrganizationDto
            {
                Id = organization.Id,
                Name = organization.Name,
                Description = organization.Description,
                Slug = organization.Slug,
                MemberCount = memberCount,
                Role = membership.Role.ToString(),
                IsOwner = membership.Role == OrganizationRole.Owner
            });
        }

        // POST: api/organizations
        [HttpPost]
        public async Task<ActionResult<OrganizationDto>> CreateOrganization([FromBody] CreateOrganizationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized();

            // Prüfe, ob der Slug bereits verwendet wird
            bool slugExists = await _context.Organizations.AnyAsync(o => o.Slug == dto.Slug);
            if (slugExists)
                return BadRequest("This slug is already in use. Please choose another one.");

            // Erstelle die neue Organisation
            var organization = new Organization
            {
                Name = dto.Name,
                Description = dto.Description,
                Slug = dto.Slug,
                OwnerId = user.Id
            };

            // Erstelle die Mitgliedschaft des Erstellers als Owner
            var membership = new OrganizationMember
            {
                UserId = user.Id,
                Organization = organization,
                Role = OrganizationRole.Owner
            };

            organization.Members.Add(membership);

            _context.Organizations.Add(organization);
            await _context.SaveChangesAsync();

            // Setze die aktuelle Organisation des Benutzers
            user.CurrentOrganizationId = organization.Id;
            await _userManager.UpdateAsync(user);

            return CreatedAtAction(
                nameof(GetOrganization),
                new { id = organization.Id },
                new OrganizationDto
                {
                    Id = organization.Id,
                    Name = organization.Name,
                    Description = organization.Description,
                    Slug = organization.Slug,
                    MemberCount = 1,
                    Role = OrganizationRole.Owner.ToString(),
                    IsOwner = true
                });
        }

        // PUT: api/organizations/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrganization(Guid id, [FromBody] UpdateOrganizationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Prüfe, ob der Benutzer Admin oder Owner der Organisation ist
            var membership = await _context.OrganizationMembers
                .Include(m => m.Organization)
                .FirstOrDefaultAsync(m => 
                    m.OrganizationId == id && 
                    m.UserId == Guid.Parse(userId) && 
                    (m.Role == OrganizationRole.Owner || m.Role == OrganizationRole.Admin));

            if (membership == null)
                return Forbid("You don't have permission to update this organization.");

            var organization = membership.Organization;

            // Wenn der Slug geändert werden soll, prüfe auf Eindeutigkeit
            if (dto.Slug != organization.Slug)
            {
                bool slugExists = await _context.Organizations
                    .AnyAsync(o => o.Slug == dto.Slug && o.Id != id);
                    
                if (slugExists)
                    return BadRequest("This slug is already in use. Please choose another one.");
            }

            // Aktualisiere die Organisationsdaten
            organization.Name = dto.Name;
            organization.Description = dto.Description;
            organization.Slug = dto.Slug;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/organizations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrganization(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Nur der Owner darf die Organisation löschen
            var membership = await _context.OrganizationMembers
                .Include(m => m.Organization)
                .FirstOrDefaultAsync(m => 
                    m.OrganizationId == id && 
                    m.UserId == Guid.Parse(userId) && 
                    m.Role == OrganizationRole.Owner);

            if (membership == null)
                return Forbid("Only the owner can delete an organization.");

            var organization = membership.Organization;

            // Entferne alle Mitgliedschaften
            var memberships = await _context.OrganizationMembers
                .Where(m => m.OrganizationId == id)
                .ToListAsync();
                
            _context.OrganizationMembers.RemoveRange(memberships);

            // Aktualisiere CurrentOrganizationId für alle betroffenen Benutzer
            var userIds = memberships.Select(m => m.UserId).ToList();
            var affectedUsers = await _userManager.Users
                .Where(u => userIds.Contains(u.Id) && u.CurrentOrganizationId == id)
                .ToListAsync();
                
            foreach (var user in affectedUsers)
            {
                user.CurrentOrganizationId = null;
                await _userManager.UpdateAsync(user);
            }

            // Lösche die Organisation
            _context.Organizations.Remove(organization);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/organizations/{id}/members
        [HttpPost("{id}/members")]
        public async Task<IActionResult> InviteMember(Guid id, [FromBody] InviteMemberDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Prüfe, ob der Benutzer Admin oder Owner der Organisation ist
            var membership = await _context.OrganizationMembers
                .Include(m => m.Organization)
                .FirstOrDefaultAsync(m => 
                    m.OrganizationId == id && 
                    m.UserId == Guid.Parse(userId) && 
                    (m.Role == OrganizationRole.Owner || m.Role == OrganizationRole.Admin));

            if (membership == null)
                return Forbid("You don't have permission to invite members to this organization.");

            // Prüfe, ob der einzuladende Benutzer existiert
            var invitedUser = await _userManager.FindByEmailAsync(dto.Email);
            if (invitedUser == null)
                return NotFound("User with this email not found.");

            // Prüfe, ob der Benutzer bereits Mitglied ist
            bool isAlreadyMember = await _context.OrganizationMembers
                .AnyAsync(m => m.OrganizationId == id && m.UserId == invitedUser.Id);
                
            if (isAlreadyMember)
                return BadRequest("User is already a member of this organization.");

            // Erstelle die Mitgliedschaft
            var newMembership = new OrganizationMember
            {
                OrganizationId = id,
                UserId = invitedUser.Id,
                Role = dto.Role
            };

            _context.OrganizationMembers.Add(newMembership);
            await _context.SaveChangesAsync();

            // Wenn der eingeladene Benutzer noch keine aktive Organisation hat,
            // setze diese Organisation als aktiv
            if (invitedUser.CurrentOrganizationId == null)
            {
                invitedUser.CurrentOrganizationId = id;
                await _userManager.UpdateAsync(invitedUser);
            }

            // Hier könnte eine E-Mail-Benachrichtigung an den eingeladenen Benutzer gesendet werden

            return Ok(new
            {
                message = "User successfully invited to the organization.",
                userEmail = invitedUser.Email,
                role = dto.Role.ToString()
            });
        }

        // DELETE: api/organizations/{id}/members/{userId}
        [HttpDelete("{id}/members/{userId}")]
        public async Task<IActionResult> RemoveMember(Guid id, Guid userId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            // Prüfe, ob der aktuelle Benutzer Admin oder Owner der Organisation ist
            var currentMembership = await _context.OrganizationMembers
                .FirstOrDefaultAsync(m => 
                    m.OrganizationId == id && 
                    m.UserId == Guid.Parse(currentUserId) && 
                    (m.Role == OrganizationRole.Owner || m.Role == OrganizationRole.Admin));

            // Oder ob der Benutzer sich selbst entfernen möchte
            bool isRemovingSelf = Guid.Parse(currentUserId) == userId;

            if (currentMembership == null && !isRemovingSelf)
                return Forbid("You don't have permission to remove members from this organization.");

            // Prüfe, ob der zu entfernende Benutzer Mitglied ist
            var membershipToRemove = await _context.OrganizationMembers
                .FirstOrDefaultAsync(m => m.OrganizationId == id && m.UserId == userId);
                
            if (membershipToRemove == null)
                return NotFound("User is not a member of this organization.");

            // Verhindere, dass Admins den Owner entfernen
            if (membershipToRemove.Role == OrganizationRole.Owner && 
                currentMembership?.Role == OrganizationRole.Admin)
                return Forbid("Admins cannot remove the owner of the organization.");

            // Entferne die Mitgliedschaft
            _context.OrganizationMembers.Remove(membershipToRemove);

            // Wenn der Benutzer diese Organisation als aktiv hat, setze auf null
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user != null && user.CurrentOrganizationId == id)
            {
                user.CurrentOrganizationId = null;
                await _userManager.UpdateAsync(user);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/organizations/{id}/members/{userId}/role
        [HttpPatch("{id}/members/{userId}/role")]
        public async Task<IActionResult> UpdateMemberRole(Guid id, Guid userId, [FromBody] UpdateMemberRoleDto dto)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            // Prüfe, ob der aktuelle Benutzer Owner der Organisation ist
            var currentMembership = await _context.OrganizationMembers
                .FirstOrDefaultAsync(m => 
                    m.OrganizationId == id && 
                    m.UserId == Guid.Parse(currentUserId) && 
                    m.Role == OrganizationRole.Owner);

            if (currentMembership == null)
                return Forbid("Only the owner can change member roles.");

            // Prüfe, ob der zu aktualisierende Benutzer Mitglied ist
            var membershipToUpdate = await _context.OrganizationMembers
                .FirstOrDefaultAsync(m => m.OrganizationId == id && m.UserId == userId);
                
            if (membershipToUpdate == null)
                return NotFound("User is not a member of this organization.");

            // Verhindere, dass der Owner seine eigene Rolle ändert
            if (membershipToUpdate.UserId == Guid.Parse(currentUserId))
                return BadRequest("You cannot change your own role as the owner.");

            // Aktualisiere die Rolle
            membershipToUpdate.Role = dto.Role;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Member role updated successfully.",
                userId,
                newRole = dto.Role.ToString()
            });
        }

        // PATCH: api/organizations/switch/{id}
        [HttpPatch("switch/{id}")]
        public async Task<IActionResult> SwitchOrganization(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Prüfe, ob der Benutzer Mitglied der Organisation ist
            bool isMember = await _context.OrganizationMembers
                .AnyAsync(m => m.OrganizationId == id && m.UserId == Guid.Parse(userId));

            if (!isMember)
                return Forbid("You are not a member of this organization.");

            // Aktualisiere die aktuelle Organisation des Benutzers
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized();

            user.CurrentOrganizationId = id;
            await _userManager.UpdateAsync(user);

            return Ok(new
            {
                message = "Successfully switched to the organization.",
                organizationId = id
            });
        }
    }
}