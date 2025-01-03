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
  Button 
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Check as CheckIcon, 
  ArrowBack as BackIcon 
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import toast from 'react-hot-toast';

const ViewMarksOfBatch = () => {
  const { batch, semester, examType } = useParams();
  const navigate = useNavigate();
  const [marks, setMarks] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [tempMarks, setTempMarks] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(semester)
        const response = await axios.get(
          `/admin/marks?batch=${batch}&semester=${semester}&examType=${examType}`
        );
        
        // Initialize tempMarks with the fetched marks
        const initialTempMarks = { ...response.data.results };
        setMarks(response.data.results);
        setTempMarks(initialTempMarks);

        toast.success("Marks Fetched Successfully!", {
          style: {
            border: "1px solid #4caf50",
            padding: "16px",
            color: "#4caf50"
          },
          iconTheme: {
            primary: "#4caf50",
            secondary: "#ffffff"
          }
        });
      } catch (error) {
        toast.error("Failed to Fetch Marks", {
          style: {
            border: "1px solid #f44336",
            padding: "16px",
            color: "#f44336"
          },
          iconTheme: {
            primary: "#f44336",
            secondary: "#ffffff"
          }
        });
        console.error("Error fetching marks:", error);
      }
    };
    
    fetchData();
  }, [batch, semester, examType]);

  const handleDoubleClick = (studentId, subject, currentMark) => {
    setEditingCell(`${studentId}-${subject}`);
    // Ensure we have a temp marks structure for the student and subject
    setTempMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: currentMark
      }
    }));
  };

  const handleSave = async (studentId, subject) => {
    try {
      const newMark = tempMarks[studentId][subject];
      
      const response = await axios.put('/admin/marks/update', {
        batch,
        semester: semester,
        examType,
        studentId,
        subject,
        marks: parseInt(newMark)
      });

      // Update the marks state with the new mark
      const updatedMarks = { ...marks };
      updatedMarks[studentId][subject] = newMark;
      setMarks(updatedMarks);
      
      // Exit editing mode
      setEditingCell(null);
      
      toast.success("Mark Updated Successfully!", {
        style: {
          border: "1px solid #4caf50",
          padding: "16px",
          color: "#4caf50"
        }
      });
    } catch (error) {
      toast.error("Failed to Update Mark", {
        style: {
          border: "1px solid #f44336",
          padding: "16px",
          color: "#f44336"
        }
      });
      console.error("Error updating mark:", error);
    }
  };

  const renderMarkCell = (studentId, subject, mark) => {
    const isEditing = editingCell === `${studentId}-${subject}`;
    
    if (isEditing) {
      return (
        <div 
          style={{ display: 'flex', alignItems: 'center', width: "fit-content" }}
          className='mx-auto'
        >
          <TextField
            type="number"
            value={tempMarks[studentId][subject]}
            onChange={(e) => setTempMarks(prev => ({
              ...prev,
              [studentId]: {
                ...prev[studentId],
                [subject]: e.target.value
              }
            }))}
            variant="outlined"
            size="small"
            sx={{ 
              width: '60px', 
              '& .MuiOutlinedInput-input': { 
                p: 1, 
                textAlign: 'center' 
              } 
            }}
            inputProps={{ min: 0, max: 100 }}
          />
          <IconButton
            size="small" 
            onClick={() => handleSave(studentId, subject)}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
        </div>
      );
    }

    return (
      <div 
        onDoubleClick={() => handleDoubleClick(studentId, subject, mark)}
        style={{ 
          minWidth: '60px', 
          textAlign: 'center', 
          cursor: 'pointer',
          padding: '4px' 
        }}
      >
        {mark}
      </div>
    );
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Button 
        startIcon={<BackIcon />} 
        onClick={() => navigate('/admin/marks')}
        sx={{ mb: 2 }}
        variant="outlined"
      >
        Back to Marks
      </Button>

      <TableContainer>
        <Table stickyHeader aria-label="marks table">
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              {Object.keys(marks[Object.keys(marks)[0]] || {}).map(subject => (
                <TableCell key={subject} align="center">{subject}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(marks).map(([studentId, studentMarks]) => (
              <TableRow key={studentId} hover>
                <TableCell component="th" scope="row">
                  {studentId}
                </TableCell>
                {Object.entries(studentMarks).map(([subject, mark]) => (
                  <TableCell key={subject} align="center">
                    {renderMarkCell(studentId, subject, mark)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ViewMarksOfBatch;