namespace SamenSterkerApi.DTOs
{
    public class SendChatMessageDto
    {
        public required string Message { get; set; }
    }

    public class ChatMessageResponseDto
    {
        public required string Id { get; set; }
        public required string UserId { get; set; }
        public required string UserName { get; set; }
        public required string Message { get; set; }
        public required string Timestamp { get; set; }
        public bool IsOwn { get; set; }
    }
} 