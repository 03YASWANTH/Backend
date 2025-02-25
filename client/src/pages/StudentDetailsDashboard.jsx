import React, { useState, useEffect } from "react";
import SupremePerformanceBarChart from "../components/MarksTable";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver"; // For Excel export
import { PDFDownloadLink } from "@react-pdf/renderer"; // For PDF export
import StudentReportPDF from "../components/StudentReportPDF"; // Custom PDF component

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
  Download,
} from "lucide-react";

// Tab Button Component
const TabButton = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors
        ${
          active
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
    >
      {children}
    </button>
  );
};

// Grade Card Component
const GradeCard = ({ subject, grade }) => {
  const gradeColors = {
    "A+": "from-green-600/20 to-green-700/20",
    A: "from-emerald-600/20 to-emerald-700/20",
    B: "from-blue-600/20 to-blue-700/20",
    C: "from-yellow-600/20 to-yellow-700/20",
    D: "from-orange-600/20 to-orange-700/20",
    E: "from-red-600/20 to-red-700/20",
    F: "from-red-800/20 to-red-900/20",
  };

  const gradeTextColors = {
    "A+": "text-green-400",
    A: "text-emerald-400",
    B: "text-blue-400",
    C: "text-yellow-400",
    D: "text-orange-400",
    E: "text-red-400",
    F: "text-red-500",
  };

  return (
    <div
      className={`bg-white/10 p-4 rounded-xl backdrop-blur-sm transform transition-all duration-300 hover:scale-105
        hover:bg-white/15 border-2 border-transparent hover:border-yellow-500 cursor-pointer group hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/1`}
    >
      <h3 className="text-lg font-semibold text-white mb-2">{subject}</h3>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span
            className={`text-3xl font-bold ${
              gradeTextColors[grade] || "text-gray-400"
            }`}
          >
            {grade}
          </span>
          <span className="text-sm text-blue-200">Grade</span>
        </div>
      </div>
    </div>
  );
};

// Performance Badge Component
const PerformanceBadge = ({ attendance, marks }) => {
  const getPerformanceStatus = () => {
    if (attendance < 75 || marks < 50) return "Critical";
    if (marks >= 50 && marks < 75) return "Warning";
    return "Good";
  };

  const status = getPerformanceStatus();

  const badgeColors = {
    Critical: "bg-red-500",
    Warning: "bg-yellow-500",
    Good: "bg-green-500",
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`px-3 py-1 rounded-full text-sm ${badgeColors[status]}`}>
        {status}
      </span>
    </div>
  );
};

// Download Report Button

const DownloadReportButton = ({ studentData, attendanceData,fetchAllMarks,selectedSemester }) => {
  return (
    <div className="flex space-x-4">

      {/* Download PDF Button */}
      <PDFDownloadLink
        document={
          <StudentReportPDF
            studentData={studentData}
            attendanceData={attendanceData}
            allMarksData={fetchAllMarks}
          />
        }
        fileName={`${studentData.studentId}_report.pdf`}
      >
        {({ loading }) =>
          loading ? (
            <button className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors">
              Loading PDF...
            </button>
          ) : (
            <button className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          )
        }
      </PDFDownloadLink>
    </div>
  );
};

