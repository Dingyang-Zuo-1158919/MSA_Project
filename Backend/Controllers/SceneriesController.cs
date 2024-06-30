using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.IO;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Backend.ServiceContracts;
using Backend.ServiceContracts.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;


namespace Backend.Controllers
{
    // Controller for managing sceneries
    public class SceneriesController : BaseApiController
    {
        private readonly ILogger<SceneriesController> _logger;
        private readonly ISceneriesService _sceneriesService;

        // Constructor injection of logger and sceneries service
        public SceneriesController(ILogger<SceneriesController> logger, ISceneriesService sceneriesService)
        {
            _logger = logger;
            _sceneriesService = sceneriesService;
        }

        // Endpoint to fetch all sceneries
        [Route("/")]
        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<List<SceneryResponse>>> Index()
        {
            List<SceneryResponse> sceneries = await _sceneriesService.GetAllSceneries();
            return sceneries;
        }

        // Endpoint to fetch a scenery by its ID
        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<SceneryResponse>> GetScenery(string? Id)
        {
            // Validate input parameters
            if (Id == null)
            {
                return BadRequest("sceneryId must be provided.");
            }

            if (!Guid.TryParse(Id, out Guid sceneryId))
            {
                return BadRequest("Invalid sceneryId format.");
            }
            
            // Retrieve scenery from service
            SceneryResponse? scenery = await _sceneriesService.GetSceneryBySceneryId(sceneryId);
            
            // Handle scenarios where scenery is not found
            if (scenery == null)
            {
                return NotFound();
            }

            return scenery;
        }

        // Endpoint to add a new scenery
        [Authorize]
        [Route("[action]")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddScenery([FromForm] SceneryAddRequest sceneryAddRequest)
        {
            // Validate incoming request
            if (sceneryAddRequest == null || sceneryAddRequest.ImageData == null || sceneryAddRequest.ImageData.Length == 0)
            {
                return BadRequest(new ProblemDetails { Title = "Invalid scenery or image data" });
            }

            // Call service method to add scenery
            var sceneryResponse = await _sceneriesService.AddScenery(sceneryAddRequest);
            return Ok(sceneryResponse);
        }

        // Endpoint to update an existing scenery
        [Authorize]
        [Route("[action]")]
        [HttpPut]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update([FromForm] SceneryUpdateRequest sceneryUpdateRequest)
        {
            // Validate if scenery exists
            var scenery = await _sceneriesService.GetSceneryBySceneryId(sceneryUpdateRequest.SceneryId);
            if (scenery == null)
            {
                return BadRequest("Scenery not found.");
            }

            // Ensure current user is authorized to update this scenery
            var loggedInUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (scenery.UserId != loggedInUserId)
            {
                return Forbid(); // Return 403 Forbidden if not authorized
            }
            // Validate model state
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Call service method to update scenery
                var updatedScenery = await _sceneriesService.UpdateScenery(sceneryUpdateRequest);
                return Ok(updatedScenery);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Endpoint to delete a scenery by its ID
        [Authorize]
        [Route("[action]")]
        [HttpDelete]
        public async Task<IActionResult> Delete(string? Id)
        {
            // Validate input parameters
            if (Id == null)
            {
                return BadRequest("the scenery does not exist.");
            }

            if (!Guid.TryParse(Id, out Guid sceneryId))
            {
                return BadRequest("Invalid sceneryId format.");
            }

            // Call service method to delete scenery
            bool result = await _sceneriesService.DeleteScenery(sceneryId);

            // Handle deletion failure
            if (!result)
            {
                return BadRequest("Failed to delete scenery.");
            }

            return Ok();
        }

        // Endpoint to fetch sceneries uploaded by a specific user
        [Authorize]
        [Route("[action]")]
        [HttpGet]
        public async Task<IActionResult> GetSceneriesByUserId(int userId)
        {
            try
            {
                // Validate user ID
                if (userId <= 0)
                {
                    return BadRequest("the scenery does not exist.");
                }

                // Call service method to fetch sceneries by user ID
                var sceneries = await _sceneriesService.GetSceneriesByUserId(userId);

                // Handle scenarios where sceneries are not found
                if (sceneries == null)
                {
                    return BadRequest("Failed to fetch your uploads.");
                }

                return Ok(sceneries);
            }
            catch (Exception ex)
            {
                // Handle internal server errors
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }
    }
}