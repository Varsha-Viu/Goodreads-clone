using System.Security.Claims;
using API.Data;
using API.Entities;
using API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public class AuthorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AuthorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllAuthors")]
        public async Task<IActionResult> GetAllAuthors()
        {
            var authors = await _context.Authors.ToListAsync();
            return Ok(authors);
        }

        [HttpGet("getAuthorById/{authorId}")]
        public async Task<IActionResult> GetAuthorById(string authorId)
        {
            var author = await _context.Authors.FindAsync(authorId);
            if (author == null) return NotFound();

            return Ok(author);
        }

        [HttpPost("addAuthor")]
        public async Task<IActionResult> CreateAuthor([FromForm] CreateAuthorModel model)
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);

            var imageUrl = ""; 
            if(model.ProfileImageUrl != null)
            {
                imageUrl = await UploadImage(model.ProfileImageUrl);

            }
            var socialLinksString = "";
            if(model.SocialLinks != null)
            {
                socialLinksString = string.Join(", ", model.SocialLinks.Select(m => m.ToString()));
            }

            var author = new Authors
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                PenName = model.PenName,
                Biography = model.Biography,
                Email = model.Email,
                Website = model.Website,
                SocialLinks = socialLinksString,
                ProfileImageUrl = imageUrl != "" ? imageUrl : null,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            return Ok(new {message = "Book added successfully"});
        }

        [HttpPut("updateAuthor/{authorId}")]
        public async Task<IActionResult> UpdateAuthor(string authorId, [FromForm] CreateAuthorModel updatedAuthor)
        {
            var existingAuthor = await _context.Authors.FindAsync(authorId);
            if (existingAuthor == null) 
                return NotFound();

            var imageUrl = "";
            if (updatedAuthor.ProfileImageUrl != null)
            {
                imageUrl = await UploadImage(updatedAuthor.ProfileImageUrl);

            }
            var socialLinksString = "";
            if (updatedAuthor.SocialLinks != null)
            {
                socialLinksString = string.Join(", ", updatedAuthor.SocialLinks.Select(m => m.ToString()));
            }

            existingAuthor.FirstName = updatedAuthor.FirstName;
            existingAuthor.LastName = updatedAuthor.LastName;
            existingAuthor.Biography = updatedAuthor.Biography;
            existingAuthor.PenName = updatedAuthor.PenName;
            existingAuthor.Email = updatedAuthor.Email;
            existingAuthor.ProfileImageUrl = imageUrl != "" ? imageUrl : existingAuthor.ProfileImageUrl;
            existingAuthor.Website = updatedAuthor.Website;
            existingAuthor.SocialLinks = socialLinksString != "" ? socialLinksString : existingAuthor.SocialLinks;
            existingAuthor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Author updated successfully" });
        }

        [HttpDelete("deleteAuthor/{authorId}")]
        public async Task<IActionResult> DeleteAuthor(string authorId)
        {
            var author = await _context.Authors.FindAsync(authorId);
            if (author == null) return NotFound();

            var hasBooks = await _context.Books.AnyAsync(b => b.AuthorId == authorId);
            if (hasBooks)
                return BadRequest(new { message = "Cannot delete author. Books are associated with this author." });


            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Author deleted successfully." });
        }

        [HttpGet("search-authors")]
        public async Task<IActionResult> SearchAuthors([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest(new { success = false, message = "Search term cannot be empty" });
            }

            var authors = await _context.Authors
                .Where(a => a.FirstName.Contains(searchTerm))
                .ToListAsync();

            return Ok(new { success = true, data = authors });
        }

        [HttpGet("getBooksAuthorById/{authorId}")]
        public async Task<IActionResult> GetBooksByAuthor(string authorId)
        {
            // Get the author
            var author = await _context.Authors
                .Where(a => a.AuthorId == authorId)
                .Select(author => new
                {
                    author.AuthorId,
                    author.FullName,
                    author.Biography,
                    author.ProfileImageUrl,
                    author.PenName,
                    author.Website,
                    author.SocialLinks
                })
                .FirstOrDefaultAsync();

            if (author == null)
                return NotFound(new { message = "Author not found." });

            // Get books (if any)
            var books = await _context.Books
                .Where(b => b.AuthorId == authorId)
                .Select(book => new
                {
                    book.BookId,
                    book.Title,
                    book.Description,
                    book.CoverImageUrl,
                    book.Language,
                    book.PublicationYear,
                    book.PageCount,
                    book.ISBN,
                    book.GenreId,
                    book.CreatedAt,
                    book.UpdatedAt
                })
                .ToListAsync();

            // Return author + books
            return Ok(new
            {
                Author = author,
                Books = books
            });
        }



        private async Task<string> UploadImage(IFormFile authorprofile)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "Authors");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // Create unique filename
            var fileExtension = Path.GetExtension(authorprofile.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await authorprofile.CopyToAsync(stream);
            }

            return $"/Uploads/Authors/{fileName}";
        }
    }
}
