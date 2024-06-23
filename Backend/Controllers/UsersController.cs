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
    public class UsersController : BaseApiController
    {
        private readonly ILogger<UsersController> _logger;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILoginTokenService _loginTokenService;

        public UsersController(ILogger<UsersController> logger, UserManager<User> userManager, SignInManager<User> signInManager, ILoginTokenService loginTokenService)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _loginTokenService = loginTokenService;
        }

        [Route("[action]")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new User { UserName = model.UserName, Email = model.Email };

                if (model.Password != null)
                {
                    var result = await _userManager.CreateAsync(user, model.Password);

                    if (result.Succeeded)
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return Ok(new { UserId = user.Id, UserName = user.UserName });
                    }
                    else
                    {
                        return BadRequest(result.Errors);
                    }
                }
                else
                {
                    return BadRequest("Password cannot be null.");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [Route("[action]")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid && !string.IsNullOrEmpty(model.UserName) && !string.IsNullOrEmpty(model.Password))
            {
                var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, isPersistent: false, lockoutOnFailure: false);
                _logger.LogInformation($"SignIn result: {result}");
                
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