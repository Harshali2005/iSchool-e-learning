import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-64 min-h-screen bg-gray-900 text-gray-200 flex flex-col p-6">
            <h2 className="text-2xl font-bold text-[#38bdf8] mb-8">Admin Panel</h2>
            <nav className="flex flex-col gap-4">
                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg hover:bg-gray-700 transition ${isActive ? "bg-[#38bdf8] text-gray-900" : ""
                        }`
                    }
                >
                    👥 Users List
                </NavLink>
                <NavLink
                    to="/admin/feedbacks"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg hover:bg-gray-700 transition ${isActive ? "bg-[#38bdf8] text-gray-900" : ""
                        }`
                    }
                >
                    📝 Feedbacks
                </NavLink>
                <NavLink
                    to="/admin/courses"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg hover:bg-gray-700 transition ${isActive ? "bg-[#38bdf8] text-gray-900" : ""
                        }`
                    }
                >
                    🎓 Courses List
                </NavLink>
                <NavLink
                    to="/admin/add-course"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg hover:bg-gray-700 transition ${isActive ? "bg-[#38bdf8] text-gray-900" : ""
                        }`
                    }
                >
                    ➕ Add Course
                </NavLink>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/";
                    }}
                    className="px-4 py-2 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                    Logout
                </button>
            </nav>
        </div>
    );
}
