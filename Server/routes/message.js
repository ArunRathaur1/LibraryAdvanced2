const express = require('express');
const multer = require('multer');
const Message = require('../models/Message'); // Assuming you have a Message model
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Create unique file name
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept PDF and image files only
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed!'), false);
    }
  }
});

// POST route to upload a message with a file
router.post('/message', upload.single('file'), async (req, res) => {
  const { message } = req.body;
  const filePath = req.file ? req.file.path : null; // Get the file path if a file is uploaded

  try {
    // Update or create a new message with the uploaded file
    const updatedMessage = await Message.findOneAndUpdate(
      {}, // Empty filter to find the first document
      { message: message, filePath: filePath }, // Update message and file path
      { upsert: true, new: true } // Upsert and return the updated document
    );
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Error updating the message' });
  }
});

// GET route to fetch the message along with the file
router.get('/message', async (req, res) => {
  try {
    const message = await Message.findOne({});
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the message' });
  }
});

module.exports = router;
