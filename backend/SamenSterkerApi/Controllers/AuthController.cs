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
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _jwtService = new JwtService(
                config["Jwt:Key"] ?? "supersecretkey",
                int.TryParse(config["Jwt:Lifespan"], out var days) ? days : 7
            );
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already in use");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                PasswordHash = PasswordHasher.HashPassword(dto.Password),
                DisplayName = dto.DisplayName,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var token = _jwtService.GenerateToken(user);
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");
            var token = _jwtService.GenerateToken(user);
            return Ok(new { token });
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            var user = await _context.Users.FindAsync(userGuid);
            if (user == null)
                return Unauthorized();

            return Ok(new
            {
                id = user.Id.ToString(),
                email = user.Email,
                displayName = user.DisplayName,
                createdAt = user.CreatedAt
            });
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();

            var user = await _context.Users.FindAsync(userGuid);
            if (user == null)
                return Unauthorized();

            user.DisplayName = dto.DisplayName;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = user.Id.ToString(),
                email = user.Email,
                displayName = user.DisplayName,
                createdAt = user.CreatedAt
            });
        }

        [HttpGet("profile/by-email/{email}")]
        [Authorize]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return NotFound("Gebruiker niet gevonden");
            return Ok(new
            {
                id = user.Id.ToString(),
                email = user.Email,
                displayName = user.DisplayName
            });
        }

        [HttpPost("profile/expo-token")]
        [Authorize]
        public async Task<IActionResult> SaveExpoPushToken([FromBody] ExpoPushTokenDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
                return Unauthorized();
            var user = await _context.Users.FindAsync(userGuid);
            if (user == null)
                return Unauthorized();
            user.ExpoPushToken = dto.ExpoPushToken;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
} 