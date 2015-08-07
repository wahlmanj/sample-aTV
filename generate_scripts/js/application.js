// Application-level JavaScript. bag.plist links to this file.
console.log("sample-xml application.js begin");

// atv.onGenerateRequest
// Called when Apple TV is about to make a URL request. Use this method to make changes to the URL. For example, use it
// to decorate the URL with auth tokens or signatures.
atv.onGenerateRequest = function (request) {
    console.log('atv.onGenerateRequest: ' + request.url);

    authToken = atv.sessionStorage["auth-token"]; // save to localStorage instead if you want to persist auth-token after reboot
    console.log( "current auth token is " + authToken);

    if ( authToken )
    {
        var separator = "&";
        if ( request.url.indexOf("?") == -1 ) {
            separator = "?"
        }

        request.url = request.url + separator + "auth-token=" + authToken;
    }
    console.log('--- new url: ' + request.url);
}

// atv.onAppEntry
// Called when you enter an application but before the root plist is requested. This method should not return until
// application initialization is complete. Once this method has returned Apple TV will assume it can call
// into any other callback. If atv.config.doesJavaScriptLoadRoot is true, then it is atv.onAppEntry's responsibility
// to load the root page. If atv.config.doesJavaScriptLoadRoot is false, the next likely method that will be called
// is atv.onGenerateRequest to decorate the URL for the root plist.
atv.onAppEntry = function() {
    atvutils.loadURL("http://sample-web-server/sample-xml/main.xml");
}

// atv.onAppExit
// Called when the application exits. The application doesn't exit when the user goes to the main menu because the application
// is still required to display it's top shelf. Rather, the application exits when an application is entered, even
// if this application is the one that is entered. For example:
// 1. User enters this application: atv.onAppEntry called
// 2. User goes back to the main menu (nothing happens yet)
// 3. User enters this application: atv.onAppExit called, then atv.onAppEntry is called
atv.onAppExit = function() {
    console.log('sample-xml app exited');
}

// atv.onPageLoad
// Called when a plist is loaded.
atv.onPageLoad = function(pageIdentifier) {

    console.log('Application JS: Page ' + pageIdentifier + ' loaded');

    if ( pageIdentifier == "com.sample.javascript-logout" ) {
        console.log("JavaScript logout page loaded. Perform logout.");

        // This is not always needed. If you want to perform logout only when the user explicitly asks for it, you
        // can use the sign-in-sign-out menu item.
        atv.logout();
    }
}

// atv.onPageUnload
// Called when a page is unloaded.
// Note that if you have an app-level javascript context (defined in your bag.plist) in addition to a javascript included a page's head element, onPageUnload will get invoked on both.
atv.onPageUnload = function(pageIdentifier) {
    console.log('Application JS: Page ' + pageIdentifier + ' unloaded');
}

// atv.onPageBuried
// Called when a new paged is pushed on top of the page
// Note that if you have an app-level javascript context (defined in your bag.plist) in addition to a javascript included a page's head element, onPageBuried will get invoked on both.
atv.onPageBuried = function( pageIdentifier ) {
    console.log('Application JS: Page'+ pageIdentifier + ' buried ');
}

// atv.onPageExhumed
// Called when a new paged is brought back to the top of the stack
// Note that if you have an app-level javascript context (defined in your bag.plist) in addition to a javascript included a page's head element, onPageExhumed will get invoked on both.
atv.onPageExhumed = function( pageIdentifier ) {
    console.log('Application JS: Page'+ pageIdentifier + ' exhumed ');
}

