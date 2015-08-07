/*
* overlay.js
* Demonstrates using views to create a video overlay using fake content instead of the player.
*/

var screenFrame = atv.device.screenFrame;

// Create the grey background color for the overlay
var overlayHeight = screenFrame.height * 0.07;
var overlay = new atv.View();
overlay.frame = { x: screenFrame.x, y: screenFrame.y + screenFrame.height - overlayHeight, width: screenFrame.width, height: overlayHeight };
overlay.backgroundColor = { red: 0.188, green: 0.188, blue: 0.188, alpha: 1 };

// Add a message on top of the overlay
var messageAttributes = {
	pointSize: 22.0,
	color: { red: 1, blue: 1, green: 1 }
};

var message = new atv.TextView();
var topPadding = overlay.frame.height * 0.35;
var horizontalPadding = overlay.frame.width * 0.05;
message.frame = {
	x: horizontalPadding,
	y: 0,
	width: overlay.frame.width - (2 * horizontalPadding),
	height: overlay.frame.height - topPadding
};

var numberOfSeconds = 0;

function updateMessage() {
	message.attributedString = {
		string: "Overlay message: This has been displayed for " + numberOfSeconds + (numberOfSeconds == 1 ? " second" : " seconds"),
		attributes: messageAttributes
	};
	numberOfSeconds += 1;
}

// Update the overlay message
atv.setInterval(function() {
	updateMessage();
}, 1000);

updateMessage();

overlay.subviews = [ message ];

// Create an image view for a network bug
var networkBug = new atv.ImageView();
var bugWidth = 150;
var bugHeight = 65;
var bugOffsetFromEdges = screenFrame.width * 0.03;
networkBug.loadImageAtURL("http://sample-web-server/sample-xml/images/bug.png");
networkBug.frame = {
	x: screenFrame.width - bugWidth - bugOffsetFromEdges,
	y: bugOffsetFromEdges,
	width: bugWidth,
	height: bugHeight
};

// Create a view to hold the fake video content
var fakeVideoContent = new atv.ImageView();
fakeVideoContent.frame = screenFrame;
fakeVideoContent.loadImageAtURL("http://sample-web-server/sample/javascript/views/overlay/video-frame.jpg");

// Create a root view that has the fake video content with the overlay on top of it.
var rootView = new atv.View();
rootView.subviews = [ fakeVideoContent, overlay, networkBug ];
controller.view = rootView;
