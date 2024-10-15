const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const cron = require('node-cron');
// const libraryRoutes = require('./routes/Library');
const adminRoutes=require('./routes/admin');
const student=require('./routes/student');
const adminmain=require('./routes/admin_main');
const books=require('./routes/books');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 5000;
const url = process.env.MONGURI;

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());




// Routes
// app.use('/library', libraryRoutes);
app.use('/library',adminRoutes);
app.use('/library',student);
app.use('/library',books);
app.use('/library',adminmain);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
