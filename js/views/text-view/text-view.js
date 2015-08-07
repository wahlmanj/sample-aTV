/*
* text-view.js - Demonstrates atv.TextView
* TextView's have an attributedString parameter that is an Object with two required properties: string and attributes.
* - string is the string displayed in the text view on screen.
* - attributes is an Object with two required properties (pointSize and color) and optional properties (alignment, weight, and breakMode).
*
* attribute Object properties
* pointSize: Required. A number that is the size of the font in points
* color: Required. An object with 3 required properties (red, green, and blue) and one optional property (alpha). Each of the color components is a number from 0 to 1.
* alignment: Optional. left, right, center, or justify
* weight: Optional. light, normal, or heavy
* breakMode: Optional. clip, word-wrap, truncate-head, truncate-tail, or truncate-middle.
	clip: the text will be displayed on a single line and cut off at the end of the text view
	word-wrap: the text will word wrap until there is no more space, at which point it is clipped to the text view
	truncate-head: the text will be displayed on a single line with an ellipsis at the beginning if the string would be clipped otherwise
	truncate-tail: the text will be displayed on a single line with an ellipsis at the end if the string would be clipped otherwise
	truncate-middle: the text will be displayed on a single line with an ellipsis in the middle if the string would be clipped otherwise
*/

var loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut arcu ut lectus pellentesque ultrices. Sed eu neque et nisl feugiat interdum. Praesent rutrum magna in massa consectetur semper. Nullam gravida odio sit amet purus mattis porta. Sed in est suscipit ipsum imperdiet dapibus. Curabitur cursus fermentum lectus, quis aliquam magna convallis vitae. Maecenas egestas molestie rhoncus. Morbi erat neque, egestas quis condimentum quis, mattis a est. Maecenas vel ipsum a dui posuere tincidunt. Suspendisse tincidunt posuere pretium. Sed in quam eget nibh ultricies dictum. Aliquam est lorem, vestibulum nec congue id, tincidunt vel nunc. Nulla in sem massa, a fermentum purus. In hac habitasse platea dictumst. Vestibulum euismod iaculis justo id rhoncus.";

var screenFrame = atv.device.screenFrame;
var containerView = new atv.View();
var exampleTextViews = [];
containerView.frame = screenFrame;

var startY = screenFrame.height * 0.05;
var currentY = startY;
var hPadding = screenFrame.width * 0.03;
var currentX = hPadding;
var height = screenFrame.height * 0.12;
var width = screenFrame.width * 0.25;

function addTextView () {
	var textView = new atv.TextView();
	textView.backgroundColor = { red: 0.2, blue: 0.2, green: 0.2 };
	
	var vSpacing = screenFrame.height * 0.01;

	textView.frame = {
		x: currentX,
		y: currentY,
		width: width,
		height: height
	};
	
	currentY += height + vSpacing;
	
	if ( currentY + height + vSpacing > containerView.frame.height )
	{
		currentY = startY;
		currentX += width + hPadding;
	}
	
	exampleTextViews.push(textView);
	
	return textView;
}

//
// TextView using only the required attributes
//
var onlyRequiredAttributesView = addTextView();
onlyRequiredAttributesView.attributedString = {
	string: "Only Required Attributes: " + loremIpsum,
	attributes: {
		// Required attributes
		pointSize: 20.0,
		color: { red: 1, blue: 1, green: 1 }
	}
};

//
// TextView's demonstrating alignments
//
var rightAlignmentView = addTextView();
rightAlignmentView.attributedString = {
	string: "Right Alignment",
	attributes: {
		// Required attributes
		pointSize: 20.0,
		color: { red: 1, blue: 1, green: 1 },
		alignment: "right"
	}
};

var centerAlignmentView = addTextView();
centerAlignmentView.attributedString = {
	string: "Center Alignment",
	attributes: {
		// Required attributes
		pointSize: 20.0,
		color: { red: 1, blue: 1, green: 1 },
		alignment: "center"
	}
};

var leftAlignmentView = addTextView();
leftAlignmentView.attributedString = {
	string: "Left Alignment",
	attributes: {
		// Required attributes
		pointSize: 20.0,
		color: { red: 1, blue: 1, green: 1 },
		alignment: "left"
	}
};

//
// TextView's demonstrating weights
//
var normalWeight = addTextView();
normalWeight.attributedString = {
	string: "Normal Weight",
	attributes: {
		// Required attributes
		pointSize: 40.0,
		color: { red: 1, blue: 1, green: 1 },
		weight: "normal"
	}
};

var heavyWeight = addTextView();
heavyWeight.attributedString = {
	string: "Heavy Weight",
	attributes: {
		// Required attributes
		pointSize: 40.0,
		color: { red: 1, blue: 1, green: 1 },
		weight: "heavy"
	}
};

var lightWeight = addTextView();
lightWeight.attributedString = {
	string: "Light Weight",
	attributes: {
		// Required attributes
		pointSize: 40.0,
		color: { red: 1, blue: 1, green: 1 },
		weight: "light"
	}
};

//
// TextView's demonstrating breakModes
//
var clip = addTextView();
clip.attributedString = {
	string: "clip: " + loremIpsum,
	attributes: {
		// Required attributes
		pointSize: 20.0,
		color: { red: 1, blue: 1, green: 1 },
		breakMode: "clip"
	}
};

var wordWrap = addTextView();
wordWrap.attributedString = {
	string: "word-wrap: " + loremIpsum,
	attributes: {
		// Required attributes
		pointSize: 20.0,
		color: { red: 1, blue: 1, green: 1 },
		breakMode: "word-wrap"
	}
};

var truncateHead = addTextView();
truncateHead.attributedString = {
	string: loremIpsum + " truncate-head",
	attributes: {
		// Required attributes
		pointSize: 20.0,
		color: { red: 1, blue: 1, green: 1 },
		breakMode: "truncate-head"
	}
};

var truncateTail = addTextView();
truncateTail.attributedString = {
	string: "truncate-tail: " + loremIpsum,
	attributes: {
		// Required attributes
		pointSize: 20.0,
		color: { red: 1, blue: 1, green: 1 },
		breakMode: "truncate-tail"
	}
};

var truncateMiddle = addTextView();
truncateMiddle.attributedString = {
	string: "truncate-middle: " + loremIpsum,
	attributes: {
		// Required attributes
		pointSize: 20.0,
		color: { red: 1, blue: 1, green: 1 },
		breakMode: "truncate-middle"
	}
};

containerView.subviews = exampleTextViews;
controller.view = containerView;
