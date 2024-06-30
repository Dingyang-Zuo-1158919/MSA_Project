using System.Linq.Expressions;
using Backend.Entities;
using Backend.ServiceContracts.DTO;

namespace Backend.RepositoryContracts
{
    // Interface defining repository contract for managing Scenery entities
    public interface ISceneriesRepository
    {
        // Adds a new scenery to the repository
        Task<Scenery> AddScenery(Scenery scenery);

        // Updates an existing scenery in the repository
        Task<Scenery> UpdateScenery(Scenery scenery);

        // Deletes a scenery from the repository by sceneryId
        Task<bool> DeleteScenery (Guid? sceneryId);

        // Retrieves a scenery from the repository by sceneryId
        Task<Scenery?> GetSceneryBySceneryId(Guid sceneryId);

        // Retrieves all sceneries belonging to a specific user from the repository
        Task<List<Scenery?>> GetSceneriesByUserId(int userId);

        // Retrieves all sceneries from the repository
        Task<List<Scenery>> GetAllSceneries();
    }
}