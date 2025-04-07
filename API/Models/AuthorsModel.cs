using System.ComponentModel.DataAnnotations;
using API.Constants;
using Swashbuckle.AspNetCore.Annotations;

namespace API.Models
{

    public class CreateAuthorModel
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }
        public string? PenName { get; set; }

        public string? Biography { get; set; }

        public string Email { get; set; }

        public IFormFile? ProfileImageUrl { get; set; }

        public string? Website { get; set; }

        public SocialLinksEnum[]? SocialLinks { get; set; } // store JSON or comma-separated
    }

}
