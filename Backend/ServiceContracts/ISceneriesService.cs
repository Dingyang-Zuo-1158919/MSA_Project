using Backend.ServiceContracts.DTO;
using Backend.Entities;

namespace Backend.ServiceContracts
{
    public interface ISceneriesService
    {
        Task<SceneryResponse> AddScenery(SceneryAddRequest? sceneryAddRequest);
        Task<SceneryResponse> UpdateScenery(SceneryUpdateRequest? sceneryUpdateRequest);
        Task<bool> DeleteScenery (Guid? sceneryId);
        Task<SceneryResponse?> GetSceneryBySceneryId(Guid? sceneryId);
        Task<List<SceneryResponse?>> GetSceneriesByUserId(int userId);
        Task<List<SceneryResponse>> GetAllSceneries();

    }
}