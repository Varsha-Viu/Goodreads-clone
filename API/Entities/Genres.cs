using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Genres
    {
        [Key]
        public string GenreId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
