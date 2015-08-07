/*
* hello-world.js - Demonstrates atv.TextView
*/

var screenFrame = atv.device.screenFrame;

var textView = new atv.TextView();
textView.attributedString = {
	string: "Hello, World!",
	attributes: {
		pointSize: 80.0,
		color: { red: 1, blue: 1, green: 1 },
		alignment: "center"
	}
};

var hPadding = screenFrame.width * 0.2;
var height = screenFrame.height * 0.2;

textView.frame = {
	x: hPadding,
	y: (screenFrame.height - height) / 2,
	width: screenFrame.width - (2 * hPadding),
	height: height
};

controller.view = textView;
