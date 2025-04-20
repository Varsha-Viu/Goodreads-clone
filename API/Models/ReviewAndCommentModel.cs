using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class AddReviewModel
    {
        [Required]
        public string BookId { get; set; }

        [Required]
        public string UserId { get; set; }

        [Range(0, 5)]
        public int? Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }
    }
}
