// models/Book.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  libraryId: { type: String, required: true },
});

module.exports = mongoose.model('Admin', adminSchema);
