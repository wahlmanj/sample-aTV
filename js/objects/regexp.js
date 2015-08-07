//
// regex.js
// Demonstrates use of RegExp object. Use this with logs/HTTPLogCollector.rb to view JavaScript logs.
//

console.log("Running regexp.js ----------------------------");

//
// Using a regular expression to change data format
//
var re = /(\w+)\s(\w+)/;
var str = "John Smith";
var newstr = str.replace(re, "$2, $1"); // Rewrite to "Smith, John"
console.log('Should be "Smith, John": ' + newstr);
