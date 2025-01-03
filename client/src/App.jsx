import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./layouts/AdminDashboard";
import CounsellorDashboard from "./layouts/CounsellorDashboard";
import StudentDetailsDashboard from "./pages/studentDetailsDashboard";
import SignInPage from "./pages/signin";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

// Add Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/signin" />;
  }
  
  return children;
};

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return (
    <BrowserRouter>
      <Toaster />
      <ThemeProvider theme={theme}>
        <Routes>
          
          <Route path="/" element={<SignInPage /> } />
          <Route path="/admin/*" element={<AdminDashboard />}/>
          <Route path="/counsellor/:counsellorId/" element={<CounsellorDashboard />} />
          <Route path="/counsellor/dashboard/:id" element={<StudentDetailsDashboard />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;