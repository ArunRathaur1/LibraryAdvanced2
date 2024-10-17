const express = require('express');
const Book = require('../models/Book');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyAdmin =require('../middleware/checkadmin');
const Student = require('../models/Student');
const Admin=require('../models/Admin');
// const Message=require('../models/Message');
const nodemailer = require('nodemailer');
// const Library=require('../models/Library')
const cron = require('node-cron');
const router = express.Router();
const twilio = require('twilio');
const StaffMessage=require('../models/StaffMesage.js');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = twilio(accountSid, authToken);
const yourWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;


//Route to add a staff Mesage that takes message and libraryId and if message with same liraryId found then update the message
router.post('/staffmessage',verifyAdmin, async (req, res) => {
  const { message } = req.body;
  const libraryId = req.admin.libraryId;
  try {
    // Update the existing message or create a new one if it doesn't exist
    const updatedMessage = await StaffMessage.findOneAndUpdate(
      {libraryId:libraryId}, // Empty filter will find the first document
      { message: message,libraryId:libraryId }, // Set the new message
      { upsert: true, new: true } // Upsert and return the updated document
    );
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Error updating the message' });
  }
});

//Make a get request to get the staff message take libraryId from the request body
router.post('/getstaffmessage', async (req, res) => {
  const { libraryId } = req.body;
  try {
    const message = await StaffMessage.findOne({libraryId:libraryId});
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the message' });
  }
});

