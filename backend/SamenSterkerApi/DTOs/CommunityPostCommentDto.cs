namespace SamenSterkerApi.DTOs
{
    public class CreateCommunityPostCommentDto
    {
        public string Message { get; set; } = string.Empty;
    }

    public class CommunityPostCommentResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Timestamp { get; set; } = string.Empty;
    }
} 