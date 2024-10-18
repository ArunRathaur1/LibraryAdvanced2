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
    let uniqueFileName;

    // Determine if the file is an image or PDF
    if (file.mimetype.startsWith('image/')) {
      uniqueFileName = 'image' + path.extname(file.originalname); // Use the same name for images
    } else if (file.mimetype === 'application/pdf') {
      uniqueFileName = 'document.pdf'; // Use the same name for PDFs
    } else {
      return cb(new Error('Invalid file type'), false);
    }

    cb(null, uniqueFileName); // Overwrite the existing file with the same name
  }
});

// Configure multer with file filtering for images and PDFs only
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
    // Update or create a new message with the uploaded file and text message
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

router.get('/download', (req, res) => {
  // Define possible file names (for both image and PDF)
  const possibleFiles = ['document.pdf', 'image.jpg', 'image.png', 'image.jpeg'];

  // Find which file exists in the uploads directory
  let foundFile = null;
  for (const fileName of possibleFiles) {
    const filePath = path.join(uploadsDir, fileName);
    if (fs.existsSync(filePath)) {
      foundFile = fileName;
      break;
    }
  }

  // If no file is found, return an error
  if (!foundFile) {
    return res.status(404).json({ error: 'No file found for viewing' });
  }

  // Send the file to be viewed inline in the browser
  const filePath = path.join(uploadsDir, foundFile);
  res.sendFile(filePath); // Serve the file for inline viewing
});

module.exports = router;
