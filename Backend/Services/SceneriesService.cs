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
    // Service class for managing sceneries, implementing business logic related to sceneries.
    public class SceneriesService(ISceneriesRepository sceneriesRepository, IConfiguration configuration) : ISceneriesService
    {
        private readonly ISceneriesRepository _sceneriesRepository = sceneriesRepository;
        private readonly IConfiguration _configuration = configuration;

        // Adds a new scenery to the database.
        public async Task<SceneryResponse> AddScenery(SceneryAddRequest sceneryAddRequest)
        {
            ArgumentNullException.ThrowIfNull(sceneryAddRequest);
            ValidationHelper.ModelValidation(sceneryAddRequest);

            byte[] imageData;

            // Convert received image from IFormFile to byte[]
            using (MemoryStream memoryStream = new MemoryStream())
            {
                await sceneryAddRequest.ImageData.CopyToAsync(memoryStream);
                imageData = memoryStream.ToArray();
            }

            // Create new Scenery object
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
            
            // Add scenery to repository
            await _sceneriesRepository.AddScenery(scenery);

            // Return response containing added scenery details
            var result = scenery.ToSceneryResponse();
            return result;
        }

        // Updates an existing scenery in the database.
        public async Task<SceneryResponse> UpdateScenery(SceneryUpdateRequest? sceneryUpdateRequest)
        {
            ArgumentNullException.ThrowIfNull(sceneryUpdateRequest);
            ValidationHelper.ModelValidation(sceneryUpdateRequest);

            byte[] imageData = null;

            // Convert received image from IFormFile to byte[] if provided
            if (sceneryUpdateRequest.ImageData != null)
            {
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    await sceneryUpdateRequest.ImageData.CopyToAsync(memoryStream);
                    imageData = memoryStream.ToArray();
                }
            }

            // Retrieve existing scenery from repository
            Scenery matchingScenery = await _sceneriesRepository.GetSceneryBySceneryId(sceneryUpdateRequest.SceneryId);
            ArgumentNullException.ThrowIfNull(matchingScenery);

            // Update scenery properties
            matchingScenery.SceneryId = sceneryUpdateRequest.SceneryId;
            matchingScenery.SceneryName = sceneryUpdateRequest.SceneryName;
            matchingScenery.Country = sceneryUpdateRequest.Country;
            matchingScenery.City = sceneryUpdateRequest.City;
            matchingScenery.Comment = sceneryUpdateRequest.Comment;
            // Update image data if provided
            if (imageData != null)
            {
                matchingScenery.ImageData = imageData;
            }

            // Update scenery in repository
            await _sceneriesRepository.UpdateScenery(matchingScenery);

            // Return response containing updated scenery details
            return matchingScenery.ToSceneryResponse();
        }

        // Deletes a scenery from the database.
        public async Task<bool> DeleteScenery(Guid? sceneryId)
        {
            ArgumentNullException.ThrowIfNull(sceneryId);

            // Retrieve scenery from repository
            Scenery? scenery = await _sceneriesRepository.GetSceneryBySceneryId(sceneryId.Value);

            if (scenery == null)
                return false;

            // Delete scenery from repository
            await _sceneriesRepository.DeleteScenery(sceneryId.Value);
            return true;
        }

        // Retrieves a scenery by its ID from the database.
        public async Task<SceneryResponse?> GetSceneryBySceneryId(Guid? sceneryId)
        {
            ArgumentNullException.ThrowIfNull(sceneryId);

            // Retrieve scenery from repository
            Scenery? scenery = await _sceneriesRepository.GetSceneryBySceneryId(sceneryId.Value);
            if (scenery == null)
                return null;

            // Return response containing retrieved scenery details
            return scenery.ToSceneryResponse();
        }

        // Retrieves all sceneries belonging to a user from the database.
        public async Task<List<SceneryResponse?>> GetSceneriesByUserId(int userId)
        {
            ArgumentNullException.ThrowIfNull(userId);

            // Retrieve sceneries from repository
            List<Scenery?> sceneries = await _sceneriesRepository.GetSceneriesByUserId(userId);
            if (sceneries == null)
                return null;

            // Convert sceneries to responses and return
            List<SceneryResponse> sceneryResponses = sceneries.Select(scenery => scenery.ToSceneryResponse()).ToList();
            return sceneryResponses;
        }

        // Retrieves all sceneries from the database.
        public async Task<List<SceneryResponse>> GetAllSceneries()
        {
            // Retrieve all sceneries from repository
            var sceneries = await _sceneriesRepository.GetAllSceneries();

            if (sceneries == null)
            {
                return new List<SceneryResponse>();
            }

            // Convert sceneries to responses and return
            return sceneries.Select(temp => temp.ToSceneryResponse()).ToList();
        }
    }
}