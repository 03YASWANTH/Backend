const { excelParser } = require("../middleware/excelParser");
const { Student } = require("../models/student");
const { Counsellor } = require("../models/counsellor");
const { Admin } = require("../models/admin");
const { validateCounsellorData } = require("../middleware/validateFaculty");
const {
  bulkUploadStudents,
  fetchStudentsByName,
  fetchStudentsByYear,
  addSignleStudent,
  updateSingleStudent,
  removeStudent,
  removeStudentsByYear,
  bulkUploadCouncellors,
} = require("../controllers/admin");
const {  validateStudent } = require("../middleware/validateStudents");

const AdminRouter = require("express").Router();

// students

AdminRouter.post(
  "/students/bulkadd",
  excelParser,
  validateStudent,
  bulkUploadStudents
);

AdminRouter.get("/getStudentByName/:name", fetchStudentsByName);

AdminRouter.get("/students/:year", fetchStudentsByYear);

AdminRouter.post("/students/addSignleStudent", addSignleStudent);

AdminRouter.put("/students/updateSingleStudent/:id", updateSingleStudent);

AdminRouter.delete("/students/removeStudent/:id", removeStudent);

AdminRouter.delete(
  "/students/removeStudentsByYear/:year",
  removeStudentsByYear
);

// counsellor

AdminRouter.post(
  "/counsellor/bulkadd",
  excelParser,
  validateCounsellorData,
  bulkUploadCouncellors
);

module.exports = {
  AdminRouter,
};
