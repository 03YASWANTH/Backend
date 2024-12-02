const { Marks } = require("../models/marks");
const mongoose = require("mongoose");

const bulkUploadMarks = async (req, res) => {
  try {
    const { sem } = req.params;
    const { examType } = req.body;
    if (!sem || !examType) {
      return res.status(400).json({
        message: "Semester and exam type are required",
      });
    }

    const validExamTypes = ["mid1", "mid2", "external"];
    if (!validExamTypes.includes(examType)) {
      return res.status(400).json({
        message: "Invalid exam type",
      });
    }

    const excelData = req.fileData;

    if (!excelData || excelData.length === 0) {
      return res.status(400).json({
        message: "No data found in the Excel sheet",
      });
    }

    const results = {};

    const columns = Object.keys(excelData[0]).filter(
      (col) => col !== "Roll No"
    );

    excelData.forEach((row) => {
      const rollNo = row["Roll No"];

      if (!rollNo) {
        console.warn(`Skipping row without roll number`);
        return;
      }

      const subjectMarks = {};
      columns.forEach((subject) => {
        const marks = parseFloat(row[subject]);

        if (!isNaN(marks) && marks >= 0 && marks <= 100) {
          subjectMarks[subject] = marks;
        } else {
          console.warn(`Invalid marks for ${rollNo} in ${subject}`);
        }
      });

      results[rollNo] = subjectMarks;
    });

    const marksDocument = new Marks({
      semester: sem,
      examType,
      results,
    });

    await marksDocument.save();

    res.status(201).json({
      message: "Marks uploaded successfully",
      totalStudents: Object.keys(results).length,
      subjects: columns,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({
      message: "Error uploading marks",
      error: error.message,
    });
  }
};

const updateMarks = async (req, res) => {
  try {
    const {
      semester,
      // batch,
      examType,
      studentId,
      subject,
      marks
    } = req.body;

    // Input validation
    if (!semester || !examType || !studentId || !subject || marks === undefined) {
      return res.status(400).json({
        message: 'Missing required fields',
        requiredFields: ['semester', 'examType', 'studentId', 'subject', 'marks']
      });
    }

    // Validate marks is a number
    if (typeof marks !== 'number' || isNaN(marks)) {
      return res.status(400).json({
        message: 'Marks must be a valid number'
      });
    }

    // Update using aggregation pipeline with batch and student checks
    const updatedMarks = await Marks.findOneAndUpdate(
      { 
        semester, 
        examType,
        // batch,
        [`results.${studentId}`]: { $exists: true }
      },
      { 
        $set: { [`results.${studentId}.${subject}`]: marks }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    // If no document was updated, provide detailed error
    if (!updatedMarks) {
      // Check if the record exists with given parameters
      const existingRecord = await Marks.findOne({ 
        semester, 
        examType,
        // batch 
      });
      
      if (!existingRecord) {
        return res.status(404).json({
          message: 'No marks record found',
          details: {
            semester,
            examType,
            // batch
          }
        });
      }

      // Log the existing results for debugging
      console.log('Existing Results:', existingRecord.results);

      return res.status(404).json({
        message: 'Student not found in the marks record',
        details: {
          semester,
          examType,
          // batch,
          studentId,
          existingStudents: existingRecord.results ? Array.from(existingRecord.results.keys()) : []
        }
      });
    }

    res.status(200).json({
      message: 'Marks updated successfully',
      updatedRecord: {
        semester: updatedMarks.semester,
        examType: updatedMarks.examType,
        // batch: updatedMarks.batch,
        studentId: studentId,
        subject: subject,
        newMarks: marks
      }
    });
  } catch (error) {
    console.error('Error updating marks:', error);

    // Differentiate between different types of errors
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: 'Validation Error',
        details: error.errors
      });
    }

    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = { bulkUploadMarks, updateMarks };