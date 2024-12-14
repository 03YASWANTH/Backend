const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
  studentId: { 
    type:String, 
    required: true 
  }, 
  semesterId: { 
    type:Number, 
    required: true 
  }, 
  attendanceData: [
    {
      month: { 
        type: String, 
        required: true 
      },
      subjects: {
        type: Map,
        of: { 
          presentDays: { type: Number, required: true }, 
          totalDays: { type: Number, required: true }
        }
      }
    }
  ]
});

attendanceSchema.index({ studentId: 1, semesterId: 1 });
const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = {Attendance}
