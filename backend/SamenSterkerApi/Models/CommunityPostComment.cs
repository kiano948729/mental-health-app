using System;

namespace SamenSterkerApi.Models
{
    public class CommunityPostComment
    {
        public Guid Id { get; set; }
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
        public required string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
} 