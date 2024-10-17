const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: false, // Optional, as not every message might have a file
  }
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
