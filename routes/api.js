var express = require('express');
var router = express.Router();

// Require controller modules.
import courseController from '../controllers/courseController';
const deck_controller = require('../controllers/deckController');
import CardController from '../controllers/cardController';

// Creating a course
router.post('/courses', courseController.createCourse);

// Get decks for a course
router.get('/courses/:userName/:courseCode', courseController.getCourse);

// Create deck
router.post('/decks', deck_controller.createDeck);

// Get deck & cards
router.get('/decks/:userName/:courseCode/:deckPosition', deck_controller.viewDeck);

// Get cards to study
router.get('/decks/:userName/:courseCode/:deckPosition/study', deck_controller.studyDeck);

// Create card
router.post('/cards', CardController.createCard);

module.exports = router;
