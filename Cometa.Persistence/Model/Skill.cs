using System.ComponentModel.DataAnnotations;
using Cometa.Persistence.Enums;

namespace Cometa.Persistence.Model;

public class Skill : BaseEntity
{
    [MaxLength(100)]
    public string? Name { get; set; }
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    public Prevalence Prevalence { get; set; }
}