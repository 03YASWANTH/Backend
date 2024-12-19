import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ViewMarksFormModal from "../components/ViewMarksFormModal";

function Marks() {
  const [viewMarksForm, setViewMarksForm] = useState(false);
  const [formData, setFormData] = useState({
    batch: "",
    semester: "",
    examType: "",
  });
  const [mode, setMode] = useState(""); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            setMode("view"); 
            setViewMarksForm(true);
          }}
          variant="contained"
          color="primary"
        >
          View Marks
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setMode("upload"); 
            setViewMarksForm(true);
          }}
        >
          Upload Marks
        </Button>
      </div>
      <ViewMarksFormModal
        viewMarksForm={viewMarksForm}
        setViewMarksForm={setViewMarksForm}
        formData={formData}
        handleChange={handleChange}
        mode={mode}
      />
    </>
  );
}

export default Marks;

