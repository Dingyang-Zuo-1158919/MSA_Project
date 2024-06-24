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

    public class SceneriesController : BaseApiController
    {
        private readonly ILogger<SceneriesController> _logger;
        private readonly ISceneriesService _sceneriesService;

        public SceneriesController(ILogger<SceneriesController> logger, ISceneriesService sceneriesService)
        {
            _logger = logger;
            _sceneriesService = sceneriesService;
        }


        [Route("/")]
        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<List<SceneryResponse>>> Index()
        {
            List<SceneryResponse> sceneries = await _sceneriesService.GetAllSceneries();
            return sceneries;
        }

        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<SceneryResponse>> GetScenery(string? Id)
        {

            if (Id == null)
            {
                return BadRequest("sceneryId must be provided.");
            }

            if (!Guid.TryParse(Id, out Guid sceneryId))
            {
                return BadRequest("Invalid sceneryId format.");
            }

            SceneryResponse? scenery = await _sceneriesService.GetSceneryBySceneryId(sceneryId);

            if (scenery == null)
            {
                return NotFound();
            }

            return scenery;
        }

        [Authorize]
        [Route("[action]")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddScenery([FromForm] SceneryAddRequest sceneryAddRequest)
        {
            if (sceneryAddRequest == null || sceneryAddRequest.ImageData == null || sceneryAddRequest.ImageData.Length == 0)
            {
                return BadRequest(new ProblemDetails { Title = "Invalid scenery or image data" });
            }

            if (sceneryAddRequest == null)
            {
                return BadRequest(new ProblemDetails { Title = "Invalid scenery or image data" });
            }

            var sceneryResponse = await _sceneriesService.AddScenery(sceneryAddRequest);
            return Ok(sceneryResponse);
        }

        [Authorize]
        [Route("[action]")]
        [HttpPut]
        public async Task<IActionResult> Update(SceneryUpdateRequest sceneryUpdateRequest)
        {
            var scenery = await _sceneriesService.GetSceneryBySceneryId(sceneryUpdateRequest.SceneryId);
            if (scenery == null)
            {
                return BadRequest("Scenery not found.");
            }

            var loggedInUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (scenery.UserId != loggedInUserId)
            {
                return Forbid(); // Return 403 Forbidden if not authorized
            }

            if (!string.IsNullOrEmpty(sceneryUpdateRequest.SceneryName))
            {
                scenery.SceneryName = sceneryUpdateRequest.SceneryName;
            }

            if (!string.IsNullOrEmpty(sceneryUpdateRequest.Country))
            {
                scenery.Country = sceneryUpdateRequest.Country;
            }

            if (!string.IsNullOrEmpty(sceneryUpdateRequest.City))
            {
                scenery.City = sceneryUpdateRequest.City;
            }

            if (!string.IsNullOrEmpty(sceneryUpdateRequest.Comment))
            {
                scenery.Comment = sceneryUpdateRequest.Comment;
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedScenery = await _sceneriesService.UpdateScenery(sceneryUpdateRequest);
                return Ok(updatedScenery);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

        [Authorize]
        [Route("[action]")]
        [HttpDelete]
        public async Task<IActionResult> Delete(string? Id)
        {
            if (Id == null)
            {
                return BadRequest("the scenery does not exist.");
            }

            if (!Guid.TryParse(Id, out Guid sceneryId))
            {
                return BadRequest("Invalid sceneryId format.");
            }

            bool result = await _sceneriesService.DeleteScenery(sceneryId);

            if (!result)
            {
                return BadRequest("Failed to delete scenery.");
            }

            return Ok();
        }

        [Authorize]
        [Route("[action]")]
        [HttpGet]
        public async Task<IActionResult> GetSceneriesByUserId(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest("the scenery does not exist.");
                }

                var sceneries = await _sceneriesService.GetSceneriesByUserId(userId);

                if (sceneries == null)
                {
                    return BadRequest("Failed to fetch your uploads.");
                }

                return Ok(sceneries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }
    }
}