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
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AttendanceFormModal({
  viewAttendanceForm,
  setViewAttendanceForm,
  formData,
  handleChange,
  mode = "view"
}) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
        selectedFile.type === "application/vnd.ms-excel")) {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      e.target.value = null; 
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.batch || !formData.semester || !formData.month) {
        toast.error("Please fill all the fields!");
        return;
      }

      if (mode === "upload" && !file) {
        toast.error("Please select an Excel file!");
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

      if (mode === "upload") {
        const formDataToUpload = new FormData();
        formDataToUpload.append("file", file);
        formDataToUpload.append("batch", formData.batch.split("-")[0]);
        formDataToUpload.append("semesterId", semester);
        formDataToUpload.append("month", formData.month);

        const response = await fetch("http://localhost:3000/api/v1/admin/Uattendance", {
          method: "POST",
          body: formDataToUpload,
        });
        const result = await response.json();
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to upload attendance data");
        }
        else{
          toast.success("Attendance data uploaded successfully");
          setViewAttendanceForm(false);
          setFile(null);
        }
      } 
      else 
      {
       
        navigate(`/admin/attendance/${formData.batch.split("-")[0]}/${semester}/${formData.month}`);
        setViewAttendanceForm(false);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(error.message || "An error occurred while processing your request");
    }
  };

  return (
    <Modal
      open={viewAttendanceForm}
      onClose={() => {
        setViewAttendanceForm(false);
        setFile(null);
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
          variant="h6"
          component="h2"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          {mode === "view" ? "View Attendance" : "Upload Attendance"}
        </Typography>

        <TextField
          fullWidth
          select
          label="Batch"
          name="batch"
          value={formData.batch}
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
          value={formData.semester}
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
          label="Month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          {[
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
          ].map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </TextField>

        {mode === "upload" && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Upload Excel File (.xlsx, .xls)
            </Typography>
            <Input
              type="file"
              fullWidth
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              sx={{
                '&::file-selector-button': {
                  marginRight: '1rem'
                }
              }}
            />
            {file && (
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Selected file: {file.name}
              </Typography>
            )}
          </Box>
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
          {mode === "view" ? "View Attendance" : "Upload Attendance"}
        </Button>
      </Box>
    </Modal>
  );
}
export default AttendanceFormModal;