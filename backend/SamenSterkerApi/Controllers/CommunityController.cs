using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SamenSterkerApi.Data;
using SamenSterkerApi.DTOs;
using SamenSterkerApi.Models;
using System.Security.Claims;
using SamenSterkerApi.Services;

namespace SamenSterkerApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class CommunityController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ExpoPushService _expoPushService;

        public CommunityController(AppDbContext context, ExpoPushService expoPushService)
        {
            _context = context;
            _expoPushService = expoPushService;
        }

        [HttpGet("posts")]
        public async Task<IActionResult> GetPosts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            var posts = await _context.CommunityPosts
                .OrderByDescending(p => p.Timestamp)
                .Select(p => new CommunityPostResponseDto
                {
                    Id = p.Id.ToString(),
                    AnonymousName = p.AnonymousName,
                    Mood = p.Mood,
                    Message = p.Message,
                    Likes = p.Likes,
                    Timestamp = p.Timestamp.ToString("yyyy-MM-ddTHH:mm:ss"),
                    IsLiked = _context.PostLikes.Any(pl => pl.PostId == p.Id && pl.UserId == userGuid)
                })
                .ToListAsync();

            return Ok(posts);
        }

        [HttpPost("posts")]
        public async Task<IActionResult> CreatePost([FromBody] CreateCommunityPostDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            var user = await _context.Users.FindAsync(userGuid);
            if (user == null)
                return Unauthorized();

            var post = new CommunityPost
            {
                Id = Guid.NewGuid(),
                UserId = userGuid,
                AnonymousName = GenerateAnonymousName(),
                Mood = dto.Mood,
                Message = dto.Message,
                Likes = 0,
                Timestamp = DateTime.UtcNow
            };

            _context.CommunityPosts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new { id = post.Id.ToString() });
        }

        [HttpPost("posts/{postId}/like")]
        public async Task<IActionResult> ToggleLike(string postId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            if (!Guid.TryParse(postId, out var postGuid))
                return BadRequest("Invalid post ID");

            var post = await _context.CommunityPosts.FindAsync(postGuid);
            if (post == null)
                return NotFound();

            var existingLike = await _context.PostLikes
                .FirstOrDefaultAsync(pl => pl.PostId == postGuid && pl.UserId == userGuid);

            var postOwner = await _context.Users.FindAsync(post.UserId);
            var liker = await _context.Users.FindAsync(userGuid);

            if (existingLike != null)
            {
                // Unlike
                _context.PostLikes.Remove(existingLike);
                post.Likes = Math.Max(0, post.Likes - 1);
            }
            else
            {
                // Like
                var like = new PostLike
                {
                    Id = Guid.NewGuid(),
                    UserId = userGuid,
                    PostId = postGuid,
                    Timestamp = DateTime.UtcNow
                };
                _context.PostLikes.Add(like);
                post.Likes++;

                // Notificatie sturen naar eigenaar (niet aan jezelf)
                if (postOwner != null && postOwner.Id != userGuid)
                {
                    // In-app notificatie
                    var notif = new Notification
                    {
                        Id = Guid.NewGuid(),
                        UserId = postOwner.Id,
                        Title = "Je post is geliked!",
                        Body = $"{liker?.DisplayName ?? "Iemand"} heeft je post geliked.",
                        Type = "like",
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow,
                        RelatedId = post.Id.ToString()
                    };
                    _context.Notifications.Add(notif);
                    // Push notificatie
                    if (!string.IsNullOrEmpty(postOwner.ExpoPushToken))
                    {
                        await _expoPushService.SendPushAsync(postOwner.ExpoPushToken, notif.Title, notif.Body, new { postId = post.Id });
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("posts/{postId}/comments")]
        public async Task<IActionResult> GetComments(string postId)
        {
            if (!Guid.TryParse(postId, out var postGuid))
                return BadRequest("Invalid post ID");
            var comments = await _context.CommunityPostComments
                .Where(c => c.PostId == postGuid)
                .OrderBy(c => c.Timestamp)
                .Join(_context.Users, c => c.UserId, u => u.Id, (c, u) => new CommunityPostCommentResponseDto
                {
                    Id = c.Id.ToString(),
                    UserId = u.Id.ToString(),
                    UserName = u.DisplayName ?? "Anoniem",
                    Message = c.Message,
                    Timestamp = c.Timestamp.ToString("yyyy-MM-ddTHH:mm:ss")
                })
                .ToListAsync();
            return Ok(comments);
        }

        [HttpPost("posts/{postId}/comments")]
        public async Task<IActionResult> AddComment(string postId, [FromBody] CreateCommunityPostCommentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();
            if (!Guid.TryParse(postId, out var postGuid))
                return BadRequest("Invalid post ID");
            var post = await _context.CommunityPosts.FindAsync(postGuid);
            if (post == null)
                return NotFound();
            var user = await _context.Users.FindAsync(userGuid);
            if (user == null)
                return Unauthorized();
            var comment = new CommunityPostComment
            {
                Id = Guid.NewGuid(),
                PostId = postGuid,
                UserId = userGuid,
                Message = dto.Message,
                Timestamp = DateTime.UtcNow
            };
            _context.CommunityPostComments.Add(comment);
            await _context.SaveChangesAsync();
            // Notificatie sturen naar eigenaar (niet aan jezelf)
            if (post.UserId != userGuid)
            {
                var postOwner = await _context.Users.FindAsync(post.UserId);
                if (postOwner != null)
                {
                    var notif = new Notification
                    {
                        Id = Guid.NewGuid(),
                        UserId = postOwner.Id,
                        Title = "Nieuwe reactie op je post!",
                        Body = $"{user.DisplayName ?? "Iemand"} heeft gereageerd op je post.",
                        Type = "comment",
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow,
                        RelatedId = post.Id.ToString()
                    };
                    _context.Notifications.Add(notif);
                    if (!string.IsNullOrEmpty(postOwner.ExpoPushToken))
                    {
                        await _expoPushService.SendPushAsync(postOwner.ExpoPushToken, notif.Title, notif.Body, new { postId = post.Id });
                    }
                    await _context.SaveChangesAsync();
                }
            }
            return Ok(new { id = comment.Id.ToString() });
        }

        private string GenerateAnonymousName()
        {
            var adjectives = new[] { "Rustige", "Vriendelijke", "Moedige", "Warme", "Sterke", "Vredige", "Lieve", "Dappere" };
            var nouns = new[] { "Ziel", "Geest", "Vriend", "Reiziger", "Dromer", "Strijder", "Gids", "Helper" };
            
            var random = new Random();
            var adjective = adjectives[random.Next(adjectives.Length)];
            var noun = nouns[random.Next(nouns.Length)];
            
            return $"{adjective} {noun}";
        }
    }
} 