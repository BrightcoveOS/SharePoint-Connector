<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="BrightcoveVideoCloudPlayer.ascx.cs" Inherits="BrightcoveVideoCloudPlayer.BrightcoveVideoCloudPlayer.BrightcoveVideoCloudPlayer" %>
<style type="text/css">

.picklist.selected {
    display:none;
    }

/* Picklist styles */
.picklist, .picklistControls
{
    float:left;
    vertical-align:middle;
}

.picklist .content
{
    /*width:208px;*/
    width:450px;
    height:250px;
    overflow-x:hidden;
    overflow-y:scroll;
	border:1px solid silver;
}

.picklist .videosAvailable
{
	/*height:250px;*/
    overflow-x:hidden;
}
    
.picklist .content .item
{
    width:437px;
    height:35px;
    vertical-align:middle;
    clear:both;
    border-bottom:1px solid silver;
    padding-top:5px;
    padding-bottom:5px;
    cursor:pointer;
}
    
.videoName
{
    font-weight:bold;
    color:#000000;
    overflow: hidden;
}
    
.videoId
{
    color:Gray;
}

.videoCheckbox
{
    width:25px;
    float:left;
    display:none;
}
    
.videoThumb
{
    width:40px;
    float:left;
    margin-right:5px;
    margin-left:5px;
}

.videoMetadata
{
    width:367px;
    float:left;
    text-wrap:none;
    overflow-x:hidden;
}

.videoMetadata .videoName
{
    display:inline-block;
    width:367px;
    height:15px;
    text-wrap:none;
    overflow-x:hidden;
    white-space: nowrap;
}
    
.videoThumb img
{
    max-width:40px;
    max-height:30px;
}

.picklistControls
{
    display:none;
	margin-top:80px;
	width:100px;
	text-align:center;
}


.picklistControls button
{
    margin-bottom:10px;
    width:80px;
    padding-left:2px;
    padding-right:2px;
}

#divAccount{ margin-top:8px}

.picklistControls .controlSection
{
    display:none;
	margin-bottom:8px;
}

.searchBox
{
    margin-bottom:5px;
}

.searchBox input
{
	/*width:181px;*/
	width:223px;
}

.searchBox button
{
	width:25px;
	background-image:url(/_layouts/images/gosearch15.png);
    min-width:  1px;
    padding: 1px;
}

.searchBox button, .searchBox input
{
	margin:0 0 0 0;
	border:none;
	border:1px solid silver;
}

.searchBox_default_text
{
	font-style:italic;
	color:silver;
}

.itemSelected
{
	background-color:#8bd1ee;
}

#playlistName, #playlistType, #tags, #videos
{
    width:200px;
    font-size:12px;
    font-family: Verdana,Arial,Helvetica,sans-serif;
}

#playlistName, #tags, #videos
{
    height:16px;
}

#playlistType
{
    height:20px;
}

#divPicklist
{
    margin-top:5px;
    
}

.picklist .moveButtons input
{
    vertical-align:middle;
}

.picklist .moveButtons
{
    width:208px;
    height:16px;
    clear:both;
    color:#000000;
    vertical-align:middle;
}

.picklist .moveButtons > input
{
    margin-left:1px;
    float:left;
}

.picklist .moveButtons > span
{
    float:right;
}

.picklist .moveButtons label
{
    margin-top:2px;
    float:left;
    font-weight:normal;
    color:gray;
}

.picklist .moveButtons button
{
    width:50px;
    height:20px;
    font-size:11px;
    padding-top:0;
}

.buttonBlock
{
 text-align:right;
}

.divPicklist, #divPicklist
{
	overflow:hidden;
	
}

.chooserContainer
{
    margin-left:25px;
    
}

.videosAvailable
{
    margin-top: 10px;
	width:250px;
}
</style>
<video id="myPlayerID"
data-embed="default" 
class="video-js" 
controls></video>

