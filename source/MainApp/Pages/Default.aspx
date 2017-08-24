<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/BrightCoveApp.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="WebPartPageExpansion" content="full" />
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <input type="hidden" id="uxPagePath" runat="server" value="default.aspx" class="pageName" />

    <div class="jumbotron">
        <h1>Brightcove Video Connector</h1>
        <p class="lead">
        </p>
        <p>
            <a href="http://www.brightcove.com" target="_blank" class="btn btn-primary btn-lg">Visit Brightcove &raquo;</a>

        </p>
    </div>
    <button class="btn btn-default btn-lg btn-block hidden" onclick="javascript:BrightCove.BCApp.Installer.CreateCustomList(BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);return false" id="btnAccounts">Create Account List</button>
    <button class="btn btn-default btn-lg btn-block hidden" onclick="javascript:BrightCove.BCApp.Installer.CreateCustomList(BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);return false" id="btnVideos">Create Videos List</button>
    <button class="btn btn-default btn-lg btn-block hidden" onclick="javascript:BrightCove.BCApp.Installer.CreateCustomList(BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList);return false" id="btnBrightcoveSettings">Create Settings List</button>
    <div><span id="errorMessage"></span></div>
    <br />
    <div class="jumbotron proxyMessage hidden">
        <p class="lead">The Proxy Url is not set in the Settings List. You will not be able to upload videos without it.</p>
        <p>
            <a target="_blank" class="btn btn-primary btn-lg">View the list in SharePoint »</a>

        </p>
    </div>
            
</asp:Content>
