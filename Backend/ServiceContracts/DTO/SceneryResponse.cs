using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;

namespace Backend.ServiceContracts.DTO
{
    public class SceneryResponse
    {
        public Guid SceneryId { get; set; }
        public required string SceneryName { get; set; }
        public required string Country { get; set; }
        public string? City { get; set; }
        public byte[]? ImageData { get; set; }
        public string? Comment { get; set; }
        // public required User SceneryUploader { get; set; }

        public SceneryUpdateRequest ToSceneryUpdateRequest()
        {
            return new SceneryUpdateRequest()
            {
                SceneryId = SceneryId,
                SceneryName = SceneryName,
                Country = Country,
                City = City,
                ImageData = ImageData,
                Comment = Comment,
                // SceneryUploader = SceneryUploader
            };
        }
    }

    public static class SceneryExtensions
    {
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
                // SceneryUploader = scenery.SceneryUploader
            };
        }
    }
}