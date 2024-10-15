const express = require('express');
const Book = require('../models/Book');
const Student = require('../models/Student');
const Admin=require('../models/Admin');
const router = express.Router();
require('dotenv').config();

router.get('/books', async (req, res) => {
    try {
      const books = await Book.find(); // Fetch all books from the database
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
  });

  router.get('/books/search', async (req, res) => {
    const books = await Book.find({ genre: req.query.genre });
    res.json(books);
  });

module.exports=router;