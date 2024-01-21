var express = require('express');
var router = express.Router();

// Require controller modules.
const course_controller = require('../controllers/courseController');

// Listing all courses.
router.get('/', course_controller.course_list);

// Creating a course.
router.post('/', course_controller.create_course);

// Viewing a course.
router.get('/:id', course_controller.show_course);

module.exports = router;
