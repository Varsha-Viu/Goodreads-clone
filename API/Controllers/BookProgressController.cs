using API.Entities;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookProgressController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Users> _userManager;

        public BookProgressController(ApplicationDbContext context, UserManager<Users> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/BookProgress/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetProgressByUser(string userId)
        {
            var progress = await _context.BookProgress
                .Where(p => p.UserId == userId)
                .Include(p => p.BookId)
                .ToListAsync();

            return Ok(progress);
        }

        // POST: api/BookProgress
        [HttpPost]
        public async Task<IActionResult> AddProgress(BookProgress model)
        {
            model.ProgressId = Guid.NewGuid().ToString();
            model.UpdatedAt = DateTime.Now;

            _context.BookProgress.Add(model);
            await _context.SaveChangesAsync();

            return Ok(model);
        }

        // PUT: api/BookProgress/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProgress(string id, BookProgress model)
        {
            var existing = await _context.BookProgress.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.ProgressPercent = model.ProgressPercent;
            existing.Status = model.Status;
            existing.LastPageRead = model.LastPageRead;
            existing.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(existing);
        }

        // DELETE: api/BookProgress/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProgress(string id)
        {
            var progress = await _context.BookProgress.FindAsync(id);
            if (progress == null)
                return NotFound();

            _context.BookProgress.Remove(progress);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Progress deleted successfully" });
        }
    }
}
