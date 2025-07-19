using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SamenSterkerApi.Data;
using SamenSterkerApi.DTOs;
using SamenSterkerApi.Models;
using System.Security.Claims;

namespace SamenSterkerApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ProgressController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProgressController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveProgress([FromBody] ProgressEntryDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var guid))
                return Unauthorized();

            var entry = new ProgressEntry
            {
                Id = Guid.NewGuid(),
                UserId = guid,
                Mood = dto.Mood,
                JournalText = dto.JournalText,
                Timestamp = DateTime.UtcNow
            };
            _context.ProgressEntries.Add(entry);
            await _context.SaveChangesAsync();
            return Ok(entry);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var guid))
                return Unauthorized();

            var entries = await _context.ProgressEntries
                .Where(e => e.UserId == guid)
                .OrderByDescending(e => e.Timestamp)
                .ToListAsync();
            return Ok(entries);
        }
    }
} 