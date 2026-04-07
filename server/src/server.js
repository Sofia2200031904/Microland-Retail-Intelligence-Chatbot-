require("dotenv").config();
const { createApp } = require("./app");
const { connectToDatabase } = require("./config/db");

const PORT = process.env.PORT || 5000;
const app = createApp();

async function startServer() {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Retail Intelligence server running on http://localhost:${PORT}`);
  });
}

startServer();

