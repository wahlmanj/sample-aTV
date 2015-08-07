function onPhotoSelection( photoID ) {
	
	var photoArray = createPhotoArray( photoID );
	
	/**
	 * photoDicts: Array of photo assets to display in the browser
	 * initialSelection: Integer of initially selected photo
	 */
	loadFullScreenMediaBrowser( photoArray.photoDicts, photoArray.initialSelection);
	
};

function onSlideshowStart() {
	// Not implemented yet.
	console.log(" --- starting the slideshow --- ");

	var photoArray = createPhotoArray();

	atv.slideShow.onExit = function ( lastDisplayedPhotoId ) {
		console.log ( 'slide show exit on photo: '+ lastDisplayedPhotoId );
		// updateInitialSelection ( lastDisplayedPhotoId );
	};

	atv.slideShow.run( photoArray.initialSelection, photoArray.photoDicts );

};

function onSettingsSelection() {
	// implement a settings page is needed.
	console.log('Settings page callback');

	var photoArray = createPhotoArray();

	atv.slideShow.showSettings ( photoArray.photoDicts );

};

function onScreensaverSelection(id, name) {
   var id = id || "samplexml-browser-adhoc",
       name = name || "AdHoc - Pantone - SampleXML";
   // The collection object is passed to atv.onExecuteQuery as parameters to load Images.
   // Currently only one collection is able to be passed.
   var collection = {
        "id": id, 
        "name": name,
        "type": "collection"
    };
    atv.setScreensaverPhotosCollection( collection );
}

function createPhotoArray( photoID ) {
	var initialSelection = 0;
	var photoDicts = [];

	var photos = document.evaluateXPath('//photo | //video');
	for (var i=0; i<photos.length; ++i ) {
		var photo = photos[i],
			commentsBadge = photo.getElementByTagName('commentsBadge'),
			type = photo.tagName,
			collectionArrayName = ( type == "photo" ) ? "assets" : "previewImages";
			photoAssets = ( type == "photo" ) ? photo.getElementsByTagName('photoAsset') : photo.getElementsByTagName('videoPreviewImage'),

			photoDict = {};
		
		photoDict.id = photo.getAttribute('id');
		photoDict.caption = photo.getElementByTagName('caption').textContent;
		photoDict.type = type;

		if (commentsBadge) {
			photoDict.badges = [ {
				"type":"commentsBadge",
				"style":commentsBadge.getAttribute('style')
				}
			];
		};
		

		photoDict[ collectionArrayName ] = [];
		for (var assetIndex=0; assetIndex<photoAssets.length; ++assetIndex) {
			var photoAsset = photoAssets[assetIndex];
			var photoAssetDict = {
				"width":parseInt(photoAsset.getAttribute('width')),
				"height":parseInt(photoAsset.getAttribute('height')),
				"src":photoAsset.getAttribute('src')
			};
			
			photoDict[ collectionArrayName ].push(photoAssetDict);
		};
		
		console.log("Our ids are: "+ photoDict.id +" is eq to? "+ photoID +" <---- ");
		if (photoDict.id == photoID) {
			initialSelection = photoDicts.length;
		};
		
		photoDicts.push(photoDict);
	};

	var photoArray = { "photoDicts": photoDicts, "initialSelection": initialSelection };

	console.log( " the photo array : \n\n" + JSON.stringify( photoArray ) +"\n\n" );

	return photoArray;
};

/**
 * Generic wrapper to handle the creation of the fullscreen photo browser.
 **/
