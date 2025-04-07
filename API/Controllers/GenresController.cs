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
    public class GenresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GenresController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Genres
        [HttpGet("getAllGenres")]
        public async Task<IActionResult> GetGenres()
        {
            var generes =  await _context.Genres.ToListAsync();
            return Ok(generes);
        }

        // GET: api/Genres/{id}
        [HttpGet("getGenreById/{id}")]
        public async Task<IActionResult> GetGenre(string id)
        {
            var genre = await _context.Genres.FindAsync(id);

            if (genre == null)
                return NotFound();

            return Ok(genre);
        }

        // POST: api/Genres
        [HttpPost("createGenre")]
        public async Task<IActionResult> CreateGenre([FromForm] CreateGenreModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var doesExists = await _context.Genres.FirstOrDefaultAsync(m => m.Name == model.Name);
            if (doesExists != null)
                return BadRequest(new { message = "Genre already exists" });

            var genre = new Genres
            {
                Name = model.Name,
                Description = model.Description,
                GenreId = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Genre added successfully" });
        }

        // PUT: api/Genres/{id}
        [HttpPut("updateGenre/{id}")]
        public async Task<IActionResult> UpdateGenre(string id, [FromForm]CreateGenreModel model)
        {
            var existingGenre = await _context.Genres.FindAsync(id);
            if (existingGenre == null)
                return NotFound();

            var doesExists = await _context.Genres.FirstOrDefaultAsync(m => m.Name == model.Name);
            if (doesExists != null && doesExists.GenreId != id)
                return BadRequest(new { message = "Genre already exists" });

            existingGenre.Name = model.Name;
            existingGenre.Description = model.Description;
            existingGenre.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Genre updated successfully" });
        }

        // DELETE: api/Genres/{id}
        [HttpDelete("deleteGenre/{id}")]
        public async Task<IActionResult> DeleteGenre(string id)
        {
            var genre = await _context.Genres.FindAsync(id);
            if (genre == null)
                return NotFound();

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Genre deleted successfully." });
        }
    }
}
