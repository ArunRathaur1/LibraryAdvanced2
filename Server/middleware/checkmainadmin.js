const jwt = require('jsonwebtoken');
const Admin = require('../models/adminmain'); // Import your Admin model

const verifyAdmin = async (req, res, next) => {
  //const token = req.headers['authorization'];
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

    // If the admin is found, proceed to the next middleware or route handler
    req.admin = admin; // Optionally attach the admin object to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyAdmin;
