const express = require('express');
const Book = require('../models/Book');
const Student = require('../models/Student');
const Admin=require('../models/Admin');
const router = express.Router();
const verifyAdmin = require('../middleware/checkadmin');
require('dotenv').config();


// Assuming you have a Library model


module.exports=router;