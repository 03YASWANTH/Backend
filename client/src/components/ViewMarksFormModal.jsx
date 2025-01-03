import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
  Input, 
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ViewMarksFormModal({
  viewMarksForm,
  setViewMarksForm,
  formData,
  handleChange,
  mode = "view",
}) {
  const nav = useNavigate();
  const [file, setFile] = useState(null);
  const [remaining, setRemaining] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(selectedFile);
    } 
    else 
    {
      toast.error("Please upload a valid Excel file.");
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate all required fields are filled
      if (!formData.batch || !formData.semester || !formData.examType) {
        toast.error("Please fill all the fields!", {
          style: {
            border: "1px solid #d32f2f",
            padding: "16px",
            color: "#d32f2f",
          },
          iconTheme: {
            primary: "#d32f2f",
            secondary: "#FFFAEE",
          },
        });
        return;
      }

      // For the "upload" mode, validate that a file is selected
      if (mode === "upload" && !file) {
        toast.error("Please upload an Excel file!");
        return;
      }

      const semesterMapping = {
        I: 1,
        II: 2,
        III: 3,
        IV: 4,
        V: 5,
        VI: 6,
        VII: 7,
        VIII: 8,
      };

      const semester = semesterMapping[formData.semester];
      if (semester === undefined) {
        toast.error("Invalid semester selected!");
        return;
      }

      const batchYear = formData.batch.split("-")[0];

      if (mode === "view") {
        nav(`/admin/marks/${batchYear}/${semester}/${formData.examType}`);
      } 
      else if (mode === "upload") 
      {
        
        const formDataToUpload = new FormData();
        formDataToUpload.append("file", file); // Add the file
        formDataToUpload.append("batch", formData.batch.split("-")[0]); // Add batch
        formDataToUpload.append("semester", semester); // Add semester (mapped)
        formDataToUpload.append("examType", formData.examType); // Add exam type
  
        // Send the form data to the backend
        const response = await fetch("http://localhost:3000/api/v1/admin/marks/upload", {
          method: "POST",
          body: formDataToUpload, // FormData handles multipart
        });
  
        if (response.ok) 
        {
          toast.success("Marks uploaded successfully!");
          setFile(null); // Reset file input
          setViewMarksForm(false); // Close modal
        } 
        else 
        {
          const errorResponse = await response.json();
          toast.error(errorResponse.message || "Failed to upload marks!");
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred while processing your request.", {
        style: {
          border: "1px solid #d32f2f",
          padding: "16px",
          color: "#d32f2f",
        },
        iconTheme: {
          primary: "#d32f2f",
          secondary: "#FFFAEE",
        },
      });
    }
  };

  return (
    <Modal
      open={viewMarksForm}
      onClose={() => {
        setViewMarksForm(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          {mode === "view" ? "View Marks Details" : "Upload Marks Details"}
        </Typography>

        <TextField
          fullWidth
          select
          label="Batch"
          name="batch"
          value={formData.batch || ""}
          onChange={handleChange}
          variant="outlined"
          sx={{ mb: 2 }}
          required
        >
          <MenuItem value="2021-2025">2021-2025</MenuItem>
          <MenuItem value="2022-2026">2022-2026</MenuItem>
          <MenuItem value="2023-2027">2023-2027</MenuItem>
          <MenuItem value="2024-2028">2024-2028</MenuItem>
        </TextField>

        <TextField
          required
          fullWidth
          select
          label="Semester"
          name="semester"
          value={formData.semester || ""}
          onChange={handleChange}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => (
            <MenuItem key={sem} value={sem}>
              {sem}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          required
          fullWidth
          select
          label="Exam Type"
          name="examType"
          value={formData.examType || ""}
          onChange={handleChange}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          <MenuItem value="mid1">Mid1</MenuItem>
          <MenuItem value="mid2">Mid2</MenuItem>
          <MenuItem value="external">Semester</MenuItem>
        </TextField>

        {mode === "upload" && (
          <>
            <Input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              sx={{ mb: 2 }}
            />
          </>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            bgcolor: "#007bff",
            ":hover": { bgcolor: "#0056b3" },
          }}
        >
          {mode === "view" ? "View" : "Upload"}
        </Button>
      </Box>
    </Modal>
  );
}

export default ViewMarksFormModal;
