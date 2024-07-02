using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using Backend.Models;
using Backend.Entities;
using Backend.ServiceContracts;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    // Controller for user authentication and management
    public class UsersController : BaseApiController
    {
        private readonly ILogger<UsersController> _logger;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILoginTokenService _loginTokenService;

        // Constructor injection of logger, UserManager, SignInManager, and LoginTokenService
        public UsersController(ILogger<UsersController> logger, UserManager<User> userManager, SignInManager<User> signInManager, ILoginTokenService loginTokenService)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _loginTokenService = loginTokenService;
        }

        // Endpoint for user registration
        [Route("[action]")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Create a new User object based on the registration model
                var user = new User { UserName = model.UserName, Email = model.Email };
                
                // Attempt to create the user with the provided password
                if (model.Password != null)
                {
                    var result = await _userManager.CreateAsync(user, model.Password);

                    // If user creation is successful, sign in the user and return user details
                    if (result.Succeeded)
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return Ok(new { UserId = user.Id, UserName = user.UserName });
                    }
                    else
                    {
                        return BadRequest("Strong Password needed");
                    }
                }
                else
                {
                    return BadRequest("Password cannot be null.");
                }
            }
            else
            {
                return BadRequest("Invalid Register information");
            }
        }

        // Endpoint for user login
        [Route("[action]")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            // Validate model state and credentials
            if (ModelState.IsValid && !string.IsNullOrEmpty(model.UserName) && !string.IsNullOrEmpty(model.Password))
            {
                // Attempt to sign in the user with provided credentials
                var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, isPersistent: false, lockoutOnFailure: false);
                _logger.LogInformation($"SignIn result: {result}");
                
                // If sign-in is successful, generate and return a JWT token
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(model.UserName);

                    if (user != null && user.UserName != null)
                    {
                        var token = _loginTokenService.GenerateTokenAsync(user);
                        return Ok(new { UserId = user.Id, UserName = user.UserName, Token = token });
                    }
                    else
                    {
                        return NotFound("User not found after successful sign-in.");
                    }
                }
                else if (result.IsLockedOut)
                {
                    return BadRequest("User account is locked out.");
                }
                else
                {
                    return Unauthorized("Invalid username or password.");
                }
            }
            return BadRequest(ModelState);
        }

    }
}