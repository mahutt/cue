var express = require('express');
var router = express.Router();

// Require controller modules.
const auth_controller = require('../controllers/authController');
const card_controller = require('../controllers/cardController');

// Creating a card.
router.post('/', auth_controller.authenticate, card_controller.create_card);

// Updating a card.
router.patch('/:id', auth_controller.authenticate, card_controller.update_card);

// Updating a card's score.
router.put('/:id', auth_controller.authenticate, card_controller.update_score);

// deleting a card.
router.delete('/:id', auth_controller.authenticate, card_controller.delete_card);

module.exports = router;
