using API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var now = DateTime.UtcNow;
            var startOfWeek = now.Date.AddDays(-(int)now.DayOfWeek); // Sunday as start of the week

            var userCount = await _context.Users.CountAsync();
            var authorCount = await _context.Authors.CountAsync();
            var bookCount = await _context.Books.CountAsync();
            var genreCount = await _context.Genres.CountAsync();

            var newUsersThisWeek = await _context.Users
                .Where(u => u.CreatedAt >= startOfWeek) // assuming CreatedAt tracks registration
                .CountAsync();

            var stats = new
            {
                users = userCount,
                newUsersThisWeek = newUsersThisWeek,
                authors = authorCount,
                books = bookCount,
                genres = genreCount
            };

            return Ok(new { success = true, data = stats });
        }
    }
}
