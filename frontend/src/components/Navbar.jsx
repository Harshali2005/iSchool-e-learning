import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const scrollToCourses = () => {
    if (location.pathname === "/") {
      const el = document.querySelector("#courses-section");
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector("#courses-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-700"
          : "bg-gray-800/50 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-6 py-3 flex justify-between items-center text-gray-200">
        <Link to="/" className="flex items-center gap-3 z-50">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/30">
            E
          </div>
          <div>
            <div className="font-extrabold text-xl text-[#38bdf8] tracking-wide">
              ISchool
            </div>
            <div className="text-xs text-gray-400 -mt-1">E-Learning</div>
          </div>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium z-50">
          <button
            onClick={scrollToCourses}
            className="relative hover:text-[#facc15] after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-[#facc15] after:transition-all after:duration-300"
          >
            Courses
          </button>

          <Link
            to="/about"
            className="relative hover:text-[#facc15] after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-[#facc15] after:transition-all after:duration-300"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="relative hover:text-[#facc15] after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-[#facc15] after:transition-all after:duration-300"
          >
            Contact
          </Link>

          {!user ? (
            <Link
              to="/login"
              className="px-4 py-1 border border-[#38bdf8] rounded-md hover:bg-[#38bdf8] hover:text-white transition-all duration-300"
            >
              Login
            </Link>
          ) : (
            <>
              {user.role === "admin" ? (
                <Link
                  to="/admin"
                  className="px-4 py-1 border border-[#38bdf8] rounded-md hover:bg-[#38bdf8] hover:text-white transition-all duration-300"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-4 py-1 border border-[#38bdf8] rounded-md hover:bg-[#38bdf8] hover:text-white transition-all duration-300"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={logout}
                className="ml-2 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
