namespace bcvc4sp.ProxyAzureFunction.Extensions
{
    using Newtonsoft.Json;
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;

    public static class HttpContentExtensions
    {
        private const string ApplicationJsonEncoded = "application/json";

        /// <summary>
        /// Determines whether the specified content is json data, also known as <c>application/json</c> data.
        /// </summary>
        /// <param name="content">The content.</param>
        /// <returns>
        /// <c>true</c> if the specified content is json encoded data; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsJsonData(this HttpContent content)
        {
            if (content == null)
            {
                throw new ArgumentNullException(nameof(content));
            }

            MediaTypeHeaderValue contentType = content.Headers.ContentType;
            return contentType != null && String.Equals(ApplicationJsonEncoded, contentType.MediaType, StringComparison.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Returns a <see cref="Task{T}"/> that will yield a <see cref="Dynamic"/> object containing the json data
        /// parsed from the <paramref name="content"/> instance.
        /// </summary>
        /// <param name="content">The content.</param>
        /// <returns>A <see cref="Task{T}"/> which will provide the result. If the data can not be read
        /// as json data then the result is null.</returns>
        public static async Task<dynamic> ReadAsJsonAsync(this HttpContent content)
        {
            if (content == null)
            {
                throw new ArgumentNullException(nameof(content));
            }

            var requestBody = await content.ReadAsStringAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            return data;
        }
    }
}
