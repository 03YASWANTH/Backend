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
  TextField, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Grid, 
  Typography 
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon, 
  Add as AddIcon 
} from '@mui/icons-material';
import axios from '../../axios';
import { toast } from 'react-hot-toast';

const CounsellorsManagement = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [filteredCounsellors, setFilteredCounsellors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCounsellor, setEditingCounsellor] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCounsellor, setNewCounsellor] = useState({
    counsellorId: '',
    name: { firstName: '', lastName: '' },
    email: '',
    password: ''
  });

  // Fetch counsellors
  const fetchCounsellors = async () => {
    try {
      const response = await axios.get('admin/counsellor');
      setCounsellors(response.data.data);
      setFilteredCounsellors(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch counsellors');
      console.error('Error fetching counsellors:', error);
    }
  };

  useEffect(() => {
    fetchCounsellors();
  }, []);

  // Search functionality
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = counsellors.filter(
      (counsellor) => 
        counsellor.counsellorId.toLowerCase().includes(term) ||
        `${counsellor.name.firstName} ${counsellor.name.lastName}`.toLowerCase().includes(term)
    );

    setFilteredCounsellors(filtered);
  };

  // Delete counsellor
  const handleDelete = async (counsellorId) => {
    try {
      await axios.delete(`admin/counsellor/${counsellorId}`);
      toast.success('Counsellor deleted successfully');
      fetchCounsellors(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete counsellor');
      console.error('Error deleting counsellor:', error);
    }
  };

  // Edit counsellor
  const handleEditOpen = (counsellor) => {
    setEditingCounsellor({...counsellor});
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditingCounsellor(null);
    setIsEditDialogOpen(false);
  };

  const handleEditSave = async () => {
    try {
      // Ensure we're sending the correct data structure
      console.log('editingCounsellor:', editingCounsellor);
      const response = await axios.put(`admin/counsellor/${editingCounsellor.counsellorId}`, {
        name: {
          firstName: editingCounsellor.name.firstName,
          lastName: editingCounsellor.name.lastName
        },
        email: editingCounsellor.email,
        password: editingCounsellor.password
      });
      console.log('Response from server:', response.data);
      
      toast.success('Counsellor updated successfully');
      fetchCounsellors();
      handleEditClose();
    } catch (error) {
      toast.error('Failed to update counsellor');
      console.error('Error updating counsellor:', error);
    }
  };

  // Add counsellor
  const handleAddOpen = () => {
    setNewCounsellor({
      counsellorId: '',
      name: { firstName: '', lastName: '' },
      email: '',
      password: ''
    });
    setIsAddDialogOpen(true);
  };

  const handleAddClose = () => {
    setIsAddDialogOpen(false);
  };

  const handleAddSave = async () => {
    try {
      await axios.post('admin/counsellor', { data: newCounsellor });
      toast.success('Counsellor added successfully');
      fetchCounsellors();
      handleAddClose();
    } catch (error) {
      toast.error('Failed to add counsellor');
      console.error('Error adding counsellor:', error);
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Counsellors"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon />
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddOpen}
          >
            Add Counsellor
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Counsellor ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCounsellors.map((counsellor) => (
              <TableRow key={counsellor.counsellorId}>
                <TableCell>{counsellor.counsellorId}</TableCell>
                <TableCell>{counsellor.name.firstName}</TableCell>
                <TableCell>{counsellor.name.lastName}</TableCell>
                <TableCell>{counsellor.email}</TableCell>
                <TableCell>
                  <IconButton color="primary"onClick={() => handleEditOpen(counsellor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(counsellor.counsellorId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Counsellor</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Counsellor ID"
                value={editingCounsellor?.counsellorId || ''}
                disabled
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={editingCounsellor?.name.firstName || ''}
                onChange={(e) => setEditingCounsellor(prev => ({
                  ...prev,
                  name: { ...prev.name, firstName: e.target.value }
                }))}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={editingCounsellor?.name.lastName || ''}
                onChange={(e) => setEditingCounsellor(prev => ({
                  ...prev,
                  name: { ...prev.name, lastName: e.target.value }
                }))}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={editingCounsellor?.email || ''}
                onChange={(e) => setEditingCounsellor(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={editingCounsellor?.password || ''}
                onChange={(e) => setEditingCounsellor(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleAddClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Counsellor</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Counsellor ID"
                value={newCounsellor.counsellorId}
                onChange={(e) => setNewCounsellor(prev => ({
                  ...prev,
                  counsellorId: e.target.value
                }))}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={newCounsellor.name.firstName}
                onChange={(e) => setNewCounsellor(prev => ({
                  ...prev,
                  name: { ...prev.name, firstName: e.target.value }
                }))}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={newCounsellor.name.lastName}
                onChange={(e) => setNewCounsellor(prev => ({
                  ...prev,
                  name: { ...prev.name, lastName: e.target.value }
                }))}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={newCounsellor.email}
                onChange={(e) => setNewCounsellor(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={newCounsellor.password}
                onChange={(e) => setNewCounsellor(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAddSave} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CounsellorsManagement;