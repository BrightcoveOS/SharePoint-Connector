namespace bcvc4sp.ProxyAzureFunction
{
    using Microsoft.Extensions.Configuration;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public sealed class ProxySettings
    {
        public ProxySettings()
        {

            GrantType = "client_credentials";
        }

        public string ClientId
        {
            get;
            set;
        }

        public string ClientSecret
        {
            get;
            set;
        }

        public string GrantType
        {
            get;
            set;
        }

        public IEnumerable<string> AllowedOrigins
        {
            get;
            set;
        }

        public int? RequestTimeout
        {
            get;
            set;
        }

        /// <summary>
        /// Returns a proxy settings object by using configuration.
        /// </summary>
        /// <returns></returns>
        public static ProxySettings GetProxySettings(IConfiguration configuration)
        {
            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }

            var proxySettings = new ProxySettings
            {
                ClientId = configuration["BC_ClientId"],
                ClientSecret = configuration["BC_ClientSecret"],
                GrantType = configuration["BC_GrantType"],
            };

            var origins = configuration["BC_Origins"];
            if (!string.IsNullOrWhiteSpace(origins))
            {
                var arrOrigins = origins.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                proxySettings.AllowedOrigins = arrOrigins.Select(v => v.Trim()).ToArray();
            }
            else
            {
                proxySettings.AllowedOrigins = null;
            }

            if (int.TryParse(configuration["BC_RequestTimeout"], out int requestTimeout))
            {
                proxySettings.RequestTimeout = requestTimeout;
            }

            return proxySettings;
        }
    }
}
