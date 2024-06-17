using Backend.ServiceContracts.DTO;

namespace Backend.ServiceContracts
{
    public interface ISceneriesService
    {
        Task<SceneryResponse> AddScenery(SceneryAddRequest? sceneryAddRequest);
        Task<SceneryResponse> UpdateScenery(SceneryUpdateRequest? sceneryUpdateRequest);
        Task<bool> DeleteScenery (Guid? sceneryId);
        Task<SceneryResponse?> GetSceneryBySceneryId(Guid? sceneryId);
        Task<List<SceneryResponse>> GetAllSceneries();

    }
}