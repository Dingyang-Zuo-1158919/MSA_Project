using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    // ApiController attribute marks this class as an API controller
    // Route attribute defines the base route for all endpoints in this controller
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        // This class acts as a base for other API controllers in the project.
        // It provides common functionality or properties that are shared across multiple controllers.

        // By inheriting ControllerBase, this class gains access to various helper methods
        // and properties provided by ASP.NET Core MVC for handling HTTP requests and responses.

    }
}