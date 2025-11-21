import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import UsersList from "./UsersList";
import Feedbacks from "./Feedbacks";
import CoursesList from "./CoursesList";
import AddCourse from "./AddCourse";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || user.role !== "admin") return <Navigate to="/" />;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/users" element={<UsersList />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="*" element={<Navigate to="users" />} />
        </Routes>
      </div>
    </div>
  );
}
