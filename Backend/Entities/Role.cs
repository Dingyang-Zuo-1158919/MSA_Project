using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Backend.Entities
{
    // Represents a role entity in the application, inherits from IdentityRole<int>
    public class Role :  IdentityRole<int>
    {
        // No additional properties or methods are defined in this class
        // IdentityRole<int> provides all necessary properties and methods for role management
    }
}