//
// http.js
// Demonstrates use of XMLHttpRequest object. Use this with logs/HTTPLogCollector.rb to view JavaScript logs.
//

console.log("Running http.js ----------------------------");

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
				var json = JSON.parse(req.responseText);
				console.log('JSON Response text is ' + json["result"]);
			}
			else
			{
				console.error('HTTP request failed. Status ' + req.status + ': ' + req.statusText);
			}
		}
	}
	catch (e)
	{
		console.error('Caught exception while processing request. Aborting. Exception: ' + e);
		req.abort();
	}
}

// NOTE: Normally you will set the 3rd parameter to true, which will make the http request asyncrhonous.
req.open("GET", "http://sample-web-server/sample-xml/js/objects/test.json", false);
req.send();

var reqXML = new XMLHttpRequest();

reqXML.onreadystatechange = function() {

	try
	{
		console.log('Got ready state change of ' + reqXML.readyState);

		if (reqXML.readyState == 4 )
		{
			console.log('Got status code of ' + reqXML.status);
	
			if ( reqXML.status == 200)
			{
				var result = reqXML.responseXML.evaluateXPath("//response/result")[0].textContent;
				console.log('XML result is ' + result);
			}
			else
			{
				console.error('HTTP request failed. Status ' + reqXML.status + ': ' + reqXML.statusText);
			}
		}
	}
	catch (e)
	{
		console.error('Caught exception while processing request. Aborting. Exception: ' + e);
		reqXML.abort();
	}
}

// NOTE: Normally you will set the 3rd parameter to true, which will make the http request asyncrhonous.
reqXML.open("GET", "http://sample-web-server/sample-xml/js/objects/test.xml", false);
reqXML.send();

console.log("http.js finished executing");