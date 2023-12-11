const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: String,
      lastname: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    avatar: {
      type: String,
      default: "",
    },
    address: {
      city: String,
      district: String,
      ward: String,
      street: String,
      more: String,
    },
    role: {
      type: String,
      enum: ["user", "staff", "producer", "admin", "superadmin"],
      default: "admin",
    },
    googleId: String,
    facebookId: String,
    verifyEmail: {
      type: Boolean,
      default: false,
    },
    verifyPhone: {
      type: Boolean,
      default: false,
    },
    verificationCode: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
