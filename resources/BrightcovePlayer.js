function BrightcovePlayerObject() {}

BrightcovePlayerObject.Init = function () {
    if (typeof jQuery == 'undefined') {
        BrightcovePlayerObject.LoadBrightcovePlayerJqueryScriptIfNeeded();
    } else {
        BrightcovePlayerObject.LoadBrightcovePlayerJqueryUIScriptIfNeeded();
    }
}

BrightcovePlayerObject.AddPopupCSS = function () {
    var basePath = _spPageContextInfo.siteServerRelativeUrl;
    if (basePath == '/') {
        basePath = '';
    }
    var bcCSS = basePath + '/BrightcoveConnectorResources/BrightcovePlayer.css';
    $("head").append("<link id='jquery-ui-css' href='" + bcCSS + "' type='text/css' rel='stylesheet' />");
}

BrightcovePlayerObject.AddPlayerEmbeds = function () {
    var basePath = _spPageContextInfo.siteServerRelativeUrl;
    if (basePath == '/') {
        basePath = '';
    }
    
    var head = document.getElementsByTagName('head')[0];
                         
    var script = document.createElement('script');
    script.src = basePath + '/BrightcoveConnectorResources/BrightcovePlayerVideoEmbed.js';
    head.appendChild(script);             
}

BrightcovePlayerObject.AddPlaylistEmbeds = function () {
    var basePath = _spPageContextInfo.siteServerRelativeUrl;
    if (basePath == '/') {
        basePath = '';
    }
    
    var head = document.getElementsByTagName('head')[0];
                         
    var script = document.createElement('script');
    script.src = basePath + '/BrightcoveConnectorResources/BrightcovePlayerPlaylistEmbed.js';
    head.appendChild(script);             
}

BrightcovePlayerObject.LoadBrightcovePlayerJqueryScriptIfNeeded = function () {
    var script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
    var head = document.getElementsByTagName('head')[0],
        done = false;
    head.appendChild(script);
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            BrightcovePlayerObject.LoadBrightcovePlayerJqueryUIScriptIfNeeded();
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };
}

BrightcovePlayerObject.LoadBrightcovePlayerJqueryUIScriptIfNeeded = function () {
    BrightcovePlayerObject.AddPlayerEmbeds();
    BrightcovePlayerObject.AddPlaylistEmbeds();
    BrightcovePlayerObject.AddPopupCSS();
    if (typeof jQuery.ui == 'undefined') {
        $.getScript("https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js", function (data, textStatus, jqxhr) {
            BrightcovePlayerObject.Initiate();
        });
    } else {
        BrightcovePlayerObject.Initiate();
    }
}

BrightcovePlayerObject.AddSnippet = function (html) {
    
    // If embed code successfully generated
    if (html.substring(0,1) === '<') {
        $('#divBrightcoveHtmlSnippetInput').val(html);        
        BrightcovePlayerObject.CopyToClipboardTemp();
        BrightcovePlayerObject.PasteTemp();
        $('#btnCancel').focus();
    } else {
        $('#divBrightcoveHtmlSnippetInput').val('');         
        $('#divBrightcoveHtmlSnippetInput').attr("placeholder", html);
    }

}

