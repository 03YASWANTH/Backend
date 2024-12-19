const { Marks } = require("../models/marks");
const mongoose = require("mongoose");

const bulkUploadMarks = async (req, res) => {
  try {
    const { semester, examType, batch } = req.body;

    if (!semester || !examType) {
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

    // Normalize "Student ID" column for case insensitivity
    const studentIdKey = Object.keys(excelData[0]).find(
      (key) => key.toLowerCase() === "student id"
    );

    if (!studentIdKey) {
      return res.status(400).json({
        message: "No 'Student ID' column found in the Excel sheet",
      });
    }

    const results = {};

    // Get all subject columns (exclude "Student ID")
    const columns = Object.keys(excelData[0]).filter(
      (col) => col.toLowerCase() !== "student id"
    );

    excelData.forEach((row) => {
      const rollNo = row[studentIdKey];

      if (!rollNo) {
        console.warn(`Skipping row without a Student ID`);
        return;
      }

      const subjectMarks = {};
      columns.forEach((subject) => {
        if (examType !== "external") {
          const marks = parseFloat(row[subject]);
          if (!isNaN(marks) && marks >= 0 && marks <= 100) {
            subjectMarks[subject] = marks;
          } else {
            console.warn(`Invalid marks for ${rollNo} in ${subject}`);
          }
        } else {
          subjectMarks[subject] = row[subject];
        }
      });

      results[rollNo] = subjectMarks;
    });

    const marksDocument = new Marks({
      semester,
      examType,
      results,
      batch,
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
    const { semester, batch, examType, studentId, subject, marks } = req.body;

    if (
      !batch ||
      !semester ||
      !examType ||
      !studentId ||
      !subject ||
      marks === undefined
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        requiredFields: [
          "semester",
          "examType",
          "studentId",
          "subject",
          "marks",
        ],
      });
    }
    if (examType !== "external") {
      if (typeof marks !== "number" || isNaN(marks)) {
        return res.status(400).json({
          message: "Marks must be a valid number",
        });
      }
    }

    const updatedMarks = await Marks.findOneAndUpdate(
      {
        semester,
        examType,
        batch,
        [`results.${studentId}`]: { $exists: true },
      },
      {
        $set: { [`results.${studentId}.${subject}`]: marks },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMarks) {
      const existingRecord = await Marks.findOne({
        semester,
        examType,
        batch,
      });

      if (!existingRecord) {
        return res.status(404).json({
          message: "No marks record found",
          details: {
            semester,
            examType,
            batch,
          },
        });
      }

      // Log the existing results for debugging
      console.log("Existing Results:", existingRecord.results);

      return res.status(404).json({
        message: "Student not found in the marks record",
        details: {
          semester,
          examType,
          batch,
          studentId,
          existingStudents: existingRecord.results
            ? Array.from(existingRecord.results.keys())
            : [],
        },
      });
    }

    res.status(200).json({
      message: "Marks updated successfully",
      updatedRecord: {
        semester: updatedMarks.semester,
        examType: updatedMarks.examType,
        // batch: updatedMarks.batch,
        studentId: studentId,
        subject: subject,
        newMarks: marks,
      },
    });
  } catch (error) {
    console.error("Error updating marks:", error);

    // Differentiate between different types of errors
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "Validation Error",
        details: error.errors,
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getMarks = async (req, res) => {
  try {
    const { semester, examType, batch } = req.query;

    // Debugging logs
    console.log("Received Query Parameters:", { semester, examType, batch });

    // Validate query parameters
    if (!semester || !examType || !batch) {
      return res.status(400).json({
        message: "Missing required query parameters (semester, examType, batch)",
      });
    }

    // Fetch marks
    const marks = await Marks.findOne({
      semester,
      examType,
      batch,
    });
    console.log(marks);
    if (!marks) {
      return res.status(404).json({
        message: "Marks not found",
      });
    }

    res.status(200).json(marks);
  } catch (error) {
    console.error("Error fetching marks:", error.message);

    res.status(500).json({
      message: "Error fetching marks",
      error: error.message,
    });
  }
};
const deleteMarks = async (req, res) => {
  try {
    const { semester, examType, batch, studentId } = req.data

    // Debugging logs
    console.log("Received Delete Parameters:", { semester, examType, batch, studentId });

    // Validate request body parameters
    if (!semester || !examType || !batch || !studentId) {
      return res.status(400).json({
        message: "Missing required parameters (semester, examType, batch, studentId)",
      });
    }

    // Find the marks document
    const marksDocument = await Marks.findOne({
      semester,
      examType,
      batch
    });

    // Check if marks document exists
    if (!marksDocument) {
      return res.status(404).json({
        message: "Marks record not found",
      });
    }

    // Remove the specific student's marks
    delete marksDocument.results[studentId];

    // Save the updated document
    await marksDocument.save();

    res.status(200).json({
      message: "Student marks deleted successfully",
      remainingStudents: Object.keys(marksDocument.results)
    });

  } catch (error) {
    console.error("Error deleting student marks:", error.message);

    res.status(500).json({
      message: "Error deleting student marks",
      error: error.message,
    });
  }
};

module.exports = { bulkUploadMarks, updateMarks, getMarks,deleteMarks };
