// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  isbn: { type: String, unique: true },
  published_date: { type: String, required: true },
  issued_to: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    default: null // This means the book is not issued to any student initially
  },
  issueDate: { 
    type: Date, 
    // default: null // This will be set when the book is issued
  },deleted: { type: Boolean, default: false },
  libraryId: { type: String, required: true },
});

module.exports = mongoose.model('Book', bookSchema);
