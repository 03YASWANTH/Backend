import { Button, Modal } from "@mui/material";
import React, { useState } from "react";

function Marks() {
  const [viewMarksForm, setViewMarksForm] = useState(false);
  const [uploadMarksForm, setUploadMarksForm] = useState(false);
  return (
    <>
      <div className="flex gap-4">
        <Button variant="contained" color="primary">
          View Marks
        </Button>
        <Button variant="contained" color="primary">
          Upload Marks
        </Button>
      </div>
      <Modal
        open={viewMarksForm}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* year and sem and exam type (mid1, mid2 and semester)  */}
      </Modal>
    </>
  );
}

export default Marks;
