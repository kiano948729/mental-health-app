using System;

namespace SamenSterkerApi.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string DisplayName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ExpoPushToken { get; set; }
    }
} 