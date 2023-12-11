const mongoose = require("mongoose");
const ShopSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bio: String,
    startYear: {
      type: Number,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    ratings: [
      {
        stars: {
          type: Number,
          required: true,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
    averageStarRating: {
      type: Number,
      default: 0,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Shop", ShopSchema);
