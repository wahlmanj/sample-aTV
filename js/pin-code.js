/*
* pincode.js
* Draws pincode screen.
*/

/*
  Globals
*/


  var screenFrame = atv.device.screenFrame;
  var width = screenFrame.width;
  var height = screenFrame.height;
  var pinCode = getPinCode();
  var host = 'http://sample-web-server/sample-xml/images/pincode/';
  var pinCodeTitle = "Connect to Service";
  var pinCodeInstructions = "To unlock content for SERVICE NAME please visit sample-web-server/AppleTV in your web browser and use the PIN code above to authorize your account.";
  var pinCodeSuccessTitle = "Congratulations";
  var pinCodeSuccessInstructions = "Your account is authorized, content for SERVICE NAME is now unlocked and available to watch";

  function generatePin() {
    pinCode = new Array();
    for( var i = 0; i < 5; i++ ) {
    	pinCode.push( Math.floor( Math.random() * 10 ) );
    }
    return pinCode
  }

  function getPinCode() {
  	var pinCode = atv.sessionStorage["pinCode"]; // in a real service the pincode should be stored in localStorage which is persistent on device. For the demonstration we are using sessionStorage so that a new Pin Code is created each time you enter the site.
  	if (!pinCode) {
  		pinCode = generatePin();
  		atv.sessionStorage["pinCode"] = pinCode;
  	}
  	return pinCode;
  };

  function drawPin() {
    viewArray = new Array();
    for( var i = 0; i < pinCode.length; i++ ) {
      var imageView = new atv.ImageView();
      imageView.frame = { x: ( ( width * .5 ) - 340 ) + ( 136 * i ), y: ( (height * .53) - 67 ), width: 116, height: 135 };
      imageView.loadImageAtURL(host + pinCode[i] + '.png');
    	viewArray.push(imageView)
    }
    return viewArray
  }

  /*
    Title
  */

  var textViewTitle = new atv.TextView();

  textViewTitle.attributedString = {
  	string: pinCodeTitle,
  	attributes: {
  		pointSize: 56.0,
  		color: { red: 1, blue: 1, green: 1 },
  		alignment: "center",
  		breakMode: "word-wrap"
  	}
  };

  textViewTitle.frame = {
  	x: 0,
  	y: 0 - ( height * 0.25 ),
  	width: width,
  	height: height
  };

  /*
    Instructions
  */

  var textViewInstructions = new atv.TextView();

  textViewInstructions.attributedString = {
  	string: pinCodeInstructions,
  	attributes: {
  		pointSize: 26.0,
  		color: { red: 1, blue: 1, green: 1 },
  		alignment: "center",
  		breakMode: "word-wrap"
  	}
  };

  textViewInstructions.frame = {
  	x: ( width / 2 ) - ( width / 3.4 ),
  	y: 0 - ( height * 0.60 ),
  	width: width / 1.7,
  	height: height
  };

  /*
    Congratulation Title
  */

  var textViewCongratulationsTitle = new atv.TextView();

  textViewCongratulationsTitle.attributedString = {
  	string: pinCodeSuccessTitle,
  	attributes: {
  		pointSize: 56.0,
  		color: { red: 1, blue: 1, green: 1 },
  		alignment: "center",
  		breakMode: "word-wrap"
  	}
  };

  textViewCongratulationsTitle.frame = {
  	x: 0,
  	y: 0 - ( height * 0.25 ),
  	width: width,
  	height: height
  };

  /*
    Congratulations Subheading
  */

  var textViewCongratulations = new atv.TextView();

  textViewCongratulations.attributedString = {
  	string: pinCodeSuccessInstructions,
  	attributes: {
  		pointSize: 26.0,
  		color: { red: 1, blue: 1, green: 1 },
  		alignment: "center",
  		breakMode: "word-wrap"
  	}
  };

  textViewCongratulations.frame = {
  	x: ( width / 2 ) - ( width / 3.4 ),
  	y: 0 - ( height * 0.40 ),
  	width: width / 1.7,
  	height: height
  };

  /*
    Draw Congratulations View
  */

  function drawCongratulationsView() {
    var congratulationsSubViews = [textViewCongratulationsTitle, textViewCongratulations],
        congratulationsView = new atv.View(); 
    
    congratulationsView.subviews = congratulationsSubViews
    controller.view = congratulationsView;
  }

  /*
    Draw the subviews to the rootview
  */


  var subviewElements = drawPin();
      subviewElements.push(textViewInstructions, textViewTitle)

  var rootView = new atv.View();
      rootView.subviews = subviewElements

  controller.view = rootView;

  /*
    Fake out the success message
  */
  
  var successScreen = atv.setTimeout(function(){
    drawCongratulationsView();
  }, 5000);
