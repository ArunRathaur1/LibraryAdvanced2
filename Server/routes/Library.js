const express = require('express');
const Book = require('../models/Book');
const Student = require('../models/Student');
const Admin=require('../models/Admin');
const router = express.Router();
require('dotenv').config();


// Hardcoded admin credentials
const password = process.env.PASSWORD;
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: password,
  security_key:"123454234"
};

//add admin
// router.post('/add-admin', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Check if the username already exists
//     const existingAdmin = await Admin.findOne({ username });

//     if (existingAdmin) {
//       return res.status(400).json({ message: 'Admin with this username already exists.' });
//     }

//     // Create new admin
//     const newAdmin = new Admin({ username, password });
//     await newAdmin.save();

//     res.status(201).json({ message: 'Admin added successfully!' });
//   } catch (error) {
//     console.error('Error adding admin:', error);
//     res.status(500).json({ message: 'Server error. Please try again later.' });
//   }
// });

// Delete admin with username and password validation
router.delete('/delete-admin', async (req, res) => {
  const { username, password } = req.body; // Change these to match the frontend

  try {
    // Check if the admin exists with the given username
    const admin = await Admin.findOne({ username: username });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    // Validate the password
    if (admin.password !== password) {
      return res.status(403).json({ message: 'Incorrect password.' });
    }

    // If username and password are correct, delete the admin
    await Admin.deleteOne({ username: username });
    res.status(200).json({ message: 'Admin deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred while deleting admin.' });
  }
});


// Admin login route
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return res.json({ message: 'Login successful', isAdmin: true, key:ADMIN_CREDENTIALS.security_key});
  } else {
    return res.status(401).json({ message: 'Invalid credentials',isAdmin:false, key:""});
  }
});

// Admin-only routes to manage books and students
// Route to add a new book
router.post('/books', async (req, res) => {
  const { title, author, genre, isbn, published_date } = req.body;

  try {
    // Check if a book with the same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'This book already exists in the library.' });
    }

    // If not, create a new book
    const newBook = new Book({ title, author, genre, isbn, published_date });
    await newBook.save();

    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


// Route to get all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from the database
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

router.put('/books/:id', async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedBook);
});

router.delete('/books/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted successfully' });
});



// Route to add a new student
router.post('/students', async (req, res) => {
  const { name, phone, address, student_id,email,password } = req.body;

  try {
    // Check if a student with the same student_id already exists
    const existingStudent = await Student.findOne({ student_id });
    if (existingStudent) {
      return res.status(400).json({ message: 'This student ID already exists. Please use a different ID.' });
    }

    // If not, create a new student
    const newStudent = new Student({ name, phone, address, student_id,email,password });
    await newStudent.save();

    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


// Route to get all students
router.get('/students', async (req, res) => {
  try {
    const student = await Student.find(); // Fetch all books from the database
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
});

router.put('/students/:id', async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedStudent);
});

router.delete('/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: 'Student deleted successfully' });
});

// routes/library.js

router.get('/students/issued', async (req, res) => {
  try {
    const students = await Student.find().populate({
      path: 'issued_books',
      select: 'title author isbn issueDate' // Include issueDate in the response
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});


// Public route for users to search for books by genre
router.get('/books/search', async (req, res) => {
  const books = await Book.find({ genre: req.query.genre });
  res.json(books);
});

// routes/library.js

router.post('/issue', async (req, res) => {
  const { student_id, isbn } = req.body;

  try {
    const book = await Book.findOne({ isbn });
    const student = await Student.findOne({ student_id });

    // Check if the book and student exist
    if (!book || !student) {
      return res.status(404).json({ message: '-1' });//"no book or studnet found"
    }

    // Check if the book is already issued
    if (book.issued_to) {
      return res.status(400).json({ message: '-2' });//aredy issued
    }

    // Check if the student has reached the maximum limit of issued books
    if (student.issued_books.length >= 2) {
      return res.status(400).json({ message: '-3' });//Maximum limit of issued books reached (2 books)
    }

    // Issue the book
    book.issued_to = student._id;
    book.issueDate = new Date();
    await book.save();

    // Add the issued book to the student's issued_books list
    student.issued_books.push(book._id);

    // Add the book issue event to the student's history
    student.bookHistory.push({
      book: book._id,
      issueDate: new Date(),
      returnDate: null // Not returned yet
    });

    await student.save();

    res.status(200).json({ message: 'Book issued successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.post('/return', async (req, res) => {
  const { student_id, isbn } = req.body;

  try {
    const student = await Student.findOne({ student_id });
    const book = await Book.findOne({ isbn });

    if (!student || !book) {
      return res.status(404).json({ message: 'Student or Book not found' });
    }

    const issuedBookIndex = student.issued_books.indexOf(book._id);
    if (issuedBookIndex === -1) {
      return res.status(400).json({ message: 'This book was not issued to this student.' });
    }

    // Remove the book from currently issued_books list
    student.issued_books.splice(issuedBookIndex, 1);

    // Update the return date in the student's history
    const historyEntry = student.bookHistory.find(
      history => history.book.equals(book._id) && !history.returnDate
    );
    if (historyEntry) {
      historyEntry.returnDate = new Date();
    }

    // Update book as available again
    book.issued_to = null;
    await book.save();
    await student.save();

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to get issued books by a particular student using student_id as a parameter
// Route to get issued books by a particular student using student_id and password
router.post('/students/history', async (req, res) => {
  const { student_id, password } = req.body; // Get student ID and password from the request body

  try {
    // Find the student by student_id
    const student = await Student.findOne({ student_id }).populate('issued_books').populate({
      path: 'bookHistory.book',
      model: 'Book'
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Validate the password
    if (student.password !== password) { // Compare plain text passwords
      return res.status(403).json({ message: 'Incorrect password' }); // Invalid password
    }

    // Currently issued books (where returnDate is null)
    const currentlyIssuedBooks = student.issued_books.map(book => {
      const historyEntry = student.bookHistory.find(history => history.book.equals(book._id) && history.returnDate === null);
      return {
        title: book.title,
        isbn: book.isbn,
        issueDate: historyEntry ? historyEntry.issueDate : null, // Take issueDate from the history entry
      };
    });

    // Full book issue/return history
    const fullHistory = student.bookHistory.map(entry => ({
      title: entry.book.title,
      isbn: entry.book.isbn,
      issueDate: entry.issueDate,
      returnDate: entry.returnDate ? entry.returnDate : 'Not returned yet',
    }));

    res.status(200).json({
      name: student.name,
      student_id: student.student_id,
      currently_issued_books: currentlyIssuedBooks,
      history: fullHistory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});








// Route to get currently issued books
// router.get('/issued-books', async (req, res) => {
//   try {
//     // Fetch all students with their issued books
//     const students = await Student.find().populate('issued_books');

//     // Prepare a response structure
//     const issuedBooks = students.map(student => ({
//       student_id: student.student_id,
//       name: student.name,
//       issued_books: student.issued_books.map(book => ({
//         title: book.title,
//         isbn: book.isbn,
//       })),
//     }));

//     res.status(200).json(issuedBooks);
//   } catch (error) {
//     console.error('Error fetching issued books:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });





module.exports = router;
