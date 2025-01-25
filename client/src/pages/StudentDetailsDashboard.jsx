import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, GraduationCap, User, Book, Clock, Award, ChevronLeft, LogOut, Users } from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';

const TabButton = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors
        ${active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      {children}
    </button>
  );
};

const GradeCard = ({ subject, grade }) => {
  const gradeColors = {
    'A+': 'from-green-600/20 to-green-700/20',
    'A': 'from-emerald-600/20 to-emerald-700/20',
    'B': 'from-blue-600/20 to-blue-700/20',
    'C': 'from-yellow-600/20 to-yellow-700/20',
    'D': 'from-orange-600/20 to-orange-700/20',
    'E': 'from-red-600/20 to-red-700/20',
    'F': 'from-red-800/20 to-red-900/20'
  };

  const gradeTextColors = {
    'A+': 'text-green-400',
    'A': 'text-emerald-400',
    'B': 'text-blue-400',
    'C': 'text-yellow-400',
    'D': 'text-orange-400',
    'E': 'text-red-400',
    'F': 'text-red-500'
  };

  return (
    <div className={`bg-gradient-to-r ${gradeColors[grade] || 'from-gray-600/20 to-gray-700/20'} p-4 rounded-xl backdrop-blur-sm transform transition-all duration-300 hover:scale-105`}>
      <h3 className="text-lg font-semibold text-white mb-2">{subject}</h3>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className={`text-3xl font-bold ${gradeTextColors[grade] || 'text-gray-400'}`}>{grade}</span>
          <span className="text-sm text-blue-200">Grade</span>
        </div>
      </div>
    </div>
  );
};

const PerformanceMetric = ({ label, value, highlight = false }) => (
  <div className={`p-6 rounded-xl ${highlight ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-white/10'}`}>
    <p className={`text-sm ${highlight ? 'text-yellow-100' : 'text-blue-200'}`}>{label}</p>
    <p className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-yellow-400'}`}>{value}</p>
  </div>
);

const StudentDetailsDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentData, counsellorName } = location.state || {};
  const [activeTab, setActiveTab] = useState('mid1');
  const [selectedSemester, setSelectedSemester] = useState(studentData?.semester || '1');
  const [marksData, setMarksData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (studentData?.studentId) {
      fetchAttendanceData();
      fetchMarksData(activeTab, selectedSemester);
    }
  }, [studentData?.studentId, activeTab, selectedSemester]);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/counsellor/student/${studentData.studentId}/attendance`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }

      const data = await response.json();
      if (data.success) {
        setAttendanceData(data.data.map(item => ({
          month: item.month,
          percentage: item.percentage
        })));
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    }
  };

  const fetchMarksData = async (examType, semester) => {
    try {
      setLoading(true);
      setError(null);
      const yearCode = studentData.studentId.substring(0, 2);
      const batch = '20' + yearCode;
      
      let endpoint = `http://localhost:3000/api/v1/counsellor/student/${studentData.studentId}/marks`;
      
      const queryParams = new URLSearchParams({
        semester: semester,
        batch: batch,
        examType: examType
      });

      const response = await fetch(`${endpoint}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch marks data (Status: ${response.status})`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch marks data');
      }

      if (examType === 'external') {
        const gradesData = data.data;
        const transformedData = Object.entries(gradesData.marks).map(([subject, grade]) => ({
          subject,
          grade,
        }));
        console.log("Transformed data:", transformedData);
        
        setMarksData({
          marks: transformedData,
         
        });
      } else {
        const transformedData = Object.entries(data.data.marks).map(([subject, marks]) => ({
          subject,
          marks: Number(marks),
          average: data.data.classAverages[subject] || 0
        }));
        
        setMarksData({
          marks: transformedData,
          statistics: {
            highest: data.data.highest,
            lowest: data.data.lowest,
            totalMarks: data.data.totalMarks,
            classAverage: data.data.classAverage
          }
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching marks data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    fetchMarksData(newTab, selectedSemester);
  };

  const handleSemesterChange = (newSemester) => {
    setSelectedSemester(newSemester);
    fetchMarksData(activeTab, newSemester);
  };

  const renderGradeView = () => {
    if (!marksData?.marks) return null;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="transform transition-all duration-500 hover:scale-105">
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-8 rounded-xl shadow-lg">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">SGPA</h3>
                <p className="text-5xl font-bold text-white animate-pulse">
                  {marksData.marks.grade || "N/A"}
                </p>
                <p className="text-sm text-white/80 mt-4">Semester Grade Point Average</p>
              </div>
            </div>
          </div>
          <div className="transform transition-all duration-500 hover:scale-105">
            <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-8 rounded-xl shadow-lg">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">CGPA</h3>
                <p className="text-5xl font-bold text-white animate-pulse">
                  {marksData.marks.grade|| "N/A"}
                </p>
                <p className="text-sm text-white/80 mt-4">Cumulative Grade Point Average</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marksData.marks.map((subject, index) => (
            <GradeCard
              key={index}
              subject={subject.subject}
              grade={subject.grade}
            />
          ))}
        </div>
      </div>
    );
  };

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          No student data available. Please go back and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-700 to-blue-800 shadow-lg shadow-blue-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="bg-white/10 p-2 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-semibold tracking-tight text-white">Student Details</span>
                <span className="text-sm text-blue-100">Academic Overview</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-6">
                <div className="rounded-full bg-white/10 p-2">
                  <User className="h-6 w-6 text-white" />
                </div>
                <span className="text-white">{counsellorName}</span>
                <button className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-white/10 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Personal Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-blue-100">
                <p className="text-sm opacity-80">Name</p>
                <p className="font-medium text-lg">{`${studentData.name.firstName} ${studentData.name.lastName}`}</p>
              </div>
              <div className="text-blue-100">
                <p className="text-sm opacity-80">Student ID</p>
                <p className="font-medium text-lg">{studentData.studentId}</p>
              </div>
              <div className="text-blue-100 col-span-2">
                <p className="text-sm opacity-80">Email</p>
                <p className="font-medium">{studentData.email}</p>
              </div>
              <div className="text-blue-100">
                <p className="text-sm opacity-80">Phone Number</p>
                <p className="font-medium">{studentData.phoneNumber}</p>
              </div>
              <div className="text-blue-100">
                <p className="text-sm opacity-80">Current Year</p>
                <p className="font-medium">Year {studentData.currentYear}</p>
              </div>
              <div className="text-blue-100">
                <p className="text-sm opacity-80">Semester</p>
                <p className="font-medium">{studentData.semester}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-white/10 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Parent Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-blue-100">
                <p className="text-sm opacity-80">Father's Name</p>
                <p className="font-medium">{studentData.fatherName}</p>
              </div>
              <div className="text-blue-100">
                <p className="text-sm opacity-80">Father's Phone</p>
                <p className="font-medium">{studentData.fatherPhoneNumber}</p>
              </div>
              <div className="text-blue-100">
                <p className="text-sm opacity-80">Mother's Name</p>
                <p className="font-medium">{studentData.motherName}</p>
              </div>
              <div className="text-blue-100">
                <p className="text-sm opacity-80">Mother's Phone</p>
                <p className="font-medium">{studentData.motherPhoneNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-white/10 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Attendance Overview</h2>
          </div>
          {attendanceData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#ffd700"
                    strokeWidth={3}
                    dot={{ fill: '#ffd700' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-white">No attendance data available</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Performance Analysis</h2>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-white text-sm">Semester:</label>
              <select
                value={selectedSemester}
                onChange={(e) => handleSemesterChange(e.target.value)}
                className="bg-white/10 text-white border-2 border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem} className="bg-blue-800">
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex space-x-4">
              <TabButton
                active={activeTab === 'mid1'}
                onClick={() => handleTabChange('mid1')}
              >
                Mid Term 1
              </TabButton>
              <TabButton
                active={activeTab === 'mid2'}
                onClick={() => handleTabChange('mid2')}
              >
                Mid Term 2
              </TabButton>
              <TabButton
                active={activeTab === 'external'}
                onClick={() => handleTabChange('external')}
              >
                Semester Grades
              </TabButton>
            </div>

            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-white">Loading marks data...</div>
              </div>
            ) : error ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-white bg-red-500/20 p-4 rounded-lg">{error}</div>
              </div>
            ) : !marksData ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-white">No marks data available</div>
              </div>
            ) : activeTab === 'external' ? (
              renderGradeView()
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marksData.marks}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="subject" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="marks" 
                      fill="#ffd700"
                      radius={[4, 4, 0, 0]}
                      name="Student Marks"
                    />
                    <Bar 
                      dataKey="average" 
                      fill="rgba(255,255,255,0.5)"
                      radius={[4, 4, 0, 0]}
                      name="Class Average"
                    />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-100">Highest Mark</p>
                    <p className="text-xl font-bold text-yellow-400">
                      {marksData.statistics.highest}
                    </p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-100">Total Marks</p>
                    <p className="text-xl font-bold text-yellow-400">
                      {marksData.statistics.totalMarks}
                    </p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-100">Lowest Mark</p>
                    <p className="text-xl font-bold text-yellow-400">
                      {marksData.statistics.lowest}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDetailsDashboard;