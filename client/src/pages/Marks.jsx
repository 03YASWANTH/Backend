import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ViewMarksFormModal from "../components/ViewMarksFormModal";

function Marks() {
  const [viewMarksForm, setViewMarksForm] = useState(false);
  const [uploadMarksForm, setUploadMarksForm] = useState(false);
  const [formData, setFormData] = useState({
    batch: "",
    semester: "",
    examType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            setViewMarksForm(true);
          }}
          variant="contained"
          color="primary"
        >
          View Marks
        </Button>
        <Button variant="contained" color="primary">
          Upload Marks
        </Button>
      </div>
      <ViewMarksFormModal
        viewMarksForm={viewMarksForm}
        setViewMarksForm={setViewMarksForm}
        formData={formData}
        handleChange={handleChange}
      />
    </>
  );
}

export default Marks;
