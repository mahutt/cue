var express = require('express');
var router = express.Router();

// Require controller modules.
const card_controller = require('../controllers/cardController');

// Creating a deck.
router.post('/', card_controller.create_card);

module.exports = router;
