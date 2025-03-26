using TaskStatus = Cometa.Persistence.Enums.TaskStatus;

namespace Cometa.Api.DTOs;

public class TaskStatusUpdateDto
{
    public TaskStatus Status { get; set; }
}