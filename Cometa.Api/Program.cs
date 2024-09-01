using Cometa.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<CometaDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("CometaDbContext"))
        .UseSnakeCaseNamingConvention();
    if (builder.Environment.IsDevelopment())
    {
        _ = options.EnableSensitiveDataLogging();
        _ = options.EnableDetailedErrors();
    }
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();