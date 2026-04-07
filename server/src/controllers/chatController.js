const { processChatMessage } = require("../services/chatService");

async function chatWithAssistant(req, res) {
  try {
    const { message, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await processChatMessage(message.trim(), context || {});
    return res.json(response);
  } catch (error) {
    console.error("Chat controller error:", error);
    return res.status(500).json({ error: "Failed to process chat request" });
  }
}

module.exports = {
  chatWithAssistant
};
