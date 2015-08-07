//
// crypto.js
// Demonstrates use of crypto object. Use this with logs/HTTPLogCollector.rb to view JavaScript logs.
//

console.log("Running crypto.js ----------------------------");

data = "Test data to compute signature on";

md5 = atv.crypto.MD5(data);
sha1 = atv.crypto.SHA1(data);
sha224 = atv.crypto.SHA224(data);
sha256 = atv.crypto.SHA256(data);
sha384 = atv.crypto.SHA384(data);
sha512 = atv.crypto.SHA512(data);

console.log("MD5: " + md5);
console.log("SHA1: " + sha1);
console.log("SHA224: " + sha224);
console.log("SHA256: " + sha256);
console.log("SHA384: " + sha384);
console.log("SHA512: " + sha512);
