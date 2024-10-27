const { isObjectIdOrHexString, default: mongoose } = require("mongoose");
const { Counsellor } = require("../models/counsellor");
const { Student } = require("../models/student");

const bulkUploadStudents = async (req, res) => {
  try {
    // console.log(req.validStudents);
    const filteredData = req.body.map((item) => {
      const counsellorIdHere = new mongoose.Types.ObjectId(
        item.counsellorReference
      );
      return {
        studentId: item.studentId,
        name: {
          firstName: item.firstName,
          lastName: item.lastName,
        },
        email: item.email,
        phoneNumber: item.phoneNumber,
        fatherName: item.fatherName,
        motherName: item.motherName,
        fatherPhoneNumber: item.fatherPhoneNumber,
        motherPhoneNumber: item.motherPhoneNumber,
        currentYear: item.currentYear,
        semester: item.semester,
        // counsellorId: item.counsellorId,
        counsellorId: counsellorIdHere,
      };
    });
    console.log(filteredData);
    const newStudents = await Student.insertMany(filteredData);
    res.status(201).json({
      message: "Students added successfully",
      data: newStudents,
      invalidEntries: req.invalidStudents,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error inserting student data", error: error.message });
  }
};

const fetchStudentsByName = async (req, res) => {
  const { itemsPerPage, page } = req.query;
  const name = req.params.name;
  const studentArrays = await Student.find({
    $or: [
      { "name.firstName": { $regex: name, $options: "i" } },
      { "name.lastName": { $regex: name, $options: "i" } },
    ],
  })
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage);
  res.send({
    success: true,
    message: "Student list",
    data: studentArrays,
  });
};

const fetchStudentsByYear = async (req, res) => {
  const year = req.params.year;
  const studentArrays = await Student.find({ currentYear: year });
  res.send({
    success: true,
    message: "Student list",
    data: studentArrays,
  });
};

const addSignleStudent = async (req, res) => {
  const { data } = req.body;
  console.log(data);
  const student = new Student(data);
  await student.save();
  res.send({
    success: true,
    message: "Student added successfully!",
    data: student,
  });
};

const updateSingleStudent = async (req, res) => {
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
};

const removeStudent = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findOneAndDelete({
    studentId: id,
  });
  res.send({
    success: true,
    message: "Student deleted successfully!",
    data: student,
  });
};

const removeStudentsByYear = async (req, res) => {
  const year = req.params.year;
  const student = await Student.deleteMany({ currentYear: year });
  res.send({
    success: true,
    message: "Student deleted successfully!",
    data: student,
  });
};

const bulkUploadCouncellors = async (req, res) => {
  try {
    const filteredData = req.filteredData.map((item) => {
      return {
        counsellorId: item.counsellorId,
        name: {
          firstName: item.firstName,
          lastName: item.lastName,
        },
        email: item.email,
        phoneNumber: item.phoneNumber,
        password: item.password,
      };
    });
    console.log(filteredData);
    const newCounsellors = await Counsellor.insertMany(filteredData);
    res.status(201).json({
      message: "Counsellors added successfully",
      data: newCounsellors,
      invalidEntries: req.invalidData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error inserting counsellor data",
      error: error.message,
    });
  }
};

module.exports = {
  bulkUploadStudents,
  fetchStudentsByName,
  fetchStudentsByYear,
  addSignleStudent,
  updateSingleStudent,
  removeStudent,
  removeStudentsByYear,
  bulkUploadCouncellors,
};
