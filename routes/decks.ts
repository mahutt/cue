import express from 'express';
const router = express.Router();

// Require controller modules.
import deckController from '../controllers/deckController';

// Updating a deck.
router.patch('/:id', deckController.update_deck);

// deleting a deck.
router.delete('/:id', deckController.delete_deck);

// Reseting a deck's progress.
router.delete('/:id/progress', deckController.delete_deck_progress);

// getting a deck score.
router.get('/:id/score', deckController.get_score);

// getting cards from a deck to study
router.get('/:id/study', deckController.getStudyCards);

module.exports = router;
