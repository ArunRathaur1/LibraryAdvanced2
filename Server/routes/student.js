const express = require('express');
const Book = require('../models/Book');
const { Readable } = require('stream');
const Student = require('../models/Student');
const Admin=require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { route } = require('./admin');
const verifyAdmin = require('../middleware/checkadmin');
// const fs=required('fs');
const router = express.Router();
require('dotenv').config();


// router.get('/retrieve/studentdata/:fileId', async (req, res) => {
//   const { fileId } = req.params;

//   try {
//       const auth = await authenticate(); // Authenticate with Google Drive
//       const fileContent = await getFileContent(auth, fileId); // Fetch file content
//       res.status(200).json(fileContent); // Send back the file content
//   } catch (error) {
//       res.status(500).send({ message: 'Error retrieving data from Google Drive', error });
//   }
// });
// async function getFileContent(auth, fileId) {
//   const drive = google.drive({ version: 'v3', auth });
  
//   // Request to get the file's content
//   const res = await drive.files.get({
//       fileId: fileId,
//       alt: 'media' // Request the file content
//   });
  
//   return res.data; // Return the file content as JSON
// }

// New route for uploading data to Google Drive
// router.post('/upload/studentdata', async (req, res) => {
//   try {
//       console.log("authenticating");
//       const auth = await authenticate(); // Authenticate with Google Drive
//       console.log('uploading data');
//       await uploadData(auth); // Upload data to Google Drive
//       res.status(200).send({ message: 'Data uploaded successfully to Google Drive.' });
//   } catch (error) {
//       res.status(500).send({ message: 'Error uploading data to Google Drive', error });
//   }
// });

//authenticate google drive
// async function authenticate() {
//   const jwtClient = new google.auth.JWT(
//       data.client_email,
//       null,
//       data.private_key.replace(/\\n/g, '\n'), // Make sure the private key is properly formatted
//       ['https://www.googleapis.com/auth/drive']
//   );
//   await jwtClient.authorize();
//   return jwtClient;
// }

// async function uploadData(auth) {
//   const drive = google.drive({ version: 'v3', auth });

//   // Define the content to be uploaded
//   const data = JSON.stringify({ value: "I am student" });

//   const fileMetaData = {
//       name: 'students.json', // Name of the file to be created on Google Drive
//        // Replace with your folder ID
//   };

//   // Create a readable stream from the data
//   const media = {
//       mimeType: 'application/json',
//       body: Readable.from([data]), // Create a readable stream from the data
//   };

//   try {
//       const res = await drive.files.create({
//           resource: fileMetaData,
//           media: media,
//           fields: 'id',
//       });
//       console.log('File uploaded successfully. File ID:', res.data.id);
//   } catch (error) {
//       console.error('Error uploading file:', error.response ? error.response.data : error);
//   }
// }

router.get('/students', verifyAdmin, async (req, res) => {
  try {
    // Retrieve the libraryId from the admin making the request
    const libraryId = req.admin.libraryId;

    // Fetch all students associated with the libraryId
    const students = await Student.find({ libraryId }); 
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

  router.post('/students/history1', async (req, res) => {
    const { student_id, password } = req.body; // Get student ID and password from the request body
  
    try {
      // Find the student by student_id
      const student = await Student.findOne({ student_id })
        .populate('issued_books')
        .populate({
          path: 'bookHistory.book',
          model: 'Book',
        });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Validate the password using bcrypt (comparing hashed password)
      const isPasswordValid = await bcrypt.compare(password, student.password);
      if (!isPasswordValid) {
        return res.status(403).json({ message: 'Incorrect password' });
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
  
      // Return all the student details stored in the schema
      res.status(200).json({
        message: 'Student details fetched successfully',
        student: {
          name: student.name,
          phone: student.phone,
          address: student.address,
          student_id: student.student_id,
          email: student.email,
          issued_books: currentlyIssuedBooks,
          entrydate:student.entrydate,
          bookHistory: fullHistory,
          feeStatus: student.feeStatus || 'No payment information available',
          libraryId: student.libraryId,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/students/feepayment', async (req, res) => {
    const { student_id, paymentDuration } = req.body;
  
    try {
      // Find the student by their ID
      const student = await Student.findOne({ student_id });
      if (!student) return res.status(404).send({ message: 'Student not found' });
  
      // Update fee status
      student.feeStatus.paymentDuration = paymentDuration;
      student.feeStatus.lastPaymentDate = Date.now(); // Store the payment date
  
      await student.save();
      res.status(200).send({ message: 'Fee payment updated successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error updating fee payment', error });
    }
  });


  
module.exports=router;  