// StudentDetailsDashboard Component
const StudentDetailsDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentData, counsellorName } = location.state || {};

  const [activeTab, setActiveTab] = useState("mid1");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedAttendanceSemester, setSelectedAttendanceSemester] =
    useState("1");
  const [attendanceData, setAttendanceData] = useState({
    monthlyData: [],
    subjects: {},
  });
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gpa, setGpa] = useState({
    sgpa: undefined,
    cgpa: undefined,
  });
  const [allMarksData, setAllMarksData] = useState({});

  useEffect(() => { 
    fetchAllMarksForPDF(selectedSemester);
  }, [selectedSemester]);
  const fetchAllMarksForPDF = async (semester) => {
    try {
      setError(null);
  
      const yearCode = studentData.studentId.substring(0, 2);
      const batch = "20" + yearCode;
  
      // Fetch marks for all exam types
      const examTypes = ["mid1", "mid2", "external"];
      const allMarks = {};
  
      for (const examType of examTypes) {
        const queryParams = new URLSearchParams({
          semester: semester,
          batch: batch,
          examType: examType,
        });
  
        const response = await fetch(
          `http://localhost:3000/api/v1/counsellor/student/${studentData.studentId}/marks?${queryParams}`
        );
  
        if (!response.ok) {
          throw new Error(`Failed to fetch ${examType} marks data`);
        }
  
        const data = await response.json();
  
        if (!data.success) {
          throw new Error(data.message || `Failed to fetch ${examType} marks data`);
        }
  
        // Transform data based on exam type
        if (examType === "external") {
          const gradesData = data.data;
          const transformedData = Object.entries(gradesData.marks).map(
            ([subject, grade]) => ({
              subject,
              grade,
            })
          );
  
          // Extract SGPA and CGPA
          const sgpa = transformedData.pop();
          const cgpa = transformedData.pop();
  
          allMarks[examType] = {
            marks: transformedData,
            sgpa: sgpa.grade,
            cgpa: cgpa.grade,
          };
        } else {
          const transformedData = Object.entries(data.data.marks).map(
            ([subject, marks]) => ({
              subject,
              marks: Number(marks),
            })
          );
          allMarks[examType] = {
            marks: transformedData,
          };
        }
      }
      setAllMarksData(allMarks); // Return all marks data for PDF generation
    } catch (err) {
      setError(err.message);
      console.error("Error fetching marks data:", err);
      return null;
    } 
  };
  // Fetch Attendance Data
  const fetchAttendanceData = async () => {
    try {
      setAttendanceData(null); // Reset data while loading

      const response = await fetch(
        `http://localhost:3000/api/v1/counsellor/getattendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batch: "20" + studentData.studentId.substring(0, 2),
            semesterId: selectedAttendanceSemester,
            studentId: studentData.studentId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();

      if (data.success && data.data?.monthlyData?.length > 0) {
        const processedData = {
          subjects: Object.fromEntries(
            Object.entries(data.data.semesterStats.subjects).map(
              ([key, value]) => [key.trim(), value]
            )
          ),
          monthlyData: data.data.monthlyData.filter(
            (month) => month.subjects?.length > 0
          ),
        };

        setAttendanceData(processedData);
      } else {
        setAttendanceData({
          subjects: {},
          monthlyData: [],
        });
      }
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setAttendanceData({
        subjects: {},
        monthlyData: [],
      });
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
        throw new Error(
          `Failed to fetch marks data (Status: ${response.status})`
        );
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
  }, [studentData?.studentId, selectedAttendanceSemester]);

  useEffect(() => {
    if (studentData?.studentId) {
      fetchMarksData(activeTab, selectedSemester);
    }
  }, [studentData?.studentId, activeTab, selectedSemester]);

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

  // Attendance Overview Component
  const AttendanceOverview = ({
    attendanceData,
    selectedAttendanceSemester,
    setSelectedAttendanceSemester,
    studentData,
  }) => {
    const [selectedMonth, setSelectedMonth] = useState(null);

    useEffect(() => {
      if (attendanceData?.monthlyData?.length > 0) {
        const monthWithData = attendanceData.monthlyData.find(
          (month) => month.subjects?.length > 0
        );
        if (monthWithData) {
          setSelectedMonth(monthWithData.month);
        }
      }
    }, [attendanceData]);

    const selectedMonthData = attendanceData?.monthlyData?.find(
      (month) => month.month === selectedMonth
    );

    const pieChartData =
      selectedMonthData?.subjects?.map((subject, index) => ({
        name: subject.subject.trim(),
        value: parseFloat(subject.percentage),
        fill: `hsl(${index * 45}, 85%, 60%)`,
      })) || [];

    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20">
            <p className="text-white font-medium">{payload[0]?.name}</p>
            <p className="text-white/90">
              Attendance: {payload[0]?.value.toFixed(2)}%
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900  rounded-xl shadow-2xl overflow-hidden">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Calendar className="h-6 w-6 text-blue-200" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                Attendance Overview
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedAttendanceSemester}
                onChange={(e) =>
                  setSelectedAttendanceSemester(Number(e.target.value))
                }
                className="bg-white/5 text-blue-200 border border-blue-400/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem} className="bg-indigo-900">
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!attendanceData ? (
            <div className="h-80 flex items-center justify-center">
              <p className="text-blue-200">Loading attendance data...</p>
            </div>
          ) : attendanceData.monthlyData?.length > 0 ? (
            <div className="space-y-8">
              {/* Monthly Trend Chart */}
              <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-blue-200 mb-6">
                  Monthly Attendance Trend
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="50%" height={300}>            
                    <BarChart
                      data={attendanceData.monthlyData.map((month) => ({
                        month: month.month,
                        percentage: parseFloat(month.overall.percentage),
                      }))}
                    >
                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#60A5FA"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3B82F6"
                            stopOpacity={0.5}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="2 2"
                        stroke="rgba(255,255,255,0.1)"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="#94A3B8"
                        tick={{ fill: "#94A3B8" }}
                      />
                      <YAxis
                        stroke="#94A3B8"
                        tick={{ fill: "#94A3B8" }}
                        domain={[0, 30]}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="percentage"
                        name="Attendance"
                        fill="url(#barGradient)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subject Distribution and Monthly Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-blue-200 mb-6">
                    Subject Distribution
                  </h3>
                  <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          fill="#8884d8"
                          label={({ name, value }) =>
                            `${name}: ${value.toFixed(1)}%`
                          }
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-blue-200 mb-6">
                      Monthly Analysis
                    </h3>
                    <div className="space-y-4 flex-grow">
                      <select
                        value={selectedMonth || ""}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full bg-white/5 text-blue-200 border border-blue-400/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                      >
                        {attendanceData.monthlyData
                          .filter((month) => month.subjects?.length > 0)
                          .map((month) => (
                            <option
                              key={month.month}
                              value={month.month}
                              className="bg-indigo-900"
                            >
                              {month.month}
                            </option>
                          ))}
                      </select>

                      <div className="mt-6">
                        {selectedMonthData?.subjects?.map((subject, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between text-sm text-blue-200 mb-1">
                              <span>{subject.subject.trim()}</span>
                              <span>{subject.percentage}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500 ease-in-out"
                                style={{
                                  width: `${subject.percentage}%`,
                                  backgroundColor: `hsl(${
                                    index * 45
                                  }, 85%, 60%)`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-blue-200">
                No attendance data available for this semester
              </p>
            </div>
          )}
        </div>
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
    <div className="min-h-screen bg-slate-100">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-violet-900 shadow-lg">
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
                <span className="text-2xl font-semibold text-white">
                  Student Details
                </span>
                <span className="text-sm text-blue-100">Academic Overview</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-6">
                <div className="rounded-full bg-white/10 p-2">
                  <User className="h-6 w-6 text-white" />
                </div>
                <span className="text-white">{counsellorName}</span>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8 relative z-10 bg-slate-100">
        {/* Student Information Card */}
        <div className="w-full">
          <div className="bg-gradient-to-br  from-indigo-900 via-purple-900 to-violet-900  rounded-xl p-8 shadow-2xl">
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
                <p className="font-semibold text-lg">{studentData.studentId}</p>
              </div>
              <div className="text-blue-100">
                <p className="text-sm opacity-80 mb-1">Email</p>
                <p className="font-semibold text-lg break-all">
                  <a href={`mailto:${studentData.email}`}>
                    {studentData.email}
                  </a>
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
                <p className="font-semibold text-lg">{studentData.semester}</p>
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
                    <p className="text-sm opacity-80 mb-1">Father's Phone</p>
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
                    <p className="text-sm opacity-80 mb-1">Mother's Phone</p>
                    <p className="font-semibold text-lg">
                      {studentData.motherPhoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Overview */}
        <AttendanceOverview
          attendanceData={attendanceData}
          selectedAttendanceSemester={selectedAttendanceSemester}
          setSelectedAttendanceSemester={setSelectedAttendanceSemester}
          studentData={studentData}
        />

        {/* Academic Performance Section */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 rounded-xl p-6 shadow-lg">
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
                  marksData={marksData || []}
                  loading={loading}
                  error={error}
                />
              </div>
            )}
          </div>
        </div>

        {/* Download Report Section */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Download Student Report
              </h2>
            </div>
          </div>

          <DownloadReportButton
            studentData={studentData}
            attendanceData={attendanceData}
            fetchAllMarks={allMarksData}
            selectedSemester={selectedSemester}
          />
        </div>
      </main>
    </div>
  );
};

export default StudentDetailsDashboard;