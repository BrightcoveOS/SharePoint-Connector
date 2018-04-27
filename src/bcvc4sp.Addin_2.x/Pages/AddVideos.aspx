<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/BrightCoveApp.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Taxonomy" Namespace="Microsoft.SharePoint.Taxonomy" Assembly="Microsoft.SharePoint.Taxonomy, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="WebPartPageExpansion" content="full" />

    <!-- AWS SDK -->
    <script type="text/javascript" src="https://sdk.amazonaws.com/js/aws-sdk-2.1.24.min.js"></script>
    
    <!-- Dropbox SDK -->
    <script type="text/javascript" src="https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest.js"></script>

    <!-- Add your CSS styles to the following file -->
</asp:Content> 

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <WebPartPages:AllowFraming runat="server" />

    <link href="../Content/jquery-ui.css" rel="stylesheet" />

    <!-- ************************************************************************************************** -->
    <!-- Body Copy -->
    <!-- ************************************************************************************************** -->
    <input type="hidden" id="uxPagePath" runat="server" value="AddVideos.aspx" class="pageName" />
    <ol class="breadcrumb">
        <li><a href="#">Brightcove Management</a></li>
        <li class="addTitle active">Add Video</li>
        <li class="editTitle active" style="display:none">Edit Video</li>
    </ol>

    <!-- ************************************************************************************************** -->
    <!-- Add Video -->
    <!-- ************************************************************************************************** -->
    <div class="title addTitle ">
        <a class="addsingle tabActive" data-bind="click: AddVideoSingleTab">Add Single Video</a>
        &#160;&#160;&#160;
        <a class="addmulti tabInactive" data-bind="click: AddVideoMultiTab">Add Multiple Videos</a>
    </div>
    <div class="title editTitle" style="display:none">
        <span>Edit Video / </span>
        <a style="margin-left:370px;" href="#" 
            data-bind="attr: { 'href': $root.GetAddNewVideoLink() }">Add New Video</a>
    </div>

    <div class="formContent">

        <div id="selectAccount" class="form-group">
            <label class="required">Select Account</label>
            <select id="ddlSelectAccount" class="form-control"
                data-bind="foreach: AccountListData">
                <option data-bind="text: PropertyName, value: $data.AccountId(), attr: { 'data-item-id': PropertyId, 'data-client-id': $data.ClientId(), 'data-client-secret': $data.ClientSecret() }"></option>
            </select>
        </div>

        <div class="editVideoInfo" style="display: none">
            <div class="title">
                Edit Video - "Greg test avi source file" 
            </div>
            <table> 
                <tr>
                    <td>
                        <label>Account</label></td>
                    <td>Internal2</td>
                </tr>
                <tr>
                    <td>
                        <label>Video ID</label></td>
                    <td>123456789234</td>
                </tr>
                <tr>
                    <td>
                        <label>Reference ID</label></td>
                    <td>0421578</td>
                </tr>
            </table>
        </div>

        <div id="standardFields">

            <label id="referenceIdLabel" style="display:none;">Reference ID</label>
            <input id="txtRefereneId" style="display:none" class="form-control"
                data-bind="value: VideoData().ReferenceID" disabled="disabled" />

            <label id="referenceIdLabel" style="display:none;">SharePoint ID</label>
            <input id="txtRefereneId" style="display:none" class="form-control"
                data-bind="value: VideoData().SPID" disabled="disabled" />
            <div class="fieldWrapper">
                <label class="required">Name</label>
                <input id="txtName" class="form-control validate"
                    data-bind="value: VideoData().VideoTitle"
                    placeholder="The name of the video" />
            </div>
            <div class="fieldWrapper">
            <label>Short Description</label>
                <input id="txtShortDescription" class="form-control"
                    data-bind="value: VideoData().VideoShortDescription"
                    placeholder="Short description here..." />
            </div>
            <div class="fieldWrapper">
                <label>Long Description</label>
                <textarea id="txtLongDescription" runat="server" class="form-control"
                    data-bind="value: VideoData().VideoLongDescription"
                    placeholder="Long description here..." />
            </div>
            <div class="fieldWrapper">
                <label class="required">Is Active</label>
                <select id="ddlActive" class="form-control validate" 
                    data-bind="value: VideoData().Active">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>
            <label>Related Link URL</label>
            <input id="txtRelatedLinkURL" class="form-control"
                data-bind="value: VideoData().RelatedLink" />

            <label>Related Link Text</label>
            <input id="txtRelatedLinkText" class="form-control"
                data-bind="value: VideoData().RelatedLinkText" />

            <label>Start Availability Date</label>
            <input id="txtStartDate" class="form-control"
                data-bind="value: VideoData().VideoStartDate" onCopy="return false" onDrag="return false" onDrop="return false" onPaste="return false" />

            <label>End Availability Date</label>
            <input id="txtEndDate" class="form-control"
                data-bind="value: VideoData().VideoEndDate"  onCopy="return false" onDrag="return false" onDrop="return false" onPaste="return false"/>

            <label>Economics</label>
            <select id="ddlEconomics" class="form-control"
                data-bind="value: VideoData().Economics">
                <option value="FREE">Free</option>
                <option value="AD_SUPPORTED">Ad Supported</option>
            </select>

            <label>
                Brightcove Tags
                <br />
                (comma-separated)</label>
            <input id="brightcoveTags" class="form-control"
                data-bind="value: BrightCove.BCApp.Utilities.DisplayEditableTags($data)" />
            <input id="brightcoveSystemTags" class="form-control"
                data-bind="value: BrightCove.BCApp.Utilities.DisplaySystemTags($data)" type="hidden"/>
            </div>


            <div class="title" style="display:inline-block; width:100%">Custom Fields</div>
        
        
            <div id="customFields"></div>
            <br clear="all">
        
            <div class="fieldWrapper">
                <div class="title" style="display:inline-block; width:100%">Text Track Files</div>
                <div class="inputdiv">
                    <!-- type select -->
                    <input type="radio" name="texttrackfiletype" value="none" data-bind="click: ChangeTextTrackMode"> None
                    <input type="radio" name="texttrackfiletype" value="file" data-bind="click: ChangeTextTrackMode" checked="checked"> File Upload
                    <input type="radio" name="texttrackfiletype" value="url" data-bind="click: ChangeTextTrackMode"> Url Upload
                    <input type="radio" name="texttrackfiletype" value="remote"data-bind="click: ChangeTextTrackMode"> Remote Url
                </div>
                <div class="inputdiv texttrackfileinfo">
                    <!-- file upload -->
                    <input class="" type="file" id="textTrackFile" name="textTrackFile" accept=".vtt"/>
                    <!-- url -->
                    <input class="" id="textTrackUrl" name="textTrackUrl" style="display:none;" placeholder="Add URL"/>

                    <!-- file fields -->
                    <table id="TextTrackPropertyTbl" class="table table-striped">
                        <thead>
                            <tr>
                                <td><label class="required">Language</label></td>
                                <td><label class="">label</label></td>
                                <td><label class="">Kind</label></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <select id="txtTextTrackPropLang" class="">
                                        <option>ar</option>
                                        <option>ar-AE</option>
                                        <option>ar-BH</option>
                                        <option>ar-DZ</option>
                                        <option>ar-EG</option>
                                        <option>ar-IQ</option>
                                        <option>ar-JO</option>
                                        <option>ar-KW</option>
                                        <option>ar-LB</option>
                                        <option>ar-LY</option>
                                        <option>ar-MA</option>
                                        <option>ar-OM</option>
                                        <option>ar-QA</option>
                                        <option>ar-SA</option>
                                        <option>ar-SD</option>
                                        <option>ar-SY</option>
                                        <option>ar-TN</option>
                                        <option>ar-YE</option>
                                        <option>be</option>
                                        <option>be-BY</option>
                                        <option>bg</option>
                                        <option>bg-BG</option>
                                        <option>ca</option>
                                        <option>ca-ES</option>
                                        <option>cs</option>
                                        <option>cs-CZ</option>
                                        <option>da</option>
                                        <option>da-DK</option>
                                        <option>de</option>
                                        <option>de-AT</option>
                                        <option>de-CH</option>
                                        <option>de-DE</option>
                                        <option>de-LU</option>
                                        <option>el</option>
                                        <option>el-CY</option>
                                        <option>el-GR</option>
                                        <option>en</option>
                                        <option>en-AU</option>
                                        <option>en-CA</option>
                                        <option>en-GB</option>
                                        <option>en-IE</option>
                                        <option>en-IN</option>
                                        <option>en-MT</option>
                                        <option>en-NZ</option>
                                        <option>en-PH</option>
                                        <option>en-SG</option>
                                        <option>en-US</option>
                                        <option>en-ZA</option>
                                        <option>es</option>
                                        <option>es-AR</option>
                                        <option>es-BO</option>
                                        <option>es-CL</option>
                                        <option>es-CO</option>
                                        <option>es-CR</option>
                                        <option>es-DO</option>
                                        <option>es-EC</option>
                                        <option>es-ES</option>
                                        <option>es-GT</option>
                                        <option>es-HN</option>
                                        <option>es-MX</option>
                                        <option>es-NI</option>
                                        <option>es-PA</option>
                                        <option>es-PE</option>
                                        <option>es-PR</option>
                                        <option>es-PY</option>
                                        <option>es-SV</option>
                                        <option>es-US</option>
                                        <option>es-UY</option>
                                        <option>es-VE</option>
                                        <option>et</option>
                                        <option>et-EE</option>
                                        <option>fi</option>
                                        <option>fi-FI</option>
                                        <option>fr</option>
                                        <option>fr-BE</option>
                                        <option>fr-CA</option>
                                        <option>fr-CH</option>
                                        <option>fr-FR</option>
                                        <option>fr-LU</option>
                                        <option>ga</option>
                                        <option>ga-IE</option>
                                        <option>he</option>
                                        <option>he-IL</option>
                                        <option>hi-IN</option>
                                        <option>hr</option>
                                        <option>hr-HR</option>
                                        <option>hu</option>
                                        <option>hu-HU</option>
                                        <option>id</option>
                                        <option>id-ID</option>
                                        <option>is</option>
                                        <option>is-IS</option>
                                        <option>it</option>
                                        <option>it-CH</option>
                                        <option>it-IT</option>
                                        <option>ja</option>
                                        <option>ja-JP</option>
                                        <option>ja-JP-u-ca-japanese-x-lvariant-JP</option>
                                        <option>ko</option>
                                        <option>ko-KR</option>
                                        <option>lt</option>
                                        <option>lt-LT</option>
                                        <option>lv</option>
                                        <option>lv-LV</option>
                                        <option>mk</option>
                                        <option>mk-MK</option>
                                        <option>ms</option>
                                        <option>ms-MY</option>
                                        <option>mt</option>
                                        <option>mt-MT</option>
                                        <option>nl</option>
                                        <option>nl-BE</option>
                                        <option>nl-NL</option>
                                        <option>nn-NO</option>
                                        <option>no</option>
                                        <option>no-NO</option>
                                        <option>pl</option>
                                        <option>pl-PL</option>
                                        <option>pt</option>
                                        <option>pt-BR</option>
                                        <option>pt-PT</option>
                                        <option>ro</option>
                                        <option>ro-RO</option>
                                        <option>ru</option>
                                        <option>ru-RU</option>
                                        <option>sk</option>
                                        <option>sk-SK</option>
                                        <option>sl</option>
                                        <option>sl-SI</option>
                                        <option>sq</option>
                                        <option>sq-AL</option>
                                        <option>sr</option>
                                        <option>sr-BA</option>
                                        <option>sr-CS</option>
                                        <option>sr-Latn</option>
                                        <option>sr-Latn-BA</option>
                                        <option>sr-Latn-ME</option>
                                        <option>sr-Latn-RS</option>
                                        <option>sr-ME</option>
                                        <option>sr-RS</option>
                                        <option>sv</option>
                                        <option>sv-SE</option>
                                        <option>th</option>
                                        <option>th-TH</option>
                                        <option>th-TH-u-nu-thai-x-lvariant-TH</option>
                                        <option>tr</option>
                                        <option>tr-TR</option>
                                        <option>uk</option>
                                        <option>uk-UA</option>
                                        <option>vi</option>
                                        <option>vi-VN</option>
                                        <option>zh</option>
                                        <option>zh-CN</option>
                                        <option>zh-HK</option>
                                        <option>zh-SG</option>
                                        <option>zh-TW</option>
                                    </select>
                                </td>
                                <td>
                                    <input id="txtTextTrackPropLabel" class="" ></td>
                                <td>
                                    <select id="txtTextTrackPropKind">
                                        <option>captions</option>
                                        <option>subtitles</option>
                                        <option>descriptions</option>
                                        <option>chapters</option>
                                        <option>metadata</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4">
                                    <input type="button" id="btnAddTextTrack" value="Add" class="btn btn-primary" data-bind="click: AddTextTrack">
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <!-- uploaded -->
                    <table id="TextTrackFilesTbl" class="table table-striped">
                        <thead>
                            <tr>
                                <td>Label</td>
                                <td>Language</td>
                                <td>Kind</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="fieldWrapper">
                <div class="title" style="display:inline-block; width:100%">Image Details</div>
            

                <label>Video Still</label>
                <br clear="both"/>
                <img data-bind="visible: VideoData().VideoStillImage, attr: { 'src': VideoData().VideoStillImage }"/>
                <label>Thumbnail</label>
                <br clear="both"/>
                <img data-bind="visible: VideoData().VideoThumbNail, attr: { 'src': VideoData().VideoThumbNail }"/>
            </div>
            
            <label id="videoFileLabel" class="required">Video File(s)</label>
            <div class="inputdiv">
                <div id="create_video" method="post" enctype="multipart/form-data"
                    target="postFrame" action="https://api.brightcove.com/services/post">
                    <input type="hidden" name="JSONRPC" id="JSONRPC" />
                        
                    <input class="validate" type="file" id="videoFile" name="filePath"/>
                    <input type="button" id="addMultiFile" value="Add another file" data-bind="click: AddVideoMulti" style="display:none;"/>
                    <%--<input name="JSONView" id="JSONView" style="width: 100%; border: none; display: none" />--%>
                </div>
            </div>
            <br clear="all" />
            
            <hr />
            <div id="submitVideo" class="bottom-buttons">
                <input type="button" id="btnSave" value="Save" class="btn btn-primary"
                    data-bind="click: AddVideo" />
            </div>
            <br clear="both" />
        </div>
              
        <iframe id="postStillFrame" name="postStillFrame" 
            style="width: 100%; border: none; display: none" onload=""></iframe>
        <iframe id="postThumbFrame" name="postThumbFrame" 
            style="width: 100%; border: none; display: none" onload=""></iframe>  
        <iframe id="postFrame" name="postFrame" 
            style="width: 100%; border: none; display: none" onload=""></iframe>
        

        <div id="reload" class="bottom-buttons" style="display: none">
            <h4>Item has been succesfully uploaded</h4>
            <a href="#" id="btnReload" class="btn btn-primary"
            data-bind="attr: { 'href': $root.GetAddNewVideoLink() }">Add Another Video</a>
        </div>
    <!-- ************************************************************************************************** -->
    <!-- End Body Copy -->
    <!-- ************************************************************************************************** -->
     <div id="overlay-inAbox" class="overlay">
        <div class="toolbar"><a class="close" href="#"><span>x</span> close</a></div>
        <div class="wrapper">
            
        </div>
    </div>
</asp:Content>
