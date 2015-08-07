//
// json.js
// Demonstrates use of JSON object. Use this with logs/HTTPLogCollector.rb to view JavaScript logs.
//

console.log("Running json.js ----------------------------");

json =  '{ \
	"myDict" : { "item1" : 123, "items2" : true }, \
	"myArray" : [ "arrayItem1", 2, false, "arrayItem4"] \
}';

console.log("Starting with json string " + json);
object = JSON.parse(json);
console.log("Parsed json into this object: " + object);
