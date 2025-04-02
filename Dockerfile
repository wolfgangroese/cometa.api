# Base image with SDK (für EF-Tools und Build)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Optional: EF-Tools installieren (für Migrationen)
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

# Projekt rein kopieren
COPY . .

# Restore & Build
RUN dotnet restore Cometa.Api/Cometa.Api.csproj
RUN dotnet publish Cometa.Api/Cometa.Api.csproj -c Release -o /app/publish

# Final image MIT SDK (damit dotnet ef im Container verfügbar ist)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS final
WORKDIR /app

# EF-Tools installieren
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

COPY --from=build /app/publish .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "Cometa.Api.dll"]
