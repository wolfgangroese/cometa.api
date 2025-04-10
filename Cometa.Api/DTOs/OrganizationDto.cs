using System.ComponentModel.DataAnnotations;
using Cometa.Persistence.Model;

namespace Cometa.Api.DTOs
{
    public class OrganizationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Slug { get; set; } = string.Empty;
        public int MemberCount { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool IsOwner { get; set; }
    }

    public class CreateOrganizationDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 3)]
        [RegularExpression(@"^[a-z0-9\-]+$", ErrorMessage = "Slug can only contain lowercase letters, numbers, and hyphens.")]
        public string Slug { get; set; } = string.Empty;
    }

    public class UpdateOrganizationDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 3)]
        [RegularExpression(@"^[a-z0-9\-]+$", ErrorMessage = "Slug can only contain lowercase letters, numbers, and hyphens.")]
        public string Slug { get; set; } = string.Empty;
    }

    public class InviteMemberDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public OrganizationRole Role { get; set; } = OrganizationRole.Member;
    }

    public class UpdateMemberRoleDto
    {
        [Required]
        public OrganizationRole Role { get; set; }
    }
}
