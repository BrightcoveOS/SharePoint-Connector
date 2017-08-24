using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Akumina.Proxy.Controllers
{
    public class ProxyController : ApiController
    {
        // GET api/proxy
        public HttpResponseMessage Get()
        {
            return GetRequest(Request);
        }

        // POST api/proxy
        public HttpResponseMessage Post()
        {
            return GetRequest(Request);

        }

        private HttpResponseMessage GetRequest(HttpRequestMessage request)
        {
            HttpResponseMessage result = request.CreateResponse();
            string requestUrl = request.RequestUri.AbsoluteUri;
            string requestPathAndQuery = request.RequestUri.PathAndQuery.Substring("/api/proxy".Length);
            string redirectUri = "http://api.brightcove.com/services/post" + requestPathAndQuery;
            // string redirectUri = requestUrl.Replace("http://sp13dev10.dev.corp.akumina.com:49196/api/proxy", "https://api.brightcove.com/services/post");
            Uri redurectUri = new Uri(redirectUri);

            if (System.Web.HttpContext.Current.Request.ServerVariables["http_host"] != redurectUri.DnsSafeHost + ":" + redurectUri.Port)
            {
                HttpRequestMessage forwardRequest = request.Clone(redirectUri);

                HttpClient client = new HttpClient();
                Task<HttpResponseMessage> response = client.SendAsync(forwardRequest);
                Task.WaitAll(new Task[] { response });

                if (request.Method == HttpMethod.Post)
                {
                    string existing = response.Result.Content.ReadAsStringAsync().Result.ToString();
                    string listener = "<script>parent.postMessage('" + existing + "', \"" + request.RequestUri.Scheme + "://" + request.Headers.Referrer.DnsSafeHost + "\");</script>";
                    response.Result.Content = new StringContent("<html><head>" + listener + "</head><body>" + existing + "</body>");
                    result = response.Result;
                    result.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                }
                else 
                {
                    result = response.Result;
                }
            }


            return result;
        }



    }
}