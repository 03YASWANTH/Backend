import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, GraduationCap, LogOut, User, PlusCircle, FileText, X, Save, CheckCircle, CheckSquare, Square, AlertTriangle } from 'lucide-react';

const CounselorDashboard = () => {
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);
  const [viewingNotes, setViewingNotes] = useState(false);
  const [studentNotes, setStudentNotes] = useState([]);
  const [checkedNotes, setCheckedNotes] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const { counsellorId } = useParams();
  const [counsellor, setCounsellor] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/v1/counsellor/students/${counsellorId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        setStudents(responseData.data || []);
        setCounsellor(responseData.name);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/counsellor/notes/${counsellorId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const notesData = await response.json();
        setNotes(notesData.data || []);
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };
    
    fetchStudentData();
    fetchNotes();
  }, [counsellorId]);

  // Toast management
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const dashboard = (student) => {
    navigate(`/counsellor/dashboard/${student.id}`, {
      state: {
        studentData: student.fullData,
        counsellorName: counsellor
      }
    });
  };

  const groupByYear = (studentList) => {
    const grouped = {
      1: [],
      2: [],
      3: [],
      4: []
    };
    
    if (!Array.isArray(studentList)) {
      console.warn('Student data is not an array:', studentList);
      return grouped;
    }
    
    studentList.forEach(student => {
      if (student && typeof student.currentYear === 'number' && student.currentYear >= 1 && student.currentYear <= 4) {
        grouped[student.currentYear].push({
          id: student.studentId,
          name: `${student.name.firstName} ${student.name.lastName}`,
          fullData: student
        });
      }
    });
    
    return grouped;
  };
  
  const openNoteModal = () => {
    setSelectedStudent(null);
    setNoteText('');
    setShowNoteModal(true);
    setViewingNotes(false);
  };
  
  const closeModal = () => {
    setShowNoteModal(false);
    setViewingNotes(false);
  };
  
  const handleStudentSelect = (e) => {
    setSelectedStudent(e.target.value);
  };
  
  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };
  
  const saveNote = async () => {
    // Check that ALL required fields exist and are valid
    if (!selectedStudent || !counsellorId || !noteText.trim()) {
      showToast('Please select a student, ensure counsellor ID is available, and enter a note', 'error');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/counsellor/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          counsellorId: counsellorId,
          note: noteText
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error details:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
      }
      
      const savedNote = await response.json();
      
      // Update notes list
      setNotes([...notes, savedNote.data]);
      
      // Close the modal and reset form
      setShowNoteModal(false);
      setSelectedStudent(null);
      setNoteText('');
      
      // Show success toast
      showToast('Note saved successfully!');
      
    } catch (err) {
      console.error('Error saving note:', err);
      showToast(`Failed to save note: ${err.message}`, 'error');
    }
  };
  
  const viewStudentNotes = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/counsellor/notes/student/${studentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const notesData = await response.json();
      setStudentNotes(notesData.data || []);
      setViewingNotes(true);
      setShowNoteModal(true);
      
      // Reset checked notes
      setCheckedNotes({});
      
      // Find student name for the modal title
      setSelectedStudent(studentId);
    } catch (err) {
      console.error('Error fetching student notes:', err);
      showToast('Failed to fetch notes for this student.', 'error');
    }
  };
  
  const toggleNoteCheck = (noteId) => {
    setCheckedNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };
  
  const findStudentNameById = (studentId) => {
    for (const year in groupedStudents) {
      const student = groupedStudents[year].find(s => s.id === studentId);
      if (student) return student.name;
    }
    return 'Student';
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg mx-4">
        Error loading student data: {error}
      </div>
    );
  }

  const groupedStudents = groupByYear(students);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 transform translate-y-0 opacity-100
          ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {toast.type === 'error' ? 
            <AlertTriangle className="w-5 h-5" /> : 
            <CheckCircle className="w-5 h-5" />
          }
          <p>{toast.message}</p>
        </div>
      )}

      <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-violet-900 shadow-lg shadow-blue-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-semibold tracking-tight text-white">Counsellor Dashboard</span>
              </div>
            </div>
            
            <div className="md:flex items-center space-x-6">
              <div className="flex items-center space-x-6">
                <button 
                  className="flex items-center space-x-2 bg-green-600 rounded-lg px-4 py-2 text-white hover:bg-green-700 transition-colors bg-opacity-90" 
                  onClick={openNoteModal}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Note</span>
                </button>
                <div className='rounded-full bg-white/10 p-2'>
                  <User className="h-6 w-6 text-white" />
                </div>
                <span className='text-white'>{counsellor}</span>
                <button className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors" onClick={() => navigate('/')}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[1, 2, 3, 4].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(selectedYear === year ? null : year)}
              className={`bg-violet-900 shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 
    
                ${selectedYear === year ? 'ring-2 ring-yellow-400 shadow-yellow-400/30' : 'shadow-blue-900/30'}`}
            >
              <div className="p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">Year {year}</h2>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {groupedStudents[year].length}
                    </span>
                  </div>
                  <p className="text-sm text-blue-100">
                    {groupedStudents[year].length === 1 ? 'Student' : 'Students'} Enrolled
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      
        <div className={`transition-all duration-500 ${selectedYear ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
          {selectedYear && (
            <div className="rounded-xl shadow-lg shadow-blue-900/30">
              <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 rounded-t-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Year {selectedYear} Students</h2>
                      <p className="text-blue-100">
                        {groupedStudents[selectedYear].length} {groupedStudents[selectedYear].length === 1 ? 'Student' : 'Students'} Currently Enrolled
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedStudents[selectedYear].map((student) => (
                    <div key={student.id} className="p-6 bg-white/10 rounded-xl border-2 border-transparent transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/10">
                      <div className="flex items-start justify-between">
                        <div
                          className="flex items-start space-x-4 cursor-pointer hover:bg-white/5 p-2 rounded-lg flex-grow"
                          onClick={() => dashboard(student)}
                        >
                          <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-lg font-medium text-white">{student.name}</span>
                            <span className="text-sm text-gray-300">ID: {student.id}</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button 
                            className="flex items-center space-x-1 bg-indigo-600/30 hover:bg-indigo-600/50 p-2 rounded-lg text-white text-sm transition-colors"
                            onClick={() => viewStudentNotes(student.id)}
                          >
                            <FileText className="h-4 w-4" />
                            <span>Notes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {groupedStudents[selectedYear].length === 0 && (
                  <div className="text-center text-gray-300 py-12">
                    No students currently enrolled in Year {selectedYear}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Adding/Viewing Notes */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-violet-900 shadow-lg p-4 rounded-t-xl flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {viewingNotes 
                  ? `Notes for ${findStudentNameById(selectedStudent)}` 
                  : 'Add New Note'}
              </h3>
              <button 
                className="text-white hover:bg-white/20 rounded-full p-1"
                onClick={closeModal}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              {viewingNotes ? (
                <div className="space-y-4">
                  {studentNotes.length > 0 ? (
                    studentNotes.map((note, index) => (
                      <div 
                        key={index} 
                        className={`bg-slate-50 p-4 rounded-lg border transition-all duration-200 
                          ${checkedNotes[note._id || index] 
                            ? 'border-green-400 bg-green-50' 
                            : 'border-slate-200'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => toggleNoteCheck(note._id || index)}
                              className="text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                              {checkedNotes[note._id || index] ? 
                                <CheckSquare className="h-5 w-5 text-green-600" /> : 
                                <Square className="h-5 w-5" />
                              }
                            </button>
                            <p className="text-sm text-slate-500">
                              {formatDate(note.date)}
                            </p>
                          </div>
                        </div>
                        <p className={`whitespace-pre-line pl-8 ${checkedNotes[note._id || index] ? 'text-slate-600' : 'text-slate-700'}`}>
                          {note.note}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-8">No notes found for this student.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Student
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                      value={selectedStudent || ''}
                      onChange={handleStudentSelect}
                    >
                      <option value="">-- Select a student --</option>
                      {selectedYear ? (
                        groupedStudents[selectedYear].map(student => (
                          <option key={student.id} value={student.id}>
                            {student.name} (Year {selectedYear})
                          </option>
                        ))
                      ) : (
                        [1, 2, 3, 4].map(year => (
                          <optgroup key={year} label={`Year ${year}`}>
                            {groupedStudents[year].map(student => (
                              <option key={student.id} value={student.id}>
                                {student.name}
                              </option>
                            ))}
                          </optgroup>
                        ))
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500 min-h-32"
                      placeholder="Enter your note here..."
                      value={noteText}
                      onChange={handleNoteChange}
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300 transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              
              {!viewingNotes && (
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
                  onClick={saveNote}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Note</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;