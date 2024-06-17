using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.Repositories;
using Backend.RepositoryContracts;
using Backend.ServiceContracts;
using Backend.ServiceContracts.DTO;
using Backend.Services.Helpers;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;

namespace Backend.Services
{
    public class SceneriesService(ISceneriesRepository sceneriesRepository) : ISceneriesService
    {
        private readonly ISceneriesRepository _sceneriesRepository = sceneriesRepository;

        public async Task<SceneryResponse> AddScenery(SceneryAddRequest? sceneryAddRequest)
        {
            ArgumentNullException.ThrowIfNull(sceneryAddRequest);
            ValidationHelper.ModelValidation(sceneryAddRequest);

            Scenery scenery = sceneryAddRequest.ToScenery();
            scenery.SceneryId = Guid.NewGuid();

            await _sceneriesRepository.AddScenery(scenery);

            return scenery.ToSceneryResponse();
        }

        public async Task<SceneryResponse> UpdateScenery(SceneryUpdateRequest? sceneryUpdateRequest)
        {
            ArgumentNullException.ThrowIfNull(sceneryUpdateRequest);
            ValidationHelper.ModelValidation(sceneryUpdateRequest);

            Scenery? matchingScenery = await _sceneriesRepository.GetSceneryBySceneryId(sceneryUpdateRequest.SceneryId);
            ArgumentNullException.ThrowIfNull(matchingScenery);
            
            matchingScenery.SceneryId = sceneryUpdateRequest.SceneryId;
            matchingScenery.SceneryName = sceneryUpdateRequest.SceneryName;
            matchingScenery.Country = sceneryUpdateRequest.Country;
            matchingScenery.City = sceneryUpdateRequest.City;
            matchingScenery.ImageData = sceneryUpdateRequest.ImageData;
            matchingScenery.Comment = sceneryUpdateRequest.Comment;

            await _sceneriesRepository.UpdateScenery(matchingScenery);

            return matchingScenery.ToSceneryResponse();
        }

        public async Task<bool> DeleteScenery(Guid? sceneryId)
        {
            ArgumentNullException.ThrowIfNull(sceneryId);
            Scenery? scenery = await _sceneriesRepository.GetSceneryBySceneryId(sceneryId.Value);

            if (scenery == null)
                return false;

            await _sceneriesRepository.DeleteScenery(sceneryId.Value);
            return true;
        }

        public async Task<SceneryResponse?> GetSceneryBySceneryId(Guid? sceneryId)
        {
            ArgumentNullException.ThrowIfNull(sceneryId);
            Scenery? scenery = await _sceneriesRepository.GetSceneryBySceneryId(sceneryId.Value);
            if (scenery == null)
                return null;

            return scenery.ToSceneryResponse();
        }
        
        public async Task<List<SceneryResponse>> GetAllSceneries()
        {
            var sceneries = await _sceneriesRepository.GetAllSceneries();
            return sceneries.Select(temp => temp.ToSceneryResponse()).ToList();
        }

    }
}