BrightcovePlayerObject.CopyToClipboardTemp = function () {
    var input = document.getElementById("divBrightcoveHtmlSnippetInput");
    input.focus();
    input.select();
    document.execCommand('Copy');

    if (document.selection) {
        document.selection.empty();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

BrightcovePlayerObject.PasteTemp = function () {
    var editor = document.getElementById("divBrightcoveHtmlSnippetInput");
    editor.focus();
    editor.select();
    document.execCommand('Paste');
}

// Array to keep track of accounts
var SETTINGS_LIST = "BrightcoveSettings";
var ACCOUNTS_LIST = "Accounts";
var accounts = [];

// Brightcove API data
var proxyUrl = "";
var CMSAPIURL = "https://cms.api.brightcove.com/";
var PLAYERSAPIURL = "https://players.api.brightcove.com/";
var OAuthCookieName = "BCOAUTHToken";
var AccountIDCookieName = "BCAccountID";



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

var playerId = '';
var width = '';
var height = '';
var videoId = '';
var autoStart = '';
var playlistId = '';
var backgroundColor = '';
var accountId = '';
var loadingMessageTimer;


var linkTemplate = "https://players.brightcove.net/{0}/{1}_default/index.min.js";
var styleTemplate = "background-color:{0};";

BrightcovePlayerObject.Initiate = function () {
    
    // prime with empty jQuery object
    window.prevFocus = $();

    // Catch any bubbling focusin events (focus does not bubble)
    $(document).on('focusin', ':input', function () {

        // Test: Show the previous value/text so we know it works!
        $("#prev").html(prevFocus.val() || prevFocus.text());

        // Save the previously clicked value for later
        window.prevFocus = $(this);
    });
    
    if (BrightcovePlayerObject.InEditMode()) {
        var bcType = window['BrightcovePlayerObjectType'];
        if (bcType == 'playlist') {
            CreatePlaylistPopup();
        } else if (bcType == 'inpage') {
            CreateInpagePopup();
        } else {
            CreateVideoPopup();
        }
    }
}

BrightcovePlayerObject.InEditMode = function () {
    var inDesignMode = "";
    var wikiInEditMode = "";
    if (document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode != null) {
        inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
    }
    if (document.forms[MSOWebPartPageFormName]._wikiPageMode != null) {
        wikiInEditMode = document.forms[MSOWebPartPageFormName]._wikiPageMode.value;
    }

    return inDesignMode == "1" || wikiInEditMode == "Edit";
}

//function CreateInpagePopup() {
//    future
//
    
function CreateVideoPopup() {
    
    if ($('#playlistPickList').dialog('isOpen') == true) {
        $('#playlistPickList').dialog('close');
    }
    if ($('#videoPickList').length > 0) {

        if ($('#videoPickList').dialog('isOpen') != true) {
            $('#videoPickList').dialog('open');
        }
    } else {
        var popupWidth = 600;
        var popupHeight = Math.min(700, (window.innerHeight ||
                 document.documentElement.clientHeight ||
                 document.body.clientHeight) * 0.9);

        $("<div id=\"videoPickList\" class=\"chooserContainer\">"
			+ "<br/>"
            + "<div id=\"loadingoverlay\">"
              + "<div id=\"loadingtext\">&nbsp;&nbsp;&nbsp;Loading&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"
            + "</div>"
			+ "<div id=\"divAccount\">"
          	+ "Brightcove Account: "
			  + "<select id=\"Account\">"
              + "</select>"          
			+ "</div>"   

			+ "<div id=\"brightcove-player-filter\" class=\"playerSearchBox\">"
                + "Player Filter: "
                + "<input id=\"divBrightcovePlayerSearch\" class=\"playerSearchBox_default_text\" type=\"text\" placeholder=\"player filter\" onfocus=\"if(this.value=='player filter'){this.value='';$(this).removeClass('playerSearchBox_default_text');}\" /><button >&nbsp;</button>"
			+ "</div>"   
          
          	+ "<div id=\"divBrightcovePlayer\">"
			  + "Player: "
                 + "<select id=\"Players\" onchange=\"AddSelectedItems();\">"
                 + "</select>"
			+ "</div>" 
          
            + "<div class=\"brightcove-player-dialog-autoplay\">"
               + "Autoplay: "
               + "<input id=\"divBrightcoveAutoplayInput\" onclick=\"AddSelectedItems();\" type=\"checkbox\" name=\"autoplay\" value=\"autoplay\" />" 
               + "<input id=\"divBrightcoveAutoplayInput\" type=\"hidden\" name=\"autoplay\" value=\"\" />" 
            + "</div>"
          
            + "<div class=\"brightcove-player-dialog-muted\">"
               + "Muted: "
               + "<input id=\"divBrightcoveMutedInput\" onclick=\"AddSelectedItems();\" type=\"checkbox\" name=\"muted\" value=\"muted\" />" 
               + "<input id=\"divBrightcoveMutedInput\" type=\"hidden\" name=\"muted\" value=\"\" />"
            + "</div>"
          
            + "<div class=\"brightcove-player-dialog-embedtype\">"
               + "Embed Type: "
               + "<input id=\"divBrightcoveEmbedTypeInput\" onclick=\"ProcessEmbedType(); AddSelectedItems();\" type=\"radio\" name=\"embedtype\" value=\"iframe\" checked /><span>iFrame</span>" 
               + "<input id=\"divBrightcoveEmbedTypeInput\" onclick=\"ProcessEmbedType(); AddSelectedItems();\" type=\"radio\" name=\"embedtype\" value=\"javascript\" /><span>Javascript</span>" 
            + "</div>"          

            + "<div class=\"brightcove-player-dialog-sizing\">"
               + "Sizing: "
               + "<input id=\"divBrightcoveSizingFixed\" onclick=\"AddSelectedItems();\" type=\"radio\" name=\"sizing\" value=\"fixed\" checked /><label for=\"divBrightcoveSizingFixed\">Fixed</label>" 
               + "<input id=\"divBrightcoveSizingResponsive\" onclick=\"AddSelectedItems();\" type=\"radio\" name=\"sizing\" value=\"responsive\" /><label for=\"divBrightcoveSizingResponsive\">Responsive</label>"       
            + "</div>"        
          
            + "<div class=\"brightcove-player-dialog-aspect-ratio\">"
               + "Aspect Ratio: "
               + "<input id=\"divBrightcoveAspectRatio\" onclick=\"ProcessAspectRatio(); AddSelectedItems();\" type=\"radio\" name=\"aspectratio\" value=\"16:9\" checked /><span>16:9</span>" 
               + "<input id=\"divBrightcoveAspectRatio\" onclick=\"ProcessAspectRatio(); AddSelectedItems();\" type=\"radio\" name=\"aspectratio\" value=\"4:3\" /><span>4:3</span>" 
               + "<input id=\"divBrightcoveAspectRatio\" onclick=\"ProcessAspectRatio(); AddSelectedItems();\" type=\"radio\" name=\"aspectratio\" value=\"Custom\" /><span>Custom</span>"       
            + "</div>"          
          
			+ "<div id=\"brightcove-player-width-height\">"
			  + "Width: "
			  + "<input id=\"divBrightcoveWidthInput\" onchange=\"ProcessAspectRatio(); AddSelectedItems();\" value=\"640\"></input>"
			  + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Height: "
			  + "<input id=\"divBrightcoveHeightInput\" onchange=\"AddSelectedItems();\" value=\"360\"></input>"
			+ "</div>"             
          
            + "<div class=\"brightcove-player-dialog-units\">"
               + "Units: "
               + "<input id=\"divBrightcoveUnitsInput\" onclick=\"AddSelectedItems();\" type=\"radio\" name=\"units\" value=\"px\" checked /><span>px</span>" 
               + "<input id=\"divBrightcoveUnitsInput\" onclick=\"AddSelectedItems();\" type=\"radio\" name=\"units\" value=\"em\" /><span>em</span>" 
            + "</div>"
          
          	+ "<div id=\"divBrightcoveFolder\">"
			  + "Folders: "
                 + "<select id=\"Folders\" onchange=\"doSearch(this);\">"
                 + "</select>"
			+ "</div>" 
                    
			+ "<div id=\"divPicklist\">"
				+ "<div class=\"picklist available\">"
					//+ "<div class=\"sectionHeader\">Available Videos</div>"
					+ "<div class=\"searchBox\">"
                        + "Available Videos: "
						+ "<input id=\"chooserSearchBox\" class=\"searchBox_default_text\" type=\"text\" placeholder=\"video filter\" onkeypress=\"return disableEnterKey(event, this);\" onchange=\"return doSearch(this);\" onfocus=\"if(this.value=='video filter'){this.value='';$(this).removeClass('searchBox_default_text');}\" /><button onclick=\"return doSearch();\">&nbsp;</button>"
          			+ "</div>"
                    + "<div id=\"brightcove-player-item-limit\">"
			           + "Search Limit: "
			           + "<input id=\"divBrightcoveItemLimit\" onchange=\"return doSearch();\" value=\"30\"></input>"
			        + "</div>"  
					+ "<div class=\"brightcove-player-dialog-sortvalue\">"
						+ "Sort by:"
					+ "<input type=\"radio\" name=\"sort\" onclick=\"doFilter(this, 'sort')\" value=\"name\" /><span>display name</span>"
					+ "<input type=\"radio\" name=\"sort\" onclick=\"doFilter(this, 'sort')\" value=\"created_at\" checked /><span>creation date</span>"
					+ "<input type=\"radio\" name=\"sort\" onclick=\"doFilter(this, 'sort')\" value=\"schedule_starts_at\" /><span>start date</span>"
                    + "<input type=\"radio\" name=\"sort\" onclick=\"doFilter(this, 'sort')\" value=\"plays_total\" /><span>total plays</span>"
				+ "</div>"
				+ "<div class=\"brightcove-player-dialog-sortdirection\">"
					+ "Order by:"
					+ "<input type=\"radio\" name=\"order\" onclick=\"doFilter(this, 'order')\" value=\"ascending\" /><span>ascending</span>"
					+ "<input type=\"radio\" name=\"order\" onclick=\"doFilter(this, 'order')\" value=\"descending\" checked /><span>descending</span>"
				+ "</div>"
				+ "<div class=\"content videosAvailable\"></div>"
				+ "<div id=\"picklistPaging\" class=\"paging\"></div>"
			+ "</div>"
		+ "</div>"

		+ "<div id=\"divBrightcoveHtmlSnippet\">"
		  + "<br/>Brightcove Snippet (Paste to Script Editor web part or publishing zone): <br/>"
		  + "<textarea readonly rows=\"5\" id=\"divBrightcoveHtmlSnippetInput\" style=\"width:90%; \"></textarea>"
		+ "</div>"
          
		+ "<div class=\"buttonBlock\">"
				+ "<p>"
					//+ "<button id=\"btnSave\" onclick=\"AddSelectedItems();\">Copy Snippet to Clipboard</button>&nbsp;&nbsp;"
                    // Was an attempt to automatically open the Embed dialog but focus is lost on the point where the 
                    // user wants to embed the player when they click the Brightcove icon.
                    // Future - figure out how the Embed icon saves the previous focus and then returns focus to that
                    // location.  We want to do something similar.
                    // + "<button id=\"btnEmbed\" Onclick=\"ChooserOpenEmbed();\">Exit and Embed</button>&nbsp;&nbsp;"
                    + "<button id=\"btnCancel\" onclick=\"return ChooserCancel();\">Exit</button>"
				+ "</p><br/>"
		+ "</div>"
          
		+ "</div>").dialog({
            width: popupWidth,
            height: popupHeight, 
            modal:true
        });
      
        // initial form setup
        $('.ui-dialog-titlebar').hide();
        $('.videosAvailable').empty();
        loadingmessageoff();
        ProcessAspectRatio();
        ProcessEmbedType();
        
        // retrieve Brightcove accounts and settings data from SharePoint
        retrieveListItems(false);
        
        // when user selects an account in the dropdown
        $('#Account').change(function () {

            // clear token 
            deleteCookie(OAuthCookieName);
            if ($('#Account').val() === null || $('#Account').val() === '') {
               accountId = getCookie(AccountIDCookieName);
            } else { 
               accountId = $('#Account').val();
               $("#Account option[value='']").remove();
            } 
            
            $('.videosAvailable').empty();

            // Set player to null then iterate through account data saved in SharePoint until 
            // find the match with current account ID            
            $('#Players').val('');
            var i;
            for (i = 0; i < accounts.length; i++) {
                if (accounts[i].AccountId == accountId) {
                    // populate list of videos
                    getBrightcoveItems(accounts[i]);
                    // populate list of players and set default player
                    getBrightcovePlayers(accounts[i], accounts[i].DefaultVideoPlayerId);
                    // populate list of folders
                    getBrightcoveFolders(accounts[i]);
                    break;
                }
            }
            
            // If valid accountId, save it in a cookie so can return to the same account if user
            // closes the video popup and then opens the video popup again
            if (/^[0-9]+$/.test(accountId)) {
                setCookie(AccountIDCookieName, accountId, 1*24*60*60);
            }
            
        });
        
        // when user changes the player filter
        $('#divBrightcovePlayerSearch').change(function () {

            // clear token
            deleteCookie(OAuthCookieName);

            accountId = $('#Account').val();

            // Set player to null then iterate through account data saved in SharePoint until 
            // find the match with current account ID            
            $('#Players').val('');
            var i;
            for (i = 0; i < accounts.length; i++) {
                if (accounts[i].AccountId == accountId) {
                    // populate list of players and set default player
                    getBrightcovePlayers(accounts[i], accounts[i].DefaultVideoPlayerId);
                    break;
                }
            }
            
            // If valid accountId, save it in a cookie so can return to the same account if user
            // closes the video popup and then opens the video popup again
            if (/^[0-9]+$/.test(accountId)) {
                setCookie(AccountIDCookieName, accountId, 1*24*60*60);
            }
            
        });

        $('#divBrightcoveAspectRatio').trigger('change'); 
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
    } else {
        var popupWidth = 600;
        var popupHeight = Math.min(700, (window.innerHeight ||
                 document.documentElement.clientHeight ||
                 document.body.clientHeight) * 0.9);
        
		$("<div  id=\"playlistPickList\" class=\"chooserContainer\">"
			+ "<br/>"
            + "<div id=\"loadingoverlay\">"
              + "<div id=\"loadingtext\">&nbsp;&nbsp;&nbsp;Loading&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"
            + "</div>"          
            + "<div id=\"divAccount\">"
            + "Brightcove Account: "
			  + "<select id=\"AccountPlaylist\">"
              + "</select>"
			+ "</div>"          
          
          	+ "<div id=\"brightcove-player-filter\" class=\"playerSearchBox\">"
                + "Player Filter: "
                + "<input id=\"divBrightcovePlayerSearch\" class=\"playerSearchBox_default_text\" type=\"text\" placeholder=\"player filter\" onfocus=\"if(this.value=='player filter'){this.value='';$(this).removeClass('playerSearchBox_default_text');}\" /><button >&nbsp;</button>"
			+ "</div>"  
          
          	+ "<div id=\"divBrightcovePlayer\">"
			  + "Player: "
                 + "<select id=\"Players\" onchange=\"AddSelectedItems()\";>"
                 + "</select>"
			+ "</div>" 
          
            + "<div class=\"brightcove-player-dialog-autoplay\">"
               + "Autoplay: "
               + "<input id=\"divBrightcoveAutoplayInput\" onclick=\"AddSelectedItems();\" type=\"checkbox\" name=\"autoplay\" value=\"autoplay\" />" 
               + "<input id=\"divBrightcoveAutoplayInput\" type=\"hidden\" name=\"autoplay\" value=\"\" />"
            + "</div>"
          
            + "<div class=\"brightcove-player-dialog-muted\">"
               + "Muted: "
               + "<input id=\"divBrightcoveMutedInput\" onclick=\"AddSelectedItems();\" type=\"checkbox\" name=\"muted\" value=\"muted\" />" 
               + "<input id=\"divBrightcoveMutedInput\" type=\"hidden\" name=\"muted\" value=\"\" />"     
            + "</div>"
          
            + "<div class=\"brightcove-player-dialog-embedtype\">"
               + "Embed Type: "
               + "<input id=\"divBrightcoveEmbedTypeInput\" onclick=\"ProcessEmbedType(); AddSelectedItems();\" type=\"radio\" name=\"embedtype\" value=\"iframe\" checked /><span>iFrame</span>" 
               + "<input id=\"divBrightcoveEmbedTypeInput\" onclick=\"ProcessEmbedType(); AddSelectedItems();\" type=\"radio\" name=\"embedtype\" value=\"javascript\" /><span>Javascript</span>" 
            + "</div>"    
          
            // Playlist embeds are fixed only so hide the user input but leave it defined
            //+ "<div class=\"brightcove-player-dialog-sizing\">"
               //+ "Sizing: "
               + "<input id=\"divBrightcoveSizingFixed\" type=\"hidden\" onclick=\"AddSelectedItems();\" type=\"radio\" name=\"sizing\" value=\"fixed\" checked />"
               //<label for=\"divBrightcoveSizingFixed\">Fixed</label>" 
               + "<input id=\"divBrightcoveSizingResponsive\" type=\"hidden\"onclick=\"AddSelectedItems();\" type=\"radio\" name=\"sizing\" value=\"responsive\" />"
               //<label for=\"divBrightcoveSizingResponsive\">Responsive</label>"       
            //+ "</div>"             
          
            + "<div id=\"divBrightcoveThumbnails\">"
			  + "Number of Thumbnails: "
			  + "<input id=\"divBrightcoveThumbnailsInput\" onchange=\"AddSelectedItems();\" value=\"5\"></input>"
			+ "</div>"
          
            + "<div class=\"brightcove-player-dialog-aspect-ratio\">"
               + "Aspect Ratio: "
               + "<input id=\"divBrightcoveAspectRatio\" onclick=\"ProcessAspectRatio(); AddSelectedItems();\" type=\"radio\" name=\"aspectratio\" value=\"16:9\" checked /><span>16:9</span>" 
               + "<input id=\"divBrightcoveAspectRatio\" onclick=\"ProcessAspectRatio(); AddSelectedItems();\" type=\"radio\" name=\"aspectratio\" value=\"4:3\" /><span>4:3</span>" 
               + "<input id=\"divBrightcoveAspectRatio\" onclick=\"ProcessAspectRatio(); AddSelectedItems();\" type=\"radio\" name=\"aspectratio\" value=\"Custom\" /><span>Custom</span>"       
            + "</div>"          
                    
			+ "<div id=\"brightcove-player-width-height\">"
			  + "Width: "
			  + "<input id=\"divBrightcoveWidthInput\" onchange=\"ProcessAspectRatio(); AddSelectedItems();\" value=\"640\"></input>"
			  + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Height: "
			  + "<input id=\"divBrightcoveHeightInput\" onchange=\"AddSelectedItems();\" value=\"360\"></input>"
			+ "</div>"  

            + "<div class=\"brightcove-player-dialog-units\">"
               + "Units: "
               + "<input id=\"divBrightcoveUnitsInput\" onclick=\"AddSelectedItems();\" type=\"radio\" name=\"units\" value=\"px\" checked /><span>px</span>" 
               + "<input id=\"divBrightcoveUnitsInput\" onclick=\"AddSelectedItems();\" type=\"radio\" name=\"units\" value=\"em\" /><span>em</span>"         
            + "</div>"
          
			+ "<div id=\"divPicklist\" >"
				+ "<div class=\"picklist available\">"
					+ "<div class=\"sectionHeader\">Available Playlists</div>"
					+ "<div class=\"searchBox\">"
						+ "<input id=\"chooserSearchBox\" class=\"searchBox_default_text\" type=\"text\" placeholder=\"search playlists\" onkeypress=\"return disableEnterKey(event, this);\" onchange=\"return doSearch(this);\" onfocus=\"if(this.value=='search playlists'){this.value='';$(this).removeClass('searchBox_default_text');}\" /><button onclick=\"return doSearch();\">&nbsp;</button>"
					+ "</div>"
                    + "<div id=\"brightcove-player-item-limit\">"
			           + "Search Limit: "
			           + "<input id=\"divBrightcoveItemLimit\" onchange=\"return doSearch();\" value=\"30\"></input>"
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
		
		+ "<div id=\"divBrightcoveHtmlSnippet\">"
		  + "<br/>Brightcove Snippet (Paste to Script Editor web part or publishing zone): <br/>"
		  + "<textarea readonly rows=\"5\" id=\"divBrightcoveHtmlSnippetInput\" style=\"width:90%; \"></textarea>"
		+ "</div>"
		
		+ "<div class=\"buttonBlock\">"
				+ "<p>"
					//+ "<button id=\"btnSave\" onclick=\"AddSelectedItems();\">Copy Snippet to Clipboard</button>&nbsp;&nbsp;"
                    // Was an attempt to automatically open the Embed dialog but focus is lost on the point where the 
                    // user wants to embed the player when they click the Brightcove icon.
                    // Future - figure out how the Embed icon saves the previous focus and then returns focus to that location.  We want to do something similar.
                    // + "<button id=\"btnEmbed\" Onclick=\"ChooserOpenEmbed();\">Exit and Embed</button>&nbsp;&nbsp;"
                    + "<button id=\"btnCancel\" onclick=\"return ChooserCancel();\">Exit</button>"
				+ "</p><br/>"
		+ "</div>"
          
		+ "</div>").dialog({
            width: popupWidth,
            height: popupHeight, 
            modal:true
        });
        
        // initial form setup
        $('.ui-dialog-titlebar').hide();
        $('.videosAvailable').empty();
        loadingmessageoff();
        ProcessAspectRatio();
        ProcessEmbedType();
        
        // retrieve Brightcove accounts and settings data from SharePoint
        retrieveListItems(true);
        
        // when user selects an account in the dropdown
        $('#AccountPlaylist').change(function () {
            // clear token
            deleteCookie(OAuthCookieName);

            if ($('#AccountPlaylist').val() === null || $('#AccountPlaylist').val() === '') {
               accountId = getCookie(AccountIDCookieName);
            } else { 
               accountId = $('#AccountPlaylist').val();
               $("#AccountPlaylist option[value='']").remove();
            }

            $('.videosAvailable').empty();
            
            // Set player to null then iterate through account data saved in SharePoint until 
            // find the match with current account ID
            $('#Players').val('');
            var i;
            for (i = 0; i < accounts.length; i++) {
                if (accounts[i].AccountId == accountId) {
                    // populate list of videos
                    getBrightcoveItems(accounts[i]);
                    // populate list of players and set default player
                    getBrightcovePlayers(accounts[i], accounts[i].DefaultPlaylistPlayerId);
                    break;
                }
            }
            
            // If valid accountId, save it in a cookie so can return to the same account if user
            // closes the video popup and then opens the video popup again
            if (/^[0-9]+$/.test(accountId)) {
                setCookie(AccountIDCookieName, accountId, 1*24*60*60);
            }
                        
        });

        // when user changes the player filter
        $('#divBrightcovePlayerSearch').change(function () {
            // clear token
            deleteCookie(OAuthCookieName);           
            accountId = $('#AccountPlaylist').val();
            $("#AccountPlaylist option[value='']").remove();

            
            // Set player to null then iterate through account data saved in SharePoint until 
            // find the match with current account ID            
            $('#Players').val('');
            var i;
            for (i = 0; i < accounts.length; i++) {
                if (accounts[i].AccountId == accountId) {
                    // populate list of players and set default player
                    getBrightcovePlayers(accounts[i], accounts[i].DefaultPlaylistPlayerId);
                    break;
                }
            }
            
            // If valid accountId, save it in a cookie so can return to the same account if user
            // closes the video popup and then opens the video popup again
            if (/^[0-9]+$/.test(accountId)) {
                setCookie(AccountIDCookieName, accountId, 1*24*60*60);
            }
            
        });   
        
        $('#divBrightcoveAspectRatio').trigger('change'); 
        $('#AccountPlaylist').trigger('change');
    }
};

function InitVideoPlayer() {
    var scriptLink = linkTemplate.format([accountId, playerId]);
    var backgroundStyle = styleTemplate.format([backgroundColor]);
    if (playlistId != "") {
        document.getElementById("myPlayerID").setAttribute("data-playlist-id", playlistId);
        document.getElementById("myPlaylistID").setAttribute("class", "vjs-playlist");
    } else {
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

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onListItemsQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onListItemsQuerySucceeded(sender, args) {
    
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
            Title: oListItem.get_item('Title'),
            ClientId: oListItem.get_item('ClientId'),
            ClientSecret: oListItem.get_item('ClientSecret'),
            AccountId: oListItem.get_item('AccountId'),
            DefaultVideoPlayerId: oListItem.get_item('DefaultVideoPlayerId'),
            DefaultPlaylistPlayerId: oListItem.get_item('DefaultPlaylistPlayerId'),
            Id: oListItem.get_id()
        };
        accounts.push(account);
        if (isPlaylist) {
            $('#AccountPlaylist').append($('<option>', {
                value: account.AccountId,
                text: account.Title + " (" + account.AccountId + ")",
                accountid: account.AccountId
            }));
        } else {
            $('#Account').append($('<option>', {
                //value: account.Id,
                value: account.AccountId,
                text: account.Title + " (" + account.AccountId + ")",
                accountid: account.AccountId
            }));
        }

    }

    //
    $('#Account').val(getCookie(AccountIDCookieName));
    $('#AccountPlaylist').val(getCookie(AccountIDCookieName));
    $('#Account').trigger('change');
    $('#AccountPlaylist').trigger('change');
}

function onQueryFailed(sender, args) {
    alert('Error retrieving accounts and settings from Brightcove connector in SharePoint. ' + args.get_message() + '\n' + args.get_stackTrace());
}


function ChooserOpenEmbed() {
    $('.videosAvailable').empty();
    $('.chooserContainer').dialog('close');
    $('#videoPickList').remove();
    $('#playlistPickList').remove(); 
    
    var instance = SP.Ribbon.PageManager.get_instance();
    if (instance) {
       document.getElementById("Ribbon.EditingTools.CPInsert.Embed.Embed-Large").click(); 
    }
}

function ChooserCancel() {
    $('.videosAvailable').empty();
    $('.chooserContainer').dialog('close');
    $('#videoPickList').remove();
    $('#playlistPickList').remove();
}

function ChooserDone(doCloseWindow) {
    if (doCloseWindow) {
        $('.chooserContainer').dialog('close');
    }
}

function ProcessEmbedType() {
    var isPlaylist = getIsPlaylist();
    if (getEmbedType(isPlaylist) === 'iframe') {
        $('#divBrightcoveSizingResponsive').prop('disabled', true)
        $('#divBrightcoveSizingResponsive').next().addClass('disabled_radio');
        $('#divBrightcoveSizingFixed').prop('checked', true).change();
    } else {
        $('#divBrightcoveSizingResponsive').prop('disabled', false)
         $('#divBrightcoveSizingResponsive').next().removeClass('disabled_radio');
    }
}

function ProcessAspectRatio() {
    var isPlaylist = getIsPlaylist();
    if (getAspectRatio(isPlaylist) === '16:9') {
        $('#divBrightcoveHeightInput').prop('readonly', true);
        $('#divBrightcoveHeightInput').addClass('disabled_input');

        //$('#divBrightcoveHeightInput').css("background-color","grey");
        $('#divBrightcoveHeightInput').val(Math.round(9/16*$('#divBrightcoveWidthInput').val()))
    } else if (getAspectRatio(isPlaylist) === '4:3') {
        $('#divBrightcoveHeightInput').prop('readonly', true);
        $('#divBrightcoveHeightInput').addClass('disabled_input');

        //$('#divBrightcoveHeightInput').css("background-color","grey");
        $('#divBrightcoveHeightInput').val(Math.round(3/4*$('#divBrightcoveWidthInput').val()))       
    } else {
        $('#divBrightcoveHeightInput').prop('readonly', false);
        $('#divBrightcoveHeightInput').removeClass('disabled_input');

    }
    
}

function AddSelectedItems() {
    var html = "";
    var isPlaylist = getIsPlaylist();
    
    //Get accountId of selected and assign to accountId textbox
    accountId = $((isPlaylist ? '#AccountPlaylist' : '#Account')).find(':selected').attr('accountid');
    
    var bcplayerId = $('#Players').val(); 
    var bcplayerWidth = $('#divBrightcoveWidthInput').val();
    var bcplayerHeight = $('#divBrightcoveHeightInput').val();
    var bcplayerUnits = getUnits(isPlaylist);
    var bcplayerAutoplay = getAutoplay(isPlaylist);
    var bcplayerMuted = getMuted(isPlaylist);
    var bcplayerEmbedType = getEmbedType(isPlaylist);
    var bcplayerSizing = getSizing(isPlaylist);
    var bcplayerNumThumbnails = $('#divBrightcoveThumbnailsInput').val();

    // get selected item
    var selectedItem = $('.videosAvailable .item.itemSelected');
    var selectedItemId = '';
    if (selectedItem.length > 0) {
        selectedItemId = $(selectedItem).attr('videoid');
    }
    
    // assign to appropriate field value
    if (isPlaylist) {

        var bcplaylistId = selectedItemId;

        if (bcplayerEmbedType === 'iframe' ) {

            html = BuildPlaylistiFrameFixedHtml(accountId, bcplaylistId, bcplayerId, bcplayerWidth, bcplayerHeight, bcplayerUnits, bcplayerAutoplay, bcplayerMuted);

        } else {

            html = BuildPlaylistJavascriptFixedHtml(accountId, bcplaylistId, bcplayerId, bcplayerWidth, bcplayerHeight, bcplayerUnits, bcplayerAutoplay, bcplayerMuted, bcplayerNumThumbnails);

        }
        
    } else {

        var bcvideoId = selectedItemId;
        
        if (bcplayerEmbedType === 'iframe' ) {
            html = BuildVideoiFrameFixedHtml(accountId, bcvideoId, bcplayerId, bcplayerWidth, bcplayerHeight, bcplayerUnits, bcplayerAutoplay, bcplayerMuted);

        } else { // javascript
            if (bcplayerSizing === 'fixed') {
                html = BuildVideoJavascriptFixedHtml(accountId, bcvideoId, bcplayerId, bcplayerWidth, bcplayerHeight, bcplayerUnits, bcplayerAutoplay, bcplayerMuted);

            } else { //responsive
                html = BuildVideoJavascriptResponsiveHtml(accountId, bcvideoId, bcplayerId, bcplayerWidth, bcplayerHeight, bcplayerUnits, bcplayerAutoplay, bcplayerMuted);

            }
        }
    }

    setTimeout(BrightcovePlayerObject.AddSnippet(html), 1000);

}


function getIsPlaylist() {
    var videoAvailable = $('#Account').length > 0;
    var videoHidden = $('#Account:hidden').length > 0;
    var playlistAvailable = $('#AccountPlaylist').length > 0;
    var playlistHidden = $('#AccountPlaylist:hidden').length > 0;
    return (playlistAvailable && !playlistHidden);
}

function getToken(account) {
    loadingmessageon();
    // do we have a current token?
    var token = getCookie(OAuthCookieName);  
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
            setCookie(OAuthCookieName, token, expiresIn);
            loadingmessageoff();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            loadingmessageoff();
            alert("Error retrieving API token from Brightcove.  Please check your proxy settings.");
        }
    });
}




