using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Backend.Entities
{
    public class User : IdentityUser<int>
    {
        public List<Scenery> Uploads { get; set; } = new List<Scenery>();
        public List<Collection> Collection { get; set; } = new List<Collection>();

    }
}