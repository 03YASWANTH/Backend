const { Student } = require("../models/student");
const { Counsellor } = require("../models/counsellor");
const { Attendance } = require("../models/attendance");
const { Marks } = require("../models/marks");
const  NoteMaking  = require("../models/notemaking");
const mongoose = require("mongoose");

const CounsellorRouter = require("express").Router();
CounsellorRouter.post("/getattendance",async (req, res) => {
  try {
      const { batch,studentId, semesterId } = req.body;
      console.log("Request body:", { batch, studentId, semesterId });
      if (!studentId || !semesterId) {
          return res.status(400).json({
              success: false,
              message: 'StudentId and semesterId are required'
          });
      }
      const attendanceRecord = await Attendance.findOne({
          batch,
          studentId,
          semesterId
      });

      if (!attendanceRecord) {
          return res.status(404).json({
              success: false,
              message: 'No attendance records found for this student'
          });
        }
      const monthlyData = attendanceRecord.attendanceData.map(monthData => {
          // Get all subjects for this month
          const subjects = Array.from(monthData.subjects.keys()).sort();

          // Calculate subject-wise attendance
          const subjectData = subjects.map(subject => {
              const data = monthData.subjects.get(subject);
              return {
                  subject,
                  presentDays: data.presentDays,
                  totalDays: data.totalDays,
                  percentage: ((data.presentDays / data.totalDays) * 100).toFixed(2)
              };
          });

          // Calculate overall attendance for the month
          const totalPresent = Array.from(monthData.subjects.values())
              .reduce((sum, val) => sum + val.presentDays, 0);
          const totalDays = Array.from(monthData.subjects.values())
              .reduce((sum, val) => sum + val.totalDays, 0);
          const overallPercentage = totalDays > 0 ? 
              ((totalPresent / totalDays) * 100).toFixed(2) : 'N/A';

          return {
              month: monthData.month,
              subjects: subjectData,
              overall: {
                  totalPresent,
                  totalDays,
                  percentage: overallPercentage
              }
          };
      });

      const semesterStats = {
          subjects: {},
          overall: {
              totalPresent: 0,
              totalDays: 0
          }
      };
      monthlyData.forEach(month => {
          month.subjects.forEach(subject => {
              if (!semesterStats.subjects[subject.subject]) {
                  semesterStats.subjects[subject.subject] = {
                      totalPresent: 0,
                      totalDays: 0
                  };
              }
              semesterStats.subjects[subject.subject].totalPresent += subject.presentDays;
              semesterStats.subjects[subject.subject].totalDays += subject.totalDays;
              semesterStats.overall.totalPresent += subject.presentDays;
              semesterStats.overall.totalDays += subject.totalDays;
          });
      });

      // Calculate percentages for semester stats
      Object.keys(semesterStats.subjects).forEach(subject => {
          const subjectData = semesterStats.subjects[subject];
          subjectData.percentage = ((subjectData.totalPresent / subjectData.totalDays) * 100).toFixed(2);
      });
      
      semesterStats.overall.percentage = (
          (semesterStats.overall.totalPresent / semesterStats.overall.totalDays) * 100
      ).toFixed(2);

      return res.status(200).json({
          success: true,
          data: {
              studentId,
              semesterId,
              monthlyData,
              semesterStats
          }
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: 'Error fetching student attendance',
          error: error.message
      });
  }
});

CounsellorRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const counsellor = await Counsellor.findOne({ email });
  if (!counsellor) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
      data: counsellor.counsellorId
    });
  }
  if (counsellor.password === password) {
    res.json({
      success: true,
      message: "Login successful",
      data: counsellor,
    });
  } else {  
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
});

CounsellorRouter.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    console.log("Counsellor ID:", id);
    const counsellor = await Counsellor.findOne({ counsellorId: id }); 
    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: "Counsellor not found",
      });
    }
    const studentArrays = await Student.find({ counsellorId: counsellor._id });
    res.json({
      success: true,
      name: counsellor.name.firstName + " " + counsellor.name.lastName,
      data: studentArrays,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

CounsellorRouter.get("/student/:studentId/marks", async (req, res) => {
  try {
    const { studentId } = req.params;
    let { semester, batch, examType } = req.query;

    console.log("Request params:", { studentId, semester, batch, examType });

    // Remove any quotes from examType if present
    if (examType) {
      examType = examType.replace(/"/g, '');
    }

    // Validate parameters
    if (!studentId || !semester || !batch || !examType) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    // Create query object
    const query = {
      semester: parseInt(semester),
      batch: batch,
      examType: examType
    };

    console.log("Query:", query);

    // Find marks document
    const marksDocument = await Marks.findOne(query);
    console.log("Marks Document:", marksDocument);

    if (!marksDocument) {
      return res.status(404).json({
        success: false,
        message: "No marks record found",
        queriedFor: query
      });
    }

    // Get specific student's marks
    const studentMarks = marksDocument.results.get(studentId); // Access the map using .get()

    if (!studentMarks) {
      return res.status(404).json({
        success: false,
        message: `No marks found for student ID: ${studentId}`,
        availableStudents: Array.from(marksDocument.results.keys()), // Show available student IDs
      });
    }

    // Calculate statistics
    const marksArray = Object.values(studentMarks).map(Number);
    const validMarks = marksArray.filter(mark => !isNaN(mark));
    const averageMarks = validMarks.length > 0
      ? validMarks.reduce((a, b) => a + b, 0) / validMarks.length
      : 0;

    const response = {
      success: true,
      data: {
        studentId,
        semester: parseInt(semester),
        batch,
        examType,
        marks: studentMarks,
        subjectsList: Object.keys(studentMarks),
        totalSubjects: Object.keys(studentMarks).length,
        averageMarks: parseFloat(averageMarks.toFixed(2)),
        statistics: {
          highest: Math.max(...validMarks),
          lowest: Math.min(...validMarks),
          totalMarks: validMarks.reduce((a, b) => a + b, 0),
        }
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error("Error fetching student marks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student marks",
      error: error.message
    });
  }
});
CounsellorRouter.get('/notes/:counsellorId', async (req, res) => {
  try {
    const { counsellorId } = req.params;
    
    // Validate counsellorId format
    if (!mongoose.Types.ObjectId.isValid(counsellorId)) {
      return res.status(400).json({ success: false, message: 'Invalid counsellor ID format' });
    }

    const notes = await NoteMaking.find({ counsellorId })
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .lean();

    return res.status(200).json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error('Error fetching counsellor notes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
      error: error.message
    });
  }
});

// 2. GET notes for a specific student
CounsellorRouter.get('/notes/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Validate studentId (assuming it's a string)
    if (!studentId || typeof studentId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const notes = await NoteMaking.find({ studentId })
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .lean();

    return res.status(200).json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error('Error fetching student notes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notes for this student',
      error: error.message
    });
  }
});

// 3. POST create a new note
CounsellorRouter.post('/notes', async (req, res) => {
  try {
    const { studentId, counsellorId, note } = req.body;
    
    // Validate required fields
    if (!studentId || !counsellorId || !note) {
      return res.status(400).json({
        success: false, 
        message: 'Missing required fields: studentId, counsellorId, and note are required'
      });
    }
    

    // Create new note
    const newNote = new NoteMaking({
      studentId,
      counsellorId,
      note,
      date: new Date() // Use current date and time
    });

    // Save note to database
    const savedNote = await newNote.save();

    return res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: savedNote
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create note',
      error: error.message
    });
  }
});


module.exports = { CounsellorRouter };