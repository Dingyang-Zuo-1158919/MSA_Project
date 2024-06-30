using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.ServiceContracts.DTO
{
    // DTO for removing a scenery from a user's collection.
    public class RemoveFromCollectionRequest
    {
        public int UserId { get; set; }
        public Guid SceneryId { get; set; }
    }
}