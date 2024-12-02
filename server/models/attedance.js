const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
  studentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Student', 
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

module.exports = mongoose.model('Attendance', attendanceSchema);
