using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Backend.ServiceContracts;
using Backend.ServiceContracts.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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
        [HttpPost]
        public async Task<IActionResult> AddScenery(SceneryAddRequest sceneryAddRequest)
        {
            if (!ModelState.IsValid)
            {
                List<SceneryResponse> sceneries = await _sceneriesService.GetAllSceneries();
                return BadRequest(new ProblemDetails{Title = "invalid scenery content"});
            }

            SceneryResponse sceneryResponse = await _sceneriesService.AddScenery(sceneryAddRequest);

            return RedirectToAction("Index", "Sceneries");
        }

        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<SceneryUpdateRequest>> Update(Guid sceneryId)
        {
            SceneryResponse? sceneryResponse = await _sceneriesService.GetSceneryBySceneryId(sceneryId);
            if (sceneryResponse == null)
            {
                return RedirectToAction("Index", "Sceneries");
            }

            SceneryUpdateRequest sceneryUpdateRequest = sceneryResponse.ToSceneryUpdateRequest();

            return sceneryUpdateRequest;
        }

        [Route("[action]")]
        [HttpPut]
        public async Task<ActionResult<SceneryUpdateRequest>> Update(SceneryUpdateRequest sceneryUpdateRequest)
        {
            SceneryResponse? sceneryResponse = await _sceneriesService.GetSceneryBySceneryId(sceneryUpdateRequest.SceneryId);
            if (sceneryUpdateRequest == null)
            {
                return RedirectToAction("Index", "Sceneries");
            }

            if (ModelState.IsValid)
            {
                SceneryResponse updateScenery = await _sceneriesService.UpdateScenery(sceneryUpdateRequest);
                return RedirectToAction("Index", "Sceneries");
            }
            else
            {
                return BadRequest(new ProblemDetails { Title = "This is a bad request" });
            }

        }

        [Route("[action]")]
        [HttpDelete]
        public async Task<IActionResult> Delete(SceneryUpdateRequest scenery)
        {
            SceneryResponse? sceneryResponse = await _sceneriesService.GetSceneryBySceneryId(scenery.SceneryId);
            if (sceneryResponse == null)
            {
                return RedirectToAction("Index", "Sceneries");
            }

            await _sceneriesService.DeleteScenery(sceneryResponse.SceneryId);
            return RedirectToAction("Index", "Sceneries");
        }
    }
}