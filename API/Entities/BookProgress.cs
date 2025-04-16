using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class BookProgress
    {
        [Key]
        public string ProgressId { get; set; } = Guid.NewGuid().ToString();

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

        public DateTime? StartedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    }
}