// atv.onAuthenticate
// Called when the user needs to be authenticated. Some events that would call this are:
// - the user has explicitly tried to login via a sign-in-sign-out menu item
// - the server returned a 401 and silent authentication is occuring
// - non-silent authentication is occuring (because there are no credentials or silent auth failed)
//
// This method should not block. If it makes an XMLHttpRequest, it should do so asynchronously. When authentication is complete, you must notify
// Apple TV of success or failure by calling callback.success() or callback.failure(msg).
//
// Do not save the username or password in atv.localStorage or atv.sessionStorage; Apple TV will manage the user's credentials.
//
// username - The username to authenticate with
// password - The password to authenticate with
// callback - Called to indicate success or failure to Apple TV. Either callback.success() or callback.failure(msg) must be called
//               in all situations.
//
atv.onAuthenticate = function (username, password, callback) {

    try
    {
        console.log('---- asked to auth user: ' + username + ', pass: ' + password);
        var url = "http://sample-web-server:3000/authenticate?username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
        console.log('Trying to authenticate with ' + url);

        var req = new XMLHttpRequest();

        req.onreadystatechange = function() {

            try
            {
                console.log('Got ready state change of ' + req.readyState);

                if (req.readyState == 4 )
                {
                    console.log('Got status code of ' + req.status);

                    if ( req.status == 200)
                    {
                        console.log('Response text is ' + req.responseText);

                        result = JSON.parse(req.responseText);

                        console.log("Setting auth token to " + result["auth-token"]);

                        if ( "auth-token" in result )
                        {
                            atv.sessionStorage["auth-token"] = result["auth-token"];
                            callback.success();
                        }
                        else
                        {
                            message = "";
                            if ( "message" in result )
                            {
                                message = result["message"]
                            }

                            callback.failure(message);
                        }
                    }
                    else
                    {
                        // Specify a copyedited string because this will be displayed to the user.
                        callback.failure('Auth failed. Status ' + req.status + ': ' + req.statusText);
                    }
                }
            }
            catch (e)
            {
                // Specify a copyedited string because this will be displayed to the user.
                callback.failure('Caught exception while processing request. Aborting. Exception: ' + e);
                req.abort();
            }
        }

        req.open("GET", url, true);
        req.send();
    }
    catch (e)
    {
        // Specify a copyedited string because this will be displayed to the user.
        callback.failure('Caught exception setting up request. Exception: ' + e);
    }
}

// atv.onLogout
// Called when the user is logged out. Use this method to remove any per-user data. For example, you probably
// should call atv.sessionStorage.clear() and atv.localStorage.clear().
atv.onLogout = function () {

    console.log('Notified that our account has logged out, clearing sessionStorage.');

    try
    {
        // Also clear localStorage in case you have any per-user data locally stored.
        atv.sessionStorage.clear();
        atv.localStorage.clear();
    }
    catch (e)
    {
        console.log('Caught exception trying to clear sessionStorage. Exception: ' + e);
    }
}

/**
 * If a vendor has content in iTunes their bag.plist will include a key under vendor-gk-1:
 * vendor-gk-1: <key>itms-link</key>
 * 
 * This is made available as a localStorage resource.
 * If no itms-link is defined null is returned.
 */
atv.getItmsLink = function() {
	return this.localStorage.getItem('itms-link');
}

function logPlayerAssetAndEventGroups()
{
    console.log('Logging Player Asset ---------------------------------');

    // Test out asset and event groups on player
    var asset = atv.player.asset;
    if ( asset != null )
    {
        var title = asset.getElementByTagName("title");

        console.log('The current asset is ' + title.textContent);

        var eventGroups = atv.player.eventGroups;
        if ( eventGroups != null )
        {
            console.log('There are ' + eventGroups.length + ' current event groups');
            for( var i=0, len = eventGroups.length; i < len; ++i ) {
                var group = eventGroups[i];
                var groupTitle = group.getElementByTagName("title");
                console.log('event group title: ' + groupTitle.textContent);

                var events = group.getElementsByTagName("event");
                for( var j=0, eventLen=events.length; j < eventLen; ++j ) {
                    var event = events[j];
                    var eventTitle = event.getElementByTagName("title");
                    console.log('event title: ' + eventTitle.textContent);
                }
            }
        }
    }

    console.log('END ---------------------------------');
}

