const Web3 = require("web3");
const fs = require("fs");
const { accounts } = require("./acc");
require("dotenv").config();

const chatApp = require("./artifacts/contracts/chatApp.sol/ChatApp.json");

env = process.env;
const web3 = new Web3(new Web3.providers.HttpProvider(env.local));

const init = async() => {
    const id = await web3.eth.net.getId();
    console.log(id);

    const contract = new web3.eth.Contract(
        chatApp.abi,
        "0x52C84043CD9c865236f11d9Fc9F56aa003c1f922"
    );

    // for read owner variable from contract
    const Owner = await contract.methods.owner().call();
    console.log("Owner", Owner);

    // for read test variable from contract
    const Name = await contract.methods.test().call();
    console.log("Name", Name);

    // this function check contract balance
    const Balance = await contract.methods.getBalance().call();
    console.log("Balance", Balance);

    // this web3 method add account by given private key
    const accounts = await web3.eth.accounts.wallet.add(
        "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"
    );

    // this function creat user from given address
    const NewUser = await contract.methods.createUser("mahesh").send({
        from: "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
        gas: 100000,
    });

    // Transact AVAX from acc1 to acc2
    const transaction = await web3.eth.sendTransaction({
        from: "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
        to: "0x9632a79656af553F58738B0FB750320158495942",
        value: web3.utils.toWei("2", "ether"),
        gas: 1000000,
    });
    // console.log(transaction);

    // this function get username for given address
    const user = await contract.methods
        .getUsernameForAddress("0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC")
        .call();
    console.log("user", user);
};

init();