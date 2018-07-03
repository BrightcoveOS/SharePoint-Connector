namespace Akumina.Proxy.Controllers
{
    using System.Web.Mvc;

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
