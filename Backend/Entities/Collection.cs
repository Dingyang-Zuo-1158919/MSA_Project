using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Entities
{
    // Represents a collection of scenery items for a user
    public class Collection
    {
        // UserId property represents the identifier of the user who owns the collection
        public int UserId { get; set; }

        // SceneryId property represents the identifier of the scenery in the collection
        public Guid SceneryId { get; set; }

        // Navigation property to the User entity related to this collection
        public User User { get; set; }

        // Navigation property to the Scenery entity related to this collection
        public Scenery Scenery { get; set; }
    }
}