using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class ReadingChallenge
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string UserId { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        public int TargetBooks { get; set; }

        public int CompletedBooks { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public Users User { get; set; }
    }

}