function getBrightcoveItems(account) {

    var func = function (account_id) {
        loadingmessageon();
        var isPlaylist = getIsPlaylist();
        var apiUrl;
        var searchTerm = $('#chooserSearchBox').val();
        var sortValue = getSortValue(isPlaylist);
        var sortDirection = getSortDirection(isPlaylist);
        var folder = $('#Folders').val();
        var itemCount = 0;
        var itemLimit = $('#divBrightcoveItemLimit').val();

        
        if (isPlaylist) {
            apiUrl = CMSAPIURL + 'v1/accounts/' + account_id + '/playlists?';
        } else {
            apiUrl = CMSAPIURL + 'v1/accounts/' + account_id + '/videos?limit=10000&';            
        }
        apiUrl += "sort=" + sortDirection + sortValue;
        if (searchTerm != '') {
            apiUrl += "&q=" + searchTerm;
        }

        var token = getCookie(OAuthCookieName);
        
        
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
                    var thumbnailURL = _spPageContextInfo.siteAbsoluteUrl + "/Style%20Library/Media%20Player/VideoPreview.png";
                    var windowProtocol;
                    var thumbnailSources;
                    if (isPlaylist) {
                        video = {
                            name: item.name,
                            id: item.id,
                            thumbnailURL: thumbnailURL
                        };
                    } else {

                        // Use thumbnail that matches protocol of the hosting webpage
                        if (item.images.thumbnail != null) {
                            windowProtocol = window.location.protocol;
                            thumbnailSources = item.images.thumbnail.sources;
                            $(thumbnailSources).each(function (srcIndex, srcItem) {                             
                                 if (windowProtocol === 'https:') {
                                     if (srcItem.src.substring(0,6) === 'https:') {
                                         thumbnailURL = srcItem.src;
                                     }
                                 } else if (windowProtocol === 'http:') {
                                     if (srcItem.src.substring(0,5) === 'http:') {
                                         thumbnailURL = srcItem.src;
                                     }
                                 } 
                            })
                        } 

                        video = {
                            name: item.name,
                            id: item.id,
                            thumbnailURL: thumbnailURL
                        }
                    };
                    // filter out videos not in the selected folder if a folder is selected
                    if (folder === '' || item.folder_id === folder) {
                        itemCount = itemCount + 1;
                        if (itemCount <= itemLimit) {
                            buffer.push(CreatePicklistItem(video));
                        } else {
                            return false;
                        }
                    }

                })

                $('.videosAvailable').html(buffer.join(''));
                
                loadingmessageoff();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                loadingmessageoff();
                alert("Error retrieving videos or playlists from Brightcove.  Please check your proxy settings.");
            }
        });
    };

 
    var token = getCookie(OAuthCookieName);
    if (token != '' ) {
        func(account.AccountId);        
    } else {
        loadingmessageon();
        // Get OAuth token and then call func() in on success (of asynchronous AJAX call)    
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
                setCookie(OAuthCookieName, token, expiresIn);
                func(account.AccountId); 
                
                loadingmessageoff();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                loadingmessageoff();
                alert("Error retrieving API token from Brightcove.  Please check your proxy settings.");
            }
        });
    }
}



