namespace bcvc4sp.ProxyAzureFunction
{
    using bcvc4sp.ProxyAzureFunction.Extensions;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Azure.WebJobs.Host;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;

    public static class Auth
    {
        private const string AccessTokenEndpointUrl = "https://oauth.brightcove.com/v4/access_token";
        private const string ClientIdPropertyName = "client_id";
        private const string ClientSecretPropertyName = "client_secret";
        private const string GrantTypePropertyName = "grant_type";
        private static readonly object s_syncRoot = new object();
        private static IServiceProvider s_serviceProvider;

        [FunctionName("auth")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "options", "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            EnsureInitialized();

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

        private static void EnsureInitialized()
        {
            if (s_serviceProvider == null)
            {
                lock(s_syncRoot)
                {
                    if (s_serviceProvider == null)
                    {
                        var config = new ConfigurationBuilder()
                             .SetBasePath(Directory.GetCurrentDirectory())
                             .AddEnvironmentVariables()
                             .Build();

                        var services = new ServiceCollection()
                            .AddHttpClient()
                            .AddSingleton<IConfiguration>(config);

                        s_serviceProvider = services.BuildServiceProvider();
                    }
                }
            }
        }

        private static async Task<HttpResponseMessage> ProxyRequest(HttpRequestMessage request)
        {
            var settings = ProxySettings.GetProxySettings(s_serviceProvider.GetService<IConfiguration>());

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

            // If the access-control-allow-origin wasn't found, still allow the request to go through.

            if (request.Content.IsFormData())
            {
                var form = await request.Content.ReadAsFormDataAsync();
                if (form == null)
                {
                    result.StatusCode = HttpStatusCode.BadRequest;
                    result.ReasonPhrase = "Expected form data but it was not supplied.";
                    return result;
                }

                settings.ClientId = form[ClientIdPropertyName] ?? settings.ClientId;
                settings.ClientSecret = form[ClientSecretPropertyName] ?? settings.ClientSecret;
                settings.GrantType = form[GrantTypePropertyName] ?? settings.GrantType;
            }
            else if (request.Content.IsJsonData())
            {
                dynamic json = await request.Content.ReadAsJsonAsync();
                if (json == null)
                {
                    result.StatusCode = HttpStatusCode.BadRequest;
                    result.ReasonPhrase = "Expected json data but it was not supplied.";
                    return result;
                }

                settings.ClientId = json[ClientIdPropertyName] ?? settings.ClientId;
                settings.ClientSecret = json[ClientSecretPropertyName] ?? settings.ClientSecret;
                settings.GrantType = json[GrantTypePropertyName] ?? settings.GrantType;
            }
            else
            {
                result.StatusCode = HttpStatusCode.BadRequest;
                result.ReasonPhrase = "Must be either form-encoded or json data.";
                return result;
            }

            if (String.IsNullOrWhiteSpace(settings.ClientId) || String.IsNullOrWhiteSpace(settings.ClientSecret))
            {
                result.StatusCode = HttpStatusCode.BadRequest;
                result.ReasonPhrase = "The client_id and client_secret values must be supplied in the request or defaulted to values by the service.";
                return result;
            }

            try
            {
                var accessTokenResponse = await MakeBrightcoveAccessTokenRequest(settings);

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
            catch(Exception ex)
            {
                result.StatusCode = HttpStatusCode.InternalServerError;
                result.ReasonPhrase = "An error occurred while attempting to obtain an access token from the Brightcove Auth Service: " + ex.Message;
            }

            return result;
        }

        private static string EncodeTo64(string toEncode)
        {
            byte[] toEncodeAsBytes = Encoding.ASCII.GetBytes(toEncode);
            return Convert.ToBase64String(toEncodeAsBytes);
        }

        private static async Task<HttpResponseMessage> MakeBrightcoveAccessTokenRequest(ProxySettings settings)
        {
            var authString = EncodeTo64(string.Format("{0}:{1}", settings.ClientId, settings.ClientSecret));

            HttpRequestMessage accessTokenRequest = new HttpRequestMessage(HttpMethod.Post, AccessTokenEndpointUrl);

            accessTokenRequest.Headers.Authorization = new AuthenticationHeaderValue("Basic", authString);
            accessTokenRequest.Headers.Host = new Uri(AccessTokenEndpointUrl).Authority;

            var formValues = new Dictionary<string, string>
            {
                { "grant_type", settings.GrantType }
            };

            accessTokenRequest.Content = new FormUrlEncodedContent(formValues);

            var httpClientFactory = s_serviceProvider.GetService<IHttpClientFactory>();
            var httpClient = httpClientFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromSeconds(settings.RequestTimeout == null ? 30 : settings.RequestTimeout.Value);

            return await httpClient.SendAsync(accessTokenRequest);
        }
    }
}
