import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import axios from '../../axios';
import { toast } from 'react-hot-toast';

// Create axios axios with base configuration


const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({
    subjectId: '',
    name: '',
    fullName: '',
    semesterNo: 1,
    regulation: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch subjects
  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('admin/subject');
      // Ensure we're accessing the correct data property
      const subjectsData = response.data?.data || [];
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch subjects');
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle Add/Edit Subject
  const handleSave = async () => {
    try {
      // Validate input
      if (!currentSubject.subjectId || !currentSubject.name) {
        toast.error('Please fill in all required fields');
        return;
      }

      const subjectData = { 
        data: {
          subjectId: currentSubject.subjectId,
          name: currentSubject.name,
          fullName: currentSubject.fullName,
          semesterNo: currentSubject.semesterNo,
          regulation: currentSubject.regulation
        }
      };

      if (isEditing) {
        // Update existing subject
        await axios.put(`admin/subject/${currentSubject.subjectId}`, subjectData);
        toast.success('Subject updated successfully');
      } else {
        // Add new subject
        await axios.post('admin/subject', subjectData);
        toast.success('Subject added successfully');
      }
      
      fetchSubjects();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast.error(error.response?.data?.message || 'Failed to save subject');
    }
  };

  // Delete Subject
  const handleDelete = async (subjectId) => {
    try {
      await axios.delete(`admin/subject/${subjectId}`);
      toast.success('Subject deleted successfully');
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error(error.response?.data?.message || 'Failed to delete subject');
    }
  };

  // Open dialog for editing
  const handleEdit = (subject) => {
    setCurrentSubject({...subject});
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Open dialog for adding
  const handleOpenAddDialog = () => {
    setCurrentSubject({
      subjectId: '',
      name: '',
      fullName: '',
      semesterNo: selectedSemester,
      regulation: ''
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSubject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter subjects by selected semester
  const filteredSubjects = subjects.length > 0 
    ? subjects.filter(subject => subject.semesterNo === selectedSemester)
    : [];

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Typography variant="h4" gutterBottom>
        Subject Management
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Select Semester</InputLabel>
            <Select
              value={selectedSemester}
              label="Select Semester"
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <MenuItem key={sem} value={sem}>
                  Semester {sem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add New Subject
          </Button>
        </Grid>
      </Grid>

      {isLoading ? (
        <Typography>Loading subjects...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Regulation</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject.subjectId}>
                  <TableCell>{subject.subjectId}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.fullName}</TableCell>
                  <TableCell>{subject.semesterNo}</TableCell>
                  <TableCell>{subject.regulation}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(subject)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(subject.subjectId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Subject Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>
          {isEditing ? 'Edit Subject' : 'Add New Subject'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="subjectId"
                label="Subject ID"
                fullWidth
                margin="dense"
                value={currentSubject.subjectId}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Subject Name"
                fullWidth
                margin="dense"
                value={currentSubject.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="fullName"
                label="Full Subject Name"
                fullWidth
                margin="dense"
                value={currentSubject.fullName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Semester</InputLabel>
                <Select
                  name="semesterNo"
                  value={currentSubject.semesterNo}
                  label="Semester"
                  onChange={handleInputChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <MenuItem key={sem} value={sem}>
                      Semester {sem}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="regulation"
                label="Regulation"
                fullWidth
                margin="dense"
                value={currentSubject.regulation}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subjects;