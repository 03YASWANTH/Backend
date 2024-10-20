// middleware/excelParser.js
const multer = require('multer'); // To handle file uploads
const xlsx = require('xlsx'); // To parse Excel files

const upload = multer({ dest: 'uploads/' }); 

// Middleware for uploading and parsing Excel files
const excelParser = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.send({ message: 'File upload failed', error: err.message });
        }

        const filePath = req.file.path;

        try {
            // Read the Excel file
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert the sheet to JSON
            req.body = xlsx.utils.sheet_to_json(sheet);
            req.filePath = filePath; // Store file path for further use
            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            return res.send({ message: 'Error reading Excel file', error: error.message });
        }
    });
};

module.exports = {excelParser};
