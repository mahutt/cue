const Course = require('../models/course');
const Deck = require('../models/deck');
const Card = require('../models/card');

const asyncHandler = require('express-async-handler');

// Create a deck.
exports.create_deck = asyncHandler(async (req, res, next) => {
    const { course, name } = req.body;
    const newDeck = new Deck({ course, name });
    const savedDeck = await newDeck.save();
    res.redirect(`/courses/${course}`);
});

// Display a deck.
exports.show_deck = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const deck = await Deck.findById(id);
    const deckCards = await Card.find({ deck: id });

    res.render('deck/show', { deck: deck, cards: deckCards });
});
