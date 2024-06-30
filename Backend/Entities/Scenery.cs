using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.ServiceContracts.DTO;

namespace Backend.Entities
{
    // Represents a scenery entity in the application
    public class Scenery
    {
        [Key]
        public Guid SceneryId { get; set; } // Primary key for the scenery entity
        [Required]
        public string SceneryName { get; set; } // Name of the scenery, required field
        [Required]
        public string Country { get; set; } // Country where the scenery is located, required field
        public string? City { get; set; } // City where the scenery is located, nullable
        [Required]
        public byte[]? ImageData { get; set; } // Binary data of the scenery image, nullable
        public string? Comment { get; set; } // Optional comment or description of the scenery, nullable
        public int UserId { get; set; } // Foreign key to identify the user who uploaded the scenery

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; } // Navigation property to the User entity associated with this scenery

        // Constructor to initialize default values
        public Scenery()
        {
            SceneryName = string.Empty;
            Country = string.Empty;
        }
    }
}