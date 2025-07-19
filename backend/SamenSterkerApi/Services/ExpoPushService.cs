using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SamenSterkerApi.Services
{
    public class ExpoPushService
    {
        private readonly HttpClient _httpClient;
        public ExpoPushService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task SendPushAsync(string expoPushToken, string title, string body, object? data = null)
        {
            var payload = new
            {
                to = expoPushToken,
                title,
                body,
                data
            };
            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            await _httpClient.PostAsync("https://exp.host/--/api/v2/push/send", content);
        }
    }
} 