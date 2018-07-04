namespace bcvc4sp.ProxyAzureFunction
{
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Azure.WebJobs.Host;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;

    public static class Auth
    {
        private const string AccessTokenEndpointUrl = "https://oauth.brightcove.com/v4/access_token";

        [FunctionName("auth")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "options", "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            try
            {
                return await ProxyRequest(req);
            }
            catch (Exception ex)
            {
                log.Error(ex.Message);
                throw;
            }
        }

        private static async Task<HttpResponseMessage> ProxyRequest(HttpRequestMessage request)
        {
            var settings = ProxySettings.GetProxySettings();

            HttpResponseMessage result = request.CreateResponse();

            if (settings.AllowedOrigins == null || settings.AllowedOrigins.Count() == 0 || settings.AllowedOrigins.ElementAtOrDefault(0) == "*")
            {
                result.Headers.Add("access-control-allow-origin", "*");
                result.Headers.Add("access-control-allow-credentials", "true");
            }
            else if (request.Headers.TryGetValues("origin", out IEnumerable<string> origins))
            {
                var allowedOrigin = origins.FirstOrDefault( o => settings.AllowedOrigins.Any(or => String.Equals(o, or, StringComparison.InvariantCultureIgnoreCase)));
                if (allowedOrigin != null)
                {
                    result.Headers.Add("access-control-allow-origin", allowedOrigin);
                    result.Headers.Add("access-control-allow-credentials", "true");
                }
            }

            if (request.Content.IsFormData())
            {
                var form = await request.Content.ReadAsFormDataAsync();
                settings.ClientId = form["client_id"].ToString() ?? settings.ClientId;
                settings.ClientSecret = form["client_secret"].ToString() ?? settings.ClientSecret;
            }
            else
            {
                var requestBody = await request.Content.ReadAsStringAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);
                settings.ClientId = data["client_id"].ToString() ?? settings.ClientId;
                settings.ClientSecret = data["client_secret"].ToString() ?? settings.ClientSecret;
            }

            if (!string.IsNullOrEmpty(settings.ClientId) && !string.IsNullOrEmpty(settings.ClientSecret))
            {
                var authString = EncodeTo64(string.Format("{0}:{1}", settings.ClientId, settings.ClientSecret));

                HttpRequestMessage forwardRequest = CreateHttpRequest(authString);

                HttpClient client = new HttpClient
                {
                    Timeout = TimeSpan.FromSeconds(settings.RequestTimeout == null ? 30 : settings.RequestTimeout.Value)
                };
                var accessTokenResponse = await client.SendAsync(forwardRequest);

                var stringResult = await accessTokenResponse.Content.ReadAsStringAsync();
                if (request.Method == HttpMethod.Post)
                {
                    result.Content = new StringContent(stringResult, Encoding.UTF8, "text/html");
                }
                else
                {
                    result.Content = new StringContent(stringResult, Encoding.UTF8, "application/json");
                }
            }

            return result;
        }

        private static string EncodeTo64(string toEncode)
        {
            byte[] toEncodeAsBytes = Encoding.ASCII.GetBytes(toEncode);
            return Convert.ToBase64String(toEncodeAsBytes);
        }

        private static HttpRequestMessage CreateHttpRequest(string authString)
        {
            HttpRequestMessage accessTokenRequest = new HttpRequestMessage(HttpMethod.Post, AccessTokenEndpointUrl);

            accessTokenRequest.Headers.Authorization = new AuthenticationHeaderValue("Basic", authString);
            accessTokenRequest.Headers.Host = new Uri(AccessTokenEndpointUrl).Authority;

            var formValues = new Dictionary<string, string>
            {
                { "grant_type", "client_credentials" }
            };

            accessTokenRequest.Content = new FormUrlEncodedContent(formValues);

            return accessTokenRequest;
        }
    }
}
