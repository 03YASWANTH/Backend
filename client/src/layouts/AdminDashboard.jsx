import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  People as StudentsIcon,
  School as FacultyIcon,
  AdminPanelSettings as AdminIcon,
  LibraryBooks as SubjectsIcon,
  EventNote as AttendanceIcon,
  Assignment as MarksIcon,
} from "@mui/icons-material";

import Students from "../pages/Students";
import Faculty from "../pages/Faculty";
import Admin from "../pages/Admin";
import Subjects from "../pages/Subjects";
import Attendance from "../pages/Attendance";
import Marks from "../pages/Marks";
import ViewMarksOfBatch from "../components/ViewMarksOfBatch";
import AttendanceMarksOfBatch from "../components/AttendanceMarksOfBatch";

const drawerWidth = 240;

function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate(); // For navigation after logout

  const menuItems = [
    { text: "Dashboard", icon: <AdminIcon />, path: "/admin" },
    { text: "Students", icon: <StudentsIcon />, path: "/admin/students" },
    { text: "Faculty", icon: <FacultyIcon />, path: "/admin/faculty" },
    { text: "Subjects", icon: <SubjectsIcon />, path: "/admin/subjects" },
    { text: "Attendance", icon: <AttendanceIcon />, path: "/admin/attendance" },
    { text: "Marks", icon: <MarksIcon />, path: "/admin/marks" },
  ];

  const handleLogout = () => {
    
    localStorage.removeItem("authToken"); 
    sessionStorage.removeItem("authToken");
    navigate("/");
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            to={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(to br, #f6f9fc, #283593); ",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
          >
            Logout
          </button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(!mobileOpen)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/students" element={<Students />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/marks">
            <Route index element={<Marks />} />
            <Route 
              path=":batch/:semester/:examType" 
              element={<ViewMarksOfBatch />} 
            />
          </Route>
          <Route path="/attendance">
            <Route index element={<Attendance />} />
            <Route 
              path=":batch/:semester/:month" 
              element={<AttendanceMarksOfBatch />} 
            />
          </Route>
        </Routes>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
