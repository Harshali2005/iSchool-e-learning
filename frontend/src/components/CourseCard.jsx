import React from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div
      className="group bg-white/10 backdrop-blur-lg border border-white/20 
      rounded-xl p-4 hover:bg-white/20 transition-all duration-300 
      hover:shadow-lg hover:scale-[1.03]"
    >
      <div className="w-full h-40 bg-gray-700/40 rounded-lg mb-4 overflow-hidden">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover rounded-lg group-hover:opacity-90 transition-all"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold text-[#38bdf8] mb-2 truncate">
        {course.title}
      </h3>

      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {course.description || "No description available."}
      </p>

      <Link
        to={`/courses/${course._id}`}
        className="text-[#facc15] font-medium hover:underline"
      >
        View course →
      </Link>
    </div>
  );
}