function getBrightcovePlayers(account, DefaultVideoPlayer) {

    var func = function (account_id) {
        loadingmessageon();
        var isPlaylist = getIsPlaylist();
        var isPlaylistPlayer;
        var saveDefaultVideoPlayer = "";
        var apiUrl;
        apiUrl = PLAYERSAPIURL + 'v2/accounts/' + account_id + '/players';
        $('#Players').empty();

        var token = getCookie(OAuthCookieName); 

        $.ajax({
            url: apiUrl,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            success: function (json) {

                $('#Players').empty();
                // iterate through players and add to dropdown
                $(json.items).each(function (index, item) {      
                    
                    if ( (item.name.toUpperCase().indexOf($('#divBrightcovePlayerSearch').val().toUpperCase()) !== -1) || (item.id.toUpperCase().indexOf($('#divBrightcovePlayerSearch').val().toUpperCase()) !== -1) ) {    

                        var nameTrunc = item.name.substring(0,80-item.id.length-3);               

                        // only show playlist players when embedding playlist player
                        isPlaylistPlayer = false;
                        $(item.branches.master.configuration.plugins).each(function (pluginIndex, pluginItem) {
                            if (/videojs-bc-playlist-ui/.test(pluginItem.registry_id)) {
                                isPlaylistPlayer = true;
                                return false;  
                            }             
                        });

                        // if default player in the returned list, then save to be selected below.
                        if ((item.id === DefaultVideoPlayer) || ($('#divBrightcovePlayerSearch').val()=== "" )) {
                            saveDefaultVideoPlayer = DefaultVideoPlayer;
                        }

                        if (isPlaylist && isPlaylistPlayer) {          

                            $('#Players').append($('<option>', {
                                value: item.id,
                                text: nameTrunc + " (" + item.id + ")"
                            }));                            
                        } else if (!isPlaylist && !isPlaylistPlayer) {

                            $('#Players').append($('<option>', {
                                value: item.id,
                                text: nameTrunc + " (" + item.id + ")"
                            }));
                        }

                    }
                    
                });         
                
                if (saveDefaultVideoPlayer !== "") {
                    $('#Players').val(DefaultVideoPlayer);
                }
                
                loadingmessageoff();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                loadingmessageoff();                
                alert("Error retrieving players from Brightcove.  Please check your proxy settings.");
            }
        });   
    };

    // if already have a token, then get list of players and populate pulldown, otherwise get token first
    var token = getCookie(OAuthCookieName);
    if (token != '' ) {
        func(account.AccountId);        
    } else {
        loadingmessageon();
        // Get OAuth token and then call func() in on success (of asynchronous AJAX call)    
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
                setCookie(OAuthCookieName, token, expiresIn);
                func(account.AccountId); 
                
                loadingmessageoff();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                loadingmessageoff();
                alert("Error retrieving API token from Brightcove.  Please check your proxy settings.");
            }
        });
    }        
}

