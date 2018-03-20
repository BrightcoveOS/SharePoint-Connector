using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Mvc;

namespace Akumina.Proxy.Controllers
{
    public class HomeController : Controller 
    {
        public ActionResult Index()
        {

            ViewBag.InstalledMessage = "";

            if (Request.Params["debug"] != null)
            {
                ViewBag.InstalledMessage = "Installed.";
            }

        
            return View();
        }
    }
}
