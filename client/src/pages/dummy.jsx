import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  GraduationCap,
  User,
  ChevronLeft,
  LogOut,
  Award,
} from "lucide-react";

// Animations
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 }
};

const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3 }
};

// Modern color palette
const colors = {
  primary: "#2563eb",
  secondary: "#1d4ed8",
  accent: "#60a5fa",
  background: "#ffffff",
  card: "#f8fafc",
  text: "#1e293b",
  charts: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"]
};

// Tab Button Component with Animation
const TabButton = ({ children, active, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-md
        ${active 
          ? "bg-blue-600 text-white shadow-blue-500/25" 
          : "bg-white text-blue-600 hover:bg-blue-50"}`}
    >
      {children}
    </motion.button>
  );
};

// Grade Card Component with Animation
const GradeCard = ({ subject, grade }) => {
  const gradeStyles = {
    "A+": { bg: "from-green-400 to-emerald-500", text: "text-emerald-50" },
    A: { bg: "from-blue-400 to-blue-500", text: "text-blue-50" },
    B: { bg: "from-indigo-400 to-indigo-500", text: "text-indigo-50" },
    C: { bg: "from-violet-400 to-violet-500", text: "text-violet-50" },
    D: { bg: "from-purple-400 to-purple-500", text: "text-purple-50" },
    E: { bg: "from-orange-400 to-red-500", text: "text-orange-50" },
    F: { bg: "from-red-400 to-red-500", text: "text-red-50" }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ scale: 1.03, translateY: -5 }}
      className={`bg-gradient-to-br ${gradeStyles[grade]?.bg || "from-gray-400 to-gray-500"}
        p-6 rounded-2xl shadow-lg backdrop-blur-sm`}
    >
      <h3 className={`text-lg font-semibold ${gradeStyles[grade]?.text || "text-gray-50"} mb-3`}>
        {subject}
      </h3>
      <div className="flex justify-between items-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white"
        >
          {grade}
        </motion.span>
      </div>
    </motion.div>
  );
};

// Chart Components with Animations
const AnimatedChart = ({ children }) => (
  <motion.div
    variants={fadeIn}
    initial="initial"
    animate="animate"
    exit="exit"
    className="h-80 w-full"
  >
    {children}
  </motion.div>
);

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-blue-100">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Main Dashboard Component
const StudentDetailsDashboard = () => {
  // ... (keep existing state and data fetching logic)
   const location = useLocation();
      const navigate = useNavigate();
      const { studentData, counsellorName } = location.state || {};
      
     
      const [activeTab, setActiveTab] = useState("mid1");
      const [selectedSemester, setSelectedSemester] = useState(
        studentData?.semester || "1"
      );
      const [selectedAttendanceSemester, setSelectedAttendanceSemester] = useState(
        studentData?.semester || "1"
      );
      const [attendanceData, setAttendanceData] = useState({
        subjects: [],
        monthlyData: []
      });
      const [marksData, setMarksData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [gpa, setGpa] = useState({
        sgpa: undefined,
        cgpa: undefined,
      });
      const generateShortForm = (subjectName) => {
        if (subjectName.includes(" ")) {
          return subjectName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
        }
        return subjectName.substring(0, 4).toUpperCase();
      };
    
      // Fetch Attendance Data
      const fetchAttendanceData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/v1/counsellor/getattendance`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                batch: "20" + studentData.studentId.substring(0, 2),
                semesterId: selectedAttendanceSemester,
                studentId: studentData.studentId
              })
            }
          );
    
          if (!response.ok) {
            throw new Error("Failed to fetch attendance data");
          }
    
          const data = await response.json();
          if (data.success) {
            const monthlyAttendance = data.data.monthlyData.map(month => {
              const totalPresent = month.subjects.reduce((sum, subject) => sum + subject.presentDays, 0);
              const totalDays = month.subjects.reduce((sum, subject) => sum + subject.totalDays, 0);
              const percentage = ((totalPresent / totalDays) * 100).toFixed(2);
    
              return {
                month: month.month,
                percentage: parseFloat(percentage),
                ...month.subjects.reduce((acc, subject) => ({
                  ...acc,
                  [subject.subject]: parseFloat(((subject.presentDays / subject.totalDays) * 100).toFixed(2))
                }), {})
              };
            });
    
            setAttendanceData({
              subjects: data.data.semesterStats.subjects,
              monthlyData: monthlyAttendance
            });
          }
        } catch (err) {
          console.error("Error fetching attendance data:", err);
        }
      };
    
      // Fetch Marks Data
      const fetchMarksData = async (examType, semester) => {
        try {
          setLoading(true);
          setError(null);
          const yearCode = studentData.studentId.substring(0, 2);
          const batch = "20" + yearCode;
    
          const queryParams = new URLSearchParams({
            semester: semester,
            batch: batch,
            examType: examType,
          });
    
          const response = await fetch(
            `http://localhost:3000/api/v1/counsellor/student/${studentData.studentId}/marks?${queryParams}`
          );
    
          if (!response.ok) {
            throw new Error(`Failed to fetch marks data (Status: ${response.status})`);
          }
    
          const data = await response.json();
    
          if (!data.success) {
            throw new Error(data.message || "Failed to fetch marks data");
          }
    
          if (examType === "external") {
            const gradesData = data.data;
            const transformedData = Object.entries(gradesData.marks).map(
              ([subject, grade]) => ({
                subject,
                grade,
              })
            );
    
            const sgpa = transformedData.pop();
            const cgpa = transformedData.pop();
            setGpa({
              sgpa: sgpa.grade,
              cgpa: cgpa.grade,
            });
            setMarksData({
              marks: transformedData,
            });
          } else {
            const transformedData = Object.entries(data.data.marks).map(
              ([subject, marks]) => ({
                subject, 
                marks: Number(marks),
              })
            );
            setMarksData({
              marks: transformedData,
            });
          }
        } catch (err) {
          setError(err.message);
          console.error("Error fetching marks data:", err);
        } finally {
          setLoading(false);
        }
      };
    
      // Effects
      useEffect(() => {
        if (studentData?.studentId) {
          fetchAttendanceData();
        }
      }, [studentData?.studentId, selectedAttendanceSemester]); // Only fetch attendance data when selectedAttendanceSemester changes
      
      useEffect(() => {
        if (studentData?.studentId) {
          fetchMarksData(activeTab, selectedSemester);
        }
      }, [studentData?.studentId, activeTab, selectedSemester]); // Only fetch marks data when selectedSemester or activeTab changes
      // Event Handlers
      const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        fetchMarksData(newTab, selectedSemester);
      };
    
      const handleSemesterChange = (newSemester) => {
        setSelectedSemester(newSemester); 
        fetchMarksData(activeTab, newSemester); 
      };
    
      // Render Functions
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
                      {gpa?.sgpa || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="transform transition-all duration-500 hover:scale-105">
                <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-8 rounded-xl shadow-lg">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">CGPA</h3>
                    <p className="text-5xl font-bold text-white animate-pulse">
                      {gpa?.cgpa || "N/A"}
                    </p>
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
    
      const renderAttendanceOverview = () => {
      const [selectedMonth, setSelectedMonth] = useState(
        attendanceData.monthlyData[0]?.month || ""
      );
    
      // Get data for the selected month
      const selectedMonthData = attendanceData.monthlyData.find(
        (month) => month.month === selectedMonth
      );
    
      // Prepare data for the pie chart
      const pieChartData = selectedMonthData
        ? Object.entries(attendanceData.subjects).map(([subject, data]) => ({
            name: subject,
            value: selectedMonthData[subject] || 0,
            }))
          : [];
    
      return (
        <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Attendance Overview
              </h2>
            </div>
    
            <div className="flex items-center space-x-3">
              <label className="text-white text-sm">Semester:</label>
              <select
                value={selectedAttendanceSemester}
                onChange={(e) => setSelectedAttendanceSemester(e.target.value)}
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
    
          {attendanceData.monthlyData.length > 0 ? (
            <div className="space-y-8">
              {/* Overall Attendance Bar Chart */}
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Overall Attendance (Monthly)
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData.monthlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                      />
                      <XAxis dataKey="month" stroke="#fff" />
                      <YAxis stroke="#fff" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(30, 41, 59, 0.9)",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="percentage"
                        name="Overall Attendance"
                        fill="#ffd700"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
    
              {/* Subject-wise Attendance Pie Chart */}
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Subject-wise Attendance ({selectedMonth})
                </h3>
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
                  <div className="h-80 w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          label
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(${index * 45}, 70%, 60%)`}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 41, 59, 0.9)",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
    
                  {/* Month Selector */}
                  <div className="w-full md:w-1/2">
                    <label className="text-white text-sm">Select Month:</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="bg-white/10 text-white border-2 border-yellow-400 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      {attendanceData.monthlyData.map((month) => (
                        <option key={month.month} value={month.month}>
                          {month.month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-white">No attendance data available</p>
            </div>
          )}
        </div>
      );
    };
    
      // Main Render
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
      {/* Modern Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-4"
            >
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="bg-blue-50 p-3 rounded-xl">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-gray-800">
                  Student Details
                </span>
                <span className="text-sm text-gray-500">Academic Overview</span>
              </div>
            </motion.div>

            {/* Profile Section */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-6"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-2 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-gray-700">{counsellorName}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-blue-600 rounded-lg px-4 py-2 text-white hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <AnimatePresence>
        <motion.main
          variants={fadeIn}
          initial="initial"
          animate="animate"
          exit="exit"
          className="max-w-7xl mx-auto px-6 py-12 space-y-8"
        >
          {/* Add the rest of your components here with similar motion animations */}
          {/* Student Information Card */}
          <motion.div
            variants={scaleIn}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-full">
              <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300 w-full">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-white/10 rounded-lg flex-shrink-0">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Personal Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-blue-100">
                    <p className="text-sm opacity-80 mb-1">Name</p>
                    <p className="font-semibold text-lg">
                      {`${studentData.name.firstName} ${studentData.name.lastName}`}
                    </p>
                  </div>
                  <div className="text-blue-100">
                    <p className="text-sm opacity-80 mb-1">Student ID</p>
                    <p className="font-semibold text-lg">
                      {studentData.studentId}
                    </p>
                  </div>
                  <div className="text-blue-100">
                    <p className="text-sm opacity-80 mb-1">Email</p>
                    <p className="font-semibold text-lg break-all">
                      {studentData.email}
                    </p>
                  </div>
                  <div className="text-blue-100">
                    <p className="text-sm opacity-80 mb-1">Phone Number</p>
                    <p className="font-semibold text-lg">
                      {studentData.phoneNumber}
                    </p>
                  </div>
                  <div className="text-blue-100">
                    <p className="text-sm opacity-80 mb-1">Current Year</p>
                    <p className="font-semibold text-lg">
                      Year {studentData.currentYear}
                    </p>
                  </div>
                  <div className="text-blue-100">
                    <p className="text-sm opacity-80 mb-1">Semester</p>
                    <p className="font-semibold text-lg">
                      {studentData.semester}
                    </p>
                  </div>

                  {/* Parent Information */}
                  <div className="text-blue-100 col-span-1 sm:col-span-2 lg:col-span-3 bg-white/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Parent Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm opacity-80 mb-1">Father's Name</p>
                        <p className="font-semibold text-lg">
                          {studentData.fatherName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80 mb-1">
                          Father's Phone
                        </p>
                        <p className="font-semibold text-lg">
                          {studentData.fatherPhoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80 mb-1">Mother's Name</p>
                        <p className="font-semibold text-lg">
                          {studentData.motherName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80 mb-1">
                          Mother's Phone
                        </p>
                        <p className="font-semibold text-lg">
                          {studentData.motherPhoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ... Student info content ... */}
          </motion.div>

          {/* Charts and Graphs with Animation */}
          <motion.div
            variants={fadeIn}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            {/* ... Your existing charts with AnimatedChart wrapper ... */}
            {renderAttendanceOverview()}

            {/* Academic Performance Section */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Performance Analysis
                  </h2>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-white text-sm">Semester:</label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => handleSemesterChange(e.target.value)} // Only update selectedSemester
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
                    active={activeTab === "mid1"}
                    onClick={() => handleTabChange("mid1")}
                  >
                    Mid Term 1
                  </TabButton>
                  <TabButton
                    active={activeTab === "mid2"}
                    onClick={() => handleTabChange("mid2")}
                  >
                    Mid Term 2
                  </TabButton>
                  <TabButton
                    active={activeTab === "external"}
                    onClick={() => handleTabChange("external")}
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
                    <div className="text-white bg-red-500/20 p-4 rounded-lg">
                      {error}
                    </div>
                  </div>
                ) : !marksData ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-white">No marks data available</div>
                  </div>
                ) : activeTab === "external" ? (
                  renderGradeView()
                ) : (
                  <div className="h-80">
                    <SupremePerformanceBarChart
                      marksData={marksData}
                      loading={loading}
                      error={error}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* ... Your existing charts with AnimatedChart wrapper ... */}
          </motion.div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default StudentDetailsDashboard;