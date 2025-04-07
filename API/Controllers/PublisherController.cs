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
    public class PublisherController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PublisherController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("getAllPublishers")]
        public async Task<IActionResult> GetPublishers()
        {
            var result =  await _context.Publishers.ToListAsync();
            return Ok(result);
        }


        [HttpGet("getPublisherById/{publisherId}")]
        public async Task<IActionResult> GetPublisherByd(string publisherId)
        {
            var result = await _context.Publishers.FindAsync(publisherId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // POST: api/Publishers
        [HttpPost("createPublisher")]
        public async Task<IActionResult> CreatePublisher([FromForm] CreatePublishersModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var publisher = new Publishers
            {
                PublisherId = Guid.NewGuid().ToString(),
                Name = model.Name,
                WebsiteUrl = model.WebsiteUrl,
                Email = model.Email,
                Phone = model.Phone,
                Address = model.Address,
                CreatedAt = DateTime.Now,
            };

            _context.Publishers.Add(publisher);
            await _context.SaveChangesAsync();

            return Ok(new {message="Publisher created successfully"});
        }

        // PUT: api/Publishers/{id}
        [HttpPut("updatePublishers/{publisherId}")]
        public async Task<IActionResult> UpdatePublisher(string publisherId, [FromForm] CreatePublishersModel model)
        {
            var existingPublishers = await _context.Publishers.FindAsync(publisherId);
            if (existingPublishers == null)
                return NotFound();

            existingPublishers.Name = model.Name;
            existingPublishers.WebsiteUrl = model.WebsiteUrl;
            existingPublishers.Email = model.Email;
            existingPublishers.Phone = model.Phone;
            existingPublishers.Address = model.Address;
            existingPublishers.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Publishers details updated successfully" });
        }

        // DELETE: api/Publishers/{id}
        [HttpDelete("deletePublishers/{publisherId}")]
        public async Task<IActionResult> DeletePublisher(string publisherId)
        {
            var publishers = await _context.Publishers.FindAsync(publisherId);
            if (publishers == null)
                return NotFound();

            // Check if any books are using this publisher
            var hasBooks = await _context.Books.AnyAsync(b => b.PublisherId == publisherId);
            if (hasBooks)
                return BadRequest(new { message = "Cannot delete publisher. Books are associated with this publisher." });


            _context.Publishers.Remove(publishers);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Publisher deleted successfully" });
        }

    }
}
