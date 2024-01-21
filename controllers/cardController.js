const Deck = require('../models/deck');
const Card = require('../models/card');

const asyncHandler = require('express-async-handler');

// Create a card.
exports.create_card = asyncHandler(async (req, res, next) => {
    const { deck, question, answer } = req.body;
    const index = await Card.countDocuments({
        deck: deck,
    });
    const newCard = new Card({ deck, index, question, answer });
    const savedCard = await newCard.save();
    res.redirect(`/decks/${deck}`);
});

// @todo commit current status
