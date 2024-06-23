using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.ServiceContracts.DTO
{
    public class SceneryUpdateRequest
    {
        public Guid SceneryId { get; set; }
        [Required]
        public string SceneryName { get; set; }
        [Required]
        public string Country { get; set; }
        public string? City { get; set; }
        public byte[]? ImageData { get; set; }
        public string? Comment { get; set; }
        [Required]
        public int UserId { get; set; }

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
                UserId = UserId,
            };
        }
    }
}