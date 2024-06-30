using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.ServiceContracts;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Backend.Entities;

namespace Backend.Services
{
    // Service class responsible for generating JWT tokens for user authentication.
    public class LoginTokenService : ILoginTokenService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        public LoginTokenService(IConfiguration configuration, UserManager<User> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
        }

        // Generates a JWT token for the provided user.
        public async Task<string> GenerateTokenAsync(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            return await Task.Run(() =>
            {
                // Create a new instance of JwtSecurityTokenHandler
                var tokenHandler = new JwtSecurityTokenHandler();

                // Retrieve secret key from configuration
                string secretKey = _configuration["JwtSettings:SecretKey"] ?? throw new InvalidOperationException("JwtSettings:SecretKey is missing or empty in configuration.");
                var key = Encoding.ASCII.GetBytes(secretKey);

                // Prepare claims for the JWT token
                var claims = new List<Claim>();

                // Add user Id as a claim
                if (!string.IsNullOrEmpty(user.Id.ToString()))
                {
                    claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
                }
                else
                {
                    throw new InvalidOperationException("User Id is null.");
                }

                // Add username as a claim
                if (!string.IsNullOrEmpty(user.UserName))
                {
                    claims.Add(new Claim(ClaimTypes.Name, user.UserName));
                }
                else
                {
                    throw new InvalidOperationException("User UserName is null.");
                }

                // Create a SecurityTokenDescriptor
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:ExpirationMinutes"])),
                    Issuer = _configuration["JwtSettings:Issuer"],
                    Audience = _configuration["JwtSettings:Audience"],
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                // Create a JWT token based on the token descriptor
                var token = tokenHandler.CreateToken(tokenDescriptor);

                // Write the token as a string
                return tokenHandler.WriteToken(token);
            });
        }

    }
}