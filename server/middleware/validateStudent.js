const { z } = require('zod');
const { Student } = require("../models/student");

// Define the Zod schema for student validation
const studentSchema = z.object({
    studentId: z.string().min(1, { message: "Student ID is required" }),
    name: z.string().min(1, { message: "First name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    fatherName: z.string().min(1, { message: "Father's name is required" }),
    motherName: z.string().min(1, { message: "Mother's name is required" }),
    fatherPhoneNumber: z.string()
        .length(10, { message: "Father's phone number must be exactly 10 digits" })
        .regex(/^\d{10}$/, { message: "Father's phone number must contain only digits" }),
    motherPhoneNumber: z.string()
        .length(10, { message: "Mother's phone number must be exactly 10 digits" })
        .regex(/^\d{10}$/, { message: "Mother's phone number must contain only digits" }),
    currentYear: z.number().int().min(1).max(4, { message: "Current year must be between 1 and 4" }),
    semester: z.number().int().min(1).max(8, { message: "Semester must be between 1 and 8" }),
    counsellorId: z.string().min(1, { message: "Counselor ID is required" }),
});

// Validation middleware
const validateStudent = async (req, res, next) => {
    let studentsData = req.body; // Assuming data is sent as JSON

    if (!Array.isArray(studentsData)) {
        return res.status(400).send({
            message: 'Validation Error',
            errors: [{ message: 'Expected an array of students.' }],
        });
    }

    const validationErrors = [];

    // Validate each student's data
    for (const studentData of studentsData) {
        try {
            // Convert phone numbers to strings to ensure consistent validation
            studentData.phoneNumber = String(studentData.phoneNumber);
            studentData.fatherPhoneNumber = String(studentData.fatherPhoneNumber);
            studentData.motherPhoneNumber = String(studentData.motherPhoneNumber);

            // Validate student data with the Zod schema
            studentSchema.parse(studentData);

            // Check for existing student ID or email
            const [existingStudentByEmail, existingStudentById] = await Promise.all([
                Student.findOne({ email: studentData.email }),
                Student.findOne({ studentId: studentData.studentId })
            ]);

            // Collect errors for existing student checks
            if (existingStudentByEmail) {
                validationErrors.push({
                    studentId: studentData.studentId, // Include the studentId for context
                    field: 'email',
                    message: `Email ${studentData.email} is already registered for Student ID ${studentData.studentId}.`
                });
            }

            if (existingStudentById) {
                validationErrors.push({
                    studentId: studentData.studentId, // Include the studentId for context
                    field: 'studentId',
                    message: `Student ID ${studentData.studentId} is already registered.`
                });
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                // Collect specific field errors for easier identification
                error.errors.forEach(err => {
                    validationErrors.push({
                        studentId: studentData.studentId, // Include the studentId for context
                        field: err.path[0], // Field where the error occurred
                        message: err.message, // Specific error message
                    });
                });
            } else {
                return res.status(500).send({
                    message: 'Internal Server Error',
                    errors: [{ message: `Unexpected error: ${error.message}` }],
                });
            }
        }
    }

    // If there are any validation errors, respond with them
    if (validationErrors.length > 0) {
        return res.status(400).send({
            message: 'Validation Errors',
            errors: validationErrors,
        });
    }

    next(); // Proceed to the next middleware/route handler if validation passes
};

module.exports = { validateStudent };
