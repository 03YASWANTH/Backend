import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    fatherName: '',
    motherName: '',
    fatherPhoneNumber: '',
    motherPhoneNumber: '',
    currentYear: '',
    semester: '',
    counsellor: '',
  });

  const fetchStudents = async (year) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/v1/admin/students/${year}`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleEditClick = (student) => {
    setEditFormData({
      studentId: student.studentId,
      firstName: student.name.firstName,
      lastName: student.name.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      fatherName: student.fatherName,
      motherName: student.motherName,
      fatherPhoneNumber: student.fatherPhoneNumber,
      motherPhoneNumber: student.motherPhoneNumber,
      currentYear: student.currentYear,
      semester: student.semester,
      counsellor: student.counsellor,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditFormData({});
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/admin/students/${editFormData.studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: editFormData.studentId,
          name: {
            firstName: editFormData.firstName,
            lastName: editFormData.lastName,
          },
          email: editFormData.email,
          phoneNumber: editFormData.phoneNumber,
          fatherName: editFormData.fatherName,
          motherName: editFormData.motherName,
          fatherPhoneNumber: editFormData.fatherPhoneNumber,
          motherPhoneNumber: editFormData.motherPhoneNumber,
          currentYear: parseInt(editFormData.currentYear),
          semester: parseInt(editFormData.semester),
          counsellor: editFormData.counsellor,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      fetchStudents(selectedYear);
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/admin/students/${studentId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete student');
        }

        fetchStudents(selectedYear);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '20px' }}>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value={1}>Year 1</MenuItem>
          <MenuItem value={2}>Year 2</MenuItem>
          <MenuItem value={3}>Year 3</MenuItem>
          <MenuItem value={4}>Year 4</MenuItem>
        </Select>
      </div>
      
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Counsellor ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>
                  {student.name.firstName} {student.name.lastName}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.currentYear}</TableCell>
                <TableCell>{student.semester}</TableCell>
                <TableCell>{student.counsellorId}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(student)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(student.studentId)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Student Information</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Student ID: {editFormData.studentId}
                </Typography>
              </Grid>
              
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Personal Information
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={editFormData.firstName || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={editFormData.lastName || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={editFormData.email || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={editFormData.phoneNumber || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>

              {/* Parent Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Parent Information
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Father's Name"
                  name="fatherName"
                  value={editFormData.fatherName || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Father's Phone"
                  name="fatherPhoneNumber"
                  value={editFormData.fatherPhoneNumber || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mother's Name"
                  name="motherName"
                  value={editFormData.motherName || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mother's Phone"
                  name="motherPhoneNumber"
                  value={editFormData.motherPhoneNumber || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>

              {/* Academic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Academic Information
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Year"
                  name="currentYear"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 4 } }}
                  value={editFormData.currentYear || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Semester"
                  name="semester"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 8 } }}
                  value={editFormData.semester || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Counsellor ID"
                  name="counsellor"
                  value={editFormData.counsellor || ''}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions style={{
            padding: '16px',
          }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
};

export default StudentTable;