const OpenAI = require("openai");

let client;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
}

async function enhanceReplyWithOpenAI({
  userMessage,
  structuredReply,
  inventorySummary,
  salesSummary,
  insightSummary = ""
}) {
  if (process.env.USE_OPENAI !== "true") {
    return structuredReply;
  }

  const openai = getOpenAIClient();
  if (!openai) {
    return structuredReply;
  }

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: `You are a concise retail intelligence assistant.
User question: ${userMessage}
Rule-based answer: ${structuredReply}
Insights: ${insightSummary}
Inventory summary: ${JSON.stringify(inventorySummary)}
Sales summary: ${JSON.stringify(salesSummary)}

Rewrite the rule-based answer in a natural and helpful way. Keep it under 120 words. Do not invent inventory or sales numbers.`
    });

    return response.output_text?.trim() || structuredReply;
  } catch (error) {
    console.warn("OpenAI enhancement failed. Using rule-based response.");
    console.warn(error.message);
    return structuredReply;
  }
}

module.exports = {
  enhanceReplyWithOpenAI
};
