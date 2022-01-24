const { expect } = require("chai");
const { assert, Console } = require("console");
const { ethers } = require("hardhat");
const { it } = require("mocha");
const Web3 = require("web3");

// const chatApp = artifacts.require("ChatApp");

// contract("SimpleStorageContract", () => {
//     it("Contract Deployed", async() => {
//         const simpleChatApp = await chatApp.deployed();
//         console.log("Address", simpleChatApp);
//         expect(simpleChatApp.address !== "");
//     });
// });

describe("test1", function() {
    it("test contract was able to deploy", async function() {
        // const [owner] = await ethers.getSigners();
        // console.log(owner);
        const chatApp = await ethers.getContractFactory("ChatApp");
        const chatapp = await chatApp.deploy();

        const testName = await chatapp.test();
        assert(testName === "kishan");
    });

    it("creat user and getuser by address methods are working", async function() {
        const testName = "kishan1";
        const [owner] = await ethers.getSigners();

        const chatApp = await ethers.getContractFactory("ChatApp");
        const chatapp = await chatApp.deploy();

        await chatapp.createUser(testName);

        const userName = await chatapp.getUsernameForAddress(owner.address);
        assert(userName === testName);
    });

    it("sendMessage and getMessageByIndexForRoom function is working", async function() {
        const message = "hello testing 1";
        const room = "testRoom1";

        const chatApp = await ethers.getContractFactory("ChatApp");
        const chatapp = await chatApp.deploy();

        await chatapp.sendMessage(message, room);
        const GetMessage = await chatapp.getMessageByIndexForRoom(room, 0);
        // console.log("GetMessage", GetMessage);
        assert(GetMessage[0] === message);
    });

    it("getMessageCountForRoom function is working", async function() {
        const message = "hello testing 1";
        const message2 = "hello testing 2 ";
        const room = "testRoom1";

        const chatApp = await ethers.getContractFactory("ChatApp");
        const chatapp = await chatApp.deploy();

        await chatapp.sendMessage(message, room);
        await chatapp.sendMessage(message2, room);

        const GetMessage = await chatapp.getMessageByIndexForRoom(room, 0);
        const GetMessage2 = await chatapp.getMessageByIndexForRoom(room, 1);
        // console.log(GetMessage[0], GetMessage2[0]);

        let GetMessageNumber = await chatapp.getMessageCountForRoom(room);
        GetMessageNumber = parseInt(GetMessageNumber._hex, 16);
        // console.log("GetMessageNumber", GetMessageNumber);
        assert(GetMessageNumber === 2);
    });
});