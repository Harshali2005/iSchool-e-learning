const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const auth = require("../middleware/auth");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        cb(null, Date.now() + "-" + sanitizedName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = {
        'video/mp4': 'mp4',
        'video/mpeg': 'mpeg',
        'video/quicktime': 'mov',
        'video/x-msvideo': 'avi',
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'text/plain': 'txt'
    };

    if (allowedTypes[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${Object.keys(allowedTypes).join(', ')}`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 
    }
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const validateLessonData = (title, type) => {
    const errors = [];

    if (!title || title.trim().length < 2) {
        errors.push("Title must be at least 2 characters long");
    }

    if (!type || !['video', 'text', 'file'].includes(type)) {
        errors.push("Type must be one of: video, text, file");
    }

    return errors;
};

router.post("/:courseId", auth("admin"), upload.single("file"), async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description } = req.body;

        if (!title || !req.file) {
            return res.status(400).json({ msg: "Lesson title and video file are required" });
        }
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ msg: "Course not found" });

        const uploaded = await cloudinary.uploader.upload(req.file.path, {
            folder: "elearning_lessons",
            resource_type: "video",
            quality: "auto:good",
            fetch_format: "mp4",
        });

        const videoUrl = uploaded.secure_url;
        fs.unlinkSync(req.file.path); 

        const lesson = new Lesson({
            title: title.trim(),
            type: "video",
            description: description ? description.trim() : "",
            order: course.lessons.length + 1,
            course: courseId,
            videoUrl,
        });

        await lesson.save();
        course.lessons.push(lesson._id);
        await course.save();

        res.status(201).json({
            success: true,
            msg: "Video lesson added successfully",
            lesson: {
                _id: lesson._id,
                title: lesson.title,
                type: lesson.type,
                description: lesson.description,
                videoUrl: lesson.videoUrl,
                order: lesson.order,
                createdAt: lesson.createdAt,
            },
        });
    } catch (err) {
        console.error("Error creating video lesson:", err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, msg: "Server error while creating lesson" });
    }
});

router.get("/course/:courseId", async (req, res) => {
    try {
        const { courseId } = req.params;
        const courseExists = await Course.exists({ _id: courseId });
        if (!courseExists) {
            return res.status(404).json({
                success: false,
                msg: "Course not found"
            });
        }

        const lessons = await Lesson.find({ course: courseId })
            .sort({ order: 1 })
            .select("title type description order textContent videoUrl fileUrl createdAt")
            .lean();

        res.json({
            success: true,
            lessons,
            count: lessons.length
        });

    } catch (err) {
        console.error("Error fetching lessons:", err);

        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: "Invalid course ID format"
            });
        }

        res.status(500).json({
            success: false,
            msg: "Server error while fetching lessons"
        });
    }
});

router.get("/:lessonId", async (req, res) => {
    try {
        const { lessonId } = req.params;

        const lesson = await Lesson.findById(lessonId)
            .select("title type description order textContent videoUrl fileUrl course createdAt")
            .populate('course', 'title description');

        if (!lesson) {
            return res.status(404).json({
                success: false,
                msg: "Lesson not found"
            });
        }

        res.json({
            success: true,
            lesson
        });

    } catch (err) {
        console.error("Error fetching lesson:", err);

        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: "Invalid lesson ID format"
            });
        }

        res.status(500).json({
            success: false,
            msg: "Server error while fetching lesson"
        });
    }
});

router.put("/:lessonId", auth("admin"), upload.single("file"), async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { title, type, textContent, description, order } = req.body;

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({
                success: false,
                msg: "Lesson not found"
            });
        }
        if (title || type) {
            const validationErrors = validateLessonData(title || lesson.title, type || lesson.type);
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    msg: "Validation failed",
                    errors: validationErrors
                });
            }
        }

        let updateData = {
            title: title ? title.trim() : lesson.title,
            type: type || lesson.type,
            description: description ? description.trim() : lesson.description,
            textContent: textContent !== undefined ? textContent : lesson.textContent,
            order: order || lesson.order,
        };

        if (req.file) {
            try {
                const uploadOptions = {
                    folder: "elearning_lessons",
                    resource_type: "auto",
                    quality: "auto",
                    fetch_format: "auto",
                };

                if (type === "video") {
                    uploadOptions.resource_type = "video";
                }

                const uploaded = await cloudinary.uploader.upload(req.file.path, uploadOptions);
                if (type === "video") {
                    updateData.videoUrl = uploaded.secure_url;
                    updateData.fileUrl = "";
                } else if (type === "file") {
                    updateData.fileUrl = uploaded.secure_url;
                    updateData.videoUrl = "";
                } else if (type === "text") {
                    updateData.videoUrl = "";
                    updateData.fileUrl = "";
                }
                fs.unlinkSync(req.file.path);
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(500).json({
                    success: false,
                    msg: "File upload failed"
                });
            }
        }

        const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            updateData,
            { new: true, runValidators: true }
        ).select("title type description order textContent videoUrl fileUrl createdAt");

        res.json({
            success: true,
            msg: "Lesson updated successfully",
            lesson: updatedLesson
        });

    } catch (err) {
        console.error("Error updating lesson:", err);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                msg: "Validation error",
                errors: Object.values(err.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            msg: "Server error while updating lesson"
        });
    }
});

router.delete("/:lessonId", auth("admin"), async (req, res) => {
    try {
        const { lessonId } = req.params;

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({
                success: false,
                msg: "Lesson not found"
            });
        }
        const courseId = lesson.course;

        await Course.findByIdAndUpdate(
            courseId,
            { $pull: { lessons: lessonId } }
        );

        await Lesson.findByIdAndDelete(lessonId);

        res.json({
            success: true,
            msg: "Lesson deleted successfully"
        });

    } catch (err) {
        console.error("Error deleting lesson:", err);

        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                msg: "Invalid lesson ID format"
            });
        }

        res.status(500).json({
            success: false,
            msg: "Server error while deleting lesson"
        });
    }
});

router.put("/:courseId/reorder", auth("admin"), async (req, res) => {
    try {
        const { courseId } = req.params;
        const { lessonOrder } = req.body;

        if (!lessonOrder || !Array.isArray(lessonOrder)) {
            return res.status(400).json({
                success: false,
                msg: "Lesson order array is required"
            });
        }

        const lessons = await Lesson.find({
            _id: { $in: lessonOrder },
            course: courseId
        });

        if (lessons.length !== lessonOrder.length) {
            return res.status(400).json({
                success: false,
                msg: "Some lessons do not belong to this course"
            });
        }

        const updatePromises = lessonOrder.map((lessonId, index) => {
            return Lesson.findByIdAndUpdate(
                lessonId,
                { order: index + 1 },
                { new: true }
            );
        });

        await Promise.all(updatePromises);

        res.json({
            success: true,
            msg: "Lessons reordered successfully"
        });

    } catch (err) {
        console.error("Error reordering lessons:", err);
        res.status(500).json({
            success: false,
            msg: "Server error while reordering lessons"
        });
    }
});

router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                msg: "File too large. Maximum size is 100MB"
            });
        }
    }

    if (error.message.includes('Invalid file type')) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }

    console.error("Unhandled error in lessons router:", error);
    res.status(500).json({
        success: false,
        msg: "Internal server error"
    });
});

module.exports = router;