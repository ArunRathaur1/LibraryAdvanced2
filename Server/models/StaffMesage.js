const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: { type: String,required:true},
  libraryId: { type: String,required:true},
});

module.exports = mongoose.model('StaffMessage',messageSchema);