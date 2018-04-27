

function BuildPlaylistiFrameFixedHtml(bcaccountId, bcplaylistId, bcplayerId, bcplayerWidth, bcplayerHeight, bcplayerUnits, bcplayerAutoplay, bcplayerMuted) {
    
    var incorrectValues = (/^[0-9]+$/.test(bcplayerWidth) ? "" : "Width ")
                        + (/^[0-9]+$/.test(bcplayerHeight) ? "" : "Height ")
                        + (/^[0-9]+$/.test(bcaccountId) ? "" : "AccountID ")
                        + (/^[0-9]+$/.test(bcplaylistId) ? "" : "PlaylistID ")
                        + (/^default$/.test(bcplayerId) || /^[a-zA-Z0-9_]+$/.test(bcplayerId) ? "" : "PlayerID ");
 

    if ( incorrectValues === '' ) {

        var html = '<div \n'
                 + '  style=" \n'
                 + '    display: block; \n'
                 + '    position: relative; \n'
                 + '    width: '
                 +      bcplayerWidth
                 +      bcplayerUnits
                 +      '; \n'
                 + '    height: '
                 +      bcplayerHeight
                 +      bcplayerUnits
                 +    ';\n  ">\n'
                 + '  <iframe \n'
                 + '    src="'
                 +        window.location.protocol
                 +        '//players.brightcove.net/'
                 +        bcaccountId
                 +        '/'
                 +        bcplayerId
                 +        '_default/index.html?playlistId='
                 +        bcplaylistId
                 +        '&usage=cms:sharepoint:iframe'
                 +        (bcplayerAutoplay === "autoplay" ? "&autoplay" : "")
                 +        (bcplayerMuted === "muted" ? "&muted" : "")      
                 +      '" \n'
                 + '    allowfullscreen \n'
                 + '    webkitallowfullscreen \n'
                 + '    mozallowfullscreen \n'
                 + '    style=" \n'
                 + '      width: 100%; \n'
                 + '      height: 100%; \n'
                 + '      position: absolute; \n'
                 + '      top: 0px; bottom: 0px; \n'
                 + '      right: 0px; left: 0px;\n'
                 + '    ">\n'
                 + '  </iframe>\n'
                 + '</div>\n';

    } else {
            
        var html = 'Please enter correct value(s) for ' + incorrectValues;  
    } 
    
    return html;

}


