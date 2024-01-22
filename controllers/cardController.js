const Deck = require('../models/deck');
const Card = require('../models/card');

const asyncHandler = require('express-async-handler');

// Create a card.
exports.create_card = asyncHandler(async (req, res, next) => {
    const deck = req.body.deck;
    const question = req.body.question.trim();
    const answer = req.body.answer.trim();
    const index = await Card.countDocuments({
        deck: deck,
    });
    const newCard = new Card({ deck, index, question, answer });
    const savedCard = await newCard.save();
    res.redirect(`/decks/${deck}`);
});

// Read a card.
exports.read_card = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const card = await Card.findById(id);
    res.render('card/show', { card: card });
});

// Uppdate a card.
exports.update_card = asyncHandler(async (req, res, next) => {
    const id = req.body.id;
    const question = req.body.question.trim();
    const answer = req.body.answer.trim();
    const updatedCard = await Card.findOneAndUpdate(
        { _id: id },
        { $set: { question: question, answer: answer } },
        { new: true }
    );
    if (updatedCard) {
        res.redirect(`/decks/${updatedCard.deck}`);
    } else {
        throw new Error('Could not update card.');
    }
});
