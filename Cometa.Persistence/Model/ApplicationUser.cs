using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Cometa.Persistence.Model;

public class ApplicationUser : IdentityUser<Guid>
{
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
}