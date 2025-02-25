import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  InputAdornment,
  FormControl,
  Box,
  Grid,
  Typography,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);

  const [newStudent, setNewStudent] = useState({
    studentId: '',
    name: {
      firstName: '',
      lastName: '',
    },
    email: '',
    phoneNumber: '',
    fatherName: '',
    motherName: '',
    fatherPhoneNumber: '',
    motherPhoneNumber: '',
    currentYear: selectedYear,
    semester: '',
    counsellorId: '',
  });

  const [editingStudent, setEditingStudent] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);

  // Fetch Counsellors
  const fetchCounsellors = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/counsellor');
      
      if (!response.ok) {
        throw new Error('Failed to fetch counsellors');
      }

      const data = await response.json();
      
      // Transform counsellor data to include both display information
      const transformedCounsellors = data.data.map(counsellor => ({
        _id: counsellor._id,
        counsellorId: counsellor.counsellorId,
        fullName: `${counsellor.name.firstName} ${counsellor.name.lastName}`,
        displayLabel: `${counsellor.counsellorId} - ${counsellor.name.firstName} ${counsellor.name.lastName}`
      }));

      setCounsellors(transformedCounsellors);
    } catch (err) {
      toast.error(`Counsellor Fetch Error: ${err.message}`);
    }
  };

  const fetchStudents = async (year) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/v1/admin/students/${year}`);

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(data.data.length / prev.pageSize),
      }));
      
      toast.success('Students fetched successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch counsellors and students when component mounts or year changes
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchStudents(selectedYear),
        fetchCounsellors()
      ]);
    };
    
    fetchData();
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({ ...prev, currentPage: value }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleAddStudent = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: newStudent }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || 'Failed to add student');
      }

      toast.success(result.message);
      setAddDialogOpen(false);
      fetchStudents(selectedYear);
      
      // Reset form
      setNewStudent({
        studentId: '',
        name: { firstName: '', lastName: '' },
        email: '',
        phoneNumber: '',
        fatherName: '',
        motherName: '',
        fatherPhoneNumber: '',
        motherPhoneNumber: '',
        currentYear: '',
        semester: '',
        counsellorId: '',
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditStudent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/admin/students/${editingStudent.studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: editingStudent }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update student');
      }

      toast.success(result.message);
      setEditDialogOpen(false);
      fetchStudents(selectedYear);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/admin/students/${studentId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete student');
      }

      toast.success(result.message);
      fetchStudents(selectedYear);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      toast.error('Please select a file to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', bulkFile);
  
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/bulkaddstudents', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload file');
      }
  
      toast.success(result.message || 'Students uploaded successfully');
      setBulkUploadDialogOpen(false);
      fetchStudents(selectedYear);
      setBulkFile(null);
    } catch (err) {
      toast.error(err.message || 'An error occurred during file upload');
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${student.name.firstName} ${student.name.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
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

          <TextField
            variant="outlined"
            placeholder="Search by Student ID or Name"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Student
          </Button>

          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => setBulkUploadDialogOpen(true)}
          >
            Bulk Upload
          </Button>
        </Box>
      </Box>

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
            {filteredStudents
              .slice(
                (pagination.currentPage - 1) * pagination.pageSize,
                pagination.currentPage * pagination.pageSize
              )
              .map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>
                    {student.name.firstName} {student.name.lastName}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.currentYear}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>
                    {" "}
                    {counsellors.filter(
                      (counsellor) => counsellor._id === student.counsellorId
                    )[0]?.counsellorId || "N/A"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        const currentCounsellor = counsellors.find(
                          (c) => c._id === student.counsellorId
                        );
                        setEditingStudent({
                          ...student,
                          name: { ...student.name },
                          counsellorId: currentCounsellor?._id || "",
                        });
                        setEditDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteStudent(student.studentId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Existing table rendering and other components remain the same */}

      {/* Add Student Dialog - Counsellor Dropdown */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "10px" }}>
          <Grid container spacing={2}>
            {/* Existing fields remain the same */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student ID"
                value={newStudent.studentId}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    studentId: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={newStudent.name.firstName}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    name: { ...prev.name, firstName: e.target.value },
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={newStudent.name.lastName}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    name: { ...prev.name, lastName: e.target.value },
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={newStudent.email}
                onChange={(e) =>
                  setNewStudent((prev) => ({ ...prev, email: e.target.value }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newStudent.phoneNumber}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                value={newStudent.currentYear}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    currentYear: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Semester"
                value={newStudent.semester}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    semester: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father Name"
                value={newStudent.fatherName}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    fatherName: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mother Name"
                value={newStudent.motherName}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    motherName: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father Phone Number"
                value={newStudent.fatherPhoneNumber}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    fatherPhoneNumber: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mother Phone Number"
                value={newStudent.motherPhoneNumber}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    motherPhoneNumber: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                label="Counsellor"
                value={newStudent.counsellorId}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    counsellorId: e.target.value,
                  }))
                }
                variant="outlined"
                displayEmpty
                required
              >
                <MenuItem value="" disabled>
                  Select Counsellor
                </MenuItem>
                {counsellors.map((counsellor) => (
                  <MenuItem
                    key={counsellor._id}
                    value={counsellor.counsellorId}
                  >
                    {counsellor.displayLabel}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddDialogOpen(false)}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddStudent}
            color="primary"
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Dialog - Counsellor Dropdown */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Existing fields remain the same */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student ID"
                value={editingStudent?.studentId}
                disabled
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={editingStudent?.name?.firstName}
                onChange={(e) =>
                  setEditingStudent((prev) => ({
                    ...prev,
                    name: { ...prev.name, firstName: e.target.value },
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={editingStudent?.name?.lastName}
                onChange={(e) =>
                  setEditingStudent((prev) => ({
                    ...prev,
                    name: { ...prev.name, lastName: e.target.value },
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={editingStudent?.email}
                onChange={(e) =>
                  setEditingStudent((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={editingStudent?.phoneNumber}
                onChange={(e) =>
                  setEditingStudent((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father Name"
                value={editingStudent?.fatherName}
                onChange={(e) =>
                  setEditingStudent((prev) => ({
                    ...prev,
                    fatherName: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mother Name"
                value={editingStudent?.motherName}
                onChange={(e) =>
                  setEditingStudent((prev) => ({
                    ...prev,
                    motherName: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father Phone Number"
                value={editingStudent?.fatherPhoneNumber}
                onChange={(e) =>
                  setEditingStudent((prev) => ({
                    ...prev,
                    fatherPhoneNumber: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mother Phone Number"
                value={editingStudent?.motherPhoneNumber}
                onChange={(e) =>
                  setEditingStudent((prev) => ({
                    ...prev,
                    motherPhoneNumber: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Semester"
                value={editingStudent?.semester}
                onChange={(e) =>
                  setEditingStudent((prev) => ({
                    ...prev,
                    semester: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Year"
                value={editingStudent?.currentYear}
                onChange={(e) =>
                  setEditingStudent((prev) => ({
                    ...prev,
                    currentYear: e.target.value,
                  }))
                }
                variant="outlined"
                margin="dense"
                required
              />
            </Grid>

            {/* Counsellor Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Counsellor</InputLabel>
                <Select
                  fullWidth
                  label="Counsellor"
                  value={editingStudent?.counsellorId || ""}
                  onChange={(e) =>
                    setEditingStudent((prev) => ({
                      ...prev,
                      counsellorId: e.target.value,
                    }))
                  }
                  variant="outlined"
                  margin="dense"
                >
                  <MenuItem value="" disabled>
                    Select Counsellor
                  </MenuItem>
                  {counsellors.map((counsellor) => (
                    <MenuItem key={counsellor._id} value={counsellor._id}>
                      {counsellor.displayLabel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditStudent}
            color="primary"
            variant="contained"
          >
            Update Student
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={bulkUploadDialogOpen}
        onClose={() => setBulkUploadDialogOpen(false)}
      >
        <DialogTitle>Bulk Upload Students</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => setBulkFile(e.target.files[0])}
              style={{ margin: "20px 0" }}
            />
            {bulkFile && (
              <Typography variant="body2">
                Selected File: {bulkFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBulkUploadDialogOpen(false)}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkUpload}
            color="primary"
            variant="contained"
            disabled={!bulkFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default StudentTable;