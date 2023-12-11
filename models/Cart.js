const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
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
      lastPrice: Number,

      averageStarRating: Number,

      category: {
        type: String,
      },
      tags: [
        {
          name: String,
        },
      ],
      status: {
        type: Boolean,
        default: true,
      },

      quantity: Number,
      unit: String,
      views: Number,
      sold: Number,

      brand: String,
      shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
      },

      count: { type: Number, default: 0 },
    },
  ],
  totalPrice: Number,
});

module.exports = mongoose.model("Cart", CartSchema);
