using System.ComponentModel.DataAnnotations;

namespace Cometa.Persistence.Model
{
    public class Organization : BaseEntity
    {
        [Required] [MaxLength(100)] public string Name { get; set; } = string.Empty;

        [MaxLength(500)] public string? Description { get; set; }

        // Eindeutiger Slug für URL-freundliche IDs
        [Required] [MaxLength(50)] public string Slug { get; set; } = string.Empty;

        // Referenz zum Admin/Owner der Organisation
        public Guid OwnerId { get; set; }
        public ApplicationUser Owner { get; set; } = null!;

        // Beziehung zu Mitgliedern
        public ICollection<OrganizationMember> Members { get; set; } = new List<OrganizationMember>();
    }
}