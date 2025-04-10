
namespace Cometa.Persistence.Model
{
    public class OrganizationMember
    {
        public Guid OrganizationId { get; set; }
        public Organization Organization { get; set; } = null!;
        
        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; } = null!;
        
        // Rolle innerhalb der Organisation (nicht zu verwechseln mit der systemweiten Rolle)
        public OrganizationRole Role { get; set; } = OrganizationRole.Member;
    }

    public enum OrganizationRole
    {
        Owner,
        Admin,
        Member
    }
}