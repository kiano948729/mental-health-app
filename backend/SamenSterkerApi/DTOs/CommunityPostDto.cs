namespace SamenSterkerApi.DTOs
{
    public class CreateCommunityPostDto
    {
        public int Mood { get; set; }
        public required string Message { get; set; }
    }

    public class CommunityPostResponseDto
    {
        public required string Id { get; set; }
        public required string AnonymousName { get; set; }
        public int Mood { get; set; }
        public required string Message { get; set; }
        public int Likes { get; set; }
        public required string Timestamp { get; set; }
        public bool IsLiked { get; set; }
    }
} 