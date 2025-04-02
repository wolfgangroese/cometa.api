using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Cometa.Persistence
{
    public class CometaDbContextFactory : IDesignTimeDbContextFactory<CometaDbContext>
    {
        public CometaDbContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            var currentDirectory = Directory.GetCurrentDirectory();

            var configuration = new ConfigurationBuilder()
                .SetBasePath(currentDirectory)
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetConnectionString("CometaDbContext");
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException(
                    $"Connection string 'CometaDbContext' not found for environment '{environment}'.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<CometaDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new CometaDbContext(optionsBuilder.Options);
        }
    }
}