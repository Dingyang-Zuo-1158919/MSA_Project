using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Entities
{
    public class Collection
    {
        public int UserId { get; set; }
        public Guid SceneryId { get; set; }
        public User User { get; set; }
        public Scenery Scenery { get; set; }
    }
}