function getBrightcoveFolders(account) {
    var func = function (account_id) {
        loadingmessageon();
        var isPlaylist = getIsPlaylist();
        var apiUrl;
        apiUrl = CMSAPIURL + 'v1/accounts/' + account_id + '/folders?limit=100&';
        $('#Folders').empty();
        $('#Folders').append($('<option>', {
            value: '',
            text: 'All',
        }));
        
        var token = getCookie(OAuthCookieName); 
        $.ajax({
            url: apiUrl,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            success: function (json) {
                // iterate through folders and add to dropdown
                $(json).each(function (index, item) {
                    if (!isPlaylist) {
                        $('#Folders').append($('<option>', {
                            value: item.id,
                            text: item.name
                        }));
                    }
                });
                // select the default folder
                $('#Folders').val('');
                
                loadingmessageoff();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                loadingmessageoff();                
                alert("Error retrieving folders from Brightcove.  Please check your proxy settings.");
            }
        });   
    };

    // if already have a token, then get list of folders and populate pulldown, otherwise get token first
    var token = getCookie(OAuthCookieName);
    if (token != '' ) {
        func(account.AccountId);        
    } else {
        loadingmessageon();
        // Get OAuth token and then call func() in on success (of asynchronous AJAX call)    
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
                setCookie(OAuthCookieName, token, expiresIn);
                func(account.AccountId); 
                
                loadingmessageoff();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                loadingmessageoff();
                alert("Error retrieving API token from Brightcove.  Please check your proxy settings.");
            }
        });
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
//here
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

