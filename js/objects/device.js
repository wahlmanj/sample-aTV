//
// device.js
// Demonstrates use of device object. Use this with logs/HTTPLogCollector.rb to view JavaScript logs.
//

console.log("Running device.js ----------------------------");

console.log("Display Name is " + atv.device.displayName);
console.log("Current Language is " + atv.device.language);
console.log("Is in retail mode " + atv.device.isInRetailDemoMode);
console.log("Software version is " + atv.device.softwareVersion);

var frame = atv.device.screenFrame;
console.log("Screen Frame is x: " + frame.x + ", y: " + frame.y + ", width: " + frame.width + ", height: " + frame.height);