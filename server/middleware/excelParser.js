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

      req.body = xlsx.utils.sheet_to_json(sheet);

      next();
    } catch (error) {

      return res
        .status(500)
        .json({ message: "Error reading Excel file", error: error.message });
    }
  });
};

module.exports = { excelParser };