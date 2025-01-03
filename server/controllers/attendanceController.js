const {Attendance} = require('../models/attendance');

const addAttendance = async (req, res) => {
  try {
    const bulkAttendanceData = req.fileData;
    const semesterId = req.body.semesterId;
    const batch = req.body.batch;
    const month = req.body.month;
    console.log(req.body.batch);

    for (const record of bulkAttendanceData) {
      const { studentId, attendance } = record;
      const existingRecord = await Attendance.findOne({ studentId, semesterId });

      if (existingRecord) {
        const monthIndex = existingRecord.attendanceData.findIndex(
          (data) => data.month === month
        );

        if (monthIndex !== -1) {
          existingRecord.attendanceData[monthIndex].subjects = attendance;
        } else {
          existingRecord.attendanceData.push({
            month,
            subjects: attendance,
          });
        }

        await existingRecord.save();
      } else {
        const newAttendance = new Attendance({
          studentId,
          semesterId,
          batch,           // Added batch field here
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
const getAttendance = async (req, res) => {
    try {
        const { batch, semesterId, month } = req.body;
        console.log(req.body);
        
        if (!batch || !semesterId || !month) {
            return res.status(400).json({
                success: false,
                message: 'Batch, semesterId, and month are required'
            });
        }

        const attendanceRecords = await Attendance.find({
            batch,
            semesterId
        });
        console.log(attendanceRecords);

        if (!attendanceRecords.length) {
            return res.status(404).json({
                success: false,
                message: 'No attendance records found for this batch'
            });
        }

        // Get list of all unique subjects for this month
        const subjects = new Set();
        attendanceRecords.forEach(record => {
            const monthData = record.attendanceData.find(m => m.month === month);
            if (monthData) {
                monthData.subjects.forEach((_, subject) => subjects.add(subject));
            }
        });

        // Convert to sorted array
        const subjectsList = Array.from(subjects).sort();

        // Create table structure
        const tableData = {
            month,
            headers: ['Student ID', ...subjectsList, 'Overall %'],
            rows: []
        };

        // Process each student's data
        attendanceRecords.forEach(record => {
            const monthData = record.attendanceData.find(m => m.month === month);
            if (monthData) {
                const row = {
                    studentId: record.studentId,
                    subjects: {},
                    overall: null
                };

                // Fill in subject-wise attendance
                subjectsList.forEach(subject => {
                    const subjectData = monthData.subjects.get(subject);
                    if (subjectData) {
                        row.subjects[subject] = {
                            attendance: `${subjectData.presentDays}/${subjectData.totalDays}`,
                        };
                    } else {
                        row.subjects[subject] = { attendance: 'N/A' };
                    }
                });

                // Calculate overall percentage for the student
                const totalPresent = Array.from(monthData.subjects.values())
                    .reduce((sum, val) => sum + val.presentDays, 0);
                const totalDays = Array.from(monthData.subjects.values())
                    .reduce((sum, val) => sum + val.totalDays, 0);
                
                row.overall = totalDays > 0 ? 
                    ((totalPresent / totalDays) * 100).toFixed(2) : 
                    'N/A';

                tableData.rows.push(row);
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                batch,
                semesterId,
                month,
                subjects: subjectsList,
                tableData
            }
        });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching batch attendance',
            error: error.message
        });
    }
};

module.exports = { addAttendance ,getAttendance};
