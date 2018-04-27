var thumbnailImageUrl = $.Deferred();
var stillImageUrl = $.Deferred();
var uploadedVideoId = '';
var haveUploadedThumb = false;
var haveUploadedStill = false;

//Namespace Object declarations
BrightCove = {};
BrightCove.BCApp = {};
//**************************************************************************************************
//Global Load Operations
//**************************************************************************************************
$(document).ready(function () {
    $('#overlay-inAbox .toolbar a').click(function (e) {
        closeOverlay();
        if ($(this).attr('href') == '#') e.preventDefault();
    });
    SP.SOD.loadMultiple(['sp.js', 'core.js', 'sp.taxonomy.js', 'ScriptForWebTaggingUI.js'], customCode);
    

});

function customCode() {
    //Initialize the current SharePoint context 
    BrightCove.BCApp.Initialize.InitializeSPContext(function () {
        //Get the current working page
        var pageName = BrightCove.BCApp.Utilities.GetCurrentPageName();

        //Initialize the menus and breadcrumbs
        BrightCove.BCApp.Menus.Initialize(pageName);

        try {
            //Invoke the main page event
            BrightCove.BCApp.Initialize.InitializePageLoadEvent(pageName);
        }
        catch (err) {

        }
    });
}

function obtainedBCVideo(videoId, type)
{
    console.log(videoId);
    // still

    if (type == 'VIDEO_STILL') {
    try {
        //setTimeout(function () {
        overlayMessage('Still image is being processed.');
        console.log('uploading still');
        form = document.getElementById("create_still_image");
        //var fileToUpload = $(form).find('input[type=file]').val() != "";
        //if (fileToUpload) {
            buildImageJSONRequest(form, videoId, 'VIDEO_STILL');
            form.action = BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL;
            form.submit();
        //} else { console.log('No still to upload.'); }
        //    }, 10000);
    }
    catch (err) {
        console.log(err.message);
    }
    }

    else if (type == 'THUMBNAIL') {
    //thumb
    try {
            //setTimeout(function () {
        overlayMessage('Thumbnail is being processed..');
        console.log('uploading thumbnail');
        form = document.getElementById("create_thumb_image");
        //var fileToUpload = $(form).find('input[type=file]').val() != "";
        //if (fileToUpload) {
            buildImageJSONRequest(form, videoId, 'THUMBNAIL');
            form.action = BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL;
            form.submit();
        //} else { console.log('No thumbnail to upload.'); }
        //    }, 10000);
    }
    catch (err) {
        console.log(err.message);
    }
}
}

//function obtainedBCImage(videoId, actionType) {
//    if (actionType == 'THUMBNAIL') {
//        thumbnailImageUrl.resolve(videoId);
//    }
//    if (actionType == 'VIDEO_STILL') {
//        stillImageUrl.resolve(videoId);
//    }
//}
function buildImageJSONRequest(form, videoId, imageType) {
    var accountSelect = document.getElementById("ddlSelectAccount");
    var tokenId = accountSelect.options[accountSelect.selectedIndex].value;
    BCL = {};
    json = $(form).find('[name=JSONRPC]').first();
    //Construct the JSON request:
    BCL.json = {};
    BCL.json.method = "add_image";
    BCL.json.params = {};
    BCL.json.params.image = {};
    BCL.json.params.image.type = imageType;
    BCL.json.params.image.resize = "true";
    BCL.json.params.image.displayName = videoId + " " + imageType;
    BCL.json.params.token = tokenId;
    BCL.json.params.video_id = videoId;
    json.val(JSON.stringify(BCL.json));
    $(form).find('[name=JSONView]').val(json.val());
}
function openOverlay(olEl) {
    $oLay = $(olEl);

    if ($('#overlay-shade').length == 0)
        $('body').prepend('<div id="overlay-shade"></div>');

    $('#overlay-shade').fadeTo(300, 0.6, function () {
        var props = {
            oLayWidth: $oLay.width(),
            scrTop: $(window).scrollTop(),
            viewPortWidth: $(window).width()
        };

        var topPos = props.scrTop + 40;
        var leftPos = 0;// (props.viewPortWidth - props.oLayWidth) / 2;

        $oLay
            .css({
                display: 'block',
                opacity: 0,
                top: '-=300',
                left: leftPos + 'px'
            })
            .animate({
                top: topPos,
                opacity: 1
            }, 600);
    });

    $('#s4-workspace').scrollTop(0);
}
function closeOverlay() {
    $('.overlay').animate({
        top: '-=300',
        opacity: 0
    }, 400, function () {
        $('#overlay-shade').fadeOut(300);
        $(this).css('display', 'none');
    });
}
function overlayMessage(msg) {
    var currentHtml = $('#overlay-inAbox .wrapper').html();
    $('#overlay-inAbox .wrapper').html(currentHtml + '<div>' + msg + '</div>');
    $('#overlay-inAbox .wrapper').animate({ scrollTop: $('#overlay-inAbox .wrapper div:last').offset().top }, 1000);
}
function overlayMessageUpdate(msg) {
    $('#overlay-inAbox .wrapper div').last().html(msg);
}
function showOverlayToolbar() {
    $('#overlay-inAbox .toolbar').show();
}
//Initializes the current context of the SharePoint User
var SPContext = {
    UserId: function () {
        if (this._instance == null) {
            this._instance = '123456';
        }
        return this._instance;
    }
    ,
    SPContext: function (context) {
        if (context != null) {
            this._instance = context;
        }
        return this._instance;
    },
    SPParentWebContext: function (context) {
        if (context != null) {
            this._instance = context;
        }
        return this._instance;
    },
    ContextURLPath: function (url) {
        if (this._instance == null && url != null && url.length > 0) {
            this._instance = url;
        }
        return this._instance;
    },
    ContextAppPath: function (url) {
        if (this._instance == null && url != null && url.length > 0) {
            this._instance = url;
        }
        return this._instance;
    },
    //to be removed
    DataStore: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    
    //to be removed
    DataStore2: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    DataStore3: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    VideosList: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    PlayLists: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    BCVideoIDReference: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    Groups: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    ViewObject: function (view) {
        if (view != null) {
            this._instance = view;
        }
        return this._instance;
    },
    PageObject: function (view) {
    if (view != null) {
        this._instance = view;
    }
    return this._instance;
}
};

//Global Constructor
BrightCove.BCApp.Initialize = {
    InitializeSPContext: function (PageLoad) {
        var appweburl = decodeURIComponent(BrightCove.BCApp.Utilities.GetQueryStringParameter('SPAppWebUrl'));
        var hostweburl = decodeURIComponent(BrightCove.BCApp.Utilities.GetQueryStringParameter('SPHostUrl'));
        
        var scriptbase = hostweburl + '/_layouts/15/';

        SPContext.ContextURLPath = scriptbase;
        SPContext.ContextAppPath = appweburl;

        function LoadPage() {
            if (window.location.pathname.toLowerCase().indexOf('default.aspx') > -1) {
                BrightCove.BCApp.Pages.Default.PageLoad();
                //Get the current working page
                var pageName = BrightCove.BCApp.Utilities.GetCurrentPageName();
                //Initialize the menus and breadcrumbs
                BrightCove.BCApp.Menus.Initialize(pageName);

            } else {
                try {
                    BrightCove.BCApp.SharePoint.ListUtilities.GetListItem(BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);
                }
                catch (err) {
                    //Refresh the current page as the SP Context failed to load properly
                    location.href = location.href;
                }
                PageLoad();
            }
        }

        SP.SOD.registerSod('sp.requestexecutor.js', scriptbase + 'sp.requestexecutor.js');
        SP.SOD.executeFunc('sp.requestexecutor.js',
            'SP.RequestExecutor',
            function () {
                SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadPage);
            }
        );

    },
    InitializePageLoadEvent: function (pageName) {
        switch (pageName) {
            case 'AccountManagement.aspx':
                BrightCove.BCApp.Pages.AccountManamgentPage.PageLoad();
                break;
            case 'AddVideos.aspx':
                BrightCove.BCApp.Pages.AddVideos.PageLoad();
                break;
            case 'ManageVideos.aspx':
                BrightCove.BCApp.Pages.ManageVideos.PageLoad();
                break;
            case 'ManagePlaylists.aspx':
                BrightCove.BCApp.Pages.ManagePlayLists.PageLoad();
                break;
            default:
                //BrightCove.BCApp.Pages.Default.PageLoad();
                break;
        }
    }
};
//**************************************************************************************************
//Global Static Configurations
//**************************************************************************************************
BrightCove.BCApp.Constants = {
    SharePointConstants: {
        SPListID_Accounts: 'Accounts',
        //SPListID_PlayList: 'Playlist',
        SPListID_VideoList: 'Videos',
        SPListID_SettingsList: 'BrightcoveSettings',
        SPListID_HomePageList: 'HomePage',
        SPListID_ImageLibrary: 'VideoImages',
        SPGroupName_AdminGroup: 'BCAdmin',
        SPGroupName_VideoAdminGroup: 'BCVideoAdd'
    },
    AppSelectorConstant: {
        PageNameSelector: '.pageName',
        LoadLogoSelector: '.loadingLogo',
        LeftNav: {
            LNSelector: 'nav.leftNav',
            LNButtonSelector: 'nav.leftNav .btn',
            LNAnchorSelector: 'nav.leftNav a',
            LNSelectedClass: 'btn-primary',
            LNUnSelectedClass: 'btn-default',
            LNFullUnSelectedClass: 'btn btn-default btn-lg btn-block',
            LNFullSelectedClass: 'btn btn-primary btn-lg btn-block'
        },
        CancelEditAccount: '#CancelEditAccount',
        SinglePropertyEditSelector: '#SinglePropertyModal',
        TokenEditSelector: '#TokenPropertyModal',
        AccountGroupEditSelector: '#AccountGroupManagerModal'
    },
    BrightCoveURLConstants: {
        ProxyURL: '',
        CMSAPIURL: 'https://cms.api.brightcove.com/',
        IngestAPIURL: 'https://ingest.api.brightcove.com/',
        PostURL: 'http://sp13dev10.dev.corp.akumina.com:8081/api/proxy',
        LibraryURL: '',
    },
    BrightCoveTokenConstants: {
        CookieName: "BCOAUTHToken"
    }
};

//**************************************************************************************************
//Menu Management
//**************************************************************************************************
BrightCove.BCApp.Menus = {
    Initialize: function (pageName) {
        //Set the menu's default selected state
        $(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNSelector).find('a').each(function () {
            var elemid = $(this).data('id');
            if (pageName == elemid) {
                $(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNButtonSelector)
                    .removeClass(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNSelectedClass)
                    .addClass(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNUnSelectedClass);

                $(this).addClass(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNSelectedClass)
                    .removeClass(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNUnSelectedClass);
            }

            //Set the query string params on each of the links
            var queryString = window.location.search;

            if (queryString.indexOf('&spid') > 0) {
                queryString = window.location.search.substring(0, window.location.search.indexOf('&spid'));
            }
            else if (queryString.indexOf('&vid') > 0) {
                queryString = window.location.search.substring(0, window.location.search.indexOf('&vid'));
            }
            else if (queryString.indexOf('&bcvid') > 0) {
                queryString = window.location.search.substring(0, window.location.search.indexOf('&bcvid'));
            }
            $(this).attr('href', $(this).data('id') + queryString);

            if (elemid.indexOf('AccountManagement.aspx') > -1) {
                var elem = $(this);
                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(BrightCove.BCApp.Constants.SharePointConstants.SPGroupName_AdminGroup,
                function (userInGroup) {
                    if (!userInGroup) {
                        elem.remove();
                    }
                }, true);

            }

            if (elemid.indexOf('AddVideos.aspx') > -1) {
                var elem = $(this);
                elem.hide();
                var isIntoAdminGroup = false;
                var isIntoVideoAdminGroup = false;

                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(BrightCove.BCApp.Constants.SharePointConstants.SPGroupName_AdminGroup,
                function (userInGroup) {
                    if (userInGroup) {
                        elem.show();
                    } else {

                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(BrightCove.BCApp.Constants.SharePointConstants.SPGroupName_VideoAdminGroup,
                function (userInGroup) {
                    if (userInGroup) {
                        elem.show();
                    } else {
                        elem.remove();
                    }
                }, true);
                    }
                }, true);
                
                

            }

        });
    }
};

//**************************************************************************************************
//Global Functions
//**************************************************************************************************    

