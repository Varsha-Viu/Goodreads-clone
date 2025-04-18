using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class UpdateProfileDto
    {
        [Required]
        public string UserId { get; set; }
        public string UserName { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string PhoneNumber { get; set; }
        public string Address { get; set; }

    }

}
