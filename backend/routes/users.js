const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');

router.get('/me', auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('progress.course', 'title description');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/password', auth(), async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Old password incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/enroll/:courseId', auth(), async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id);
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (!user.progress) user.progress = [];
    const alreadyEnrolled = user.progress.some(
      (p) =>
        (p.course?._id?.toString() || p.course?.toString()) === course._id.toString()
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ msg: "Already enrolled" });
    }
    user.progress.push({
      course: course._id,
      completedLessons: []
    });
    await user.save();
    res.json({ msg: 'Enrolled successfully', course });
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
