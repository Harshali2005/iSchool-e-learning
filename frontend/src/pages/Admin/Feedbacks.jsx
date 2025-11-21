
import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function Feedbacks() {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        API.get("/contact")
            .then((res) => setFeedback(res.data))
            .catch(console.error);
    }, []);

    const deleteFeedback = async (id) => {
        await API.delete(`/contact/${id}`);
        API.get("/contact").then(res => setFeedback(res.data));
    };

    return (
        <div className="min-h-screen p-6 bg-gray-900">
            <h2 className="text-2xl font-bold text-[#38bdf8] mb-6">📝 User Feedback</h2>
            {feedback.length ? (
                <div className="space-y-4">
                    {feedback.map((msg) => (
                        <div
                            key={msg._id}
                            className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 shadow hover:shadow-[#38bdf8]/20 transition"
                        >
                            <p className="text-white">
                                <strong className="text-[#38bdf8]">Name:</strong> {msg.name}
                            </p>
                            <p className="text-white">
                                <strong className="text-[#38bdf8]">Email:</strong> {msg.email}
                            </p>
                            <p className="text-white">
                                <strong className="text-[#38bdf8]">Message:</strong> {msg.message}
                            </p>

                            <button
                                onClick={() => deleteFeedback(msg._id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg mt-2"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No feedback messages.</p>
            )}
        </div>
    );
}
