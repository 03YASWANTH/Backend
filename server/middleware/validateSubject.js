const { z } = require('zod');
const { Subject } = require("../models/subject");

// Define the Zod schema for subject validation
const subjectSchema = z.object({
    subjectCode: z.string().min(1, { message: "Subject code is required" }),
    name: z.string().min(1, { message: "Subject name is required" }),
    department: z.string().min(1, { message: "Department is required" }),
    creditHours: z.number().int().min(1, { message: "Credit hours must be a positive number" }),
    semester: z.number().int().min(1, { message: "Semester must be between 1 and 8" }).max(8),
});

// Subject validation middleware
const validateSubjects = async (req, res, next) => {
    let subjectsData = req.body; // Assuming data is sent as JSON

    if (!Array.isArray(subjectsData)) {
        return res.status(400).send({
            message: 'Validation Error',
            errors: [{ message: 'Expected an array of subjects.' }],
        });
    }

    const validationErrors = [];
    const validSubjects = [];

    // Validate each subject's data
    for (const subjectData of subjectsData) {
        try {
            // Validate subject data with the Zod schema
            subjectSchema.parse(subjectData);

            // Check if the subject code or name already exists
            const existingSubject = await Subject.findOne({
                $or: [
                    { subjectCode: subjectData.subjectCode },
                    { name: subjectData.name }
                ]
            });

            if (existingSubject) {
                validationErrors.push({
                    subjectCode: subjectData.subjectCode,
                    message: `Subject with code ${subjectData.subjectCode} or name ${subjectData.name} already exists.`
                });
            } else {
                // If no duplicates, push subject to valid subjects array
                validSubjects.push(subjectData);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Collect specific field errors for easier identification
                error.errors.forEach(err => {
                    validationErrors.push({
                        subjectCode: subjectData.subjectCode,
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

    // If there are validation errors, respond with them
    if (validationErrors.length > 0) {
        return res.status(400).send({
            message: 'Validation Errors',
            errors: validationErrors,
        });
    }

    // Attach valid subjects to the request object for further processing
    req.validSubjects = validSubjects;

    next(); // Proceed to the next middleware/route handler if validation passes
};

module.exports = { validateSubjects };
