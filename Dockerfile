# Build stage
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG TARGETARCH
WORKDIR /src

# Copy project files first for better caching
COPY *.sln .
COPY Cometa.Api/*.csproj Cometa.Api/
COPY Cometa.Domain/*.csproj Cometa.Domain/
COPY Cometa.Persistence/*.csproj Cometa.Persistence/
COPY Tests/Cometa.Api.Tests/*.csproj Tests/Cometa.Api.Tests/
COPY Tests/Cometa.Domain.Tests/*.csproj Tests/Cometa.Domain.Tests/
COPY Tests/Cometa.Persistence.Tests/*.csproj Tests/Cometa.Persistence.Tests/

# Restore for target architecture
RUN dotnet restore -a $TARGETARCH

# Copy everything and build
COPY . .
RUN dotnet publish Cometa.Api/Cometa.Api.csproj -c Release -a $TARGETARCH -o /app/publish --no-restore

# Runtime stage - use ASP.NET runtime image (much smaller)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "Cometa.Api.dll"]
