import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ViewMarksFormModal({
  viewMarksForm,
  setViewMarksForm,
  formData,
  handleChange,
}) {
  const nav = useNavigate();

  const handleSubmit = async () => {
    try {
      // Validate all required fields are filled
      if (!formData.batch || !formData.semester || !formData.examType) {
        toast.error("Please fill all the fields!", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
        return;
      }

      // Convert semester from Roman numeral to number
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

      // Extract batch year
      const batchYear = formData.batch.split("-")[0];

      // Navigate to marks page with correct parameters
      nav(`/marks/${batchYear}/${semester}/${formData.examType}`);

    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred while processing your request.", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
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
          Enter Marks Details
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
}

export default ViewMarksFormModal;