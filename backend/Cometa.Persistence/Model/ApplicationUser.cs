using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Cometa.Persistence.Model;

public class ApplicationUser : IdentityUser<Guid>
{
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    public int TotalRewards { get; set; } = 0;
    
    // Beziehung zu Organisationen
    public ICollection<OrganizationMember> Organizations { get; set; } = new List<OrganizationMember>();
    
    // Aktuelle ausgewählte Organisation des Benutzers
    public Guid? CurrentOrganizationId { get; set; }
}