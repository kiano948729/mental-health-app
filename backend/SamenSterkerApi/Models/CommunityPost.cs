using System;

namespace SamenSterkerApi.Models
{
    public class CommunityPost
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public required string AnonymousName { get; set; }
        public int Mood { get; set; }
        public required string Message { get; set; }
        public int Likes { get; set; }
        public DateTime Timestamp { get; set; }
    }
} 