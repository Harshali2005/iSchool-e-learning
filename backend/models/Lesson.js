const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ["video", "text", "file"], required: true },
  order: Number,
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  textContent: String,
  videoUrl: String,
  fileUrl: String,
});

module.exports = mongoose.model("Lesson", LessonSchema);
