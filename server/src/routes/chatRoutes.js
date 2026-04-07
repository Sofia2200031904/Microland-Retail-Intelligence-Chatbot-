const express = require("express");
const { chatWithAssistant } = require("../controllers/chatController");

const router = express.Router();

router.post("/", chatWithAssistant);

module.exports = router;