function getMuted(isPlaylist) {
    var selectedVal = "";
    var selected = $((isPlaylist ? "#playlistPickList" : "#videoPickList") + " .brightcove-player-dialog-muted input[type='checkbox']:checked");
    if (selected.length > 0) {
        selectedVal = "muted";
    }
    return selectedVal;
}


function getAutoplay(isPlaylist) {
    var selectedVal = "";
    var selected = $((isPlaylist ? "#playlistPickList" : "#videoPickList") + " .brightcove-player-dialog-autoplay input[type='checkbox']:checked");
    if (selected.length > 0) {
        selectedVal = "autoplay";
    }
    return selectedVal;
}


function getEmbedType(isPlaylist) {
    var embedValue = "iframe";
    var selectedVal = "";
    var selected = $((isPlaylist ? "#playlistPickList" : "#videoPickList") + " .brightcove-player-dialog-embedtype input[type='radio']:checked");
    if (selected.length > 0) {
        embedValue = selected.val();
    }

    return embedValue;
}


function getAspectRatio(isPlaylist) {
    var embedValue = "16:9";
    var selectedVal = "";
    var selected = $((isPlaylist ? "#playlistPickList" : "#videoPickList") + " .brightcove-player-dialog-aspect-ratio input[type='radio']:checked");
    if (selected.length > 0) {
        embedValue = selected.val();
    }

    return embedValue;
}

