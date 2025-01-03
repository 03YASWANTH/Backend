import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import AttendanceFormModal from "../components/AttendanceFormModal";

function Attendance() {
  const [viewAttendanceForm, setViewAttendanceForm] = useState(false);
  const [formData, setFormData] = useState({
    batch: "",
    semester: "",
    month: "",
  });
  const [mode, setMode] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box p={3}>
      <Box mb={3}>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setMode("view");
              setViewAttendanceForm(true);
            }}
            variant="contained"
            color="primary"
          >
            View Attendance
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setMode("upload");
              setViewAttendanceForm(true);
            }}
          >
            Upload Attendance
          </Button>
        </div>
      </Box>

      <AttendanceFormModal
        viewAttendanceForm={viewAttendanceForm}
        setViewAttendanceForm={setViewAttendanceForm}
        formData={formData}
        handleChange={handleChange}
        mode={mode}
      />
    </Box>
  );
}

export default Attendance;