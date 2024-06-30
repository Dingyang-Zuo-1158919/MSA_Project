using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Backend.Entities;

namespace Backend.ServiceContracts
{
    // Interface defining service contract for generating JWT tokens for user authentication
    public interface ILoginTokenService
    {
        // Generates a JWT token for the specified user
        Task<string> GenerateTokenAsync(User user);
    }
}