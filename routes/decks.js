var express = require('express');
var router = express.Router();

// Require controller modules.
const auth_controller = require('../controllers/authController');
const deck_controller = require('../controllers/deckController');

// Updating a deck.
router.patch('/:id', deck_controller.update_deck);

// deleting a deck.
router.delete('/:id', deck_controller.delete_deck);

// Reseting a deck's progress.
router.delete('/:id/progress', deck_controller.delete_deck_progress);

// getting a deck score.
router.get('/:id/score', deck_controller.get_score);

// getting cards from a deck to study
router.get('/:id/study', deck_controller.getStudyCards);

module.exports = router;
