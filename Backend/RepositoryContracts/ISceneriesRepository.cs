using System.Linq.Expressions;
using Backend.Entities;
using Backend.ServiceContracts.DTO;

namespace Backend.RepositoryContracts
{
    public interface ISceneriesRepository
    {
        Task<Scenery> AddScenery(Scenery scenery);
        Task<Scenery> UpdateScenery(Scenery scenery);
        Task<bool> DeleteScenery (Guid? sceneryId);
        Task<Scenery?> GetSceneryBySceneryId(Guid sceneryId);
        Task<List<Scenery?>> GetSceneriesByUserId(int userId);
        Task<List<Scenery>> GetAllSceneries();
    }
}