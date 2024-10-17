const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const adminMainRoutes = require('./routes/admin_main');
const bookRoutes = require('./routes/books');
const messageRoutes = require('./routes/message');

require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 5000;
const url = process.env.MONGURI;

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve files from the uploads folder

// Routes
app.use('/library', adminRoutes);
app.use('/library', studentRoutes);
app.use('/library', bookRoutes);
app.use('/library', adminMainRoutes);
app.use('/library', messageRoutes); // Use message routes

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
