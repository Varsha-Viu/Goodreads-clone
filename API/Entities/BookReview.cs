using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class BookReview
    {
        [Key]
        public string ReviewId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string BookId { get; set; }

        [Required]
        public string UserId { get; set; }

        [Range(1, 5)]
        public int? Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }

}
