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
    public class SceneriesRepository(ApplicationDbContext db) : ISceneriesRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<Scenery> AddScenery(Scenery scenery)
        {
            _db.Sceneries.Add(scenery);
            await _db.SaveChangesAsync();
            return scenery;
        }


        public async Task<Scenery> UpdateScenery(Scenery scenery)
        {
            Scenery? matchingScenery = await _db.Sceneries.FirstOrDefaultAsync(temp =>
                temp.SceneryId == scenery.SceneryId);
            if (matchingScenery == null)
                return scenery;

            matchingScenery.SceneryId = scenery.SceneryId;
            matchingScenery.SceneryName = scenery.SceneryName;
            matchingScenery.Country = scenery.Country;
            matchingScenery.City = scenery.City;
            matchingScenery.ImageData = scenery.ImageData;
            matchingScenery.Comment = scenery.Comment;

            int rowsUpdated = await _db.SaveChangesAsync();

            return matchingScenery;
        }

        public async Task<bool> DeleteScenery(Guid? sceneryId)
        {
            _db.Sceneries.RemoveRange(_db.Sceneries.Where(temp =>
                temp.SceneryId == sceneryId));
            int rowsDeleted = await _db.SaveChangesAsync();

            return rowsDeleted > 0;
        }

        public async Task<Scenery?> GetSceneryBySceneryId(Guid sceneryId)
        {
            return await _db.Sceneries.FirstOrDefaultAsync(temp => temp.SceneryId == sceneryId);
        }

        public async Task<List<Scenery?>> GetSceneriesByUserId(int userId)
        {
            return await _db.Sceneries
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<Scenery>> GetAllSceneries()
        {
            return await _db.Sceneries.ToListAsync();
        }
    }
}