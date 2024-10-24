// import React from 'react'

// function Admin() {
//   return (
//     <div>Admin</div>
//   )
// }

// export default Admin

import React from "react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Horizontal Navbar */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium text-gray-700">Admin Name</span>
            <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Placeholder content */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">Welcome to the Admin Dashboard</h2>
            <p className="mt-4 text-gray-600">
              Here you can manage students, faculty, admins, subjects, marks, and attendance.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;