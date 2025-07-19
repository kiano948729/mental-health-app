namespace SamenSterkerApi.DTOs
{
    public class AIAdviceRequestDto
    {
        public int Mood { get; set; }
        public required string UserText { get; set; }
    }
} 