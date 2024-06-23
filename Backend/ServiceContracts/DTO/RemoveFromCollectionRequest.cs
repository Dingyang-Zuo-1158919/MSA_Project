using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.ServiceContracts.DTO
{
    public class RemoveFromCollectionRequest
    {
        public int UserId { get; set; }
        public Guid SceneryId { get; set; }
    }
}