using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Authors
    {
        [Key]
        public string AuthorId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }
        public string? PenName { get; set; }

        public string? FullName => $"{FirstName} {LastName}";

        public string? Biography { get; set; }

        public string Email { get; set; }

        public string? ProfileImageUrl { get; set; }

        public string? Website { get; set; }

        public string? SocialLinks { get; set; } // store JSON or comma-separated

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }

}
