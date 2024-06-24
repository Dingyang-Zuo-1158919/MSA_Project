using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.ServiceContracts.DTO;

namespace Backend.Entities
{
    public class Scenery
    {
        [Key]
        public Guid SceneryId { get; set; }
        [Required]
        public string SceneryName { get; set; }
        [Required]
        public string Country { get; set; }
        public string? City { get; set; }
        [Required]
        public byte[]? ImageData { get; set; }
        public string? Comment { get; set; }
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public Scenery()
        {
            SceneryName = string.Empty;
            Country = string.Empty;
        }
    }
}