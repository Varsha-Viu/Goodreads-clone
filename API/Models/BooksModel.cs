using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class CreateGenreModel
    {
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
    }

    public class CreateBooksModel
    {

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public IFormFile? CoverImageUrl { get; set; }

        [Required]
        public string AuthorId { get; set; }
        public string? Language { get; set; }
        public string? PublicationYear { get; set; }

        public int? PageCount { get; set; }

        public string? ISBN { get; set; }
        [Required]
        public string? GenreId { get; set; }
        public string? PublisherId { get; set; }
    }

    public class CreatePublishersModel
    {
        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(255)]
        public string? WebsiteUrl { get; set; }

        [MaxLength(255)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }
    }

    public class WishListDto
    {
        public string BookId { get; set; }
        public string UserId { get; set; }
    }

    public class AssignCategoriesDto
    {
        public string UserId { get; set; }
        public string BookId { get; set; }
        public List<string> Categories { get; set; }
    }


    public class BookProgressDTo
    {

        [Required]
        public string UserId { get; set; }

        [Required]
        public string BookId { get; set; }

        [Required]
        [Range(0, 100)]
        public int ProgressPercent { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Reading"; // Reading, Completed, Dropped

        public int? LastPageRead { get; set; }

    }

    public class ReadingChallengeDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        public int TargetBooks { get; set; }

        public int CompletedBooks { get; set; } = 0;
    }
}
