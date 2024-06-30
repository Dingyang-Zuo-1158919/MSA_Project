using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.ServiceContracts.DTO
{
    // Represents the DTO class for a scenery response.
    public class SceneryResponse
    {
        public Guid SceneryId { get; set; }
        [Required]
        public string SceneryName { get; set; } = string.Empty;
        [Required]
        public string Country { get; set; } = string.Empty;
        public string? City { get; set; }
        public byte[]? ImageData { get; set; }
        public string? Comment { get; set; }
        [Required]
        public int UserId { get; set; }

        // Converts this object to a SceneryUpdateRequest object.
        public SceneryUpdateRequest ToSceneryUpdateRequest()
        {
            return new SceneryUpdateRequest
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

    // Extension methods for Scenery entity class.
    public static class SceneryExtensions
    {
        // Converts a Scenery entity object to a SceneryResponse DTO object.
        public static SceneryResponse ToSceneryResponse(this Scenery scenery)
        {
            return new SceneryResponse()
            {
                SceneryId = scenery.SceneryId,
                SceneryName = scenery.SceneryName,
                Country = scenery.Country,
                City = scenery.City,
                ImageData = scenery.ImageData,
                Comment = scenery.Comment,
                UserId = scenery.UserId,
            };
        }
    }
}