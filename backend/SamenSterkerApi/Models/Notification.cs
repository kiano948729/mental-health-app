using System;

namespace SamenSterkerApi.Models
{
    public class Notification
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public required string Title { get; set; }
        public required string Body { get; set; }
        public required string Type { get; set; } // bijv. 'like', 'comment', 'reminder'
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public string? RelatedId { get; set; } // optioneel: id van post/chat/etc
    }
} 