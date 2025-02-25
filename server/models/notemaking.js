// This is a model file for note making. The counsellor can make notes of the students assigned to them. These notes are going to be helpful to check the progress of the student.
const mongoose = require("mongoose");
const { Schema } = mongoose;
const noteMakingSchema = new Schema({
    studentId: {
        type: String,
        required: true
    },
    counsellorId: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    });

module.exports = mongoose.model("NoteMaking", noteMakingSchema);
