using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.ServiceContracts.DTO
{
    public class SceneryAddRequest
    {
        [Required]
        public string SceneryName { get; set; } = string.Empty;
        [Required]
        public string Country { get; set; } = string.Empty;
        public string? City { get; set; }
        public byte[]? ImageData { get; set; }
        public string? Comment { get; set; }
        [Required]
        public int UserId { get; set; }

        public Scenery ToScenery()
        {
            return new Scenery()
            {
                SceneryName = this.SceneryName,
                Country = this.Country,
                City = this.City,
                ImageData = this.ImageData,
                Comment = this.Comment,
                UserId = this.UserId,
            };
        }
    }
}