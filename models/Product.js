const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    images: [String],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: Number,
    discount: {
      type: Number,
      default: 0,
    },
    lastPrice: {
      type: Number,
      default: function () {
        return this.price - (this.price * this.discount) / 100;
      },
    },

    averageStarRating: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
    },
    unit: {
      type: String,
    },
    tags: [
      {
        name: String,
      },
    ],
    status: {
      type: Boolean,
      default: false,
    },

    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    currentQuantity: {
      type: Number,
      default: function () {
        return this.quantity - this.sold;
      },
    },

    brand: String,
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
