using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.ServiceContracts.DTO
{
    // DTO for adding a scenery to a user's collection.
    public class AddToCollectionRequest
    {
        public int UserId { get; set; }
        public Guid SceneryId { get; set; }
    }
}