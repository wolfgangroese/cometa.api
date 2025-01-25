using Cometa.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORS-Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policyBuilder =>
        {
            policyBuilder.WithOrigins("http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); // Falls Cookies oder Authentifizierung nötig sind
        });
});

// Add services to the container.
builder.Services.AddControllers();

// Configure DbContext
builder.Services.AddDbContext<CometaDbContext>(options =>
{
    // Verbindung zur Datenbank herstellen
    options.UseNpgsql(builder.Configuration.GetConnectionString("CometaDbContext"),
        b => b.MigrationsAssembly("Cometa.Persistence")); // Hier wird die Migrations-Assembly angegeben

    // Entwicklungsumgebung: Zusätzliche Logging-Optionen aktivieren
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});

// Swagger/OpenAPI konfigurieren
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();