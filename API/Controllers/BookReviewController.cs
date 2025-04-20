using System.Net;
using API.Data;
using API.Entities;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Users> _userManager;

        public BookReviewController(ApplicationDbContext context, UserManager<Users> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("getAllReviews")]
        public async Task<IActionResult> GetAllReviews()
        {
            var result = await _context.BookReview.ToListAsync();
            return Ok(result);
        }


        //[HttpGet("getReviewByBookId/{bookId}")]
        [HttpGet("getReviewByBookId/{bookId}")]
        public async Task<IActionResult> GetReviewByBookId(string bookId)
        {
            var book = await _context.Books.FindAsync(bookId);

            if (book == null)
                return NotFound(new { message = "Book not found" });

            var result = await (from review in _context.BookReview
                                join user in _context.Users
                                    on review.UserId equals user.Id
                                where review.BookId == bookId
                                select new
                                {
                                    review.ReviewId,
                                    review.BookId,
                                    review.Rating,
                                    review.Comment,
                                    review.CreatedAt,
                                    User = new
                                    {
                                        user.Id,
                                        user.UserName,
                                        user.FirstName,
                                        user.LastName
                                    }
                                }).ToListAsync();

            //if (result == null || result.Count == 0)
            //    return Ok(new { message = "No reviews found" });

            return Ok(result);
        }


        [HttpGet("getReviewByUserId/{userId}")]
        public async Task<IActionResult> GetReviewByUserId(string userId)
        {
            var userExists = await _userManager.FindByIdAsync(userId);
            if (userExists == null)
                return BadRequest("User doesn't exists!");

            var result = await _context.BookReview.Where(m => m.UserId == userId).ToListAsync();

            if (result == null)
                return NotFound(new { message = "No review found" });

            return Ok(result);
        }

        [HttpGet("getAverageBookRating/{bookId}")]
        public async Task<IActionResult> GetAvgBookRating(string bookId)
        {
            var book = await _context.Books.FindAsync(bookId);

            if (book == null)
                return NotFound(new { message = "Book didn't found" });

            var avgRating = await _context.BookReview
                        .Where(r => r.BookId == bookId)
                        .AverageAsync(r => r.Rating);

            
            if (avgRating == null)
                return NotFound(new { message = "No review found" });

            return Ok(avgRating);
        }

        [HttpPost("createReview")]
        public async Task<IActionResult> CreateReview([FromBody] AddReviewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var review = new BookReview
            {
                ReviewId = Guid.NewGuid().ToString(),
                UserId = model.UserId,
                BookId = model.BookId,
                Rating = model.Rating,
                Comment = model.Comment,
                CreatedAt = DateTime.Now,
            };

            _context.BookReview.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book review created successfully", isSuccess = true });
        }

        [HttpPut("updateReview/{reviewId}")]
        public async Task<IActionResult> UpdateReview(string reviewId, [FromBody] AddReviewModel model)
        {
            var existingReview = await _context.BookReview.FindAsync(reviewId);
            if (existingReview == null)
                return NotFound();

            existingReview.UserId = model.UserId;
            existingReview.BookId = model.BookId;
            existingReview.Rating = model.Rating;
            existingReview.Comment = model.Comment;
            existingReview.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Book review updated successfully", isSuccess = true });
        }

        [HttpDelete("deleteReview/{reviewId}")]
        public async Task<IActionResult> DeleteReview(string reviewId)
        {
            var review = await _context.BookReview.FindAsync(reviewId);
            if (review == null)
                return NotFound();

            _context.BookReview.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book review deleted successfully", isSuccess = true });
        }

    }
}
