const express = require("express");
const multer = require("multer"); // To handle file uploads
const xlsx = require("xlsx"); // To parse Excel files
const fs = require("fs");
const path = require("path");
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
const { bulkUploadMarks, updateMarks } = require("../controllers/marksController");

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
AdminRouter.post("/students", addStudent);
AdminRouter.put("/students/:id", updateStudent);
AdminRouter.get("/students/year/:year", getStudentsByYear);
AdminRouter.delete("/students/:id", deleteStudent);
AdminRouter.delete("/students/year/:year", deleteStudentsByYear);

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
AdminRouter.put("/counsellor/:id", async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const counsellor = await Counsellor.findByIdAndUpdate(
    {
      counsellorId: id,
    },
    data,
    { new: true }
  );
  res.send({
    success: true,
    message: "Counsellor updated successfully!",
    data: counsellor,
  });
});

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

AdminRouter.post("/marks/upload/:sem", excelParser, bulkUploadMarks);
AdminRouter.put("/marks/update", updateMarks);

module.exports = {
  AdminRouter,
};
