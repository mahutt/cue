var express = require('express');
var router = express.Router();

// Require controller modules.
const course_controller = require('../controllers/courseController');

// Creating a course.
router.post('/courses', course_controller.createCourse);

module.exports = router;
