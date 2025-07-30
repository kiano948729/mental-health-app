namespace SamenSterkerApi.DTOs
{
    public class CreateCommunityPostCommentDto
    {
        public required string Message { get; set; }
    }

    public class CommunityPostCommentResponseDto
    {
        public required string Id { get; set; }
        public required string UserId { get; set; }
        public required string UserName { get; set; }
        public required string Message { get; set; }
        public required string Timestamp { get; set; }
    }
} 