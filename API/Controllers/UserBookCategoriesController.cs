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
    public class UserBookCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserBookCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignCategories([FromBody] AssignCategoriesDto dto)
        {
            if (dto.Categories == null || dto.Categories.Count == 0)
                return BadRequest("No categories provided.");

            // Remove existing categories for this user-book
            var existing = await _context.UserBookCategories
                .Where(x => x.UserId == dto.UserId && x.BookId == dto.BookId)
                .ToListAsync();

            _context.UserBookCategories.RemoveRange(existing);


            var wish = await _context.WishList
                .FirstOrDefaultAsync(w => w.BookId == dto.BookId && w.UserId == dto.UserId);
            if (wish != null)
            {
                _context.WishList.Remove(wish);
                await _context.SaveChangesAsync();
            }

            // Add new selections
            var newAssignments = dto.Categories.Select(cat => new UserBookCategory
            {
                UserId = dto.UserId,
                BookId = dto.BookId,
                CategoryName = cat
            });

            await _context.UserBookCategories.AddRangeAsync(newAssignments);
            await _context.SaveChangesAsync();

            return Ok(new {message = "Category assigned", isSuccess = true});
        }

        [HttpGet("getForUserBook")]
        public async Task<IActionResult> GetCategoriesForUserBook(string userId, string bookId)
        {
            var categories = await _context.UserBookCategories
                .Where(x => x.UserId == userId && x.BookId == bookId)
                .Select(x => x.CategoryName)
                .ToListAsync();

            return Ok(categories);
        }

        [HttpGet("getUserBookShelf/{userId}")]
        public async Task<IActionResult> GetUserBookShelf(string userId)
        {
            //var categories = await _context.UserBookCategories
            //    .Where(x => x.UserId == userId)
            //    .ToListAsync();

            //return Ok(categories);

            if (string.IsNullOrEmpty(userId))
                return BadRequest("Invalid UserId");

            // Get user book categories with book details
            var userCategories = await (from ubc in _context.UserBookCategories
                                        join book in _context.Books on ubc.BookId equals book.BookId
                                        join author in _context.Authors on book.AuthorId equals author.AuthorId into authorJoin
                                        from author in authorJoin.DefaultIfEmpty()
                                        where ubc.UserId == userId
                                        select new
                                        {
                                            book.BookId,
                                            book.Title,
                                            book.CoverImageUrl,
                                            AuthorName = author != null ? author.PenName : null,
                                            ubc.CategoryName // e.g. currentlyReading, finished, etc.
                                        }).ToListAsync();

            // Get wishlist books with book details
            var wishlist = await (from wl in _context.WishList
                                  join book in _context.Books on wl.BookId equals book.BookId
                                  join author in _context.Authors on book.AuthorId equals author.AuthorId into authorJoin
                                  from author in authorJoin.DefaultIfEmpty()
                                  where wl.UserId == userId
                                  select new
                                  {
                                      book.BookId,
                                      book.Title,
                                      book.CoverImageUrl,
                                      AuthorName = author != null ? author.PenName : null,
                                      IsWishlisted = true
                                  }).ToListAsync();

            return Ok(new
            {
                categories = userCategories,
                wishlist = wishlist
            });
        }

        [HttpGet("currently-reading/{userId}")]
        public async Task<IActionResult> GetCurrentlyReadingBooks(string userId)
        {
            var books = await (from ubc in _context.UserBookCategories
                               where ubc.UserId == userId && ubc.CategoryName == "currentlyReading"
                               join book in _context.Books on ubc.BookId equals book.BookId
                               join author in _context.Authors on book.AuthorId equals author.AuthorId into authorJoin
                               from author in authorJoin.DefaultIfEmpty()
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
                                   AuthorName = author != null ? author.PenName : null
                               }).ToListAsync();

            return Ok(books);
        }

    }
}
