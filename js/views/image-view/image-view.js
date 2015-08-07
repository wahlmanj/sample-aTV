/*
* overlay.js
* Demonstrates using views to create a video overlay using fake content instead of the player.
*/

var screenFrame = atv.device.screenFrame;

var imageView = new atv.ImageView();

var width = screenFrame.width * 0.5;
var height = screenFrame.height * 0.5;
imageView.frame = {
	x: (screenFrame.width - width) / 2, // center horizontally in screen frame
	y: (screenFrame.height - height) / 2, // center vertically in screen frame
	width: width,
	height: height
};

imageView.loadImageAtURL("http://sample-web-server/sample/javascript/views/image-view/art1.jpg");

controller.view = imageView;