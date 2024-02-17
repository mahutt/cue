var express = require('express');
var router = express.Router();

// Require controller modules.
const auth_controller = require('../controllers/authController');
const user_controller = require('../controllers/userController');
const course_controller = require('../controllers/courseController');
const deck_controller = require('../controllers/deckController');

// Reading a user.
router.get('/:name', auth_controller.authenticate, user_controller.view_profile);

// Reading a course.
router.get('/:userName/:courseCode', auth_controller.authenticate, course_controller.view_course);

// Reading a deck.
router.get('/:userName/:courseCode/:deckPosition', auth_controller.authenticate, deck_controller.view_deck);

// Studying a deck.
router.get('/:userName/:courseCode/:deckPosition/study', auth_controller.authenticate, deck_controller.study);

module.exports = router;
