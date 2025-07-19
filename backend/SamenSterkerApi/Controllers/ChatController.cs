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
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChatController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            var messages = await _context.ChatMessages
                .OrderBy(m => m.Timestamp)
                .Select(m => new ChatMessageResponseDto
                {
                    Id = m.Id.ToString(),
                    UserId = m.UserId.ToString(),
                    UserName = m.UserName,
                    Message = m.Message,
                    Timestamp = m.Timestamp.ToString("yyyy-MM-ddTHH:mm:ss"),
                    IsOwn = m.UserId == userGuid
                })
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendChatMessageDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            var user = await _context.Users.FindAsync(userGuid);
            if (user == null)
                return Unauthorized();

            var message = new ChatMessage
            {
                Id = Guid.NewGuid(),
                UserId = userGuid,
                UserName = user.DisplayName ?? "Anoniem",
                Message = dto.Message,
                Timestamp = DateTime.UtcNow
            };

            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { id = message.Id.ToString() });
        }
    }
} 