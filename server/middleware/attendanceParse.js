const multer = require("multer");
const xlsx = require("xlsx");

const upload = multer({ storage: multer.memoryStorage() });

const excelParser = (req, res, next) => {
  
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

      const structuredData = [];
      const subjects = jsonData[0].slice(1); 
      const totalClasses = jsonData[1].slice(1); 

      
      for (let i = 2; i < jsonData.length; i++) {
        const row = jsonData[i];
        const studentId = row[0]; 
        const attendance = subjects.map((subject, index) => ({
          subject,
          presentDays: row[index + 1], 
          totalDays: totalClasses[index], 
        }));

        structuredData.push({ studentId, attendance });
      }

      req.fileData = structuredData;

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error parsing Excel file", error: error.message });
    }
  });
};

module.exports = { excelParser };
