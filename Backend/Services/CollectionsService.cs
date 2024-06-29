using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.Repositories;
using Backend.RepositoryContracts;
using Backend.ServiceContracts;
using Backend.ServiceContracts.DTO;
using Backend.Services.Helpers;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class CollectionsService(ApplicationDbContext db) : ICollectionsService
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<bool> AddToCollection(int userId, Guid sceneryId)
        {
            if (userId == default)
            {
                throw new ArgumentNullException(nameof(userId));
            }
            
            if (sceneryId == default)
            {
                throw new ArgumentNullException(nameof(sceneryId));
            }

            try
            {
                var existingCollection = await _db.Collections.FirstOrDefaultAsync(c => c.UserId == userId && c.SceneryId == sceneryId);
                if (existingCollection != null)
                {
                    return false;
                }

                var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
                var scenery = await _db.Sceneries.FirstOrDefaultAsync(s => s.SceneryId == sceneryId);

                if (user == null || scenery == null)
                {
                    throw new InvalidOperationException("User or Scenery not found in the database.");
                }

                var newCollection = new Collection
                {
                    UserId = userId,
                    SceneryId = sceneryId,
                    User = user,
                    Scenery = scenery
                };

                _db.Collections.Add(newCollection);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error adding scenery to collection.", ex);
            }
        }

        public async Task<bool> RemoveFromCollection(int userId, Guid sceneryId)
        {
            if (userId == default(int))
            {
                throw new ArgumentNullException(nameof(userId), "User ID cannot be 0");
            }

            if (sceneryId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(sceneryId), "User ID cannot be 0");
            }

            try
            {
                var collection = await _db.Collections.FirstOrDefaultAsync(
                    c => c.UserId == userId && c.SceneryId == sceneryId);

                if (collection == null)
                {
                    return false;
                }

                _db.Collections.Remove(collection);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error removing scenery from collection.", ex);
            }
        }

        public async Task<List<Scenery>> GetUserCollection(int userId)
        {
            if (userId == 0)
            {
                throw new ArgumentNullException(nameof(userId), "User ID cannot be null or 0");
            }

            try
            {
                var sceneries = await _db.Collections
                    .Where(c => c.UserId == userId)
                    .Select(c => c.Scenery)
                    .ToListAsync();
                return sceneries;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error retrieving user collection.", ex);
            }
        }

        public async Task<Collection> GetCollectionById(int userId, Guid sceneryId)
        {
            try
            {
                var collection = await _db.Collections
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.SceneryId == sceneryId);
                return collection;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error retrieving user collection.", ex);
            }
        }
    }
}