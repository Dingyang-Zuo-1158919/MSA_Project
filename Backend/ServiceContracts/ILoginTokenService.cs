using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Backend.Entities;

namespace Backend.ServiceContracts
{
    public interface ILoginTokenService
    {
        Task<string> GenerateTokenAsync(User user);
    }
}