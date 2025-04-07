using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class WishList
    {
        [Key]
        public string WishListId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string UserId { get; set; }

        [Required]
        public string BookId { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.Now;
    }

}