//Global Utilities
BrightCove.BCApp.Utilities = {
    ConvertDateFormat: function (dateValue) {
        var convertedDateValue = '';
            // split by "/"
        var dateSplit = dateValue.split("/");
        var convertedDateArray = [];

        convertedDateArray.push(dateSplit[2]);
        convertedDateArray.push(dateSplit[0]);
        convertedDateArray.push(dateSplit[1]);

        return convertedDateArray.join('-');
    },
    AddTextTrackRows: function( text_tracks) {
        if (text_tracks != null) {
            for (i = 0; i < text_tracks.length; i++) {
                var textTrackItem = text_tracks[i];

                var textTrackId = textTrackItem.id;
                var textTrackRemoteUrl = textTrackItem.src;
                var textTrackLangProp = textTrackItem.srclang;
                var textTrackPropLabel = textTrackItem.label;
                var textTrackPropKind = textTrackItem.kind;

                // add to table
                BrightCove.BCApp.Utilities.AddTextTrackRow(
                    textTrackId,
                    textTrackPropLabel,
                    textTrackLangProp,
                    textTrackPropKind,
                    'url',
                    null,
                    textTrackRemoteUrl,
                    true
                );
            }
        }
    },
    AddTextTrackRow: function (id, label, lang, kind, type, fileField, remoteUrl, existing) {
        // add to table
        var $tableBody = $('#TextTrackFilesTbl').find("tbody");
        var textTrackRow = $('<tr>')
                                .append($('<td>')
                                    .append(label)
                                )
                                .append($('<td>')
                                    .append(lang)
                                )
                                .append($('<td>')
                                    .append(kind)
                                )
                                .append($('<td>')
                                    .append('<a>Remove</a>')
                                );

        if (id == null) {
            id = '';
        }
        $(textTrackRow).data('text-track-id', id);
        $(textTrackRow).data('label', label);
        $(textTrackRow).data('lang', lang);
        $(textTrackRow).data('kind', kind);
        $(textTrackRow).data('type', type);
        $(textTrackRow).data('existing', existing);

        // if file, clone and
        // move file field into row.
        if (type == "file") {
            var currentFileFields = $('#TextTrackFilesTbl input:file');
            var nextFieldId = currentFileFields.length;

            var nextField = $(fileField).clone();
            $(fileField).attr('id', 'textTrackFile_F' + nextFieldId);
            $(textTrackRow).find('td').last().append(fileField);
            $('.texttrackfileinfo').prepend(nextField);
        } else if (type == "url") {
            // if url
            // add remoteurl to data
            $(textTrackRow).data('remote-url', remoteUrl);
        }

        $tableBody.append(textTrackRow);

        //bind remove
        $(textTrackRow).find('td:last a').click(function (event) {
            var tableRow = $(this).closest('tr')
            var isExisting = $(tableRow).data('existing');
            if (isExisting) {
                $(tableRow).addClass('markedfordelete');
                $(this).remove();
            } else {
                $(tableRow).remove();
            }
        });

    },
    HasTextTrackDeletes: function() {
        var hasDeletes = false;

        // for the url upload table,
        var textTrackRows = $('#TextTrackFilesTbl tr');
        // start from 1 (header)
        for (var i = 1; i < textTrackRows.length; i++) {
            var thisRow = textTrackRows[i];
            var isDeleted = $(thisRow).hasClass('markedfordelete');
            if (isDeleted) {
                hasDeletes = true;
                break;
            }
        }

        return hasDeletes;
    },
    GetTextTrackDeletes: function () {
        var deleteList = [];

        // for the url upload table,
        var textTrackRows = $('#TextTrackFilesTbl tr');
        // start from 1 (header)
        for (var i = 1; i < textTrackRows.length; i++) {
            var thisRow = textTrackRows[i];
            var isDeleted = $(thisRow).hasClass('markedfordelete');
            if (isDeleted) {
                var textTrackId = $(thisRow).data('text-track-id');
                deleteList.push(textTrackId)
                break;
            }
        }

        return deleteList;
    },
    HasTextTrackUrls: function() {
        var urlsToUpload = BrightCove.BCApp.Utilities.GetTextTrackUrls();
        var hasUrlsToUpload = urlsToUpload.length > 0;

        return hasUrlsToUpload;
    },
    GetTextTrackUrls: function () {
        var urlsToUpload = [];

        // for the url upload table,
        var textTrackRows = $('#TextTrackFilesTbl tr');
        // start from 1 (header)
        for (var i = 1; i < textTrackRows.length; i++) {
            var thisRow = textTrackRows[i];
            var isExisting = $(thisRow).data('existing').toString() == "true";
            var isDeleted = $(thisRow).hasClass('markedfordelete');
            var isProcessedValue = $(thisRow).data('processed');
            var isProcessed = (isProcessedValue != null && (isProcessedValue == "true" || isProcessedValue == true));
            var isUrl = $(thisRow).data('type') == "url";
            // find all that are
            // not existing
            // not deleted
            // a url
            if (!isExisting && !isDeleted && !isProcessed && isUrl) {
                var textTrackLabel = $(thisRow).data('label');
                var textTrackLang = $(thisRow).data('lang');
                var textTrackKind = $(thisRow).data('kind');
                var textTrackUrl = $(thisRow).data('remote-url');

                var urlToUpload = {
                    "language": textTrackLang,
                    "label": textTrackLabel,
                    "kind": textTrackKind,
                    "url": textTrackUrl,
                    "index": i
                }
                urlsToUpload.push(urlToUpload);
            }
        }
        
        return urlsToUpload;
    },
    GetTagFriendlyFileName: function(fileName) {
        return fileName.replace(/[^a-zA-Z0-9]/g, '');
    },
    GetNextFile: function() {
        // get next file
        var file = null;
        var multiUpload = BrightCove.BCApp.Utilities.IsMultipleUpload();
        if (multiUpload) {
            // number of files to upload
            var numberOfFiles = $('#create_video input:file').length;
            // current length
            var currentQueueIndex = BrightCove.BCApp.Pages.PageData.UploadList.length;
            // get input fields
            var fileFields = $('#create_video input:file');
            var index = 0;

            for (var i = 0; i < fileFields.length; i++) {
                var fileField = $(fileFields)[i];
                var fileFieldId = $(fileField).attr('id');
                var fileChooser = document.getElementById(fileFieldId);
                var hasValue = $(fileField).val();

                if (hasValue) {
                    if (index == currentQueueIndex) {
                        
                        file = fileChooser.files[0];
                        break;
                    }
                    index++;
                }
            }

        } else {
            var mode = BrightCove.BCApp.Pages.PageData.CurrentMode;
            var mainUpload = true;
            if (mode == 'brightcoveimport' || mode == 'sharepointupdate'){
                mainUpload = false;
            }
            if (mainUpload && BrightCove.BCApp.Pages.PageData.UploadList.length == 0) {
                // video first
                var fileChooser = document.getElementById('videoFile');
                file = fileChooser.files[0];
            } else {
                var uploadOffset = 1;
                if (!mainUpload) {
                    uploadOffset = 0;
                }
                // we already uploaded the video
                // now upload the captions
                // number of files to upload
                var fileFields = $('#TextTrackFilesTbl input:file');
                var numberOfFiles = fileFields.length;
                // current length
                // offset 1 for the video that was uploaded
                var currentQueueIndex = BrightCove.BCApp.Pages.PageData.UploadList.length - uploadOffset;
                // get input fields
                var index = 0;

                for (var i = 0; i < fileFields.length; i++) {
                    var fileField = $(fileFields)[i];
                    var fileFieldId = $(fileField).attr('id');
                    var fileChooser = document.getElementById(fileFieldId);
                    var hasValue = $(fileField).val();

                    if (hasValue) {
                        if (index == currentQueueIndex) {
                            file = fileChooser.files[0];
                            break;
                        }
                        index++;
                    }
                }
            }
        }
        
        return file;
    },
    IsMultipleUpload: function(){
        return $('.addTitle .addmulti').hasClass('tabActive');
    },
    SetAddVideBreadCrumb: function (mode) {
        switch(mode)
        {
            case 'edit':
                $('.addTitle').hide();
                $('.editTitle').show();
                break;
            default:
                // shown by default
                break;
        }
    },
    GetCustomFields: function () {
        var list = [];
        var customFieldInputs = $('#customFields input');
        for (var i = 0; i < customFieldInputs.length; i++) {
            var customFieldInput = $(customFieldInputs[i]);
            var fieldName = $(customFieldInput).attr('id').substring('custom'.length);
            var fieldValue = $(customFieldInput).val();
            var customField = {
                Name: fieldName,
                Value: fieldValue
            }

            list.push(customField);
        }
        return list;
    },
    ShowError: function (msg) {
        alert(msg);
    },
    DeleteCookie: function (cookieName) {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    },
    SetCookie: function (cookieName, cookieValue, expirationSeconds) {
        var d = new Date();
        d.setTime(d.getTime() + (expirationSeconds * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cookieName + "=" + cookieValue + "; " + expires;
    },
    GetCookie: function (cookieName) {
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
    },
    GetCurrentPageName: function () {
        return $(BrightCove.BCApp.Constants.AppSelectorConstant.PageNameSelector).val();
    },
    ShowMainPageContent: function () {
        //Show the main content region only after all of the content/data is done loading
        $('.body-content > .row').slideDown();
    },
    SetShowHides: function (preSlideUpDelegate, preSlideDownDelegate, postSlideDownDelegate) {
        $("a[data-toggle='showhide'],button[data-toggle='showhide']").click(function (event) {

            if (preSlideUpDelegate != null) {
                preSlideUpDelegate($(this));
            }

            BrightCove.BCApp.Utilities.TriggerSlideUp($(this));

            if (preSlideDownDelegate != null) {
                preSlideDownDelegate($(this));
            }

            BrightCove.BCApp.Utilities.TriggerSlideDown($(this));

            if (postSlideDownDelegate != null) {
                postSlideDownDelegate($(this));
            }

            event.stopPropagation();
        });
    },
    AddClickEvent: function (element, preSlideUpDelegate, preSlideDownDelegate, postSlideDownDelegate, viewModelData) {
        if (element == null)
            return false;

        element.click(function (event) {

            if (preSlideUpDelegate != null) {
                if (viewModelData != null)
                    preSlideUpDelegate($(this), viewModelData);
                else
                    preSlideUpDelegate($(this));
            }

            BrightCove.BCApp.Utilities.TriggerSlideUp($(this));

            if (preSlideDownDelegate != null) {
                if (viewModelData != null)
                    preSlideDownDelegate($(this), viewModelData);
                else
                    preSlideDownDelegate($(this));
            }

            BrightCove.BCApp.Utilities.TriggerSlideDown($(this));

            if (postSlideDownDelegate != null) {
                if (viewModelData != null)
                    postSlideDownDelegate($(this), viewModelData);
                else
                    postSlideDownDelegate($(this));
            }

            event.stopPropagation();
        });
    },
    TriggerShowHides: function (element) {
        if (element == null)
            return false;
        this.TriggerSlideUp(element);
        this.TriggerSlideDown(element);
    },
    TriggerSlideUp: function (element) {
        if (element == null)
            return false;
        var hide = element.data('hidetarget');
        $(hide).slideUp();
    },
    TriggerSlideDown: function (element) {
        if (element == null)
            return false;
        var target = element.data('target');
        $(target).slideDown();
    },
    ToggleElementVisibility: function (selector) {
        if (selector == null || selector.length < 1)
            return false;
        $(selector).toggleClass('hideSection');
    },
    BindData: function (data) {
        //ko.applyBindings(data, document.getElementById('AccountSelect'));
        ko.applyBindings(data);
    },
    CloneObject: function (obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    },
    CreateBCGuid: function (index, videoName) {
        var date = (new Date()).format("yyyyMMddhhmss");
        videoName = videoName.toLowerCase().replace(' ', '');

        var s1 = 'BCSP';
        var s2 = (videoName.length > 5) ? videoName.substring(0, 4) : videoName;
        var s3 = date;
        var s4 = index;

        var guid = s1 + "-" + s2 + "-" + s3 + "-" + s4;
        return guid.toLowerCase();
    },
    CreateGuid: function (seed) {
        var s1 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        var s2 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        var s3 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        var s4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        var guid = s1 + "-4" + s2 + "-3" + s3 + "-2" + s4 + "-1-" + seed;
        return guid.toLowerCase();
    },
    SortByOrderAscending: function (a, b) {
        return ($(a).data('order')) > ($(b).data('order')) ? 1 : -1;
    },
    
    
    SortByNameAscending: function (a, b) {
        return ($(a).data('name').toString().toLowerCase()) > ($(b).data('name').toString().toLowerCase()) ? 1 : -1;
    },
    SortByOrderDescending: function (a, b) {
        return ($(a).data('order')) < ($(b).data('order')) ? 1 : -1;
    },
    SortByDateCreatedAscending: function (a, b) {
        var aValue = $(a).data('created');
        var bValue = $(b).data('created');
        return (new Date(aValue) > new Date(bValue)) ? 1 : -1;
    },
    SortByDateCreatedDescending: function (a, b) {
        var aValue = $(a).data('created');
        var bValue = $(b).data('created');
        return (new Date(aValue) < new Date(bValue)) ? 1 : -1;
    },
    SortByDateStartedAscending: function (a, b) {
        var aValue = $(a).data('started');
        var bValue = $(b).data('started');
        if (aValue == '')
            aValue = $(a).data('created');
        if (bValue == '')
            bValue = $(b).data('created');
        return (new Date(aValue)) > (new Date(bValue)) ? 1 : -1;
    },
    SortByDateStartedDescending: function (a, b) {
        var aValue = $(a).data('started');
        var bValue = $(b).data('started');
        if (aValue == '')
            aValue = $(a).data('created');
        if (bValue == '')
            bValue = $(b).data('created');
        return (new Date(aValue)) < (new Date(bValue)) ? 1 : -1;
    },
    SortByNameDescending: function (a, b) {
        return ($(a).data('name').toString().toLowerCase()) < ($(b).data('name').toString().toLowerCase()) ? 1 : -1;
    },
    PL_SortByIDAscending: function (a, b) {
        return ($(a).data('id')) > ($(b).data('id')) ? 1 : -1;
    },
    PL_SortByDescAscending: function (a, b) {
        return ($(a).data('desc')) > ($(b).data('desc')) ? 1 : -1;
    },
    PL_SortByNameAscending: function (a, b) {
        return ($(a).data('name').toString().toLowerCase()) > ($(b).data('name').toString().toLowerCase()) ? 1 : -1;
    },
    PL_SortByTypeAscending: function (a, b) {
        return ($(a).data('type').toLowerCase()) > ($(b).data('type').toLowerCase()) ? 1 : -1;
    },
    PL_SortByIDDescending: function (a, b) {
        return ($(a).data('id')) < ($(b).data('id')) ? 1 : -1;
    },
    PL_SortByTypeDescending: function (a, b) {
        return ($(a).data('type')) < ($(b).data('type')) ? 1 : -1;
    },
    PL_SortByDescDescending: function (a, b) {
        return ($(a).data('desc')) < ($(b).data('desc')) ? 1 : -1;
    },
    PL_SortByNameDescending: function (a, b) {
        return ($(a).data('name').toLowerCase()) < ($(b).data('name').toLowerCase()) ? 1 : -1;
    },
    GetQueryStringParameter: function (param) {
        try {
            var params = document.URL.split("?")[1].split("&");
            var strParams = "";
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == param) {
                    return singleParam[1];
                }
            }
        }
        catch (err) {
            console.log('An error occurred while loading the application querystring values: ' + err.toString());
        }
    },
    DisplayEditableTags: function (video) {
        var tags = video.VideoData().Keywords;
        if ($.isFunction(video.VideoData().Keywords)) {
            tags = video.VideoData().Keywords();
        }
        var newTags = [];
        if (tags == null) { tags = ''; }
        var keywords = tags.toLowerCase().split(',');
        for(var i = 0; i < keywords.length; i++) {
            if (keywords[i].indexOf('bcsp-') == -1) {
                newTags.push(keywords[i]);
            }
        }
        return newTags.join(',');
    },
    DisplaySystemTags: function (video) {
        var tags = video.VideoData().Keywords;
        if ($.isFunction(video.VideoData().Keywords)) {
            tags = video.VideoData().Keywords();
        }
        var newTags = [];
        if (tags == null) { tags = ''; }
        var keywords = tags.toLowerCase().split(',');
        for(var i = 0; i < keywords.length; i++) {
            if (keywords[i].indexOf('bcsp-') > -1) {
                newTags.push(keywords[i]);
            }
        }
        return newTags.join(',');
    },
    StripBCToken: function (param) {
        var returnToken = '';

        if (param.indexOf('-') > 0) {
            returnToken = param.substring(param.indexOf('-') + 1);
        }
        else
            returnToken = param;

        return returnToken;
    },
    StripBCTokenType: function (param) {
        var returnToken = '';

        if (param.indexOf('-') > 0) {
            returnToken = param.substring(0, param.indexOf('-'));
        }
        else
            returnToken = param;

        return returnToken;
    },
    PreventEnterKeyPostBack: function (selector) {
        //$("body input:text").keypress(function (e) {
        $(selector).keypress(function (e) {
            if (e.which == 13) {
                return false;
            }
        });
    },
    AddEnterKeyEventToButton: function (textSelector, buttonSelector) {
        var eventNameSpace = (textSelector + buttonSelector).replace(/\#/g, '_').replace(/>/g, '_').replace(/ /g, '_').replace(/\./g, '_');
        // $(textSelector).keypress(function (e) {
        $(textSelector).unbind('keypress.' + eventNameSpace).bind('keypress.' + eventNameSpace, function (e) {
                if (e.which == 13) {
                $(buttonSelector).trigger('click');
                return false;
            }
        });
    },
    ReadAccountToken: function (account) {
        //Get the corresponding write tokens for each of the accounts listed in the dropdown
        if (account == null || account == undefined)
            return;

        var tokens = account.ReadTokens();
        if (tokens != null && tokens.length > 0) {
            for (var i = 0; i < tokens.length; i++) {
                if (tokens[i].toLowerCase().indexOf('ead-') > -1) {
                    var tok = tokens[i].split('ead-');
                    return tok[1];
                }
            }
        }
        return '';
    },
    GetCommaSeparatedArray: function (param) {
        if (param == null)
            return [];
        return (param.length > 0) ? param.split(',') : [];
    },
    GetAccountByID: function (itemid, accountList) {
        if (itemid == null || itemid.length < 1)
            return null;

        var match = ko.utils.arrayFirst(accountList, function (item) {
            return item.PropertyId() == itemid;
        });

        if (match) {
            return match;
        }
        return null;
    },
    GetPlaylistByID: function (itemid, accountList) {
        if (itemid == null || itemid.length < 1)
            return null;

        var match = ko.utils.arrayFirst(accountList, function (item) {
            return item.ID() == itemid;
        });

        if (match) {
            return match;
        }
        return null;
    },
    PageRefresh: function () {
        location.href = location.href;
        return false;
    },
    CreateBasicVideoObjectFromAPIItem: function (item) {

        var newData = new BrightCove.BCApp.DataStructures.VideoData();

        newData.VideoTitle = item.name;
        newData.VideoID = item.id;
        newData.ReferenceID = item.id;
        newData.VideoThumbNail = (item.images.thumbnail != null ? item.images.thumbnail.src : "../images/video.png");
        newData.VideoShortDescription = item.description;
        newData.VideoStartDate = item.starts_at;
        newData.VideoEndDate = item.ends_at;
        newData.Keywords = (item.tags != null && item.tags.length > 0) ? item.tags.join(',') : '';

        return newData;

    },
    CreateVideoObjectFromListItem: function (oListItem) {
        if (oListItem == null || oListItem.get_id == undefined)
            return newData;

        var newData = new BrightCove.BCApp.DataStructures.VideoData();
        try {
            newData.VideoID = oListItem.get_id();
            if (oListItem.get_item('Title') != null) {
                newData.VideoTitle = oListItem.get_item('Title');
            }
            else {
                newData.VideoTitle = '';
            }

            var createdDateObj = new Date(Date.parse(oListItem.get_fieldValues()["Created"]));
            newData.CreatedDate = (createdDateObj.getMonth() + 1) + '/' + createdDateObj.getDate() + '/' + (createdDateObj.getYear() + 1900);
            var modifiedDateObj = new Date(Date.parse(oListItem.get_fieldValues()["Modified"]));
            newData.DateModified = (modifiedDateObj.getMonth() + 1) + '/' + modifiedDateObj.getDate() + '/' + (modifiedDateObj.getYear() + 1900);

            newData.Account = oListItem.get_item('Account');
            if (oListItem.get_item('SPID') != null) {
                newData.SPID = oListItem.get_item('SPID');
            }
            else {
                newData.SPID = '';
            }
            if (oListItem.get_item('VideoThumbnail') != null) {
                newData.VideoThumbNail = oListItem.get_item('VideoThumbnail').get_url();
            }
            else {
                newData.VideoThumbNail = '';
            }
            if (oListItem.get_item('VideoImage') != null) {
                newData.VideoStillImage = oListItem.get_item('VideoImage').get_url();
            }
            else {
                newData.VideoStillImage = '';
            }
            if (oListItem.get_item('LongDescription') != null) {
                newData.VideoLongDescription = oListItem.get_item('LongDescription');
            }
            else {
                newData.VideoLongDescription = '';
            }
            if (oListItem.get_item('ShortDescription') != null) {
                newData.VideoShortDescription = oListItem.get_item('ShortDescription');
            }
            else {
                newData.VideoShortDescription = '';
            }
            if (oListItem.get_item('RelatedLink') != null) {
                newData.RelatedLink = oListItem.get_item('RelatedLink').get_url();
                newData.RelatedLinkText = oListItem.get_item('RelatedLink').get_description();
            }
            else {
                newData.RelatedLink = '';
                newData.RelatedLinkText = '';
            }
            if (oListItem.get_item('ReferenceID') != null) {
                newData.ReferenceID = oListItem.get_item('ReferenceID');
            }
            else {
                newData.ReferenceID = '';
            }
            if (oListItem.get_item('StartDate') != null) {
                newData.VideoStartDate = oListItem.get_item('StartDate').format('MM/dd/yyyy');
            }
            else {
                newData.VideoStartDate = '';
            }
            if (oListItem.get_item('EndDate') != null) {
                newData.VideoEndDate = oListItem.get_item('EndDate').format('MM/dd/yyyy');
            }
            else {
                newData.VideoEndDate = '';
            }
            if (oListItem.get_item('Keywords') != null) {
                newData.Keywords = oListItem.get_item('Keywords');
            }
            else {
                newData.Keywords = '';
            }
            if (oListItem.get_item('Economic') != null) {
                newData.Economics = oListItem.get_item('Economic');
            }
            else {
                newData.Economics = '';
            }

            newData.Active = oListItem.get_item('Active');
            newData.CustomFields = {};

            var accountItemId = $('#ddlSelectAccount option:selected').data('item-id');
            if (accountItemId == null || accountItemId == '') {
                accountItemId = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
            }
            var fieldPrefix = 'c_x002e_' + accountItemId + '_x002e_';
            var itemFields = Object.keys(oListItem.get_fieldValues());
            for (i = 0; i < itemFields.length; i++) {
                var internalFieldName = itemFields[i];
                if (internalFieldName.indexOf(fieldPrefix) == 0)
                {
                    var fieldValue = oListItem.get_item(internalFieldName);
                    newData.CustomFields[internalFieldName] = fieldValue;
                }
            }

        }
        catch (err) {
            console.log(err);
        }

        return newData;
    },
    GetField: function (fieldName, oListItem) {
        var desiredFieldName = fieldName;
        var hasDesiredFieldName = oListItem.get_fieldValues()[desiredFieldName] != null;
        if (!hasDesiredFieldName) {
            desiredFieldName = videoFieldMappings[desiredFieldName];
        }

        return desiredFieldName;
    },
    ValidateURLFormat: function(url){
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(url);
    },
    ReplaceAll: function (string, find, replace)
    {
        try{
            function escapeRegExp(string) {
                return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            }
            return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }
        catch(error){            
            return '';
        }
    },
    PreventQuotes: function () {
        $('.container').find('input, select, textarea').each(
                    function (index) {
                        var input = $(this);
                        if (input.attr('type') != "button") {
                            input.on('keypress', function (e) {
                                var ingnore_key_codes = [34, 39];
                                if ($.inArray(e.which, ingnore_key_codes) >= 0) {
                                    e.preventDefault();
                                }
                            });
                        }
                    }
                );
    },
    isVideoUploaded: function () {
        $(document).ajaxComplete(function () {
            if (!$('.formContent,.addTitle').is(":visible")) {
                $('#reload').show();
            }
        });
        
    }

};

//Global Messaging
BrightCove.BCApp.Messaging = {
    GuidNotPresent: function () {
        return 'Error creating the unique GUID value. Operation aborted.';
    },
    WriteTokenNotPresent: function () {
        return 'The selected account does not contain a valid write token.'
                    + '\nPlease choose a different account before proceeding.';
    },
    ValidationFailedMessage: function () {
        return 'Please ensure that all required fields have been filled in.';
    },
    ValidationImageUploadMessage: function () {
        return 'If setting images, both thumbnail and stills must be selected.';
    },
    ValidationtextTrackUploadMessage: function () {
        return 'You have a text track that has not been uploaded. Please clear or add to proceed.';
    },
    ValidationtextTrackFileMessage: function () {
        return 'All required fields must be filled in for a text track file upload.';
    },
    ValidationtextTrackFileExtentionMessage: function () {
        return 'The file extension must be .vtt';
    },
    ValidationtextTrackUrlMessage: function () {
        return 'The text track URL must be in the correct format and all required fields must be filled in for a text track url.';
    },
    ValidationtextTrackUrlFormatMessage: function () {
        return 'The text track URL must be a fully qualified URL, containing http:// or https://.';
    },
    ValidationInvalidUrlMessage: function () {
        return 'The URL link text or URL format used on the related link field is invalid. ' 
            + 'Please ensure that the link text field is filled out, and that the URL link '
            + 'format follows the following pattern: \n'
            + '"http://contoso.com" or "http://www.contoso.com" or "ftp://contoso.com" '
            + 'or "https://contoso.com"';
    },
    ValidationInvalidDateRange: function () {
        return 'The date ranges entered are invalid. Please ensure the following: \n'
                + 'If a start date is set, the end date must be greater than the start date \n'
                + 'If only an end date is entered, the end date should be greater than today\'s date';
    }
    ,
    ValidationInvalidQuotes: function () {
        return 'Please ensure to not use double or single quotes in text fields.';
    }
}; 

BrightCove.BCApp.Pages = {
    //**************************************************************************************************
    //Page Data
    //**************************************************************************************************
    PageData: {
        Temp: null,
        Temp2: null,
        CurrentMode: '',
        SiteId: '',
        CurrentObject: null,
        BrightcoveVideoData: null,
        VideosListFields: [],
        AccountSelectBound: false,
        UploadList: [],
        LoadedPlaylistVideos: false,
        LoadedTextTracks: false,
        LoadedCustomProperties: false
    },
    AccountManamgentPage: {
        PageLoad: function (param1, param2) {
            SPContext.ViewObject(this);
            //Call into SharePoint to retrieve the account data stored
            this.LoadAccountSelectData('#AccountSelectTbl');

            //BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserSiteCollectionAdmin();
            BrightCove.BCApp.SharePoint.ListUtilities.DoesCurrentUserHaveEditRights(function () {
                SPContext.ViewObject().LoadUIEvents();
            }, function () {
                alert('The current user does not have permissions to access this page');
                //SPContext.ViewObject().LoadUIEvents();
            });
        },
        LoadUIEvents: function(){
            //Add Base UI Events
            SPContext.ViewObject().AddAccountBtnEvent('#AddAccountBtn');
            SPContext.ViewObject().CancelEditAccountBtnsEvent('#CancelEditAccount');
            SPContext.ViewObject().EditAccountsBtnEvents('#AccountSelectTbl .mLinks');
            BrightCove.BCApp.Utilities.PreventEnterKeyPostBack(".modal-dialog input:text");
        },
        AddAccountBtnEvent: function (selector) {
            var elem = $(selector);
            var viewData = this.SelectAccountViewObject();

            BrightCove.BCApp.Utilities.AddClickEvent(elem, function (clickedObj, viewData) {
                viewData.CurrentAccount(new BrightCove.BCApp.DataStructures.AccountData());
                viewData.CurrentReadTokens.removeAll();

                $('.NameField > button').removeAttr('style');

            }, null, null, viewData);
        },
        EditAccountsBtnEvents: function (selector) {
            var elem = $(selector);
            var viewData = this.SelectAccountViewObject();

            BrightCove.BCApp.Utilities.AddClickEvent(elem, null, function (clickedObj, viewData) {

                BrightCove.BCApp.Utilities.TriggerSlideUp($(selector));

                var itemId = clickedObj.data('item-id');
                var selAccount = viewData.GetItem(itemId);

                if (selAccount) {
                    BrightCove.BCApp.Utilities.TriggerSlideDown($(selector));
                }
                else
                    alert('The selected account no longer exists. Please refresh this page');

                $('.NameField > button').removeAttr('style');

            }, null, viewData);
        },
        CancelEditAccountBtnsEvent: function (selector) {
            var elem = $(selector);
            var viewData = this.SelectAccountViewObject();

            var newData = new BrightCove.BCApp.DataStructures.AccountData();
            newData.PropertyName = 'New Item';
            newData.PropertyId = '';
            newData.AccountAuthorsGroup = '';
            newData.AccountViewersGroup = '';
            newData.AccountAuthorsGroupName = '';
            newData.AccountViewersGroupName = '';
            newData.DefaultVideoPlayerId = '';
            newData.DefaultPlaylistPlayerId = '';
            newData.TemporaryStorageLocation = '';
            newData.AWSAccessKeyId = '';
            newData.AWSSecretAccessKey = '';
            newData.AWSBucketName = '';
            newData.DropboxAccessToken = '';
            newData.AccountId = '';
            newData.ClientId = '';
            newData.ClientSecret = '';
            newData.ReadTokens = [];
            newData.WriteTokens = [];

            var newObj = ko.mapping.fromJS(newData);
            //CurrentAccount(newData);

            viewData.CurrentAccount(newObj);

            BrightCove.BCApp.Utilities.AddClickEvent(elem);
        },
        LoadAccountSelectData: function (selector) {
            var elem = $(selector);

            var viewData = this.SelectAccountViewObject();
            BrightCove.BCApp.Utilities.BindData(viewData);
        },
        SaveAccountEditData: function (selector) {
            var elem = $(selector);
        },
        DeleteAccountEditData: function (selector) {
            var elem = $(selector);
        },
        SelectAccountViewObject: function () {
            if (this._instance == null) {
                this._instance = new BrightCove.BCApp.ViewModels.AccountSelectViewModel();
            }
            return this._instance;
        }
    },
    AddVideos: {
        AddCustomFields: function () {
            // add customfields to the page
            var accountItemId = $('#ddlSelectAccount option:selected').data('item-id');
            if (accountItemId == null || accountItemId == '') {
                accountItemId = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
            }
            var customPrefix = 'c.' + accountItemId + '.';
            var customFieldsContainer = $('#customFields');
            var accountObject = null;
            var requiredFields = [];
            var displayNames = {};

            // find the 
            for (i = 0; i < this.ViewObject().AccountListData().length; i++) {
                var accountObject = this.ViewObject().AccountListData()[i];
                // find the currently selected account
                if (accountItemId == accountObject.PropertyId().toString()) {
                    var accountCustomFields = accountObject.ReadTokens();
                    for (j = 0; j < accountCustomFields.length; j++) {
                        var splitField = accountCustomFields[j].split('|');
                        if (splitField.length > 2) {
                            var fieldInternalName = splitField[1];
                            var fieldDisplayName = splitField[2];
                            if (splitField[0] == "true") {
                                requiredFields.push(fieldInternalName);
                            }
                            displayNames[fieldInternalName] = fieldDisplayName;
                        }
                    }
                }
            }

            for (i = 0; i < BrightCove.BCApp.Pages.PageData.VideosListFields.length; i++) {
                var videoListField = BrightCove.BCApp.Pages.PageData.VideosListFields[i];
                var videoListFieldInternalName = videoListField.name.replace(customPrefix, "");
                var videoListFieldDisplayName = videoListFieldInternalName

                var fieldExists = $(customFieldsContainer).find('#custom' + videoListField.internalname).length > 0;
                if (!fieldExists) {
                    if (displayNames[videoListFieldInternalName] != null) {
                        videoListFieldDisplayName = displayNames[videoListFieldInternalName];
                    }
                    var isRequired = $.inArray(videoListFieldInternalName, requiredFields) > -1;
                    var customFieldLabel = $("<label/>").text(videoListFieldDisplayName);
                    if (isRequired) {
                        $(customFieldLabel).attr('class', 'required');
                    }
                    var customFieldInput = $("<input/>")
                        .attr('id', 'custom' + videoListField.internalname)
                        .attr('name', 'custom' + videoListField.internalname)
                        .attr('class', 'form-control' + (isRequired ? " validate" : ""));

                    $(customFieldInput).attr('data-internal', videoListFieldInternalName);

                    var customFieldDesc = $('<span class="customfield-desc" style="margin-left:175px;float: left;"></span>');

                    $(customFieldsContainer)
                        .append(customFieldLabel)
                        .append(customFieldInput)
                        .append(customFieldDesc);
                }
            }
        },
        PopulateDataForCustomFields: function (videoData, useInternalNames) {
            // add customfields to the page
            var accountItemId = $('#ddlSelectAccount option:selected').data('item-id');
            if (accountItemId == null || accountItemId == '') {
                accountItemId = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
            }
            var customPrefix = 'c.' + accountItemId + '.';
            var customFieldsContainer = $('#customFields');

            for (i = 0; i < BrightCove.BCApp.Pages.PageData.VideosListFields.length; i++) {
                var videoListField = BrightCove.BCApp.Pages.PageData.VideosListFields[i];
                var fieldPropertyName = videoListField.name.replace(customPrefix, "");
                var fieldInternalName = videoListField.internalname;
                var customFieldInput = $('#custom' + fieldInternalName);

                if (useInternalNames) {
                    if (videoData.CustomFields[fieldInternalName] != null) {
                        $(customFieldInput).val(videoData.CustomFields[fieldInternalName]);
                    }
                } else {
                    if (videoData.CustomFields[fieldPropertyName] != null) {
                        $(customFieldInput).val(videoData.CustomFields[fieldPropertyName]);
                    }
                }
            }
        },
        successCallback: function () {
            this.d.resolve(this);
        },
        failCallback: function() {
            this.d.reject("something bad happened");
        },
        PageLoad: function () {
            var p = this.getList();
            p.done(function (result) {

                try {
                    var accountItemId = $('#ddlSelectAccount option:selected').data('item-id');
                    if (accountItemId == null) {
                        accountItemId = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
                    }

                    var videoId = BrightCove.BCApp.Utilities.GetQueryStringParameter('vid');
                    var brightcoveVideoId = BrightCove.BCApp.Utilities.GetQueryStringParameter('bcvid');
                    if (accountItemId == null && 
                        videoId == null && 
                        brightcoveVideoId == null && 
                        !BrightCove.BCApp.Pages.PageData.AccountSelectBound) {

                        // add video - bind account selection
                        $('#ddlSelectAccount').change({ obj: result.ob }, function (event) {
                            BrightCove.BCApp.Pages.PageData.LoadedCustomProperties = false;
                            BrightCove.BCApp.Pages.PageData.VideosListFields = [];
                            BrightCove.BCApp.Pages.PageData.AccountSelectBound = false;
                            // clear customfields
                            $('#customFields').empty();
                            // clear token
                            BrightCove.BCApp.Utilities.DeleteCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);

                            // alert(event.data.msg);
                            //.bind('change', { param: this }, function () {
                            var me = event.data.obj;

                            me.PageLoad();
                        });

                        BrightCove.BCApp.Pages.PageData.AccountSelectBound = true;
                        return;
                    }

                    var customPrefix = 'c.' + accountItemId + '.';
                    var fieldEnumerator = result.VideoListFields.getEnumerator();
                    while (fieldEnumerator.moveNext()) {
                        var oField = fieldEnumerator.get_current();
                        var fieldName = oField.get_title()
                        var customFieldPrefixIndex = fieldName.indexOf(customPrefix);
                        var isCustomField = customFieldPrefixIndex == 0;

                        if (isCustomField) {
                            var fieldInternalName = oField.get_internalName();
                            var fieldType = oField.get_fieldTypeKind();
                            var fieldId = oField.get_id().toString().replace(/-/g, '');

                            var customFieldData = {
                                name: fieldName,
                                internalname: fieldInternalName,
                                type: fieldType,
                                id: fieldId
                            }

                            BrightCove.BCApp.Pages.PageData.VideosListFields.push(customFieldData);
                        }
                    }

                    BrightCove.BCApp.Pages.AddVideos.AddCustomFields();
                    var vid = BrightCove.BCApp.Utilities.GetQueryStringParameter('bcvid');
                    var spvidid = BrightCove.BCApp.Utilities.GetQueryStringParameter('vid');
                    var acc = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
                    var isAdd = (vid == null && spvidid == null && acc == null);

                    setTimeout(
                        function () {
                            if (!BrightCove.BCApp.Pages.PageData.LoadedCustomProperties) {
                                
                                if (BrightCove.BCApp.Pages.PageData.BrightcoveVideoData != null) {
                                    BrightCove.BCApp.Pages.AddVideos.PopulateDataForCustomFields(BrightCove.BCApp.Pages.PageData.BrightcoveVideoData);
                                    BrightCove.BCApp.Pages.AddVideos.showCustomFieldDropdowns();
                                } else if (isAdd) {
                                    BrightCove.BCApp.Pages.AddVideos.showCustomFieldDropdowns();
                                }
                                var selectedAccountId = $('#ddlSelectAccount option:selected').data('item-id');
                                if (selectedAccountId != '') {
                                    BrightCove.BCApp.Pages.PageData.LoadedCustomProperties = true;
                                    var vid = BrightCove.BCApp.Utilities.GetQueryStringParameter('bcvid');
                                    var spvidid = BrightCove.BCApp.Utilities.GetQueryStringParameter('vid');
                                    if (vid > 0 && spvidid == null)
                                    {
                                        $('.formContent').find('input,textarea,select').prop("disabled", true);
                                        $('.formContent').find('#btnSave').prop("disabled", false);
                                    }
                                }
                            }
                        }
                    , 1000);
                    
                }
                catch (err) {
                    console.log(err);
                }

                result.ob.onAfterListFieldsQuery();

            });
            p.fail(function (result) {
                // result is a string because that is what we passed to reject()!
                var error = result;
                console.log(error);
            });
        },
        showCustomFieldDropdowns: function (){
            
            var currentAccount = $('#ddlSelectAccount option:selected');
            if (currentAccount.length == 0 || $(currentAccount).val() == "") {
                return;
            }
            var account = new BrightCove.BCApp.DataStructures.AccountData();
            account.AccountId = $(currentAccount).val();
            account.ClientId = $(currentAccount).data('client-id');
            account.ClientSecret = $(currentAccount).data('client-secret');

            // call custom fields
            BrightCove.BCApp.BrightCoveUtilities.CustomFieldUtilities.GetList(account, function (data) {
                var disableField = false;
                var vid = BrightCove.BCApp.Utilities.GetQueryStringParameter('bcvid');
                var spvidid = BrightCove.BCApp.Utilities.GetQueryStringParameter('vid');
                if (vid > 0 && spvidid == null) {
                    disableField = true;
                }

                for (i = 0; i < data.custom_fields.length; i++) {
                    
                    var customField = data.custom_fields[i];
                    // name
                    var customInteralFieldName = customField.id;

                    // name
                    var customFieldName = customField.display_name;

                    // desc
                    var customFieldDesc = (customField.description != null ? customField.description : "");
                    var customFieldDescSpan = $('<span class="customfield-desc" style="margin-left:175px;float: left;">' + customFieldDesc + '</span>');

                    // required
                    var customFieldRequired = (customField.required ? "Yes" : "No");

                    // type
                    var isEnum = customField.type == "enum";

                    var formField = $('#customFields input[data-internal="' + customInteralFieldName + '"]');

                    if ($(formField).length > 0) {
                        var processed = $(formField).attr('processed');
                        if (processed)
                        {
                            continue;
                        }
                        if (isEnum) {
                            var formFieldId = $(formField).attr('id') + '_select';
                            var formFieldName = $(formField).attr('name') + '_select';
                            var formFieldData = $(formField).data('internal');
                            var formFieldValue = $(formField).val();
                            var selectList = '<select id="' + formFieldId + '" name="' + formFieldName + '" data-internal="' + formFieldData + '" ' + (disableField ? "disabled" : "") + ' class="form-control">';
                            for (var j = 0; j < customField.enum_values.length; j++) {
                                selectList += '<option>' + customField.enum_values[j] + '</option>';
                            }
                            selectList += '</select>';
                            $(formField).after(selectList);
                            $(formField).attr('processed', 'true');
                            $(formField).hide();
                            $('#' + formFieldId).val(formFieldValue);
                            $('#' + formFieldId).change(function () {

                                var thisFieldId = $(this).attr('id');
                                var relatedFieldId = thisFieldId.substring(0, thisFieldId.length - '_select'.length);
                                $('#' + relatedFieldId).val(this.value);
                            });
                            //$('#' + formFieldId).after(customFieldDescSpan);
                            // set desc
                            $('#' + formFieldId).next().text(customFieldDesc);
                        } else {
                            // set desc
                            $(formField).next().text(customFieldDesc);
                        }
                    }
                }
            });

        },
        getList: function () {
            this.d = $.Deferred();
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var videoList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            this.VideoListFields = videoList.get_fields();

            cContext.load(this.VideoListFields);

            var o = { d: this.d, VideoListFields: this.VideoListFields , ob: this};

            cContext.executeQueryAsync(
                Function.createDelegate(o, o.ob.successCallback),
                Function.createDelegate(o, o.ob.failCallback)
            );

            return this.d.promise();
        },
        onAfterListFieldsQuery: function() {
            

            SPContext.ViewObject(this);
            this.LoadData();
            //this.CreateFormTag();
            //this.CreateFormTag('create_thumb_image');
            //this.CreateFormTag('create_still_image');

            $('#txtStartDate').datepicker();
            $('#txtEndDate').datepicker();
            $('#txtDateRecorded').datepicker();
            $('#txtPublishedDate').datepicker();
            $('#txtExpirationDate').datepicker();
            $('#chkAlways').change(function () {
                if ($(this).is(":checked")) {
                    $('#txtStartDate').prop('disabled', true);
                    $('#txtEndDate').prop('disabled', true);
                }
                else {
                    $('#txtStartDate').prop('disabled', false);
                    $('#txtEndDate').prop('disabled', false);
                }
            });

            $("#create_thumb_image #videoFile").change(function () {
                var fileName = $(this).val();
                if (fileName != null && fileName != "") {
                    $("#videoThumbLabel").addClass("required");
                    $("#videoStillLabel").addClass("required");
                } else {
                    $("#videoThumbLabel").removeClass("required");
                    $("#videoStillLabel").removeClass("required");
                }
            });
            $("#create_still_image #videoFile").change(function () {
                var fileName = $(this).val();
                if (fileName != null && fileName != "") {
                    $("#videoThumbLabel").addClass("required");
                    $("#videoStillLabel").addClass("required");
                } else {
                    $("#videoThumbLabel").removeClass("required");
                    $("#videoStillLabel").removeClass("required");
                }
            });

            BrightCove.BCApp.Utilities.PreventEnterKeyPostBack("#standardFields input:text");
            //BrightCove.BCApp.Utilities.PreventQuotes();
        },
        UploadVideo: function () {
            form = document.getElementById("create_video_sample");
            buildRequest(form);
            form.action = document.getElementById("yourAPILocation").value;
            form.submit();
        },
        UpdateVideo: function () {
            form = document.getElementById("update_video_sample");
            buildJSONRequest();
            form.action = document.getElementById("yourAPILocation").value;
            form.submit();
        },
        LoadData: function (selector) {
            var elem = $(selector);
            var videoData = new BrightCove.BCApp.DataStructures.VideoData();

            if (window.location.search.indexOf('&vid') > 0) {
                // sharepointupdate
                var newVData = new BrightCove.BCApp.DataStructures.VideoData();
                BrightCove.BCApp.Utilities.SetAddVideBreadCrumb('edit');
                $('#videoFileLabel, #create_video').hide();
                $('#create_video #videoFile').removeClass('validate');
                $('#videoFile').remove();
                $('#referenceIdLabel,#txtRefereneId,#createdDateLabel,#txtCreatedDate,#dateModifiedLabel,#txtDateModified').show();
                $(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNSelector).find('a').each(function () {
                    if($(this).data('id') == 'AddVideos.aspx') {
                        $(this).text('Edit Video');
                    }
                });
                
                if ($.isEmptyObject(SPContext.DataStore2) || SPContext.DataStore2.VideoID == undefined) {
                    var vid = BrightCove.BCApp.Utilities.GetQueryStringParameter('vid');
                    BrightCove.BCApp.SharePoint.ListUtilities.GetVideoById(vid);
                    return;
                }

                //to be removed
                //Use meaningful data-store for the app
                videoData = SPContext.DataStore2;

                var viewData = this.ViewObject();

                newVData.Account = '';
                newVData.SPID = '';
                newVData.VideoID = '';
                newVData.VideoTitle = '';
                newVData.VideoThumbNail = '';
                newVData.VideoStillImage = '';
                newVData.VideoLongDescription = '';
                newVData.VideoShortDescription = '';
                newVData.RelatedLink = '';
                newVData.RelatedLinkText = '';
                newVData.ReferenceID = '';
                newVData.Keywords = '';
                newVData.VideoStartDate = '';
                newVData.VideoEndDate = '';
                newVData.Active = '';
                newVData.Economics = '';
                newVData.CustomFields = [];
                BrightCove.BCApp.Utilities.BindData(viewData);
                viewData.VideoData(ko.mapping.fromJS(ko.mapping.toJS(newVData)));

                viewData.VideoData().Account(videoData.Account);
                viewData.VideoData().SPID(videoData.SPID);
                viewData.VideoData().VideoID(videoData.VideoID);
                viewData.VideoData().VideoTitle(videoData.VideoTitle);
                viewData.VideoData().VideoThumbNail(videoData.VideoThumbNail);
                viewData.VideoData().VideoStillImage(videoData.VideoStillImage);
                viewData.VideoData().VideoLongDescription(videoData.VideoLongDescription);
                viewData.VideoData().VideoShortDescription(videoData.VideoShortDescription);
                viewData.VideoData().RelatedLink(videoData.RelatedLink);
                viewData.VideoData().RelatedLinkText(videoData.RelatedLinkText);
                viewData.VideoData().ReferenceID(videoData.ReferenceID);
                viewData.VideoData().Keywords(videoData.Keywords);
                viewData.VideoData().VideoStartDate(videoData.VideoStartDate);
                viewData.VideoData().VideoEndDate(videoData.VideoEndDate);
                viewData.VideoData().Active(videoData.Active);
                viewData.VideoData().Economics(videoData.Economics);
                viewData.VideoData().CustomFields = videoData.CustomFields;
                viewData.VideoData().TextTracks = videoData.TextTracks;

                BrightCove.BCApp.Pages.PageData.BrightcoveVideoData = viewData.VideoData();
                BrightCove.BCApp.Pages.AddVideos.PopulateDataForCustomFields(BrightCove.BCApp.Pages.PageData.BrightcoveVideoData, true);
                this.SetSelectedDisabledAccount();
                
                BrightCove.BCApp.Pages.AddVideos.showCustomFieldDropdowns();

                // get text tracks
                if (!BrightCove.BCApp.Pages.PageData.LoadedTextTracks) {
                    BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideoByID(videoData.ReferenceID, 
                        function (videoData, currentObject) {
                            if (videoData != null) {
                                var textTracks = videoData.TextTracks
                                BrightCove.BCApp.Utilities.AddTextTrackRows(textTracks);
                                BrightCove.BCApp.Pages.PageData.LoadedTextTracks = true;
                                
                                var textTracksObject = ko.mapping.fromJS(ko.mapping.toJS(textTracks))
                                currentObject.ViewObject().VideoData().TextTracks = textTracksObject;
                            }
                        }, this);
                }

                return;

            }
            else if (window.location.search.indexOf('&bcvid') > 0) {
                // brightcoveimport
                BrightCove.BCApp.Utilities.SetAddVideBreadCrumb('edit');
                $('#videoFileLabel, #create_video').hide();
                $('#create_video #videoFile').removeClass('validate');
                $('#videoFile').remove();
                $('#referenceIdLabel,#txtRefereneId,#createdDateLabel,#txtCreatedDate,#dateModifiedLabel,#txtDateModified').show();
                $(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNSelector).find('a').each(function () {
                    if ($(this).data('id') == 'AddVideos.aspx') {
                        $(this).text('Add Video From Brightcove');
                    }
                });
                //get token
                
                var vid = BrightCove.BCApp.Utilities.GetQueryStringParameter('bcvid');
                var acc = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');

                BrightCove.BCApp.Utilities.BindData(SPContext.ViewObject().ViewObject());

                var accountData = BrightCove.BCApp.Utilities.GetAccountByID(acc, SPContext.ViewObject().ViewObject().AccountListData())
                var readToken = BrightCove.BCApp.Utilities.ReadAccountToken(accountData);
                
                BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByID(vid, readToken,
                    function (vData) {
                    var viewData = SPContext.ViewObject().ViewObject();
                    
                    if (vData != null && vData.length > 0) {
                        videoData.Account = vData[0].Account;
                        videoData.VideoID = 0;
                        videoData.SPID = BrightCove.BCApp.Utilities.CreateBCGuid(1, vData[0].VideoTitle);
                        videoData.ReferenceID = vData[0].ReferenceID;
                        videoData.VideoTitle = vData[0].VideoTitle;
                        videoData.VideoThumbNail = vData[0].VideoThumbNail;
                        videoData.VideoStillImage = vData[0].VideoStillImage;
                        videoData.VideoLongDescription = (vData[0].VideoLongDescription != null) ? vData[0].VideoLongDescription : '';
                        videoData.VideoShortDescription = (vData[0].VideoShortDescription != null) ? vData[0].VideoShortDescription : '';
                        videoData.RelatedLink = (vData[0].RelatedLink != null) ? vData[0].RelatedLink : '';
                        videoData.RelatedLinkText = (vData[0].RelatedLinkText != null) ? vData[0].RelatedLinkText : '';
                        videoData.Keywords = (vData[0].Keywords != null) ? vData[0].Keywords : '';
                        videoData.CustomFields = vData[0].CustomFields;
                        videoData.TextTracks = vData[0].TextTracks;
                        videoData.VideoStartDate = (vData[0].VideoStartDate != null && vData[0].VideoStartDate != 'Invalid Date') ? vData[0].VideoStartDate : '';
                        videoData.VideoEndDate = (vData[0].VideoEndDate != null && vData[0].VideoEndDate != 'Invalid Date') ? vData[0].VideoEndDate : '';
                        videoData.Active = vData[0].Active;
                        videoData.Economics = vData[0].Economics;
                    }

                    viewData.VideoData(ko.mapping.fromJS(ko.mapping.toJS(videoData)));
                    SPContext.ViewObject().SetSelectedDisabledAccount();

                    BrightCove.BCApp.Pages.PageData.BrightcoveVideoData = videoData;
                }, null);

                return;
            }
            else {
                // brightcoveupload
                videoData.Account = '';
                videoData.SPID = BrightCove.BCApp.Utilities.CreateBCGuid(1, 'New Video Item');
                videoData.VideoID = -1;
                videoData.VideoTitle = '';
                videoData.VideoThumbNail = '';
                videoData.VideoStillImage = '';
                videoData.VideoLongDescription = '';
                videoData.VideoShortDescription = '';
                videoData.RelatedLink = '';
                videoData.RelatedLinkText = '';
                videoData.ReferenceID = '';
                videoData.Keywords = '';
                videoData.VideoStartDate = '';
                videoData.VideoEndDate = '';
                videoData.Active = 'ACTIVE';
                videoData.Economics = 'FREE';

                SPContext.DataStore2 = videoData;
            }

            var viewData = this.ViewObject();
            BrightCove.BCApp.Utilities.BindData(viewData);

            viewData.VideoData(ko.mapping.fromJS(ko.mapping.toJS(videoData)));

            this.SetSelectedDisabledAccount();
            //viewData.FilterVideosByCurrentAccount();
        },
        ViewObject: function () {
            if (this._instance == null) {
                this._instance = new BrightCove.BCApp.ViewModels.AddVideosViewModel();
            }
            return this._instance;
        },
        CreateFormTag: function (formName) {
            //Create the embedded form tag in JScript since SharePoint strips all embedded form tags from the app
            if (formName == null) {
                formName = "create_video";
            }
            var nme = $("#" + formName);
            var newMe = $("<form>");

            for (var i = 0; i < nme[0].attributes.length; i++) {
                var myAttr = nme[0].attributes[i].nodeName;
                var myAttrVal = nme[0].attributes[i].value;
                newMe.attr(myAttr, myAttrVal);
            }
            newMe.html(nme.html());
            nme.replaceWith(newMe);
        },
        SetSelectedDisabledAccount: function () {
            if (window.location.search.indexOf('&account=') > 0) {
                var account = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
                //var selectedVal = $('#ddlSelectAccount > option[data-item-id="' + account + '"]').val();

                $('#ddlSelectAccount option:selected').attr("selected", null);
                $('#ddlSelectAccount > option[data-item-id="' + account + '"]').attr("selected", "selected");


                $('#ddlSelectAccount').attr('disabled', 'disabled');
            }
        }
    },
    ManageVideos: {
        PageLoad: function (param1, param2) {
            SPContext.ViewObject(this);
            this.SearchEvent();
            BrightCove.BCApp.SharePoint.ListUtilities.GetListItem(
                BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            BrightCove.BCApp.Utilities.AddEnterKeyEventToButton('input#searchBox', '.searchButton > button');
        },
        LoadData: function (selector) {
            var elem = $(selector);
            
            var viewData = this.ViewObject();
            var bindingApplied = !!ko.dataFor(document.body);
            if (!bindingApplied) {
                BrightCove.BCApp.Utilities.BindData(viewData);
            }
        },
        ViewObject: function () {
            if (this._instance == null) {
                this._instance = new BrightCove.BCApp.ViewModels.ManageVideosViewModel();
            }
            return this._instance;
        },
        SearchEvent: function () {
            $("#searchBox").keyup(function (event) {
                event.stopPropagation();
                event.preventDefault();
                return false;

                //if (event.keyCode == 13) {
                //    alert('caught!');
                //    $('#searchButton').click();
                //    return false;
                //}
            });
        }
    },
    ManagePlayLists: {
        PageLoad: function (param1, param2) {
            SPContext.ViewObject(this);
            //this.CreateFormTag();

            //BrightCove.BCApp.SharePoint.ListUtilities.GetSPVideos(
            //    function () {
                    SPContext.ViewObject().LoadData();
            //    });
        },
        ViewObject: function () {
            if (this._instance == null) {
                this._instance = new BrightCove.BCApp.ViewModels.ManagePlaylistsViewModel();
            }
            return this._instance;
        },
        LoadData: function (selector) {

            var elem = $(selector);
            var viewData = this.ViewObject();

            var readToken = '';

            //alert('length is: ' + alert(viewData.AccountListData().length));
            if (viewData.AccountListData().length > 0)
            {
                for(var i = 0; i < viewData.AccountListData().length; i++)
                {
                    readToken = viewData.GetReadToken(viewData.AccountListData()[i]);
                    if (readToken.length > 0) {
                        break;
                    }
                }
            }

            //get the videos from the sp context
            //playListData = SPContext.DataStore2;
            var bindingApplied = !!ko.dataFor(document.body);
            if (!bindingApplied) {
                BrightCove.BCApp.Utilities.BindData(viewData);
            }

            viewData.AddClickEventsToPage();
        },
        CreateFormTag: function () {
            //Create the embedded form tag in JScript since SharePoint strips all embedded form tags from the app

            var nme = $("#create_playlist");
            var newMe = $("<form>");

            if (nme != null && nme.length > 0) {
                var attributeLength = (nme[0].attributes != null ? nme[0].attributes.length : 0);
                for (var i = 0; i < attributeLength; i++) {
                    var myAttr = nme[0].attributes[i].nodeName;
                    var myAttrVal = nme[0].attributes[i].value;
                    newMe.attr(myAttr, myAttrVal);
                }
                newMe.html(nme.html());
                nme.replaceWith(newMe);
            }
        }
    },
    Default: {
        PageLoad: function (param1, param2) {
            //_spBodyOnLoadFunctionNames.push("BrightCove.BCApp.Installer.CheckLists");
            BrightCove.BCApp.Installer.CheckLists();
            
        }
    },
    Installer: {
        PageLoad: function (param1, param2) {
        }
    }
};

//**************************************************************************************************
//Page View Models Functions
//**************************************************************************************************  
BrightCove.BCApp.ViewModels = {
    AccountSelectViewModel: function () {
        var me = this;

        /*************************************************************/
        /*View Model Observables*/
        /*************************************************************/
        me.AccountListData = ko.observableArray([]);
        me.CurrentAccount = ko.observable(BrightCove.BCApp.DataStructures.AccountData);

        //Values for the modal windows
        me.CurrentModalTitleString = ko.observable('Test Title');
        me.CurrentModalValueString = ko.observable('Test Value');
        me.CurrentModalValueDescription = ko.observable('Test Value');

        //Values for token modals
        me.CurrentEditingProperty = ko.observable();
        me.CurrentTokenIndexProperty = ko.observable();
        me.CurrentReadTokens = ko.observableArray([]);

        /*************************************************************/
        /*Account UI Functions*/
        /*************************************************************/
        me.AddItem = function (item) {
            me.AccountListData.push(item);
        };
        me.DeleteItem = function (itemid) {
            if (itemid == null || itemid.length < 1)
                return false;
            me.AccountListData.remove(function (item) {
                return item.PropertyId() == itemid;
            });
        };
        //Returns an observable item from the array
        me.GetItem = function (itemid) {
            if (itemid.length < 1)
                return item;

            var match = ko.utils.arrayFirst(me.AccountListData(), function (item) {
                return item.PropertyId() === itemid;
            });

            if (match) {
                var cloneObj = ko.mapping.fromJS(ko.mapping.toJS(match));
                me.CurrentAccount(cloneObj);

                //me.CurrentReadTokens(cloneObj.ReadTokens());
                me.CurrentReadTokens(ko.mapping.toJS(cloneObj.ReadTokens()));
                return match;
            }
            return null;
        };
        me.ShowPropModal = function (ViewData, Event) {
            $('.modal-body input').show();
            $('#temporaryStorageLocationSelect').hide();

            $('.NameField > button').removeAttr('style');

            //Verify which element invoked the click event, and set the corresponding titles/values for the modal dialog
            var element = $(Event.currentTarget);
            var fieldType = element.data('field-type');
            var description = element.parent().parent().find('td:last').html()
            me.CurrentModalValueDescription(description);

            me.CurrentEditingProperty(fieldType);

            if (me.CurrentAccount().PropertyId == null) {
                me.CurrentModalTitleString('Account Name');
                switch (fieldType) {
                    case 'AccountName':
                        me.CurrentModalTitleString('Account Name');
                        me.CurrentModalValueString('');
                        break;
                    case 'VideoPlayerId':
                        me.CurrentModalTitleString('Video Player Id');
                        me.CurrentModalValueString('');
                        break;
                    case 'PlayListId':
                        me.CurrentModalTitleString('PlayList Id');
                        me.CurrentModalValueString('');
                        break;
                    case 'TemporaryStorageLocation':
                        $('.modal-body input').hide();
                        $('#temporaryStorageLocationSelect').show();
                        me.CurrentModalTitleString('Temporary Storage Location');
                        me.CurrentModalValueString('');
                        break;
                    case 'AWSAccessKeyId':
                        me.CurrentModalTitleString('AWS Access Key Id');
                        me.CurrentModalValueString('');
                        break;
                    case 'AWSSecretAccessKey':
                        me.CurrentModalTitleString('AWS Secret Access Key');
                        me.CurrentModalValueString('');
                        break;
                    case 'AWSBucketName':
                        me.CurrentModalTitleString('AWS Bucket Name');
                        me.CurrentModalValueString('');
                        break;
                    case 'DropboxAccessToken':
                        me.CurrentModalTitleString('Dropbox Access Token');
                        me.CurrentModalValueString('');
                        break;
                    case 'AccountId':
                        me.CurrentModalTitleString('Account Id');
                        me.CurrentModalValueString('');
                        break;
                    case 'ClientId':
                        me.CurrentModalTitleString('Client Id');
                        me.CurrentModalValueString('');
                        break;
                    case 'ClientSecret':
                        me.CurrentModalTitleString('Client Secret');
                        me.CurrentModalValueString('');
                        break;
                }
            }
            else {
                switch (fieldType) {
                    case 'AccountName':
                        me.CurrentModalTitleString('Account Name');
                        me.CurrentModalValueString(me.CurrentAccount().PropertyName());
                        break;
                    case 'VideoPlayerId':
                        me.CurrentModalTitleString('Video Player Id');
                        me.CurrentModalValueString(me.CurrentAccount().DefaultVideoPlayerId());
                        break;
                    case 'PlayListId':
                        me.CurrentModalTitleString('PlayList Id');
                        me.CurrentModalValueString(me.CurrentAccount().DefaultPlaylistPlayerId());
                        break;
                    case 'TemporaryStorageLocation':
                        $('.modal-body input').hide();
                        $('#temporaryStorageLocationSelect').show();
                        $('#temporaryStorageLocationSelect').val(me.CurrentAccount().TemporaryStorageLocation());
                        me.CurrentModalTitleString('Temporary Storage Location');
                        me.CurrentModalValueString(me.CurrentAccount().TemporaryStorageLocation());
                        break;
                    case 'AWSAccessKeyId':
                        me.CurrentModalTitleString('AWS Access Key Id');
                        me.CurrentModalValueString(me.CurrentAccount().AWSAccessKeyId());
                        break;
                    case 'AWSSecretAccessKey':
                        me.CurrentModalTitleString('AWS Secret Access Key');
                        me.CurrentModalValueString(me.CurrentAccount().AWSSecretAccessKey());
                        break;
                    case 'AWSBucketName':
                        me.CurrentModalTitleString('AWS Bucket Name');
                        me.CurrentModalValueString(me.CurrentAccount().AWSBucketName());
                        break;
                    case 'DropboxAccessToken':
                        me.CurrentModalTitleString('Dropbox Access Token');
                        me.CurrentModalValueString(me.CurrentAccount().DropboxAccessToken());
                        break;
                    case 'AccountId':
                        me.CurrentModalTitleString('Account Id');
                        me.CurrentModalValueString(me.CurrentAccount().AccountId());
                        break;
                    case 'ClientId':
                        me.CurrentModalTitleString('Client Id');
                        me.CurrentModalValueString(me.CurrentAccount().ClientId());
                        break;
                    case 'ClientSecret':
                        me.CurrentModalTitleString('Client Secret');
                        me.CurrentModalValueString(me.CurrentAccount().ClientSecret());
                        break;
                }
            }
            $(BrightCove.BCApp.Constants.AppSelectorConstant.SinglePropertyEditSelector).modal('show');
        };

        /*************************************************************/
        /*Token Functions*/
        /*************************************************************/
        me.ShowCustomFieldsModal = function (ViewData, Event) {
            var element = $(Event.currentTarget);
            var itemIndex = element.data('item-index');
            me.CurrentModalTitleString('Edit Custom Fields');

            $('.NameField > button').removeAttr('style');
            $('#deleteToken').show();

            if (itemIndex != null && itemIndex != undefined && itemIndex > -1)
                me.CurrentTokenIndexProperty(itemIndex);
            
            //Verify which element invoked the click event, and set the corresponding titles/values for the modal dialog
            if (me.CurrentTokenIndexProperty() == -1) {
                $('#deleteToken').hide();
                me.CurrentModalValueString('');
                $('#TokenPropertyModal .modal-body > input').val('New Token');
            } else {
                me.CurrentModalValueString(element.text().trim());
            }

            $('#TokenPropertyModal .modal-body > input').val(element.text().trim());
            $('#TokenTypeSelect').val(element.data('token-type'));
            $(BrightCove.BCApp.Constants.AppSelectorConstant.TokenEditSelector).modal('show');
        };
        me.EditFields = function (ViewData, Event) {
            // clear token
            BrightCove.BCApp.Utilities.DeleteCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);

            var account = new BrightCove.BCApp.DataStructures.AccountData();
            account.AccountId = me.CurrentAccount().AccountId();
            account.ClientId = me.CurrentAccount().ClientId();
            account.ClientSecret = me.CurrentAccount().ClientSecret();

            // validate
            if (account.AccountId == '' || account.ClientId == '' || account.ClientSecret == '') {
                BrightCove.BCApp.Utilities.ShowError('To obtain custom fields, you need to enter in the Account Id, Client Id, and Client Secret.');
                return;
            }

            // call custom fields
            BrightCove.BCApp.BrightCoveUtilities.CustomFieldUtilities.GetList(account, function (data) {
                var selectedFields = [];
                var selectedFieldRows = $('#AccountTokensTbl td div');
                for (i = 0; i < selectedFieldRows.length; i++) {
                    var fieldNameValue = $(selectedFieldRows[i]).data('token-type');
                    var fieldNameSplit = fieldNameValue.split('|');
                    var fieldName = $(selectedFieldRows[i]).data('token-type');
                    if (fieldNameSplit.length > 1)
                    {
                        fieldName = fieldNameSplit[1];
                    }
                    selectedFields.push(fieldName);
                }
                var $tableBody = $('#CustomFieldsTbl').find("tbody");
                // remove rows
                $tableBody.empty();

                for (i = 0; i < data.custom_fields.length; i++) {
                    var customField = data.custom_fields[i];
                    // name
                    var customInteralFieldName = customField.id;

                    // name
                    var customFieldName = customField.display_name;

                    // type
                    var customFieldType = (customField.type == "enum" ? "List" : "Text");

                    // required
                    var customFieldRequired = (customField.required ? "Yes" : "No");

                    // selected
                    var isSelected = $.inArray(customInteralFieldName, selectedFields) > -1;
                    var customFieldSelected = '<input type="checkbox" value="' + customFieldName + '" data-field="' + customInteralFieldName + '" ' + (isSelected ? " checked " : "") + ' data-required="' + customField.required.toString() + '" data-display-name="' + customFieldName + '" />';

                    // add to table
                    $tableBody
                        .append($('<tr>')
                            .append($('<td>')
                                .append(customFieldName)
                            )
                            .append($('<td>')
                                .append(customFieldType)
                            )
                            .append($('<td>')
                                .append(customFieldRequired)
                            )
                            .append($('<td>')
                                .append(customFieldSelected)
                            )
                    );
                }
            });

            me.CurrentTokenIndexProperty(-1);
            me.ShowCustomFieldsModal(ViewData, Event);
        };
        me.SaveCustomFieldsChange = function () {

            me.CurrentReadTokens([])

            var customFields = $('#TokenPropertyModal input');
            for (i = 0; i < customFields.length; i++) {
                var customField = customFields[i];
                if (customField.checked) {

                    var fieldInternal = $(customField).data("field");
                    var fieldName = $(customField).data("display-name");
                    var fieldRequired = $(customField).data("required");

                    me.CurrentTokenIndexProperty(0);

                    var cloneObj = ko.mapping.fromJS(ko.mapping.toJS(me.CurrentReadTokens()));
                    cloneObj().push(fieldRequired + "|" + fieldInternal + "|" + fieldName);
                    me.CurrentReadTokens(cloneObj());
                }
            }
            //var val = $('#TokenPropertyModal .modal-body > input').val();
            //var fullVal = $('#TokenTypeSelect option:selected').val()
            //    + '-' + $('#TokenPropertyModal .modal-body > input').val();

            //if (me.CurrentTokenIndexProperty() == -1) {

                //me.CurrentTokenIndexProperty(0);

                //var cloneObj = ko.mapping.fromJS(ko.mapping.toJS(me.CurrentReadTokens()));
                //cloneObj().push(fullVal);
                //me.CurrentReadTokens(cloneObj());

                //$('#AccountTokensTbl tr.tokenData:last > td:eq(1)')
                //    .html($('#TokenTypeSelect option:selected').text());
            //}
            //else {
            //    //var item = me.CurrentAccount().ReadTokens();
            //    me.CurrentReadTokens()[me.CurrentTokenIndexProperty()] = fullVal;
            //    $('#AccountTokensTbl tr.tokenData:eq(' + me.CurrentTokenIndexProperty()
            //        + ') > td:eq(0) > button > span').html(val);
            //    $('#AccountTokensTbl tr.tokenData:eq(' + me.CurrentTokenIndexProperty()
            //        + ') > td:eq(1)').html($('#TokenTypeSelect option:selected').text());
            //}
            $(BrightCove.BCApp.Constants.AppSelectorConstant.TokenEditSelector).modal('hide');
        };
        me.DeleteToken = function () {
            if (me.CurrentTokenIndexProperty() > -1) {
                me.CurrentReadTokens().splice(me.CurrentTokenIndexProperty(), 1);
                var cloneObj = ko.mapping.fromJS(ko.mapping.toJS(me.CurrentReadTokens()));
                me.CurrentReadTokens(cloneObj());

                me.CurrentTokenIndexProperty(-1);
            }

            $(BrightCove.BCApp.Constants.AppSelectorConstant.TokenEditSelector).modal('hide');
        };
        me.FormatToken = function (param) {
            return BrightCove.BCApp.Utilities.StripBCToken(param);
        };
        me.FormatTokenType = function (param) {
            return BrightCove.BCApp.Utilities.StripBCTokenType(param);
        };
        me.FormatCustomFieldName = function (param) {
            var returnValue = '';
            if (param) {
                var valueSplit = param.split('|');
                if (valueSplit.length > 2) {
                    returnValue = valueSplit[2];
                }
            }
            return returnValue;
        };
        me.FormatCustomFieldRequired = function (param) {
            var returnValue = '';
            if (param){
                var valueSplit = param.split('|');
                if (valueSplit.length > 1) {
                    returnValue = (valueSplit[0] == "true" ? "Yes" : "No");
                }
            }
            return returnValue;
        };

        /*************************************************************/
        /*Modal Window Functions*/
        /*************************************************************/
        me.ShowGroupsPropModal = function (ViewData, Event) {
            $('.NameField > button').removeAttr('style');

            var element = $(Event.currentTarget);
            me.CurrentModalTitleString('Edit Group');
            var fieldType = element.data('field-type');

            switch (fieldType) {
                case 'AuthorsGroup':
                    me.CurrentEditingProperty(fieldType);
                    $('#AuthorsGroupSelect').val(me.CurrentAccount().AccountAuthorsGroupName());
                    me.CurrentModalValueString(me.CurrentAccount().AccountAuthorsGroupName());
                    break;
                case 'ViewersGroup':
                    me.CurrentEditingProperty(fieldType);
                    $('#AuthorsGroupSelect').val(me.CurrentAccount().AccountViewersGroupName());
                    me.CurrentModalValueString(me.CurrentAccount().AccountViewersGroupName());
                    break;
            }

            $(BrightCove.BCApp.Constants.AppSelectorConstant.AccountGroupEditSelector).modal('show');
        };
        me.SaveGroupsPropModal = function (ViewData, Event) {
            var val = $('#AuthorsGroupSelect option:selected').val();
            me.CurrentModalValueString(val);
            switch (me.CurrentEditingProperty()) {
                case 'AuthorsGroup':
                    me.CurrentAccount().AccountAuthorsGroupName(val);

                    break;
                case 'ViewersGroup':
                    me.CurrentAccount().AccountViewersGroupName(val);
                    break;
            }

            $(BrightCove.BCApp.Constants.AppSelectorConstant.AccountGroupEditSelector).modal('hide');
        };
        me.CancelEdits = function () {
            $(BrightCove.BCApp.Constants.AppSelectorConstant.CancelEditAccount).trigger('click');
        };
        me.SaveSinglePropertyChange = function () {

            if (me.CurrentAccount().PropertyName == null) {
                var newData = new BrightCove.BCApp.DataStructures.AccountData();
                newData.PropertyName = 'New Item';
                newData.PropertyId = '';
                newData.AccountAuthorsGroup = '';
                newData.AccountViewersGroup = '';
                newData.AccountAuthorsGroupName = '';
                newData.AccountViewersGroupName = '';
                newData.DefaultVideoPlayerId = '';
                newData.DefaultPlaylistPlayerId = '';
                newData.TemporaryStorageLocation = '';
                newData.AWSAccessKeyId = '';
                newData.AWSSecretAccessKey = '';
                newData.AWSBucketName = '';
                newData.DropboxAccessToken = '';
                newData.AccountId = '';
                newData.ClientId = '';
                newData.ClientSecret = '';
                newData.ReadTokens = [];
                newData.WriteTokens = [];

                var newObj = ko.mapping.fromJS(newData);
                me.CurrentAccount(newObj);
            }

            switch (me.CurrentEditingProperty()) {
                case 'AccountName':
                    me.CurrentAccount().PropertyName(me.CurrentModalValueString());
                    break;
                case 'VideoPlayerId':
                    me.CurrentAccount().DefaultVideoPlayerId(me.CurrentModalValueString());
                    break;
                case 'PlayListId':
                    me.CurrentAccount().DefaultPlaylistPlayerId(me.CurrentModalValueString());
                    break;
                case 'TemporaryStorageLocation':
                    // get value from dropdown
                    $('#temporaryStorageLocationSelect').hide();
                    $('.modal-body input').show();
                    var selectedValue = $('#temporaryStorageLocationSelect').val();
                    me.CurrentAccount().TemporaryStorageLocation(selectedValue);
                    break;
                case 'AWSAccessKeyId':
                    me.CurrentAccount().AWSAccessKeyId(me.CurrentModalValueString());
                    break;
                case 'AWSSecretAccessKey':
                    me.CurrentAccount().AWSSecretAccessKey(me.CurrentModalValueString());
                    break;
                case 'AWSBucketName':
                    me.CurrentAccount().AWSBucketName(me.CurrentModalValueString());
                    break;
                case 'DropboxAccessToken':
                    me.CurrentAccount().DropboxAccessToken(me.CurrentModalValueString());
                    break;
                case 'AccountId':
                    me.CurrentAccount().AccountId(me.CurrentModalValueString());
                    break;
                case 'ClientId':
                    me.CurrentAccount().ClientId(me.CurrentModalValueString());
                    break;
                case 'ClientSecret':
                    me.CurrentAccount().ClientSecret(me.CurrentModalValueString());
                    break;
            }

            //alert('Item saved - SaveSinglePropertyChange');
            $(BrightCove.BCApp.Constants.AppSelectorConstant.SinglePropertyEditSelector).modal('hide');
        };

        /*************************************************************/
        /*SP Crud Functions*/
        /*************************************************************/
        me.AddGroupData = function () {
            me.CurrentTokenIndexProperty(-1);
            me.CurrentModalValueString('');
            me.ShowCustomFieldsModal();
        };
        me.AddAccount = function (ViewData, Event) {
            var element = $(Event.currentTarget).children('a#AddAccountBtn').trigger('click');
        };
        me.SaveAccountChanges = function () {
            var r = confirm("Are you sure that the changes should be saved?");
            if (!r) {
                return;
            }

            var match = ko.utils.arrayFirst(me.AccountListData(), function (item) {
                return item.PropertyId() === me.CurrentAccount().PropertyId();
            });

            if (me.CurrentAccount().PropertyName() == null || me.CurrentAccount().PropertyName().length < 1) {
                alert('Please ensure that an account name has been added before saving the information');
                $('.NameField > button').attr('style', 'background-color:red');
                return false;
            }

            $('.NameField > button').removeAttr('style');

            if (match) {
                match.PropertyName(me.CurrentAccount().PropertyName());
                match.AccountAuthorsGroup(me.CurrentAccount().AccountAuthorsGroup());
                match.AccountViewersGroup(me.CurrentAccount().AccountViewersGroup());
                match.AccountAuthorsGroupName(me.CurrentAccount().AccountAuthorsGroupName());
                match.AccountViewersGroupName(me.CurrentAccount().AccountViewersGroupName());
                match.DefaultVideoPlayerId(me.CurrentAccount().DefaultVideoPlayerId());
                match.DefaultPlaylistPlayerId(me.CurrentAccount().DefaultPlaylistPlayerId());
                match.TemporaryStorageLocation(me.CurrentAccount().TemporaryStorageLocation());
                match.AWSAccessKeyId(me.CurrentAccount().AWSAccessKeyId());
                match.AWSSecretAccessKey(me.CurrentAccount().AWSSecretAccessKey());
                match.AWSBucketName(me.CurrentAccount().AWSBucketName());
                match.DropboxAccessToken(me.CurrentAccount().DropboxAccessToken());
                match.AccountId(me.CurrentAccount().AccountId());
                match.ClientId(me.CurrentAccount().ClientId());
                match.ClientSecret(me.CurrentAccount().ClientSecret());
                match.ReadTokens(me.CurrentReadTokens());
                match.WriteTokens(me.CurrentAccount().WriteTokens());

                me.CurrentAccount().ReadTokens(me.CurrentReadTokens());

                BrightCove.BCApp.SharePoint.ListUtilities.UpdateListItem(me.CurrentAccount());
            }
            else {
                me.CurrentAccount().PropertyId(BrightCove.BCApp.Utilities.CreateGuid(me.CurrentAccount().PropertyName()));
                me.AccountListData.push(me.CurrentAccount());

                me.CurrentAccount().ReadTokens(me.CurrentReadTokens());

                BrightCove.BCApp.SharePoint.ListUtilities.AddAccountItem(me.CurrentAccount());
            }

            $(BrightCove.BCApp.Constants.AppSelectorConstant.CancelEditAccount).trigger('click');
        };
        me.DeleteAccount = function () {
            var r = confirm("This account will be permanently deleted. Are you sure you want to proceed?");
            if (!r) {
                return;
            }
            BrightCove.BCApp.SharePoint.ListUtilities.DeleteListItem(me.CurrentAccount());
            me.DeleteItem(me.CurrentAccount().PropertyId());
            $(BrightCove.BCApp.Constants.AppSelectorConstant.CancelEditAccount).trigger('click');
        };

        /*************************************************************/
        /*Data Binding Functions*/
        /*************************************************************/
        var returnData = BrightCove.BCApp.SharePoint.ListUtilities.GetAccounts(
            BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);

        ko.mapping.fromJSON(returnData, {}, me);
    },
    AddVideosViewModel: function () {
        var me = this;
        var writeToken = '';
        
        /*************************************************************/
        /*View Model Observables*/
        /*************************************************************/
        me.AccountListData = ko.observableArray([]);
        me.VideoData = ko.observable(BrightCove.BCApp.DataStructures.VideoData);
        me.CurrentAccount = ko.observable(BrightCove.BCApp.DataStructures.AccountData);

        /*************************************************************/
        /*SharePoint Doc Library Upload Functions*/
        /*************************************************************/
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function (e) {
            if (window.location.search.indexOf('&vid') > 0 || window.location.search.indexOf('&bcvid') > 0) {
                overlayMessage('Updated Brightcove.');

                thumbnailImageUrl.resolve(me.VideoData().VideoStillImage());
                stillImageUrl.resolve(me.VideoData().VideoThumbNail());
                BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(BrightCove.BCApp.Pages.AddVideos.ViewObject().VideoData());
                return;
            }
            if (e != null && e.data != null) {
                var reply = $.parseJSON(e.data);
                if (reply != null) {
                    var videoId = reply.result;

                    var actionType = "";
                    var readToken = me.GetReadToken(me.CurrentAccount());
                    var stillImageFile = $('#create_still_image').find('input[type=file]').val() != "";
                    var thumbnailImageFile = $('#create_thumb_image').find('input[type=file]').val() != "";
                    if (reply.result != null) actionType = reply.result["type"];

                    if (actionType == "THUMBNAIL") {
                        haveUploadedThumb = true;
                    }
                    if (actionType == "VIDEO_STILL") {
                        haveUploadedStill = true;
                    }

                    if (!haveUploadedThumb && !haveUploadedStill && typeof obtainedBCVideo == 'function' && uploadedVideoId == '') {
                        if (videoId != '' && videoId != null) {
                            uploadedVideoId = videoId;
                            overlayMessage('Video is uploaded.');
                        }
                        else
                        {
                            showOverlayToolbar();
                            alert('There was an issue adding the video to Brightcove.');
                            return;
                        }

                        if (!thumbnailImageFile) {
                            haveUploadedThumb = true;
                            overlayMessage('Thumbnail is being processed.');
                        }

                        if (!stillImageFile) {
                            haveUploadedStill = true;
                            overlayMessage('Still image is being processed.');
                        }
                    }

                    

                    if (haveUploadedStill && haveUploadedThumb) {
                        BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByIDPoll(uploadedVideoId, readToken);
                    }
                    else if (actionType != ''){
                        if (!haveUploadedThumb) {
                            setTimeout(obtainedBCVideo(uploadedVideoId, 'THUMBNAIL'), 500);
                        }

                        if (!haveUploadedStill) {
                            setTimeout(obtainedBCVideo(uploadedVideoId, 'VIDEO_STILL'), 500);
                        }
                    }
                    else {
                        if (!haveUploadedThumb) {
                            setTimeout(obtainedBCVideo(uploadedVideoId, 'THUMBNAIL'), 3000);
                        }

                        if (!haveUploadedStill) {
                            setTimeout(obtainedBCVideo(uploadedVideoId, 'VIDEO_STILL'), 3000);
                        }
                    }
                }
            }
        }, false);
        me.ValidateForm = function () {
            //Run through validation
            var cont = true;
            var multiUpload = BrightCove.BCApp.Utilities.IsMultipleUpload();

            //Validate the link url format
            var link = me.VideoData().RelatedLink();
            var linkText = me.VideoData().RelatedLinkText();
            if (link != null && link.length > 0
                && !BrightCove.BCApp.Utilities.ValidateURLFormat(link)) {
                $('#txtRelatedLinkURL').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidUrlMessage());
                return false;
            }
            if (link != null && link.length > 0 && linkText != null && linkText.length < 1) {
                $('#txtRelatedLinkText').addClass('notValid');
                $('#txtRelatedLinkURL').removeClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidUrlMessage());
                return false;
            } else if (linkText != null && linkText.length > 0 && link != null && link.length < 1) {
                $('#txtRelatedLinkURL').addClass('notValid');
                $('#txtRelatedLinkText').removeClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidUrlMessage());
                return false;
            }

            // start & end date
            var startDate = me.VideoData().VideoStartDate();
            var endDate = me.VideoData().VideoEndDate();

            if (startDate.length > 0) {
                if (endDate.length > 0) {
                    var sd = new Date(startDate);
                    var ed = new Date(endDate);

                    if (ed < sd) {
                        $('#txtEndDate').addClass('notValid');
                        $('#txtStartDate').addClass('notValid');
                        alert(BrightCove.BCApp.Messaging.ValidationInvalidDateRange());
                        return false;
                    }
                }
            }

            if (endDate.length > 0) {
                $('#txtStartDate').removeClass('notValid');
                var sd = new Date();
                var ed = new Date(endDate);

                if (ed < sd) {
                    $('#txtEndDate').addClass('notValid');
                    alert(BrightCove.BCApp.Messaging.ValidationInvalidDateRange());
                    return false;
                }
            }

            if (!multiUpload && $('#txtName').val().indexOf('"') > -1 || $('#txtName').val().indexOf('\'') > -1) {
                $('#txtName').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
                return false;
            } 

            if (!multiUpload && $('#txtShortDescription').val().indexOf('"') > -1 || $('#txtShortDescription').val().indexOf('\'') > -1) {
                $('#txtShortDescription').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
                return false;
            } else if (multiUpload) {
                $('#txtShortDescription').val('');
            }

            if (!multiUpload && $('#txtRelatedLinkURL').val().indexOf('"') > -1) {
                $('#txtRelatedLinkURL').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
                return false;
            }

            //if ($('#txtRelatedLinkText').val().indexOf('"') > -1) {
            //    $('#txtRelatedLinkText').addClass('notValid');
            //    alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
            //    return false;
            //}

            if ($('#brightcoveTags').val().indexOf('"') > -1) {
                $('#brightcoveTags').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
                return false;
            }

            var options = $('#sampleMut > option:selected');

            var stillImageValue = $('#create_still_image input[type=file]').val();
            var thumbImageValue = $('#create_thumb_image input[type=file]').val();

            if (stillImageValue != "" || thumbImageValue != "") {
                if (!(stillImageValue != "" && thumbImageValue != "")) {
                    alert(BrightCove.BCApp.Messaging.ValidationImageUploadMessage());
                    return false;
                }
            }

            $('#ctl00_PlaceHolderMain_txtLongDescription').removeClass('notValid');
            $('#txtShortDescription').removeClass('notValid');
            $('#txtName').removeClass('notValid');
            $('#brightcoveTags').removeClass('notValid');
            $('#ddlCommChannel').removeClass('notValid');

            $('#txtStartDate').removeClass('notValid');
            $('#txtEndDate').removeClass('notValid');
            $('#txtRelatedLinkURL').removeClass('notValid');
            $('#txtRelatedLinkText').removeClass('notValid');

            //Validate the images and video input fields
            var vid = (me.VideoData().VideoID != undefined) ? me.VideoData().VideoID() : 0;
            var refId = (me.VideoData().ReferenceID != undefined) ? me.VideoData().ReferenceID() : 0;

            if (vid != null && vid != undefined && vid > 0) {
                $('#videoStill').removeClass('validate');
                $('#create_thumb_image #videoFile').removeClass('validate');
            }

            var textTrackUploadMode = $("input:radio[name=texttrackfiletype]:checked").val();
            switch (textTrackUploadMode) {
                case "none":
                    // move on
                    break;
                case "file":
                    // check file and lang
                    var textTrackFile = $('#textTrackFile').val();
                    var textTrackLangProp = $('#txtTextTrackPropLang').val();

                    if (textTrackFile != "") {
                        alert(BrightCove.BCApp.Messaging.ValidationtextTrackUploadMessage());
                        return false;
                    }
                    break;
                case "url":
                case "remote":
                    // check url and lang
                    var textTrackUrl = $('#textTrackUrl').val();
                    var textTrackLangProp = $('#txtTextTrackPropLang').val();
                    // if either is filled, then fail validation to proceed
                    if (textTrackUrl != "") {
                        alert(BrightCove.BCApp.Messaging.ValidationtextTrackUploadMessage());
                        return false;
                    }
                    break;
            }

            $('.validate').each(function () {
                var val = $(this).val();
                var fieldId = $(this).attr('id');
                var fieldAllowedForMultiUpload = multiUpload &&
                    (fieldId == 'txtName' || fieldId == 'txtShortDescription');
                // validate multiple files
                //if (multiUpload && fieldId.indexOf("videoFile") == 0) {
                //    // check that there are at least one file selected.
                //    var selectedFileCount = $('#create_video #videoFile_list div.MultiFile-label').length;
                //    if (selectedFileCount == 0) {
                //        $(this).addClass('notValid');
                //        cont = false;
                //    } else {
                //        $(this).removeClass('notValid');
                //    }
                //} else {
                    if (!fieldAllowedForMultiUpload && (val != null && val.length < 1)) {
                        $(this).addClass('notValid');
                        cont = false;
                    }
                    else {
                        $(this).removeClass('notValid');
                    }
                //}
            });

            if (!cont) {
                alert(BrightCove.BCApp.Messaging.ValidationFailedMessage());
                return false;
            }

            return true;
        };
        me.DetermineMode = function () {
            var mode = '';
            var vid = (me.VideoData().VideoID != undefined) ? me.VideoData().VideoID() : 0;
            var refId = (me.VideoData().ReferenceID != undefined) ? me.VideoData().ReferenceID() : 0;

            if (vid == 0 && refId > 0) {
                mode = 'brightcoveimport';
            } else if (
                (vid == 0 && refId == 0) ||
                (vid == -1 && refId == '')
                ) {
                mode = 'brightcoveupload';
            } else if (vid > 0 && refId > 0) {
                mode = 'sharepointupdate';
            }
            return mode;
        };

        // Change account


        //  Dropbox GetFileUrl
        me.GetDropboxFileUrl = function (filePath, createLink) {
            var req = this;
            req.filePath = filePath;

            var dropboxLinkApiUrl = 'https://api.dropboxapi.com/2/files/get_temporary_link';
            var payload = {
                path: filePath
            };
            var isTextTrackFile = filePath.endsWith('.vtt');
            if (isTextTrackFile)
            {
                //  cannot use the temp link
                //  as the ingest API has issue with it
                var doNotCreateLink = (createLink != null && createLink == false);
                if (doNotCreateLink) {
                    // just get the existing
                    dropboxLinkApiUrl = 'https://api.dropboxapi.com/2/sharing/get_shared_links';
                } else {
                    //  create a link
                    dropboxLinkApiUrl = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';
                    payload["settings"] = {
                        "requested_visibility": "public"
                    }
                }
            }

            var dropboxToken = me.CurrentAccount().DropboxAccessToken();
            var xhr = new XMLHttpRequest();
            xhr["FilePath"] = filePath;
            xhr["CreateLink"] = createLink;
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var fileInfo = JSON.parse(xhr.response);
                    // Upload succeeded.
                    var exitingLink = (xhr["CreateLink"] == false);
                    var fileName = '';
                    var fileLocation = fileInfo["link"];
                    if (exitingLink) {
                        var filePath = xhr["FilePath"].toLowerCase();

                        for (var i = 0; i < fileInfo.links.length; i++) {
                            var sharedLink = fileInfo.links[i];
                            var sharedLinkPath = sharedLink.path;

                            if (filePath.toLowerCase() == sharedLinkPath.toLowerCase()) {
                                var pathSegments = sharedLinkPath.split("/");
                                fileName = pathSegments[pathSegments.length - 1];
                                fileLocation = sharedLink.url.replace('?dl=0', '?dl=1');
                            }
                        }
                    } else{
                        if (fileInfo["metadata"] != null) {
                            fileName = fileInfo["metadata"]["name"];
                        }
                        if (fileName == '') {
                            fileName = fileInfo["name"];
                        }
                    
                        if (fileLocation == null && fileInfo["url"] != null) {
                            fileLocation = fileInfo["url"].replace('?dl=0', '?dl=1');
                        }
                    }

                    BrightCove.BCApp.Pages.PageData.UploadList.push({});
                    BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["filename"] = fileName;
                    BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["url"] = fileLocation;

                    overlayMessage("File uploaded to Dropbox: " + fileLocation + "...");
                    overlayMessage("Calling Brightcove ingestion API...");

                    var obj = BrightCove.BCApp.Pages.PageData.CurrentObject;
                    var isTextTrack = fileName.endsWith('.vtt');
                    if (isTextTrack) {
                        // associate text track
                        // to added video
                        var textTrackRows = $('#TextTrackFilesTbl tr');
                        // we start on the second row 
                        // first is labels
                        for (var i = 1; i < textTrackRows.length; i++) {
                            var thisRow = textTrackRows[i];
                            var isProcessed = $(thisRow).data('processed');
                            if (!isProcessed) {
                                //var inputField = $(thisRow).find('input:file');
                                //var inputFieldId = $(inputField).attr('id');
                                //var fileChooser = document.getElementById(inputFieldId);
                                //var fileMatch = (fileChooser.files[0].name == fileName);
                                //if (fileMatch) {

                                var textTrackLabel = $(thisRow).data('label');
                                var textTrackLang = $(thisRow).data('lang');
                                var textTrackKind = $(thisRow).data('kind');
                                var textTrackType = $(thisRow).data('type');

                                if (textTrackType == 'file') {
                                    BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["language"] = textTrackLang;
                                    BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["label"] = textTrackLabel;
                                    BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["kind"] = textTrackKind;
                                    $(thisRow).data('processed', true);
                                    break;
                                }

                            }
                        }


                        obj.IngestTextTrack();
                    } else {
                        // provision the BC video Id
                        obj.CreateVideoObject();
                    }

                }
                else {
                    var errorMessage = xhr.response || 'Unable to get file link';
                    var linkAlreadyExists = (errorMessage.indexOf("shared_link_already_exists/.") > -1);
                    if (linkAlreadyExists) {
                        var filePath = xhr["FilePath"];
                        var obj = BrightCove.BCApp.Pages.PageData.CurrentObject;
                        obj.GetDropboxFileUrl(filePath, false);
                    } else {
                        overlayMessage("Error: " + errorMessage);
                        showOverlayToolbar();
                    }
                }
            };

            xhr.open('POST', dropboxLinkApiUrl);
            xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(payload));
        }

        // brightcoveupload
        me.BrightCoveUpload = function () {
            BrightCove.BCApp.Pages.PageData.CurrentObject = this;
            me.VideoData().CustomFields = BrightCove.BCApp.Utilities.GetCustomFields();

            // get upload type
            var uploadType = me.CurrentAccount().TemporaryStorageLocation();

            switch (uploadType.toLowerCase()) {
                case "dropbox":
                    overlayMessage('Initiating upload to Dropbox...');

                    // obtain data
                    var dropboxToken = me.CurrentAccount().DropboxAccessToken();

                    // configure Dropxox

                    overlayMessageUpdate("Uploading :: 0%");

                    var file = BrightCove.BCApp.Utilities.GetNextFile();
                    if (file) {
                        var xhr = new XMLHttpRequest();

                        xhr.upload.onprogress = function (evt) {
                            var percentComplete = parseInt(100.0 * evt.loaded / evt.total);
                            overlayMessageUpdate("Uploading " + file.name + ":: " + percentComplete + '%');
                        };

                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                var fileInfo = JSON.parse(xhr.response);
                                // Upload succeeded.
                                var filePath = fileInfo.path_lower;
                                var obj = BrightCove.BCApp.Pages.PageData.CurrentObject;

                                obj.GetDropboxFileUrl(filePath);
                            }
                            else {
                                var errorMessage = xhr.response || 'Unable to upload file';
                                overlayMessage("Error!!! " + errorMessage);
                                showOverlayToolbar();
                            }
                        };

                        xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload');
                        xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
                        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
                        xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
                            path: '/public/' + file.name,
                            mode: 'add',
                            autorename: true,
                            mute: false
                        }));

                        xhr.send(file);
                    } // no else; file is checked by this time
                    break;
                case "aws":
                    overlayMessage('Initiating upload to AWS...');

                    // obtain data
                    var accessKeyId = me.CurrentAccount().AWSAccessKeyId();
                    var secretAccessKey = me.CurrentAccount().AWSSecretAccessKey();
                    var bucketName = me.CurrentAccount().AWSBucketName();

                    // configure AWS
                    AWS.config.update({
                        accessKeyId: accessKeyId,
                        secretAccessKey: secretAccessKey
                    });

                    overlayMessageUpdate("Uploading :: 0%");

                    var bucket = new AWS.S3({ params: { Bucket: bucketName } });

                    // get next file
                    var file = BrightCove.BCApp.Utilities.GetNextFile();
                    if (file) {
                        var params = { Key: file.name, ContentType: file.type, Body: file };
                        bucket.upload(params).on('httpUploadProgress', function (evt) {

                            overlayMessageUpdate("Uploading " + file.name + ":: " + parseInt((evt.loaded * 100) / evt.total) + '%');

                        }).send(function (err, data) {

                            if (err == null) {
                                // Upload succeeded.
                                var fileLocation = data.Location.replace(/\+/g, '%20');

                                BrightCove.BCApp.Pages.PageData.UploadList.push({});
                                BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["filename"] = file.name;
                                BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["url"] = fileLocation;

                                overlayMessage("File uploaded to AWS: " + data.Location + "...");
                                overlayMessage("Calling Brightcove ingestion API...");

                                var obj = BrightCove.BCApp.Pages.PageData.CurrentObject;
                                
                                var isTextTrack = file.name.endsWith('.vtt');
                                if (isTextTrack) {
                                    // associate text track
                                    // to added video
                                    var textTrackRows = $('#TextTrackFilesTbl tr');
                                    // we start on the second row 
                                    // first is labels
                                    for (var i = 1; i < textTrackRows.length; i++) {
                                        var thisRow = textTrackRows[i];
                                        var isProcessed = $(thisRow).data('processed');
                                        if (!isProcessed) {
                                            //var inputField = $(thisRow).find('input:file');
                                            //var inputFieldId = $(inputField).attr('id');
                                            //var fileChooser = document.getElementById(inputFieldId);
                                            //var fileMatch = (fileChooser.files[0].name == file.name);
                                            //if (fileMatch) {

                                            var textTrackLabel = $(thisRow).data('label');
                                            var textTrackLang = $(thisRow).data('lang');
                                            var textTrackKind = $(thisRow).data('kind');
                                            var textTrackType = $(thisRow).data('type');

                                            if (textTrackType == 'file') {
                                                BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["language"] = textTrackLang;
                                                BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["label"] = textTrackLabel;
                                                BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["kind"] = textTrackKind;
                                                $(thisRow).data('processed', true);
                                                break;
                                            }
                                                
                                        }
                                    }
                                    
                                    obj.IngestTextTrack();
                                } else {
                                    // provision the BC video Id
                                    obj.CreateVideoObject();
                                }
                            } else {
                                var errorMsg = "Error: " + err.code + " : " + err.message;
                                overlayMessage(errorMsg);
                                showOverlayToolbar();
                            }

                        });
                    } // no else; file is checked by this time

                    break;
            }

            //BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData(), function (oListItem) {
            //    //var spvid = oListItem.get_id();
            //    //me.VideoData().VideoID(spvid);
            //    overlayMessage('SharePoint video updated...');

            //    // update brightcove video
            //    me.UpdateBrightcoveVideoData();
            //});
        };
        me.IngestTextTrackUrls = function () {
            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var account = new BrightCove.BCApp.DataStructures.AccountData();
            account.AccountId = me.CurrentAccount().AccountId();
            account.ClientId = me.CurrentAccount().ClientId();
            account.ClientSecret = me.CurrentAccount().ClientSecret();

            BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                    account,
                    me.IngestTextTrackUrlsInner,
                    arguments);
        };
        me.IngestTextTrackUrlsInner = function () {
            
            var textTrackUrls = BrightCove.BCApp.Utilities.GetTextTrackUrls();
            if (textTrackUrls.length == 0) {
                overlayMessage('No text track urls to add...');
                overlayMessage('Complete');
                switch (BrightCove.BCApp.Pages.PageData.CurrentMode) {
                    case 'brightcoveimport':
                        $('.addTitle').hide();
                        $('.formContent').hide();
                        $('#reload').show();
                        $('#reload h4').text('Item has been successfully imported.');
                        break;
                    case 'brightcoveupload':
                        $('.addTitle').hide();
                        $('.formContent').hide();
                        $('#reload').show();
                        break;
                    case 'sharepointupdate':
                        $('.addTitle').hide();
                        $('.formContent').hide();
                        $('#reload').show();
                        $('#reload a').hide();
                        $('#reload h4').text('Item has been successfully updated.');
                        break;
                }
                showOverlayToolbar();
                return;
            }
            overlayMessage('Calling Brightcove dynamic ingestion...');

            var account_id = '';
            var video_id = me.VideoData().ReferenceID()

            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var textTrackInfo = BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]

            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.IngestAPIURL + 'v1/accounts/' + account_id + '/videos/' + video_id + '/ingest-requests';
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            var ingestData = {
                "text_tracks": []
            };

            // grab the first
            //for (var i = 0; i < textTrackUrls.length; i++) {
                var textTrackUrl = textTrackUrls[0];
                
                var textTrackIngest = {
                    "url": textTrackUrl.url,
                    "srclang": textTrackUrl.language,
                    "kind": textTrackUrl.kind,
                    "default": false
                };

                if (textTrackUrl.label != null && textTrackUrl.label != '')
                {
                    textTrackIngest["label"] = textTrackUrl.label;
                }

                ingestData.text_tracks.push(textTrackIngest);

                // mark processed
                var textTrackRow = $('#TextTrackFilesTbl tr')[textTrackUrl.index];
                if (textTrackRow != null){
                    $(textTrackRow).data('processed', true);
                }
            //}

            var dataString = JSON.stringify(ingestData);

            $.ajax({
                url: apiUrl,
                method: 'POST',
                data: dataString,
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    overlayMessage('Text track ingested.');
                    var textTrackUrls = BrightCove.BCApp.Utilities.GetTextTrackUrls();
                    if (textTrackUrls.length > 0) {
                        me.IngestTextTrackUrls();
                    } else {
                        overlayMessage('Operation completed successfully. You may close this dialog box.');
                        switch (BrightCove.BCApp.Pages.PageData.CurrentMode) {
                            case 'brightcoveimport':
                                $('.addTitle').hide();
                                $('.formContent').hide();
                                $('#reload').show();
                                $('#reload h4').text('Item has been successfully imported.');
                                break;
                            case 'brightcoveupload':
                                $('.addTitle').hide();
                                $('.formContent').hide();
                                $('#reload').show();
                                break;
                            case 'sharepointupdate':
                                $('.addTitle').hide();
                                $('.formContent').hide();
                                $('#reload').show();
                                $('#reload a').hide();
                                $('#reload h4').text('Item has been successfully updated.');
                                break;
                        }
                        showOverlayToolbar();
                    }
                },
                error: function (e) {
                    showOverlayToolbar();
                    var detailedErrorMsg = 'Brightcove error: ' + e.responseJSON[0].error_code + ': ' + e.responseJSON[0].message;
                    overlayMessage(detailedErrorMsg);

                    var errorMsg = 'Error calling Brightcove dynamic ingestion...cannot proceed.';
                    overlayMessage(errorMsg);
                }
            });
        };
        me.IngestTextTrack = function () {
            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var account = new BrightCove.BCApp.DataStructures.AccountData();
            account.AccountId = me.CurrentAccount().AccountId();
            account.ClientId = me.CurrentAccount().ClientId();
            account.ClientSecret = me.CurrentAccount().ClientSecret();

            BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                    account,
                    me.IngestTextTrackInner,
                    arguments);
        };
        me.IngestTextTrackInner = function () {
            overlayMessage('Calling Brightcove dynamic ingestion...');

            var account_id = '';
            var video_id = me.VideoData().ReferenceID()

            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var textTrackInfo = BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]

            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.IngestAPIURL + 'v1/accounts/' + account_id + '/videos/' + video_id + '/ingest-requests';
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            var ingestData = {
                "text_tracks": [
                    {
                        "url": encodeURI(textTrackInfo["url"]),
                        "srclang": textTrackInfo["language"],
                        "kind": textTrackInfo["kind"],
                        "default": false
                    }
                ]
            }

            if (textTrackInfo["label"] != null && textTrackInfo["label"] != '') {
                ingestData.text_tracks[0]["label"] = textTrackInfo["label"];
            }

            var dataString = JSON.stringify(ingestData);

            $.ajax({
                url: apiUrl,
                method: 'POST',
                data: dataString,
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    overlayMessage('Text track ingested...');

                    // if another file, add
                    var file = BrightCove.BCApp.Utilities.GetNextFile();
                    if (file) {
                        me.BrightCoveUpload();
                    } else {
                        var hasTextTrackUrls = BrightCove.BCApp.Utilities.HasTextTrackUrls();
                        if (hasTextTrackUrls) {
                            me.IngestTextTrackUrls();
                        } else {
                            overlayMessage('Operation completed successfully. You may close this dialog box.');
                            switch (BrightCove.BCApp.Pages.PageData.CurrentMode) {
                                case 'brightcoveimport':
                                    $('.addTitle').hide();
                                    $('.formContent').hide();
                                    $('#reload').show();
                                    $('#reload h4').text('Item has been successfully imported.');
                                    break;
                                case 'brightcoveupload':
                                    $('.addTitle').hide();
                                    $('.formContent').hide();
                                    $('#reload').show();
                                    break;
                                case 'sharepointupdate':
                                    $('.addTitle').hide();
                                    $('.formContent').hide();
                                    $('#reload').show();
                                    $('#reload a').hide();
                                    $('#reload h4').text('Item has been successfully updated.');
                                    break;
                            }
                            showOverlayToolbar();
                        }
                    }
                },
                error: function (e) {
                    showOverlayToolbar();
                    var detailedErrorMsg = 'Brightcove error: ' + e.responseJSON[0].error_code + ': ' + e.responseJSON[0].message;
                    overlayMessage(detailedErrorMsg);

                    var errorMsg = 'Error calling Brightcove dynamic ingestion...cannot proceed.';
                    overlayMessage(errorMsg);
                }
            });
        };

        me.CreateVideoObject = function () {
            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var account = new BrightCove.BCApp.DataStructures.AccountData();
            account.AccountId = me.CurrentAccount().AccountId();
            account.ClientId = me.CurrentAccount().ClientId();
            account.ClientSecret = me.CurrentAccount().ClientSecret();

            BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                    account,
                    me.CreateVideoObjectInner,
                    arguments);
        };
        me.CreateVideoObjectInner = function () {
            overlayMessage('Creating video object in Brightcove...');

            var account_id = '';
            var account_item_id = '';
            var video_id = me.VideoData().ReferenceID()

            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
                account_item_id = me.CurrentAccount().PropertyId();
            }

            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/videos';
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            
            if (BrightCove.BCApp.Utilities.IsMultipleUpload()) {
                var fileName = BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["filename"];
                me.VideoData().VideoTitle(fileName);
            }
            var videoData = {
                "name": me.VideoData().VideoTitle(),
                "description": me.VideoData().VideoShortDescription(),
                "economics": me.VideoData().Economics(),
                "long_description": me.VideoData().VideoLongDescription(),
                "state": me.VideoData().Active(),
                "tags": BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.GetTagObjectForCMSAPI(me.VideoData().Keywords(), me.VideoData().SPID(), account_item_id),
                "custom_fields": BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.GetCustomFieldsObjectForCMSAPI(),
                "link": {
                    "text": me.VideoData().RelatedLinkText(),
                    "url": me.VideoData().RelatedLink()
                },
                "schedule": {
                    "starts_at": (me.VideoData().VideoStartDate() == null || me.VideoData().VideoStartDate() == '' ? null : BrightCove.BCApp.Utilities.ConvertDateFormat(me.VideoData().VideoStartDate())),
                    "ends_at": (me.VideoData().VideoEndDate() == null || me.VideoData().VideoEndDate() == '' ? null : BrightCove.BCApp.Utilities.ConvertDateFormat(me.VideoData().VideoEndDate()))
                }
            }

            var dataString = JSON.stringify(videoData);

            $.ajax({
                url: apiUrl,
                method: 'POST',
                data: dataString,
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    overlayMessage('Video ' + json.id + ' created in Brightcove...');
                    
                    // get BC video Id
                    if (BrightCove.BCApp.Pages.PageData.UploadList.length == 0) {
                        BrightCove.BCApp.Pages.PageData.UploadList.push({});
                    }
                    BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]["brightcoveid"] = json.id;
                    me.VideoData().ReferenceID(json.id)

                    // call dynamic ingest
                    me.DynamicIngest();
                },
                error: function (e) {
                    showOverlayToolbar();
                    var detailedErrorMsg = 'Brightcove error: ' + e.responseJSON[0].error_code + ': ' + e.responseJSON[0].message;
                    overlayMessage(detailedErrorMsg);

                    var errorMsg = 'Error creating video in Brightcove...cannot proceed.';
                    overlayMessage(errorMsg);
                }
            });
        };
        me.DynamicIngest = function () {
            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var account = new BrightCove.BCApp.DataStructures.AccountData();
            account.AccountId = me.CurrentAccount().AccountId();
            account.ClientId = me.CurrentAccount().ClientId();
            account.ClientSecret = me.CurrentAccount().ClientSecret();

            BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                    account,
                    me.DynamicIngestInner,
                    arguments);
        };
        me.DynamicIngestInner = function () {
            overlayMessage('Calling Brightcove dynamic ingestion...');

            var account_id = '';
            var video_id = me.VideoData().ReferenceID()

            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var videoInfo = BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]

            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.IngestAPIURL + 'v1/accounts/' + account_id + '/videos/' + videoInfo["brightcoveid"] + '/ingest-requests';
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            var ingestData = {
                "master": {
                    "url": videoInfo["url"]
                },
                "profile": "videocloud-default-v1"
            }

            var dataString = JSON.stringify(ingestData);

            $.ajax({
                url: apiUrl,
                method: 'POST',
                data: dataString,
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    overlayMessage('Dynamic ingest called...');

                    // Await images...
                    me.CheckVideoImageStatus();
                },
                error: function (e) {
                    showOverlayToolbar();
                    var detailedErrorMsg = 'Brightcove error: ' + e.responseJSON[0].error_code + ': ' + e.responseJSON[0].message;
                    overlayMessage(detailedErrorMsg);

                    var errorMsg = 'Error calling Brightcove dynamic ingestion...cannot proceed.';
                    overlayMessage(errorMsg);
                }
            });
        };
        me.CheckVideoImageStatus = function () {
            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var account = new BrightCove.BCApp.DataStructures.AccountData();
            account.AccountId = me.CurrentAccount().AccountId();
            account.ClientId = me.CurrentAccount().ClientId();
            account.ClientSecret = me.CurrentAccount().ClientSecret();

            BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                    account,
                    me.CheckVideoImageStatusInner,
                    arguments);
        };
        me.CheckVideoImageStatusInner = function () {
            overlayMessageUpdate('Checking Brightcove ingestion status...');

            var account_id = '';
            var video_id = me.VideoData().ReferenceID();

            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var videoInfo = BrightCove.BCApp.Pages.PageData.UploadList[BrightCove.BCApp.Pages.PageData.UploadList.length - 1]

            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/videos/' + videoInfo["brightcoveid"];
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            
            $.ajax({
                url: apiUrl,
                method: 'GET',
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    var hasThumbnail = (json.images.thumbnail != null && json.images.thumbnail.src != null && json.images.thumbnail.src != '');
                    var hasStill = (json.images.poster != null && json.images.poster.src && json.images.poster.src != '');
                    var ingestionComplete = hasThumbnail && hasStill;

                    if (ingestionComplete) {
                        overlayMessageUpdate('Video images ready...');
                        // add to SP
                        var videoThumb = json.images.thumbnail.src;
                        var videoStill = json.images.poster.src;

                        me.VideoData().VideoThumbNail(videoThumb);
                        me.VideoData().VideoStillImage(videoStill);

                        BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData(), function (oListItem) {
                            overlayMessage('SharePoint updated...');

                            overlayMessage('Video upload complete');

                            // if another file, add
                            var file = BrightCove.BCApp.Utilities.GetNextFile();
                            if (file) {
                                // reset id if not text track
                                var nextFileIsTextTrack = file.name.endsWith('.vtt');
                                if (!nextFileIsTextTrack) {
                                    //Create a unique GUID and append it to the object
                                    me.VideoData().SPID(BrightCove.BCApp.Utilities.CreateBCGuid('1', BrightCove.BCApp.Utilities.GetTagFriendlyFileName(file.name)));
                                }
                                me.BrightCoveUpload();
                            } else {
                                var hasTextTrackUrls = BrightCove.BCApp.Utilities.HasTextTrackUrls();
                                if (hasTextTrackUrls) {
                                    me.IngestTextTrackUrls();
                                } else {
                                    overlayMessage('Operation completed successfully. You may close this dialog box.');
                                    switch (BrightCove.BCApp.Pages.PageData.CurrentMode) {
                                        case 'brightcoveimport':
                                            $('.addTitle').hide();
                                            $('.formContent').hide();
                                            $('#reload').show();
                                            $('#reload h4').text('Item has been successfully imported.');
                                            break;
                                        case 'brightcoveupload':
                                            $('.addTitle').hide();
                                            $('.formContent').hide();
                                            $('#reload').show();
                                            break;
                                        case 'sharepointupdate':
                                            $('.addTitle').hide();
                                            $('.formContent').hide();
                                            $('#reload').show();
                                            $('#reload a').hide();
                                            $('#reload h4').text('Item has been successfully updated.');
                                            break;
                                    }
                                    showOverlayToolbar();
                                }
                            }
                        });
                    } else {
                        overlayMessageUpdate('Awaiting video image updates...');
                        // wait 5s, call again
                        setTimeout(function () {
                            me.CheckVideoImageStatus();
                        }, 5000);
                    }
                },
                error: function (e) {
                    showOverlayToolbar();
                    alert('Error checking Brightcove ingestion status...cannot proceed.'
                        + e.toString());
                }
            });
        };
        // brightcoveupload


        // SharepointUpdate
        me.SharepointUpdate = function () {
            overlayMessage('Updating video in SharePoint...');

            me.VideoData().CustomFields = BrightCove.BCApp.Utilities.GetCustomFields();

            BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData(), function (oListItem) {
                //var spvid = oListItem.get_id();
                //me.VideoData().VideoID(spvid);
                overlayMessage('SharePoint video updated...');

                // update brightcove video
                me.UpdateBrightcoveVideoData();
            });
        };
        me.UpdateBrightcoveVideoData = function () {
            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var account = new BrightCove.BCApp.DataStructures.AccountData();
            account.AccountId = me.CurrentAccount().AccountId();
            account.ClientId = me.CurrentAccount().ClientId();
            account.ClientSecret = me.CurrentAccount().ClientSecret();

            BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                    account,
                    me.UpdateBrightcoveVideoDataInner,
                    arguments);
        };
        me.UpdateBrightcoveVideoDataInner = function (ViewData, Event) {
            overlayMessage('Updating Brightcove data...');

            var account_id = '';
            var account_item_id = '';
            var video_id = me.VideoData().ReferenceID()

            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
                account_item_id = me.CurrentAccount().PropertyId();
            }

            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/videos/' + video_id;
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            var videoData = {
                "name": me.VideoData().VideoTitle(),
                "description": me.VideoData().VideoShortDescription(),
                "economics": me.VideoData().Economics(),
                "long_description": me.VideoData().VideoLongDescription(),
                "state": me.VideoData().Active(),
                "tags": BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.GetTagObjectForCMSAPI(me.VideoData().Keywords(), me.VideoData().SPID(), account_item_id),
                "custom_fields": BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.GetCustomFieldsObjectForCMSAPI(),
                "link": {
                    "text": me.VideoData().RelatedLinkText(),
                    "url": me.VideoData().RelatedLink()
                },
                "schedule":{
                    "starts_at": (me.VideoData().VideoStartDate() == null || me.VideoData().VideoStartDate() == '' ? null : BrightCove.BCApp.Utilities.ConvertDateFormat(me.VideoData().VideoStartDate())),
                    "ends_at": (me.VideoData().VideoEndDate() == null || me.VideoData().VideoEndDate() == '' ? null : BrightCove.BCApp.Utilities.ConvertDateFormat(me.VideoData().VideoEndDate()))
                }
            }
            
            // if there are any deletes
            // update text tracks property
            if (BrightCove.BCApp.Utilities.HasTextTrackDeletes()) {
                // get deleted rows
                var deleteList = BrightCove.BCApp.Utilities.GetTextTrackDeletes();

                if (me.VideoData().TextTracks() != null) {
                    for (var i = 0; i < deleteList.length; i++) {
                        var idToDelete = deleteList[i];
                        for (var j = 0; j < me.VideoData().TextTracks().length; j++) {
                            var thisTextTrack = me.VideoData().TextTracks()[j];
                            var thisTextTrackId = thisTextTrack.id();
                            if (idToDelete == thisTextTrackId) {
                                //remove
                                me.VideoData().TextTracks().splice(j, 1);
                                // then kick out
                                break;
                            }
                        }
                    }
                }
                
                var textTrackIngestList = [];
                for (var i = 0; i < me.VideoData().TextTracks().length; i++) {
                    var thisTextTrack = me.VideoData().TextTracks()[i];
                    var textTrackIngest = {
                        "asset_id": thisTextTrack.asset_id(),
                        "default": thisTextTrack.default(),
                        "id": thisTextTrack.id(),
                        "kind": thisTextTrack.kind(),
                        "label": thisTextTrack.label(),
                        "mime_type": thisTextTrack.mime_type(),
                        "src": thisTextTrack.src(),
                        "srclang": thisTextTrack.srclang()
                    };
                    var sourceList = [];
                    for (var j = 0; j < thisTextTrack.sources().length; j++) {
                        sourceList.push(
                            {
                                "src": thisTextTrack.sources()[j].src()
                            }
                        );
                    }
                    thisTextTrack.sources = sourceList;
                    textTrackIngestList.push(textTrackIngest);
                }

                // set so it updates
                videoData["text_tracks"] = textTrackIngestList;
            }

            var dataString = JSON.stringify(videoData);

            $.ajax({
                url: apiUrl,
                method: 'PATCH',
                data: dataString,
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    overlayMessage('Brightcove data updated...');
                    // overlayMessage('Import complete.');
                    // if another file, add
                    var file = BrightCove.BCApp.Utilities.GetNextFile(true);
                    if (file) {
                        me.BrightCoveUpload();
                    } else {
                        var hasTextTrackUrls = BrightCove.BCApp.Utilities.HasTextTrackUrls();
                        if (hasTextTrackUrls) {
                            me.IngestTextTrackUrls();
                        } else {
                            overlayMessage('Operation completed successfully. You may close this dialog box.');
                            switch (BrightCove.BCApp.Pages.PageData.CurrentMode) {
                                case 'brightcoveimport':
                                    $('.addTitle').hide();
                                    $('.formContent').hide();
                                    $('#reload').show();
                                    $('#reload h4').text('Item has been successfully imported.');
                                    break;
                                case 'brightcoveupload':
                                    $('.addTitle').hide();
                                    $('.formContent').hide();
                                    $('#reload').show();
                                    break;
                                case 'sharepointupdate':
                                    $('.addTitle').hide();
                                    $('.formContent').hide();
                                    $('#reload').show();
                                    $('#reload a').hide();
                                    $('#reload h4').text('Item has been successfully updated.');
                                    break;
                            }
                            showOverlayToolbar();
                        }
                    }
                },
                error: function (e) {
                    showOverlayToolbar();
                    alert('Error retrieving video from Brightcove...cannot proceed with video update. '
                        + e.toString());
                }
            });
        };
        // SharepointUpdate

        // brightcoveImport
        me.BrightcoveImport = function () {
            overlayMessage('Your video is being imported from Brightcove...');
            var account_item_id = $('#ddlSelectAccount option:selected').data('item-id');
            var currentKeywords = me.VideoData().Keywords();
            // add site id to keywords;
            var adjustedKeywords = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.GetTagObjectForCMSAPI(me.VideoData().Keywords(), me.VideoData().SPID(), account_item_id);

            me.VideoData().Keywords(adjustedKeywords.join(','));
            me.VideoData().CustomFields = BrightCove.BCApp.Utilities.GetCustomFields();

            BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData(), function (oListItem) {
                var spvid = oListItem.get_id();
                me.VideoData().VideoID(spvid);
                overlayMessage('Video imported from Brightcove...');

                // showOverlayToolbar();
                // update brightcove video
                me.UpdateBrightcoveVideoReference();
            });
        };
        me.UpdateBrightcoveVideoReference = function () {
            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var account = new BrightCove.BCApp.DataStructures.AccountData();
            account.AccountId = me.CurrentAccount().AccountId();
            account.ClientId = me.CurrentAccount().ClientId();
            account.ClientSecret = me.CurrentAccount().ClientSecret();

            BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                    account,
                    me.UpdateBrightcoveVideoReferenceInner,
                    arguments);
        };
        me.UpdateBrightcoveVideoReferenceInner = function (ViewData, Event) {
            overlayMessage('Updating Brightcove data...');

            var account_id = '';
            var account_item_id = '';
            var video_id = me.VideoData().ReferenceID();

            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
                account_item_id = me.CurrentAccount().PropertyId();
            }
            
            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/videos/' + video_id;
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);

            var videoData = {
                "name": me.VideoData().VideoTitle(),
                "tags": BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.GetTagObjectForCMSAPI(me.VideoData().Keywords(), me.VideoData().SPID(), account_item_id)
            }

            
            // if there are any deletes
            // update text tracks property
            if (BrightCove.BCApp.Utilities.HasTextTrackDeletes()) {
                // get deleted rows
                var deleteList = BrightCove.BCApp.Utilities.GetTextTrackDeletes();

                if (me.VideoData().TextTracks() != null) {
                    for (var i = 0; i < deleteList.length; i++) {
                        var idToDelete = deleteList[i];
                        for (var j = 0; j < me.VideoData().TextTracks().length; j++) {
                            var thisTextTrack = me.VideoData().TextTracks()[j];
                            var thisTextTrackId = thisTextTrack.id();
                            if (idToDelete == thisTextTrackId) {
                                //remove
                                me.VideoData().TextTracks().splice(j, 1);
                                // then kick out
                                break;
                            }
                        }
                    }
                }

                var textTrackIngestList = [];
                for (var i = 0; i < me.VideoData().TextTracks().length; i++) {
                    var thisTextTrack = me.VideoData().TextTracks()[i];
                    var textTrackIngest = {
                        "asset_id": thisTextTrack.asset_id(),
                        "default": thisTextTrack.default(),
                        "id": thisTextTrack.id(),
                        "kind": thisTextTrack.kind(),
                        "label": thisTextTrack.label(),
                        "mime_type": thisTextTrack.mime_type(),
                        "src": thisTextTrack.src(),
                        "srclang": thisTextTrack.srclang()
                    };
                    var sourceList = [];
                    for (var j = 0; j < thisTextTrack.sources().length; j++) {
                        sourceList.push(
                            {
                                "src": thisTextTrack.sources()[j].src()
                            }
                        );
                    }
                    thisTextTrack.sources = sourceList;
                    textTrackIngestList.push(textTrackIngest);
                }

                // set so it updates
                videoData["text_tracks"] = textTrackIngestList;
            }

            var dataString = JSON.stringify(videoData);

            $.ajax({
                url: apiUrl,
                method: 'PATCH',
                data: dataString,
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    overlayMessage('Brightcove data updated...');
                    overlayMessage('Import complete.');

                    // if another file, add
                    var file = BrightCove.BCApp.Utilities.GetNextFile(true);
                    if (file) {
                        me.BrightCoveUpload();
                    } else {
                        var hasTextTrackUrls = BrightCove.BCApp.Utilities.HasTextTrackUrls();
                        if (hasTextTrackUrls) {
                            me.IngestTextTrackUrls();
                        } else {
                            overlayMessage('Operation completed successfully. You may close this dialog box.');
                            switch (BrightCove.BCApp.Pages.PageData.CurrentMode) {
                                case 'brightcoveimport':
                                    $('.addTitle').hide();
                                    $('.formContent').hide();
                                    $('#reload').show();
                                    $('#reload h4').text('Item has been successfully imported.');
                                    break;
                                case 'brightcoveupload':
                                    $('.addTitle').hide();
                                    $('.formContent').hide();
                                    $('#reload').show();
                                    break;
                                case 'sharepointupdate':
                                    $('.addTitle').hide();
                                    $('.formContent').hide();
                                    $('#reload').show();
                                    $('#reload a').hide();
                                    $('#reload h4').text('Item has been successfully updated.');
                                    break;
                            }
                            showOverlayToolbar();
                        }
                    }
                    //// BrightCove.BCApp.Pages.AddVideos.ViewObject().DetermineMode()
                    //showOverlayToolbar();

                    //if (json != null && json.length > 0) {
                        
                    //}
                },
                error: function (e) {
                    showOverlayToolbar();
                    alert('Error retrieving video from Brightcove...cannot proceed with video update. '
                        + e.toString());
                }
            });
        };
        // brightcoveImport

        //
        me.AddVideoSingleTab = function (ViewData, Event) {
            $('.addTitle .addsingle').addClass('tabActive');
            $('.addTitle .addsingle').removeClass('tabInactive');
            $('.addTitle .addmulti').addClass('tabInactive');
            $('.addTitle .addmulti').removeClass('tabActive');
            $('.fieldWrapper').show();

            // remove other inputs
            $('#create_video input:file').not(':first').remove();
            $('#addMultiFile').hide();
            
            //$('#videoFile').remove();
            //$('#create_video').append('<input class="validate" type="file" id="videoFile" name="filePath" accept=".mp4,.flv"/>')

        };
        me.AddVideoMultiTab = function (ViewData, Event) {
            $('.addTitle .addsingle').addClass('tabInactive');
            $('.addTitle .addsingle').removeClass('tabActive');
            $('.addTitle .addmulti').addClass('tabActive');
            $('.addTitle .addmulti').removeClass('tabInactive');
            $('.fieldWrapper').hide();

            $('#addMultiFile').show();

            //var multiUpload = $('#videoFile');
            //$(multiUpload).show();
            //if(!$(multiUpload).hasClass('MultiFile')) {
            //    $(multiUpload).MultiFile();
            //}
        };
        me.AddVideoMulti = function (ViewData, Event) {
            var currentFileFields = $('#create_video input:file');
            var nextFieldId = currentFileFields.length;
            var fieldExists = $('videoFile_F' + nextFieldId).length > 0
            var fieldAvailable = !fieldExists;

            // find available id
            while (!fieldAvailable) {
                nextFieldId++;
                fieldExists = $('videoFile_F' +nextFieldId).length > 0
                fieldAvailable = !fieldExists;
            }

            var nextField = $('#videoFile').clone();
            $(nextField).attr('id', 'videoFile_F' + nextFieldId);
            var surroundingDiv = $('<div/>')
                .append(nextField)
                .append('<a>Remove</a>')
            ;
            $(surroundingDiv).find('a').click(function() {
                $(this).parent().remove();
            });
            $('#addMultiFile').before(surroundingDiv);
        };

        me.ChangeTextTrackMode = function (ViewData, Event) {
            var currentOption = $("input:radio[name=texttrackfiletype]:checked").val();

            switch (currentOption) {
                case "none":
                    // hide all
                    $('.texttrackfileinfo').hide();
                    break;
                case "file":
                    // show file upload
                    $('.texttrackfileinfo').show();
                    $('#textTrackFile').show();
                    $('#textTrackUrl').hide();
                    break;
                case "url":
                case "remote":
                    // show url
                    $('.texttrackfileinfo').show();
                    $('#textTrackFile').hide();
                    $('#textTrackUrl').show();
                    break;
            }

            $("input:radio[name=texttrackfiletype][value=" + currentOption + "]").prop("checked", true);
            return true;
        }
        me.AddTextTrack = function (ViewData, Event) {
            var currentOption = $("input:radio[name=texttrackfiletype]:checked").val();
            var textTrackFile = $('#textTrackFile').val();
            var textTrackUrl = $('#textTrackUrl').val();
            var textTrackLangProp = $('#txtTextTrackPropLang').val();
            var txtTextTrackPropLabel = $('#txtTextTrackPropLabel').val();
            var txtTextTrackPropKind = $('#txtTextTrackPropKind').val();
            var textTrackRemoteUrl = '';

            // validate
            switch (currentOption) {
                case "none":
                    return false;
                    break;
                case "file":
                    // check file and lang

                    if (!(textTrackFile != "" && textTrackLangProp != "")) {
                        alert(BrightCove.BCApp.Messaging.ValidationtextTrackFileMessage());
                        return false;
                    }
                    // must be vtt
                    if (!textTrackFile.toLowerCase().endsWith('vtt')) {
                        alert(BrightCove.BCApp.Messaging.ValidationtextTrackFileExtentionMessage());
                        return false;
                    }
                    break;
                case "url":
                case "remote":
                    // check url and lang
                    if (!(textTrackUrl != "" && textTrackLangProp != "")) {
                        alert(BrightCove.BCApp.Messaging.ValidationtextTrackUrlMessage());
                        return false;
                    }
                    if (!(
                        textTrackUrl.toLowerCase().indexOf('http://') == 0 ||
                        textTrackUrl.toLowerCase().indexOf('https://') == 0
                        )) {
                        alert(BrightCove.BCApp.Messaging.ValidationtextTrackUrlFormatMessage());
                        return false;
                    }
                    if (!textTrackUrl.toLowerCase().endsWith('vtt')) {
                        alert(BrightCove.BCApp.Messaging.ValidationtextTrackFileExtentionMessage());
                        return false;
                    }
                    textTrackRemoteUrl = $('#textTrackUrl').val();
            }

            // add to table
            BrightCove.BCApp.Utilities.AddTextTrackRow(
                '',
                txtTextTrackPropLabel,
                textTrackLangProp,
                txtTextTrackPropKind,
                currentOption,
                $('#textTrackFile'),
                textTrackRemoteUrl,
                false
            );

            // clear fields
            //$('#txtTextTrackPropLang').val('');
            $('#txtTextTrackPropLang').val($("#txtTextTrackPropLang option:first").val());
            $('#txtTextTrackPropLabel').val('');
            $('#textTrackUrl').val('');
            // clear file
            $('#textTrackFile').val('');
        };
        //

        me.AddVideo = function (ViewData, Event) {
            //Format the data before submitting
            var mode = me.DetermineMode();

            writeToken = $('#ddlSelectAccount > option:selected').val();
            var selectedAccountName = $('#ddlSelectAccount > option:selected').text();
            var accountId = $('#ddlSelectAccount > option:selected').data('item-id');
            var vid = (me.VideoData().VideoID != undefined) ? me.VideoData().VideoID() : 0;

            me.CurrentAccount(BrightCove.BCApp.Utilities.GetAccountByID(accountId, me.AccountListData()));

            //if (writeToken.length < 1) {
            //    alert(BrightCove.BCApp.Messaging.WriteTokenNotPresent());
            //    return false;
            //}
            

            //If validation failed, do not continue with execution
            if (!me.ValidateForm()) {
                return false;
            } ;
            
            // ready to proceed...
            
            //Create a unique GUID and append it to the object
            if (vid == null || vid == undefined || vid == 0) {
                me.VideoData().SPID(BrightCove.BCApp.Utilities.CreateBCGuid('1', me.VideoData().VideoTitle()));
            }

            //Get the un-bound values directly from the HTML elements before information is submitted to SP
            me.VideoData().Economics($('#ddlEconomics > option:selected').val());
            me.VideoData().Account($('#ddlSelectAccount > option:selected').text());

            var activeVar = $('#ddlActive > option:selected').val();
            var readToken = me.GetReadToken(me.CurrentAccount());

            //when video is finished upl
            //$('#postFrame').on("load", { SPID: me.VideoData().SPID(), readToken: readToken }, function (e) {
            //    setTimeout(function () {
            //        BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByReferenceID(
            //            e.data.SPID, e.data.readToken, function (bcVideoObj) {
            //                if (bcVideoObj != null) {
            //                    alert('found video');
            //                }
            //            }, null);
            //    }, 5000);
            //});

            //Upload the video data asynchronously
            $('#overlay-inAbox .toolbar').hide();
            openOverlay('#overlay-inAbox');

            BrightCove.BCApp.Pages.PageData.CurrentMode = mode;

            switch(mode)
            {
                case "brightcoveupload":
                    me.BrightCoveUpload();
                    return;
                    break;
                case "brightcoveimport":
                    me.BrightcoveImport();
                    return;
                    break;
                case "sharepointupdate":
                    me.SharepointUpdate();
                    return;
                    break;
            }

            if (vid == 0 && refId > 0) {
                overlayMessage('Your video is being uploaded to Brightcove...');
                BrightcoveUpload(function (data) {
                    var whenHaveImages = $.when(thumbnailImageUrl, stillImageUrl);

                    whenHaveImages.then(function (thumb, still) {
                        me.VideoData().VideoThumbNail(thumb);
                        me.VideoData().VideoStillImage(still);
                    GetImageFileBuffer('BCStill-', '#videoStill').done(function (result) {
                        //me.VideoData().VideoStillImage('/'
                        //    + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                        //    + '/' + result.filename);

                        //Upload the still image item to the doc library
                        UploadSPDocument(result.filename, result.content).done(function (data) {
                                GetImageFileBuffer('BCThumb-', '#create_thumb_image #videoFile').done(function (resultn) {
                                    //me.VideoData().VideoThumbNail('/'
                                    //    + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                                    //    + '/' + resultn.filename);

                                    //Upload the thumbnail image item to the doc library
                                UploadSPDocument(resultn.filename, resultn.content).done(function (datan) {
                                    //Upload SharePoint video data
                                    BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData());

                                    $('.formContent').hide();
                                    BrightCove.BCApp.Utilities.SetAddVideBreadCrumb('edit');
                                    //$('#reload').show();
                                    //showReloadFields(doneWithStillUpload, doneWithThumbUpload);
                                })
                            }).fail(function (errn) {
                                if (errn) {
                                    var e = errn;
                                    alert(e);
                            }
                        });
                    })
                    }).fail(function (err) {
                        if (err) {
                            var e = err;
                            alert(e);
                    }
                    });
                });
            });
            }
            else {
                overlayMessage('Your video is being updated...');
                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(me.CurrentAccount().AccountAuthorsGroupName(),
                    function (userInGroup, UploadVideo) {
                        if (!userInGroup) {
                            alert('The current user does not belong to the author\'s group configured in the selected account. The video details will not be uploaded.');
                            return;
                        } else {
                            BrightcoveUpload(function (data) {
                                var whenHaveImages = $.when(thumbnailImageUrl, stillImageUrl);

                                whenHaveImages.then(function (thumb, still) {
                                    if (uploadedVideoId != '') {
                                        me.VideoData().ReferenceID(uploadedVideoId);
                                }
                                    me.VideoData().VideoThumbNail(thumb);
                                    me.VideoData().VideoStillImage(still);



                                var doneWithStillUpload = false;
                                var doneWithThumbUpload = false;
                                var isNewSPVid = false;



                                if (vid == 0 && refId > 0) {
                                    GetImageFileBuffer('BCStill-', '#videoStill').done(function (result) {
                                        me.VideoData().VideoStillImage('/'
                                            +BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                                            + '/' +result.filename);

                                        //Upload the still image item to the doc library
                                        UploadSPDocument(result.filename, result.content).done(function (data) {
                                            GetImageFileBuffer('BCThumb-', '#create_thumb_image #videoFile').done(function (resultn) {
                                                //me.VideoData().VideoThumbNail('/'
                                                //    + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                                                //   + '/' + resultn.filename);

                                                //Upload the thumbnail image item to the doc library
                                                UploadSPDocument(resultn.filename, resultn.content).done(function (datan) {
                                                    //Upload SharePoint video data
                                                    BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData());
                                                    doneWithThumbUpload = true;
                                                    //showReloadFields(doneWithStillUpload, doneWithThumbUpload);
                                            })
                                            }).fail(function (errn) {
                                                if (errn) {
                                                    var e = errn;
                                                    alert(e);
                                            }
                                        });
                                    })
                                    }).fail(function (err) {
                                        if (err) {
                                            var e = err;
                                            alert(e);
                                    }
                                });
                                }
                                else {
                                    //Upload SharePoint video data
                                    BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData(), function (oListItem) {
                                        var spvid = oListItem.get_id();
                                        me.VideoData().VideoID(spvid);

                                            GetImageFileBuffer('BCStill-', '#videoStill').done(function (result) {
                                                //me.VideoData().VideoStillImage('/'
                                                //    + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                                                //    + '/' + result.filename);

                                                //Upload the still image item to the doc library
                                                UploadSPDocument(result.filename, result.content).done(function (data) {
                                                    //var file = data.d;
                                                    //checkOut(file.ServerRelativeUrl).done(function () {
                                                    //    updateMetadata(file.ServerRelativeUrl, null).done(function () {
                                                    //        checkIn(file.ServerRelativeUrl).done(function () { });
                                                    //    })
                                                    //})
                                                    //alert('Done uploading still image');

                                                    BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData());
                                                    doneWithStillUpload = true;
                                                    //showReloadFields(doneWithStillUpload, doneWithThumbUpload);
                                            })
                                            }).fail(function (err) {
                                                if (err) {
                                                    var e = err;
                                                    alert(e);
                                            }
                                    });

                                        GetImageFileBuffer('BCThumb-', '#create_thumb_image #videoFile').done(function (resultn) {
                                            //me.VideoData().VideoThumbNail('/'
                                            //    + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                                            //    + '/' + resultn.filename);

                                            //Upload the thumbnail image item to the doc library
                                                UploadSPDocument(resultn.filename, resultn.content).done(function (datan) {
                                                    //Upload SharePoint video data
                                                    BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData());
                                                    doneWithThumbUpload = true;
                                                    //showReloadFields(doneWithStillUpload, doneWithThumbUpload);
                                        })
                                            }).fail(function (errn) {
                                                if (errn) {
                                                    var e = errn;
                                                    alert(e);
                                            }
                                    });
                                });
                                }
                                    function showReloadFields(stillUploadStatus, thumbUploadStatus) {
                                    if (stillUploadStatus && thumbUploadStatus) {
                                        $('.formContent').hide();
                                        BrightCove.BCApp.Utilities.SetAddVideBreadCrumb('edit');
                                        $('#reload').show();
                                    }
                                }

                                showReloadFields(true, true);
                            });

                        });
                    }
            });
            }
        };

        me.GetWriteToken = function (param) {
            //Get the corresponding write tokens for each of the accounts listed in the dropdown
            var tokens = param.ReadTokens();
            if (tokens != null && tokens.length > 0) {
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].toLowerCase().indexOf('write-') > -1) {
                        var tok = tokens[i].split('rite-');
                        return tok[1];
                    }
                }
            }
            return '';
        };
        me.GetReadToken = function (param) {
            //Get the corresponding write tokens for each of the accounts listed in the dropdown
            var tokens = param.ReadTokens();
            if (tokens != null && tokens.length > 0) {
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].toLowerCase().indexOf('ead-') > -1) {
                        var tok = tokens[i].split('ead-');
                        return tok[1];
                    }
                }
            }
            return '';
        };
        me.PageRefresh = function () {
            BrightCove.BCApp.Utilities.PageRefresh();
        };
        me.GetAddNewVideoLink = function () {
            var base = $('.leftNav a[href^="AddVideos.aspx"]').attr('href');
            //return base + '&spid=' + param + '&vid=' + param2;

            if (window.location.search.indexOf('&spid') > 0) {
                return "AddVideos.aspx" + window.location.search.substring(0, window.location.search.indexOf('&spid'));
            }
            if (window.location.search.indexOf('&vid') > 0) {
                return "AddVideos.aspx" + window.location.search.substring(0, window.location.search.indexOf('&vid'));
            }
            if (window.location.search.indexOf('&bcvid') > 0) {
                return "AddVideos.aspx" + window.location.search.substring(0, window.location.search.indexOf('&bcvid'));
            }
            return base;
        };

        /*************************************************************/
        /*SP Upload Functions*/
        /*************************************************************/
        var GetImageFileBuffer = function (prependText, elementId) {
            var dfd = $.Deferred();
            if ($(elementId)[0] != null && $(elementId)[0].files != null && $(elementId)[0].files.length > 0) {
                var file = $(elementId)[0].files[0];
                var fileName = prependText + file.name;
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    var result = { 'filename': fileName, 'content': e.target.result };
                    dfd.resolve(result);
                }
                reader.onerror = function (e) {
                    dfd.reject(e.target.error);
                }

                reader.readAsArrayBuffer(file);
            }
            else
            {
                dfd.reject();
                //dfd = { 'filename': '', 'content': null };
            }
            return dfd;
        };
        var UploadSPDocument = function (filename, content) {
            var appweburl = decodeURIComponent(BrightCove.BCApp.Utilities.GetQueryStringParameter('SPAppWebUrl'));
            var hostweburl = decodeURIComponent(BrightCove.BCApp.Utilities.GetQueryStringParameter('SPHostUrl'));

            var restSource = appweburl +
                "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('"
                + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                + "')/rootfolder/files/add(url='" + filename + "',overwrite=true)?@target='" + hostweburl + "'";
            var dfd = $.Deferred();

            $.ajax(
               {
                   'url': restSource,
                   'method': 'POST',
                   'data': content,
                   processData: false,
                   'headers': {
                       'accept': 'application/json;odata=verbose',
                       'X-RequestDigest': $('#__REQUESTDIGEST').val(),
                       "content-length": content.byteLength
                   },
                   'success': function (data) {
                       var d = data;
                       dfd.resolve(d);
                       //alert(d.toString());
                   },
                   'error': function (err) {
                       dfd.reject(err);
                   }
               }
              );

            return dfd;
        };

        /*************************************************************/
        /*Brightcove Functions*/
        /*************************************************************/
        function BrightcoveUpload(callBackFunction) {
            var json = $('#create_video #JSONRPC');
            var jview = $('#create_video #JSONView');

            var jval = '';
            var guid = me.VideoData().SPID();
            var vid = (me.VideoData().VideoID != undefined) ? me.VideoData().VideoID() : 0;
            var refId = (me.VideoData().ReferenceID != undefined) ? me.VideoData().ReferenceID() : 0;

            if (guid == null || guid.length < 1) {
                alert(BrightCove.BCApp.Messaging.GuidNotPresent());
                return false;
            }

            var tags = me.VideoData().Keywords();
            var token = $('#ddlSelectAccount > option:selected').val();
            var readToken = me.GetReadToken(me.CurrentAccount());

            //Construct the JSON request: 
            if (vid != null && vid != undefined && vid > 0) {
                //change the 'name of the element
                jview.attr('name', 'json').attr('id', 'json');
                $('#create_video').attr('enctype', '');
                
                //Get the correct video id from BC (if it exists)                
                BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByTagID(
                    me.VideoData().SPID(), readToken, function (bcVideoObj) {
                        if (bcVideoObj == null || bcVideoObj.ReferenceID == null) {
                            alert('The selected video item has not been found in the Brightcove Video Cloud: '
                                + me.VideoData().SPID()
                                + '\nThe SharePoint video details will not be updated.'
                                + ' \nPlease see a system administrator to resolve this.');
                            return;
                        }

                        //If video doesn't exist, inform the user and exit out of the operation
                        me.VideoData().ReferenceID(bcVideoObj.ReferenceID);

                        //Format the json string
                        jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.UpdateVideo(
                            me.VideoData().VideoTitle(),
                            bcVideoObj.ReferenceID,
                            me.VideoData().SPID(),
                            tags,
                            me.VideoData().VideoShortDescription(),
                            me.VideoData().VideoLongDescription(),
                            me.VideoData().RelatedLink(),
                            me.VideoData().RelatedLinkText(),
                            me.VideoData().Active(),
                            me.VideoData().Economics(),
                            me.VideoData().VideoStartDate(),
                            me.VideoData().VideoEndDate(),
                            token,
                            me.VideoData().UsageRestriction(),
                            me.VideoData().CommunicationChannel(),
                            //me.VideoData().BusinessUnit(),
                            me.VideoData().Organization(),
                            me.VideoData().Geography(),
                            me.VideoData().Capability(),
                            me.VideoData().Industry(),
                            me.VideoData().Methodology(),
                            me.VideoData().Language(),
                            me.VideoData().News(),
                            me.VideoData().VideoContact(),
                            me.VideoData().DateRecorded(),
                            me.VideoData().Publisher(),
                            me.VideoData().PublishedDate(),
                            me.VideoData().ExpirationDate()
                        );

                        jview.val(jval);
                        json.remove();

                        $('#create_video').attr('action', BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL);
                        $('#create_video').submit();

                        if (callBackFunction != null)
                            callBackFunction();
                    }, true);

            }
            else if (refId > 0) {
                //change the 'name of the element
                jview.attr('name', 'json').attr('id', 'json');
                $('#create_video').attr('enctype', '');

                if (typeof me.VideoData().DateRecorded === "function"){
                    me.VideoData().DateRecorded('');
                } else if (me.VideoData().DateRecorded == null) {
                    me.VideoData().DateRecorded = '';
                }
                if (typeof me.VideoData().Publisher === "function") {
                    me.VideoData().Publisher('');
                } else if (me.VideoData().Publisher == null) {
                    me.VideoData().Publisher = '';
                }
                if (typeof me.VideoData().PublishedDate === "function") {
                    me.VideoData().PublishedDate('');
                } else if (me.VideoData().PublishedDate == null) {
                    me.VideoData().PublishedDate = '';
                }
                if (typeof me.VideoData().ExpirationDate === "function") {
                    me.VideoData().ExpirationDate('');
                } else if (me.VideoData().ExpirationDate == null) {
                    me.VideoData().ExpirationDate = '';
                }

                //Format the json string
                jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.UpdateVideo(
                    me.VideoData().VideoTitle(),
                    refId,
                    me.VideoData().SPID(),
                    tags,
                    me.VideoData().VideoShortDescription(),
                    me.VideoData().VideoLongDescription(),
                    me.VideoData().RelatedLink(),
                    me.VideoData().RelatedLinkText(),
                    me.VideoData().Active(),
                    me.VideoData().Economics(),
                    me.VideoData().VideoStartDate(),
                    me.VideoData().VideoEndDate(),
                    token,
                    me.VideoData().UsageRestriction(),
                    me.VideoData().CommunicationChannel(),
                    //me.VideoData().BusinessUnit(),
                    me.VideoData().Organization(),
                    me.VideoData().Geography(),
                    me.VideoData().Capability(),
                    me.VideoData().Industry(),
                    me.VideoData().Methodology(),
                    me.VideoData().Language(),
                    me.VideoData().News(),
                    me.VideoData().VideoContact(),
                    (typeof me.VideoData().DateRecorded === "function" ? me.VideoData().DateRecorded() : me.VideoData().DateRecorded),
                    (typeof me.VideoData().Publisher === "function" ? me.VideoData().Publisher() : me.VideoData().Publisher),
                    (typeof me.VideoData().PublishedDate === "function" ? me.VideoData().PublishedDate() : me.VideoData().PublishedDate),
                    (typeof me.VideoData().ExpirationDate === "function" ? me.VideoData().ExpirationDate() : me.VideoData().ExpirationDate)
                );

                jview.val(jval);
                json.remove();

                $('#create_video').attr('action', BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL);
                $('#create_video').submit();

                if (callBackFunction != null)
                    callBackFunction();
            }
            else {
                //Format the json string
                var startDate = new Date(BrightCove.BCApp.Utilities.ReplaceAll(me.VideoData().VideoStartDate(), '-', '/'))
                var endDate = new Date(BrightCove.BCApp.Utilities.ReplaceAll(me.VideoData().VideoEndDate(), '-', '/'))

                jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.CreateVideo(
                    me.VideoData().VideoTitle(),
                    me.VideoData().SPID(),
                    tags, me.VideoData().VideoShortDescription(),
                    me.VideoData().VideoLongDescription(),
                    me.VideoData().RelatedLink(),
                    me.VideoData().RelatedLinkText(),
                    me.VideoData().Active(),
                    me.VideoData().Economics(),
                    startDate,
                    endDate,
                    token,
                    me.VideoData().UsageRestriction(),
                    me.VideoData().CommunicationChannel(),
                    //me.VideoData().BusinessUnit(),
                    me.VideoData().Organization(),
                    me.VideoData().Geography(),
                    me.VideoData().Capability(),
                    me.VideoData().Industry(),
                    me.VideoData().Methodology(),
                    me.VideoData().Language(),
                    me.VideoData().News(),
                    me.VideoData().VideoContact(),
                    me.VideoData().DateRecorded(),
                    me.VideoData().Publisher(),
                    me.VideoData().PublishedDate(),
                    me.VideoData().ExpirationDate()
                );

                jview.val(jval);
                json.val(jval);

                $('#create_video').attr('action', BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL);
                //solution 1 --------------------------
                //$.post(BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL, jval, callBackFunction, 'json');


                //solution 2 --------------------------
                //var cor = new XMLHttpRequest();

                //cor.open('POST', BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL, true);
                //cor.withCredential = "true";
                //cor.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                //cor.send('Data=' + jval);

                //solution 3 --------------------------
                //$.ajax({
                //    type: 'POST',
                //    url: BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL + '?callback=?',
                //    async: false,
                //    cache: false,
                //    //contentType: "application/json",
                //    dataType: 'jsonp',
                //    data: jval,
                //    success: function (json) {
                        
                //    },
                //    error: function (e) {
                //        alert('Error retrieving video from Brightcove...cannot proceed with video update. '
                //            + e.toString());
                //    }
                //});

                //solution 4 --------------------------

                //var formData = $('#create_video').serialize();

                //$.ajax({
                //    url: "../_api/SP.WebProxy.invoke",
                //    type: "POST",
                //    data: JSON.stringify(
                //        {
                //            "requestInfo": {
                //                "__metadata": { "type": "SP.WebRequestInfo" },
                //                "Url": BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL,
                //                "Method": "Post", 
                //                "Headers": {
                //                    "results": [{
                //                        "__metadata": { "type": "SP.KeyValue" },
                //                        "Key": "Accept",
                //                        "Value": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                //                        "ValueType": "Edm.String"
                //                    },
                //                    {
                //                        "__metadata": {
                //                            "type" : "SP.KeyValue"
                //                        },
                //                        "Key": "Content-Type",
                //                        "Value": "multipart/form-data;",
                //                        "ValueType": "Edm.String"
                //                    }]
                //                },
                //                "Body": formData
                //            }
                //        }),
                //    headers: {
                //        "Accept": "application/json;odata=verbose",
                //        "Content-Type": "application/json;odata=verbose",
                //        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                //    },
                //    success: function (data) {

                //        // status code 200 means ok, got the data
                //        if (data.d.Invoke.StatusCode == 200) {

                //            //var body = JSON.parse(data.d.Invoke.Body);

                //            //var html = "ul";
                //            //for (var i in body) {
                //            //    html += "li" + i + ": " + body[i] + "/li";
                //            //}
                //            //html += "/ul";
                //            //$("#message").html(html);
                //        }
                //        else {
                //            // some status codes like 302 redirect do not trigger the error handler
                //            var err = "Status code: " + data.d.Invoke.StatusCode + ". ";
                //            err += data.d.Invoke.Body;
                //            $("#message").html(err);
                //        }
                //    },
                //    error: function (data) {
                //        var body = data.d.Invoke.Body;
                //        $("#message").html(body);
                //    }
                //});

                $('#create_video').submit();

                if (callBackFunction != null)
                    callBackFunction();

                //jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.CreateVideo(
                //    'hellovideo',
                //    me.VideoData().SPID(),
                //    tags, me.VideoData().VideoShortDescription(),
                //    me.VideoData().VideoLongDescription(),
                //    me.VideoData().RelatedLink(),
                //    me.VideoData().RelatedLinkText(),
                //    me.VideoData().Active(),
                //    me.VideoData().Economics(),
                //    startDate,
                //    endDate,
                //    token);

                //jview.val(jval);
                //json.val(jval);

                //$('#create_video').submit();
            }

            //Remove the write token value, and replace with the read token
            //token = me.GetReadToken(me.CurrentAccount());
            var keepLooping = true;
            var item = '';
            
            //setTimeout(function () {
            //    alert('searching for newly uploaded video');
            //    BrightCove.BCApp.SharePoint.BrightCoveUtilities.GetBCVideosByTagID(me.VideoData().SPID(), token,
            //        function (returnStatus, newData) {
            //            alert(returnStatus);
            //            keepLooping = false;
            //        });
            //}, 7000);

            //do {
            //    item = BrightCove.BCApp.SharePoint.BrightCoveUtilities.GetBCVideosByTagID(me.VideoData().SPID(), token,
            //        function (returnStatus, newData) {
            //            alert(returnStatus);
            //            keepLooping = false;
            //        });
            //    //alert('looping');
            //} while (keepLooping);
            
            //alert('Video upload done');
        }

        /*************************************************************/
        /*Data Binding Functions*/
        /*************************************************************/
        var returnData = BrightCove.BCApp.SharePoint.ListUtilities.GetAccounts(SPContext.UserId(),
            BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);

        ko.mapping.fromJSON(returnData, {}, me);

        /*************************************************************/
        /*Security Functions*/
        /*************************************************************/
        me.DeleteItem = function (itemid) {
            if (itemid == null || itemid.length < 1)
                return false;
            me.AccountListData.remove(function (item) {
                return item.PropertyId() == itemid;
            });
        };
        var validatedAccounts = me.AccountListData();
        $(validatedAccounts).each(function (ind, item) {
            //alert(item.AccountViewersGroupName());
            try {
                if (item != null && item.AccountAuthorsGroupName != undefined
                    && item.AccountViewersGroupName() != '') {
                    BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountViewersGroupName(),
                        function (UserBelongsToGroup) {
                            if (!UserBelongsToGroup) {
                                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountAuthorsGroupName(),
                        function (UserBelongsToGroup) {
                            if (!UserBelongsToGroup) {
                                //validatedAccounts.push(item);
                                me.DeleteItem(item.PropertyId());
                            }
                        });

                            }
                        });
                }
            }
            catch (err) {
                me.DeleteItem(item.PropertyId());
            }
        });
    },
    ManageVideosViewModel: function () {
        var me = this;

        /*************************************************************/
        /*View Model Observables*/
        /*************************************************************/
        me.AccountListData = ko.observableArray([]);
        me.CurrentAccount = ko.observable(BrightCove.BCApp.DataStructures.AccountData);
        me.VideoListData = ko.observableArray([]);
        me.FullVideoListData = ko.observableArray([]);
        me.CloudListData = ko.observableArray([]);

        //me.SPSearchVideoListData = ko.observableArray([]);

        /*************************************************************/
        /*Behaviour Functions*/
        /*************************************************************/
        var DoesItemContainTerms = function (searchTerm, item) {
            var termFound = false;
            var terms = searchTerm.toLowerCase().split(' ');
            if (terms.length > 0) {
                for (var i = 0; i < terms.length; i++) {
                    if (item.VideoTitle().toLowerCase().indexOf(terms[i]) > -1
                        || item.VideoShortDescription().toLowerCase().indexOf(terms[i]) > -1) {
                        //alert('term found!');
                        termFound = true;
                        break;
                    }
                    var keywords = item.Keywords().toLowerCase().split(',');
                    for (var j = 0; j < keywords.length; j++) {
                        if (keywords[j].toLowerCase().indexOf(terms[i]) > -1) {
                            termFound = true;
                            break;
                        }
                    }
                    if (termFound) { break;}
                }
            }
            return termFound;
        };
        //Returns an observable item from the array
        me.GetAccountItem = function (itemid) {
            if (itemid.length < 1)
                return item;

            var match = ko.utils.arrayFirst(me.AccountListData(), function (item) {
                return item.PropertyId() === itemid;
            });

            if (match) {
                var cloneObj = ko.mapping.fromJS(ko.mapping.toJS(match));
                me.CurrentAccount(cloneObj);
                return match;
            }
            return null;
        };
        //Filters SharePoint videos based on the current selected account
        me.FilterVideosByCurrentAccount = function (searchTerm) {
            var filteredItems = ko.utils.arrayFilter(me.FullVideoListData(), function (item) {
                if(searchTerm != null && searchTerm.length > 0)
                    return item.Account() == me.CurrentAccount().PropertyName()
                           && DoesItemContainTerms(searchTerm, item);
                else {
                    return item.Account() == me.CurrentAccount().PropertyName();
                }
            });
            me.VideoListData(filteredItems);
        };
        me.GetVideoListTagClasses = function (tag, defaultClasses) {
            var classes = defaultClasses;

            if (tag.indexOf('bcsp-') == 0) {
                classes += ' hiddenElement';
            }

            return classes;
        };
        me.FormatURL = function (param, param2) {
            if ($('.leftNav a[href^="AddVideos.aspx"]').length > 0) {
                var base = $('.leftNav a[href^="AddVideos.aspx"]').attr('href');
                return base + '&vid=' + param2 + '&account=' + me.CurrentAccount().PropertyId();
            }
            else
            {
                return "javascript:alert('You are not authorized to Edit Video information.  Please contact your system administrator.');";
            }
        };
        me.FormatURLForCloud = function (param) {
            if ($('.leftNav a[href^="AddVideos.aspx"]').length > 0) {
                var base = $('.leftNav a[href^="AddVideos.aspx"]').attr('href');
                var propId = (me.CurrentAccount() != null ? me.CurrentAccount().PropertyId() : "");
                return base + '&bcvid=' + param + '&account=' + propId;
            }
            else {
                return "javascript:alert('You are not authorized to Edit Video information.  Please contact your system administrator.');";
            }
        };
        me.GetTagsArray = function (param) {
            return BrightCove.BCApp.Utilities.GetCommaSeparatedArray(param);
        };
        me.GetReadToken = function (account) {
            return BrightCove.BCApp.Utilities.ReadAccountToken(account);
        };

        /*************************************************************/
        /*Account UI Functions*/
        /*************************************************************/
        me.AccountChange = function (ViewData, Event) {
            // clear token
            BrightCove.BCApp.Utilities.DeleteCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);

            var element = $(Event.currentTarget).find('option:selected').data('item-id');
            me.CurrentAccount(BrightCove.BCApp.Utilities.GetAccountByID(element, me.AccountListData()));

            $('#searchButton').trigger('click');

            //me.FilterVideosByCurrentAccount();
            $('#searchBox').val('');
            //$('.AllSharepointResults').show();
            //$('.SharepointResults').hide();
            //$('.CloudResults').hide();
        };
        //Main JS function that executes the app's search function
        me.SearchBtnClick = function (ViewData, Event) {
            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
            }

            var account = new BrightCove.BCApp.DataStructures.AccountData();
            account.AccountId = me.CurrentAccount().AccountId();
            account.ClientId = me.CurrentAccount().ClientId();
            account.ClientSecret = me.CurrentAccount().ClientSecret();

            BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                    account,
                    me.SearchBtnClickInner,
                    arguments);
        };
        me.SearchBtnClickInner = function (ViewData, Event) {
            var account_id = '';
            var account_item_id = '';
            $('div.results ul.resultItems > li').remove();
            me.VideoListData([]);
            me.CloudListData([]);

            if (me.CurrentAccount() == null ||
                me.CurrentAccount().ReadTokens == undefined) {
                return true;
            } else {
                account_id = me.CurrentAccount().AccountId();
                account_item_id = me.CurrentAccount().PropertyId();
            }

            $('#SearchResultsMessage').html("");

            var siteAccountTag = 'bcsp-' + BrightCove.BCApp.Pages.PageData.SiteId + '-' + account_item_id;
            var searchScope = $('.searchScope input:checked').val();
            var searchText = $('#searchBox').val();
            var tagSearchText = searchText;

            //If the current selection is that of VideoCloud, get the videos from the cloud, then bind them
            //If the selection is that of SharePoint, 
            if (searchScope == 'VideoCloud') {
                var orderField = $('.searchResultsOrderByField input:checked').val();
                var orderDirection = $('.searchSortOrder input:checked').val();
                if (orderDirection == 'ascending') {
                    orderDirection = '';
                } else {
                    orderDirection = '-';
                }
                switch(orderField.toLowerCase())
                {
                    case "displayname":
                        orderField = 'name';
                        break;
                    case "relevance":
                        orderField = 'plays_total';
                        break;
                    case "creationdate":
                        orderField = 'created_at';
                        break;
                    case "startdate":
                        orderField = 'schedule_starts_at';
                        break;
                }

                $('.AllSharepointResults').hide();
                $('.CloudResults').show();

                var splitTerms = searchText.split(' ');

                if (splitTerms != null && splitTerms.length > 0) {
                    searchText = splitTerms.join('+%2B');
                }

                var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/videos';

                if (searchText != '' && searchText.length > 1) {
                    apiUrl += '?limit=45';
                    apiUrl += '&q=%2B' + searchText + '%20';
                    apiUrl += '-tags%3A%22' + siteAccountTag + '%22';
                    apiUrl += '&sort=' + orderDirection + orderField;
                }
                else {
                    apiUrl += '?limit=45';
                    apiUrl += '&q=-tags%3A%22' + siteAccountTag + '%22';
                    apiUrl += '&sort=' + orderDirection + orderField;
                }

                var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);

                $.ajax({
                    url: apiUrl,
                    async: false,
                    cache: false,
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    success: function (json) {
                        if (json != null && json.length > 0) {
                            var cloudVids = [];

                            me.CloudListData(null);
                            var addItemToOutput = true;
                            $(json).each(function (index, item) {
                                addItemToOutput = true;
                                //if (item.tags != null && item.tags.length > 0) {
                                //    $(item.tags).each(function (index, titem) {
                                //        //if the video is a BC video, do not display this in the final output
                                //        if (titem.indexOf('bcsp-') > -1) {
                                //            addItemToOutput = false;
                                //        }
                                //    });
                                //}

                                if (addItemToOutput) {
                                    var newData = new BrightCove.BCApp.DataStructures.VideoData();

                                    newData.VideoTitle = item.name;
                                    newData.VideoID = item.id;
                                    newData.VideoThumbNail = (item.images.thumbnail != null ? item.images.thumbnail.src : "../images/video.png");
                                    newData.VideoShortDescription = item.description;
                                    newData.VideoStartDate = item.starts_at;
                                    newData.VideoEndDate = item.ends_at;
                                    newData.Keywords = (item.tags != null && item.tags.length > 0) ? item.tags.join(',') : '';

                                    cloudVids.push(newData);
                                }
                            });

                            var json = ko.mapping.toJS(cloudVids);
                            me.CloudListData(ko.mapping.fromJS(json)());

                            me.SortByFieldClick();
                            //$('div.PaginatedResults').html($('div.CloudResults').html());

                            $(".CloudResults ul").quickPagination({
                                pagerLocation: "both", pageSize: "5"
                            });

                            $('.CloudResults .simplePagerNav').addClass('pagination');
                            $('.PaginatedResults').hide().html('');
                        }
                        else {
                            // hide pager
                            $('.CloudResults .simplePagerNav').hide();
                            // set message
                            $('#SearchResultsMessage').html("<br/>No search results have been found.");
                        }
                    },
                    error: function (e) {
                        alert('Error retrieving video from Brightcove...cannot proceed with video update. '
                            + e.toString());
                    }
                });
            }
            else {
                var orderField = $('.searchResultsOrderByField input:checked').val();
                var orderDirection = $('.searchSortOrder input:checked').val();

                if (me.FullVideoListData().length == 0 || me.FullVideoListData().length == undefined)
                {
                    var videoData = BrightCove.BCApp.SharePoint.ListUtilities.GetVideosStrings();

                    me.FullVideoListData(ko.mapping.fromJS(videoData)());
                }

                if (searchText != null && searchText.length > 0) {
                    me.FilterVideosByCurrentAccount(searchText);
                }
                else {
                    me.FilterVideosByCurrentAccount();
                }

                me.SortByFieldClick();
                $('div.PaginatedResults').html($('div.AllSharepointResults').html());

                $.when(
                    $(".PaginatedResults ul.resultItems").quickPagination({
                        pagerLocation: "both", pageSize: "5"
                    })
                ).then(
                    $('.PaginatedResults .simplePagerNav').addClass('pagination')
                );

                //$('div.PaginatedResults').show();
                //$('div.AllSharepointResults').hide();
                $('div.PaginatedResults').show();
                $('div.AllSharepointResults').hide();
                $('div.CloudResults').hide();

                if (me.VideoListData().length == 0) {
                    // hide pager
                    $('.CloudResults .simplePagerNav').hide();
                    // set message
                    $('#SearchResultsMessage').html("<br/>No search results have been found.");
                }
            }
        };
        me.SortByFieldClick = function (ViewData, Event) {
            if (Event != null) {
                $('#searchButton').click();
                return true;
            }
            var orderField = $('.searchResultsOrderByField input:checked').val();
            var orderDirection = $('.searchSortOrder input:checked').val();
            var startPath = '';
            var searchScope = $('.searchScope input:checked').val();
            var searchText = $('#searchBox').val();

            if (searchText.length > 0) {
                if (searchScope == 'SharePoint') {
                    startPath = '.AllSharepointResults ';
                }
                else {
                    startPath = '.CloudResults ';
                }
            }
            else {
                if (searchScope == 'SharePoint') {
                    startPath = '.AllSharepointResults ';
                }
                else {
                    startPath = '.CloudResults ';
                }
            }

            switch (orderField) {
                case 'relevance':
                    if (orderDirection == 'ascending') {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByOrderAscending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    else {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByOrderDescending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    break;
                case 'displayName':
                    if (orderDirection == 'ascending') {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByNameAscending)
                            .appendTo(startPath + ' ul.resultItems');

                        var sorted = me.VideoListData().sort(function (a, b) {
                            return (a.VideoTitle()) > (b.VideoTitle()) ? 1 : -1;
                        });

                        me.VideoListData(sorted);
                    }
                    else {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByNameDescending)
                            .appendTo(startPath + ' ul.resultItems');

                        var sorted = me.VideoListData().sort(function (a, b) {
                            return (a.VideoTitle()) < (b.VideoTitle()) ? 1 : -1;
                        });

                        me.VideoListData(sorted);
                    }
                    break;
                case 'creationDate':
                    if (orderDirection == 'ascending') {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByDateCreatedAscending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    else {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByDateCreatedDescending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    break;
                case 'startDate':
                    if (orderDirection == 'ascending') {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByDateStartedAscending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    else {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByDateStartedDescending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    break;
            }
            return true;
            //element.attr('checked', 'checked');
        };
        me.SearchScopeClick = function (ViewData, Event) {
            $('#searchButton').trigger('click');
            return true;
        };
        
        /*************************************************************/
        /*Data Binding Functions*/
        /*************************************************************/
        var returnData = BrightCove.BCApp.SharePoint.ListUtilities.GetAccounts(null, true);
        ko.mapping.fromJSON(returnData, {}, me);

        var videoData = BrightCove.BCApp.SharePoint.ListUtilities.GetVideosStrings();

        me.FullVideoListData(ko.mapping.fromJS(videoData)());

        /*************************************************************/
        /*Security Functions*/
        /*************************************************************/
        me.DeleteItem = function (itemid) {
            if (itemid == null || itemid.length < 1)
                return false;
            me.AccountListData.remove(function (item) {
                return item.PropertyId() == itemid;
            });
        };
        var validatedAccounts = me.AccountListData();
        $(validatedAccounts).each(function (ind, item) {
            //alert(item.AccountViewersGroupName());
            try {
                if (item != null && item.AccountAuthorsGroupName != undefined
                    && item.AccountViewersGroupName() != '') {
                    BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountViewersGroupName(),
                        function (UserBelongsToGroup) {
                            if (!UserBelongsToGroup) {
                                    BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountAuthorsGroupName(),
                            function (UserBelongsToGroup) {
                                    if (!UserBelongsToGroup) {
                                        //validatedAccounts.push(item);
                                        me.DeleteItem(item.PropertyId());
                                         }
                                    });
                                
                            }
                        });
                }
            }
            catch (err) {
                me.DeleteItem(item.PropertyId());
            }
        });
    },
    ManagePlaylistsViewModel: function () {
        var me = this;
        me.AccountListData = ko.observableArray([]);
        me.PlayListData = ko.observableArray([]);
        me.CurrentPlayListData = ko.observableArray([]);

        me.VideoListData = ko.observableArray([]);
        me.AllSPVideos = ko.observableArray([]);
        me.FilteredSPVideos = ko.observableArray([]);
        me.SelectedVideosFromFilter = ko.observableArray([]);
        me.SmartPlaylistVideos = ko.observableArray([]);
        me.CloudListData = ko.observableArray([]);
        
        me.SortType = ko.observable('desc');

        me.GetPlaylistType = function (param) {
            if (param == null || param == '' || param == 'EXPLICIT') {
                return 'Manual Playlist';
            }
            else {
                return 'Smart Playlist';
            }
        };
        me.GetPlaylistTypeForSort = function (param) {
            if (param == null || param == '' || param == 'EXPLICIT') {
                return 'manual';
            }
            else {
                return 'smart';
            }
        };
        me.ShortenIDList = function (param) {
            var idlist = param.split(',');

            if (idlist != null && idlist.length > 4) {
                var trimmedlist = [];
                trimmedlist = idlist.splice(0, 4);
                param = trimmedlist.join(',');
                param += '...';
            }

            return param;
        };
        me.GetVideoItem = function (itemid) {
            if (itemid.length < 1)
                return item;

            var match = ko.utils.arrayFirst(me.AllSPVideos(), function (item) {
                return item.VideoID() === itemid;
            });

            return match;
        };
        me.EditPlaylist = function (ViewData, Event) {
            $('.newPlaylistModal').modal('show');
            modalEditMode();
        };
        me.GetReadToken = function (param) {
            //Get the corresponding write tokens for each of the accounts listed in the dropdown
            var tokens = param.ReadTokens();
            if (tokens != null && tokens.length > 0) {
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].toLowerCase().indexOf('ead-') > -1) {
                        var tok = tokens[i].split('ead-');
                        return tok[1];
                    }
                }
            }
            return '';
        };
        me.GetWriteToken = function (param) {
            //Get the corresponding write tokens for each of the accounts listed in the dropdown
            var tokens = param.ReadTokens();
            if (tokens != null && tokens.length > 0) {
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].toLowerCase().indexOf('rite-') > -1) {
                        var tok = tokens[i].split('rite-');
                        return tok[1];
                    }
                }
            }
            return '';
        };
        me.AddClickEventsToPage = function () {
            $('#tblPlaylists .name---').click(function () {
                //alert('test test test');

                var vids = $(this).data('vids');
                var elem = $(this);

                BrightCove.BCApp.SharePoint.ListUtilities.GetBCVideosByID(vids,
                    function (elem) {
                        me.VideoListData(ko.mapping.fromJS(SPContext.DataStore2)());

                        $('#txtName').val(elem.text());
                        $('#pid').text(elem.data('pid'));
                        $('.accountLabel').text($('#ddlSelectAccount > option:selected').text());
                        $('.newPlaylistModal').modal('show');
                        modalEditMode();

                        $('.manualListControl .availableVideos .video').unbind().click(function () {
                            $(this).toggleClass('selected');
                        });

                        $('#btnRight').click(function () {
                            $('.manualListControl .availableVideos .video.selected').remove().appendTo('.newPlaylist');
                            $('.newPlaylist .video').removeClass('selected');
                            newPlaylistClick();
                            return false;
                        });

                        $('#btnLeft').click(function () {
                            $('.newPlaylist .video.selected').remove().appendTo('.manualListControl .availableVideos');
                            $('.manualListControl .availableVideos .video').removeClass('selected');
                            availableVideosClick();
                            return false;
                        });
                    }, elem);
            });
            
        };
        me.SavePlaylist = function () {
            var me = this;
            var selected = $('#ddlSelectAccount option:selected');
            if (selected.length > 0) {
                var account = new BrightCove.BCApp.DataStructures.AccountData();
                account.AccountId = $(selected).val();
                account.ClientId = $(selected).data('client-id');
                account.ClientSecret = $(selected).data('client-secret');

                BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                        account,
                        me.SavePlaylistInner,
                        arguments);
            }
        }
        me.SavePlaylistInner = function () {
            token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            var account_id = $('#ddlSelectAccount option:selected').val();
            var dataString = '';

            var plid = $('#pid').text();
            var plname = $('#txtName').val();
            var playlistType = $('#ddlNewType > option:selected').text();
            
            if (plname == '')
            {
                alert('Please enter a playlist name');
                return;
            }

            if (playlistType == 'Smart' && $('#smartTags').val() == '') {
                alert('Please enter the tag values that are needed');
                return;
            }

            {
                var plname = $('#txtName').val();
                var pldescription = $('#txtDescription').val();
                var playlistType = $('#ddlNewType > option:selected').text();

                if (playlistType == 'Smart') {

                    //smartSortOder
                    var smartTags = $('#smartTags').val();
                    var smartPLCondition = $('#uxSmartPlaylistContains > option:selected').val();
                    var smartSortOder = $('#smartSortOder > option:selected').val();
                    var smartLimit = $('#smartPageSize').val();

                    if (smartLimit > 0) {
                        smartLimit = parseInt(smartLimit)
                    } else {
                        smartLimit = 100;
                    }

                    var smartTagsArray = smartTags.split(',');
                    var tagValue = (smartPLCondition == "all" ? "+" : "") + "tags:\"" + smartTagsArray.join('","') + "\"";

                    var playListData = {
                        "description": pldescription,
                        "name": plname,
                        "type": smartSortOder,
                        "limit": smartLimit,
                        "search": tagValue,
                        "video_ids": null
                    }

                    dataString = JSON.stringify(playListData);
                } else {
                    var videoList = [];

                    $('.newPlaylist .title').each(function () {
                        var refId = $(this).data('referenceid');

                        if (refId == null || refId == undefined) {
                            refId = $(this).data('videoid');
                        }
                        
                        if (refId != null && refId != undefined)
                            videoList.push(refId.toString());
                    });

                    var playListData = {
                        "description": pldescription,
                        "name": plname,
                        "type": "EXPLICIT",
                        "video_ids": videoList
                    }

                    dataString = JSON.stringify(playListData);
                }
            }
            
            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/playlists' + (plid != '' ? '/' + plid : '');

            $.ajax({
                url: apiUrl,
                method: (plid != '' ? 'PATCH' : 'POST'),
                data: dataString,
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    alert('The playlist has been saved.');

                    $('.newPlaylistModal').modal('hide');

                    BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCPlaylists(function (results) {

                        me.PlayListData(null);
                        me.PlayListData(ko.mapping.fromJS(results)());

                        $('.playlistItems').click(function () {
                            me.LoadPlaylistEditor($(this));
                        });
                    }, '');
                },
                error: function (e) {
                    alert('Error saving playlist... '
                        + e.toString());
                }
            });

            //BrightcoveUpload('addEdit', function () {
            //    alert('The submitted playlist data will be available in a few minutes after '
            //            + '\nBrightcove has processed the information.');

            //    $('.newPlaylistModal').modal('hide');
            //    $('#txtName').val('');
            //    $('#txtDescription').val('');
            //    //BrightCove.BCApp.Utilities.PageRefresh();
            //});

        };
        me.DeletePlaylist = function () {
            var me = this;
            var selected = $('#ddlSelectAccount option:selected');
            if (selected.length > 0) {
                var account = new BrightCove.BCApp.DataStructures.AccountData();
                account.AccountId = $(selected).val();
                account.ClientId = $(selected).data('client-id');
                account.ClientSecret = $(selected).data('client-secret');

                BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                        account,
                        me.DeletePlaylistInner,
                        arguments);
            }
        };
        me.DeletePlaylistInner = function () {
            token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            var account_id = $('#ddlSelectAccount option:selected').val();
            var plname = $('#txtName').val();

            if (me.CurrentPlayListData() == null) {
                alert('Please select a playlist from the list area.');
                return;
            }

            var playListId = me.CurrentPlayListData().ID();
            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/playlists/' + playListId;
            
            $.ajax({
                url: apiUrl,
                type: 'DELETE',
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    alert('The selected playlist has been deleted.');

                    $('.newPlaylistModal').modal('hide');

                    BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCPlaylists(function (results) {

                        me.PlayListData(null);
                        me.PlayListData(ko.mapping.fromJS(results)());

                        $('.playlistItems').click(function () {
                            me.LoadPlaylistEditor($(this));
                        });
                    }, '');
                },
                error: function (e) {
                    alert('Error deleting playlist... '
                        + e.toString());
                }
            });

            //BrightcoveUpload('delete', function () {
            //    alert('The submitted playlist data will be deleted in a few minutes after '
            //            + '\nBrightcove has processed the information.');

            //    $('.newPlaylistModal').modal('hide');
            //});

        

        }
        me.AccountChanged = function () {
            alert('test');
        };
        me.PreviewSmartlist = function () {
            var me = this;
            var selected = $('#ddlSelectAccount option:selected');
            if (selected.length > 0) {
                var account = new BrightCove.BCApp.DataStructures.AccountData();
                account.AccountId = $(selected).val();
                account.ClientId = $(selected).data('client-id');
                account.ClientSecret = $(selected).data('client-secret');

                BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                        account,
                        me.PreviewSmartlistInner,
                        arguments);
            }
        };
        me.PreviewSmartlistInner = function () {
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            var account_id = $('#ddlSelectAccount option:selected').val();
            var searchText = $('#smartTags').val();
            var splitTerms = searchText.split(',');
            var conditionalOperator = $('#uxSmartPlaylistContains > option:selected').val().toLowerCase();
            var pageSize = $('#smartPageSize').val();

            if (pageSize.length < 1) {
                pageSize = 5;
            }

            if (splitTerms != null && splitTerms.length > 0) {
                $(splitTerms).each(function (index, val) {
                    splitTerms[index] = val;
                });
                if (conditionalOperator == "all") {
                    // all
                    var combined = "+tags:" + splitTerms.join(' +tags:');
                    searchText = encodeURI(combined).replace(/\+/g, "%2B");
                } else {
                    // any
                    var combined = "tags:" + splitTerms.join(',');
                    searchText = encodeURI(combined).replace(/\+/g, "%2B");
                }
            }
            
            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/videos';

            if (searchText != '' && searchText.length > 1) {
                apiUrl += "?limit=" + pageSize;
                apiUrl += "&q=" + searchText;
                apiUrl += "&sort=name";
            }

            $.ajax({
                url: apiUrl,
                async: false,
                cache: false,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    if (json != null && json.length > 0) {
                        var vids = [];

                        $(json).each(function (index, item) {
                            var newData = new BrightCove.BCApp.DataStructures.VideoData();

                            newData.VideoTitle = item.name;
                            newData.VideoID = item.id;
                            newData.VideoThumbNail = (item.images.thumbnail != null ? item.images.thumbnail.src : "../images/video.png");
                            newData.VideoShortDescription = item.description;
                            newData.VideoStartDate = item.starts_at;
                            newData.VideoEndDate = item.ends_at;
                            newData.Keywords = (item.tags != null && item.tags.length > 0) ? item.tags.join(',') : '';

                            vids.push(newData);
                        });

                        var json = ko.mapping.toJS(vids);
                        me.SmartPlaylistVideos(ko.mapping.fromJS(json)());

                    }
                    else {
                        //alert('');
                        alert('The requested video was not found. Please upload a new Brightcove video to associate with this SharePoint item.');
                    }
                },
                error: function (e) {
                    alert('Error retrieving video from Brightcove...cannot proceed with video update. '
                        + e.toString());
                }
            });
        };
        me.LoadPlaylistEditor = function (refElem) {
            //Clear the existing fields
            $('#txtName').val('');
            $('#txtDescription').val('');
            $('#smartPageSize').val('5');
            //$('#txtDescription').val('');

            //Load the fields with the object values
            var selectedVal = $('#ddlSelectAccount > option:selected').val();

            if (selectedVal == '') {
                alert('An account must be selected before proceeding.');
                return;
            }
            
            $('.newPlaylist').html();
            $('#pid').text('');
            $('.accountLabel').text($('#ddlSelectAccount > option:selected').text());

            $('.newPlaylistModal').modal('show');

            if (refElem != null && refElem.data != undefined) {
                BrightCove.BCApp.Pages.PageData.LoadedPlaylistVideos = false;
                var pid = refElem.data('pid');
                $('#pid').text(pid);
                var currentPL = BrightCove.BCApp.Utilities.GetPlaylistByID(pid, me.PlayListData());
                me.CurrentPlayListData(currentPL);
                $('#myModalLabel > span').html('Edit Playlist');
                $('#txtName').val(refElem.data('name'));
                $('#txtDescription').val(me.CurrentPlayListData().ShortDescription());
                modalEditMode();

                var playlistType = me.CurrentPlayListData().PlaylistType();

                if (playlistType == 'EXPLICIT') {
                    $('#ddlNewType').val('Manual');
                    $('#ddlNewType').change();

                    //var selectedVids = me.CurrentPlayListData().VideoIDs().split(',');
                    //var selectedHtml = '';

                    //$(selectedVids).each(function (ind, item) {
                    //    //alert('div[data-videoid="' + item + '"]');
                    //    var vidItem = $('.manualListControl .availableVideos div.video[data-referenceid="' + item + '"]');
                    //    if (vidItem != null && vidItem.length > 0) {
                    //        selectedHtml += vidItem[0].outerHTML;
                    //        vidItem.remove();
                    //    }
                    //});
                    //$('.newPlaylist').html(selectedHtml);

                    //$('.manualListControl .newPlaylist .video').unbind().click(function () {
                    //    if ($('#cbxMove').is(':checked')) {
                    //        $('.newPlaylist .video').removeClass('selected');
                    //        $(this).addClass('selected');
                    //    }
                    //    else {
                    //        $(this).toggleClass('selected');
                    //    }
                    //});
                }
                else {
                    $('.availableVideos .video').remove();
                    $('#ddlNewType').val('Smart');
                    $('#ddlNewType').change();
                    $('#uxSmartPlaylistContains').val(me.CurrentPlayListData().TagInclusionRule());
                    $('#smartTags').val(me.CurrentPlayListData().Tags());
                    $('#smartSortOder').val(playlistType);
                    $('#smartPageSize').val(me.CurrentPlayListData().Limit());
                }

            }
            else {
                $('.availableVideos .video').remove();
				// set smart fields:
                $('#uxSmartPlaylistContains').val($("#uxSmartPlaylistContains option:first").val());
                $('#smartTags').val('');
                $('#smartSortOder').val($("#smartSortOder option:first").val());
                $('#smartPageSize').val(5);

                $('.newPlaylist div.video').appendTo(".availableVideos");
                $('.modal-title > span').html('Add New Playlist');
                me.CurrentPlayListData(null);
                modalNewMode();
            }

            //UI Behaviour
            $('.manualListControl .availableVideos .video').unbind().click(function () {
                $(this).toggleClass('selected');
            });

            $('#btnRight').click(function () {
                $('.manualListControl .availableVideos .video.selected').remove().appendTo('.newPlaylist');
                $('.newPlaylist .video').removeClass('selected');
                newPlaylistClick();
                return false;
            });

            $('#btnLeft').click(function () {
                $('.newPlaylist .video.selected').remove().appendTo('.manualListControl .availableVideos');
                $('.manualListControl .availableVideos .video').removeClass('selected');
                availableVideosClick();
                return false;
            });

            me.SearchPlayListVideosBtnClick();
        };

        me.AvailableVideoSearchBtnClick = function (ViewData, Event) {
            $('.searchCancel').remove();
            var term = $('.txtSearchVideos').val().toLowerCase();
            $('.availableVideos').prepend('<div class="searchCancel">Search: <b>' + term + '</b> <a class="btnSearchCancel">Cancel</a> </div>');
            me.SearchPlayListVideosBtnClick();
            addSearchCancel();
            
            return false;
        };
        me.SearchPlayListVideosBtnClick = function (ViewData, Event) {

            var selected = $('#ddlSelectAccount option:selected');
            if (selected.length > 0) {
                var account = new BrightCove.BCApp.DataStructures.AccountData();
                account.AccountId = $(selected).val();
                account.ClientId = $(selected).data('client-id');
                account.ClientSecret = $(selected).data('client-secret');

                BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                    account,
                    me.SearchPlayListVideosBtnClickInner,
                    arguments);
            }

        };
        me.SearchPlayListVideosBtnClickInner = function (ViewData, Event) {
            var selectedAccount = $('#ddlSelectAccount option:selected');
            var account_id = $(selectedAccount).val();

            var searchText = $('.txtSearchVideos').val();

                var splitTerms = searchText.split(' ');

                if (splitTerms != null && splitTerms.length > 0) {
                    searchText = splitTerms.join('+%2B');
                }

                var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/videos';

                if (searchText != '' && searchText.length > 1) {
                    apiUrl += '?limit=1000';
                    apiUrl += '&q=%2B' + searchText;
                    apiUrl += '&sort=name';
                }
                else {
                    apiUrl += '?limit=1000';
                    apiUrl += '&sort=name';
                }

                var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);

                $.ajax({
                    url: apiUrl,
                    async: false,
                    cache: false,
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    success: function (json) {
                        
                        if (json != null && json.length > 0) {
                            var cloudVids = [];
                            me.CloudListData(null);
                            $(json).each(function (index, apiItem) {
                                var newData = BrightCove.BCApp.Utilities.CreateBasicVideoObjectFromAPIItem(apiItem);
                                cloudVids.push(newData);
                            });

                            var videoListJSON = ko.mapping.toJS(cloudVids);
                            me.CloudListData(ko.mapping.fromJS(videoListJSON)());
                            me.FilteredSPVideos(ko.mapping.fromJS(videoListJSON)());
                            
                            if (BrightCove.BCApp.Pages.PageData.LoadedPlaylistVideos == false) {

                                var selectedVids = me.CurrentPlayListData().VideoIDs().split(',');
                                //var selectedHtml = '';

                                $(selectedVids).each(function (ind, item) {
                                    var vidItem = $('.manualListControl .availableVideos div.video[data-referenceid="' + item + '"]');
                                    var playlistVidItem = $('.newPlaylist div.video[data-referenceid="' + item + '"]');

                                    // is the video in the main pool?
                                    var existsInPool = (vidItem != null && vidItem.length > 0);
                                    // is the video in the playlist pool?
                                    var existsInPlaylist = (playlistVidItem != null && playlistVidItem.length > 0);
                                    
                                    if (existsInPlaylist) { // no action

                                    } else {
                                        if (existsInPool) {     // if so, move to playlist
                                            $(vidItem).appendTo(".newPlaylist");
                                        }
                                    }
                                });

                                var playlistVideos = $('.newPlaylist div.video');
                                for (i = 0; i < playlistVideos.length; i++) {
                                    var playlistVideo = playlistVideos[i];
                                    var videoId = $(playlistVideo).data("videoid");

                                    var isVideoInPlayList = $.inArray(videoId.toString(), selectedVids) > -1;
                                    if (!isVideoInPlayList) {
                                        // move back to pool
                                        $(playlistVideo).appendTo(".manualListControl .availableVideos");
                                    }
                                }

                                BrightCove.BCApp.Pages.PageData.LoadedPlaylistVideos = true;
                            } else {
                                // filter out the items selected
                                $('.manualListControl .newPlaylist .video').each(function (ind, selectedVideo) {
                                    var selectedVideoId = $(selectedVideo).first().data('videoid');
                                    $('.availableVideos .video').each(function (index, availableVideo) {
                                        var availableVideoId = $(availableVideo).first().data('videoid');
                                        if (selectedVideoId == availableVideoId) {
                                            $(availableVideo).remove();
                                        }
                                    });
                                });
                            }
                        }
                        
                    },
                    error: function (e) {
                        alert('Error retrieving videos from Brightcove...cannot proceed with video update. '
                            + e.toString());
                    }
                });
            
        };














        me.SortList = function (ViewData, Event) {
            
            var element = $(Event.currentTarget);
            var fieldType = element.data('sf');
            function CopyLists() {
                $('#sorted').html($('#databound').html());
                $('#databound').hide();
                $('#sorted').show();
                $('#sorted .playlistItems').click(function () {
                    me.LoadPlaylistEditor($(this));
                });
            }
            
            switch (fieldType) {
                case 'name':
                    CopyLists();
                    if(me.SortType() == 'asc'){
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByNameAscending)
                            .appendTo("#sorted");
                        me.SortType('desc');
                    } else {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByNameDescending)
                            .appendTo("#sorted");
                        me.SortType('asc');
                    }
                    break;
                case 'desc':
                    CopyLists();
                    if (me.SortType() == 'asc') {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByDescAscending)
                            .appendTo("#sorted");
                        me.SortType('desc');
                    } else {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByDescDescending)
                            .appendTo("#sorted");
                        me.SortType('asc');
                    }
                    break;
                case 'type':
                    CopyLists();
                    if (me.SortType() == 'asc') {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByTypeAscending)
                            .appendTo("#sorted");
                        me.SortType('desc');
                    } else {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByTypeDescending)
                            .appendTo("#sorted");
                        me.SortType('asc');
                    }
                    break;
                case 'id':
                    CopyLists();
                    if (me.SortType() == 'asc') {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByIDAscending)
                            .appendTo("#sorted");
                        me.SortType('desc');
                    } else {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByIDDescending)
                            .appendTo("#sorted");
                        me.SortType('asc');
                    }
                    break;
            }
        };
        me.FilterVideosByCurrentAccount = function () {
            var fullVideoItemsData = ko.mapping.fromJS(ko.mapping.toJS(me.AllSPVideos()));
            //me.FullVideoListData(fullVideoItemsData);
            var filter = $('#ddlSelectAccount > option:selected').text();

            var filteredItems = ko.utils.arrayFilter(fullVideoItemsData(), function (item) {
                return item.Account() == filter;
            });
            me.FilteredSPVideos(filteredItems);

            function DeleteVideoItem(itemid) {
                if (itemid == null || itemid.length < 1)
                    return false;
                me.FilteredSPVideos.remove(function (item) {
                    return item.VideoID() == itemid;
                });
            };
            
            var filterVidsCopy = me.FilteredSPVideos();
            $(filterVidsCopy).each(function (ind, item) {
                if (item.ReferenceID() == null
                    || item.ReferenceID() == undefined
                    || item.ReferenceID().length < 1) {

                    DeleteVideoItem(item.VideoID());
                }
            });
        };
        $('#ddlSelectAccount').change(function () {
            // clear token
            BrightCove.BCApp.Utilities.DeleteCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);

            $('#databound').show();
            $('#sorted').html('').hide();
                var currentAccount = $(this).find('option:selected').text();
                var readToken = $(this).find('option:selected').val();
                if (readToken != '') {
                    BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCPlaylists(function (results) {
                        //Get the videos for the selected account
                        playListData = results;
                        me.PlayListData(null);
                        me.PlayListData(ko.mapping.fromJS(playListData)());

                        $('.playlistItems').click(function () {
                            me.LoadPlaylistEditor($(this));
                        });
                    }, readToken);
                } else {
                    me.PlayListData(null);
                    me.PlayListData(ko.mapping.fromJS([])());
                }
        });
        /*************************************************************/
        /*Brightcove Functions*/
        /*************************************************************/
        function BrightcoveUpload(mode, callBackFunction) {
            var jview = $('#JSONView');
            var plname = $('#txtName').val();
            var pldescription = $('#txtDescription').val();

            jview.attr('name', 'json').attr('id', 'json');
            $('#create_playlist').attr('enctype', '');

            var vidsArr = [];

            $('.newPlaylist .title').each(function () {
                var refId = $(this).data('referenceid');

                if (refId == null || refId == undefined) {
                    refId = $(this).data('videoid');
                }
                else {
                    refId = '"' + refId + '"';
                }

                if (refId != null && refId != undefined && refId.length > 0)
                    vidsArr.push(refId);
            });

            var selectedVids = vidsArr.join(',');
            var selectedToken = $('#ddlSelectAccount > option:selected').data('write-token');

            //var options = "OLDEST_TO_NEWEST" | "NEWEST_TO_OLDEST" | "START_DATE_OLDEST_TO_NEWEST"
            //    | "START_DATE_NEWEST_TO_OLDEST" | "ALPHABETICAL" | "PLAYS_TOTAL" | "PLAYS_TRAILING_WEEK";
            var playlistType = $('#ddlNewType > option:selected').text();
            var smartTags = $('#smartTags').val();
            var smartPLCondition = $('#uxSmartPlaylistContains > option:selected').val();
            var smartSortOder = $('#smartSortOder > option:selected').val();
            var totalVideos = $('#smartPageSize').val();

            var jval = '';

            if (mode == 'addEdit') {
                if (me.CurrentPlayListData() == null) {
                    if (playlistType == 'Manual') {
                        jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.CreatePlaylist(plname,
                            selectedVids, pldescription, selectedToken);
                    }
                    else {
                        jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.CreateSmartPlaylist(plname,
                            pldescription, smartTags,
                            smartPLCondition, smartSortOder, totalVideos, selectedToken);
                    }
                }
                else {
                    if (playlistType == 'Manual') {
                        jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.UpdatePlaylist(plname,
                            me.CurrentPlayListData().ID(), pldescription,
                            selectedVids, selectedToken);
                    }
                    else {
                        jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.UpdateSmartPlaylist(plname,
                            pldescription, me.CurrentPlayListData().ID(), smartTags,
                            smartPLCondition, smartSortOder, totalVideos, selectedToken);
                    }
                }
            }
            else if (mode == 'delete') {
                jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.DeletePlaylist(
                    me.CurrentPlayListData().ID(),
                    selectedToken);
            }

            jview.val(jval);

            $('#create_playlist').attr('action', BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL);
            $('#create_playlist').submit();

            if (callBackFunction != null)
                callBackFunction();
        }

        /*************************************************************/
        /*UI Functions*/
        /*************************************************************/
        
        var unsetMoveButtons = function () {
            $('#btnUp').unbind().attr('disabled', true);
            $('#btnDown').unbind().attr('disabled', true);
        }
        var modalEditMode = function () {
            //load data
            $('#ddlNewType').change();
            $('.modal-header h4 span').html('Edit Playlist');
            $('.newPlaylistModal .editMode').show();
        }
        var modalNewMode = function () {
            $('.modal-header h4 span').html('Add New Playlist');
            $('.newPlaylistModal .editMode').hide();
        }
        var setMoveButtons = function () {
            $('#btnUp').click(function () {
                var current = $('.newPlaylist .selected');
                current.prev().before(current);
            });
            $('#btnDown').click(function () {
                var current = $('.newPlaylist .selected');
                current.next().after(current);
            });
            $('#btnUp').attr('disabled', false);
            $('#btnDown').attr('disabled', false);
        };

        var returnData = BrightCove.BCApp.SharePoint.ListUtilities.GetAccounts(SPContext.UserId(),
            BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);

        ko.mapping.fromJSON(returnData, {}, me);

        var currentAccount = me.AccountListData()[0];

        /*************************************************************/
        /*Security Functions*/
        /*************************************************************/
        me.DeleteItem = function (itemid) {
            if (itemid == null || itemid.length < 1)
                return false;
            me.AccountListData.remove(function (item) {
                return item.PropertyId() == itemid;
            });
        };
        var validatedAccounts = me.AccountListData();
        $(validatedAccounts).each(function (ind, item) {
            //alert(item.AccountViewersGroupName());
            try {
                if (item != null && item.AccountAuthorsGroupName != undefined
                    && item.AccountViewersGroupName() != '') {
                    BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountViewersGroupName(),
                        function (UserBelongsToGroup) {
                            if (!UserBelongsToGroup) {
                                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountAuthorsGroupName(),
                        function (UserBelongsToGroup) {
                            if (!UserBelongsToGroup) {
                                //validatedAccounts.push(item);
                                me.DeleteItem(item.PropertyId());
                            }
                        });

                            }
                        });
                }
            }
            catch (err) {
                me.DeleteItem(item.PropertyId());
            }
        });
    }
};

