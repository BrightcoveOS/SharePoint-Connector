namespace Akumina.Proxy
{
    using System;
    using System.Configuration;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web.Cors;
    using System.Web.Http.Cors;

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public sealed class GlobalEnableCorsAttribute : Attribute, ICorsPolicyProvider
    {
        public bool SupportsCredentials = true;

        public Task<CorsPolicy> GetCorsPolicyAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var corsRequestContext = request.GetCorsRequestContext();
            var originRequested = corsRequestContext.Origin;

            string approvedOrigin = AllowedCorsOrigin(originRequested);

            if (String.IsNullOrWhiteSpace(approvedOrigin))
            {
                return Task.FromResult<CorsPolicy>(null);
            }

            // Grant CORS request
            var policy = new CorsPolicy
            {
                AllowAnyHeader = true,
                AllowAnyMethod = true,
                SupportsCredentials = true,
            };

            // add headers
            policy.Headers.Add("content-type");
            policy.Headers.Add("withcredentials");
            policy.Headers.Add("Access-Control-Allow-Headers");
            policy.Headers.Add("Access-Control-Allow-Origin");
            policy.Headers.Add("Origin");
            policy.Headers.Add("Accept");
            policy.Headers.Add("X-Requested-With");
            policy.Headers.Add("Access-Control-Request-Method");
            policy.Headers.Add("Access-Control-Request-Headers");

            if (approvedOrigin == "*")
            {
                policy.AllowAnyOrigin = true;
            }
            else
            {
                policy.AllowAnyOrigin = false;
                policy.Origins.Add(approvedOrigin);
            }

            return Task.FromResult(policy);
        }

        public static string AllowedCorsOrigin(string providedOrigin)
        {
            // load list of web.config origins
            string fullList = ConfigurationManager.AppSettings["brightcove:origins"];

            if (String.IsNullOrWhiteSpace(fullList))
            {
                return null;
            }

            if (fullList == "*")
            {
                return "*";
            }

            if (String.IsNullOrWhiteSpace(providedOrigin) || String.IsNullOrWhiteSpace(fullList))
            {
                return null;
            }

            string[] originArray = fullList.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

            foreach (string approvedOrigin in originArray)
            {
                if (providedOrigin.ToLowerInvariant().Trim() == approvedOrigin.ToLowerInvariant().Trim())
                {
                    return providedOrigin;
                }
            }

            return null;
        }
    }
}