<script id="PlayerScript"></script><ol id="myPlaylistID"></ol>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" type="text/javascript"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js"></script>
<script type="text/javascript">
    //Array to keep track of accounts
    var SETTINGS_LIST = "BrightcoveSettings";
    var ACCOUNTS_LIST = "Accounts";
    var accounts = [];
    var proxyUrl = "";
    var CMSAPIURL = "https://cms.api.brightcove.com/";
    var CookieName = "BCOAUTHToken";

    String.prototype.format = function (args) {
        var str = this;
        return str.replace(String.prototype.format.regex, function (item) {
            var intVal = parseInt(item.substring(1, item.length - 1));
            var replace;
            if (intVal >= 0) {
                replace = args[intVal];
            } else if (intVal === -1) {
                replace = "{";
            } else if (intVal === -2) {
                replace = "}";
            } else {
                replace = "";
            }
            return replace;
        });
    };
    String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

    var playerId = '<%= PlayerID%>';
    var width = '<%= PlayerWidth%>';
    var height = '<%= PlayerHeight%>';
    var videoId = '<%= VideoID%>';
    var autoStart = '<%= AutoStart%>';
    var playlistId = '<%= PlaylistID%>';
    var backgroundColor = '<%= BackgroundColor%>';
    var accountId = '<%= AccountID%>';

    var linkTemplate = "https://players.brightcove.net/{0}/{1}_default/index.min.js";
    var styleTemplate = "background-color:{0};";

    $(document).ready(function () {
        InitVideoPlayer();
        var inDesignMode = "";
        var wikiInEditMode = "";
        if (document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode != null) {
            inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
        }
        if (document.forms[MSOWebPartPageFormName]._wikiPageMode != null) {
            wikiInEditMode = document.forms[MSOWebPartPageFormName]._wikiPageMode.value;
        }

        if (inDesignMode == "1" || wikiInEditMode == "Edit") {
            //alert('Page is in Edit Mode');
            $("div.UserControlGroup input[id*='VideoID_EDITOR']").parent().append('<input id="VideoId_BUILDER" type=button value="..."></input>');       
            $("div.UserControlGroup input[id*='PlaylistID_EDITOR']").parent().append('<input id="PlaylistId_BUILDER" type=button value="..."></input>');

            // add jquery CSS
            $("head").append("<link id='juery-ui-css' href='//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css' type='text/css' rel='stylesheet' />");
        }

        var videoIdOnClick = $("div.UserControlGroup input[id*='VideoId_BUILDER']").attr('onclick');
        if (videoIdOnClick == null || videoIdOnClick == '') {
            videoIdOnClick = "CreateVideoPopup();";
            $("div.UserControlGroup input[id*='VideoId_BUILDER']").attr('onclick', videoIdOnClick);
        }

        var playlistOnClick = $("div.UserControlGroup input[id*='PlaylistId_BUILDER']").attr('onclick');
        if (playlistOnClick == null || playlistOnClick == '') {
            playlistOnClick = "CreatePlaylistPopup();";
            $("div.UserControlGroup input[id*='PlaylistId_BUILDER']").attr('onclick', playlistOnClick);
        }        
    });

    


    function CreateVideoPopup() {
        if ($('#playlistPickList').dialog('isOpen') == true) {
            $('#playlistPickList').dialog('close');
        }
        if ($('#videoPickList').length > 0) {
            
            if ($('#videoPickList').dialog('isOpen') != true) {
                $('#videoPickList').dialog('open');
            }
        }
        else {


            $("<div id=\"videoPickList\" class=\"chooserContainer\">"
                  + "<div id=\"divAccount\">"
                  + "<select id=\"Account\">"
                    + "</select>"
                + "</div>"

                + "<div id=\"divPicklist\">"
                    + "<div class=\"picklist available\">"
                        + "<div class=\"sectionHeader\">Available Videos</div>"
                        + "<div class=\"searchBox\">"
                            + "<input id=\"chooserSearchBox\" class=\"searchBox_default_text\" type=\"text\" placeholder=\"search videos\" onkeypress=\"return disableEnterKey(event, this);\" onchange=\"return doSearch(this);\" onfocus=\"if(this.value=='search videos'){this.value='';$(this).removeClass('searchBox_default_text');}\" /><button onclick=\"return doSearch();\">&nbsp;</button>"
                        + "</div>"
                        + "<div class=\"brightcove-player-dialog-sortvalue\">"
                            + "Sort by:"
                        + "<input type=\"radio\" name=\"sort\" onclick=\"doFilter(this,'sort')\" value=\"plays_total\" /><span>total plays</span>"
                        + "<input type=\"radio\" name=\"sort\" onclick=\"doFilter(this, 'sort')\" value=\"name\" checked /><span>display name</span>"
                        + "<input type=\"radio\" name=\"sort\" onclick=\"doFilter(this, 'sort')\" value=\"created_at\" /><span>creation date</span>"
                        + "<input type=\"radio\" name=\"sort\" onclick=\"doFilter(this, 'sort')\" value=\"schedule_starts_at\" /><span>start date</span>"
                    + "</div>"
                    + "<div class=\"brightcove-player-dialog-sortdirection\">"
                        + "Order by:"
                        + "<input type=\"radio\" name=\"order\" onclick=\"doFilter(this, 'order')\" value=\"ascending\" checked /><span>ascending</span>"
                        + "<input type=\"radio\" name=\"order\" onclick=\"doFilter(this, 'order')\" value=\"descending\" /><span>descending</span>"
                    + "</div>"
                    + "<div class=\"content videosAvailable\"></div>"
                    + "<div id=\"picklistPaging\" class=\"paging\"></div>"
                + "</div>"

                + "<div class=\"picklistControls\">"
                    + "<div class=\"controlSection\">"
                        + "<button onclick=\"return AddSelectedItems();\">&gt;&gt;</button>"
                        + "<button onclick=\"return RemoveSelectedItems();\">&lt;&lt;</button>"
                    + "</div>"
                    + "<div class=\"controlSection\">"
                        + "<button onclick=\"$('.videosAvailable .item').each(function(){$(this).addClass('.itemSelected');});return AddSelectedItems();\">&gt;&gt;</button>"
                        + "<button onclick=\"$('.videosSelected .item').each(function(){$(this).addClass('.itemSelected');});return RemoveSelectedItems();\">&lt;&lt;</button>"
                    + "</div>"
                + "</div>"

                + "<div class=\"picklist selected\">"
                    + "<div class=\"sectionHeader\">Videos in this Playlist</div>"
                    + "<div class=\"moveButtons\">"
                        + "<input type=\"checkbox\" onclick=\"MoveNone(this.checked);\" id=\"inpMoveSelected\" name=\"moveSelected\"/> <label for=\"moveSelected\">move video</label>"
                        + "<span>"
                            + "<button onclick=\"return MoveUp();\">Up</button><button onclick=\"return MoveDown();\">Down</button>"
                        + "</span>"
                    + "</div>"
                    + "<div class=\"content videosSelected\"></div>"
                + "</div>"
            + "</div>"
            + "<div class=\"buttonBlock\">"
                    + "<p>"
                        + "<button id=\"btnSave\" onclick=\"AddSelectedItems();return ChooserDone(true);\">OK</button>&nbsp;&nbsp;<button id=\"btnCancel\" onclick=\"return ChooserCancel(true);\">Cancel</button>"
                    + "</p>"
            + "</div>"
            + "</div>").dialog({
                width: 515
            });
            $('.ui-dialog-titlebar').hide();
            retrieveListItems(false);

            $('#Account').change(function () {
                // clear token
                deleteCookie(CookieName);

                $('.videosAvailable').empty();
                accountId = $('#Account').find(':selected').attr('accountid');
                var i;
                for (i = 0; i < accounts.length; i++) {
                    if (accounts[i].AccountId == accountId) {
                        getBrightcoveItems(accounts[i]);
                        break;
                    }
                }
            });

            $('#Account').trigger('change');
        }
    };

    function CreatePlaylistPopup() {
        if ($('#videoPickList').dialog('isOpen') == true) {
            $('#videoPickList').dialog('close');
        }
        if ($('#playlistPickList').length > 0) {           

            if ($('#playlistPickList').dialog('isOpen') != true) {
                $('#playlistPickList').dialog('open');
            }
        }
        else {


            $("<div id=\"playlistPickList\" class=\"chooserContainer\">"
                  + "<div id=\"divAccount\">"
                  + "<select id=\"AccountPlaylist\">"
                    + "</select>"
                + "</div>"

                + "<div id=\"divPicklist\" >"
                    + "<div class=\"picklist available\">"
                        + "<div class=\"sectionHeader\">Available Playlists</div>"
                        + "<div class=\"searchBox\">"
                            + "<input id=\"chooserSearchBox\" class=\"searchBox_default_text\" type=\"text\" placeholder=\"search playlists\" onkeypress=\"return disableEnterKey(event, this);\" onchange=\"return doSearch(this);\" onfocus=\"if(this.value=='search playlists'){this.value='';$(this).removeClass('searchBox_default_text');}\" /><button onclick=\"return doSearch();\">&nbsp;</button>"
                        + "</div>"
                        + "<div class=\"brightcove-player-dialog-sortvalue\">"
                            + "Sort by:"
                        + "<input type=\"radio\" name=\"sort\" onclick=\"doFilter(this, 'sort')\" value=\"name\" checked /><span>display name</span>"
                        + "<input type=\"radio\" name=\"sort\" onclick=\"doFilter(this, 'sort')\" value=\"updated_at\" /><span>modified date</span>"
                    + "</div>"
                    + "<div class=\"brightcove-player-dialog-sortdirection\">"
                        + "Order by:"
                        + "<input type=\"radio\" name=\"order\" onclick=\"doFilter(this, 'order')\" value=\"ascending\" checked /><span>ascending</span>"
                        + "<input type=\"radio\" name=\"order\" onclick=\"doFilter(this, 'order')\" value=\"descending\" /><span>descending</span>"
                    + "</div>"
                    + "<div class=\"content videosAvailable\"></div>"
                    + "<div id=\"picklistPaging\" class=\"paging\"></div>"
                + "</div>"

                + "<div class=\"picklistControls\">"
                    + "<div class=\"controlSection\">"
                        + "<button onclick=\"return AddSelectedItems();\">&gt;&gt;</button>"
                        + "<button onclick=\"return RemoveSelectedItems();\">&lt;&lt;</button>"
                    + "</div>"
                    + "<div class=\"controlSection\">"
                        + "<button onclick=\"$('.videosAvailable .item').each(function(){$(this).addClass('.itemSelected');});return AddSelectedItems();\">&gt;&gt;</button>"
                        + "<button onclick=\"$('.videosSelected .item').each(function(){$(this).addClass('.itemSelected');});return RemoveSelectedItems();\">&lt;&lt;</button>"
                    + "</div>"
                + "</div>"

                + "<div class=\"picklist selected\">"
                    + "<div class=\"sectionHeader\">Videos in this Playlist</div>"
                    + "<div class=\"moveButtons\">"
                        + "<input type=\"checkbox\" onclick=\"MoveNone(this.checked);\" id=\"inpMoveSelected\" name=\"moveSelected\"/> <label for=\"moveSelected\">move video</label>"
                        + "<span>"
                            + "<button onclick=\"return MoveUp();\">Up</button><button onclick=\"return MoveDown();\">Down</button>"
                        + "</span>"
                    + "</div>"
                    + "<div class=\"content videosSelected\"></div>"
                + "</div>"
            + "</div>"
            + "<div class=\"buttonBlock\">"
                    + "<p>"
                        + "<button id=\"btnSave\" onclick=\"AddSelectedItems();return ChooserDone(true);\">OK</button>&nbsp;&nbsp;<button id=\"btnCancel\" onclick=\"return ChooserCancel(true);\">Cancel</button>"
                    + "</p>"
            + "</div>"
            + "</div>").dialog({
                width: 515
            });
            $('.ui-dialog-titlebar').hide();
            retrieveListItems(true);

            $('#AccountPlaylist').change(function () {
                // clear token
                deleteCookie(CookieName);

                $('.videosAvailable').empty();
                accountId = $('#AccountPlaylist').find(':selected').attr('accountid');
                var i;
                for (i = 0; i < accounts.length; i++) {
                    if (accounts[i].AccountId == accountId) {
                        getBrightcoveItems(accounts[i]);
                        break;
                    }
                }
            });

            $('#AccountPlaylist').trigger('change');
        }
    };
    function InitVideoPlayer() {
        var scriptLink = linkTemplate.format([accountId, playerId]);
        var backgroundStyle = styleTemplate.format([backgroundColor]);
        if (playlistId != "") {
            document.getElementById("myPlayerID").setAttribute("data-playlist-id", playlistId);
            document.getElementById("myPlaylistID").setAttribute("class", "vjs-playlist");
        }
        else {
            document.getElementById("myPlayerID").setAttribute("data-video-id", videoId);
        }
        document.getElementById("myPlayerID").setAttribute("data-account", accountId);
        document.getElementById("myPlayerID").setAttribute("data-player", playerId);
        document.getElementById("myPlayerID").setAttribute("width", width);
        document.getElementById("myPlayerID").setAttribute("height", height);
        document.getElementById("myPlayerID").setAttribute("style", backgroundStyle);

        if (autoStart == 'True') {
            document.getElementById("myPlayerID").setAttribute("autoplay", autoStart);
        }

        document.getElementById("PlayerScript").setAttribute("src", scriptLink)
    };
    function retrieveListItems(isPlaylist) {
        this.isPlaylist = isPlaylist;
        var clientContext = new SP.ClientContext();
        var accountsList = clientContext.get_site().get_rootWeb().get_lists().getByTitle(ACCOUNTS_LIST);
        var settingsList = clientContext.get_site().get_rootWeb().get_lists().getByTitle(SETTINGS_LIST);

        var accountQuery = new SP.CamlQuery();
        accountQuery.set_viewXml('<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
            '<Value Type=\'Number\'>1</Value></Geq></Where></Query><RowLimit>500</RowLimit></View>');
        this.accountListItems = accountsList.getItems(accountQuery);

        var settingsQuery = new SP.CamlQuery();
        settingsQuery.set_viewXml('<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
            '<Value Type=\'Number\'>0</Value></Geq></Where></Query><RowLimit>1</RowLimit></View>');
        this.settingsListItems = settingsList.getItems(settingsQuery);

        clientContext.load(this.accountListItems);
        clientContext.load(this.settingsListItems);

        clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
    }

    function onQuerySucceeded(sender, args) {
        accounts = [];
        var accountListItemEnumerator = this.accountListItems.getEnumerator();
        var settingsListItemEnumerator = this.settingsListItems.getEnumerator();
        if (isPlaylist) {
            $('#AccountPlaylist').empty();
            $('#AccountPlaylist').append($('<option>', {
                value: '',
                text: 'Select account',
                accountid: ''
            }));
        } else {
            $('#Account').empty();
            $('#Account').append($('<option>', {
                value: '',
                text: 'Select account',
                accountid: ''
            }));
        }

        while (settingsListItemEnumerator.moveNext()) {
            var oListItem = settingsListItemEnumerator.get_current();
            proxyUrl = oListItem.get_item('ProxyUrl');
            break;
        }

        while (accountListItemEnumerator.moveNext()) {
            var oListItem = accountListItemEnumerator.get_current();
            var account = {
                Title : oListItem.get_item('Title'),
                ClientId : oListItem.get_item('ClientId'),
                ClientSecret : oListItem.get_item('ClientSecret'),
                AccountId: oListItem.get_item('AccountId'),
                Id: oListItem.get_id()
            };
            accounts.push(account);
            if(isPlaylist)
            {
                $('#AccountPlaylist').append($('<option>', {
                    value: account.Id,
                    text: account.Title,
                    accountid: account.AccountId
                }));
            }
            else
            {
                $('#Account').append($('<option>', {
                    value: account.Id,
                    text: account.Title,
                    accountid: account.AccountId
                }));
            }
            
        }

        $('#Account').val('');
        $('#AccountPlaylist').val('');
    }

    function onQueryFailed(sender, args) {
        alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    }

    function ChooserCancel(doCloseWindow) {
        $('.videosAvailable').empty();
        $('.chooserContainer').dialog('close');
        $('#videoPickList').remove();
        $('#playlistPickList').remove();
        
    }

    function ChooserDone(doCloseWindow)
    {
        if (doCloseWindow)
        {
            $('.chooserContainer').dialog('close');
        }
    }
    function AddSelectedItems()
    {
        var isPlaylist = getIsPlaylist();
        //Get accountId of selected and assign to accountId textbox
        accountId = $((isPlaylist ? '#AccountPlaylist' : '#Account')).find(':selected').attr('accountid');
        $("div.UserControlGroup input[id*='AccountID_EDITOR']").val(accountId);

        // get selected item
        var selectedItem = $('.videosAvailable .item.itemSelected');
        var selectedItemId = '';
        if (selectedItem.length > 0) {
            selectedItemId = $(selectedItem).attr('videoid');
        }
        // assign to appropriate field value
        if (isPlaylist) {
            $("div.UserControlGroup input[id*='VideoID_EDITOR']").val('');
            $("div.UserControlGroup input[id*='PlaylistID_EDITOR']").val(selectedItemId);
        } else {
            $("div.UserControlGroup input[id*='VideoID_EDITOR']").val(selectedItemId);
            $("div.UserControlGroup input[id*='PlaylistID_EDITOR']").val('');
        }

        $('#videoPickList').remove();
        $('#playlistPickList').remove();
    }

    function getIsPlaylist() {
        var videoAvailable = $('#Account').length > 0;
        var videoHidden = $('#Account:hidden').length > 0;
        var playlistAvailable = $('#AccountPlaylist').length > 0;
        var playlistHidden = $('#AccountPlaylist:hidden').length > 0;
        return (playlistAvailable && !playlistHidden);
    }

    function getToken (account) {
        // do we have a current token?
        var token = getCookie(CookieName);
        // else, obtain
        var dataString = 'grant_type=client_credentials&client_id=' + account.ClientId + '&client_secret=' + account.ClientSecret;
        var authProxyUrl = proxyUrl;
        if (authProxyUrl.lastIndexOf("/") != (authProxyUrl.length - 1)) {
            authProxyUrl += '/';
        }
        authProxyUrl += 'api/auth';
        $.ajax({
            url: authProxyUrl,
            type: "POST",
            data: dataString,
            success: function (data) {
                var tokenResponse = jQuery.parseJSON(data);
                token = tokenResponse.access_token;
                var expiresIn = tokenResponse.expires_in;

                // set token
                setCookie(CookieName, token, expiresIn);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(textStatus);
            }
        });        
    }
    function getBrightcoveItems (account) {
        var isPlaylist = getIsPlaylist();
        var token = getCookie(CookieName);
        $('.videosAvailable').empty();

        var func = function (account_id) {
            var apiUrl;
            var searchTerm = $('#chooserSearchBox').val();
            var sortValue = getSortValue(isPlaylist);
            var sortDirection = getSortDirection(isPlaylist);
            if (isPlaylist) {
                apiUrl = CMSAPIURL + 'v1/accounts/' + account_id + '/playlists?';
            }
            else {
                apiUrl = CMSAPIURL + 'v1/accounts/' + account_id + '/videos?limit=30&';
            }
            apiUrl += "sort=" + sortDirection + sortValue;
            if (searchTerm != '') {
                apiUrl += "&q=" + searchTerm;
            }

            var token = getCookie(CookieName);
            $.ajax({
                url: apiUrl,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    var buffer = new Array();
                    $(json).each(function (index, item) {
                        var video;
                        if (isPlaylist)
                        {
                            video = {
                                name: item.name,
                                id: item.id,
                                thumbnailURL: _spPageContextInfo.siteAbsoluteUrl + "/Style%20Library/Media%20Player/VideoPreview.png"
                            };
                        }
                        else
                        {
                            video = {
                                name: item.name,
                                id: item.id,
                                thumbnailURL: (item.images.thumbnail != null ? item.images.thumbnail.src :  _spPageContextInfo.siteAbsoluteUrl + "/Style%20Library/Media%20Player/VideoPreview.png")
                            }
                        };
                        buffer.push(CreatePicklistItem(video));
                    })
                    
                    $('.videosAvailable').html(buffer.join(''));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus);
                }
            });
        };

        if (token == '') {            
            getToken(account);
        } else {
            func(account.AccountId);
        }
    }

    function doSearch() {
        var isPlaylist = getIsPlaylist();
        var accountId = '';
        if (isPlaylist) {
            accountId = $('#AccountPlaylist').find(':selected').attr('accountid');
        } else {
            accountId = $('#Account').find(':selected').attr('accountid');
        }
        var i;
        for (i = 0; i < accounts.length; i++) {
            if (accounts[i].AccountId == accountId) {
                getBrightcoveItems(accounts[i]);
                break;
            }
        }
    }

    function doFilter() {
        doSearch();
    }

    function getSortValue(isPlaylist) {
        var sortValue = "updated_at";
        var selectedVal = "";
        var selected = $((isPlaylist ? "#playlistPickList" : "#videoPickList") + " .brightcove-player-dialog-sortvalue input[type='radio']:checked");
        if (selected.length > 0) {
            sortValue = selected.val();
        }
        if (isPlaylist) {
            // Sort Allowed values: "name", "updated_at"
            if (sortValue == null || sortValue == '') {
                sortValue = 'name';
            }
        } else {
            // Sort Allowed values: 
            // "name", "reference_id", "created_at", "published_at",
            // "updated_at", "schedule_starts_at", "schedule_ends_at",
            // "state", "plays_total", "plays_trailing_week"
            if (sortValue == null || sortValue == '') {
                sortValue = 'plays_total';
            }
        }
        
        return sortValue;
    }
    function getSortDirection(isPlaylist) {
        var selectedVal = "";
        var selected = $((isPlaylist ? "#playlistPickList" : "#videoPickList") + " .brightcove-player-dialog-sortdirection input[type='radio']:checked");
        if (selected.length > 0) {
            selectedVal = selected.val();
        }
        return (selectedVal == "ascending" ? "" : "-");
    }
    
    function CreatePicklistItem(video) {
        var result =
            '<div class="item" videoId="' + video.id + '" onclick="selectToggleItem(this);">' +
            '    <div class="videoCheckbox"><input type="checkbox" /></div>' +
            '    <div class="videoThumb"><img src="' + video.thumbnailURL + '" /></div>' +
            '    <div class="videoMetadata">' +
            '        <span class="videoName">' + video.name + '</span><br />' +
            '        <span class="videoId">id: ' + video.id + '</span>' +
            '    </div>' +
            '</div>';

        return result;
    }

    function selectToggleItem(selectedItem) {
        // remove all
        $('.videosAvailable .item').removeClass('itemSelected');
        // add this one
        $(selectedItem).addClass('itemSelected');
    }

    function getCookie (cookieName) {
        var name = cookieName + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function setCookie (cookieName, cookieValue, expirationSeconds) {
        var d = new Date();
        d.setTime(d.getTime() + (expirationSeconds * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cookieName + "=" + cookieValue + "; " + expires;
    }
    function deleteCookie(cookieName) {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    }

</script>