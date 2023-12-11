const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema(
  {
    voucher: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
    },
    lastDate: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Voucher", VoucherSchema);
