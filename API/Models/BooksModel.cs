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

        public DateTime? PublishedDate { get; set; }

        public string? Language { get; set; }
        public string? PublicationYear { get; set; }

        public int? PageCount { get; set; }

        public string? ISBN { get; set; }
        [Required]
        public string? GenreId { get; set; }
    }
}