//**************************************************************************************************
//Data Functions
//**************************************************************************************************    
BrightCove.BCApp.DataStructures = {
    AccountData: function () {
        PropertyName = '';
        PropertyId = '';
        AccountAuthorsGroup = '';
        AccountViewersGroup = '';
        AccountAuthorsGroupName = '';
        AccountViewersGroupName = '';
        DefaultVideoPlayerId = '';
        DefaultPlaylistPlayerId = '';
        TemporaryStorageLocation = '';
        AWSAccessKeyId = '';
        AWSSecretAccessKey = '';
        AWSBucketName = '';
        DropboxAccessToken = '';
        AccountId = '';
        ClientId = '';
        ClientSecret = '';
        ReadTokens = [''];
        WriteTokens = [''];

        return this;
    },
    VideoData: function () {
        VideoTitle = 'New Video Item';
        Account = '';
        SPID = 'BCSP-1';
        VideoID = '';
        VideoThumbNail = '';
        VideoStillImage = '';
        VideoLongDescription = '';
        VideoShortDescription = '';
        RelatedLink = '';
        RelatedLinkText = '';
        ReferenceID = '';
        VideoStartDate = '';
        VideoEndDate = '';
        Keywords = '';
        Economics = '';
        Active = '';
        UsageRestriction = '';
        CommunicationChannel = '';
        //BusinessUnit = '';
        Organization = '';
        Geography = '';
        Capability = '';
        Industry = '';
        Methodology = '';
        Language = '';
        //ClosedCaptioning = '';
        News = '';
        VideoContact = '';
        Publisher = '';
        CreatedDate = '';
        DateRecorded = '';
        PublishedDate = '';
        ExpirationDate = '';
        DateModified = '';
        TextTracks = [];
        return this;
    },
    PlaylistData: function () {
        Title = '';
        Thumbnail = '';
        ShortDescription = '';
        PublishDate = '';
        StartDate = '';
        EndDate = '';
        Type = '';
        ID = '';
        ReferenceID = '';
        Keywords = '';
        VideoIDs = '';
        VideoData = [];
        TagInclusionRule = '';
        Tags = '';
        PlaylistType = '';
        Limit = 5;
        return this;
    }
};

