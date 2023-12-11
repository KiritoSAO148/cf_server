const mongoose = require("mongoose");

const mongooseSchema = new mongoose.Schema({
  method: String,
  amount: Number,
  time: String,
});

module.exports = mongoose.model("delivery", mongooseSchema);