function loadFullScreenMediaBrowser(photoDicts, initialSelection) {
	
	var fullScreenMediaBrowser = new atv.FullScreenMediaBrowser();
	
	/** 
	 * In the comments view, this callback is referenced each time a new photo is brought to the front.
	 * The metadata if available has these properties:
	 *   liked: Boolean
	 *   likeStatus: String
	 *   comments: Array of objects
	 *       text: String
	 *       footer: String 
	 **/
	fullScreenMediaBrowser.onLoadMetadata = function(photoID) {
		
		var photoInfo = document.getElementById( photoID ).getElementByTagName( 'stash' ),
			comments = [],
			metadata = {};

		if( photoInfo ) {
			console.log("we have photoInfo");
			var photoCommentElements = photoInfo.ownerDocument.evaluateXPath("comments/comment", photoInfo),
				liked = photoInfo.getElementByTagName( 'liked' );

			if( liked ) {
				metadata.liked = ( liked.getAttribute( 'status' ) == "YES" ) ? true : false;
				metadata.likeStatus = liked.textContent;
			} 

			console.log(photoCommentElements.length);
			for( var i = 0; i < photoCommentElements.length; i++ ) {
				console.log(" --- Our first comment ---"+ photoCommentElements.textContent );
				var comment = {
					"text": photoCommentElements[i].getElementByTagName('text').textContent,
					"footer": photoCommentElements[i].getElementByTagName('footer').textContent
				};
				comments.push( comment );
			}

			metadata.comments = comments;

		};

		console.log("Here is teh metadata I'm passing: "+ JSON.stringify( metadata ) ); 
		
		// Callback to send the updated metadata to the browser.
		fullScreenMediaBrowser.updateMetadata(photoID, metadata);
	};
	
	
	// Callback to be used when the photo is selected in fullscreen only mode.
	fullScreenMediaBrowser.onItemSelection = function(photoID) {
		console.log("I have selecte media item: "+ photoID );
		if( photoID.indexOf( 'video' ) > -1 ) {

			var urlList = document.evaluateXPath( "//video[@id='"+ photoID +"']/stash/videoUrl" );
				
			var url = ( urlList.length > -1 ) ? urlList[0].textContent : false;
			console.log('Here is the url: '+ url);
			if( url ) {
				atv.loadURL( url );
			} else {
				console.log("an error has occurred.");
			}
			

		} else {
			fullScreenMediaBrowser.hide();
		}
	};
	
	// Called back when a user presses select in comments view. This is technically used for like and unlike, however it can update the entire metadata object for the photo.
	fullScreenMediaBrowser.onLikeSelection = function(photoID, metadata) {
		metadata["liked"] = !metadata["liked"];
		metadata["likeStatus"] = (metadata["liked"]) ? 'you like this.' : 'like';
		fullScreenMediaBrowser.updateMetadataLiked(photoID, metadata);
	};
	
	// Called back when the Fullscreen Photo Browser is hidden
	fullScreenMediaBrowser.onHide = function() {
		var photoBatches = document.evaluateXPath('//photoBatch');
		
		batchloop:
		for (var batchIndex=0; batchIndex<photoBatches.length; ++batchIndex) {
			var photos = photoBatches[batchIndex].getElementsByTagName('photo');
			
			for (var photoIndex=0; photoIndex<photos.length; ++photoIndex) {
				if (fullScreenMediaBrowser.selectedPhotoID == photos[photoIndex].getAttribute('id')) {
					
					updateInitialSelection ( batchIndex, photoIndex );
					
					break batchloop;
				};
			};
		};
	};
	
	/** 
	 * To set the type of display set fullScreenMediaBrowser.type:
	 *    default - Fullscreen view initially, Comments view on select
	 *    fullScreenOnly - Fullscreen view only, select calls back to onPhotoSelection
	 *    commentsScreenOnly - Comments Screen only
	 *
	 * fullScreenMediaBrowser.type = fullScreenOnly;
	 */ 
	
	fullScreenMediaBrowser.show(photoDicts, initialSelection);
	
	
};

function updateInitialSelection ( batchIndex, photoIndex ) {

	var mediaBrowser = document.rootElement.getElementByTagName('mediaBrowser'),
		oldInitialSelection = mediaBrowser.getElementByTagName('initialSelection');

	if (oldInitialSelection) {
		// remove the previous initial selection.
		oldInitialSelection.removeFromParent();
	};
	
	// create a new one.
	initialSelection = atvutils.createNode({
		"name": "initialSelection",
		"children": [{
			"name": "indexPath",
			"children": [{
				"name": "index",
				"text": ""+batchIndex
			}, {
				"name": "index",
				"text": ""+photoIndex
			}]
		}]
	});

	mediaBrowser.appendChild(initialSelection);
}

