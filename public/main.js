console.log("UTILS.....");

var chatApp;
var contract;
let privateKey;
if (
    localStorage.getItem("Private_Key") == null ||
    localStorage.getItem("Private_Key") == undefined
) {
    privateKey = prompt("Please enter your Private Key:");
    localStorage.setItem("Private_Key", privateKey);
}
privateKey = localStorage.getItem("Private_Key");
let name;
let accounts;
let address = localStorage.getItem("Public_Key");
let msg;
let roomName;
let _roomName;
let publicKey;

web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:59134/ext/bc/C/rpc")
);
const init = async() => {
    console.log("init");
    console.log("chatApp", chatApp);
    chatApp = await $.getJSON("./abi/ChatApp.json");

    console.log("intract");

    // const contractAddress = chatApp.networks[5777].address;

    contract = await new web3.eth.Contract(
        chatApp.abi,
        "0x52C84043CD9c865236f11d9Fc9F56aa003c1f922"
    );
    console.log("contract", contract);
    const Owner = await contract.methods.owner().call();
    console.log("Owner", Owner);

    async function getAddress() {
        accounts = await web3.eth.accounts.wallet.add(privateKey);
        console.log("accounts", accounts);
        address = accounts.address;
        localStorage.setItem("Public_Key", accounts.address);
    }

    getAddress();
    createUser();
};

async function createUser() {
    name = prompt("Enter your name");
    console.log(name);
    const NewUser = await contract.methods.createUser(name).send({
        from: address,
        gas: 8000000,
    });
    console.log("NewUser", NewUser);
}

async function getRoomName() {
    if (roomName == undefined || roomName == "") {
        roomName = prompt("Enter Room Name");
    }
}

async function getPublicKey() {
    if (publicKey == undefined || publicKey == "") {
        publicKey = prompt("Enter receivers publickey");
    }
}
async function sendMessage() {
    msg = document.getElementById("_msg").value;
    getRoomName();
    getPublicKey();
    _roomName = roomName;

    res = await axios
        .post(`/app/sendMessage`, {
            privateKey: privateKey,
            publicKey: publicKey,
            message: msg,
            room: roomName,
            address: address,
        })
        .then((res) => {
            console.log(res);
            console.log(res.data);
        });

    seemessage();
}

async function seemessage() {
    getPublicKey();
    await getRoomName();
    msg = await axios.post(`/app/getMessage`, {
        privateKey: privateKey,
        publicKey: publicKey,
        room: roomName,
        address: address,
    });

    // if (msg) {}

    console.log("this is error " + msg);

    const countMsg = await contract.methods
        .getMessageCountForRoom(roomName)
        .call();

    // console.log(countMsg);

    const seeMsg1 = await contract.methods
        .getMessageByIndexForRoom(roomName, 0)
        .call();

    // console.log(seeMsg1);

    $("#messageul").show();
    $(".messageLi").remove();

    for (i = 0; i < msg.data.length; i++) {
        li = `<li class="messageLi">
    <div class="container darker">
        <p>${msg.data[i].message}</p>
        <span> Time:${msg.data[i].time}</span>
    </div>
</li>`;
        $("#messageul").append(li);
    }
}
async function writemessage() {
    $("#inputbox").show();
}