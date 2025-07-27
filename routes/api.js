var express = require('express');
var router = express.Router();

// Require controller modules.
const course_controller = require('../controllers/courseController');
const deck_controller = require('../controllers/deckController');
const card_controller = require('../controllers/cardController');

// Creating a course
router.post('/courses', course_controller.createCourse);

// Get decks for a course
router.get('/courses/:userName/:courseCode', course_controller.getCourse);

// Create deck
router.post('/decks', deck_controller.createDeck);

// Get deck & cards
router.get('/decks/:userName/:courseCode/:deckPosition', deck_controller.viewDeck);

// Get cards to study
router.get('/decks/:userName/:courseCode/:deckPosition/study', deck_controller.studyDeck);

// Create card
router.post('/cards', card_controller.createCard);

module.exports = router;
