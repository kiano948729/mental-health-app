using System;

namespace SamenSterkerApi.Models
{
    public class ProgressEntry
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public int Mood { get; set; }
        public required string JournalText { get; set; }
        public DateTime Timestamp { get; set; }
    }
} 