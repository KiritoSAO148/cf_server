const mongoose = require("mongoose");

const OrderItem = new mongoose.Schema(
  {
    products: [
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
        unit: String,

        views: {
          type: Number,
          default: 0,
        },
        count: { type: Number, default: 0 },
      },
    ],
    totalPrice: Number,
    voucherUsed: {
      voucher: String,
      discount: Number,
    },
    status: {
      type: String,
      enum: ["pending", "success", "access", "done", "refuse"],
      default: "pending",
      index: true,
    },

    message: {
      type: String,
      default: "",
    },

    pay: {
      method: {
        type: String,
        enum: ["payNow", "lastPay"],
        required: true,
      },
      amount: {
        type: Number,
        default: function () {
          return this.totalPrice;
        },
      },
      status: {
        type: String,
        enum: ["pending", "falure", "success"],
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orders: [OrderItem],
});

module.exports = mongoose.model("Order", OrderSchema);
