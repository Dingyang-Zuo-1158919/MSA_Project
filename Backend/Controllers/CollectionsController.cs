using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Backend.Entities;
using Backend.Models;
using Backend.ServiceContracts;
using Backend.Services;
using Backend.ServiceContracts.DTO;

namespace Backend.Controllers
{
    // Controller for managing user collections of sceneries
    public class CollectionsController : BaseApiController
    {
        private readonly ILogger<CollectionsController> _logger;
        private readonly ICollectionsService _collectionsService;

        // Constructor injection of logger and collections service
        public CollectionsController(ILogger<CollectionsController> logger, ICollectionsService collectionsService)
        {
            _logger = logger;
            _collectionsService = collectionsService;
        }

        // Endpoint to add a scenery to a user's collection
        [Authorize]
        [Route("[action]")]
        [HttpPost]
        public async Task<IActionResult> AddToCollection([FromBody] AddToCollectionRequest request)
        {
            try
            {
                var success = await _collectionsService.AddToCollection(request.UserId, request.SceneryId);
                if (success)
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adding to collection: {ex.Message}. Request: {request}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Endpoint to remove a scenery from a user's collection
        [Authorize]
        [Route("[action]")]
        [HttpDelete]
        public async Task<IActionResult> RemoveFromCollection([FromQuery] int userId, [FromQuery] Guid sceneryId)
        {
            try
            {
                var success = await _collectionsService.RemoveFromCollection(userId, sceneryId);
                if (success)
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error removing from collection: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Endpoint to retrieve a user's entire collection
        [Authorize]
        [Route("[action]")]
        [HttpGet]
        public async Task<IActionResult> UserCollection(int userId)
        {
            try
            {
                var collection = await _collectionsService.GetUserCollection(userId);
                return Ok(collection);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching user collection: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Endpoint to retrieve a specific scenery from a user's collection by ID
        [Authorize]
        [Route("[action]")]
        [HttpGet]
        public async Task<IActionResult> GetCollectionById(int userId, Guid sceneryId)
        {
            try
            {
                var collection = await _collectionsService.GetCollectionById(userId, sceneryId);
                if (collection != null)
                    return Ok(collection);
                else
                    return Ok(null); // Return null if collection not found
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching user collection: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }

}
