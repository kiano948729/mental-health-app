using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SamenSterkerApi.DTOs;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace SamenSterkerApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class AIController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;
        public AIController(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        [HttpPost("advise")]
        public async Task<IActionResult> Advise([FromBody] AIAdviceRequestDto dto)
        {
            var prompt = $"Je bent een non-medische AI-coach. Gebruiker voelt zich: {dto.Mood}/5. Notitie: {dto.UserText}. Geef vriendelijk, positief advies over wat ze vandaag kunnen doen voor zichzelf.";
            var apiKey = _config["OpenAI:ApiKey"] ?? "YOUR_OPENAI_API_KEY";
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            var requestBody = new
            {
                model = "gpt-3.5-turbo",
                messages = new[] {
                    new { role = "system", content = "Je bent een vriendelijke, empathische AI-coach. Je geeft positieve, non-medische adviezen gebaseerd op iemands stemming (1-5) en hun korte dagboeknotitie. Geef alleen suggesties voor zelfzorg, rust, sociale steun of positieve acties. Geef nooit medische of psychologische diagnoses. Als je iets niet zeker weet, verwijs naar professionele hulp." },
                    new { role = "user", content = prompt }
                },
                max_tokens = 100
            };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);
            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "AI service error");
            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var advice = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
            return Ok(new AIAdviceResponseDto { Advice = advice });
        }
    }
} 