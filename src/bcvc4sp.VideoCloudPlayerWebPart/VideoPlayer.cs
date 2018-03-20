using Microsoft.SharePoint.WebPartPages;
using System.ComponentModel;
using System.Web.UI.WebControls.WebParts;

namespace BrightcoveVideoCloudPlayer
{
    [ToolboxItemAttribute(false)]
    public class VideoPlayer : Microsoft.SharePoint.WebPartPages.WebPart
    {
        [Category("Brightcove Configuration"), WebDisplayName("Player Height"), WebBrowsable(true), Personalizable(PersonalizationScope.Shared), DefaultValue("390")]
        public string PlayerHeight { get; set; }

        [Category("Brightcove Configuration"), WebDisplayName("Background Color"), WebBrowsable(true), Personalizable(PersonalizationScope.Shared), DefaultValue("#FFFFFF")]
        public string BackgroundColor { get; set; }

        [Category("Brightcove Configuration"), WebDisplayName("Player Width"), WebBrowsable(true), Personalizable(PersonalizationScope.Shared), DefaultValue("640")]
        public string PlayerWidth { get; set; }

        [Category("Brightcove Configuration"), WebDisplayName("Auto Start"), WebBrowsable(true), Personalizable(PersonalizationScope.Shared), DefaultValue("")]
        public bool AutoStart { get; set; }

        [Category("Brightcove Configuration"), WebDisplayName("Account ID"), WebBrowsable(true), Personalizable(PersonalizationScope.Shared), DefaultValue("")]
        public string AccountID { get; set; }

        [Category("Brightcove Configuration"), WebDisplayName("Player ID"), WebBrowsable(true), Personalizable(PersonalizationScope.Shared), DefaultValue("default")]
        public string PlayerID { get; set; }

        [Category("Brightcove Configuration"), WebDisplayName("Video ID"), WebBrowsable(true), Personalizable(PersonalizationScope.Shared), DefaultValue("")]
        [HtmlDesignerAttribute("")]
        public string VideoID { get; set; }

        [Category("Brightcove Configuration"), WebDisplayName("Playlist ID"), WebBrowsable(true), Personalizable(PersonalizationScope.Shared), DefaultValue("")]
        [HtmlDesignerAttribute("")]
        public string PlaylistID { get; set; }
    }
}
