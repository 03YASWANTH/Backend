const { Student } = require("../models/student");

const FacultyRouter = require("express").Router();

FacultyRouter.get("/getCouncellorStudents/:id", async (req, res) => {
  console.log(req.params.id);
  await Student.find({ counsellorReference: req.params.id })
    .then((data) => {
      res.send({
        success: true,
        message: "Student list",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error", error: err.message });
    });
});

module.exports = {
  FacultyRouter,
};
