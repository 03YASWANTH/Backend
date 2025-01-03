const { Student } = require("../models/student");
const { Counsellor } = require("../models/counsellor");

const CounsellorRouter = require("express").Router();

CounsellorRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const counsellor = await Counsellor.findOne({ email });
  if (!counsellor) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
      data:counsellor.counsellorId
    });
  }
  if (counsellor.password === password) {
    res.json({
      success: true,
      message: "Login successful",
      data: counsellor,
    });
  } else {  
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
});


CounsellorRouter.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    console.log("Counsellor ID:", id);
    const counsellor = await Counsellor.findOne({ counsellorId: id }); 
    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: "Counsellor not found",
      });
    }
    const studentArrays = await Student.find({ counsellorId: counsellor._id });
    res.json({
      success: true,
      name:counsellor.name.firstName+" "+counsellor.name.lastName,
      data: studentArrays,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


module.exports = {CounsellorRouter,};
