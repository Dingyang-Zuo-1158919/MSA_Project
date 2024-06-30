using Backend.ServiceContracts.DTO;
using Backend.Entities;

namespace Backend.ServiceContracts
{
    // Interface defining service contract for managing Scenery entities
    public interface ISceneriesService
    {
        // Adds a new scenery based on the provided request
        Task<SceneryResponse> AddScenery(SceneryAddRequest? sceneryAddRequest);

        // Updates an existing scenery based on the provided update request
        Task<SceneryResponse> UpdateScenery(SceneryUpdateRequest? sceneryUpdateRequest);

        // Deletes a scenery by its unique identifier
        Task<bool> DeleteScenery (Guid? sceneryId);

        // Retrieves a scenery by its unique identifier
        Task<SceneryResponse?> GetSceneryBySceneryId(Guid? sceneryId);

        // Retrieves all sceneries uploaded by a specific user
        Task<List<SceneryResponse?>> GetSceneriesByUserId(int userId);

        // Retrieves all sceneries from the repository
        Task<List<SceneryResponse>> GetAllSceneries();
    }
}