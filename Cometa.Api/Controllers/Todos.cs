using Cometa.Persistence;
using Cometa.Persistence.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace Cometa.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class Todos : ControllerBase
{
    private readonly CometaDbContext _context;

    public Todos(CometaDbContext context)
    {
        _context = context;
    }
    
    [HttpGet( Name = "Todos")]
    public async Task<IEnumerable<Todo>> GetTodos()
    {
        return await _context.Todos.ToListAsync();
    }
    
    [HttpGet("{id}", Name = "GetTodoById")]
    public async Task<ActionResult<Todo>> GetTodoById(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);

        if (todo == null)
        {
            return NotFound(); // Gibt einen 404-Fehler zurück, wenn das Todo nicht existiert
        }

        return Ok(todo); // Gibt das gefundene Todo zurück
    }
    
    [HttpPost(Name = "CreateTodo")]
    public async Task<ActionResult<Todo>> CreateTodo([FromBody] Todo newTodo)
    {
        if (newTodo == null)
        {
            return BadRequest("Invalid Todo object.");
        }
        Console.WriteLine($"Received Todo: {System.Text.Json.JsonSerializer.Serialize(newTodo)}");

        if (string.IsNullOrEmpty(newTodo.Name))
        {
            return BadRequest("The 'Name' field is required.");
        }
        

        // Todo-Objekt in die Datenbank einfügen
        var todoToSave = new Todo
        {
            Name = newTodo.Name,
            Description = newTodo.Description,
            StartDate = newTodo.StartDate,
            DueDate = newTodo.DueDate,
            EndDate = newTodo.DueDate?.AddDays(-1),
            TodoStatus = newTodo.TodoStatus,
            Priority = newTodo.Priority,
            Complexity = newTodo.Complexity,
            Rewards = newTodo.Rewards,
            Notes = newTodo.Notes
        };

        _context.Todos.Add(todoToSave);
        await _context.SaveChangesAsync();

        return CreatedAtRoute("GetTodoById", new { id = todoToSave.Id }, todoToSave);
    }
    
    [HttpPut("{id}", Name = "UpdateTodo")]
    public async Task<IActionResult> UpdateTodo(Guid id, [FromBody] Todo updatedTodo)
    {
        if (updatedTodo == null || id == Guid.Empty)
        {
            return BadRequest("Invalid request.");
        }

        var existingTodo = await _context.Todos.FindAsync(id);

        if (existingTodo == null)
        {
            return NotFound(new { message = $"Todo with ID {id} not found." });
        }

        // Aktualisiere die Felder des bestehenden Todos
        existingTodo.Name = !string.IsNullOrEmpty(updatedTodo.Name) ? updatedTodo.Name : existingTodo.Name;
        existingTodo.Description = !string.IsNullOrEmpty(updatedTodo.Description) ? updatedTodo.Description : existingTodo.Description;
        existingTodo.StartDate = updatedTodo.StartDate != default ? updatedTodo.StartDate : existingTodo.StartDate;
        existingTodo.DueDate = updatedTodo.DueDate != default ? updatedTodo.DueDate : existingTodo.DueDate;
        existingTodo.EndDate = updatedTodo.DueDate != default ? updatedTodo.DueDate?.AddDays(-1) : existingTodo.EndDate;
        existingTodo.TodoStatus = updatedTodo.TodoStatus != default ? updatedTodo.TodoStatus : existingTodo.TodoStatus;
        existingTodo.Priority = updatedTodo.Priority != default ? updatedTodo.Priority : existingTodo.Priority;
        existingTodo.Complexity = updatedTodo.Complexity != default ? updatedTodo.Complexity : existingTodo.Complexity;
        existingTodo.Rewards = updatedTodo.Rewards != default ? updatedTodo.Rewards : existingTodo.Rewards;
        existingTodo.Notes = !string.IsNullOrEmpty(updatedTodo.Notes) ? updatedTodo.Notes : existingTodo.Notes;


        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Todo with ID {id} updated successfully.", todo = existingTodo });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the Todo.", details = ex.Message });
        }
    }

    
    
    [HttpDelete("{id}", Name = "DeleteTodo")]
    public async Task<IActionResult> DeleteTodo(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest(new { message = "Invalid ID. The ID cannot be null or empty." });
        }

        if (!Guid.TryParse(id, out Guid todoId))
        {
            return BadRequest(new { message = "Invalid ID format. The ID must be a valid UUID." });
        }

        try
        {
            var todo = await _context.Todos.FindAsync(todoId);
            if (todo == null)
            {
                return NotFound(new { message = $"Todo with ID {id} not found." });
            }

            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Todo with ID {id} deleted successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the Todo.", details = ex.Message });
        }
    }







}