router.post('/add-admin',verifyAdmin, async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the username already exists
      const existingAdmin = await Admin.findOne({ username });
  
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin with this username already exists.' });
      }
  
      // Hash the password using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new admin with the hashed password
      const newAdmin = new Admin({ username, password: hashedPassword });
      await newAdmin.save();
  
      // Generate a JWT token
      const token = jwt.sign(
        { id: newAdmin._id }, // Payload: contains admin's ID
        process.env.JWT_SECRET, // Secret key
        { expiresIn: '7d' } // Token expiration time
      );
  
      res.status(201).json({ message: 'Admin added successfully!', token });
    } catch (error) {
      console.error('Error adding admin:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Delete admin with username and password validation
router.delete('/delete-admin', verifyAdmin, async (req, res) => {
  const { username, password } = req.body; // Get username and password from the request body

  try {
      // Check if there are more than one admins in the database
      const adminCount = await Admin.countDocuments();
      if (adminCount === 1) {
          return res.status(400).json({ message: 'Unable to delete the admin. At least one admin must be present.' });
      }

      // Check if the admin exists with the given username
      const admin = await Admin.findOne({ username: username });

      if (!admin) {
          return res.status(404).json({ message: 'Admin not found.' });
      }

      // Validate the password using bcrypt
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
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
router.post('/admin/login', async (req, res) => {
  const { username, password, libraryId } = req.body; // Include libraryId in the request body

  try {
      // Check if an admin with the provided username exists
      const admin = await Admin.findOne({ username });

      // If admin doesn't exist, return an error
      if (!admin) {
          return res.status(401).json({ message: 'Invalid credentials', isAdmin: false });
      }

      // Check if the provided libraryId matches the admin's libraryId
      if (admin.libraryId !== libraryId) {
          return res.status(401).json({ message: 'Invalid credentials', isAdmin: false });
      }

      // Check if the provided password matches the hashed password in the database
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials', isAdmin: false });
      }

      // Create a JWT token
      const token = jwt.sign(
          { id: admin._id, isAdmin: true }, // Payload with admin ID and role
          process.env.JWT_SECRET, // Secret key from environment variables
          { expiresIn: '7d' } // Token expiration time
      );

      // Return the token to the frontend
      return res.json({ message: 'Login successful', token });
  } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Server error' });
  }
});

  

// Admin-only routes to manage books and students
// Route to add a new book
router.post('/books', verifyAdmin, async (req, res) => {
  const { title, author, genre, isbn, published_date } = req.body;
  
  // Retrieve libraryId from the admin who is making the request
  const libraryId = req.admin.libraryId;

  try {
    // Check if a book with the same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'This book already exists in the library.' });
    }

    // If not, create a new book with libraryId
    const newBook = new Book({ 
      title, 
      author, 
      genre, 
      isbn, 
      published_date, 
      libraryId // Store the libraryId with the book details
    });

    await newBook.save();

    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.put('/books/:id',verifyAdmin, async (req, res) => {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  });
  
  router.delete('/books/:id', verifyAdmin, async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      book.deleted = true;
      await book.save(); // Save the updated book with 'deleted' set to true
  
      res.json({ message: 'Book marked as deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error occurred while deleting the book', error: err });
    }
  });
  

// Route to add a new student
router.post('/students', verifyAdmin, async (req, res) => {
  const { name, phone, address, student_id, email, password } = req.body;

  try {
    // Check if a student with the same student_id already exists
    const existingStudent = await Student.findOne({ student_id });
    if (existingStudent) {
      return res.status(400).json({ message: 'This student ID already exists. Please use a different ID.' });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10); // Generates a salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt); // Hashes the password with the salt

    // Set the current date as the entry date
    const entrydate = new Date(); // Automatically capture the entry date

    // Get the libraryId from the admin object attached by the verifyAdmin middleware
    const libraryId = req.admin.libraryId; // Access the libraryId directly from req.admin

    // Create a new student with the hashed password, entry date, and library ID
    const newStudent = new Student({
      name,
      phone,
      address,
      student_id,
      email,
      entrydate: entrydate, // Add the entry date to the student model
      password: hashedPassword, // Store the hashed password
      feeStatus: { paymentDuration: 'Not paid', lastPaymentDate: new Date() }, // Set a default fee status if required
      libraryId: libraryId // Store the libraryId with the student data
    });

    await newStudent.save();

    res.status(201).json({
      message: 'Student added successfully',
      student: newStudent,
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


  
router.put('/students/:id', verifyAdmin, async (req, res) => {
  try {
    const { password, ...otherUpdates } = req.body; // Destructure password and other fields

    // If password exists and is not empty, hash it
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10); // Generate a salt
      const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt
      otherUpdates.password = hashedPassword; // Update password in the updates object
    }

    // Find and update the student with the other fields (including hashed password if it was updated)
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, otherUpdates, { new: true });

    res.json(updatedStudent); // Return the updated student object
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});
  
  router.delete('/students/:id',verifyAdmin, async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  });

  router.get('/students/issued', verifyAdmin, async (req, res) => {
    try {
      // Find students with the same libraryId as the admin
      const students = await Student.find({ libraryId: req.admin.libraryId }).populate({
        path: 'issued_books',
        select: 'title author isbn issueDate' // Include issueDate in the response
      });
  
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
  });


  router.post('/students/history', verifyAdmin, async (req, res) => {
    try {
      const { student_id } = req.body; // Extract student_id from the request body
      
      // Find the student by student_id and populate related data
      const student = await Student.findOne({ student_id })
        .populate('issued_books') // Populate issued_books from the Student model
        .populate({
          path: 'bookHistory.book',
          model: 'Book',
        });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Currently issued books (where returnDate is null)
      const currentlyIssuedBooks = student.issued_books.map((book) => {
        const historyEntry = student.bookHistory.find(
          (history) => history.book.equals(book._id) && history.returnDate === null
        );
        return {
          title: book.title,
          isbn: book.isbn,
          issueDate: historyEntry ? historyEntry.issueDate : null, // Take issueDate from the history entry
        };
      });
  
      // Full book issue/return history
      const fullHistory = student.bookHistory.map((entry) => ({
        title: entry.book.title,
        isbn: entry.book.isbn,
        issueDate: entry.issueDate,
        returnDate: entry.returnDate ? entry.returnDate : 'Not returned yet',
      }));
  
      // Return all the student details stored in the schema, including the fee status
      res.status(200).json({
        message: 'Student details fetched successfully',
        student: {
          name: student.name,
          phone: student.phone,
          address: student.address,
          student_id: student.student_id,
          email: student.email,
          entrydate: student.entrydate,
          feeStatus: student.feeStatus || 'No payment information available', // Include fee status
          issued_books: currentlyIssuedBooks,
          bookHistory: fullHistory,
          libraryId: student.libraryId,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  


  router.post('/issue', verifyAdmin, async (req, res) => {
    const { student_id, isbn } = req.body;
  
    try {
      const book = await Book.findOne({ isbn });
      const student = await Student.findOne({ student_id });
  
      // Check if the book and student exist
      if (!book || !student) {
        return res.status(404).json({ message: '-1' }); // "No book or student found"
      }
  
      // Check if the book is already issued
      if (book.issued_to) {
        return res.status(400).json({ message: '-2' }); // Already issued
      }
  
      // Check if the student has reached the maximum limit of issued books
      if (student.issued_books.length >= 2) {
        return res.status(400).json({ message: '-3' }); // Maximum limit of issued books reached (2 books)
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
  
      // Send an email to the student with the book issue details
      const emailContent = `
        Dear ${student.name},
  
        You have successfully issued the following book from our library:
  
        - Title: ${book.title}
        - Author: ${book.author}
        - ISBN: ${book.isbn}
        - Issue Date: ${new Date(book.issueDate).toLocaleDateString()}
  
        Please return the book within the due date to avoid any fines.
  
        Thank you,
        Library Team
      `;
  
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: student.email,
        subject: 'Book Issued Successfully',
        text: emailContent,
      });
  
      res.status(200).json({ message: 'Book issued successfully and email sent to the student' });
    } catch (error) {
      console.error('Error issuing book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  router.post('/return', verifyAdmin, async (req, res) => {
    const { student_id, isbn } = req.body;
  
    try {
      const student = await Student.findOne({ student_id });
      const book = await Book.findOne({ isbn });
  
      // Check if the student and book exist
      if (!student || !book) {
        return res.status(404).json({ message: 'Student or Book not found' });
      }
  
      // Check if the book is actually issued to this student
      const issuedBookIndex = student.issued_books.indexOf(book._id);
      if (issuedBookIndex === -1) {
        return res.status(400).json({ message: 'This book was not issued to this student.' });
      }
  
      // Remove the book from the student's currently issued books list
      student.issued_books.splice(issuedBookIndex, 1);
  
      // Update the return date in the student's history
      const historyEntry = student.bookHistory.find(
        history => history.book.equals(book._id) && !history.returnDate
      );
      
      if (historyEntry) {
        historyEntry.returnDate = new Date();
  
        // Calculate fine
        const currentDate = new Date();
        const issueDate = new Date(historyEntry.issueDate);
        const diffDays = Math.floor((currentDate - issueDate) / (1000 * 60 * 60 * 24));
        const fineRate = 10; // Rs. 10 per day
        const gracePeriod = 2; // No fine for the first 2 days
  
        const fine = diffDays > gracePeriod ? (diffDays - gracePeriod) * fineRate : 0;
        historyEntry.fine = fine; // Save the fine amount in the history entry
      }
  
      // Update the book as available again
      book.issued_to = null;
      await book.save();
      await student.save();
  
      // Send an email to the student with the book return details and fine information
      const emailContent = `
        Dear ${student.name},
  
        You have successfully returned the following book to our library:
  
        - Title: ${book.title}
        - Author: ${book.author}
        - ISBN: ${book.isbn}
        - Return Date: ${new Date().toLocaleDateString()}
  
        ${historyEntry.fine > 0 ? `Please note that you have a fine of Rs. ${historyEntry.fine} for late return.` : 'Thank you for returning the book on time. We hope you enjoyed reading it!'}
  
        Best regards,
        Library Team
      `;
  
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: student.email,
        subject: 'Book Returned Successfully',
        text: emailContent,
      });
  
      res.status(200).json({ message: 'Book returned successfully, fine calculated, and email sent to the student', fine: historyEntry.fine });
    } catch (error) {
      console.error('Error returning book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  

  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or any other service
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your email password
    },
  });
  
// Function to check for overdue books and send emails
const sendOverdueEmails = async () => {
  const sentToStudents = []; // To store student IDs who received emails

  try {
    // Populate both 'issued_books' and 'bookHistory.book'
    const students = await Student.find().populate('issued_books').populate('bookHistory.book'); // Populate 'book' in bookHistory

    for (const student of students) {
      const overdueBooks = student.bookHistory.filter(entry => {
        const currentDate = new Date();
        const issueDate = new Date(entry.issueDate);
        const diffDays = Math.floor((currentDate - issueDate) / (1000 * 60 * 60 * 24));
        return diffDays > 2 && !entry.returnDate; // Book is overdue if more than 2 days have passed since issue
      });

      if (overdueBooks.length === 0) {
        continue; 
      }

      // Calculate the total fine amount considering the grace period of 2 days
      const fineAmount = overdueBooks.reduce((totalFine, bookEntry) => {
        const currentDate = new Date();
        const issueDate = new Date(bookEntry.issueDate);
        const overdueDays = Math.max(0, Math.floor((currentDate - issueDate) / (1000 * 60 * 60 * 24)) - 2); // Subtract 2 grace days
        return totalFine + (overdueDays * 10); // Add the fine for each overdue day
      }, 0);
      
      let emailContent = `Dear ${student.name},\n\nYou have the following overdue books:\n`;

      overdueBooks.forEach(bookEntry => {
        const book = bookEntry.book; // Access the populated book details
        emailContent += `- ${book.title}, Issued on: ${new Date(bookEntry.issueDate).toLocaleDateString()}\n`;
      });

      emailContent += `\nEach day you fail to return the books will incur a fine of Rs. 10 starting from the 3rd day of issuing book.\nTotal fine amount: Rs. ${fineAmount}\n\nThank you,\nLibrary Team`;

      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: student.email,
        subject: 'Overdue Books Notification',
        text: emailContent,
      });

      // Log successful email send
      sentToStudents.push(student.student_id); // Add student ID to the array
    }
  } catch (error) {
    console.error('Error sending overdue emails:', error);
  }

  return sentToStudents; // Return the array of student IDs
};


  
  // Schedule the cron job to run daily at 8 AM
  cron.schedule('0 8 * * *', () => {
    console.log('Running overdue email check...');
    sendOverdueEmails();
  });
  
  router.post('/send-overdue-emails', async (req, res) => {
    try {
      const sentToStudents = await sendOverdueEmails(); // Get the student IDs
      res.status(200).json({ message: 'Overdue emails sent successfully!', studentIds: sentToStudents });
    } catch (error) {
      res.status(500).json({ message: 'Error sending overdue emails', error: error.message });
    }
  });


  
  
router.post('/whatsappmessage', async (req, res) => {
    const {  toNumber } = req.body;
    const message = `Dear Indresh Verma,
    
    You have the following overdue books:
    - Ramaya, Issued on: 28/9/2024
    - Sportsstar343, Issued on: 2/10/2024

    Each day you fail to return the books will incur a fine of Rs. 10 starting from the 3rd day.
    Total fine amount: Rs. 100

    Thank you,
    Library Team`;
    try {
      // Send WhatsApp message using Twilio
      const response = await client.messages.create({
        from: yourWhatsAppNumber, // Your Twilio WhatsApp number
        to: `whatsapp:${toNumber}`, // The recipient's WhatsApp number
        body: message, // The message body
      });
  
      res.status(200).json({ success: true, message: 'Message sent!', response });
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      res.status(500).json({ error: 'Failed to send WhatsApp message', details: error.message });
    }
  });
  
  // Route to add an admin
router.post('/addhead', async (req, res) => {
  const { username, password, libraryId } = req.body;

  try {
      // Check if the username already exists
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
          return res.status(400).json({ message: 'Admin with this username already exists.' });
      }

      // Check if the libraryId is already associated with an existing admin
      const existingLibraryId = await Admin.findOne({ libraryId });
      if (existingLibraryId) {
          return res.status(400).json({ message: 'Admin with this library ID already exists.' });
      }

      // Hash the password using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new admin with the hashed password
      const newAdmin = new Admin({ username, password: hashedPassword, libraryId });
      await newAdmin.save();

      // Generate a JWT token
      const token = jwt.sign(
          { id: newAdmin._id }, // Payload: contains admin's ID
          process.env.JWT_SECRET, // Secret key
          { expiresIn: '7d' } // Token expiration time
      );

      res.status(201).json({ message: 'Admin added successfully!', token });
  } catch (error) {
      console.error('Error adding admin:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Route to delete an admin
router.delete('/deletehead', async (req, res) => {
  const { username, password, libraryId } = req.body; // Get username, password, and libraryId from the request body

  try {
      // Check if there are more than one admins in the database
      const adminCount = await Admin.countDocuments();
      if (adminCount === 1) {
          return res.status(400).json({ message: 'Unable to delete the admin. At least one admin must be present.' });
      }

      // Check if the admin exists with the given username and libraryId
      const admin = await Admin.findOne({ username, libraryId });
      if (!admin) {
          return res.status(404).json({ message: 'Admin not found with the provided username and library ID.' });
      }

      // Validate the password using bcrypt
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
          return res.status(403).json({ message: 'Incorrect password.' });
      }

      // If username, password, and libraryId are correct, delete the admin
      await Admin.deleteOne({ username: username, libraryId: libraryId });
      res.status(200).json({ message: 'Admin deleted successfully!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error occurred while deleting admin.' });
  }
});


  module.exports=router;