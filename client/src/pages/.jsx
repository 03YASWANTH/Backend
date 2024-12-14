import React, { useState } from "react";
import { Box, Typography, MenuItem, TextField, Button } from "@mui/material";
import Modal from "@mui/material/Modal";

const PremiumModal = ({ viewMarksForm, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    batch: "",
    semester: "",
    examType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      open={viewMarksForm}
      onClose={onClose}
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
          Enter Marks Details
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
        >
          <MenuItem value="2021-2025">2021-2025</MenuItem>
          <MenuItem value="2022-2026">2022-2026</MenuItem>
          <MenuItem value="2023-2027">2023-2027</MenuItem>
          <MenuItem value="2024-2028">2024-2028</MenuItem>
        </TextField>
        <TextField
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
          fullWidth
          select
          label="Exam Type"
          name="examType"
          value={formData.examType}
          onChange={handleChange}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          <MenuItem value="mid1">Mid1</MenuItem>
          <MenuItem value="mid2">Mid2</MenuItem>
          <MenuItem value="semester">Semester</MenuItem>
        </TextField>
        
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
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default PremiumModal;
