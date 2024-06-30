# Stage 1: Build .NET Application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj files and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy entire project and publish
COPY . ./
RUN dotnet publish -c Release -o out

# Stage 2: Serve .NET Application
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/out .

# Expose port 80 for HTTP traffic
EXPOSE 80

# Command to run the application
CMD ["dotnet", "Backend.dll"]