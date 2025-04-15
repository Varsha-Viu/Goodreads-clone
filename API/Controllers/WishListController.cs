using API.Data;
using API.Entities;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishListController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WishListController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AddToWishList([FromForm] WishListDto dto)
        {

            var exists = await _context.WishList
                .AnyAsync(w => w.BookId == dto.BookId && w.UserId == dto.UserId);

            if (exists)
                return BadRequest("Book already in wish list.");

            var isBookIdExist = await _context.Books.AnyAsync(m => m.BookId == dto.BookId);
            if(!isBookIdExist)
                return BadRequest("Book does not exist");

            var isUserIdExist = await _context.Users.AnyAsync(m => m.Id == dto.UserId);
            if (!isUserIdExist)
                return BadRequest("User does not exist");

            var wish = new WishList
            {
                UserId = dto.UserId,
                BookId = dto.BookId
            };

            await _context.WishList.AddAsync(wish);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book added to wish list!" });
        }

        [HttpGet("getWishList/{userId}")]
        public async Task<IActionResult> GetMyWishList(string userId)
        {
            var wishList = await _context.WishList
                .Where(w => w.UserId == userId)
                .Include(w => w.BookId) // if Book navigation property exists
                .Select(w => new
                {
                    w.BookId,
                    w.AddedAt
                })
                .ToListAsync();

            return Ok(wishList);
        }

        [HttpDelete("removeFromWishlist")]
        public async Task<IActionResult> RemoveFromWishList(string bookId, string userId)
        {
            var wish = await _context.WishList
                .FirstOrDefaultAsync(w => w.BookId == bookId && w.UserId == userId);

            if (wish == null)
                return NotFound("Book not found in your wish list.");

            _context.WishList.Remove(wish);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book removed from wish list!" });
        }
    }
}
