const multer = require("multer");
const xlsx = require("xlsx");

const upload = multer({ storage: multer.memoryStorage() });

const excelAAParser = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload failed", error: err.message });
    }

    try {
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

      // Ensure the sheet has at least 2 rows (header + totals row)
      if (jsonData.length < 2) {
        return res
          .status(400)
          .json({ message: "Excel file must contain headers and data rows" });
      }

      const structuredData = [];
      const subjects = jsonData[1].slice(1); // Extract subjects from the first row
      const totalClasses = jsonData[0].slice(1); // Extract total classes from the second row

      // Parse student attendance starting from the third row
      for (let i = 2; i < jsonData.length; i++) {
        const row = jsonData[i];
        const studentId = row[0]; // First column is student ID

        // Validate data format
        if (!studentId || row.length < subjects.length + 1) {
          return res.status(400).json({
            message: `Invalid row data at row ${i + 1}`,
          });
        }

        const attendance = {}; // Object to store subject attendance for the student

        subjects.forEach((subject, index) => {
          attendance[subject] = {
            presentDays: row[index + 1], // Attendance data starts from the second column
            totalDays: totalClasses[index],
          };
        });

        structuredData.push({ studentId, attendance });
      }

      req.fileData = structuredData; // Pass structured data to next middleware
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error parsing Excel file", error: error.message });
    }
  });
};

module.exports = { excelAAParser };
