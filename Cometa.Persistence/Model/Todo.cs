using Cometa.Persistence.Model;

namespace Cometa.Persistence.Model;

public class Todo : BaseEntity
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    
}