using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;

namespace Backend.ServiceContracts.DTO
{
    public class SceneryUpdateRequest
    {
        public Guid SceneryId { get; set; }
        public required string SceneryName { get; set; }
        public required string Country { get; set; }
        public string? City { get; set; }
        public byte[]? ImageData { get; set; }
        public string? Comment { get; set; }
        // public required User SceneryUploader { get; set; }

        public Scenery ToScenery()
        {
            return new Scenery()
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
}