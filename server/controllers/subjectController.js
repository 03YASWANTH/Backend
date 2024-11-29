const Subject = require("../models/subject");

const bulkAddSubjects = async (req, res) => {
    try {
        const subjectsData = req.validSubjects; // Valid subjects from validation middleware

        if (subjectsData.length > 0) {
            await Subject.insertMany(subjectsData);
        }

        res.status(201).send({ message: 'Subjects uploaded and saved successfully!' });
    } catch (error) {
        console.error('Error uploading or saving subjects:', error);
        res.status(500).json({ message: 'Error uploading or saving subjects', error: error.message });
    }
};
  

const addSubject = async (req, res) => {
    const { subjectId, name, fullName, semesterNo ,regulation} = req.body.data;

    try {
        const existingSubject = await Subject.findOne({ subjectId });
        if (existingSubject) {
            return res.status(400).json({
                success: false,
                message: "Subject ID already exists."
            });
        }

        const subject = new Subject({ subjectId, name, fullName, semesterNo,regulation});
        await subject.save();

        res.status(201).json({
            success: true,
            message: "Subject added successfully!",
            data: subject
        });
    } 
    catch (error) 
    {
        res.status(500).json({
            success: false,
            message: "Error adding subject.",
            error: error.message
        });
    }
};

const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json({
            success: true,
            message: "Subjects fetched successfully!",
            data: subjects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching subjects.",
            error: error.message
        });
    }
};

const updateSubject = async (req, res) => {
    const { subjectId, name, fullName, semesterNo } = req.body.data;
    const { id } = req.params;

    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { subjectId: id },
            { subjectId, name, fullName, semesterNo },
            { new: true, runValidators: true }
        );

        if (!updatedSubject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found."
            });
        }

        res.json({
            success: true,
            message: "Subject updated successfully!",
            data: updatedSubject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating subject.",
            error: error.message
        });
    }
};

const deleteSubject = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSubject = await Subject.findOneAndDelete({ subjectId: id });

        if (!deletedSubject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found."
            });
        }

        res.json({
            success: true,
            message: "Subject deleted successfully!",
            data: deletedSubject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting subject.",
            error: error.message
        });
    }
};

module.exports = { bulkAddSubjects,addSubject, getSubjects, updateSubject, deleteSubject };
