using System;
using Backend.Entities;
using Backend.Repositories;
using Backend.RepositoryContracts;
using Backend.ServiceContracts;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register services and repositories for dependency injection.
builder.Services.AddScoped<ISceneriesService, SceneriesService>();
builder.Services.AddScoped<ISceneriesRepository, SceneriesRepository>();
builder.Services.AddScoped<ICollectionsService, CollectionsService>();

// Configure the application's DbContext with SQL Server and retry policy.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("ApplicationDbContext"),
    sqlServerOptions =>
    {
        sqlServerOptions.CommandTimeout(120);
        sqlServerOptions.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(5), errorNumbersToAdd: null);
    }
    );
});

// Configure CORS policy for allowing requests from specified origins.
builder.Services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy",
            builder => builder
                .WithOrigins("http://localhost:8080", "http://frontend:8080")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
    });

// Configures Https
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 8082;
});

// Configure Identity with custom password policies and JWT authentication.
builder.Services.AddIdentity<User, IdentityRole<int>>(opt =>
{
    opt.SignIn.RequireConfirmedAccount = false;
    opt.User.RequireUniqueEmail = true;
    opt.Password.RequiredLength = 8;
    opt.Password.RequireDigit = true;
    opt.Password.RequireLowercase = true;
})
    .AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configure JWT authentication scheme.
string secretKey = builder.Configuration["JwtSettings:SecretKey"] ?? throw new InvalidOperationException("JwtSettings:SecretKey is missing or empty in configuration.");
string issuer = builder.Configuration["JwtSettings:Issuer"] ?? throw new InvalidOperationException("JwtSettings:Issuer is missing or empty in configuration.");
string audience = builder.Configuration["JwtSettings:Audience"] ?? throw new InvalidOperationException("JwtSettings:Audience is missing or empty in configuration.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey))
            };
        });

// Configure default authorization policy requiring authentication.
builder.Services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
    .RequireAuthenticatedUser()
    .Build();
});

// Register custom service for generating login tokens.
builder.Services.AddScoped<ILoginTokenService, LoginTokenService>();

// Add API explorer and Swagger generation.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure logging to include console output.
builder.Logging.AddConsole();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Enable Swagger UI for development environment.
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure middleware for HTTPS redirection, routing, CORS, authentication, and authorization.
app.UseHttpsRedirection();
app.UseRouting();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Map controllers endpoints.
app.MapControllers();

// Start the application.
app.Run();
