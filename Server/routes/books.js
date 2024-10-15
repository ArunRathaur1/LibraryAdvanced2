const express = require('express');
const Book = require('../models/Book');
const Student = require('../models/Student');
const Admin=require('../models/Admin');
const router = express.Router();
const verifyAdmin = require('../middleware/checkadmin');
require('dotenv').config();

router.get('/books', verifyAdmin, async (req, res) => {
  try {
    // Retrieve the libraryId from the admin making the request
    const libraryId = req.admin.libraryId;

    // Fetch all books that belong to the same libraryId
    const books = await Book.find({ libraryId }); 
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

router.get('/allbooks', async (req, res) => {
  const { genre, author, libraryName } = req.query;

  let filter = {};
  if (genre) filter.genre = genre;
  if (author) filter.author = author;
  if (libraryName) filter.libraryName = libraryName;

  try {
    const books = await Book.find(filter);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});



module.exports=router;