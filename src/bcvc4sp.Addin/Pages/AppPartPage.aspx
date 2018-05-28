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
        <link rel="Stylesheet" type="text/css" href="http://localhost:3000/static/css/vendor.css" />
        <link rel="Stylesheet" type="text/css" href="http://localhost:3000/static/css/main.css" />
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
            <script type="text/javascript" src="http://localhost:3000/static/js/runtime.js"></script>
            <script type="text/javascript" src="http://localhost:3000/static/js/vendor.js"></script>
            <script type="text/javascript" src="http://localhost:3000/static/js/main.js"></script>
        </form>
    </body>
</html>