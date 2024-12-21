const express = require("express");
const multer = require("multer"); 
const xlsx = require("xlsx"); 
const jwt  = require("jsonwebtoken");
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
// const { authenticateAdmin, authenticateCounselor } = require("../middleware/authentication");


require("dotenv").config({
  path: "../.env",  
});
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


AdminRouter.delete("/counsellor/:id",CounsellorDelete);
AdminRouter.put("/counsellor/:id",CounsellorUpdate);
AdminRouter.get("/counsellor",CounsellorGet);
AdminRouter.post("/counsellor", CounsellorPost);

AdminRouter.post("/marks/upload/", excelParser, bulkUploadMarks);
AdminRouter.put("/marks/update", updateMarks);
AdminRouter.get("/marks", getMarks);
AdminRouter.delete("/marks")

AdminRouter.post("/signin", async(req,res)=>{
  try {
    
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password"
      });
    }

    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    
    if(password==admin.password)
    {
      isPasswordValid = true;
    }
    else
    {
      isPasswordValid=false;
    }
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: 'admin'
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '2h'  
      }
    );
    res.status(200).json({
      success: true,
      message: "Successfully signed in",
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = {
  AdminRouter,
};
