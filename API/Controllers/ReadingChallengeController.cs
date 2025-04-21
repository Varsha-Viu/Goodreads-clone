using API.Data;
using API.Entities;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReadingChallengeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReadingChallengeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("addChallenge")]
        public async Task<IActionResult> AddChallenge([FromBody] ReadingChallengeDto dto)
        {
            // Check if user already has a challenge for this year
            var existing = await _context.UserReadingChallenge
                .FirstOrDefaultAsync(rc => rc.UserId == dto.UserId && rc.Year == dto.Year);

            if (existing != null)
                return BadRequest(new { message = "Reading challenge already exists for this year." });

            var model = new ReadingChallenge
            {
                Id = Guid.NewGuid().ToString(),
                UserId = dto.UserId,
                Year = dto.Year,
                TargetBooks = dto.TargetBooks,
                CompletedBooks = dto.CompletedBooks,
                CreatedAt = DateTime.Now,
            };
            
            _context.UserReadingChallenge.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reading challenge created successfully", data = model });
        }

        [HttpPut("updateChallenge/{id}")]
        public async Task<IActionResult> UpdateChallenge(string id, [FromBody] ReadingChallengeDto model)
        {
            var challenge = await _context.UserReadingChallenge.FindAsync(id);

            if (challenge == null)
                return NotFound();

            challenge.TargetBooks = model.TargetBooks;
            challenge.CompletedBooks = model.CompletedBooks;
            challenge.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Reading challenge updated successfully", data = challenge });
        }

        [HttpGet("getChallenge/{userId}/{year}")]
        public async Task<IActionResult> GetChallenge(string userId, int year)
        {
            var challenge = await _context.UserReadingChallenge
                .FirstOrDefaultAsync(rc => rc.UserId == userId && rc.Year == year);

            if (challenge == null)
                return NotFound(new { message = "No challenge found for this year." });

            return Ok(challenge);
        }


    }
}
