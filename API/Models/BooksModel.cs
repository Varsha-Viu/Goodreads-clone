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
}
