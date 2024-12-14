import "./App.css";

import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Toaster } from "react-hot-toast";
import {
  Menu as MenuIcon,
  People as StudentsIcon,
  School as FacultyIcon,
  AdminPanelSettings as AdminIcon,
  LibraryBooks as SubjectsIcon,
  EventNote as AttendanceIcon,
  Assignment as MarksIcon,
} from "@mui/icons-material";

import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Admin from "./pages/Admin";
import Subjects from "./pages/Subjects";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import ViewMarksOfBatch from "./components/ViewMarksOfBatch";

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: "Students", icon: <StudentsIcon />, path: "/students" },
    { text: "Faculty", icon: <FacultyIcon />, path: "/faculty" },
    { text: "Admin", icon: <AdminIcon />, path: "/admin" },
    { text: "Subjects", icon: <SubjectsIcon />, path: "/subjects" },
    { text: "Attendance", icon: <AttendanceIcon />, path: "/attendance" },
    { text: "Marks", icon: <MarksIcon />, path: "/marks" },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <BrowserRouter>
      <Toaster />
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
                Counsellor Connect
              </Typography>
              <Button color="inherit">Sign In</Button>
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
              <Route path="/students" element={<Students />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/marks" >
                <Route index element={<Marks />} />
                <Route path=":batch/:sem/:examType" element={<ViewMarksOfBatch />} />
              </Route>
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