if ( atv.player ) {

    var logTimer = null;
    var playlistRequest = null;

    atv.player.willStartPlaying = function() {

        console.log('atv.player.willStartPlaying');
        logPlayerAssetAndEventGroups();

        console.log('starting timer ======================');

        logTimer = atv.setInterval(function() {
            logPlayerAssetAndEventGroups();
            }, 5000);

        // Creates a text view that will be overlayed at the top of the video.
        TextViewController.initiateView( "counter" );

        atv.sessionStorage["already-watched-ad"] = false;
        atv.sessionStorage["in-ad"] = false;

        var metadata = atv.player.asset.getElementByTagName('myMetadata');
        if (metadata != null) {
            console.log('private metadata found in the asset---------------');

            //
            // Setup bookmark.
            //
            var bookmark = metadata.getElementByTagName('bookmarkURL');
            if (bookmark != null) {
                console.log('bookmark url detected---------------');
                atv.sessionStorage["bookmark-url"] = bookmark.textContent;
            }
            else {
                atv.sessionStorage.removeItem('bookmark-url');
            }

            //
            // Use loadMoreAssets callback for playlists
            // 
            var playlist = metadata.getElementByTagName('playlistBaseURL');
            if (playlist != null) 
            {
                console.log('playlist url detected---------------');
                var currentPlaylistPart = 1;

                // This function is called whenever more assets are required by the player. The implementation
                // should call callback.success or callback.failure at least once as a result. This function
                // will not be called again until the invocation from the last call invokes callback.success
                // or callback.failure. Also, this function will not be called again for a playback if callback.success 
                // is called with null argument, or callback.failure is called.
                // Calling any of the callback functions more than once during the function execution has no effect.
                atv.player.loadMoreAssets = function(callback) 
                {
                    console.log('load more assets called---------------');

                    // Request the next item in the playlist.
                    playlistRequest = new XMLHttpRequest();
                    playlistRequest.onreadystatechange = function() 
                    {
                        try {
                            if (playlistRequest.readyState == 4 ) 
                            {
                                if ( playlistRequest.status == 200) 
                                {
                                    responseDocument = playlistRequest.responseXML;
                                    console.log('Playlist response is ' + responseDocument);

                                    // Pass the loaded assets in callback.success. 
                                    callback.success(responseDocument.rootElement.getElementsByTagName('httpFileVideoAsset'));
                                }
                                else if (playlistRequest.status == 404)
                                {
                                    // This example implementation counts on a 404 to signal the end of the playlist.
                                    // null will stop any further calls to loadMoreAssets for this playback.
                                    callback.success(null);
                                }
                                else
                                {
                                    console.error('HTTP request failed. Status ' + playlistRequest.status + ': ' + playlistRequest.statusText);

                                    // Signal the failure
                                    callback.failure('HTTP request failed. Status ' + playlistRequest.status + ': ' + playlistRequest.statusText);
                                }
                            }
                        }
                        catch (e) {
                            console.error('Caught exception while processing request. Aborting. Exception: ' + e);
                            playlistRequest.abort();

                            // Signal the failure
                            callback.failure('Caught exception while processing request. Aborting. Exception: ' + e);
                        }
                    }

                    playlistRequest.open("GET", playlist.textContent + currentPlaylistPart + ".xml");
                    currentPlaylistPart++;
                    playlistRequest.send();
                };
            } 
            else 
            {
                // Don't use dynamic playlists
                delete atv.player.loadMoreAssets;
            }
        }
    }

    // atv.player.currentAssetChanged
    // Called when the current asset changes to the next item in a playlist.
    atv.player.currentAssetChanged = function() {
        console.log('atv.player.currentAssetChanged');

        // Log the length of the current player asset
        console.log( " == ASSET LENGTH: currentAssetChanged: "+ atv.player.currentItem.duration +" == " );
    }

    // atv.player.onStartBuffering
    // Called when the playhead has moved to a new location (including the initial load) and buffering starts.
    // playheadLocation - The location of the playhead in seconds from the beginning
    atv.player.onStartBuffering = function(playheadLocation) {
        gDateBufferingStarted = new Date(); 
        console.log('onStartBuffering at location ' + playheadLocation + ' at this time: ' + gDateBufferingStarted);
        logPlayerAssetAndEventGroups();
        console.log('end ---------------------');
    }

    // atv.player.onBufferSufficientToPlay
    // Called when enough data have buffered to begin playing without interruption.
    atv.player.onBufferSufficientToPlay = function() {
        var dateBufferBecameSufficientToPlay = new Date();
        var elapsed = dateBufferBecameSufficientToPlay - gDateBufferingStarted;
        console.log('onBufferSufficientToPlay: it took ' + elapsed + ' milliseconds to buffer enough data to start playback');
        // Log the length of the current player asset
        console.log( " == ASSET LENGTH: onBufferSufficientToPlay: "+ atv.player.currentItem.duration +" == " );
    }

    // atv.player.onStallDuringPlayback
    // Called when there is a buffer underrun during normal speed video playback (i.e. not fast-forward or rewind).
    atv.player.onStallDuringPlayback = function(playheadLocation) {
        var now = new Date();
        console.log("onStallDuringPlayback: stall occurred at location " + playheadLocation + " at this time: " + now);
    }

    // atv.player.onPlaybackError
    // Called when an error occurred that terminated playback.
    // debugMessage - A debug message for development and reporting purposes only. Not for display to the user.
    atv.player.onPlaybackError = function (debugMessage) {
        // debugMessage is only intended for debugging purposes. Don't rely on specific values.
        console.log('onPlaybackError: error message is ' + debugMessage);
    }

    // atv.player.onQualityOfServiceReport
    // Called when a quality of service report is available.
    atv.player.onQualityOfServiceReport = function(report) {
        console.log("QoS report is\n" + report);

        // accessLog and errorLog are not gaurenteed to be present, so check for them before using.

        if ( 'accessLog' in report ) {
            console.log("Acces Log:\n" + report.accessLog + "\----------------------------\n");
        }

        if ( 'errorLog' in report ) {
            console.log("Error Log:\n" + report.errorLog + "\----------------------------\n");
        }
    }

    atv.player.playerStateChanged = function(newState, timeIntervalSec) {
        /*
        state constants are:
        atv.player.states.FastForwarding
        atv.player.states.Loading
        atv.player.states.Paused
        atv.player.states.Playing
        atv.player.states.Rewinding
        atv.player.states.Stopped
        */

        console.log("Player state changed to " + newState + " at this time " + timeIntervalSec);
    }

    // TODO - only show event callbacks example for media asset with a known asset-id, for now, control for all player items via this flag
    SHOW_EVENT_EXAMPLE = false;

    // atv.player.playerWillSeekToTime
    // Called after the user stops fast forwarding, rewinding, or skipping in the stream
    // timeIntervalSec - The elapsed time, in seconds, where the user stopped seeking in the stream
    // Returns: the adjusted time offset for the player. If no adjustment is needed, return timeIntervalSec. 
    // Clients can check whether the playback is within an unskippable event and reset the playhead to the start of that event.
    atv.player.playerWillSeekToTime = function(timeIntervalSec) {

        console.log('playerWillSeekToTime: ' + timeIntervalSec);

        if (!SHOW_EVENT_EXAMPLE) {
            return timeIntervalSec;
        }

        // TODO - replace example using event group config
        // Example of event from offset 10-15 sec that is unskippable. If the user seeks within or past, reset to beginning of event
        if (timeIntervalSec >= 10 && !atv.sessionStorage["already-watched-event"]) {
            if (timeIntervalSec > 15) {
                atv.sessionStorage["resume-time"] = timeIntervalSec;
            }
            atv.sessionStorage["in-event"] = true;
            return 10;
        }
        return timeIntervalSec;
    }

    // atv.player.playerShouldHandleEvent
    // Called to check if the given event should be allowed given the current player time and state.
    // event - One of: atv.player.events.FFwd, atv.player.events.Pause, atv.player.events.Play, atv.player.events.Rew, atv.player.events.SkipBack, atv.player.events.SkipFwd
    // timeIntervalSec - The elapsed time, in seconds, where the event would be fired
    // Returns: true if the event should be allowed, false otherwise
    atv.player.playerShouldHandleEvent = function(event, timeIntervalSec) {

        console.log('playerShouldHandleEvent: ' + event + ', timeInterval: ' + timeIntervalSec);

        if (!SHOW_EVENT_EXAMPLE) {
            return true;
        }

        // TODO - replace example using event group config
        // Disallow all player events while in the sample event
        if (timeIntervalSec >= 10 && timeIntervalSec < 15 && !atv.sessionStorage["already-watched-event"]) {
            return false;
        }

        return true;
    }

    // atv.player.playerTimeDidChange
    // Called whenever the playhead time changes for the currently playing asset.
    // timeIntervalSec - The elapsed time, in seconds, of the current playhead position
    atv.player.playerTimeDidChange = function(timeIntervalSec) {

        var netTime = atv.player.convertGrossToNetTime(timeIntervalSec);
        var andBackToGross = atv.player.convertNetToGrossTime(netTime);
        //console.log('playerTimeDidChange: ' + timeIntervalSec + " net time " + netTime + " and back to gross " + andBackToGross);

        if (atv.sessionStorage["bookmark-url"] != null) {
            atv.sessionStorage["bookmark-time"] = timeIntervalSec;
        }

        if (!SHOW_EVENT_EXAMPLE) {
            return;
        }

        // TODO - replace example using event group config
        // If we are currently in the sample event, and are about to exit, clear our flag, mark that the event was watched, and resume if needed
        if (atv.sessionStorage["in-event"] && timeIntervalSec > 15) {
            atv.sessionStorage["in-event"] = false;
            atv.sessionStorage["already-watched-event"] = true;
            if (atv.sessionStorage["resume-time"]) {
                atv.player.playerSeekToTime(atv.sessionStorage["resume-time"]);
                atv.sessionStorage.removeItem("resume-time");
            }
        }
    }

    // atv.player.didStopPlaying
    // Called at some point after playback stops. Use this to to per-playback teardown or reporting.
    atv.player.didStopPlaying = function() {
        console.log('didStopPlaying');

        atv.clearInterval(logTimer);
        logTimer = null;

        // remove the view timer if it has been set.
        var messageTimer = TextViewController.getConfig( "messageTimer" );
        if( messageTimer ) {
            atv.clearInterval( messageTimer );
            TextViewController.setConfig( "messageTimer", null );
        }

        // Save the book mark.
        var bookmarkURL = atv.sessionStorage["bookmark-url"];
        if (bookmarkURL != null) {
            console.log('saving bookmark to server---------------');

            // Request the next item in the playlist.
            bookmarkRequest = new XMLHttpRequest();
            bookmarkRequest.onreadystatechange = function() {
                try {
                    if (bookmarkRequest.readyState == 4 ) {
                        if ( bookmarkRequest.status == 200) {
                            console.log('Bookmark written');
                        }
                        else {
                            console.error('Bookmark write request failed. Status ' + bookmarkRequest.status + ': ' + bookmarkRequest.statusText);
                        }
                    }
                }
                catch (e) {
                    console.error('Caught exception while processing bookmark write request. Aborting. Exception: ' + e);
                }
            }

            bookmarkRequest.open("GET", bookmarkURL + atv.sessionStorage["bookmark-time"]);
            bookmarkRequest.send();

            atv.sessionStorage.removeItem('bookmark-url');
        }

        // Cancel request
        if (playlistRequest != null) {
            playlistRequest.abort();
            playlistRequest = null;
        }

        delete atv.player.loadMoreAssets;
    }

    // atv.player.onTransportControlsDisplayed
    // called when the transport control is going to be displayed
    // @params: animation duration - float 
    atv.player.onTransportControlsDisplayed = function( animationDuration ) {
        console.log( "onTransportControlsDisplayed animation duration: "+ animationDuration +" <--- " );
        if( TextViewController.getView( "counter" ) ) {
            TextViewController.showView( "counter", animationDuration );
        }
    }

    // atv.player.onTransportControlsDisplayed
    // called when the transport control is going to be hidden
    // @params: animation duration - float 
    atv.player.onTransportControlsHidden = function( animationDuration ) {
        console.log( "onTransportControlsHidden animation duration: "+ animationDuration +" <--- " );
        if( TextViewController.getView( "counter" ) ) {
            TextViewController.hideView( "counter", animationDuration );
        }
    }

}
atv.config = {
    // If doesJavaScriptLoadRoot is true, then atv.onAppEntry must load the root URL; otherwise, root-url from the bag is used.
    doesJavaScriptLoadRoot: true
};

