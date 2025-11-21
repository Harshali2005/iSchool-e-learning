import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login({setUser}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      setUser(res.data.user);

      setStatus("✅ Login successful! Redirecting...");
      console.log(res.data.user.role);

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin");       
        } else {
          navigate("/");           
        }
      }, 1000);
    } catch (err) {
      setStatus("❌ " + (err.response?.data?.msg || "Invalid credentials"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-gray-100 px-4">
      <div className="max-w-md w-full bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-gray-700">
        <h2 className="text-4xl font-extrabold text-center text-[#38bdf8] mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-300 mb-8">
          Please sign in to access your courses and dashboard.
        </p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:border-[#38bdf8] outline-none text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:border-[#38bdf8] outline-none text-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-lg transition-all duration-300"
          >
            Login
          </button>
        </form>

        {status && (
          <p
            className={`mt-4 text-center font-medium ${status.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
          >
            {status}
          </p>
        )}

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Don’t have an account?{" "}
            <Link 
              to="/register"
              className="text-[#38bdf8] hover:underline hover:text-[#0ea5e9]"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
