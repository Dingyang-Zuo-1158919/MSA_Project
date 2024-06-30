using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.RepositoryContracts;
using Backend.ServiceContracts.DTO;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    // Repository class implementing ISceneriesRepository for managing Scenery entities
    public class SceneriesRepository(ApplicationDbContext db) : ISceneriesRepository
    {
        // Constructor to initialize the repository with an instance of ApplicationDbContext
        private readonly ApplicationDbContext _db = db;

        // Adds a new scenery to the database
        public async Task<Scenery> AddScenery(Scenery scenery)
        {
            _db.Sceneries.Add(scenery);
            await _db.SaveChangesAsync();
            return scenery;
        }

        // Updates an existing scenery in the database
        public async Task<Scenery> UpdateScenery(Scenery scenery)
        {
            // Find the matching scenery by sceneryId
            Scenery? matchingScenery = await _db.Sceneries.FirstOrDefaultAsync(temp =>
                temp.SceneryId == scenery.SceneryId);

            // If no matching scenery found, return the unchanged scenery
            if (matchingScenery == null)
                return scenery;

            // Update properties of the matching scenery with new values
            matchingScenery.SceneryId = scenery.SceneryId;
            matchingScenery.SceneryName = scenery.SceneryName;
            matchingScenery.Country = scenery.Country;
            matchingScenery.City = scenery.City;
            matchingScenery.ImageData = scenery.ImageData;
            matchingScenery.Comment = scenery.Comment;

            // Save changes to the database
            int rowsUpdated = await _db.SaveChangesAsync();

            return matchingScenery;
        }

        // Deletes a scenery from the database by sceneryId
        public async Task<bool> DeleteScenery(Guid? sceneryId)
        {
            // Remove all sceneries matching the provided sceneryId
            _db.Sceneries.RemoveRange(_db.Sceneries.Where(temp =>
                temp.SceneryId == sceneryId));

            // Save changes and check if any rows were affected
            int rowsDeleted = await _db.SaveChangesAsync();

            // Return true if rows were deleted, false otherwise
            return rowsDeleted > 0;
        }

        // Retrieves a scenery from the database by sceneryId
        public async Task<Scenery?> GetSceneryBySceneryId(Guid sceneryId)
        {
            return await _db.Sceneries.FirstOrDefaultAsync(temp => temp.SceneryId == sceneryId);
        }

        // Retrieves all sceneries belonging to a specific user from the database
        public async Task<List<Scenery?>> GetSceneriesByUserId(int userId)
        {
            return await _db.Sceneries
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        // Retrieves all sceneries from the database
        public async Task<List<Scenery>> GetAllSceneries()
        {
            return await _db.Sceneries.ToListAsync();
        }
    }
}