import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import Dashboard from "./pages/User/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function ProtectedRoute({ user, role, children }) {
  if (user === undefined) return null;

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role.toLowerCase() !== role.toLowerCase())
    return <Navigate to="/" replace />;

  return children;
}

function App() {
  const [user, setUser] = useState(undefined); 

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    else setUser(null);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        }
      />

      <Route
        path="/courses"
        element={
          <>
            <Navbar />
            <Courses />
            <Footer />
          </>
        }
      />

      <Route
        path="/courses/:courseId"
        element={
          <>
            <Navbar />
            <CourseDetail />
            <Footer />
          </>
        }
      />

      <Route
        path="/about"
        element={
          <>
            <Navbar />
            <About />
            <Footer />
          </>
        }
      />

      <Route
        path="/contact"
        element={
          <>
            <Navbar />
            <Contact />
            <Footer />
          </>
        }
      />

      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute user={user} role="user">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute user={user} role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
