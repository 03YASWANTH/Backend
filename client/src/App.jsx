import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./layouts/AdminDashboard";
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
          {/* Public Route */}
          <Route path="/signin" element={<SignInPage /> } 
          />

          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Root Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? 
                <Navigate to={`/${userRole}`} /> : 
                <Navigate to="/signin" />
            }
          />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;