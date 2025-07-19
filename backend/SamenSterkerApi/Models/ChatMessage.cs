using System;

namespace SamenSterkerApi.Models
{
    public class ChatMessage
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public required string UserName { get; set; }
        public required string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
} 