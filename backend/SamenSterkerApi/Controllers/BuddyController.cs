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
    public class BuddyController : ControllerBase
    {
        private readonly AppDbContext _context;
        public BuddyController(AppDbContext context)
        {
            _context = context;
        }

        // Buddy-verzoek sturen
        [HttpPost("request")]
        public async Task<IActionResult> RequestBuddy([FromBody] BuddyRequestDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();
            if (!Guid.TryParse(dto.BuddyId, out var buddyGuid))
                return BadRequest("Invalid BuddyId");
            if (userGuid == buddyGuid)
                return BadRequest("Je kunt geen buddy van jezelf worden.");
            // Check of er al een relatie bestaat
            var exists = await _context.BuddyRelations.AnyAsync(b =>
                (b.UserId == userGuid && b.BuddyId == buddyGuid) ||
                (b.UserId == buddyGuid && b.BuddyId == userGuid));
            if (exists)
                return BadRequest("Er bestaat al een buddy-relatie of verzoek.");
            var relation = new BuddyRelation
            {
                Id = Guid.NewGuid(),
                UserId = userGuid,
                BuddyId = buddyGuid,
                Status = BuddyStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            _context.BuddyRelations.Add(relation);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Buddy-verzoeken ophalen (waar jij de ontvanger bent en status pending)
        [HttpGet("requests")]
        public async Task<IActionResult> GetBuddyRequests()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();
            var requests = await _context.BuddyRelations
                .Where(b => b.BuddyId == userGuid && b.Status == BuddyStatus.Pending)
                .ToListAsync();
            return Ok(requests.Select(r => new BuddyRelationDto
            {
                Id = r.Id.ToString(),
                UserId = r.UserId.ToString(),
                BuddyId = r.BuddyId.ToString(),
                Status = r.Status.ToString(),
                CreatedAt = r.CreatedAt.ToString("o")
            }));
        }

        // Buddy-verzoek accepteren of weigeren
        [HttpPost("respond")] // body: { relationId, accept }
        public async Task<IActionResult> RespondToRequest([FromBody] RespondBuddyRequestDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();
            if (!Guid.TryParse(dto.RelationId, out var relationGuid))
                return BadRequest("Invalid RelationId");
            var relation = await _context.BuddyRelations.FirstOrDefaultAsync(r => r.Id == relationGuid && r.BuddyId == userGuid && r.Status == BuddyStatus.Pending);
            if (relation == null)
                return NotFound();
            relation.Status = dto.Accept ? BuddyStatus.Accepted : BuddyStatus.Rejected;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Buddy-lijst ophalen (alle relaties waar jij bij hoort en status accepted)
        [HttpGet]
        public async Task<IActionResult> GetBuddies()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();
            var buddies = await _context.BuddyRelations
                .Where(b => (b.UserId == userGuid || b.BuddyId == userGuid) && b.Status == BuddyStatus.Accepted)
                .ToListAsync();
            return Ok(buddies.Select(r => new BuddyRelationDto
            {
                Id = r.Id.ToString(),
                UserId = r.UserId.ToString(),
                BuddyId = r.BuddyId.ToString(),
                Status = r.Status.ToString(),
                CreatedAt = r.CreatedAt.ToString("o")
            }));
        }

        // Buddy verwijderen
        [HttpDelete("{relationId}")]
        public async Task<IActionResult> RemoveBuddy(string relationId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();
            if (!Guid.TryParse(relationId, out var relationGuid))
                return BadRequest("Invalid RelationId");
            var relation = await _context.BuddyRelations.FirstOrDefaultAsync(r => r.Id == relationGuid && (r.UserId == userGuid || r.BuddyId == userGuid));
            if (relation == null)
                return NotFound();
            _context.BuddyRelations.Remove(relation);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }

    public class RespondBuddyRequestDto
    {
        public required string RelationId { get; set; }
        public required bool Accept { get; set; }
    }
} 