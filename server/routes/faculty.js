const { Student } = require("../models/student");

const router = require("express").Router();

router.get("/students", async (req, res) => {
  const studentArrays = await Student.find();
});

router.post("/students", async (req, res) => {
  const { data } = req.body;
  const student = new Student(data);
  await student.save();
  res.send({
    success: true,
    message: "Student added successfully!",
    data: student,
  });
});

router.put("/students/:id", async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const student = await Student.findByIdAndUpdate(id, data, { new: true });
  res.send({
    success: true,
    message: "Student updated successfully!",
    data: student,
  });
});

