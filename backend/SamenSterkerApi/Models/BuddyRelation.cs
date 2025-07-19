using System;

namespace SamenSterkerApi.Models
{
    public class BuddyRelation
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; } // De aanvrager
        public Guid BuddyId { get; set; } // De ontvanger
        public BuddyStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public enum BuddyStatus
    {
        Pending,
        Accepted,
        Rejected
    }
} 