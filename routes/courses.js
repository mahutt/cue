var express = require('express');
var router = express.Router();

// Require controller modules.
const auth_controller = require('../controllers/authController');
const course_controller = require('../controllers/courseController');

// Creating a course.
router.post('/', auth_controller.authenticate, course_controller.create_course);

// Updating a course.
router.patch('/:id', auth_controller.authenticate, course_controller.update_course);

// deleting a course.
router.delete('/:id', auth_controller.authenticate, course_controller.delete_course);

module.exports = router;
