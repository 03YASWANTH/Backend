const { Student } = require("../models/student");
const { Counsellor } = require("../models/counsellor");
const { Marks } = require("../models/marks");

const CounsellorRouter = require("express").Router();

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

module.exports = { CounsellorRouter };