/** 
 * These two functions are used to add the needed functionality for AppleTV Screen Saver
 */ 

atv.onScreensaverPhotosSelectionEntry = function() {
   console.log('photoBatch screensaver photos selection begin');
   
   // The collection object is passed to atv.onExecuteQuery as parameters to load Images.
   // Currently only one collection is able to be passed.
   var collection = {
        "id": "screensaver-photos", 
        "name": "Popular",
        "type": "collection"
    };
    atv.setScreensaverPhotosCollection( collection );
}


/**
 * This method is called each time the AppleTV updates the Screensaver photos
 */
atv.onExecuteQuery = function( query, callback ) {
    var id = null;

    for (i=0; i < query.filters.length; ++i) {
        var filter = query.filters[i];
        if (filter.property == 'id') {
            id = filter.value;
            break;
        }
    }
    
    var shuffle = query.shuffle; // boolean
    var length = query.length;

    console.log('photoBatch execute query: id=' + id + ', shuffle=' + shuffle + ', length=' + length);

    // Making a request to the server to get a list of photos for the screensaver, based on the information in the query filters
    var ajax = new ATVUtils.Ajax({
        "url": "http://sample-web-server/sample-xml/images/sample/ScreenSaver.json",
        "success": function( req ) {
            console.log( " --- successfully retrieved the list: --- "+  req.responseText );
            var ScreensaverPhotos = JSON.parse( req.responseText );
            callback.success( ScreensaverPhotos );
        },
        "failure": function( error, req ) {
            console.log("We encountered and error: "+ JSON.stringify( error ) );
        }
    })
}

