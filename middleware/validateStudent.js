const { z } = require('zod');
const { Student } = require("../models/student");

// Define the Zod schema for student validation
const studentSchema = z.object({
    studentId: z.string().min(1, { message: "Student ID is required" }), // Ensures it's not empty
    firstName: z.string().min(1, { message: "First name is required" }), // Ensures it's not empty
    lastName: z.string().min(1, { message: "Last name is required" }), // Ensures it's not empty
    email: z.string().email({ message: "Invalid email address" }), // Checks if email is valid
    phoneNumber: z.string().min(1, { message: "Phone number is required" }), // Ensures it's not empty
    fatherName: z.string().min(1, { message: "Father's name is required" }), // Ensures it's not empty
    motherName: z.string().min(1, { message: "Mother's name is required" }), // Ensures it's not empty
    fatherPhoneNumber: z.string()
        .length(10, { message: "Father's phone number must be exactly 10 digits" })
        .regex(/^\d{10}$/, { message: "Father's phone number must contain only digits" }), // Regex to ensure digits only
    motherPhoneNumber: z.string()
        .length(10, { message: "Mother's phone number must be exactly 10 digits" })
        .regex(/^\d{10}$/, { message: "Mother's phone number must contain only digits" }), // Regex to ensure digits only
    currentYear: z.number().int().min(1).max(4, { message: "Current year must be between 1 and 4" }), // Validates year range
    semester: z.number().int().min(1).max(8, { message: "Semester must be between 1 and 8" }), // Validates semester range
    counsellorId: z.string().min(1, { message: "Counselor ID is required" }), // Ensures it's not empty
});

// Validation middleware
// Validation middleware
const validateStudent = async (req, res, next) => {
    const studentsData = req.body; // Assuming data is sent as JSON

    // Validate each student's data
    for (const studentData of studentsData) {
        try {
            // Validate student data with the Zod schema
            studentSchema.parse(studentData);

            // Check for existing student ID or email
            try {
                const existingStudentByEmail = await Student.findOne({ email: studentData.email });
                if (existingStudentByEmail) {
                    return res.status(400).send({
                        message: 'Validation Error',
                        errors: [{ message: `Email ${studentData.email} is already registered.` }],
                    });
                }
            } catch (dbError) {
                return res.status(500).send({
                    message: 'Database Error',
                    errors: [{ message: `Error querying email: ${dbError.message}` }],
                });
            }

            try {
                const existingStudentById = await Student.findOne({ studentId: studentData.studentId });
                if (existingStudentById) {
                    return res.status(400).send({
                        message: 'Validation Error',
                        errors: [{ message: `Student ID ${studentData.studentId} is already registered.` }],
                    });
                }
            } catch (dbError) {
                return res.status(500).send({
                    message: 'Database Error',
                    errors: [{ message: `Error querying student ID: ${dbError.message}` }],
                });
            }

        } catch (error) {
            return res.status(400).send({
                message: 'Validation Error',
                errors: error.errors, // Send back validation errors
            });
        }
    }

    next(); // Proceed to the next middleware/route handler if validation passes
};

module.exports = {validateStudent};
