const mongoose = require("mongoose");

const tokenItem = new mongoose.Schema({
  tokens: [String],
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: String,
    platform: {
      type: String,
      enum: ["mobile", "web"],
    },
  },
});

const TokensNotification = new mongoose.Schema({
  tokens: [tokenItem],
  devices: {
    mobile: [String],
    web: [String],
  },
});

module.exports = mongoose.model("TokensNotification", TokensNotification);
