using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Backend.Entities;
using Backend.Repositories;
using Backend.RepositoryContracts;
using Backend.ServiceContracts;
using Backend.ServiceContracts.DTO;
using Backend.Services.Helpers;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;
using Azure.Storage.Blobs;

namespace Backend.Services
{
    public class SceneriesService(ISceneriesRepository sceneriesRepository, IConfiguration configuration) : ISceneriesService
    {
        private readonly ISceneriesRepository _sceneriesRepository = sceneriesRepository;
        private readonly IConfiguration _configuration = configuration;

        public async Task<SceneryResponse> AddScenery(SceneryAddRequest sceneryAddRequest)
        {
            ArgumentNullException.ThrowIfNull(sceneryAddRequest);
            ValidationHelper.ModelValidation(sceneryAddRequest);

            byte[] imageData;

            using (MemoryStream memoryStream = new MemoryStream())
            {
                await sceneryAddRequest.ImageData.CopyToAsync(memoryStream);
                imageData = memoryStream.ToArray();
            }

            var scenery = new Scenery
            {
                SceneryId = Guid.NewGuid(),
                SceneryName = sceneryAddRequest.SceneryName,
                Country = sceneryAddRequest.Country,
                City = sceneryAddRequest.City,
                ImageData = imageData,
                Comment = sceneryAddRequest.Comment,
                UserId = sceneryAddRequest.UserId
            };

            await _sceneriesRepository.AddScenery(scenery);
            var result = scenery.ToSceneryResponse();
            return result;
        }

        public async Task<SceneryResponse> UpdateScenery(SceneryUpdateRequest? sceneryUpdateRequest)
        {
            ArgumentNullException.ThrowIfNull(sceneryUpdateRequest);
            ValidationHelper.ModelValidation(sceneryUpdateRequest);

            byte[] imageData = null;

            if (sceneryUpdateRequest.ImageData != null)
            {
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    await sceneryUpdateRequest.ImageData.CopyToAsync(memoryStream);
                    imageData = memoryStream.ToArray();
                }
            }

            Scenery matchingScenery = await _sceneriesRepository.GetSceneryBySceneryId(sceneryUpdateRequest.SceneryId);
            ArgumentNullException.ThrowIfNull(matchingScenery);

            matchingScenery.SceneryId = sceneryUpdateRequest.SceneryId;
            matchingScenery.SceneryName = sceneryUpdateRequest.SceneryName;
            matchingScenery.Country = sceneryUpdateRequest.Country;
            matchingScenery.City = sceneryUpdateRequest.City;
            matchingScenery.Comment = sceneryUpdateRequest.Comment;
            if (imageData != null)
            {
                matchingScenery.ImageData = imageData;
            }


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

        public async Task<List<SceneryResponse?>> GetSceneriesByUserId(int userId)
        {
            ArgumentNullException.ThrowIfNull(userId);
            List<Scenery?> sceneries = await _sceneriesRepository.GetSceneriesByUserId(userId);
            if (sceneries == null)
                return null;

            List<SceneryResponse> sceneryResponses = sceneries.Select(scenery => scenery.ToSceneryResponse()).ToList();
            return sceneryResponses;
        }

        public async Task<List<SceneryResponse>> GetAllSceneries()
        {
            var sceneries = await _sceneriesRepository.GetAllSceneries();
            return sceneries.Select(temp => temp.ToSceneryResponse()).ToList();
        }
    }
}