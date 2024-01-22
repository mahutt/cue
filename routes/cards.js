var express = require('express');
var router = express.Router();

// Require controller modules.
const card_controller = require('../controllers/cardController');

// Creating a card.
router.post('/', card_controller.create_card);

// Reading a card.
router.get('/:id', card_controller.read_card);

// Updating a card.
router.post('/update', card_controller.update_card);

module.exports = router;
