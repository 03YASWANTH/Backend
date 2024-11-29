const { Marks } = require("../models/marks");

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

module.exports = { bulkUploadMarks };
