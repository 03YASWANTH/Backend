const { Student } = require("../models/student");

const AdminRouter = require("express").Router();

AdminRouter.get("/students", async (req, res) => {
  const studentArrays = await Student.find({});
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
