// models/Library.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const librarySchema = new mongoose.Schema({
  librarianName: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  libraryName: { type: String, required: true },
  libraryCity: { type: String, required: true },
  uniqueId:{type:String,required:true},
  libraryId: { type: String, unique: true }, // Keep this if you need unique libraryId
});

// Middleware to generate unique libraryId before saving
librarySchema.pre('save', function (next) {
  if (!this.libraryId) {
    this.libraryId = uuidv4(); // Generate a unique libraryId using UUID
  }
  next();
});

module.exports = mongoose.model('Library', librarySchema);
