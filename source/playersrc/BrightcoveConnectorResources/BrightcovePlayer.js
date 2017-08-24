function BrightcovePlayerObject(){}

BrightcovePlayerObject.Init = function() {
	if (typeof jQuery == 'undefined') {
		BrightcovePlayerObject.LoadBrightcovePlayerJqueryScriptIfNeeded();
	} else {
		BrightcovePlayerObject.LoadBrightcovePlayerJqueryUIScriptIfNeeded();
	}
}

BrightcovePlayerObject.AddPopupCSS = function() {
	var basePath = _spPageContextInfo.siteServerRelativeUrl;
	if (basePath == '/') {
        basePath = '';
    }
	var bcCSS = basePath + '/BrightcoveConnectorResources/BrightcovePlayer.css';
	$("head").append("<link id='juery-ui-css' href='" + bcCSS + "' type='text/css' rel='stylesheet' />");
}

BrightcovePlayerObject.LoadBrightcovePlayerJqueryScriptIfNeeded = function() {
	var script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
    var head = document.getElementsByTagName('head')[0],
    done = false;
    head.appendChild(script);
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() 
    {
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete'))
        {
			done = true;
			BrightcovePlayerObject.LoadBrightcovePlayerJqueryUIScriptIfNeeded();
			script.onload = script.onreadystatechange = null;
			head.removeChild(script);        
        }
    };
}

BrightcovePlayerObject.LoadBrightcovePlayerJqueryUIScriptIfNeeded = function() {
	BrightcovePlayerObject.AddPopupCSS();
	if (typeof jQuery.ui == 'undefined') {
		$.getScript( "https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js", function( data, textStatus, jqxhr ) {
		  BrightcovePlayerObject.Initiate();
		});
	} else {
		BrightcovePlayerObject.Initiate();
	}
}

BrightcovePlayerObject.AddSnippet = function(html) {
	$('#divBrightCoveHtmlSnippetInput').val(html);
	
	BrightcovePlayerObject.CopyToClipboardTemp();
	BrightcovePlayerObject.PasteTemp();
}

BrightcovePlayerObject.CopyToClipboardTemp = function() {
	var input = document.getElementById("divBrightCoveHtmlSnippetInput");
	input.focus();
	input.select();
	document.execCommand('Copy');

	if (document.selection) {
		document.selection.empty();
	} else if ( window.getSelection ) {
		window.getSelection().removeAllRanges();
	}
}

BrightcovePlayerObject.PasteTemp = function() {
	var editor = document.getElementById("divBrightCoveHtmlSnippetInput");
	editor.focus();
	editor.select();
	document.execCommand('Paste');
}

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

var playerId = '';
var width = '';
var height = '';
var videoId = '';
var autoStart = '';
var playlistId = '';
var backgroundColor = '';
var accountId = '';

var linkTemplate = "https://players.brightcove.net/{0}/{1}_default/index.min.js";
var styleTemplate = "background-color:{0};";

BrightcovePlayerObject.Initiate = function() {
	if (BrightcovePlayerObject.InEditMode()) {
		var bcType = window['BrightcovePlayerObjectType'];
		if (bcType == 'playlist'){
			CreatePlaylistPopup();
		}else{
			CreateVideoPopup();	
		}
	}
}

