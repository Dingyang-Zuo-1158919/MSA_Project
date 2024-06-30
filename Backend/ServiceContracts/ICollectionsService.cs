using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;

namespace Backend.ServiceContracts
{
    // Interface defining service contract for managing user collections of Scenery entities
    public interface ICollectionsService
    {
        // Adds a scenery to the user's collection
        Task<bool> AddToCollection(int userId, Guid sceneryId);

        // Removes a scenery from the user's collection
        Task<bool> RemoveFromCollection(int userId, Guid sceneryId);

        // Retrieves all sceneries in the user's collection
        Task<List<Scenery>> GetUserCollection(int userId);

        // Retrieves a specific collection entry by userId and sceneryId
        Task<Collection> GetCollectionById(int userId, Guid sceneryId);
    }
}