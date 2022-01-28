const Web3 = require("web3");
require("dotenv").config();
const crypto = require("crypto");
var aes256 = require("aes256");

const chatApp = require("../artifacts/contracts/chatApp.sol/ChatApp.json");
const { decrypt } = require("aes256");

// console.log(process.env.local);
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.local));

const contract = new web3.eth.Contract(
    chatApp.abi,
    "0x52C84043CD9c865236f11d9Fc9F56aa003c1f922"
);

module.exports = {
    sendMessage: async(req, res) => {
        try {
            // console.log(req.body);
            await web3.eth.accounts.wallet.add(req.body.privateKey);
            let user = crypto.createECDH("secp256k1");
            user.setPrivateKey(req.body.privateKey, "hex");

            sharedkey = user.computeSecret(req.body.publicKey, "hex", "hex");

            encrypted = aes256.encrypt(sharedkey, req.body.message);

            await contract.methods.sendMessage(encrypted, req.body.room).send({
                from: `${req.body.address}`,
                gas: 8000000,
            });

            return res.status(200).send("message send");
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
    getMessage: async(req, res) => {
        try {
            let msg = [];
            // console.log(req.body);

            await web3.eth.accounts.wallet.add(req.body.privateKey);
            let user = crypto.createECDH("secp256k1");
            user.setPrivateKey(req.body.privateKey, "hex");

            sharedkey = user.computeSecret(req.body.publicKey, "hex", "hex");

            const countMsg = await contract.methods
                .getMessageCountForRoom(req.body.room)
                .call();

            for (i = 0; i < countMsg; i++) {
                msgObj = {};
                // console.log(i, countMsg);
                seeMsg = await contract.methods
                    .getMessageByIndexForRoom(req.body.room, 0)
                    .call();
                // console.log(seeMsg);
                // msgObj.message = aes256.decrypt(sharedkey, seeMsg[0]);
                msgObj.message = aes256.decrypt(sharedkey, seeMsg[0]);

                msgObj.time = seeMsg[2];
                // name = await contract.methods.getUsernameForAddress(seeMsg[1]).call();
                msg.push(msgObj);
            }
            // console.log(msg);

            // decryptmsg = console.log(req.body);

            return res.status(200).send(msg);
        } catch (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }
    },
};