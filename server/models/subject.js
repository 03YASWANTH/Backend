const mongoose = require("mongoose");
const SubjectSchema = new mongoose.Schema({
    subjectId: 
    { 
        type: String, 
        unique: true,
        required: true 
    },
    name: 
    { 
        type: String, 
        required: true 
    },
    fullName:
    {
        type:String,
        required:true
    },
    semsterNo:
    {
        type:Number,
        required:true
    },
    regulation:
    {
        type: String,
        required: true
    }
});
const Subject = new mongoose.model('Subject',SubjectSchema);
module.exports = {Subject,}