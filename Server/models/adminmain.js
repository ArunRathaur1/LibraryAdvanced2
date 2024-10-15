const mongoose = require('mongoose');

// Define Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create and export Admin model
module.exports = mongoose.model('Admin_Main', adminSchema);
