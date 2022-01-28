const express = require("express");
const { sendMessage, getMessage } = require("../controller/message");

const router = express.Router();
router.post("/getMessage", getMessage);
router.post("/sendMessage", sendMessage);

module.exports = router;