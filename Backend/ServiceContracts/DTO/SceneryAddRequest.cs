using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.ServiceContracts.DTO
{
    // DTO class representing a request to add a new scenery
    public class SceneryAddRequest
    {
        [Required]
        public string SceneryName { get; set; } = string.Empty;
        [Required]
        public string Country { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? Comment { get; set; }
        [Required]
        public int UserId { get; set; }
        public IFormFile ImageData { get; set; } = default!; // Represents the image data of the scenery

        // Converts the DTO object to a Scenery entity object
        public Scenery ToScenery()
        {
            return new Scenery()
            {
                SceneryName = this.SceneryName,
                Country = this.Country,
                City = this.City,
                Comment = this.Comment,
                UserId = this.UserId,
            };
        }
    }
}