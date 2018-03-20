using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Akumina.Proxy
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            var brightcoveOrigins = "";
            var brightcoveOriginsSetting =
                    ConfigurationManager.AppSettings["brightcove:origins"];
            if (brightcoveOriginsSetting != null)
            {
                brightcoveOrigins = brightcoveOriginsSetting;
            }
            var enableCorsAttribute = new EnableCorsAttribute(brightcoveOrigins,
                                                  "Origin, Content-Type, Accept",
                                                  "POST");
            config.EnableCors(enableCorsAttribute);

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{*id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
