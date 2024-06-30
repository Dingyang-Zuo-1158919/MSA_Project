using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Backend.Entities
{
    // Represents a user entity in the application, inherits from IdentityUser<int>
    public class User : IdentityUser<int>
    {
        // Navigation property representing the list of scenery uploads by this user
        public List<Scenery> Uploads { get; set; } = new List<Scenery>();

        // Navigation property representing the list of collections owned by this user
        public List<Collection> Collection { get; set; } = new List<Collection>();

    }
}