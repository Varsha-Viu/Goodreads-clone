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
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BooksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet("getAllBooks")]
        public async Task<IActionResult> GetBooks()
        {
            var booksList =  await _context.Books.ToListAsync();
            return Ok(booksList);
        }

        // GET: api/Books/{id}
        [HttpGet("getBookById/{bookId}")]
        public async Task<IActionResult> GetBook(string bookId)
        {
            var book = await _context.Books.FindAsync(bookId);

            if (book == null)
                return NotFound();

            return Ok(book);
        }

        // POST: api/Books
        [HttpPost("createBook")]
        public async Task<IActionResult> CreateBook([FromForm] CreateBooksModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var genre = await _context.Genres.FindAsync(model.GenreId);
            if (genre == null)
                return NotFound(new {message = "Genre not found "});

            var existingAuthor = await _context.Authors.FindAsync(model.AuthorId);
            if (existingAuthor == null)
                return NotFound(new { message = "Author not found " });

            var existingPublishers = await _context.Publishers.FindAsync(model.PublisherId);
            if (existingPublishers == null)
                return NotFound(new { message = "Publisher not found " });

            var imageUrl = "";
            if (model.CoverImageUrl.Length != 0)
            {
                imageUrl = await UploadImage(model.CoverImageUrl);

            }

            var book = new Books
            {
                BookId = Guid.NewGuid().ToString(),
                Title = model.Title,
                Description = model.Description,
                CoverImageUrl = imageUrl,
                AuthorId = model.AuthorId,
                GenreId = model.GenreId,
                PublicationYear = model.PublicationYear,
                Language = model.Language,
                PageCount = model.PageCount,
                ISBN = model.ISBN,
                PublisherId = model.PublisherId,
                CreatedAt = DateTime.Now,
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, book);
        }

        // PUT: api/Books/{id}
        [HttpPut("updateBooks/{bookId}")]
        public async Task<IActionResult> UpdateBook(string bookId, [FromForm] CreateBooksModel model)
        {
            var existingBook = await _context.Books.FindAsync(bookId);
            if (existingBook == null)
                return NotFound();

            var genre = await _context.Genres.FindAsync(model.GenreId);
            if (genre == null)
                return NotFound(new { message = "Genre not found " });

            var existingAuthor = await _context.Authors.FindAsync(model.AuthorId);
            if (existingAuthor == null)
                return NotFound(new { message = "Author not found " });

            var existingPublishers = await _context.Publishers.FindAsync(model.PublisherId);
            if (existingPublishers == null)
                return NotFound(new { message = "Publisher not found " });

            var imageUrl = "";
            if (model.CoverImageUrl.Length != 0)
            {
                imageUrl = await UploadImage(model.CoverImageUrl);

            }

            existingBook.Title = model.Title;
            existingBook.Description = model.Description;
            existingBook.CoverImageUrl = imageUrl != "" ? imageUrl : existingBook.CoverImageUrl;
            existingBook.AuthorId = model.AuthorId;
            existingBook.Language = model.Language;
            existingBook.PublicationYear = model.PublicationYear;
            existingBook.PageCount = model.PageCount;
            existingBook.ISBN = model.ISBN;
            existingBook.GenreId = model.GenreId;
            existingBook.PublisherId = model.PublisherId;
            existingBook.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "book details updated successfully" });
        }

        // DELETE: api/Books/{id}
        [HttpDelete("deleteBook/{bookId}")]
        public async Task<IActionResult> DeleteBook(string bookId)
        {
            var book = await _context.Books.FindAsync(bookId);
            if (book == null)
                return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book deleted successfully" });
        }

        private async Task<string> UploadImage(IFormFile authorprofile)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "BooksCoverImg");
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

            return $"/Uploads/BooksCoverImg/{fileName}";
        }
    }
}
