//
// dom.js
// Demonstrates use of DOM objects. Use this with logs/HTTPLogCollector.rb to view JavaScript logs.
//

console.log("Running dom.js ----------------------------");

function printElements(dataset, elements) {
    console.log("BEGIN ----------------" + dataset + "-------------------");
    for(var i=0, l=elements.length; i < l; ++i) {
        var e = elements[i];
        console.log(" " + e.tagName);
    }
    console.log("END");
}

var doc = atv.parseXML('<?xml version="1.0" encoding="UTF-8"?><zoo><animals id="animals"><animal id="tom" name="Tom">test data</animal><animal name="Jerry"/></animals></zoo>');

//
// DOM
//
var tomElement = doc.getElementById("tom");

// Element properties
console.log("tomElement tagName: " + tomElement.tagName + ", textContent: " + tomElement.textContent + ", parent: " + tomElement.parent + ", ownerDocument: " + tomElement.ownerDocument + ", childElements: " + tomElement.childElements);

// Attributes
console.log("tomElement attribute name: " + tomElement.getAttribute("name"));
tomElement.setAttribute("name", "The Cat formerly known as Tom");
console.log("tomElement attribute name (should be changed): " + tomElement.getAttribute("name"));
tomElement.removeAttribute("name");
console.log("tomElement attribute name (should be undefined): " + tomElement.getAttribute("name"));

// Tree manipulation
var animalsElement = doc.getElementById("animals");
var logIt = function(msg) { printElements(msg, animalsElement.childElements); }
logIt("Before Modification");
tomElement.removeFromParent();
logIt("After removal");
animalsElement.appendChild(tomElement);
logIt("After appending Tom element back in");
animalsElement.insertChildBefore(doc.makeElementNamed("newElement1"), tomElement);
logIt("After inserting newElement1 before tom");
animalsElement.insertChildAfter(doc.makeElementNamed("newElement2"), tomElement);
logIt("After inserting newElement2 after tom");
animalsElement.replaceChild(tomElement, doc.makeElementNamed("replacementElement1"));
logIt("After replacing tom with replacementElement1");

//
// XPath
//
printElements("XPath //test", doc.evaluateXPath("//test"));
printElements("XPath //animal", doc.evaluateXPath("//animal"));

//
// XML Serialization
//
console.log("Serialized document: " + doc.serializeToString());

console.log("done with dom.js");