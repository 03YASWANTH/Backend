const { Counsellor } = require('../models/counsellor');

const CounsellorPost = async (req, res) => 
{
    try {
        const { data } = req.body;
        const counsellor = new Counsellor(data);
        await counsellor.save();
        res.send({
            success: true,
            message: "Counsellor added successfully!",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error adding counsellor",
            error: error.message
        });
    }
};

const CounsellorGet = async (req, res) => {
    try {
        const counsellors = await Counsellor.find();
        res.send({
            success: true,
            message: "Counsellor data fetched successfully!",
            data: counsellors,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching counsellors",
            error: error.message
        });
    }
};

const CounsellorUpdate = async (req, res) => {
    try {
        const id = req.params; 
        console.log(id);
        const data = req.body;    

        // Validate input
        if (!id || typeof id !== "string") {
            return res.status(400).send({
                success: false,
                message: "Invalid counsellor ID provided.",
            });
        }

        if (!data || typeof data !== "object") {
            return res.status(400).send({
                success: false,
                message: "Invalid data for update. Please provide valid fields.",
            });
        }

        // Perform the update operation
        const counsellor = await Counsellor.findOneAndUpdate(
            { counsellorId: id },  
            { $set: data },        
            { new: true }       
        );

        if (!counsellor) {
            return res.status(404).send({
                success: false,
                message: "Counsellor not found.",
            });
        }
        res.status(200).send({
            success: true,
            message: "Counsellor updated successfully!",
            data: counsellor,
        });
    } catch (error) {
        console.error("Error updating counsellor:", error);
        res.status(500).send({
            success: false,
            message: "Error updating counsellor.",
            error: error.message,
        });
    }
};
const CounsellorDelete = async (req, res) => {
    try {
        const id  = req.params; 

        // Find by counsellorId and delete
        const counsellor = await Counsellor.findOneAndDelete({
            counsellorId: id, 
        });

        if (!counsellor) {
            return res.status(404).send({
                success: false,
                message: "Counsellor not found",
            });
        }

        res.send({
            success: true,
            message: "Counsellor deleted successfully!",
            data: counsellor,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error deleting counsellor",
            error: error.message,
        });
    }
};

module.exports = {
    CounsellorGet, 
    CounsellorDelete, 
    CounsellorPost, 
    CounsellorUpdate
};