const {Attendance} = require('../models/attendance');


const addBulkAttendance = async (req, res) => {
  try {
    const bulkAttendanceData = req.fileData; 
    for (const record of bulkAttendanceData) {
      const { studentId, semesterId, attendanceData } = record;

      
      const existingRecord = await Attendance.findOne({ studentId, semesterId });

      if (existingRecord) {
        
        attendanceData.forEach((monthData) => {
          const monthIndex = existingRecord.attendanceData.findIndex(
            (data) => data.month === monthData.month
          );

          if (monthIndex !== -1) {
           
            Object.assign(
              existingRecord.attendanceData[monthIndex].subjects,
              monthData.subjects
            );
          } else {

            existingRecord.attendanceData.push(monthData);
          }
        });

        
        await existingRecord.save();
      } else {
        const newAttendance = new Attendance({
          studentId,
          semesterId,
          attendanceData,
        });

        await newAttendance.save();
      }
    }

    res.status(200).json({ message: "Bulk attendance data added/updated successfully." });
  } catch (error) {
    console.error("Error adding bulk attendance:", error);
    res.status(500).json({ message: "Failed to add bulk attendance.", error: error.message });
  }
};

module.exports = { addBulkAttendance };
