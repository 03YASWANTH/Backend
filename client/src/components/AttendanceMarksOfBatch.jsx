import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
 Box,
 Button,
 Paper,
 Table,
 TableBody,
 TableCell,
 TableContainer, 
 TableHead,
 TableRow,
 Typography,
 CircularProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import toast from 'react-hot-toast';

const AttendanceMarksOfBatch = () => {
 const { batch, semester, month } = useParams();
 const navigate = useNavigate();
 const [loading, setLoading] = useState(true);
 const [attendanceData, setAttendanceData] = useState(null);

 useEffect(() => {
   fetchAttendanceData();
 }, [batch, semester, month]);

 const fetchAttendanceData = async () => {
  try {
    setLoading(true);
    const response = await fetch("http://localhost:3000/api/v1/admin/attendance", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        batch: batch,
        semesterId: Number(semester), 
        month: month.charAt(0).toUpperCase() + month.slice(1)
      })
    });
 
    const result = await response.json();
    console.log(result);
    if(result.success) {
      toast.success("Attendance data fetched successfully");
      setAttendanceData(result.data);
      
    } else {
      throw new Error(result.message || 'Failed to fetch attendance data');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.message || 'Failed to load attendance data');
    navigate('/admin/attendance'); 
  } finally {
    setLoading(false);
  }
 };

 const capitalizeFirstLetter = (string) => {
   return string.charAt(0).toUpperCase() + string.slice(1);
 };

 const getSemesterLabel = (semId) => {
   const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
   return romanNumerals[parseInt(semId) - 1] || semId;
 };

 if (loading) {
   return (
     <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
       <CircularProgress />
     </Box>
   );
 }

 return (
   <Box p={3}>
     <Box mb={3} display="flex" alignItems="center" gap={2}>
       <Button
         startIcon={<ArrowBack />}
         onClick={() => navigate('/admin/attendance')}
         variant="outlined"
       >
         Back
       </Button>
       <Typography variant="h5" component="h1">
         Attendance Details
       </Typography>
     </Box>

     {attendanceData && (
       <>
         <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
           <Box display="flex" gap={4}>
             <Typography variant="body1">
               <strong>Batch:</strong> {attendanceData.batch}-{parseInt(attendanceData.batch) + 4}
             </Typography>
             <Typography variant="body1">
               <strong>Semester:</strong> {getSemesterLabel(attendanceData.semesterId)}
             </Typography>
             <Typography variant="body1">
               <strong>Month:</strong> {attendanceData.month}
             </Typography>
           </Box>
         </Paper>

         <TableContainer component={Paper}>
           <Table sx={{ minWidth: 650 }} aria-label="attendance table">
             <TableHead>
               <TableRow>
                 {attendanceData.tableData.headers.map((header, index) => (
                   <TableCell
                     key={header}
                     align={index === 0 ? "left" : "center"}
                     sx={{
                       fontWeight: 'bold',
                       backgroundColor: 'primary.main',
                       color: 'white',
                       textTransform: 'capitalize'
                     }}
                   >
                     {header}
                   </TableCell>
                 ))}
               </TableRow>
             </TableHead>
             <TableBody>
               {attendanceData.tableData.rows.map((row) => (
                 <TableRow
                   key={row.studentId}
                   sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                 >
                   <TableCell>{row.studentId}</TableCell>
                   {attendanceData.subjects.map(subject => (
                     <TableCell key={subject} align="center">
                       {row.subjects[subject]?.attendance || 'N/A'}
                     </TableCell>
                   ))}
                   <TableCell
                     align="center"
                     sx={{
                       color: parseFloat(row.overall) < 75 ? 'error.main' : 'success.main',
                       fontWeight: 'bold'
                     }}
                   >
                     {row.overall}%
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </TableContainer>
       </>
     )}

     {(!attendanceData || !attendanceData.tableData?.rows.length) && !loading && (
       <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
         <Typography variant="h6" color="text.secondary">
           No attendance data available for the selected criteria
         </Typography>
       </Paper>
     )}
   </Box>
 );
};

export default AttendanceMarksOfBatch;