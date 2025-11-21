import React from "react";

export default function About() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-gray-100 px-4">
            <div className="max-w-2xl w-full bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-gray-700 text-center transform transition-all duration-500 hover:scale-[1.02] hover:shadow-blue-500/20">
                <h2 className="text-4xl font-extrabold text-[#38bdf8] mb-4">
                    About ISchool
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                    Welcome to <span className="font-semibold text-[#facc15]">ISchool</span> — your
                    modern e-learning platform designed to empower students and
                    professionals worldwide. Our mission is to make education accessible,
                    engaging, and skill-oriented.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                    With ISchool, you can explore trending technologies, enroll in
                    high-quality interactive courses, and track your learning progress
                    through personalized dashboards. Whether you’re a beginner or a
                    seasoned learner, our AI-driven platform helps you master skills at
                    your own pace.
                </p>
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                    <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700 hover:border-[#38bdf8] transition-all duration-300">
                        <h3 className="text-xl font-semibold text-[#38bdf8] mb-2">
                            📚 Interactive Courses
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Learn with quizzes, videos, and real-world projects designed to
                            strengthen your knowledge.
                        </p>
                    </div>
                    <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700 hover:border-[#38bdf8] transition-all duration-300">
                        <h3 className="text-xl font-semibold text-[#38bdf8] mb-2">
                            🚀 Career-Oriented Learning
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Build in-demand skills to advance your career with practical,
                            hands-on learning experiences.
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-gray-400 text-sm italic">
                    “Education is not the learning of facts, but the training of the mind to think.” — Albert Einstein
                </p>
            </div>
        </div>
    );
}
