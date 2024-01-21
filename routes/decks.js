var express = require('express');
var router = express.Router();

// Require controller modules.
const deck_controller = require('../controllers/deckController');

// Creating a deck.
router.post('/', deck_controller.create_deck);

// Viewing a deck.
router.get('/:id', deck_controller.show_deck);

module.exports = router;