// On Screen views with fade animation
// ===== Here is the textview information =======
var TextViewController = ( function() {
    var __config = {},
    __views = {};
    
    function SetConfig(property, value) {
        if(property) {
            __config[ property ] = value;
        }
    }
    
    function GetConfig(property) {
        if(property) {
            return __config[ property ];
        } else {
            return false;
        }
    }
    
    function SaveView( name, value ) {
        if( name ) {
            __views[ name ] = value;
        }
    }
    
    function GetView( name ) {
        if(name) {
            return __views[ name ];
        } else {
            return false;
        }
    }
    
    function RemoveView( name ) {
        if( GetView( name ) ) {
            delete __views[ name ];
        }
    }
    
    function HideView( name, timeIntervalSec ) {
        var animation = {
            "type": "BasicAnimation",
            "keyPath": "opacity",
            "fromValue": 1,
            "toValue": 0,
            "duration": timeIntervalSec,
            "removedOnCompletion": false,
            "fillMode": "forwards",
            "animationDidStop": function(finished) { console.log("Animation did finish? " + finished); }
        },
        viewContainer = GetView( name );
                          
        console.log("Hiding view "+ name +" : "+ typeof(viewContainer) +" <--- ");
        if( viewContainer ) {
            viewContainer.addAnimation( animation, name );
        }
    }
    
    function ShowView( name, timeIntervalSec ) {
        var animation = {
            "type": "BasicAnimation",
            "keyPath": "opacity",
            "fromValue": 0,
            "toValue": 1,
            "duration": timeIntervalSec,
            "removedOnCompletion": false,
            "fillMode": "forwards",
            "animationDidStop": function(finished) { console.log("Animation did finish? " + finished); }
        },
        viewContainer = GetView( name );
                          
        console.log("Showing view "+ name +" : "+ typeof(viewContainer) +" <--- ");
        if( viewContainer ) {
            viewContainer.addAnimation( animation, name );
        }
    }
    
    function __updateMessage() {
        var messageView = GetConfig( "messageView" ),
            seconds = GetConfig( "numberOfSeconds" );
        
        if(messageView){
            messageView.attributedString = {
                "string": "We have been playing for "+ seconds +" seconds.",
                "attributes": {
                    "pointSize": 22.0,
                    "color": {
                        "red": 1,
                        "blue": 1,
                        "green": 1
                    }
                }
            }
            SetConfig("numberOfSeconds", seconds + 1 );
        }
    }
    
    function InitiateView( name ) {
        var viewContainer = new atv.View(),
            message = new atv.TextView(),
            screenFrame = atv.device.screenFrame
            width = screenFrame.width,
            height = screenFrame.height * 0.07;
        
        console.log("\nwidth: "+ width +"\nheight: "+ height +"\nscreenFrame: "+ JSON.stringify( screenFrame ) );
                          
                          
        // Setup the View container.
        viewContainer.frame = {
            "x": screenFrame.x,
            "y": screenFrame.y + screenFrame.height - height,
            "width": width,
            "height": height
        }
        
        viewContainer.backgroundColor = {
            "red": 0.188,
            "blue": 0.188,
            "green": 0.188,
            "alpha": 0.7
        }
        
        viewContainer.alpha = 1;
        
        var topPadding = viewContainer.frame.height * 0.35,
            horizontalPadding = viewContainer.frame.width * 0.05;
        
        // Setup the message frame
        message.frame = {
            "x": horizontalPadding,
            "y": 0,
            "width": viewContainer.frame.width - (2 * horizontalPadding),
            "height": viewContainer.frame.height - topPadding
        };
        
        // Save the initial number of seconds as 0
        SetConfig( "numberOfSeconds", 0 );
        
        // Update the overlay message
        var messageTimer = atv.setInterval( __updateMessage, 1000 );
        SetConfig( "messageTimer", messageTimer )
        
          // Save the message to config
          SetConfig( "messageView", message )
                          
        __updateMessage();
        
        
        // Add the sub view
        viewContainer.subviews = [ message ];
        
        // Paint the view on Screen.
                          console.log("pushing the image view to screen: ");
        atv.player.overlay = viewContainer;
        
        console.log("Saving view to "+ name +" : "+ typeof(viewContainer) +" <--- ");
        SaveView( name, viewContainer );
    }
    
    return {
        "initiateView": InitiateView,
        "hideView": HideView,
        "showView": ShowView,
        "saveView": SaveView,
        "getView": GetView,
        "removeView": RemoveView,
        "setConfig": SetConfig,
        "getConfig": GetConfig
    }
} )();

console.log("sample-xml application.js end");
