const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Import your Admin model

const verifyAdmin = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user ID exists in the Admin collection
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return res.status(403).json({ message: 'Unauthorized access. User is not an admin.' });
    }

    // If the admin is found, attach the admin object and ID to the request
    req.admin = admin; // Optionally attach the admin object to the request
    req.body.adminId = admin._id; // Attach the admin's _id to the request body

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyAdmin;
