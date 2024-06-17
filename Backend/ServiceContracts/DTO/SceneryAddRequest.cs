using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;

namespace Backend.ServiceContracts.DTO
{
    public class SceneryAddRequest
    {
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
                SceneryName = this.SceneryName,
                Country = this.Country,
                City = this.City,
                ImageData = this.ImageData,
                Comment = this.Comment,
                // SceneryUploader = this.SceneryUploader
            };
        }
    }
}