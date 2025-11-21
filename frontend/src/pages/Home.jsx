import React, { useEffect, useState, useRef } from "react";
import API from "../services/api";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const courseSectionRef = useRef(null);

  useEffect(() => {
    API.get("/courses")
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  const scrollToCourses = () => {
    courseSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    courseSectionRef.current?.classList.add("animate-pulse");
    setTimeout(() => courseSectionRef.current?.classList.remove("animate-pulse"), 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-[#e2e8f0]">
      <Navbar className="relative z-50" />

      <section
        className="relative h-screen flex flex-col justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <div className="relative z-10 text-center px-6 flex flex-col items-center gap-6">
          <h1 className="text-5xl font-extrabold text-[#38bdf8] drop-shadow-lg">
            ISchool — Modern E-Learning
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Master trending technologies and build your career through interactive, real-world courses.
          </p>

          <button
            onClick={scrollToCourses}
            className="flex items-center justify-center gap-2 bg-[#38bdf8] text-[#0f172a] px-6 py-3 rounded-full font-semibold hover:bg-[#0ea5e9] hover:scale-105 transform transition-all duration-300"
          >
            Explore Courses <span className="animate-bounce">↓</span>
          </button>
        </div>
      </section>

      <section
        id="courses-section"
        ref={courseSectionRef}
        className="relative bg-[#1e293b] px-6 md:px-16 py-16"
      >
        <div className="bg-[#0f172a] rounded-2xl p-8 shadow-2xl border border-[#334155]">
          <h2 className="text-3xl font-bold mb-10 text-[#facc15] text-center">
            Explore Our Courses
          </h2>

          {courses.length === 0 ? (
            <p className="text-center text-gray-400">Loading courses...</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {courses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          )}
        </div>
      </section>
     
    </div>
  );
}
