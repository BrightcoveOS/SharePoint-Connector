function BuildVideoiFrameFixedHtml(bcaccountId, bcvideoId, bcplayerId, bcplayerWidth, bcplayerHeight, bcplayerUnits, bcplayerAutoplay, bcplayerMuted) {
    
    var incorrectValues = (/^[0-9]+$/.test(bcplayerWidth) ? "" : "Width ")
                        + (/^[0-9]+$/.test(bcplayerHeight) ? "" : "Height ")
                        + (/^[0-9]+$/.test(bcaccountId) ? "" : "AccountID ")
                        + (/^[0-9]+$/.test(bcvideoId) ? "" : "VideoID ")
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
                  +      window.location.protocol
                  +      '//players.brightcove.net/'
                  +      bcaccountId
                  +      '/'
                  +      bcplayerId
                  +      '_default/index.html?videoId='
                  +      bcvideoId
                  +      '&usage=cms:sharepoint:iframe'
                  +      (bcplayerAutoplay === "autoplay" ? "&autoplay" : "")
                  +      (bcplayerMuted === "muted" ? "&muted" : "")          
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

function BuildVideoJavascriptFixedHtml(bcaccountId, bcvideoId, bcplayerId, bcplayerWidth, bcplayerHeight, bcplayerUnits, bcplayerAutoplay, bcplayerMuted) {
    
    var incorrectValues = (/^[0-9]+$/.test(bcplayerWidth) ? "" : "Width ")
                        + (/^[0-9]+$/.test(bcplayerHeight) ? "" : "Height ")
                        + (/^[0-9]+$/.test(bcaccountId) ? "" : "AccountID ")
                        + (/^[0-9]+$/.test(bcvideoId) ? "" : "VideoID ")
                        + (/^default$/.test(bcplayerId) || /^[a-zA-Z0-9_]+$/.test(bcplayerId) ? "" : "PlayerID ");
  
    
     if ( incorrectValues === '' ) {
       
         var bcplayerPaddingTop = bcplayerHeight / bcplayerWidth * 100;
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
                  + '  <div \n'
                  + '    style=" \n'
                  + '      padding-top: '
                  +        bcplayerPaddingTop
                  +      '%;\n    "> \n'
                  + '    <video \n'
                  + '      data-video-id="'   
                  +        bcvideoId 
                  +        '" \n'
                  + '      data-account="'  
                  +        bcaccountId   
                  +        '" \n'   
                  + '      data-player="'     
                  +        bcplayerId 
                  +        '" \n'     
                  + '      data-embed="default" \n'       
                  + '      data-usage="cms:sharepoint:javascript" \n'
                  + '      class="video-js" \n' 
                  + '      controls '
                  +        bcplayerAutoplay 
                  +        ' '
                  +        bcplayerMuted          
                  +        '\n'
                  + '      style="\n'
                  + '        width: '
                  +          bcplayerWidth
                  +          bcplayerUnits
                  +          ';\n'
                  + '        height: '
                  +          bcplayerHeight
                  +          bcplayerUnits
                  +          ';\n'
                  + '        position: absolute; \n'
                  + '        top: 0px; bottom: 0px; \n'
                  + '        right: 0px; left: 0px;\n'
                  + '      ">\n'
                  + '    </video> \n'    
                  + '    <script \n'
                  + '      src="//players.brightcove.net/' 
                  +        bcaccountId
                  +        '/'   
                  +        bcplayerId
                  +        '_default/index.min.js">\n'
                  + '    </script> \n'    
                  + '  </div> \n'      
                  + '</div> ';  
    } else {
            
        var html = 'Please enter correct value(s) for ' + incorrectValues;  
    }
  
    return html;
}


function BuildVideoJavascriptResponsiveHtml(bcaccountId, bcvideoId, bcplayerId, bcplayerWidth, bcplayerHeight, bcplayerUnits, bcplayerAutoplay, bcplayerMuted) {
    
    var incorrectValues = (/^[0-9]+$/.test(bcplayerWidth) ? "" : "Width ")
                        + (/^[0-9]+$/.test(bcplayerHeight) ? "" : "Height ")
                        + (/^[0-9]+$/.test(bcaccountId) ? "" : "AccountID ")
                        + (/^[0-9]+$/.test(bcvideoId) ? "" : "VideoID ")
                        + (/^default$/.test(bcplayerId) || /^[a-zA-Z0-9_]+$/.test(bcplayerId) ? "" : "PlayerID ");   
    
     if ( incorrectValues === '' ) {
       
        var bcplayerPaddingTop = bcplayerHeight / bcplayerWidth * 100;
        var html = '<div \n'
                 + '  style="\n'
                 + '    display: block;\n' 
                 + '    position: relative;\n'
                 + '    min-width: 0px;\n'
                 + '    max-width: '
                 +      bcplayerWidth
                 +      bcplayerUnits
                 +    ';\n  "> \n'    
                 + '  <div \n'
                 + '    style="\n'
                 + '      padding-top: '
                 +        bcplayerPaddingTop
                 +      '%;\n    "> \n'
                 + '    <video \n'
                 + '      data-video-id="'   
                 +        bcvideoId 
                 +        '" \n'
                 + '      data-account="'  
                 +        bcaccountId   
                 +        '" \n'   
                 + '      data-player="'     
                 +        bcplayerId 
                 +        '" \n'     
                 + '      data-embed="default" \n'       
                 + '      data-usage="cms:sharepoint:javascript" \n'      
                 + '      class="video-js" \n' 
                 + '      controls '
                 +        bcplayerAutoplay  
                 +        ' '
                 +        bcplayerMuted         
                 +        '\n'
                 + '      style="\n'
                 + '        width: 100%;\n'
                 + '        height: 100%;\n'
                 + '        position: absolute;\n'
                 + '        top: 0px; bottom: 0px;\n'
                 + '        right: 0px; left: 0px;\n'
                 + '      "> \n'
                 + '    </video> \n'    
                 + '    <script \n'
                 + '      src="//players.brightcove.net/' 
                 +        bcaccountId
                 +        '/'   
                 +        bcplayerId
                 +        '_default/index.min.js">\n'
                 + '    </script> \n'    
                 + '  </div> \n'      
                 + '</div> ';  
    } else {
            
        var html = 'Please enter correct value(s) for ' + incorrectValues;  
    }
  
    return html;
}
