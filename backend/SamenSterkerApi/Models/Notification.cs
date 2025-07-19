using System;

namespace SamenSterkerApi.Models
{
    public class Notification
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // bijv. 'like', 'comment', 'reminder'
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public string? RelatedId { get; set; } // optioneel: id van post/chat/etc
    }
} 