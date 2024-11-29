const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,    
    required: true
  },
  name: 
  { 
    type: String, 
    required: true 
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
    required: true,  
    enum: [1, 2, 3, 4] 
  },
  semester: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  counsellorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counsellor',
    required: true
  }
});


const Student = mongoose.model('Student', studentSchema);

module.exports = {
  Student
};
