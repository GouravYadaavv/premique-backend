// models/Analytics.js
const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  visitorId: { type: String, required: true }, // anonymous tracking
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // opti
  eventType: { type: String, required: true }, // "buy_now", "add_to_cart", "page_view"
  productId: { type: String, required: true },
  name: String,
  timestamp: { type: Date, default: Date.now },
  userId: { type: String }, // optional, agar user login ho
  sessionId: { type: String }, // optional, guest tracking ke liye
  timeSpent: { type: Number, default: 0 }, // optional, agar time track karna ho
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = Analytics;
