namespace SamenSterkerApi.DTOs
{
    public class BuddyRelationDto
    {
        public required string Id { get; set; }
        public required string UserId { get; set; }
        public required string BuddyId { get; set; }
        public required string Status { get; set; }
        public required string CreatedAt { get; set; }
    }
} 