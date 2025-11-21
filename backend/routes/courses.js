const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const User = require("../models/User");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("lessons");
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth("admin"), upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title & description required" });
    }

    let imageUrl = "";

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "elearning_course_images",
      });

      imageUrl = uploaded.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const course = new Course({
      title,
      description,
      image: imageUrl,
    });

    await course.save();

    return res.status(201).json({
      msg: "Course created successfully",
      course,
    });

  } catch (err) {
    console.error("Error creating course:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("lessons");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/enroll", auth, async (req, res) => {
  try {
    console.log('Starting enrollment process...');

    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const result = await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { enrolledCourses: req.params.id } }
    );

    if (result.modifiedCount === 0) {
      const user = await User.findById(req.user.id).select('enrolledCourses');
      if (user.enrolledCourses.includes(req.params.id)) {
        return res.json({
          message: "Already enrolled in this course",
          success: true
        });
      }
      return res.status(400).json({ message: "Enrollment failed" });
    }

    console.log('Enrollment completed successfully');

    res.json({
      message: "Successfully enrolled in course!",
      success: true
    });

  } catch (error) {
    console.error("Enrollment error:", error);
  }
});

router.get("/:id/enroll/status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('enrolledCourses');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isEnrolled = user.enrolledCourses.includes(req.params.id);
    res.json({ enrolled: isEnrolled });

  } catch (error) {
    console.error("Error checking enrollment status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/:id/lessons",
  auth("admin"),
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, type, textContent, description } = req.body;

      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ msg: "Course not found" });

      let videoUrl = "";
      let fileUrl = "";
      if (req.file) {
        const uploaded = await cloudinary.uploader.upload(req.file.path, {
          folder: "elearning_lessons",
          resource_type: "auto",
        });

        if (type === "video") videoUrl = uploaded.secure_url;
        if (type === "file") fileUrl = uploaded.secure_url;

        fs.unlinkSync(req.file.path); 
      }
      const lesson = new Lesson({
        title,
        type,
        description,
        order: course.lessons.length + 1,
        course: course._id,
        textContent: type === "text" ? textContent : "",
        videoUrl,
        fileUrl,
      });

      await lesson.save();
      course.lessons.push(lesson._id);
      await course.save();

      res.status(201).json({ msg: "Lesson added successfully", lesson });
    } catch (err) {
      console.error("Error adding lesson:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.delete("/:id", auth("admin"), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    await User.updateMany(
      { enrolledCourses: req.params.id },
      { $pull: { enrolledCourses: req.params.id } }
    );

    res.json({ msg: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;