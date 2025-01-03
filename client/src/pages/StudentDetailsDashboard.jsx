import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, GraduationCap, User, Book, Clock, Award, ChevronLeft, LogOut, Users } from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';

const StudentDetailsDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentData, counsellorName } = location.state || {};
  const [activeTab, setActiveTab] = useState('mid1');

  const attendanceData = [
    { month: 'Aug', percentage: 92 },
    { month: 'Sep', percentage: 88 },
    { month: 'Oct', percentage: 95 },
    { month: 'Nov', percentage: 85 },
    { month: 'Dec', percentage: 90 }
  ];

  const academicData = {
    mid1: [
      { subject: 'Mathematics', marks: 85, average: 75 },
      { subject: 'Physics', marks: 78, average: 72 },
      { subject: 'Programming', marks: 92, average: 80 },
    ],
    mid2: [
      { subject: 'Mathematics', marks: 88, average: 76 },
      { subject: 'Physics', marks: 82, average: 75 },
      { subject: 'Programming', marks: 95, average: 82 },
    ],
    semester: [
      { subject: 'Mathematics', grade: 'A', gpa: 9.0 },
      { subject: 'Physics', grade: 'B+', gpa: 8.5 },
      { subject: 'Programming', grade: 'A+', gpa: 10.0 },
    ]
  };

  const TabButton = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
        active 
          ? 'bg-white/20 text-white ring-2 ring-yellow-400'
          : 'bg-white/10 text-white hover:bg-white/15'
      }`}
    >
      {children}
    </button>
  );

  if (!studentData) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg mx-4">
        No student data available
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
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-white/10 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Performance Analysis</h2>
          </div>
          <div className="space-y-6">
            <div className="flex space-x-4">
              <TabButton 
                active={activeTab === 'mid1'} 
                onClick={() => setActiveTab('mid1')}
              >
                Mid Term 1
              </TabButton>
              <TabButton 
                active={activeTab === 'mid2'} 
                onClick={() => setActiveTab('mid2')}
              >
                Mid Term 2
              </TabButton>
              <TabButton 
                active={activeTab === 'semester'} 
                onClick={() => setActiveTab('semester')}
              >
                Semester Grades
              </TabButton>
            </div>

            <div className="h-80">
              {activeTab === 'semester' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {academicData.semester.map((subject, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-6 text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
                        <p className="text-2xl font-bold text-yellow-400">{subject.grade}</p>
                      </div>
                      <p className="font-medium text-white">{subject.subject}</p>
                      <p className="text-sm text-blue-100 mt-1">GPA: {subject.gpa}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={academicData[activeTab]}>
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
                    />
                    <Bar 
                      dataKey="average" 
                      fill="rgba(255,255,255,0.5)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDetailsDashboard;