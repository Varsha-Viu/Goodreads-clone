using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Books
    {
        [Key]
        public string BookId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public string? CoverImageUrl { get; set; }


        [Required]
        public string AuthorId { get; set; }

        public DateTime? PublishedDate { get; set; }

        public string? Language { get; set; }
        public string? PublicationYear { get; set; }

        public int? PageCount { get; set; }

        public string? ISBN { get; set; }
        [Required]
        public string? GenreId { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; } 
    }
}
