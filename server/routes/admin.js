const express = require("express");
const multer = require("multer"); // To handle file uploads
const xlsx = require("xlsx"); // To parse Excel files
const fs = require("fs");
const path = require("path");
const { excelAAParser } = require("../middleware/attendanceParse");
const { excelParser } = require("../middleware/excelParser");
const { validateStudent } = require("../middleware/validateStudent");
const {
  validateSubject,
  validateSubjects,
} = require("../middleware/validateSubject");
const { Student } = require("../models/student");
const { Counsellor } = require("../models/counsellor");
const { Admin } = require("../models/admin");
const AdminRouter = express.Router();

// functions for student routes
const {
  bulkAddStudents,
  addStudent,
  updateStudent,
  getStudentsByYear,
  deleteStudent,
  deleteStudentsByYear,
} = require("../controllers/studentController");

const {
  bulkaddSubjects,
  addSubject,
  getSubjects,
  deleteSubject,
  updateSubject,
  bulkAddSubjects,
} = require("../controllers/subjectController");
const { addAttendance } = require("../controllers/attendanceController");
const {
  bulkUploadMarks,
  updateMarks,
  getMarks,
  deleteMarks
} = require("../controllers/marksController");

const { 
  CounsellorGet,
  CounsellorDelete,
  CounsellorPost,
  CounsellorUpdate
} = require("../controllers/counsellorController");

AdminRouter.post(
  "/bulkaddsubjects",
  excelParser,
  validateSubjects,
  bulkAddSubjects
);
AdminRouter.post("/subject", addSubject);
AdminRouter.get("/subject", getSubjects);
AdminRouter.put("/subject/:id", updateSubject);
AdminRouter.delete("/subject/:id", deleteSubject);

AdminRouter.post(
  "/bulkaddstudents",
  excelParser,
  validateStudent,
  bulkAddStudents
);
// http://localhost:3000/api/v1/admin/students/1

AdminRouter.post("/students", addStudent);
AdminRouter.put("/students/:id", updateStudent);
AdminRouter.get("/students/:year", getStudentsByYear);
AdminRouter.delete("/students/:id", deleteStudent);
AdminRouter.delete("/students/year/:year", deleteStudentsByYear);

AdminRouter.post("/attendance", excelAAParser, addAttendance);
//AdminRouter.put("/attendance/:id", updateAttendance);

AdminRouter.post("/counsellor", async (req, res) => {
  const { data } = req.body;
  const counsellor = new Counsellor(data);
  await counsellor.save();
  res.send({
    success: true,
    message: "Counsellor added successfully!",
  });
});
AdminRouter.get("/counsellor", async (req, res) => {
  const counsellor = await Counsellor.find();
  res.send({
    success: true,
    message: "counsellor data  fetched successfully!",
    data: counsellor,
  });
});
AdminRouter.put("/counsellor/:id", CounsellorUpdate);

AdminRouter.delete("/counsellor/:id", async (req, res) => {
  const { id } = req.params;
  const counsellor = await Counsellor.findOneAndDelete({
    counsellorId: id,
  });
  res.send({
    success: true,
    message: "Counsellor deleted successfully!",
    data: counsellor,
  });
});
AdminRouter.delete("/counsellor/:id",CounsellorDelete);
AdminRouter.put("/counsellor/:id",CounsellorUpdate);
AdminRouter.get("/counsellor",CounsellorGet);
AdminRouter.post("/counsellor", CounsellorPost);

AdminRouter.post("/marks/upload/:sem", excelParser, bulkUploadMarks);
AdminRouter.put("/marks/update", updateMarks);
AdminRouter.get("/marks", getMarks);
AdminRouter.delete("/marks")

module.exports = {
  AdminRouter,
};
