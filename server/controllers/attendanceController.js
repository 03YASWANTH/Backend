const {Attendance} = require('../models/attendance');

const addAttendance = async (req, res) => {
  try {
    const bulkAttendanceData = req.fileData; // Array of attendance data
    const semesterId = req.body.semesterId;
    const batch = req.body.batch;
    const month = req.body.month; 
    // The month the data is being uploaded for

    for (const record of bulkAttendanceData) {
      const { studentId, attendance } = record;
      const existingRecord = await Attendance.findOne({ studentId, semesterId});

      if (existingRecord) {
        const monthIndex = existingRecord.attendanceData.findIndex(
          (data) => data.month === month
        );

        if (monthIndex !== -1) {
          // Update the subjects for the given month
          existingRecord.attendanceData[monthIndex].subjects = attendance;
        } else {
          // Add new month data
          existingRecord.attendanceData.push({
            month,
            subjects: attendance,
          });
        }

        await existingRecord.save();
      } 
      else {
        // Create a new attendance record
        const newAttendance = new Attendance({
          studentId,
          semesterId,
          attendanceData: [
            {
              month,
              subjects: attendance,
            },
          ],
        });

        await newAttendance.save();
      }
    }

    res
      .status(200)
      .json({ message: "Bulk attendance data added/updated successfully." });
  } catch (error) {
    console.error("Error adding bulk attendance:", error);
    res.status(500).json({
      message: "Failed to add bulk attendance.",
      error: error.message,
    });
  }
};

module.exports = { addAttendance };
