<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/BrightCoveApp.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <%--<link rel="Stylesheet" type="text/css" href="../Content/App.css" />--%>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    
    <!-- ************************************************************************************************** -->
    <!-- Body Copy -->
    <!-- ************************************************************************************************** -->
    <input type="hidden" id="uxPagePath" runat="server" value="AccountManagement.aspx" class="pageName" />
                
    <!-- ************************************************************************************************** -->
    <!-- Breadcrumb -->
    <!-- ************************************************************************************************** -->
    <ol class="breadcrumb">
        <li><a href="#">Brightcove Management</a></li>
        <li class="active">Account Management</li>
    </ol>


    <!-- ************************************************************************************************** -->
    <!-- Account Add/Select View -->
    <!-- ************************************************************************************************** -->

    <div class="loadingLogo hideSection"></div>

    <div id="AccountSelect">
        <table id="AccountSelectTbl" class="table table-striped">
            <thead>
                <td>Account Title</td>
                <td>AuthorsGroup</td>
                <td>ViewersGroup</td>
            </thead>
            <tbody data-bind="foreach: AccountListData">
                <tr>
                    <td>
                        <button onclick="return false;" class="btn btn-primary btn-lg account mLinks"
                            data-bind="attr: { 'data-item-id': PropertyId, 'data-item-index': $index }"
                            data-toggle="showhide" data-hidetarget="#AccountSelect" data-target="#AccountEdit">
                            <span data-bind="text: PropertyName"></span>
                        </button>
                    </td>
                    <td>
                        <span data-bind="text: AccountAuthorsGroupName"></span>
                    </td>
                    <td>
                        <span data-bind="text: AccountViewersGroupName"></span>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr />
        <div>
            <a class="btn btn-default btn-lg mLinks" 
                onclick="return false;"
                data-bind="click: AddAccount"
                id="AddAccountBtn" href="javascrit:void(0)"
                    data-toggle="showhide"
                    data-hidetarget="#AccountSelect"
                    data-target="#AccountEdit">
                <span class="glyphicon glyphicon-plus"></span>
                Add new account
            </a>
            <hr />


        </div>
    </div>
    <!-- ************************************************************************************************** -->
    <!-- Account Edit View -->
    <!-- ************************************************************************************************** -->
    <div id="AccountEdit" class="hideSection">
        <table id="AccountEditTbl" class="table table-striped">
            <thead>
                <td>Property</td>
                <td>Value</td>
                <td>Description</td>
            </thead>
            <tbody>
                <tr>
                    <td class="NameField">
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AccountName" data-bind="click: ShowPropModal">
                            Account Name
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AccountName"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().PropertyName">
                            <span data-bind="text: CurrentAccount().PropertyName"></span>
                        </button>
                    </td>
                    <td>This field is used to specify the account name</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="VideoPlayerId" data-bind="click: ShowPropModal">
                            DefaultVideoPlayerId
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="VideoPlayerId"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().DefaultVideoPlayerId">
                            <span data-bind="text: CurrentAccount().DefaultVideoPlayerId"></span>
                        </button>
                    </td>
                    <td>This field is used to specify the default video player of the account</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="PlayListId" data-bind="click: ShowPropModal">
                            DefaultPlaylistPlayerId
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="PlayListId"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().DefaultPlaylistPlayerId">
                            <span data-bind="text: CurrentAccount().DefaultPlaylistPlayerId"></span>
                        </button>
                    </td>
                    <td>This field is used to specify the default playlist id of the account</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AccountId" data-bind="click: ShowPropModal">
                            Account Id
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AccountId"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().AccountId">
                            <span data-bind="text: CurrentAccount().AccountId"></span>
                        </button>
                    </td>
                    <td>The Brightcove Account Id</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="ClientId" data-bind="click: ShowPropModal">
                            Client Id
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="ClientId"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().ClientId">
                            <span data-bind="text: CurrentAccount().ClientId"></span>
                        </button>
                    </td>
                    <td>The Brightcove API Authentication Client Id</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="ClientSecret" data-bind="click: ShowPropModal">
                            Client Secret
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="ClientSecret"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().ClientSecret">
                            <span data-bind="text: CurrentAccount().ClientSecret"></span>
                        </button>
                    </td>
                    <td>The Brightcove API Authentication Client Secret</td>
                </tr>
                <!-- storage location -->
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="TemporaryStorageLocation" data-bind="click: ShowPropModal">
                            Temporary Storage Location
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="TemporaryStorageLocation"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().TemporaryStorageLocation">
                            <span data-bind="text: CurrentAccount().TemporaryStorageLocation"></span>
                        </button>
                    </td>
                    <td>The temporary storage location to be used - either Amazon Web Services (AWS) or Dropbox.</td>
                </tr>
                <!-- storage location -->
                <!-- AWS fields -->
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AWSAccessKeyId" data-bind="click: ShowPropModal">
                            AWS Access Key Id
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AWSAccessKeyId"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().AWSAccessKeyId">
                            <span data-bind="text: CurrentAccount().AWSAccessKeyId"></span>
                        </button>
                    </td>
                    <td>The Amazon Web Services (AWS) access key id.</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AWSSecretAccessKey" data-bind="click: ShowPropModal">
                            AWS Secret Access Key
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AWSSecretAccessKey"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().AWSSecretAccessKey">
                            <span data-bind="text: CurrentAccount().AWSSecretAccessKey"></span>
                        </button>
                    </td>
                    <td>The Amazon Web Services (AWS) secret access key.</td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AWSBucketName" data-bind="click: ShowPropModal">
                            AWS Bucket Name
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AWSBucketName"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().AWSBucketName">
                            <span data-bind="text: CurrentAccount().AWSBucketName"></span>
                        </button>
                    </td>
                    <td>The Amazon Web Services (AWS) bucket name.</td>
                </tr>
                <!-- AWS fields -->
                <!-- Dropbox fields -->
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="DropboxAccessToken" data-bind="click: ShowPropModal">
                            Dropbox Access Token
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="DropboxAccessToken"
                            data-bind="click: ShowPropModal, visible: CurrentAccount().DropboxAccessToken">
                            <span data-bind="text: CurrentAccount().DropboxAccessToken"></span>
                        </button>
                    </td>
                    <td>The Dropbox access token.</td>
                </tr>
                <!-- Dropbox fields -->
            </tbody>
        </table>

        <hr />
        <h5 style="font-weight: bold">Custom Fields</h5>
        <table id="AccountTokensTbl" class="table table-striped">
            <thead>
                <td>Value (Brightcove Internal name)</td>
                <td>Required</td>
            </thead>
            <tbody data-bind="foreach: CurrentReadTokens">
                <tr class="tokenData">
                    <td data-bind="attr: { 'data-item-index': $index }">
                        <div class="btn-primary btn-lg account mLinks"
                            data-field-type="Tokens"
                            data-bind="attr: { 'data-item-index': $index, 'data-token-type': $root.FormatTokenType($data) }">
                            <span data-bind="text: $root.FormatCustomFieldName($data)"></span>
                        </div>
                    </td>
                    <td data-bind="text: $root.FormatCustomFieldRequired($data)">Read</td>
                </tr>
            </tbody>
        </table>

        <div>
            <a class="btn btn-default" data-bind="click: EditFields" href="javascrit:void(0)" data-toggle="showhide">
                Edit Custom Fields
            </a>
        </div>

        <hr />
        
        <table id="AccountGroupsTbl" class="table table-striped">
            <thead>
                <td>Group</td>
                <td>Value</td>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AuthorsGroup" data-bind="click: ShowGroupsPropModal">
                            Author's Group
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="AuthorsGroup"
                            data-bind="click: ShowGroupsPropModal">
                            <span data-bind="text: CurrentAccount().AccountAuthorsGroupName"></span>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="ViewersGroup" data-bind="click: ShowGroupsPropModal">
                            Viewer's Group
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-lg account mLinks"
                            data-field-type="ViewersGroup"
                            data-bind="click: ShowGroupsPropModal">
                            <span data-bind="text: CurrentAccount().AccountViewersGroupName"></span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <hr />
            <a class="btn btn-default btn-lg mLinks" onclick="return false;"
                data-bind="click: SaveAccountChanges">
                Save Account
            </a>
            <a class="btn btn-default btn-lg mLinks" onclick="return false;"
                data-bind="click: DeleteAccount">
                Delete Account
            </a>
            <a class="btn btn-default btn-lg mLinks" id="CancelEditAccount" 
                href="javascrit:void(0)" 
                data-toggle="showhide"
                data-hidetarget="#AccountEdit" 
                data-target="#AccountSelect" 
                onclick="return false;">
                Cancel
            </a>
        </div>
    </div>

    <!-- ************************************************************************************************** -->
    <!-- Account Modals -->
    <!-- ************************************************************************************************** -->
    <!-- Modals -->
    <div class="modal fade" id="SinglePropertyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        <span data-bind="text: CurrentModalTitleString"></span>
                    </h4>
                </div>
                <div class="modal-body">
                    <h4>Value</h4>
                    <input type="text" data-bind="value: CurrentModalValueString"></input>
                    <select id="temporaryStorageLocationSelect" style=""display:none;">
                        <option value="aws">Amazon Web Services</option>
                        <option value="dropbox">Dropbox</option>
                    </select>
                    <br />
                    <h4>Description</h4>
                    <span data-bind="text: CurrentModalValueDescription"></span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary"
                        data-bind="click: SaveSinglePropertyChange">
                        Ok</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="TokenPropertyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        <span data-bind="text: CurrentModalTitleString"></span>
                    </h4>
                </div>
                Below is the complete list of custom fields defines in Video Cloud for this account. To Make them available in SharePoint check the "Include" box.
                <table id="CustomFieldsTbl" class="table table-striped">
                    <thead>
                        <tr>
                            <td>Video cloud custom Field</td>
                            <td>Type</td>
                            <td>Required</td>
                            <td>Include</td>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
                <%--
                <div class="modal-body">
                    <h4>Token Type</h4>
                    <select id="TokenTypeSelect">
                        <option value="Read">Read</option>
                        <option>ReadURL</option>
                        <option>Write</option>
                    </select>
                    <h4>Value</h4>
                    <input type="text" id="TokenField"></input>
                    <br />
                </div>
                --%>
                <div class="modal-footer">
                    <button id="addToken" type="button" class="btn btn-primary"
                        data-bind="click: SaveCustomFieldsChange">
                        Ok</button>
                    <button id="cancelToken" type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button id="deleteToken" type="button" class="btn btn-default"
                        data-bind="click: DeleteToken">
                        Delete</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="AccountGroupManagerModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        <span data-bind="text: CurrentModalTitleString"></span>
                    </h4>
                </div>
                <div class="modal-body">
                    <h4>Select a group</h4>
                    <select id="AuthorsGroupSelect">
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary"
                        data-bind="click: SaveGroupsPropModal">
                        Ok</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ************************************************************************************************** -->
    <!-- End Body Copy -->
    <!-- ************************************************************************************************** -->

</asp:Content>