function getSizing(isPlaylist) {
    var embedValue = "fixed";
    var selectedVal = "";
    var selected = $((isPlaylist ? "#playlistPickList" : "#videoPickList") + " .brightcove-player-dialog-sizing input[type='radio']:checked");
    if (selected.length > 0) {
        embedValue = selected.val();
    }

    return embedValue;
}

function getUnits(isPlaylist) {
    var embedValue = "px";
    var selectedVal = "";
    var selected = $((isPlaylist ? "#playlistPickList" : "#videoPickList") + " .brightcove-player-dialog-units input[type='radio']:checked");
    if (selected.length > 0) {
        embedValue = selected.val();
    }

    return embedValue;
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
    AddSelectedItems();
}

function loadingmessageon() {
    document.getElementById("loadingoverlay").style.display = "block";
    i = 0;
    loadingMessageTimer = setInterval(function() {
        i = ++i % 4;
        $("#loadingtext").html( "&nbsp;&nbsp;&nbsp;Loading" + Array(i+1).join(".") + Array(4-i).join("&nbsp;") + "&nbsp;&nbsp;&nbsp;");
    }, 2000);
}

function loadingmessageoff() {
    clearInterval(loadingMessageTimer);
    document.getElementById("loadingoverlay").style.display = "none";
}

function getCookie(cookieName) {
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

function setCookie(cookieName, cookieValue, expirationSeconds) {

    var d = new Date();
    d.setTime(d.getTime() + (expirationSeconds * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cookieName + "=" + cookieValue + "; " + expires;
}

function deleteCookie(cookieName) {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}
