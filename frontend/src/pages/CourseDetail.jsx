import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from '../services/api';

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [completedLessonIds, setCompletedLessonIds] = useState([]);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/me');
      setProfile(res.data);
      const progressEntry = res.data.progress?.find(p => (p.course?._id || p.course) === courseId);
      setCompletedLessonIds(progressEntry?.completedLessons || []);
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  useEffect(() => {
    if (profile?.progress) {
      const isEnrolled = profile.progress.some((p) => (p.course?._id || p.course) === courseId);
      setEnrolled(isEnrolled);
    }
  }, [profile, courseId]);

  const loadCourse = async () => {
    try {
      const res = await API.get(`/courses/${courseId}`);
      setCourse(res.data);
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    loadCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await API.post(`/users/enroll/${courseId}`);
      if (res.data.course) {
        alert("Enrolled successfully!");
        fetchProfile();
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Enrollment failed");
    }
  };

  const handleVideoClick = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentVideoUrl(lesson.videoUrl);
    setVideoError(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setSelectedLesson(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">Loading course...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">Course not found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 pt-16">
      <div className="flex-grow w-full max-w-6xl mx-auto p-6">

        <div className="bg-gray-800 rounded-xl shadow p-6 mb-8 border border-gray-700 flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-3">{course.title}</h1>
            <p className="text-gray-300">{course.description}</p>
          </div>
          <div className="flex-shrink-0">
            {!enrolled ? (
              <button onClick={handleEnroll} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                Enroll Now
              </button>
            ) : (
              <div className="px-8 py-3 bg-green-700 text-white font-semibold rounded-lg">Enrolled</div>
            )}
          </div>
        </div>

        {enrolled ? (
          lessons.length ? (
            <div className="space-y-4">
              {lessons.map((lesson, index) => {
                const completed = completedLessonIds.includes(lesson._id);
                return (
                  <div key={lesson._id} className={`bg-gray-800 rounded-xl p-5 border ${completed ? "border-green-500" : "border-gray-700"} flex flex-col gap-3 transition hover:shadow-lg`}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-white">
                        {index + 1}. {lesson.title} {completed && <span className="text-green-400">✓ Completed</span>}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${lesson.type === "video" ? "bg-blue-900 text-blue-300" : lesson.type === "file" ? "bg-green-900 text-green-300" : "bg-purple-900 text-purple-300"}`}>
                        {lesson.type.toUpperCase()}
                      </span>
                    </div>

                    {lesson.type === "video" && lesson.videoUrl && (
                      <button
                        onClick={() => handleVideoClick(lesson)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition transform duration-300 font-semibold"
                      >
                        ▶ Play Video
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-6">No lessons yet.</p>
          )
        ) : (
          <p className="text-gray-400 text-center mt-6">Enroll to access lessons.</p>
        )}
      </div>

      {selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4" onClick={handleBackdropClick}>
          <div className="relative w-full max-w-5xl bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">{selectedLesson.title}</h3>
              <button onClick={() => setSelectedLesson(null)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Close</button>
            </div>
            <video ref={videoRef} src={currentVideoUrl} controls autoPlay className="w-full max-h-[75vh] rounded-lg" onError={() => setVideoError(true)} />
            {videoError && <div className="text-red-400 mt-2">Failed to load video.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
