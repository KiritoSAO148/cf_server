const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    users: Array,
    message: {
      text: String,
      image: String,
    },
    reply: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ user: 1 });

module.exports = mongoose.model("Message", MessageSchema);
