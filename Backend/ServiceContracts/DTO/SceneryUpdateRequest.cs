using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.ServiceContracts.DTO
{
    // Represents the DTO class for updating a scenery.
    public class SceneryUpdateRequest
    {
        public Guid SceneryId { get; set; }
        [Required]
        public string SceneryName { get; set; } = string.Empty;
        [Required]
        public string Country { get; set; } = string.Empty;
        public string? City { get; set; }
        public IFormFile? ImageData { get; set; }
        public string? Comment { get; set; }
        [Required]
        public int UserId { get; set; }

        // Converts this object to a Scenery entity object.
        public Scenery ToScenery()
        {
            return new Scenery()
            {
                SceneryId = SceneryId,
                SceneryName = SceneryName,
                Country = Country,
                City = City,
                Comment = Comment,
                UserId = UserId,
            };
        }
    }
}