BrightcovePlayerObject.InEditMode = function() {
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
			+ "<br/>"
			+ "<div id=\"divBrightCovePlayer\">"
			  + "Player: <br/>"
			  + "<input id=\"divBrightCovePlayerInput\" value=\"default\"></input>"
			+ "</div>"
			+ "<div id=\"divBrightCoveWidth\">"
			  + "Width: <br/>"
			  + "<input id=\"divBrightCoveWidthInput\" value=\"100%\"></input>"
			+ "</div>"
			+ "<div id=\"divBrightCoveHeight\">"
			  + "Height: <br/>"
			  + "<input id=\"divBrightCoveHeightInput\" value=\"100%\"></input>"
			+ "</div>"

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

		+ "<div id=\"divBrightCoveHtmlSnippet\">"
		  + "Brightcove Snippet (add to Script Editor web part or publishing zone): <br/>"
		  + "<textarea rows=\"6\" id=\"divBrightCoveHtmlSnippetInput\" style=\"width:90%\"></textarea>"
		+ "</div>"
			
		+ "<div class=\"buttonBlock\">"
				+ "<p>"
					+ "<button id=\"btnSave\" onclick=\"AddSelectedItems();return ChooserDone(false);\">OK</button>&nbsp;&nbsp;<button id=\"btnCancel\" onclick=\"return ChooserCancel(true);\">Cancel</button>"
				+ "</p>"
		+ "</div>"
		+ "</div>").dialog({
			width: 515
		});
		$('.ui-dialog.ui-widget').css( "zIndex", '2500');
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
				    $('#divBrightCovePlayerInput').val(accounts[i].DefaultVideoPlayerId);
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
			+ "<br/>"
			+ "<div id=\"divBrightCovePlayer\">"
			  + "Player: <br/>"
			  + "<input id=\"divBrightCovePlayerInput\" value=\"default\"></input>"
			+ "</div>"
			+ "<div id=\"divBrightCoveWidth\">"
			  + "Width: <br/>"
			  + "<input id=\"divBrightCoveWidthInput\" value=\"100%\"></input>"
			+ "</div>"
			+ "<div id=\"divBrightCoveHeight\">"
			  + "Height: <br/>"
			  + "<input id=\"divBrightCoveHeightInput\" value=\"100%\"></input>"
			+ "</div>"
			
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
		
		+ "<div id=\"divBrightCoveHtmlSnippet\">"
		  + "Brightcove Snippet (add to Script Editor web part or publishing zone): <br/>"
		  + "<textarea rows=\"6\" id=\"divBrightCoveHtmlSnippetInput\" style=\"width:90%\"></textarea>"
		+ "</div>"
		
		+ "<div class=\"buttonBlock\">"
				+ "<p>"
					+ "<button id=\"btnSave\" onclick=\"AddSelectedItems();return ChooserDone(false);\">OK</button>&nbsp;&nbsp;<button id=\"btnCancel\" onclick=\"return ChooserCancel(true);\">Cancel</button>"
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
				    $('#divBrightCovePlayerInput').val(accounts[i].DefaultPlaylistPlayerId);
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
			DefaultVideoPlayerId: oListItem.get_item('DefaultVideoPlayerId'),
			DefaultPlaylistPlayerId: oListItem.get_item('DefaultPlaylistPlayerId'),
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
	var html = "";
	var isPlaylist = getIsPlaylist();
	//Get accountId of selected and assign to accountId textbox
	accountId = $((isPlaylist ? '#AccountPlaylist' : '#Account')).find(':selected').attr('accountid');
	var bcplayerId = $('#divBrightCovePlayerInput').val();
	var bcplayerWidth = $('#divBrightCoveWidthInput').val();
	var bcplayerHeight = $('#divBrightCoveHeightInput').val();
	
	// get selected item
	var selectedItem = $('.videosAvailable .item.itemSelected');
	var selectedItemId = '';
	if (selectedItem.length > 0) {
		selectedItemId = $(selectedItem).attr('videoid');
	}
	// assign to appropriate field value
	if (isPlaylist) {
		var bcplaylistId = selectedItemId;
		html = BuildPlaylistHtml(accountId, bcplaylistId, bcplayerId, bcplayerWidth, bcplayerHeight)
	} else {
		var bcvideoId = selectedItemId;
		html = BuildVideoHtml(accountId, bcvideoId, bcplayerId, bcplayerWidth, bcplayerHeight);
	}
	
	//$('#videoPickList').remove();
	//$('#playlistPickList').remove();
	
	setTimeout(BrightcovePlayerObject.AddSnippet(html), 1000);
}

function BuildVideoHtml(bcaccountId, bcvideoId, bcplayerId, bcplayerWidth, bcplayerHeight)
{
	var html = '<div style="display: block; position: relative; max-width: 100%;">' +
		'<div style="padding-top: 56.25%;">' + 
		'<iframe src="' + 
		window.location.protocol + 
		'//players.brightcove.net/' + 
		bcaccountId + 
		'/' + 
		bcplayerId + '_default/index.html?videoId=';
		html += bcvideoId;
		html += '" allowfullscreen webkitallowfullscreen mozallowfullscreen style="width: ' + 
		bcplayerWidth + 
		'; height: ' + 
		bcplayerHeight + 
		'; position: absolute; top: 0px; bottom: 0px; right: 0px; left: 0px;">' + 
		'</iframe>' + 
		'</div>' + 
		'</div>';
	
	return html;
}

function BuildPlaylistHtml(bcaccountId, bcplaylistId, bcplayerId, bcplayerWidth, bcplayerHeight)
{
	var html = '<div style="display: block; position: relative;">' +
		'<div style="padding-top: 100%;">' + 
		'<iframe src="' + 
		window.location.protocol + 
		'//players.brightcove.net/' + 
		bcaccountId + 
		'/' + 
		bcplayerId + '_default/index.html?playlistId=';
		html += bcplaylistId;
		html += '" allowfullscreen webkitallowfullscreen mozallowfullscreen style="width: ' + 
		bcplayerWidth + 
		'; height: ' + 
		bcplayerHeight + 
		'; position: absolute; top: 0px; bottom: 0px; right: 0px; left: 0px;">' + 
		'</iframe>' + 
		'</div>' + 
		'</div>';
	
	return html;
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