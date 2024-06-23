using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;

namespace Backend.ServiceContracts
{
    public interface ICollectionsService
    {
        Task<bool> AddToCollection(int userId, Guid sceneryId);
        Task<bool> RemoveFromCollection(int userId, Guid sceneryId);
        Task<List<Scenery>> GetUserCollection(int userId);
        Task<Collection> GetCollectionById(int userId, Guid sceneryId);
    }
}