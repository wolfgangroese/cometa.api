using System.Security.Claims;
using Cometa.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Cometa.Domain.Services;
using Cometa.Persistence.Model;

var builder = WebApplication.CreateBuilder(args);

// CORS-Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddScoped<RewardService>();



// Configure DbContext for Identity
builder.Services.AddDbContext<CometaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("CometaDbContext"),
        b => b.MigrationsAssembly("Cometa.Persistence"))); 

// Add Identity services for ApplicationUser
builder.Services.AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole<Guid>>() // Explicitly use IdentityRole<Guid>
    .AddEntityFrameworkStores<CometaDbContext>()
    .AddDefaultTokenProviders();


// Get JWT Secret from different sources with priority
var secretKey = builder.Configuration["Jwt:SecretKey"] ?? 
                Environment.GetEnvironmentVariable("JWT_SECRET_KEY");

if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException(
        "JWT SecretKey is not configured. Please set it using User Secrets ('dotnet user-secrets set \"Jwt:SecretKey\" \"your-key\"') " +
        "or an environment variable ('JWT_SECRET_KEY').");
}

// Authentifizierung und JWT Token (optional, falls du JWT verwenden möchtest)
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            RoleClaimType = ClaimTypes.Role,
        };
    });


// Swagger/OpenAPI konfigurieren
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Füge hier die Datenbank-Migration ein
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CometaDbContext>();
    dbContext.Database.Migrate();
    Console.WriteLine("Database migrations applied successfully");
}

// Initialisiere Rollen und Admin-Benutzer bei App-Start
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>(); // Verwende hier ApplicationUser

    string[] roles = new[] { "Admin", "Staff", "Performer" };

    // Erstelle die Rollen, falls noch nicht vorhanden
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole <Guid> {Name = role});
        }
    }

    var adminUser = await userManager.FindByEmailAsync("admin@example.com");
    if (adminUser == null)
    {
        adminUser = new ApplicationUser
        {
            UserName = "admin@example.com",
            Email = "admin@example.com",
            FullName = "Admin User"
        };

        var result = await userManager.CreateAsync(adminUser, "Admin123!");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
        else
        {
            throw new InvalidOperationException("Admin-Benutzer konnte nicht erstellt werden.");
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();