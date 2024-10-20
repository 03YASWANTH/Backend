const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,    
    required: true
  },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  motherName: {
    type: String,
    required: true
  },
  fatherPhoneNumber: {
    type: String,
    required: true
  },
  motherPhoneNumber: {
    type: String,
    required: true
  },
  currentYear: {
    type: Number,
    required: true,  // 1 to 4 representing years of study
    enum: [1, 2, 3, 4]  // Restricts value to 1, 2, 3, or 4
  },
  semester: {
    type: Number,
    required: true,  // Semester number, e.g., 1 to 8
    enum: [1, 2, 3, 4, 5, 6, 7, 8]  // Restricts value to valid semester numbers
  },
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counsellor',  // Reference to Counsellor model
    required: true
  }
});


module.exports =mongoose.model('Student', studentSchema);

