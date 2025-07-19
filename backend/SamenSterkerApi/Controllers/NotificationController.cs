using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SamenSterkerApi.Data;
using SamenSterkerApi.DTOs;
using SamenSterkerApi.Models;
using SamenSterkerApi.Services;
using System.Security.Claims;

namespace SamenSterkerApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ExpoPushService _expoPushService;
        public NotificationController(AppDbContext context, ExpoPushService expoPushService)
        {
            _context = context;
            _expoPushService = expoPushService;
        }

        // Notificaties ophalen
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userGuid)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
            return Ok(notifications.Select(n => new NotificationDto
            {
                Id = n.Id.ToString(),
                Title = n.Title,
                Body = n.Body,
                Type = n.Type,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt.ToString("o"),
                RelatedId = n.RelatedId
            }));
        }

        // Markeer als gelezen
        [HttpPost("read/{id}")]
        public async Task<IActionResult> MarkAsRead(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();
            if (!Guid.TryParse(id, out var notifGuid))
                return BadRequest("Invalid id");
            var notif = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == notifGuid && n.UserId == userGuid);
            if (notif == null)
                return NotFound();
            notif.IsRead = true;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Test push notification naar jezelf
        [HttpPost("test")]
        public async Task<IActionResult> TestPush()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();
            var user = await _context.Users.FindAsync(userGuid);
            if (user == null || string.IsNullOrEmpty(user.ExpoPushToken))
                return BadRequest("Geen push token gevonden");
            await _expoPushService.SendPushAsync(user.ExpoPushToken, "Test notificatie", "Dit is een test push notificatie");
            // Optioneel: ook in-app notificatie aanmaken
            var notif = new Notification
            {
                Id = Guid.NewGuid(),
                UserId = userGuid,
                Title = "Test notificatie",
                Body = "Dit is een test push notificatie",
                Type = "test",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            _context.Notifications.Add(notif);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
} 