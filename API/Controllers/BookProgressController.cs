using API.Entities;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Models;

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

        [HttpPost("update-progress")]
        public async Task<IActionResult> AddOrUpdateProgress([FromBody] BookProgressDTo dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existingProgress = await _context.BookProgress
                    .FirstOrDefaultAsync(p => p.UserId == dto.UserId && p.BookId == dto.BookId);

                bool isNewlyFinished = false;

                if (existingProgress == null)
                {
                    var newProgress = new BookProgress
                    {
                        UserId = dto.UserId,
                        BookId = dto.BookId,
                        ProgressPercent = dto.ProgressPercent,
                        Status = dto.Status,
                        LastPageRead = dto.LastPageRead
                    };

                    _context.BookProgress.Add(newProgress);

                    if (dto.ProgressPercent == 100)
                    {
                        isNewlyFinished = true;
                    }
                }
                else
                {
                    // Check if the book was not previously finished but now is
                    if (existingProgress.ProgressPercent < 100 && dto.ProgressPercent == 100)
                    {
                        isNewlyFinished = true;
                    }

                    existingProgress.ProgressPercent = dto.ProgressPercent;
                    existingProgress.Status = dto.Status;
                    existingProgress.LastPageRead = dto.LastPageRead;

                    _context.BookProgress.Update(existingProgress);
                }

                // Update user book category if finished
                if (dto.ProgressPercent == 100)
                {
                    var userCategory = await _context.UserBookCategories
                        .FirstOrDefaultAsync(uc => uc.UserId == dto.UserId && uc.BookId == dto.BookId);

                    if (userCategory != null)
                    {
                        userCategory.CategoryName = "finished";
                        _context.UserBookCategories.Update(userCategory);
                    }
                }

                // If book just finished, update ReadingChallenge
                if (isNewlyFinished)
                {
                    var challenge = await _context.UserReadingChallenge
                        .FirstOrDefaultAsync(c => c.UserId == dto.UserId);

                    if (challenge != null)
                    {
                        challenge.CompletedBooks += 1;
                        _context.UserReadingChallenge.Update(challenge);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Progress saved successfully.", isSuccess = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/BookProgress
        [HttpPost]
        public async Task<IActionResult> AddProgress([FromForm] BookProgress model)
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
