# Stage 1: Serve .NET Application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 As base
WORKDIR /app

# Expose port 80 for HTTP traffic
EXPOSE 80
# Expose port 443 for HTTPS traffic
EXPOSE 443

# Install curl (or wget)
RUN apt-get update && apt-get install -y curl

# Copy Certificates.p12 from local machine to container
COPY Certificates.p12 /app/Certificates.p12

# Stage 2: Build .NET Application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
ENV DOTNET_EnableWriteXorExecute=0
WORKDIR /src

# Copy csproj files and restore dependencies
COPY Backend.csproj .
RUN dotnet restore Backend.csproj

# Copy entire project and publish
COPY . .
WORKDIR /src
# RUN dotnet build Backend.csproj -c Release -o /app/build


# FROM build-env AS publish
RUN dotnet publish Backend.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
# COPY --from=publish /app/publish .
COPY --from=build-env /app/publish .
# ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
ENTRYPOINT ["dotnet", "Backend.dll"]