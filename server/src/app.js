const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const salesRoutes = require("./routes/salesRoutes");
const productRoutes = require("./routes/productRoutes");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*"
    })
  );
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      message: "Retail Intelligence backend is running",
      health: "/api/health",
      chat: "/api/chat",
      inventory: "/api/inventory/summary",
      sales: "/api/sales/summary"
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "retail-intelligence-server" });
  });

  app.use("/api/chat", chatRoutes);
  app.use("/api/inventory", inventoryRoutes);
  app.use("/api/sales", salesRoutes);
  app.use("/api/products", productRoutes);

  return app;
}

module.exports = {
  createApp
};
