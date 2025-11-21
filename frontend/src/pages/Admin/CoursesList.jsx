
import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function CoursesList() {
    const [courses, setCourses] = useState([]);

    const fetchCourses = () => {
        API.get("/courses")
            .then((res) => setCourses(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const deleteCourse = async (id) => {
        await API.delete(`/courses/${id}`);
        fetchCourses();
    };

    return (
        <div className="min-h-screen p-6 bg-gray-900">
            <h2 className="text-2xl font-bold text-[#38bdf8] mb-6">🎓 Courses List</h2>

            {courses.length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 shadow hover:shadow-[#38bdf8]/20 transition"
                        >
                            {course.image && (
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-40 object-cover rounded-lg mb-3"
                                />
                            )}
                            <h4 className="text-lg font-bold text-[#38bdf8] mb-1">{course.title}</h4>
                            <p className="text-gray-300 text-sm mb-3">{course.description}</p>
                            <button
                                onClick={() => deleteCourse(course._id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No courses available.</p>
            )}
        </div>
    );
}
