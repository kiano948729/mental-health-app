using System;

namespace SamenSterkerApi.Models
{
    public class PostLike
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public DateTime Timestamp { get; set; }
    }
} 