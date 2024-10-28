// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  author: { type: String, required: true },
  libraryId: { type: String, required: true },
  qty: { type: Number, required: true },
  orderedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
