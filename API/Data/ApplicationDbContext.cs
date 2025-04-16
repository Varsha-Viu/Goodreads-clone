using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ApplicationDbContext : IdentityDbContext<Users>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Other DbSets if needed
        public DbSet<Authors> Authors { get; set; }
        public DbSet<Books> Books { get; set; }
        public DbSet<Genres> Genres { get; set; }
        public DbSet<Publishers> Publishers { get; set; }
        public DbSet<BookReview> BookReview { get; set; }
        public DbSet<WishList> WishList { get; set; }
        public DbSet<UserBookCategory> UserBookCategories { get; set; }
        public DbSet<BookProgress> BookProgress { get; set; }

    }
}
