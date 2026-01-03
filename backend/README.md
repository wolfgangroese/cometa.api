# comet.API
backend repo for the culture-loving open mechanical turk 1.0

# persistence
commands to persist data in the database via terminal commands:
- dotnet ef migrations add <Name> -s Cometa.Api/ -p Cometa.Persistence/ -c CometaDbContext
- dotnet ef database update -s Cometa.Api/ -p Cometa.Persistence/

