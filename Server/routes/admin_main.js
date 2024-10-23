const express = require('express');
const bcrypt = require('bcryptjs');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');
const verifyAdmin = require('../middleware/checkadmin');
const AdminMain = require('../models/adminmain'); // Import the Admin_Main model
const Library=require('../models/library');
const Student=require('../models/Student');
const Order=require('../models/Order');
// const Message=require('../models/Message');
const router = express.Router();


// Route to add an Admin_Main user (Already present)
router.post('/add-admin-main',  async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists in Admin_Main
    const existingAdmin = await AdminMain.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this username already exists in Admin_Main.' });
    }

    // Hash the password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new adminMain user with the hashed password
    const newAdminMain = new AdminMain({ username, password: hashedPassword });
    await newAdminMain.save();

    // Generate a JWT token for the new Admin_Main user
    const token = jwt.sign(
      { id: newAdminMain._id }, // Payload: contains admin's ID
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '7d' } // Token expiration time
    );

    res.status(201).json({ message: 'Admin_Main added successfully!', token });
  } catch (error) {
    console.error('Error adding Admin_Main:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

router.delete('/delete-admin-main', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check the number of admins in the database
    const adminCount = await AdminMain.countDocuments();

    if (adminCount <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last admin.' });
    }

    // Find the admin by username
    const adminToDelete = await AdminMain.findOne({ username });
    if (!adminToDelete) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    // Check if the provided password matches the stored hashed password
    const isMatch = await bcrypt.compare(password, adminToDelete.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Invalid password.' });
    }

    // Delete the admin
    await AdminMain.findByIdAndDelete(adminToDelete._id);
    res.status(200).json({ message: 'Admin deleted successfully!' });
  } catch (error) {
    console.error('Error deleting Admin_Main:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});
// Route for Admin_Main login
router.post('/admin-main-login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the admin exists
    const admin = await AdminMain.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Generate a JWT token for the admin
    const token = jwt.sign(
      { id: admin._id }, // Payload: contains admin's ID
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '7d' } // Token expiration time
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


router.post('/create-library', async (req, res) => {
  console.log(req.body);
  const { librarianName, email, contactNumber, libraryName, libraryCity,uniqueId } = req.body;

  try {
    // Create new library document
    const newLibrary = new Library({
      librarianName,
      email,
      contactNumber,
      libraryName,
      libraryCity,
      uniqueId
    });

    // Save the new library to the database
    const savedLibrary = await newLibrary.save();

    // Return the MongoDB unique ID (_id) of the library
    res.status(201).json({ message: 'Library created successfully', uniqueId });
  } catch (error) {
    console.error('Error saving library data:', error);
    res.status(500).json({ message: 'Error saving library data', error });
  }
});

// GET route to fetch all libraries
router.get('/librariesData', async (req, res) => {
  try {
    // Fetch all libraries from the database
    const libraries = await Library.find();

    // Return the list of libraries
    res.status(200).json({ message: 'Libraries retrieved successfully', libraries });
  } catch (error) {
    console.error('Error fetching library data:', error);
    res.status(500).json({ message: 'Error fetching library data', error });
  }
});

router.get('/libraries', async (req, res) => {
  const city = req.query.city; // Use query parameter instead of path parameter
  try {
    const libraries = await Library.find({ libraryCity: city });
    res.status(200).json(libraries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching libraries', error });
  }
});

router.get('/allbooks', async (req, res) => {
  try {
    // Fetch all books
    let books = await Book.find();
    // Fetch all libraries
    let libraries = await Library.find();
    console.log(libraries);
    // Loop over each book and append matching library details
    books = books.map(book => {
      // Find the matching library by the book's libraryId
      const library = libraries.find(lib => lib.uniqueId === book.libraryId);
      
      if (library) {
        // Convert Mongoose document to plain object
        book = book.toObject();
        
        // Add the library details to the book object
        book.libraryDetails = {
          librarianName: library.librarianName,
          email: library.email,
          contactNumber: library.contactNumber,
          libraryName: library.libraryName,
          libraryCity: library.libraryCity,
        };
      }
      return book;
    });

    // Respond with the combined books and library data
    res.status(200).json(books);
  } catch (error) {
    // Handle any errors during the fetch operation
    res.status(500).json({ message: 'Error fetching books and libraries', error });
  }
});

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

router.get('/report', async (req, res) => {
  try {
    const libraries = await Library.find();
    const books = await Book.find();
    const students = await Student.find();

    // Aggregate data for each library
    const libraryData = libraries.map(library => {
      // Filter books by libraryId and count them
      const totalBooks = books.filter(book => book.libraryId === library.uniqueId && !book.deleted).length;

      // Filter students by libraryId and count them
      const totalStudents = students.filter(student => student.libraryId === library.uniqueId).length;

      return {
        libraryName: library.libraryName,
        city: library.libraryCity,
        uniqueId: library.uniqueId,
        totalBooks: totalBooks,
        totalStudents: totalStudents
      };
    });

    res.json({ libraries: libraryData });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ error: 'Failed to fetch report data' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

  //Message sending route
  // POST route to update the message
  // router.post('/message', async (req, res) => {
  //   const { message } = req.body;
  //   try {
  //     // Update the existing message or create a new one if it doesn't exist
  //     const updatedMessage = await Message.findOneAndUpdate(
  //       {}, // Empty filter will find the first document
  //       { message: message }, // Set the new message
  //       { upsert: true, new: true } // Upsert and return the updated document
  //     );
  //     res.status(200).json(updatedMessage);
  //   } catch (error) {
  //     console.error('Error updating message:', error);
  //     res.status(500).json({ error: 'Error updating the message' });
  //   }
  // });
  
  
  //   router.get('/message', async (req, res) => {
  //     try {
  //       const message = await Message.findOne({});
  //       res.status(200).json(message);
  //     } catch (error) {
  //       res.status(500).json({ error: 'Error fetching the message' });
  //     }
  //   });



module.exports = router;
