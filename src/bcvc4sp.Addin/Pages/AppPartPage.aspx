<%@ Page Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<!-- Required to be used in an App Part -->
<WebPartPages:AllowFraming runat="server" />

<html>
    <head>
        <title></title>
        <meta name="WebPartPageExpansion" content="full" />

        <!-- SP References -->
        <script src="/_layouts/1033/init.js"></script>
        <script src="/_layouts/15/MicrosoftAjax.js"></script>
        <script src="/_layouts/15/sp.core.js"></script>
        <script src="/_layouts/15/sp.runtime.js"></script>
        <script src="/_layouts/15/sp.js"></script>
        <!-- Reference to the production css bundle. Update the hash after a build. -->
        <link rel="Stylesheet" type="text/css" href="../static/css/vendor.da20cd26.css" />
        <link rel="Stylesheet" type="text/css" href="../static/css/main.c1b14590.css" />
    </head>
    <body>
        <form runat="server">
            <!-- Required to make posts to SP -->
            <SharePoint:FormDigest runat="server" />

            <!-- Add your html here -->
            <noscript>
                You need to enable JavaScript to run this app.
            </noscript>
            <div id="root"></div>
            <script type="text/javascript" src="../static/js/runtime.54c9d146.js"></script>
            <script type="text/javascript" src="../static/js/vendor.150f0cd7.js"></script>
            <script type="text/javascript" src="../static/js/main.26036b71.js"></script>
        </form>
    </body>
</html>