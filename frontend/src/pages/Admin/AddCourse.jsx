
import React, { useState } from "react";
import API from "../../services/api";

export default function AddCourse() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [uploading, setUploading] = useState(false);

    const addLesson = () => {
        setLessons([...lessons, { title: "", file: null }]);
    };

    const handleLessonChange = (index, key, value) => {
        const updated = [...lessons];
        updated[index][key] = value;
        setLessons(updated);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const createCourse = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", desc);
            if (image) formData.append("image", image);

            const courseRes = await API.post("/courses", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const courseId = courseRes.data.course._id;

            for (let i = 0; i < lessons.length; i++) {
                const lesson = lessons[i];
                const lessonForm = new FormData();
                lessonForm.append("title", lesson.title);
                lessonForm.append("type", "video"); 
                if (lesson.file) lessonForm.append("file", lesson.file);

                await API.post(`/courses/${courseId}/lessons`, lessonForm, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            alert("✅ Course and video lessons created successfully!");
            setTitle("");
            setDesc("");
            setImage(null);
            setPreview(null);
            setLessons([]);
        } catch (err) {
            console.error("Error creating course:", err);
            alert(
                err.response?.data?.msg ||
                JSON.stringify(err.response?.data) ||
                err.message ||
                "Error creating course"
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-gray-900/50 p-6 rounded-lg border border-gray-700 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-[#38bdf8] mb-8">
                ➕ Add New Course
            </h2>

            <form className="space-y-6" onSubmit={createCourse}>

                <div>
                    <label className="block text-sm mb-1 font-medium text-gray-200">
                        Course Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter course title"
                        required
                        className="w-full p-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-[#38bdf8] outline-none text-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1 font-medium text-gray-200">
                        Course Description
                    </label>
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Enter course description"
                        required
                        rows="3"
                        className="w-full p-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-[#38bdf8] outline-none text-gray-100"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm mb-1 font-medium text-gray-200">
                        Course Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#38bdf8] file:text-white hover:file:bg-[#0ea5e9]"
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-3 rounded-lg w-64 h-40 object-cover border border-gray-700"
                        />
                    )}
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-3 text-[#38bdf8]">Video Lessons</h3>
                    {lessons.map((lesson, index) => (
                        <div
                            key={index}
                            className="mb-4 p-4 bg-gray-800/70 border border-gray-700 rounded-lg flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-100">
                                    Lesson {index + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setLessons(lessons.filter((_, i) => i !== index))
                                    }
                                    className="text-red-400 hover:text-red-600 font-semibold"
                                >
                                    Remove
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder="Lesson Title"
                                value={lesson.title}
                                onChange={(e) =>
                                    handleLessonChange(index, "title", e.target.value)
                                }
                                required
                                className="w-full p-2 rounded bg-gray-900/70 border border-gray-700 text-gray-100 focus:border-[#38bdf8] outline-none"
                            />

                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                    handleLessonChange(index, "file", e.target.files[0])
                                }
                                className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#38bdf8] file:text-white hover:file:bg-[#0ea5e9]"
                                required
                            />
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addLesson}
                        className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300"
                    >
                        ➕ Add Video Lesson
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-lg transition-all duration-300"
                >
                    {uploading ? "Uploading..." : "Create Course"}
                </button>
            </form>
        </div>
    );
}