BrightCove.BCApp.SharePoint = {
    ControlUtilities: {
        //Get Taxonomy ControlObject value
        //webTaggingId - TaxonomyWebTaggingControl ID  
        getTaxonomyControlObjectValue: function (webTaggingId) {
            var webTaggingCtl = $('span[containerid=' + webTaggingId + '] > div.ms-taxonomy').get(0);
            var taxCtlObj = new Microsoft.SharePoint.Taxonomy.ControlObject(webTaggingCtl);
            var termValue = taxCtlObj.getRawText();
            return termValue;
        },
        setTaxonomyControlObjectValue: function (webTaggingId, value) {
            var webTaggingCtl = $('span[containerid=' + webTaggingId + '] > div.ms-taxonomy').get(0);
            var taxCtlObj = new Microsoft.SharePoint.Taxonomy.ControlObject(webTaggingCtl);
            taxCtlObj.setRawText(value);
            taxCtlObj.retrieveTerms();
        },
        setUserPickerValue: function (fieldName, value) {
            // fieldName = "VideoContact";
            var ppDiv = $('div.sp-peoplepicker-topLevel[id*="' + fieldName + '"]');
            var spPP = SPClientPeoplePicker.SPClientPeoplePickerDict[$(ppDiv).attr('id')];
            var ppEditor = ppDiv.find('input.sp-peoplepicker-editorInput');
            ppEditor.val(value.get_lookupValue());
            spPP.AddUnresolvedUserFromEditor(true);
        }
    },
    ListUtilities: {
        //Get Items
        GetListItem: function (ListItemName, CallBackFunction, me) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(ListItemName);
            
            var camlQuery = new SP.CamlQuery();

            function onGetListSucceeded(sender, args) {
                if (BrightCove.BCApp.Pages.PageData.Temp2 != null) {
                    BrightCove.BCApp.Pages.PageData.SiteId = BrightCove.BCApp.Pages.PageData.Temp2.get_id().toString().replace(/-/gi, "");
                }
                // get proxy URL
                if (BrightCove.BCApp.Pages.PageData.Temp != null) {
                    var settingItemEnumerator = BrightCove.BCApp.Pages.PageData.Temp.getEnumerator();

                    while (settingItemEnumerator.moveNext()) {
                        var settingItem = settingItemEnumerator.get_current();
                        var proxyUrl = settingItem.get_item('ProxyUrl');
                        BrightCove.BCApp.Constants.BrightCoveURLConstants.ProxyURL = proxyUrl;
                        break;
                    }
                }
                this.GetADGroups();

                //Get the current working page
                var pageName = BrightCove.BCApp.Utilities.GetCurrentPageName();

                //Initialize the menus and breadcrumbs
                BrightCove.BCApp.Menus.Initialize(pageName);

                //Invoke the main page event
                BrightCove.BCApp.Initialize.InitializePageLoadEvent(pageName);
            }

            function onGetVideosListSucceeded(sender, args) {
                SPContext.ViewObject().LoadData();
            }
            function onGetListFailed(sender, args) {
                alert('Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            }

            switch (ListItemName) {
                case BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts:
                    var settingsList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList);
                    var settingsListCamlQuery = new SP.CamlQuery();
                    settingsListCamlQuery.set_viewXml('<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
                        '<Value Type=\'Number\'>1</Value></Geq></Where></Query><RowLimit>1</RowLimit></View>');
                    BrightCove.BCApp.Pages.PageData.Temp = settingsList.getItems(settingsListCamlQuery);
                    cContext.load(BrightCove.BCApp.Pages.PageData.Temp);

                    camlQuery.set_viewXml(
                        '<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
                        '<Value Type=\'Number\'>1</Value></Geq></Where></Query>' +
                        '<RowLimit>100000</RowLimit></View>'
                    );
                    SPContext.DataStore = oList.getItems(camlQuery);
                    cContext.load(SPContext.DataStore);

                    BrightCove.BCApp.Pages.PageData.Temp2 = parentWeb;
                    cContext.load(BrightCove.BCApp.Pages.PageData.Temp2);

                    cContext.executeQueryAsync(
                        Function.createDelegate(this, onGetListSucceeded),
                        Function.createDelegate(this, onGetListFailed)
                    );
                    break;
                case BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList:
                    SPContext.DataStore2 = oList.getItems(camlQuery);
                    cContext.load(SPContext.DataStore2);

                    cContext.executeQueryAsync(
                        Function.createDelegate(this, onGetVideosListSucceeded),
                        Function.createDelegate(this, onGetListFailed)
                    );
                    break;
            }

            if (CallBackFunction != null)
                CallBackFunction(me);
        },
        GetAccounts: function (CallBackFunction, AddEmptyFirstElement) {
            if (SPContext.DataStore.getEnumerator == undefined) {
                location.href = location.href;
                return false;
            }

            //Show the main page content after everything is loaded
            BrightCove.BCApp.Utilities.ShowMainPageContent();

            var SPData = {
                AccountListData: []
            };

            var listItemInfo = '';
            var listItemEnumerator = SPContext.DataStore.getEnumerator();

            if (AddEmptyFirstElement) {
                var newData = new BrightCove.BCApp.DataStructures.AccountData();
                newData.PropertyName = 'Select an Account';
                newData.PropertyId = '';
                newData.AccountAuthorsGroup = '';
                newData.AccountViewersGroup = '';
                newData.AccountAuthorsGroupName = '';
                newData.AccountViewersGroupName = '';
                newData.DefaultVideoPlayerId = '';
                newData.DefaultPlaylistPlayerId = '';
                newData.TemporaryStorageLocation = '';
                newData.AWSAccessKeyId = '';
                newData.AWSSecretAccessKey = '';
                newData.AWSBucketName = '';
                newData.DropboxAccessToken = '';
                newData.AccountId = '';
                newData.ClientId = '';
                newData.ClientSecret = '';
                newData.ReadTokens = [];
                newData.WriteTokens = [];

                SPData.AccountListData.push(newData);
            }

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                //listItemInfo += '<li>' + '\nTitle: ' + oListItem.get_item('id') + ' ' + oListItem.get_item('Title') + '</li>';

                var newData = new BrightCove.BCApp.DataStructures.AccountData();
                newData.PropertyName = oListItem.get_item('Title');
                newData.PropertyId = oListItem.get_item('ID');
                newData.AccountAuthorsGroup = oListItem.get_item('AuthorsGroupID');
                newData.AccountViewersGroup = oListItem.get_item('ViewersGroupID');
                newData.AccountAuthorsGroupName = oListItem.get_item('AccountAuthorsGroupName');
                newData.AccountViewersGroupName = oListItem.get_item('AccountViewersGroupName');
                newData.DefaultVideoPlayerId = oListItem.get_item('DefaultVideoPlayerId');
                newData.DefaultPlaylistPlayerId = oListItem.get_item('DefaultPlaylistPlayerId');
                newData.TemporaryStorageLocation = oListItem.get_item('TemporaryStorageLocation');
                newData.AWSAccessKeyId = oListItem.get_item('AWSAccessKeyId');
                newData.AWSSecretAccessKey = oListItem.get_item('AWSSecretAccessKey');
                newData.AWSBucketName = oListItem.get_item('AWSBucketName');
                newData.DropboxAccessToken = oListItem.get_item('DropboxAccessToken');
                newData.AccountId = oListItem.get_item('AccountId');
                newData.ClientId = oListItem.get_item('ClientId');
                newData.ClientSecret = oListItem.get_item('ClientSecret');

                var tokens = oListItem.get_item('Tokens');

                if (tokens != null && tokens.length > 0) {
                    newData.ReadTokens = tokens.split(',');//['111', '111', '111', '111', '111', '111'];
                    newData.WriteTokens = tokens.split(','); //['111b', '111b', '111b'];
                }
                else {
                    newData.ReadTokens = [];
                    newData.WriteTokens = [];
                }
                SPData.AccountListData.push(newData);
            }

            var jsonData = ko.toJSON(SPData);

            if (CallBackFunction != null && typeof (CallBackFunction) == "function")
                CallBackFunction();

            //return SPData.AccountListData;
            return jsonData;
        },

        //Add Items
        AddAccountItem: function (newData) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);
            var videoList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            var itemCreateInfo = new SP.ListItemCreationInformation();
            var oListItem = oList.addItem(itemCreateInfo);

            oListItem.set_item('Title', newData.PropertyName());
            oListItem.set_item('AccountAuthorsGroupName', newData.AccountAuthorsGroupName());
            oListItem.set_item('AccountViewersGroupName', newData.AccountViewersGroupName());
            oListItem.set_item('AuthorsGroupID', newData.AccountAuthorsGroupName());
            oListItem.set_item('ViewersGroupID', newData.AccountViewersGroupName());
            oListItem.set_item('DefaultVideoPlayerId', newData.DefaultVideoPlayerId());
            oListItem.set_item('DefaultPlaylistPlayerId', newData.DefaultPlaylistPlayerId());
            oListItem.set_item('TemporaryStorageLocation', newData.TemporaryStorageLocation());
            oListItem.set_item('AWSAccessKeyId', newData.AWSAccessKeyId());
            oListItem.set_item('AWSSecretAccessKey', newData.AWSSecretAccessKey());
            oListItem.set_item('AWSBucketName', newData.AWSBucketName());
            oListItem.set_item('DropboxAccessToken', newData.DropboxAccessToken());
            oListItem.set_item('AccountId', newData.AccountId());
            oListItem.set_item('ClientId', newData.ClientId());
            oListItem.set_item('ClientSecret', newData.ClientSecret());
            oListItem.set_item('Tokens', newData.ReadTokens().join());

            oListItem.update();

            this.AccountItem = oListItem;
            this.VideoListFields = videoList.get_fields();

            cContext.load(this.VideoListFields);

            cContext.executeQueryAsync(
                Function.createDelegate(this, this.onAddListItem),
                Function.createDelegate(this, this.onAddListItemFailed)
            );
        },
        AddVideoItem: function (videoData, CallBackFunction) {
            var currentAccount = $('#ddlSelectAccount option:selected');
            var account_item_id = $(currentAccount).data('item-id')

            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            var oListItem = new Object();
            var vid = (videoData.VideoID != undefined) ? videoData.VideoID() : 0;

            if (vid != null && vid > 0) {
                oListItem = oList.getItemById(vid);
            }
            else {
                var itemCreateInfo = new SP.ListItemCreationInformation();
                oListItem = oList.addItem(itemCreateInfo);
            }

            oListItem.set_item('Title', videoData.VideoTitle());
            oListItem.set_item('ReferenceID', videoData.ReferenceID());
            oListItem.set_item('ShortDescription', videoData.VideoShortDescription());
            oListItem.set_item('LongDescription', videoData.VideoLongDescription());
            if (videoData.VideoStartDate() != '') {
                oListItem.set_item('StartDate', new Date(BrightCove.BCApp.Utilities.ReplaceAll(videoData.VideoStartDate(), '-', '/')));
            }
            if (videoData.VideoEndDate() != '') {
                oListItem.set_item('EndDate', new Date(BrightCove.BCApp.Utilities.ReplaceAll(videoData.VideoEndDate(), '-', '/')));
            }
            oListItem.set_item('Economic', videoData.Economics());
            oListItem.set_item('Account', videoData.Account());
            oListItem.set_item('Active', (videoData.Active() == 'ACTIVE' ? 'true' : ''));
            oListItem.set_item('SPID', videoData.SPID());

            var keywordTags = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.GetTagObjectForCMSAPI(videoData.Keywords(), videoData.SPID(), account_item_id).join(',');
            oListItem.set_item('Keywords', keywordTags);

            var urlValue = new SP.FieldUrlValue();
            if (videoData.RelatedLink != null && videoData.RelatedLink != undefined) {
                urlValue.set_url(videoData.RelatedLink());
                urlValue.set_description(videoData.RelatedLinkText());
                oListItem.set_item('RelatedLink', urlValue);
            }

            var thumb = new SP.FieldUrlValue();
            if (videoData.VideoThumbNail != null && videoData.VideoThumbNail != undefined) {
                thumb.set_url(videoData.VideoThumbNail());
                thumb.set_description(videoData.VideoThumbNail());
                oListItem.set_item('VideoThumbnail', thumb);
            }

            var still = new SP.FieldUrlValue();
            if (videoData.VideoStillImage != null && videoData.VideoStillImage != undefined) {
                still.set_url(videoData.VideoStillImage());
                still.set_description(videoData.VideoStillImage());
                oListItem.set_item('VideoImage', still);
            }

            if (videoData.CustomFields != null) {
                for (i = 0; i < videoData.CustomFields.length; i++) {
                    var customField = videoData.CustomFields[i];
                    var fieldName = customField.Name;
                    var fieldValue = customField.Value;

                    oListItem.set_item(fieldName, fieldValue);
                }
            }
            

            oListItem.update();
            cContext.load(oList);
            cContext.load(oListItem);

            function onAddVideoItem() {
                console.log('SharePoint Video Item Updated');
                
                if (CallBackFunction != null)
                    CallBackFunction(oListItem);
            }
            function onAddListItemFailed(sender, args) {
                var msg = args.get_message();
                if (msg != null && msg.toLowerCase().indexOf("save conflict")) {
                    alert('Add failed. ' + msg +
                    '\n' + args.get_stackTrace());
                }
                else {
                    console.log(msg);
                }
            }

            cContext.executeQueryAsync(
                Function.createDelegate(this, onAddVideoItem),
                Function.createDelegate(this, onAddListItemFailed)
            );
        },


        getMultiTax: function(taxTerms) {
            var fieldVal = "";
            var termValues = taxTerms.split(';');
            var terms = new Array();
            if (termValues && termValues.length > 0) {
                for (i = 0; i < termValues.length; i++) {
                    terms.push("-1;#" + termValues[i]);
                }
                fieldVal = terms.join(";#");
            }
            return fieldVal;
        },
        UpdateVideoFields: function (accountId, fields, currentFields) {
            
            var customFieldPrefix = 'c.' + accountId.toString() + '.';
            var cContext = new SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            //Geting reference to the list
            oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            // Get field collection
            var fieldCollection = oList.get_fields();

            // iterate through current fields
            var fieldEnumerator = currentFields.getEnumerator();
            while (fieldEnumerator.moveNext()) {
                var oField = fieldEnumerator.get_current();
                var fieldName = oField.get_title();
                var customFieldForAccount = fieldName.indexOf(customFieldPrefix) == 0;

                if (customFieldForAccount) {
                    var customFieldName = fieldName.replace(customFieldPrefix, "");
                    var toBeAddedIndex = $.inArray(customFieldName, fields);
                    var toBeAdded = toBeAddedIndex > -1;

                    if (toBeAdded)
                    {
                        // remove from call to add
                        fields.splice(toBeAddedIndex, 1);
                    } else {
                        // need to remove
                        fieldCollection.getByTitle(fieldName).deleteObject();
                    }
                }
            }

            // add new fields
            for (var i = 0; i < fields.length; i++) {
                var fieldName = customFieldPrefix + fields[i];

                var f1 = cContext.castTo(
                                fieldCollection.addFieldAsXml('<Field Type="Text" DisplayName="' + fieldName + '" Name="' + fieldName + '" />', true, SP.AddFieldOptions.addFieldCheckDisplayName),
                                SP.FieldText);
                f1.set_title(fieldName);
                f1.set_description("");
                f1.update();
            }

            cContext.executeQueryAsync(
                Function.createDelegate(this, this.onUpdateVideoFieldsSucceeded),
                Function.createDelegate(this, this.onUpdateVideoFieldsFailed)
                );

        },
        onUpdateVideoFieldsSucceeded: function () {
            alert('SharePoint Item Updated');
            if (this.AddAccountFlag) {
                location.href = location.href;
            }
        },
        onUpdateVideoFieldsFailed: function (sender, args) {
            var msg = args.get_message();
            if (msg != null && msg.toLowerCase().indexOf("save conflict")) {
                alert('Add failed. ' + msg +
                '\n' + args.get_stackTrace());
            }
            else {
                console.log(msg);
            }
        },
        //Update Items
        UpdateListItem: function (newData) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);
            var videoList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            var oListItem = oList.getItemById(newData.PropertyId());
            oListItem.set_item('Title', newData.PropertyName());

            oListItem.set_item('AccountAuthorsGroupName', newData.AccountAuthorsGroupName());
            oListItem.set_item('AccountViewersGroupName', newData.AccountViewersGroupName());
            oListItem.set_item('AuthorsGroupID', newData.AccountAuthorsGroupName());
            oListItem.set_item('ViewersGroupID', newData.AccountViewersGroupName());
            oListItem.set_item('DefaultVideoPlayerId', newData.DefaultVideoPlayerId());
            oListItem.set_item('DefaultPlaylistPlayerId', newData.DefaultPlaylistPlayerId());
            oListItem.set_item('TemporaryStorageLocation', newData.TemporaryStorageLocation());
            oListItem.set_item('AWSAccessKeyId', newData.AWSAccessKeyId());
            oListItem.set_item('AWSSecretAccessKey', newData.AWSSecretAccessKey());
            oListItem.set_item('AWSBucketName', newData.AWSBucketName());
            oListItem.set_item('DropboxAccessToken', newData.DropboxAccessToken());
            oListItem.set_item('AccountId', newData.AccountId());
            oListItem.set_item('ClientId', newData.ClientId());
            oListItem.set_item('ClientSecret', newData.ClientSecret());
            oListItem.set_item('Tokens', newData.ReadTokens().join());

            oListItem.update();

            this.AccountItemId = newData.PropertyId();
            this.AccountItem = oListItem;
            this.VideoListFields = videoList.get_fields();

            cContext.load(this.VideoListFields);

            cContext.executeQueryAsync(
                Function.createDelegate(this, this.onUpdateListItem),
                Function.createDelegate(this, this.onUpdateListItemFailed)
            );
        },

        //Delete Items
        DeleteListItem: function (data) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);

            var oListItem = oList.getItemById(data.PropertyId());
            oListItem.deleteObject();

            cContext.executeQueryAsync(
                Function.createDelegate(this, this.onDeleteSucceeded),
                Function.createDelegate(this, this.onDeleteFailed)
            );
        },

        //to be removed        
        GetBCVideosByID: function (VideoIDs, CallBackFunction, refElem) {
            var SPData = {
                VideoListData: []
            };

            var url = "https://api.brightcove.com/services/library?command=find_videos_by_ids"
                    + "&video_ids=" + VideoIDs.replace(',', '%2C') //"2790007957001%2C1964441415001"
                    + "&video_fields=id%2Cname%2CshortDescription%2ClongDescription%2CcreationDate%2CpublishedDate%2ClinkURL%2ClinkText%2CvideoStillURL%2CvideoStill%2CthumbnailURL%2Cthumbnail%2CreferenceId%2Ceconomics%2CaccountId%2CitemState%2CstartDate%2CendDate&media_delivery=default"
                    + "&token=OSpK6k_-o4xQjnZCaMffnTCKSFzU4yUqwNvYrCk2K43PjG3e5EReLA..";

            var modalEditMode = function () {
                //load data
                $('#ddlNewType').change();
                $('.modal-header h4 span').html('Edit Playlist');
                $('.newPlaylistModal .editMode').show();
            }
            $.ajax({ 
                type: 'GET',
                url: url,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    if (json != null && json.items != null) {

                        $(json.items).each(function (index, item) {
                            var newData = new BrightCove.BCApp.DataStructures.PlaylistData();

                            newData.VideoTitle = item.name;
                            newData.VideoThumbNail = item.thumbnailURL;
                            newData.VideoShortDescription = item.shortDescription;
                            newData.VideoStartDate = item.creationDate;
                            newData.VideoEndDate = item.endDate;
                            newData.ReferenceID = item.referenceId;
                            newData.VideoID = item.id;

                            SPData.VideoListData.push(newData);
                        });
                        SPContext.DataStore2 = SPData.VideoListData;

                        if (CallBackFunction != null && CallBackFunction != undefined)
                            CallBackFunction(refElem);
                    }
                },
                error: function (e) {
                    alert('Error retrieving video ids from Brightcove... '
                        + e.toString());
                }
            });
        },

        //to be renamed
        GetPlaylistSPVideos: function (CallBackFunction, token) {
            var SPData = {
                VideoData: []
            };

            var listItemInfo = '';
            var listItemEnumerator = SPContext.VideosList.getEnumerator();

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();

                var newData = new BrightCove.BCApp.DataStructures.VideoData();
                
                $.when(
                    BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByTagID(oListItem.get_item('SPID'), token)
                ).done(function (param) {
                    var newData = BrightCove.BCApp.Utilities.CreateVideoObjectFromListItem(oListItem);
                    SPData.VideoData.push(newData);
                });
            }

            var jsonData = ko.mapping.toJS(SPData.VideoData);
            return jsonData;
        },
        GetVideos: function (CallBackFunction) {
            var SPData = {
                VideoData: []
            };

            var listItemInfo = '';
            try{
                var listItemEnumerator = SPContext.DataStore2.getEnumerator();

                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    var newData = BrightCove.BCApp.Utilities.CreateVideoObjectFromListItem(oListItem);//.then(function (data) {
                        //SPData.VideoData.push(newData);
                    //});

                    SPData.VideoData.push(newData);
                }
            }
            catch(err)
            {
                console.log(err);
            }

            var jsonData = ko.mapping.toJS(SPData.VideoData); 
            return jsonData;
        },
        GetVideosStrings: function (CallBackFunction) {
            var SPData = {
                VideoData: []
            };

            var listItemInfo = '';
            try {
                var listItemEnumerator = SPContext.DataStore2.getEnumerator();

                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    var newData = BrightCove.BCApp.Utilities.CreateVideoObjectFromListItem(oListItem);//.then(function (data) {
                    //SPData.VideoData.push(newData);
                    //});

                    SPData.VideoData.push(newData);
                }
            }
            catch (err) {
                console.log(err);
            }

            var jsonData = ko.mapping.toJS(SPData.VideoData);
            return jsonData;
        },

        //to be removed
        GetVideosForPlaylist: function (CallBackFunction) {
            var SPData = {
                VideoData: []
            };

            var listItemInfo = '';
            var listItemEnumerator = SPContext.VideosList.getEnumerator();

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                var newData = BrightCove.BCApp.Utilities.CreateVideoObjectFromListItem(oListItem);

                SPData.VideoData.push(newData);
            }

            var jsonData = ko.mapping.toJS(SPData.VideoData); 
            return jsonData;
        },
        GetVideoById: function (ListItemId, CallBackFunction) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            var oListItem = oList.getItemById(ListItemId);
            var camlQuery = new SP.CamlQuery();

            camlQuery.set_viewXml(
                        '<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
                        '<Value Type=\'Number\'>1</Value></Geq></Where></Query>' +
                        '<RowLimit>100000</RowLimit></View>'
                    );

            SPContext.DataStore2 = oList.getItems(camlQuery);
            cContext.load(SPContext.DataStore2);

            cContext.executeQueryAsync(
                Function.createDelegate(this, this.onGetVideoByIdSucceeded),
                Function.createDelegate(this, this.onGetListFailed)
            );
        },
        GetSPVideos: function (CallBackFunction, param) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(
                BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            var camlQuery = new SP.CamlQuery();

            SPContext.VideosList = oList.getItems(camlQuery);
            cContext.load(SPContext.VideosList);

            var succeeded = function (sender, args) {
                if (CallBackFunction != null) {
                    CallBackFunction(param);
                }
            };
            var failed = function (sender, args) {
                alert('Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            };

            cContext.executeQueryAsync(
                Function.createDelegate(this, succeeded),
                Function.createDelegate(this, failed)
            );
        },
        
        GetADGroups: function (CallBackFunction) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();

            SPContext.Groups = parentWeb.get_siteGroups(); 
            cContext.load(SPContext.Groups);

            function onGetGroupsSucceed() {
                var SPData = {
                    UserGroups: []
                };

                var listItemInfo = '';
                var listItemEnumerator = SPContext.Groups.getEnumerator();

                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    $('#AuthorsGroupSelect').append('<option value="' + oListItem.get_title() + '">' + oListItem.get_title() + '</option>');
                    SPData.UserGroups.push(oListItem);
                }
                $("#AuthorsGroupSelect").val($("#AuthorsGroupSelect option:first").val());

                SPContext.Groups = SPData.UserGroups;

                if (CallBackFunction != null) {
                    CallBackFunction();
                }
            }
            function onGetGroupsFailed(sender, args) {
                alert('Get Groups failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            }
            cContext.executeQueryAsync(
                    Function.createDelegate(this, onGetGroupsSucceed), 
                    Function.createDelegate(this, onGetGroupsFailed)
                );
        },

        //Permissions functions
        TestIsMember: function (groupName) {
            alert('started check');
            var ctext = new SP.ClientContext.get_current();
            var currentWeb = ctext.get_web();

            var currentUser = ctext.get_web().get_currentUser();
            ctext.load(currentUser);

            var allGroups = currentWeb.get_siteGroups();
            ctext.load(allGroups);

            var group = allGroups.getByName(groupName);
            ctext.load(group);

            var groupUsers = group.get_users();
            ctext.load(groupUsers);

            var fn1 = function (sender, args) {
                var userInGroup = false;
                alert('success');
            };
            var fn2 = function (sender, args) {
                alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
            };

            ctext.executeQueryAsync(fn1, fn2);
            alert('end check, async called');
        },
        IsCurrentUserMemberOfGroup: function (groupName, OnComplete, SuppressMessages) {
            
            var currentContext = new SP.ClientContext.get_current();
            var currentWeb = currentContext.get_web();
            
            var currentUser = currentContext.get_web().get_currentUser();
            currentContext.load(currentUser);

            var allGroups = currentWeb.get_siteGroups();
            currentContext.load(allGroups);

            var group = allGroups.getByName(groupName);
            currentContext.load(group);

            var groupUsers = group.get_users();
            currentContext.load(groupUsers);

            var suppressMessages = SuppressMessages;
            
            function onPermsSuccessFn(sender, args) {
                var userInGroup = false;
                var groupUserEnumerator = groupUsers.getEnumerator();
                while (groupUserEnumerator.moveNext()) {
                    var groupUser = groupUserEnumerator.get_current();
                    if (groupUser.get_id() == currentUser.get_id()) {
                        userInGroup = true;
                        break;
                    }
                }
                OnComplete(userInGroup);
            } 
            function onPermsFailureFn(sender, args) {
                //OnComplete(false);
                if (suppressMessages != true)
                {
                if (args.get_message() == "Group cannot be found.") {
                    alert('Group cannot be found. Please create the group ' +  groupName  + '.');
                }
                if (args.get_message() == "Access denied. You do not have permission to perform this action or access this resource.") {
                    alert("Access denied to group " +  groupName  +  ". You do not have permission to perform this action or access this resource.");
                }

                else {
                    alert('Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
                }
                }
                OnComplete(false);
            }

            currentContext.executeQueryAsync(
                Function.createDelegate(this, onPermsSuccessFn),
                Function.createDelegate(this, onPermsFailureFn));
        },
        IsCurrentUserSiteCollectionAdmin: function () {
            var currentUser;

            function IsUserAdmin() {
                clientContext = SP.ClientContext.get_current();
                spWeb = clientContext.get_web();
                currentUser = spWeb.get_currentUser();
                clientContext.load(currentUser);
                clientContext.executeQueryAsync(
                    Function.createDelegate(this, onAdminQuerySucceeded),
                    Function.createDelegate(this, onAdminQueryFailed));
            }

            function onAdminQuerySucceeded(sender, args) {
                var isUserAdmin = currentUser.get_isSiteAdmin();
                if (isUserAdmin) {
                    //alert('Current User is Administrator');
                }
                else {
                    //alert('Current User is not an Administrator');
                }
            }

            function onAdminQueryFailed(sender, args) {
                alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
            }

            IsUserAdmin();
        },
        DoesCurrentUserHaveEditRights: function(onSuccess, onFailure){
            context = new SP.ClientContext.get_current();
            callBack = onSuccess;
            secondCallBack = onFailure;

            web = context.get_web();
            this._currentUser = web.get_currentUser();
            context.load(this._currentUser);
            context.load(web, 'EffectiveBasePermissions');
            context.executeQueryAsync(
                Function.createDelegate(this, onPermsSuccessMethod),
                Function.createDelegate(this, onPermsFailureMethod));

            function onPermsSuccessMethod(sender, args) {
                if (web.get_effectiveBasePermissions().has(SP.PermissionKind.editListItems)) {
                    //User Has Edit Permissions
                    if (callBack != null && callBack != undefined && typeof (callBack) == 'function')
                        callBack();
                }
                else {
                    if (secondCallBack != null && secondCallBack != undefined && typeof (secondCallBack) == 'function')
                        secondCallBack();
                }
            }
            function onPermsFailureMethod(sender, args) {
                alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
            }
        },
        DoesCurrentUserHaveEditRightsToList: function (listName, onSuccess) {
            context = new SP.ClientContext.get_current();
            callBack = onSuccess;

            web = context.get_web();
            this._currentUser = web.get_currentUser();
            context.load(this._currentUser);
            context.load(web, 'EffectiveBasePermissions');
            context.executeQueryAsync(
                Function.createDelegate(this, onPermsSuccessMethod),
                Function.createDelegate(this, onPermsFailureMethod));

            function onPermsSuccessMethod(sender, args) {
                if (web.get_effectiveBasePermissions().has(SP.PermissionKind.editListItems)) {
                    //User Has Edit Permissions
                    if (callBack != null && callBack != undefined && typeof (callBack) == 'function')
                        callBack();
                }
                else {
                    alert('The current user does not have edit rights to this current web context');
                }
            }
            function onPermsFailureMethod(sender, args) {
                alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
            }
        },

        //Ajax Call backs

        //to be removed
        onGetListSucceeded: function (sender, args) {
            this.GetADGroups();

            //Get the current working page
            var pageName = BrightCove.BCApp.Utilities.GetCurrentPageName();

            //Initialize the menus and breadcrumbs
            BrightCove.BCApp.Menus.Initialize(pageName);

            //Invoke the main page event
            BrightCove.BCApp.Initialize.InitializePageLoadEvent(pageName);
        },
        onGetVideoByIdSucceeded: function (sender, args) {
            var listItemInfo = '';
            var listItemEnumerator = SPContext.DataStore2.getEnumerator();
            var vid = BrightCove.BCApp.Utilities.GetQueryStringParameter('vid');

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();

                var cvid = oListItem.get_id();

                if (cvid == vid) {
                    var newData = BrightCove.BCApp.Utilities.CreateVideoObjectFromListItem(oListItem);
                    SPContext.DataStore2 = newData;
                    break;
                }
            }

            SPContext.ViewObject().LoadData();
        },

        //to be removed
        onGetListFailed: function (sender, args) {
            alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        },
        onAddVideoItem: function () {
            //alert('SharePoint Item Updated');
            console.log('SharePoint Video Item Updated');
        },
        onAddListItem: function () {
            this.AddAccountFlag = true;
            var itemId = this.AccountItem.get_id();
            var fieldVal = this.AccountItem.get_item('Tokens');
            var fields = (fieldVal != null ? fieldVal.split(',') : []);
            for (i = 0; i < fields.length; i++) {
                var currentField = fields[i];
                currentFieldSplit = currentField.split('|');
                if (currentFieldSplit.length > 1) {
                    fields[i] = currentFieldSplit[1];
                }
            }
            var currentFields = this.VideoListFields;
            this.UpdateVideoFields(itemId, fields, currentFields);
            //alert('SharePoint Item Updated');
        },
        onUpdateListItem: function () {
            this.AddAccountFlag = false;
            var itemId = this.AccountItemId;
            var fieldVal = this.AccountItem.get_item('Tokens');
            var fields = (fieldVal != null ? fieldVal.split(',') : []);
            for (i = 0; i < fields.length; i++) {
                var currentField = fields[i];
                currentFieldSplit = currentField.split('|');
                if (currentFieldSplit.length > 1) {
                    fields[i] = currentFieldSplit[1];
                }
            }
            var currentFields = this.VideoListFields;
            this.UpdateVideoFields(itemId, fields, currentFields);
            //alert('SharePoint Item Updated');
        },
        onAddListItemFailed: function (sender, args) {
            var msg = args.get_message();
            if (msg != null && msg.toLowerCase().indexOf("save conflict")) {
                alert('Add failed. ' + msg +
                '\n' + args.get_stackTrace());
            }
            else {
                console.log(msg);
            }
        },
        onUpdateListItemFailed: function (sender, args) {
            alert('Update failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        },
        onDeleteSucceeded: function () {
            alert('Item deleted');
        },
        onDeleteFailed: function (sender, args) {
            alert('Delete failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        }
    }
};
BrightCove.BCApp.BrightCoveUtilities = {
    VideoDAL: {
        //Video functions
        GetBCVideoByID: function (videoId, CallBackFunction, viewObject) {
            var me = this;
            var accountItemId = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
            var selected = $('#ddlSelectAccount option[data-item-id=' + accountItemId + ']');
            if (selected.length > 0) {
                var account = new BrightCove.BCApp.DataStructures.AccountData();
                account.AccountId = $(selected).val();
                account.ClientId = $(selected).data('client-id');
                account.ClientSecret = $(selected).data('client-secret');

                BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                        account,
                        me.GetBCVideoByIDInner,
                        arguments);
            }
        },
        GetBCVideoByIDInner: function (videoId, CallBackFunction, viewObject) {
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            var account_item_id = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
            var account_id = $('#ddlSelectAccount option[data-item-id=' + account_item_id + ']').val();

            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/videos/' + videoId;
            //var modalEditMode = function () {
            //    //load data
            //    $('#ddlNewType').change();
            //    $('.modal-header h4 span').html('Edit Playlist');
            //    $('.newPlaylistModal .editMode').show();
            //}
            $.ajax({
                method: 'GET',
                url: apiUrl,
                async: false,
                view:viewObject,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (item) {
                    
                    var currentView = this.view;
                    if (item != null) {
                        var newData = new BrightCove.BCApp.DataStructures.VideoData();

                        newData.VideoID = 0;
                        newData.Account = item.accountId;
                        newData.VideoTitle = item.name;
                        newData.VideoShortDescription = item.description;
                        newData.VideoLongDescription = (item.long_description != 'null') ? item.long_description : '';
                        newData.VideoStartDate = (item.starts_at != null) ? (new Date(item.starts_at)).toLocaleDateString() : '';
                        newData.VideoEndDate = (item.ends_at != null) ? (new Date(item.ends_at)).toLocaleDateString() : '';
                        newData.ReferenceID = item.id;
                        newData.RelatedLink = (item.link != null) ? item.link.url : '';
                        newData.RelatedLinkText = (item.link != null) ? item.link.text : '';
                        newData.Economics = item.economics;

                        newData.VideoThumbNail = (item.images.thumbnail != null ? item.images.thumbnail.src : "../images/video.png");
                        newData.VideoStillImage = (item.images.poster != null ? item.images.poster.src : "../images/video.png");
                        newData.Keywords = (item.tags != null && item.tags.length > 0) ? item.tags.join(',') : '';

                        newData.CustomFields = item.custom_fields;

                        if (item.state == 'ACTIVE') {
                            newData.Active = 'Published';
                        } else {
                            newData.Active = 'In Progress'
                        }

                        newData.TextTracks = item.text_tracks;
                        
                        if (CallBackFunction != null && CallBackFunction != undefined) {
                            CallBackFunction(newData, currentView);
                        }
                    }
                },
                error: function (e) {
                    alert('Error retrieving video from Brightcove... '
                        + e.toString());
                }
            });
        },
        GetBCVideosByID: function (VideoIDs, token, CallBackFunction, refElem) {
            var me = this;
            var accountItemId = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
            var selected = $('#ddlSelectAccount option[data-item-id=' + accountItemId + ']');
            if (selected.length > 0) {
                var account = new BrightCove.BCApp.DataStructures.AccountData();
                account.AccountId = $(selected).val();
                account.ClientId = $(selected).data('client-id');
                account.ClientSecret = $(selected).data('client-secret');

                BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                        account,
                        me.GetBCVideosByIDInner,
                        arguments);
            }
        },
        GetBCVideosByIDInner: function (VideoIDs, token, CallBackFunction, refElem) {
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            var account_item_id = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
            var account_id = $('#ddlSelectAccount option[data-item-id=' + account_item_id + ']').val();

            var SPData = {
                VideoListData: []
            };
            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/videos?q=' + VideoIDs;
            var modalEditMode = function () {
                //load data
                $('#ddlNewType').change();
                $('.modal-header h4 span').html('Edit Playlist');
                $('.newPlaylistModal .editMode').show();
            }
            $.ajax({
                method: 'GET',
                url: apiUrl,
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    if (json != null) {

                        $(json).each(function (index, item) {
                            var newData = new BrightCove.BCApp.DataStructures.VideoData();

                            newData.VideoID = 0;
                            newData.Account = item.accountId;
                            newData.VideoTitle = item.name;
                            newData.VideoShortDescription = item.description;
                            newData.VideoLongDescription = (item.long_description != 'null') ? item.long_description : '';
                            newData.VideoStartDate = (item.starts_at != null) ? (new Date(item.starts_at)).toLocaleDateString() : '';
                            newData.VideoEndDate = (item.ends_at != null) ? (new Date(item.ends_at)).toLocaleDateString() : '';
                            newData.ReferenceID = item.id;
                            newData.RelatedLink = (item.link != null) ? item.link.url : '';
                            newData.RelatedLinkText = (item.link != null) ? item.link.text : '';
                            newData.Economics = item.economics;
                            
                            newData.VideoThumbNail = (item.images.thumbnail != null ? item.images.thumbnail.src : "../images/video.png");
                            newData.VideoStillImage = (item.images.poster != null ? item.images.poster.src : "../images/video.png");
                            newData.Keywords = (item.tags != null && item.tags.length > 0) ? item.tags.join(',') : '';

                            newData.CustomFields = item.custom_fields;

                            //if (item.custom_fields != null && item.custom_fields != undefined) {
                            //    var customFieldList = Object.keys(item.custom_fields);
                            //    for (i = 0; i < customFieldList.length; i++) {
                            //        var fieldName = customFieldList[0];
                            //        var fieldValue = item.custom_fields[fieldName];

                            //        newData.CustomFields[fieldName] = fieldValue;
                            //    }
                            //}

                            if (item.state == 'ACTIVE') {
                                newData.Active = 'Published';
                            } else {
                                newData.Active = 'In Progress'
                            }

                            newData.TextTracks = item.text_tracks;
                            BrightCove.BCApp.Utilities.AddTextTrackRows(newData.TextTracks);

                            SPData.VideoListData.push(newData);
                        });
                        SPContext.DataStore2 = SPData.VideoListData;

                        if (CallBackFunction != null && CallBackFunction != undefined && refElem != null)
                            CallBackFunction(refElem);
                        else if (CallBackFunction != null && CallBackFunction != undefined) {
                            CallBackFunction(SPData.VideoListData);
                        }
                    }
                },
                error: function (e) {
                    alert('Error retrieving video ids from Brightcove... '
                        + e.toString());
                }
            });
        },
        GetBCVideosByIDPoll: function (VideoIDs, token) {
            overlayMessage('Bandwidth renditions are being optimized.');

            var url = "https://api.brightcove.com/services/library?command=find_videos_by_ids_unfiltered"
                    + "&video_ids=" + VideoIDs
                    + "&video_fields=id%2CvideoStillURL%2CvideoStill%2CthumbnailURL%2Cthumbnail"
                    + "&media_delivery=default"
                    + "&token=" + token
                    + "&t=" + (new Date()).getTime();

            var stopPolling = false;
            setTimeout(function () {
                $.ajax({
                    type: 'GET',
                    url: url,
                    cache: false,
                    async: false,
                    contentType: "application/json",
                    dataType: 'jsonp',
                    //timeout: 3000,
                    complete: function () {
                        if (!stopPolling)
                            BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByIDPoll(VideoIDs, token);
                    },
                    success: function (json) {
                        if (json != null && json.items != null) {
                            if (json.items[0] != null) {
                                if (json.items[0].videoStillURL != null && json.items[0].thumbnailURL != null) {
                                    if (json.items[0].videoStillURL != '' && json.items[0].thumbnailURL != '') {
                                        stopPolling = true;
                                        //var thumb = json.items[0].thumbnailURL.replace('http://', 'https://');
                                        //var still = json.items[0].videoStillURL.replace('http://', 'https://');
                                        thumbnailImageUrl.resolve(json.items[0].thumbnailURL);
                                        stillImageUrl.resolve(json.items[0].videoStillURL);
                                        overlayMessage('Syncing...');
                                        overlayMessage('Your video is published!');
                                        showOverlayToolbar();
                                    }
                                }
                                //else {
                                //    setTimeout(BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByIDPoll(VideoIDs, token), 2000);
                                //}
                            }
                            //else {
                            //    setTimeout(BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByIDPoll(VideoIDs, token), 2000);
                            //}
                        }
                        //else {
                        //    setTimeout(BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByIDPoll(VideoIDs, token), 2000);
                        //}
                    },
                    error: function (e) {
                        BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByIDPoll(VideoIDs, token);
                        //alert('Error retrieving video ids from Brightcove... '
                        //    + e.toString());
                    }
                });
            }, 30000);
        },

        GetBCVideosByReferenceID: function (VideoIDs, token, CallBackFunction, refElem) {
            var SPData = {
                VideoListData: []
            };

            var url = "https://api.brightcove.com/services/library?command=find_video_by_reference_id"
                    + "&reference_id=" + VideoIDs.replace(',', '%2C') 
                    + "&video_fields=id%2Cname%2CshortDescription%2ClongDescription%2CcreationDate%2CpublishedDate%2ClinkURL%2ClinkText%2CvideoStillURL%2CvideoStill%2CthumbnailURL%2CreferenceId%2Ceconomics%2CaccountId%2CitemState%2CstartDate%2CendDate%2linkURL%2linkText"
                    + "&media_delivery=default"
                    + "&token=" + token;

            var modalEditMode = function () {
                //load data
                $('#ddlNewType').change();
                $('.modal-header h4 span').html('Edit Playlist');
                $('.newPlaylistModal .editMode').show();
            }
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                cache: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    try {
                        if (json != null && json.items != null) {

                            $(json.items).each(function (index, item) {
                                var newData = new BrightCove.BCApp.DataStructures.PlaylistData();

                                newData.VideoTitle = item.name;
                                newData.ReferenceID = item.referenceId;
                                newData.VideoID = item.id;

                                SPContext.BCVideoIDReference().push(newData);
                            });

                            if (CallBackFunction != null && CallBackFunction != undefined)
                                CallBackFunction(refElem);
                        }
                    }
                    catch (err) { }
                },
                error: function (e) {
                    alert('Error retrieving video ids from Brightcove... '
                        + e.toString());
                }
            }).done(function () {

            });
        },
        GetBCVideosByTagID: function (VideoIDs, token, CallBackFunction, singleUnfiltered) {
            var me = this;
            var accountItemId = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
            if (accountItemId == null || accountItemId == '') {
                accountItemId = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
            }
            var selected = $('#ddlSelectAccount option[data-item-id=' + accountItemId + ']');
            if (selected.length > 0) {
                var account = new BrightCove.BCApp.DataStructures.AccountData();
                account.AccountId = $(selected).val();
                account.ClientId = $(selected).data('client-id');
                account.ClientSecret = $(selected).data('client-secret');

                BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                        account,
                        me.GetBCVideosByTagIDInner,
                        arguments);
            }
        },
        GetBCVideosByTagIDInner: function (VideoIDs, token, CallBackFunction, singleUnfiltered) {
            //var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            //var account_item_id = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
            //var account_id = $('#ddlSelectAccount option[data-item-id=' + account_item_id + ']').val();

            var SPData = {
                VideoListData: []
            };

            var url = "https://api.brightcove.com/services/library?command=find_videos_by_tags"
                    + "&and_tags=" + VideoIDs
                    + "&media_delivery=default"
                    + "&token=" + token;
            //var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/videos?q=tags:' + VideoIDs;

            if (singleUnfiltered == true) {
                url = "https://api.brightcove.com/services/library?command=find_video_by_reference_id_unfiltered"
                        + "&reference_id=" + VideoIDs
                        + "&token=" + token;
            }

            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                cache: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    try {
                        if (json != null && json.items != null) {
                            var newData = new BrightCove.BCApp.DataStructures.VideoData();

                            $(json.items).each(function (index, item) {
                                var found = false;

                                if (item.tags != null && item.tags.length > 0) {
                                    $(item.tags).each(function (tindex, titem) {
                                        if (titem == VideoIDs) {
                                            newData.VideoTitle = item.name;
                                            newData.ReferenceID = item.id;
                                            newData.VideoThumbNail = item.thumbnailURL;
                                            newData.VideoStillImage = item.videoStillURL;
                                            found = true;
                                        }                                        
                                    });
                                }
                            });

                            if (CallBackFunction != null && CallBackFunction != undefined)
                                CallBackFunction(newData);
                        } else if (json != null && json.id != null) {
                            var newData = new BrightCove.BCApp.DataStructures.VideoData();
                            var found = false;
                            
                            newData.VideoTitle = json.name;
                            newData.ReferenceID = json.id;
                            newData.VideoThumbNail = json.thumbnailURL;
                            newData.VideoStillImage = json.videoStillURL;
                            found = true;

                            if (CallBackFunction != null && CallBackFunction != undefined)
                                CallBackFunction(newData);
                        } else {
                            overlayMessage("Cannot find video with reference ID " + VideoIDs);
                            showOverlayToolbar();
                        }
                    }
                    catch (err) { }
                },
                error: function (e) {
                    alert('Error retrieving video ids from Brightcove... '
                        + e.toString());
                    if (CallBackFunction != null && CallBackFunction != undefined)
                        CallBackFunction(null);
                }
            }).done(function () {

            });
        },
        //Playlist functions
        GetBCPlaylists: function (CallBackFunction, token) {
            var me = this;
            var selected = $('#ddlSelectAccount option:selected');
            if (selected.length > 0) {
                var account = new BrightCove.BCApp.DataStructures.AccountData();
                account.AccountId = $(selected).val();
                account.ClientId = $(selected).data('client-id');
                account.ClientSecret = $(selected).data('client-secret');

                BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                        account,
                        me.GetBCPlaylistsInner,
                        arguments);
            }
        },
        GetBCPlaylistsInner: function (CallBackFunction, token) {
            token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            var account_id = $('#ddlSelectAccount option:selected').val();

            SPContext.DataStore2 = null;
            var SPData = {
                PlayListData: []
            };

            var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/playlists';
            
            $.ajax({
                url: apiUrl,
                async: false,
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                success: function (json) {
                    if (json != null && json != null) {

                        $(json).each(function (index, item) {
                            var newData = new BrightCove.BCApp.DataStructures.PlaylistData();

                            newData.Title = item.name;
                            newData.Thumbnail = '';
                            newData.ShortDescription = item.description;
                            newData.StartDate = item.created_at;
                            newData.Type = item.playListType;
                            newData.EndDate = '';
                            newData.ReferenceID = item.reference_id;
                            newData.ID = item.id;
                            newData.PlaylistType = item.type;

                            newData.TagInclusionRule = 'any';
                            var tagValue = (item.search != null ? item.search : "");
                            if (tagValue.length > 0) {
                                var replaceTags = "tags:\"";
                                var tagsIndex = tagValue.indexOf(replaceTags);
                                if (tagsIndex == 1){
                                    replaceTags = "+tags:\"";
                                    newData.TagInclusionRule = 'all';
                                }
                                var tagArray = tagValue.substring(0, tagValue.length - 1).replace(replaceTags, "").split('","');
                                newData.Tags = tagArray.join(',');
                            } else {
                                newData.Tags = tagValue;
                            }
                            
                            if (item.video_ids != null && item.video_ids != undefined && item.video_ids.length > 0) {
                                newData.VideoIDs = item.video_ids.join(',');
                            }
                            else
                                newData.VideoIDs = '';

                            newData.Limit = 5;
                            if (item.limit != null) {
                                newData.Limit = parseInt(item.limit);
                            }

                            SPData.PlayListData.push(newData);
                        });
                        SPContext.DataStore2 = SPData.PlayListData;
                    }
                    
                    if (CallBackFunction != null)
                        CallBackFunction(SPData.PlayListData);
                },
                error: function (e) {
                    alert('Error retrieving playlists from Brightcove... '
                        + e.toString());
                }
            });
        }
    },
    CustomFieldUtilities: {
        GetList: function (account, callback) {
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);

            var func = function (account_id, callback) {
                var apiUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.CMSAPIURL + 'v1/accounts/' + account_id + '/video_fields';
                var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
                $.ajax({
                    url: apiUrl,
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    success: function (data) {
                        if (callback != null) {
                            callback(data);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(textStatus);
                    }
                });
            };

            if (token == '') {
                var args = [account.AccountId, callback];
                BrightCove.BCApp.BrightCoveUtilities.TokenUtilities.GetToken(
                    account,
                    func,
                    args);
            } else {
                func(account.AccountId, callback);
            }
        }
    },
    TokenUtilities: {
        GetToken: function (account, callback, callbackArgs) {
            // do we have a current token?
            var token = BrightCove.BCApp.Utilities.GetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName);
            if (token != null && token != '') {
                // if so, use in callback
                if (callback != null) {
                    callback.apply(callback, callbackArgs);
                }
            } else {
                // else, obtain
                var dataString = 'grant_type=client_credentials&client_id=' + account.ClientId + '&client_secret=' + account.ClientSecret;
                var authProxyUrl = BrightCove.BCApp.Constants.BrightCoveURLConstants.ProxyURL;
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
                        BrightCove.BCApp.Utilities.SetCookie(BrightCove.BCApp.Constants.BrightCoveTokenConstants.CookieName, token, expiresIn);

                        // use callback
                        if (callback != null) {
                            callback.apply(callback, callbackArgs);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(textStatus);
                    }
                });
            }
        }
    },
    JSONUtilities: {
        CreateVideo: function (title, spid, tags,
            videoShortDescription, videoLongDescription,
            relatedLinkUrl, relatedLinkText, activeInactive, economics,
                startDate, endDate, token, usageRestriction,
                communicationChannel, organization, geography, capability,
                industry, methodology, language, news,
                videoContact, dateRecorded,
                publisher, publishedDate, expirationDate) {
            tags = this.FormatTagsForJSON(tags, spid);
            //remove empty tags to avoid issues
            tags = BrightCove.BCApp.Utilities.ReplaceAll(tags, ",\"\"", "")
            if (startDate == null || startDate == undefined || startDate == '' || startDate == 'Invalid Date') {
                startDate = '';
            }
            if (endDate == null || endDate == undefined || endDate == '' || endDate == 'Invalid Date') {
                endDate = '';
            }
            if (startDate != '') {
                var EpochStartDate = new Date(startDate);
                startDate = EpochStartDate.getTime();
            }
            if (endDate != '') {
                var EpochEndDate = new Date(endDate);
                endDate = (endDate != '') ? EpochEndDate.getTime() : '';
            }

            if (economics == null || economics == '') {
                economics = "FREE";
            }

            title = title.replace(/\'/g, 'ʼ').replace(/\"/g, '');
            relatedLinkText = relatedLinkText.replace(/\'/g, 'ʼ').replace(/\"/g, '');
            videoShortDescription = videoShortDescription.replace(/\'/g, 'ʼ').replace(/\"/g, '');
            videoLongDescription = videoLongDescription.replace(/\'/g, 'ʼ').replace(/\"/g, '');

            var inputFileName = $('#videoFile').val().toLowerCase();
            var flvExt = inputFileName.indexOf("flv", this.length - "flv".length) !== -1;
            var itemState = (activeInactive == "Published" ? "ACTIVE" : "INACTIVE");
            var jval = '{"method": "create_video", "params": {"video": {"name": "'
                    + title + '",'
                    + '"tags": ['
                    + tags
                    + '],'
                    + '"shortDescription": "' + videoShortDescription + '",'
                    + '"longDescription": "' + videoLongDescription + '",'
                    + '"referenceId": "' + spid + '",'
                    + '"linkURL": "' + relatedLinkUrl + '",'
                    + '"customFields": {'
                    + '"usagerestriction": "' + usageRestriction + '",'
                    + '"communicationchannel": "' + communicationChannel + '",'
                    //+ '"businessunit": "' + businessUnit + '",'
                    + '"organization": "' + organization + '",'
                    + '"geography": "' + geography + '",'
                    + '"capability": "' + capability + '",'
                    + '"industry": "' + industry + '",'
                    + '"methodology": "' + methodology + '",'
                    + '"language": "' + language + '",'
                    + '"newscontenttype": "' + news + '",'
                    + '"videocontact": "' + videoContact + '",'
                    + '"daterecorded": "' + dateRecorded + '",'
                    + '"publisher": "' + publisher + '",'
                    + '"publisheddate": "' + publishedDate + '",'
                    + '"expirationdate": "' + expirationDate + '",'
                    //+ '"status": "' + activeInactive + '",'
                    + '},'
                    + '"linkText": "' + relatedLinkText + '",'
                    //+ '"economics": "' + economics + '",'
                    + '"startDate": ' + (startDate != null && startDate != '' ? startDate : 'null') + ','
                    + '"endDate": ' + (endDate != null && endDate != '' ? endDate : 'null') + ','
                    + '"itemState": "' + itemState
                    + '"},'
                    + '"token": "' + token + '",'                    
                    + (flvExt ? '' : '"encode_to":"MP4",')
                    + '"create_multiple_renditions": "FALSE"}}';

            return jval;
        },
        UpdateVideo: function (title, videoId, spid, tags,
            videoShortDescription, videoLongDescription,
            relatedLinkUrl, relatedLinkText, activeInactive, economics,
            startDate, endDate, token, usageRestriction,
                communicationChannel, organization, geography, capability,
                industry, methodology, language, news,
                videoContact, dateRecorded,
                publisher, publishedDate, expirationDate) {
            tags = this.FormatTagsForJSON(tags, spid);

            if (startDate == null || startDate == undefined || startDate == '' || startDate == 'Invalid Date') {
                startDate = '';
            }
            if (endDate == null || endDate == undefined || endDate == '' || endDate == 'Invalid Date') {
                endDate = '';
            }
            if (startDate != '') {
                var EpochStartDate = new Date(startDate);
                startDate = EpochStartDate.getTime();
            }
            if (endDate != '') {
                var EpochEndDate = new Date(endDate);
                endDate = (endDate != '') ? EpochEndDate.getTime() : '';
            }
            if (economics == null || economics == '') {
                economics = "FREE";
            }

            title = title.replace(/\'/g, 'ʼ').replace(/\"/g, '');
            relatedLinkText = relatedLinkText.replace(/\'/g, 'ʼ').replace(/\"/g, '');
            videoShortDescription = videoShortDescription.replace(/\'/g, 'ʼ').replace(/\"/g, '');
            videoLongDescription = videoLongDescription.replace(/\'/g, 'ʼ').replace(/\"/g, '');

            var itemState = (activeInactive == "Published" ? "ACTIVE" : "INACTIVE");
            var jval = '{"method": "update_video", "params": {'
                        + '"token": "' + token + '",'
                        + '"video": {'
                        + '"id": ' + videoId + ','
                        + '"name": "' + title + '",'
                        + '"tags": ['
                        + tags.replace(',""', '') 
                        + '],'
                        + '"shortDescription": "' + videoShortDescription + '",'
                        + '"longDescription": "' + videoLongDescription + '",'
                        + '"referenceId": "' + spid + '",'
                        + '"linkURL": "' + relatedLinkUrl + '",'
                        + '"customFields": {'
                        + '"usagerestriction": "' + usageRestriction + '",'
                        + '"communicationchannel": "' + communicationChannel + '",'
                        //+ '"businessunit": "' + businessUnit + '",'
                        + '"organization": "' + organization + '",'
                        + '"geography": "' + geography + '",'
                        + '"capability": "' + capability + '",'
                        + '"industry": "' + industry + '",'
                        + '"methodology": "' + methodology + '",'
                        + '"language": "' + language + '",'
                        + '"newscontenttype": "' + news + '",'
                        + '"videocontact": "' + videoContact + '",'
                        + '"daterecorded": "' + dateRecorded + '",'
                        + '"publisher": "' + publisher + '",'
                        + '"publisheddate": "' + publishedDate + '",'
                        + '"expirationdate": "' + expirationDate + '",'
                        //+ '"status": "' + activeInactive + '",'
                        + '},'
                        + '"linkText": "' + relatedLinkText + '",'
                        + '"itemState": "' + itemState + '",'
                        + '"startDate": ' + (startDate != null && startDate != '' ? startDate : 'null') + ','
                        + '"endDate": ' + (endDate != null && endDate != '' ? endDate : 'null') + ','
                        //+ '"economics": "' + economics + '"'
                        + '}'
                        + ',"encode_to":"MP4",'
                        + '"create_multiple_renditions": "FALSE"'
                        + '}}';

            return jval;
        },
        CreatePlaylist: function (title, videoIds, description, token) {

            var jval = '{"method":"create_playlist","params":{"playlist":{"playlistType":' + ((true) ? '"EXPLICIT",' : '')
                     + '"videoIds":[' + videoIds
                     + '],"name":"' + title + '"'
                     + ((description != null && description != '') ? ',"shortDescription": ' + '"' + description + '"' : '')
                     + '},"token":"' + token + '"'
                     + '}}';
            return jval;
        },
        UpdatePlaylist: function (title, playlistId, description, videoIds, token) {

            var jval = '{"method":"update_playlist","params":{"playlist":{'
                     + '"id":"' + playlistId + '",'
                     + '"playlistType":' + ((true) ? '"EXPLICIT",' : '')
                     + '"videoIds":[' + videoIds
                     + '],"name":"' + title + '"'
                     + ((description != null && description != '') ? ',"shortDescription": ' + '"' + description + '"' : '')
                     + '},"token":"' + token
                     + '"}}';
            return jval;
        },
        CreateSmartPlaylist: function (title, description, tags, condition, playListType, totalVideos, token) {
            //the total videos field is not supported by brightcove. It has been left as a place-holder for future implementations
            tags = this.FormatTagsForJSON(tags);
            var jval = '{"method":"create_playlist","params":{"playlist":{'
                         + '"playlistType":"' + playListType + '",'
                         + '"filterTags":' + '[' + tags + '],'
                         + '"tagInclusionRule":"' + condition + '",'
                         + '"name":"' + title + '"'
                         + ((description != null && description != '') ? ',"shortDescription": ' + '"' + description + '"' : '')
                         + '},"token":"' + token
                         + '"}}';
            return jval;
        },
        UpdateSmartPlaylist: function (title, description, playlistId, tags, condition, playListType, totalVideos, token) {
            //the total videos field is not supported by brightcove. It has been left as a place-holder for future implementations
            tags = this.FormatTagsForJSON(tags);
            var jval = '{"method":"update_playlist","params":{"playlist":{'
                         + '"id":"' + playlistId + '",'
                         + '"filterTags":' + '[' + tags + '],'
                         + '"playlistType":"' + playListType + '",'
                         + '"tagInclusionRule":"' + condition + '",'
                         + '"name":"' + title + '"'
                         + ((description != null && description != '') ? ',"shortDescription": ' + '"' + description + '"' : '')
                         + '},"token":"' + token
                         + '"}}';
            return jval;
        },
        GetTagObjectForCMSAPI: function (tags, guid, account_item_id) {
            var userTags = $('#brightcoveTags').val();
            var systemTags = $('#brightcoveSystemTags').val();

            var siteAccountTag = 'bcsp-' +BrightCove.BCApp.Pages.PageData.SiteId + '-' +account_item_id;
            var addSiteTag = true;

            var userTagSplit = userTags.split(',');
            var systemTagSplit = systemTags.split(',');

            var tagList = [];
            if (guid != null && guid.length > 0) {
                tagList.push(guid);
            }

            userTagSplit.push.apply(userTagSplit, systemTagSplit);

            if (userTagSplit != null && userTagSplit.length > 0) {
                for (i = 0; i < userTagSplit.length; i++) {
                    var currentTag = userTagSplit[i];
                    if (currentTag != "") {
                        tagList.push(currentTag);
                        if (siteAccountTag == userTagSplit[i]) {
                            addSiteTag = false;
                        }
                    }
                }
            }

            if (addSiteTag) {
                tagList.push(siteAccountTag);
            }

            return tagList;
        },
        GetCustomFieldsObjectForCMSAPI: function () {
            var customFieldObj = {};
            var customFields = $('#customFields input');

            for (i = 0; i < customFields.length; i++) {
                var thisField = customFields[i];
                var fieldInternalName = $(thisField).data('internal');
                var fieldValue = $(thisField).val();
                customFieldObj[fieldInternalName] = fieldValue;
            }

            return customFieldObj;
        },
        FormatTagsForJSON: function (tags, guid) {
            tags = tags.split(',');
            var ftags = '';
            if (guid != null && guid.length > 0) {
                ftags += '"' + guid + '"';
            }
            if (tags != null && tags.length > 0) {
                if (guid != null && guid.length > 0) {
                    ftags += ",";
                }
                for (i = 0; i < tags.length; i++) {
                    ftags += '"' + tags[i] + '"';
                    if (i + 1 < tags.length)
                        ftags += ',';
                }
            }

            return ftags;
        },
        FormatAndTagsForRequest: function (tags) {
            tags = tags.split(',');
            var ftags = '';
            if (tags != null && tags.length > 0) {
                for (i = 0; i < tags.length; i++) {
                    ftags += '&and_tags=' + tags[i] + '';
                }
            }

            return ftags;
        },
        FormatOrTagsForRequest: function (tags) {
            tags = tags.split(',');
            var ftags = '';
            if (tags != null && tags.length > 0) {
                for (i = 0; i < tags.length; i++) {
                    ftags += '&or_tags=' + tags[i] + '';
                }
            }

            return ftags;
        }
    }
};
BrightCove.BCApp.Installer = {
    Get_isListExists: function (listTitle, OnSuccess, OnError) {
        var ctx = SP.ClientContext.get_current();
        var web = ctx.get_web();
        var hostWebUrl = this.GetHostWebUrl('SPHostUrl');

        //Using the hostWebContext as an AppContextSite
        hostWebContext = new SP.AppContextSite(ctx, hostWebUrl);

        //must use the hostWebContext to get the list in that site
        var lists = hostWebContext.get_web().get_lists();
        ctx.load(lists);

        ctx.executeQueryAsync(
          function () {
              var listExists = false;
              var le = lists.getEnumerator();
              while (le.moveNext()) {
                  var list = le.get_current();
                  if (list.get_title() == listTitle) {
                      listExists = true;
                      break;
                  }
              }

              OnSuccess(listExists);
          },
          OnError()
        );
    },
    Get_isItemExistsAndHasValue: function (listTitle, OnSuccess, OnError) {
        var ctx = SP.ClientContext.get_current();
        var web = ctx.get_web();
        var hostWebUrl = this.GetHostWebUrl('SPHostUrl');

        //Using the hostWebContext as an AppContextSite
        hostWebContext = new SP.AppContextSite(ctx, hostWebUrl);

        //must use the hostWebContext to get the list in that site
        var list = hostWebContext.get_web().get_lists().getByTitle(listTitle);
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
            '<Value Type=\'Number\'>1</Value></Geq></Where></Query><RowLimit>1</RowLimit></View>');
        var listItems = list.getItems(camlQuery);

        ctx.load(list);
        ctx.load(listItems);

        ctx.executeQueryAsync(
          function () {
              var listItemExists = false;
              var le = listItems.getEnumerator();
              while (le.moveNext()) {
                    listItemExists = true;
                    break;
              }

              OnSuccess(listItemExists);
          },
          OnError()
        );
    },
    GetHostWebUrl: function (name) {
        if (name != null) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        else {
            return "";
        }
    },
    CreateList: function (title, url, templateType, hidden) {

        //Using the App Web as the client context
        clientContext = new SP.ClientContext.get_current();
        var hostWebUrl = this.GetHostWebUrl('SPHostUrl');

        //Using the hostWebContext as an AppContextSite
        hostWebContext = new SP.AppContextSite(clientContext, hostWebUrl);

        //Create List Code
        var listCreation = new SP.ListCreationInformation();
        listCreation.set_title(title);

        //must use the hostWebContext to get the list in that site
        var lists = hostWebContext.get_web().get_lists();
        listCreation.set_templateType(templateType);
        listCreation.set_url("Lists/" + url);
        var list = lists.add(listCreation);
        list.set_hidden(hidden);
        list.set_onQuickLaunch(false);

        if (title == BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts) {
            BrightCove.BCApp.Installer.GenerateAccountsListSchema(list);
        }
        if (title == BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList) {
            BrightCove.BCApp.Installer.GenerateVideoListSchema(list);
        }
        if (title == BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList) {
            BrightCove.BCApp.Installer.GenerateSettingsListSchema(list);
        }

        list.update();
        //Always use the context of the app web to do the work or load and executing
        clientContext.load(list);

        clientContext.executeQueryAsync(function () {
            $('#errorMessage').text("Created List : \"" + title + "\"");
            var btnClass = $("#btn" + title).attr('class') + ' hidden';
            $("#btn" + title).attr('class', btnClass);
            if (!$('#btn' + BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts).is(':visible')
                && !$('#btn' + BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList).is(':visible')
                && !$('#btn' + BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList).is(':visible')) {
                BrightCove.BCApp.Installer.ShowNavigationButtons();
            }
            if (title == BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList) {
                BrightCove.BCApp.Installer.Get_isItemExistsAndHasValue(BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList,
                    function (listItemExists) {
                        if (listItemExists == false) {
                            BrightCove.BCApp.Installer.HideNavigationButtons();
                            $(".proxyMessage").removeClass('hidden');
                            var hostWebUrl = BrightCove.BCApp.Installer.GetHostWebUrl('SPHostUrl');
                            var settingsListUrl = hostWebUrl + "/Lists/" + BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList + "/NewForm.aspx";
                            $(".proxyMessage a").attr('href', settingsListUrl);
                        }
                    }, function (sender, args) { }
                );
            }
        }, function (sender, args) {
            $('#errorMessage').text("Failed to create list : " + title + "</br>Reason : " + args.get_message());
        });
    },
    CreateCustomList: function (name) {
        BrightCove.BCApp.Installer.Get_isListExists(name, function (listExists) {
            if (listExists == false) {
                BrightCove.BCApp.Installer.CreateList(name, name, SP.ListTemplateType.genericList, false);
            }
        }, function (sender, args) {
            //    alert(args.get_message());
        });
    },
    GenerateAccountsListSchema: function (list) {
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Account Name\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'DefaultVideoPlayerId\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'DefaultPlaylistPlayerId\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'TemporaryStorageLocation\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'AWSAccessKeyId\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'AWSSecretAccessKey\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'AWSBucketName\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'DropboxAccountId\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'DropboxAccessToken\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'AccountId\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'ClientId\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'ClientSecret\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'AuthorsGroupID\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'ViewersGroupID\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Tokens\' Type=\'Note\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'AccountAuthorsGroupName\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'AccountViewersGroupName\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
    },
    GenerateVideoListSchema: function (list) {
        list.get_fields().addFieldAsXml('<Field DisplayName=\'ShortDescription\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'LongDescription\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Active\' Type=\'Boolean\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'RelatedLink\' Type=\'URL\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'RelatedLinkText\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'VideoImage\' Type=\'URL\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'ReferenceID\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'StartDate\' Type=\'DateTime\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'EndDate\' Type=\'DateTime\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Economic\' Type=\'Choice\' ><CHOICES><CHOICE>Ad Supported</CHOICE><CHOICE>Bronz</CHOICE><CHOICE>Silver</CHOICE><CHOICE>Gold</CHOICE></CHOICES></Field>',
            true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'VideoThumbnail\' Type=\'URL\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Account\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Keywords\' Type=\'Note\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'SPID\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
    },
    GenerateSettingsListSchema: function (list) {
        list.get_fields().addFieldAsXml('<Field DisplayName=\'ProxyUrl\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
    },
    GenerateVideoImageListSchema: function (list) {
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Date Picture Taken\' Type=\'DateTime\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Description\' Type=\'Note\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Keywords\' Type=\'Note\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'BrightcoveVideoID\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
    },
    HideNavigationButtons: function () {
        $('.leftNav .btn').each(function (index, value) {
            if (index > 0) {
                var button = $(this);
                var btnclass = "btn btn-default btn-lg btn-block disabled";
                button.attr('class', btnclass);
            }
        });
    },
    ShowNavigationButtons: function () {
        $('.leftNav .btn').each(function (index, value) {
            if (index > 0) {
                var button = $(this);
                var btnclass = "btn btn-default btn-lg btn-block";
                button.attr('class', btnclass);
            }
        });
    },
    CheckLists: function () {
        var showNavigation = true;
        BrightCove.BCApp.Menus.Initialize('Default.aspx');
        BrightCove.BCApp.Installer.ShowNavigationButtons();
        // Accounts List
        BrightCove.BCApp.Installer.Get_isListExists(BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts,
                function (listExists) {
                    if (listExists == false) {
                        BrightCove.BCApp.Installer.HideNavigationButtons();
                        var btnClass = $("#btn" + BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts).attr('class').replace('hidden', '');
                        $("#btn" + BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts).attr('class', btnClass);
                    }
                }, function (sender, args) {}
            );
        // Videos List
        BrightCove.BCApp.Installer.Get_isListExists(BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList,
                function (listExists) {
                    if (listExists == false) {
                        BrightCove.BCApp.Installer.HideNavigationButtons();
                        var btnClass = $("#btn" + BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList).attr('class').replace('hidden', '');
                        $("#btn" + BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList).attr('class', btnClass);
                    }
                }, function (sender, args) { }
            );
        // Settings List
        BrightCove.BCApp.Installer.Get_isListExists(BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList,
                function (listExists) {
                    if (listExists == false) {
                        BrightCove.BCApp.Installer.HideNavigationButtons();
                        var btnClass = $("#btn" + BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList).attr('class').replace('hidden', '');
                        $("#btn" + BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList).attr('class', btnClass);
                    } else {

                        BrightCove.BCApp.Installer.Get_isItemExistsAndHasValue(BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList,
                            function (listItemExists) {
                                if (listItemExists == false) {
                                    BrightCove.BCApp.Installer.HideNavigationButtons();
                                    $(".proxyMessage").removeClass('hidden');
                                    var hostWebUrl = BrightCove.BCApp.Installer.GetHostWebUrl('SPHostUrl');
                                    var settingsListUrl = hostWebUrl + "/Lists/" + BrightCove.BCApp.Constants.SharePointConstants.SPListID_SettingsList + "/";
                                    $(".proxyMessage a").attr('href', settingsListUrl);
                                }
                            }, function (sender, args) { }
                        );

                    }
                }, function (sender, args) { }
            );
    }
};
