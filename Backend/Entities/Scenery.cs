using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class Scenery
    {
        [Key]
        public Guid SceneryId { get; set; }

        public required string SceneryName { get; set; }
        public required string Country { get; set; }
        public string? City { get; set; }
        public byte[]? ImageData { get; set; }
        public string? Comment { get; set; }
        // public required User SceneryUploader { get; set; }
    }
}