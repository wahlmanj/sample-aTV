//
// timers.js
// Demonstrates use of the timer callback functions available on atv. Use this with logs/HTTPLogCollector.rb to view JavaScript logs.
//

console.log("Running timers.js ----------------------------");

// one-off timer after 2s
atv.setTimeout(function() {
	console.log('You should see this timer callback exactly once after about 2 seconds.');
}, 2000);

// one-off timer after 2s, killed before it fires
var handle = atv.setTimeout(function() {
	console.log('You should NEVER see this log message, we should have canceled the timer before it runs');
}, 2000);
// example of clearing a timer
atv.clearTimeout(handle);

// repeating timer every 3s
handle = atv.setInterval(function() {
	console.log('You should see this timer callback every 3 seconds for about 10 seconds until we cancel it')
}, 3000);

// one-off timer after 10s that kills the repeating timer, also illustrates how to pass args to the callback function
atv.setTimeout(function(handleToKill) {
	console.log('Killing repeating timer with handle ' + handleToKill);
	atv.clearInterval(handleToKill);
}, 10000, handle);


console.log('leaving timers.js, but timer tests will continue for a few more seconds...')