function BuildPlaylistJavascriptFixedHtml(bcaccountId, bcplaylistId, bcplayerId, bcplayerWidth, bcplayerHeight, bcplayerUnits, bcplayerAutoplay, bcplayerMuted, bcplayerNumThumbnails) {
    
    var incorrectValues = (/^[0-9]+$/.test(bcplayerWidth) ? "" : "Width ")
                        + (/^[0-9]+$/.test(bcplayerHeight) ? "" : "Height ")
                        + (/^[0-9]+$/.test(bcplayerNumThumbnails) ? "" : "Thumbnails ")
                        + (/^[0-9]+$/.test(bcaccountId) ? "" : "AccountID ")
                        + (/^[0-9]+$/.test(bcplaylistId) ? "" : "PlaylistID ")
                        + (/^default$/.test(bcplayerId) || /^[a-zA-Z0-9_]+$/.test(bcplayerId) ? "" : "PlayerID ");
    
                        //+ (/^default$/.test(bcplayerId) ||
                        //   /^[a-zA-Z0-9_]{10}$/.test(bcplayerId) ||
                        //   /^[a-zA-Z0-9_]{8}-[a-zA-Z0-9_]{4}-[a-zA-Z0-9_]{4}-[a-zA-Z0-9_]{4}-[a-zA-Z0-9_]{12}$/.test(bcplayerId)  
                        //   ? "" : "PlayerID ");    
    
     if ( incorrectValues === '' ) {
        var playlistItemWidth = Math.round((bcplayerWidth-bcplayerNumThumbnails*4)/bcplayerNumThumbnails);
        var playlistItemHeight = Math.round(playlistItemWidth * bcplayerHeight / bcplayerWidth);
         
        var html =  '<style type="text/css"> \n'
                  + '  .vjs-playlist { \n'        
                  + '    background-color: #000000; \n'   
                  + '    width: '
                  +      bcplayerWidth
                  +      bcplayerUnits
                  +      '; \n'
                  + '    height: calc ('
                  +      playlistItemHeight
                  +      bcplayerUnits  
                  +      '+ 16px); \n'        
                  + '    text-align: center; \n'           
                  + '    overflow-x: scroll; \n'           
                  + '    overflow-y: hidden; \n'           
                  + '    white-space: nowrap; \n'   
                  + '    margin: 0; \n'           
                  + '    padding: 0; \n'  
                  + '  } \n'        
                  + '  .vjs-playlist-title-container { \n'  
                  + '    color: #FFFFFF; \n'  
                  + '    /*display: none;*/\n'
                  + '    opacity: 1; \n'           
                  + '    font-size: 0.7em; \n' 
                  + '    font-family: sans-serif; \n'         
                  + '    font-weight: bold; \n' 
                  + '  } \n'          
                  + '  .vjs-playlist-now-playing-text { \n' 
                  + '    color: #FFFFFF; \n'         
                  + '    /*display: none;*/\n'
                  + '    opacity: 1; \n'         
                  + '    font-size: 0.7em; \n'         
                  + '    font-family: sans-serif; \n'
                  + '    font-weight: bold; \n'
                  + '  } \n'        
                  + '  .vjs-up-next-text { \n'        
                  + '    color: #FFFFFF; \n'        
                  + '    /*display: none;*/\n'
                  + '    opacity: 1; \n'        
                  + '    font-family: sans-serif; \n'        
                  + '    font-weight: bold; \n'        
                  + '    text-align: right; \n'   
                  + '  } \n'           
                  + '  .vjs-playlist-duration { \n'        
                  + '    color: #FFFFFF; \n'        
                  + '    /*display: none;*/\n'
                  + '    opacity: 1; \n'        
                  + '    font-family: sans-serif; \n'        
                  + '    font-weight: bold; \n'      
                  + '  } \n'           
                  + '  .vjs-mouse.vjs-playlist { \n'        
                  + '    background-color: #000000; \n' 
                  + '  } \n'          
                  + '  li.vjs-playlist-item { \n'        
                  + '    background-color: #000000; \n'  
                  + '    height: '
                  +      playlistItemHeight
                  +      bcplayerUnits
                  +      '; \n'             
                  + '    width: ' 
                  +      playlistItemWidth
                  +      bcplayerUnits
                  +      '; \n' 
                  + '    display: inline-block; \n'        
                  + '    border: 2px solid #000000; \n'        
                  + '    padding: 0; \n'            
                  + '    margin: 0; \n'        
                  + '    cursor: pointer; \n'        
                  + '    vertical-align: middle; \n' 
                  + '  } \n'  
                  + '  li.vjs-playlist-item:hover { \n'        
                  + '    border-color: #FFFFFF; \n'  
                  + '  } \n' 
                  + '</style> \n' 
                  + '<div \n'
                  + '  style=" \n'
                  + '    display: block; \n'
                  + '    position: relative; \n'
                  + '    width: '
                  +      bcplayerWidth
                  +      bcplayerUnits
                  +      '; \n'
                  + '    height: calc ('
                  +      bcplayerHeight
                  +      bcplayerUnits  
                  +      ' + '          
                  +      playlistItemHeight
                  +      bcplayerUnits  
                  +      '+ 16px); \n'        
                  + '  ">\n'        
                  + '  <video \n'
                  + '    data-playlist-id="'   
                  +      bcplaylistId
                  +      '" \n'
                  + '    data-account="'  
                  +      bcaccountId   
                  +      '" \n'   
                  + '    data-player="'     
                  +      bcplayerId 
                  +      '" \n'     
                  + '    data-embed="default" \n'       
                  + '    data-usage="cms:sharepoint:javascript" \n'      
                  + '    class="video-js" \n' 
                  + '    controls '
                  +      bcplayerAutoplay 
                  +      ' '
                  +      bcplayerMuted         
                  + '    \n'  
                  + '    style=" \n'
                  + '      width: '
                  +        bcplayerWidth
                  +        bcplayerUnits
                  +        ';\n'
                  + '      height: '
                  +        bcplayerHeight
                  +        bcplayerUnits
                  +        '; \n' 
                  + '      position: relative; \n'
                  + '      top: 0px; bottom: 0px;\n'
                  + '      right: 0px; left: 0px;\n'
                  + '    "> \n'        
                  + '  </video> \n'    
                  + '  <script \n'
                  + '    src="//players.brightcove.net/' 
                  +      bcaccountId
                  +      '/'   
                  +      bcplayerId
                  +      '_default/index.min.js">\n'
                  + '  </script> \n'    
                  + '  <ol \n'
                  + '    class="\n'
                  + '      vjs-playlist \n'
                  + '      vjs-csspointerevents \n'
                  + '      vjs-mouse\n'
                  + '    "> \n'
                  + '  </ol>\n'
                  + '</div> \n';  
    } else {
            
        var html = 'Please enter correct value(s) for ' + incorrectValues;  
    }

    
    return html;
}

