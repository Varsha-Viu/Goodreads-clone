using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class UserBookCategory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public string BookId { get; set; }

        [Required]
        public string CategoryName { get; set; } // e.g., "currentlyReading"

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        //public Books Book { get; set; }
    }
}
