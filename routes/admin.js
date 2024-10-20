const multer = require('multer'); // To handle file uploads
const xlsx = require('xlsx'); // To parse Excel files
const fs = require('fs');
const path = require('path');
const {excelParser} = require("../middleware/excelParser");
const {validateStudent} = require('../middleware/validateStudent'); 
const { Student } = require("../models/student");
const AdminRouter = require("express").Router();
const upload = multer({ dest: 'uploads/' }); 

AdminRouter.post("/bulkaddstudents", excelParser, validateStudent,async (req, res) => {
  try {
      const studentsData = req.body; // Get data from the request body
      // Save students to the database
      for (const studentData of studentsData) {
          await Student.create({
              studentId: studentData.studentId,
              name: {
                  firstName: studentData.firstName,
                  lastName: studentData.lastName,
              },
              email: studentData.email,
              phoneNumber: studentData.phoneNumber,
              fatherName: studentData.fatherName,
              motherName: studentData.motherName,
              fatherPhoneNumber: studentData.fatherPhoneNumber,
              motherPhoneNumber: studentData.motherPhoneNumber,
              currentYear: studentData.currentYear,
              semester: studentData.semester,
              counsellor: studentData.counsellorId,
          });
      }

      // Remove the file after processing
      fs.unlinkSync(req.filePath); // Use req.filePath to delete the uploaded file
      res.send({ message: 'Students uploaded and saved successfully!' });
  } catch (error) {
      console.error('Error uploading or saving students:', error);
      res.status(500).json({ message: 'Error uploading or saving students', error: error.message });
  }
});
AdminRouter.get("/students", async (req, res) => {
  const year = req.body.year;
  const studentArrays = await Student.find({currentYear:year});
  res.send({
    success: true,
    message: "Student list",
    data: studentArrays,
  });
});

AdminRouter.post("/students", async (req, res) => {
  const { data } = req.body;
  console.log(data);
  const student = new Student(data);
  await student.save();
  res.send({
    success: true,
    message: "Student added successfully!",
    data: student,
  });
});

AdminRouter.put("/students/:id", async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  
  //   by object id
  //   const student = await Student.findByIdAndUpdate(id, data, { new: true });

  //   by roll number
  const student = await Student.findOneAndUpdate(
    {
      studentId: id,
    },
    data,
    { new: true }
  );

  res.send({
    success: true,
    message: "Student updated successfully!",
    data: student,
  });
});

module.exports = {
  AdminRouter,
};
