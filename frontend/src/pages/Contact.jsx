import React, { useState } from "react";
import API from "../services/api";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState("");

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/contact", formData);
            setStatus("✅ Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            setStatus("❌ Failed to send message. Try again later.");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-gray-100 px-4">
            <div className="max-w-lg w-full bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.2)] p-10 border border-gray-700 transition-all duration-500 hover:shadow-[0_0_60px_rgba(56,189,248,0.4)] animate-fadeIn">
                <h2 className="text-4xl font-extrabold text-[#38bdf8] mb-4 text-center">
                    Contact Us
                </h2>
                <p className="text-center text-gray-300 mb-6">
                    We'd love to hear from you! Fill out the form below and our team will
                    get back to you soon.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-[#38bdf8] outline-none text-gray-100 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-[#38bdf8] outline-none text-gray-100 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                            name="message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-[#38bdf8] outline-none text-gray-100 transition-all"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Send Message
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

                <div className="text-center mt-8 text-sm text-gray-400">
                    <p>Email: support@ischool.example</p>
                    <p>Contact: +91 98765 43210</p>
                </div>
            </div>
        </div>
    );
}
