import express from 'express';
const router = express.Router();

// Require controller modules.
import courseController from '../controllers/courseController';
import deckController from '../controllers/deckController';
import CardController from '../controllers/cardController';

// Creating a course
router.post('/courses', courseController.createCourse);

// Get decks for a course
router.get('/courses/:userName/:courseCode', courseController.getCourse);

// Create deck
router.post('/decks', deckController.createDeck);

// Get deck & cards
router.get('/decks/:userName/:courseCode/:deckPosition', deckController.viewDeck);

// Get cards to study
router.get('/decks/:userName/:courseCode/:deckPosition/study', deckController.studyDeck);

// Create card
router.post('/cards', CardController.createCard);

export default router;
