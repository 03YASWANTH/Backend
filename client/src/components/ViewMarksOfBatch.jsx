// import React, { useEffect } from "react";
// import toast from "react-hot-toast";
// import { useParams } from "react-router-dom";
// import axios from "../../axios";

// function ViewMarksOfBatch() {
//   const { batch, sem, examType } = useParams();

//   useEffect(() => {
//     const fetchData = async (e) => {
//       try {
//         const response = await axios.get(
//           `/admin/marks?batch=${batch}&semester=${sem}&examType=${examType}`
//         );
//         console.log(response.data);
//         toast.success("Fetched!", {
//           style: {
//             border: "1px solid #713200",
//             padding: "16px",
//             color: "#713200",
//           },
//           iconTheme: {
//             primary: "#713200",
//             secondary: "#FFFAEE",
//           },
//         });
//       } catch (error) {
//         toast.error("Not found!", {
//           style: {
//             border: "1px solid #713200",
//             padding: "16px",
//             color: "#713200",
//           },
//           iconTheme: {
//             primary: "#713200",
//             secondary: "#FFFAEE",
//           },
//         });
//         console.error("Error fetching marks:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div>
//       Batch: {batch}
//       <br />
//       Semester: {sem}
//       <br />
//       Exam type: {examType}
//     </div>
//   );
// }

// export default ViewMarksOfBatch;

// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   TextField,
//   Button,
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Check as CheckIcon,
//   ArrowBack as BackIcon,
// } from "@mui/icons-material";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../../axios";
// import toast from "react-hot-toast";

// const ViewMarksOfBatch = () => {
//   const { batch, sem, examType } = useParams();
//   const navigate = useNavigate();
//   const [marks, setMarks] = useState({});
//   const [editableRows, setEditableRows] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `/admin/marks?batch=${batch}&semester=${sem}&examType=${examType}`
//         );
//         setMarks(response.data.results);

//         const initialEditState = Object.keys(response.data.results).reduce(
//           (acc, studentId) => {
//             acc[studentId] = Object.keys(
//               response.data.results[studentId]
//             ).reduce((subAcc, subject) => {
//               subAcc[subject] = false;
//               return subAcc;
//             }, {});
//             return acc;
//           },
//           {}
//         );

//         setEditableRows(initialEditState);

//         toast.success("Marks Fetched Successfully!", {
//           style: {
//             border: "1px solid #4caf50",
//             padding: "16px",
//             color: "#4caf50",
//           },
//           iconTheme: {
//             primary: "#4caf50",
//             secondary: "#ffffff",
//           },
//         });
//       } catch (error) {
//         toast.error("Failed to Fetch Marks", {
//           style: {
//             border: "1px solid #f44336",
//             padding: "16px",
//             color: "#f44336",
//           },
//           iconTheme: {
//             primary: "#f44336",
//             secondary: "#ffffff",
//           },
//         });
//         console.error("Error fetching marks:", error);
//       }
//     };

//     fetchData();
//   }, [batch, sem, examType]);

//   const handleEdit = (studentId, subject) => {
//     setEditableRows((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [subject]: true,
//       },
//     }));
//   };

//   const handleSave = (studentId, subject) => {
//     setEditableRows((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [subject]: false,
//       },
//     }));

//     // Placeholder for save API call
//     toast.success("Mark Updated!", {
//       style: {
//         border: "1px solid #4caf50",
//         padding: "16px",
//         color: "#4caf50",
//       },
//     });
//   };

//   const handleMarkChange = (studentId, subject, value) => {
//     setMarks((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [subject]: value,
//       },
//     }));
//   };

//   return (
//     <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
//       <Button
//         startIcon={<BackIcon />}
//         onClick={() => navigate("/marks")}
//         sx={{ mb: 2 }}
//         variant="outlined"
//       >
//         Back to Marks
//       </Button>

//       <TableContainer>
//         <Table stickyHeader aria-label="marks table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Student ID</TableCell>
//               {Object.keys(marks[Object.keys(marks)[0]] || {}).map(
//                 (subject) => (
//                   <TableCell key={subject} align="right">
//                     {subject}
//                   </TableCell>
//                 )
//               )}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {Object.entries(marks).map(([studentId, studentMarks]) => (
//               <TableRow key={studentId} hover>
//                 <TableCell component="th" scope="row">
//                   {studentId}
//                 </TableCell>
//                 {Object.entries(studentMarks).map(([subject, mark]) => (
//                   <TableCell key={subject} align="right">
//                     {editableRows[studentId]?.[subject] ? (
//                       <TextField
//                         type="number"
//                         value={mark}
//                         onChange={(e) =>
//                           handleMarkChange(studentId, subject, e.target.value)
//                         }
//                         variant="standard"
//                         // fullWidth
                        
//                       />
//                     ) : (
//                       mark
//                     )}
//                     <IconButton
//                       size="small"
//                       onClick={() =>
//                         editableRows[studentId]?.[subject]
//                           ? handleSave(studentId, subject)
//                           : handleEdit(studentId, subject)
//                       }
//                     >
//                       {editableRows[studentId]?.[subject] ? (
//                         <CheckIcon />
//                       ) : (
//                         <EditIcon className="hidden"/>
//                       )}
//                     </IconButton>
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// };

// export default ViewMarksOfBatch;

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
  const { batch, sem, examType } = useParams();
  const navigate = useNavigate();
  const [marks, setMarks] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [tempMarks, setTempMarks] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/admin/marks?batch=${batch}&semester=${sem}&examType=${examType}`
        );
        setMarks(response.data.results);
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
  }, [batch, sem, examType]);

  const handleDoubleClick = (studentId, subject, currentMark) => {
    setEditingCell(`${studentId}-${subject}`);
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
    //   console.log(typeof newMark);
    //   semester, batch, examType, studentId, subject, marks
      const response = await axios.put('/admin/marks/update', {
        batch,
        semester: sem,
        examType,
        studentId,
        subject,
        marks: parseInt(newMark)
      });
      console.log(response.data);

      const updatedMarks = { ...marks };
      updatedMarks[studentId][subject] = newMark;
      setMarks(updatedMarks);
      
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
        <div style={{ display: 'flex', alignItems: 'center',width: "fit-content" }}
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
        onClick={() => navigate('/marks')}
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
