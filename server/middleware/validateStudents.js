// const { z } = require("zod");
// const { Counsellor } = require("../models/counsellor");
// const { Student } = require("../models/student");

// const studentSchema = z.object({
//   studentId: z.string(),
//   name: z.object({
//     firstName: z.string().min(1),
//     lastName: z.string().min(1),
//   }),
//   email: z.string().email(),
//   phoneNumber: z.string().length(10),
//   fatherName: z.string().min(1),
//   motherName: z.string().min(1),
//   fatherPhoneNumber: z.string().length(10),
//   motherPhoneNumber: z.string().length(10),
//   currentYear: z.number().int().min(1).max(4),
//   semester: z.number().int().min(1).max(8),
//   counsellorId: z.string().min(1),
// });

// const validateStudentData = async (req, res, next) => {
//   try {
//     const parsedData = req.paesedDataFromFile;
//     console.log(parsedData);

//     // parsedData.push({
//     //   studentId: "123",
//     //   name: {
//     //     firstName: "John",
//     //     lastName: "Doe",
//     //   },
//     //   email: "",
//     //   phoneNumber: "1234567890",
//     //   fatherName: "John Doe Sr.",
//     //   motherName: "",
//     //   fatherPhoneNumber: "1234567890",
//     //   motherPhoneNumber: "1234567890",
//     //   currentYear: 1,
//     //   semester: 24,
//     //   counsellorId: "123",
//     // });

//     const validStudents = [];
//     const invalidStudents = [];

//     for (const student of parsedData) {
//       const isValid = studentSchema.parse(student);
//       if (!isValid) {
//         invalidStudents.push({
//           ...student,
//           error: "Invalid student data",
//         });
//         continue;
//       }
//       const duplicateCheck = await Student.findOne({
//         studentId: student.studentId,
//       });
//       if (duplicateCheck) {
//         invalidStudents.push({
//           ...student,
//           error: `Student ID ${student.studentId} already exists`,
//         });
//         continue; // Skip to the next student
//       }

//       // Check for duplicate email
//       const emailCheck = await Student.findOne({ email: student.email });
//       if (emailCheck) {
//         invalidStudents.push({
//           ...student,
//           error: `Email ${student.email} already exists`,
//         });
//         continue; // Skip to the next student
//       }

//       // Check for duplicate phone number
//       const mobileNumberCheck = await Student.findOne({
//         phoneNumber: student.phoneNumber,
//       });
//       if (mobileNumberCheck) {
//         invalidStudents.push({
//           ...student,
//           error: `Phone number ${student.phoneNumber} already exists`,
//         });
//         continue; // Skip to the next student
//       }

//       // Check if counsellor exists
//       const counsellor = await Counsellor.findOne({
//         counsellorId: student.counsellorId,
//       });
//       if (counsellor) {
//         student.counsellorReference = counsellor._id;
//         validStudents.push(student);
//       } else {
//         invalidStudents.push({
//           ...student,
//           error: `Counsellor ID ${student.counsellorId} not found`,
//         });
//       }
//     }

//     if (validStudents.length === 0) {
//       return res.status(400).json({
//         message:
//           "No valid student data to insert; all entries are invalid or counsellor not found.",
//         invalidStudents,
//       });
//     }

//     req.validStudents = validStudents;
//     req.invalidStudents = invalidStudents;
//     next();
//   } catch (error) {
//     console.error(error); // Log the error
//     res.status(500).json({ message: "Validation error", error: error.message });
//   }
// };

// module.exports = { validateStudentData };

const { z } = require("zod");
const { Student } = require("../models/student");

// Define the Zod schema for student validation
const studentSchema = z.object({
  studentId: z.string().min(1, { message: "Student ID is required" }),
  //   name: z.string().min(1, { message: "First name is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  fatherName: z.string().min(1, { message: "Father's name is required" }),
  motherName: z.string().min(1, { message: "Mother's name is required" }),
  fatherPhoneNumber: z
    .string()
    .length(10, { message: "Father's phone number must be exactly 10 digits" })
    .regex(/^\d{10}$/, {
      message: "Father's phone number must contain only digits",
    }),
  motherPhoneNumber: z
    .string()
    .length(10, { message: "Mother's phone number must be exactly 10 digits" })
    .regex(/^\d{10}$/, {
      message: "Mother's phone number must contain only digits",
    }),
  currentYear: z
    .number()
    .int()
    .min(1)
    .max(4, { message: "Current year must be between 1 and 4" }),
  semester: z
    .number()
    .int()
    .min(1)
    .max(8, { message: "Semester must be between 1 and 8" }),
  counsellorId: z.string().min(1, { message: "Counselor ID is required" }),
});

const validateStudent = async (req, res, next) => {
  // console
  let studentsData = req.body;

  if (!Array.isArray(studentsData)) {
    return res.status(400).send({
      message: "Validation Error",
      errors: [{ message: "Expected an array of students." }],
    });
  }

  const validationErrors = [];

  for (const studentData of studentsData) {
    try {
      studentData.phoneNumber = String(studentData.phoneNumber);
      studentData.fatherPhoneNumber = String(studentData.fatherPhoneNumber);
      studentData.motherPhoneNumber = String(studentData.motherPhoneNumber);

      studentSchema.parse(studentData);

      const [existingStudentByEmail, existingStudentById] = await Promise.all([
        Student.findOne({ email: studentData.email }),
        Student.findOne({ studentId: studentData.studentId }),
      ]);

      if (existingStudentByEmail) {
        validationErrors.push({
          studentId: studentData.studentId,
          field: "email",
          message: `Email ${studentData.email} is already registered for Student ID ${studentData.studentId}.`,
        });
      }

      if (existingStudentById) {
        validationErrors.push({
          studentId: studentData.studentId, // Include the studentId for context
          field: "studentId",
          message: `Student ID ${studentData.studentId} is already registered.`,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          validationErrors.push({
            studentId: studentData.studentId, // Include the studentId for context
            field: err.path[0], // Field where the error occurred
            message: err.message, // Specific error message
          });
        });
      } else {
        return res.status(500).send({
          message: "Internal Server Error",
          errors: [{ message: `Unexpected error: ${error.message}` }],
        });
      }
    }
  }

  // If there are any validation errors, respond with them
  if (validationErrors.length > 0) {
    console.log(validationErrors);
    return res.status(400).send({
      message: "Validation Errors",
      errors: validationErrors,
    });
  }

  next(); // Proceed to the next middleware/route handler if validation passes
};

module.exports = { validateStudent };
