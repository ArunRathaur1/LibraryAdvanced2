const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyAdmin = require('../middleware/checkadmin');
const AdminMain = require('../models/adminmain'); // Import the Admin_Main model
const router = express.Router();

// Route to add an Admin_Main user (Already present)
router.post('/add-admin-main', verifyAdmin, async (req, res) => {
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

module.exports = router;
