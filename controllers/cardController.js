const User = require('../models/user');
const Course = require('../models/course');
const Deck = require('../models/deck');
const Card = require('../models/card');
const asyncHandler = require('express-async-handler');

// Create a card
exports.create_card = asyncHandler(async (req, res, next) => {
    const { front, back, deck_id } = req.body;

    const owner = await User.findByDeckId(deck_id);
    if (!req.user || req.user.name !== owner.name) {
        return res.sendStatus(401);
    }

    const savedCard = await Card.save({ front, back, deck_id });
    res.render('card/preview', { card: savedCard });
});

// Update a course
exports.update_card = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const owner = await User.findByCardId(id);
    if (!req.user || req.user.name !== owner.name) {
        return res.sendStatus(401);
    }

    const front = req.body.front.trim();
    const back = req.body.back.trim();

    await Card.updateById({ id, front, back });
    res.sendStatus(200);
});

// Delete a course
exports.delete_card = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const owner = await User.findByCardId(id);
    if (!req.user || req.user.name !== owner.name) {
        return res.sendStatus(401);
    }

    await Card.deleteById(id);
    res.sendStatus(200);
});
