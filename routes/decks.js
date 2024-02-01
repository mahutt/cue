var express = require('express');
var router = express.Router();

// Require controller modules.
const deck_controller = require('../controllers/deckController');

// Creating a deck.
router.post('/', deck_controller.create_deck);

// Updating a deck.
router.patch('/:id', deck_controller.update_deck);

// deleting a deck.
router.delete('/:id', deck_controller.delete_deck);

module.exports = router;
