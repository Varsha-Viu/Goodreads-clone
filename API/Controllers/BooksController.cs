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
        public async Task<IActionResult> GetBooks([FromQuery] string? userId = null)
        {
            var booksList = await (from book in _context.Books
                                   join author in _context.Authors on book.AuthorId equals author.AuthorId into authorJoin
                                   from author in authorJoin.DefaultIfEmpty()

                                   join genre in _context.Genres on book.GenreId equals genre.GenreId into genreJoin
                                   from genre in genreJoin.DefaultIfEmpty()

                                   join publisher in _context.Publishers on book.PublisherId equals publisher.PublisherId into pubJoin
                                   from publisher in pubJoin.DefaultIfEmpty()

                                   select new
                                   {
                                       book.BookId,
                                       book.Title,
                                       book.Description,
                                       book.CoverImageUrl,
                                       book.Language,
                                       book.PublicationYear,
                                       book.PageCount,
                                       book.ISBN,
                                       book.CreatedAt,
                                       book.UpdatedAt,
                                       AuthorId = book.AuthorId,
                                       AuthorName = author != null
                               ? (author.PenName ?? (author.FirstName + " " + author.LastName))
                               : null,
                                       GenreId = book.GenreId,
                                       GenreName = genre != null ? genre.Name : null,
                                       PublisherId = book.PublisherId,
                                       PublisherName = publisher != null ? publisher.Name : null,
                                       IsWishlisted = userId != null && _context.WishList
                                            .Any(w => w.BookId == book.BookId && w.UserId == userId)
                                   }).ToListAsync();

            return Ok(booksList);
        }


        // GET: api/Books/{id}
        [HttpGet("getBookById/{bookId}")]
        public async Task<IActionResult> GetBookById(string bookId, string? userId = null)
        {
            var book = await (from b in _context.Books
                              where b.BookId == bookId
                              join author in _context.Authors on b.AuthorId equals author.AuthorId into aJoin
                              from author in aJoin.DefaultIfEmpty()

                              join genre in _context.Genres on b.GenreId equals genre.GenreId into gJoin
                              from genre in gJoin.DefaultIfEmpty()

                              join publisher in _context.Publishers on b.PublisherId equals publisher.PublisherId into pJoin
                              from publisher in pJoin.DefaultIfEmpty()

                              join userCategory in _context.UserBookCategories
                     .Where(uc => uc.UserId == userId) on b.BookId equals userCategory.BookId into ucJoin
                              from userCategory in ucJoin.DefaultIfEmpty()

                              select new
                              {
                                  b.BookId,
                                  b.Title,
                                  b.Description,
                                  b.CoverImageUrl,
                                  b.Language,
                                  b.PublicationYear,
                                  b.PageCount,
                                  b.ISBN,
                                  b.CreatedAt,
                                  b.UpdatedAt,
                                  AuthorId = b.AuthorId,
                                  AuthorName = author != null ? author.PenName : null,
                                  GenreId = b.GenreId,
                                  GenreName = genre != null ? genre.Name : null,
                                  PublisherId = b.PublisherId,
                                  PublisherName = publisher != null ? publisher.Name : null,
                                  IsWishlisted = userId != null && _context.WishList
                                       .Any(w => w.BookId == b.BookId && w.UserId == userId),
                                  CategoryName = userCategory != null ? userCategory.CategoryName : null

                              }).FirstOrDefaultAsync();

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

            var imageUrl = "";
            if (model.CoverImageUrl != null)
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
                GenreId = model.GenreId != null ? model.GenreId : null,
                PublicationYear = model.PublicationYear,
                Language = model.Language,
                PageCount = model.PageCount,
                ISBN = model.ISBN,
                PublisherId = model.PublisherId != null ? model.PublisherId : null,
                CreatedAt = DateTime.Now,
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "book created successfully", isSuccess = true });
        }

        // PUT: api/Books/{id}
        [HttpPut("updateBooks/{bookId}")]
        public async Task<IActionResult> UpdateBook(string bookId, [FromForm] CreateBooksModel model)
        {
            var existingBook = await _context.Books.FindAsync(bookId);
            if (existingBook == null)
                return NotFound();

            var imageUrl = "";
            if (model.CoverImageUrl != null)
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
            existingBook.GenreId = model.GenreId != null ? model.GenreId : null;
            existingBook.PublisherId = model.PublisherId != null ? model.PublisherId : null;
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

        [HttpGet("searchBooks")]
        public async Task<IActionResult> SearchBooks([FromQuery] string searchTerm, [FromQuery] string? userId = null)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest("Search term is required.");
            }

            var booksList = await (from book in _context.Books
                                   join author in _context.Authors on book.AuthorId equals author.AuthorId into authorJoin
                                   from author in authorJoin.DefaultIfEmpty()

                                   join genre in _context.Genres on book.GenreId equals genre.GenreId into genreJoin
                                   from genre in genreJoin.DefaultIfEmpty()

                                   join publisher in _context.Publishers on book.PublisherId equals publisher.PublisherId into pubJoin
                                   from publisher in pubJoin.DefaultIfEmpty()

                                   where EF.Functions.Like(book.Title.ToLower(), $"%{searchTerm.ToLower()}%")

                                   select new
                                   {
                                       book.BookId,
                                       book.Title,
                                       book.Description,
                                       book.CoverImageUrl,
                                       book.Language,
                                       book.PublicationYear,
                                       book.PageCount,
                                       book.ISBN,
                                       book.CreatedAt,
                                       book.UpdatedAt,
                                       AuthorId = book.AuthorId,
                                       AuthorName = author != null
                                           ? (author.PenName ?? (author.FirstName + " " + author.LastName))
                                           : null,
                                       GenreId = book.GenreId,
                                       GenreName = genre != null ? genre.Name : null,
                                       PublisherId = book.PublisherId,
                                       PublisherName = publisher != null ? publisher.Name : null,
                                       IsWishlisted = userId != null && _context.WishList
                                            .Any(w => w.BookId == book.BookId && w.UserId == userId)
                                   }).ToListAsync();

            return Ok(booksList);
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
