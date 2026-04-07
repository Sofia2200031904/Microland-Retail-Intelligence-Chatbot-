const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    sku: { type: String, required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    soldAt: { type: Date, required: true },
    channel: { type: String, required: true },
    customerType: { type: String, required: true }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Sale", saleSchema);

