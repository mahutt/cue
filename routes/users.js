var express = require('express');
var router = express.Router();

// Require controller modules.
const auth_controller = require('../controllers/authController');
const user_controller = require('../controllers/userController');
const course_controller = require('../controllers/courseController');
const deck_controller = require('../controllers/deckController');

router.get('/api/users', user_controller.allUsers); // all users and all their info, authenticated
router.post('/api/users', user_controller.create_user); // create a new user
router.get('/api/users/all', user_controller.allUserNames); // just user names, unauthenticated
router.get('/api/users/:name/courses', course_controller.getCoursesByUser);

// Reading a user.
router.get('/:name', user_controller.view_profile);

// Reading a course.
router.get('/:userName/:courseCode', course_controller.view_course);

// Reading a deck.
router.get('/:userName/:courseCode/:deckPosition', deck_controller.view_deck);

// Studying a deck.
router.get('/:userName/:courseCode/:deckPosition/study', deck_controller.getStudyStack);

module.exports = router;
