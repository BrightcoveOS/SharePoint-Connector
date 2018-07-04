namespace bcvc4sp.ProxyAzureFunction
{
    using Microsoft.Extensions.Configuration;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    public sealed class ProxySettings
    {
        private static IConfiguration s_configuration;
        private static object s_syncRoot = new object();

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
        public static ProxySettings GetProxySettings()
        {
            if (s_configuration == null)
            {
                lock(s_syncRoot)
                {
                    if (s_configuration == null)
                    {
                        var builder = new ConfigurationBuilder()
                           .SetBasePath(Directory.GetCurrentDirectory())
                           .AddEnvironmentVariables();
                           //.AddJsonFile("proxyDefaults.json");
                        s_configuration = builder.Build();
                    }
                }
               
            }

            var proxySettings = new ProxySettings
            {
                ClientId = s_configuration["BC_ClientId"],
                ClientSecret = s_configuration["BC_ClientSecret"],
            };

            var origins = s_configuration["BC_Origins"];
            if (!string.IsNullOrWhiteSpace(origins))
            {
                var arrOrigins = origins.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                proxySettings.AllowedOrigins = arrOrigins.Select(v => v.Trim()).ToArray();
            }
            else
            {
                proxySettings.AllowedOrigins = null;
            }

            if (int.TryParse(s_configuration["BC_RequestTimeout"], out int requestTimeout))
            {
                proxySettings.RequestTimeout = requestTimeout;
            }

            return proxySettings;
        }
    }
}
