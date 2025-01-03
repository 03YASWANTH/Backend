import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, GraduationCap, LogOut, User } from 'lucide-react';

const CounselorDashboard = () => {
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
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
    fetchStudentData();
  }, [counsellorId]);

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-700 to-blue-800 shadow-lg shadow-blue-900/50">
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
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-6">
                <div className='rounded-full bg-white/10 p-2'>
                  <User className="h-6 w-6 text-white" />
                </div>
                <span className='text-white'>{counsellor}</span>
                <button className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[1, 2, 3, 4].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(selectedYear === year ? null : year)}
              className={`bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 
                shadow-lg  
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
              <div className="bg-gradient-to-br from-blue-800 to-blue-800 p-6 rounded-t-xl relative overflow-hidden">
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
              
              <div className="p-6 bg-gradient-to-br from-blue-800 to-blue-600">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedStudents[selectedYear].map((student) => (
                    <div 
                      key={student.id}
                      className="p-6 bg-white/10 rounded-xl hover:bg-white/15 border-2 border-transparent hover:border-yellow-500 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/10"
                      onClick={() => dashboard(student)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-lg font-medium text-white">{student.name}</span>
                          <span className="text-sm text-gray-300">ID: {student.id}</span>
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
    </div>
  );
};

export default CounselorDashboard;