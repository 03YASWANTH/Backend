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
const Attendance = require("../models/attendance"); // Path to your attendance model

const updateAttendance = async (req, res) => {
  try {
    const { studentId, semesterId, month, subject, presentDays, totalDays } = req.body;

    
    if (!studentId || !semesterId || !month || !subject || presentDays === undefined || totalDays === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    
    const attendanceRecord = await Attendance.findOne({ studentId, semesterId });

    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found for the student and semester." });
    }

   
    const monthIndex = attendanceRecord.attendanceData.findIndex(
      (data) => data.month === month
    );

    if (monthIndex !== -1) {
     
      attendanceRecord.attendanceData[monthIndex].subjects.set(subject, {
        presentDays,
        totalDays,
      });
    } else {
      
      attendanceRecord.attendanceData.push({
        month,
        subjects: new Map([
          [
            subject,
            {
              presentDays,
              totalDays,
            },
          ],
        ]),
      });
    }

    
    await attendanceRecord.save();

    res.status(200).json({ message: "Attendance updated successfully." });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Failed to update attendance.", error: error.message });
  }
};

module.exports = { addBulkAttendance,updateAttendance};
