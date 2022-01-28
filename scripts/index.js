const crypto = require("crypto");

// console.log(crypto.getCurves());
p1 = "56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027";
// pp1 = "8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
p2 = "7f2cfdbcfb9cabc32e10285d95c140f52592de58ff3083ddca7c15e8ee47a84e";
// pp2 = "9632a79656af553F58738B0FB750320158495942";

let alice = crypto.createECDH("secp256k1");
let bob = crypto.createECDH("secp256k1");

alice.setPrivateKey(p1, "hex");
alicePublic = alice.getPublicKey("hex");
console.log("alice " + alicePublic);

bob.setPrivateKey(p2, "hex");
bobPublic = bob.getPublicKey("hex");
console.log("bob " + bobPublic);

alicekey = alice.computeSecret(bobPublic, "hex", "hex");
bobkey = bob.computeSecret(alicePublic, "hex", "hex");

// console.log(alicekey);
// console.log(bobkey);

console.log(alicekey === bobkey);