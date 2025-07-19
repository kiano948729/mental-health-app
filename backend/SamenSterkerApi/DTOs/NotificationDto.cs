namespace SamenSterkerApi.DTOs
{
    public class NotificationDto
    {
        public required string Id { get; set; }
        public required string Title { get; set; }
        public required string Body { get; set; }
        public required string Type { get; set; }
        public required bool IsRead { get; set; }
        public required string CreatedAt { get; set; }
        public string? RelatedId { get; set; }
    }
} 