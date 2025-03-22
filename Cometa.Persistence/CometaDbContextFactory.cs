using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Cometa.Persistence
{
    public class CometaDbContextFactory : IDesignTimeDbContextFactory<CometaDbContext>
    {
        public CometaDbContext CreateDbContext(string[] args)
        {
            // Get the directory of the executing assembly (usually the API project)
            var currentDirectory = Directory.GetCurrentDirectory();
            
            // Build configuration from appsettings
            var configuration = new ConfigurationBuilder()
                .SetBasePath(currentDirectory)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.Development.json", optional: true)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<CometaDbContext>();
            
            // Use the correct connection string key
            var connectionString = configuration.GetConnectionString("CometaDbContext");
            
            // Handle case where connection string might not be found
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException(
                    "Could not find connection string 'CometaDbContext' in the configuration.");
            }

            optionsBuilder.UseNpgsql(connectionString);

            return new CometaDbContext(optionsBuilder.Options);
        }
    }
}