const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    thumbnail: String,
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [{ name: String }],
    content: {
      type: String,
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
