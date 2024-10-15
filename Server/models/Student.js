const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  student_id: { type: String, unique: true, required: true },
  issued_books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // currently issued books
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  entrydate:{ type: Date, default: Date.now},
  feeStatus: {
    paymentDuration: { 
      type: String, 
      enum: ['1 month', '2 months', '3 months', '6 months', '1 year', 'lifetime', 'Not paid'], // Allowed value
      default: 'Not paid' 
    },
    lastPaymentDate: { type: Date, default: Date.now },
  },

  // New field to store the book issue/return history
  bookHistory: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // book reference
    issueDate: { type: Date }, // issue date
    returnDate: { type: Date }  // return date
  }]
});

module.exports = mongoose.model('Student', studentSchema);
