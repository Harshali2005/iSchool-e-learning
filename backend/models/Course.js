const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  createdAt: { type: Date, default: Date.now },
  category: String,
  level: String,
  duration: String
});

module.exports = mongoose.model('Course', CourseSchema);
