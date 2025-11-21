import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updatePassword = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.old.value;
    const newPassword = e.target.new.value;
    try {
      await API.put("/users/password", { oldPassword, newPassword });
      e.target.reset();
    } catch (err) {
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-300">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-gray-700">
        <h2 className="text-4xl font-extrabold text-[#38bdf8] text-center mb-6">
          My Dashboard
        </h2>

        <div className="mb-6 text-center">
          <p className="text-xl font-semibold">{profile?.name || "User"}</p>
          <p className="text-gray-400">{profile?.email || "No email"}</p>
        </div>
        <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-1">
          Enrolled courses
        </h3>
        {profile.progress.map((item) => (
          <li
            key={item.course} 
            className="bg-gray-900/60 p-3 rounded-lg border border-gray-700 hover:border-[#38bdf8] transition-all"
          >
            <span className="font-semibold text-[#38bdf8]">
              {item?.course?.title || "Untitled Course"}
            </span>
          </li>
        ))}

        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-1">
            Change Password
          </h3>
          <form onSubmit={updatePassword} className="space-y-4">
            <input
              name="old"
              placeholder="Old password"
              type="password"
              className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:border-[#38bdf8] outline-none"
              required
            />
            <input
              name="new"
              placeholder="New password"
              type="password"
              className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:border-[#38bdf8] outline-none"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-lg transition-all duration-300"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
