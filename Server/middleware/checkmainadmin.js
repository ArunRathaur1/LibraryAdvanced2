// middleware/verifyAdmin.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Import your Admin model

const verifyAdmin = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization'];

  // Log token for debugging
  console.log("Authorization Token:", token);

  // Check if the token is provided
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    console.log("Admin ID:", decoded.id);

    // Attach the token to the request body
    req.body.token = token; // Passing the token into the request body

    // Check if the user ID exists in the Admin collection
    const admin = await Admin.findById(decoded.id);
    
    // If admin not found, respond with unauthorized message
    if (!admin) {
      return res.status(403).json({ message: 'Unauthorized access. User is not an admin.' });
    }

    // Attach the admin object to the request for further use
    req.admin = admin; 
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle token verification errors
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyAdmin;
