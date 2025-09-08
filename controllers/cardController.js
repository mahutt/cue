const User = require('../models/user');
const Course = require('../models/course');
const Deck = require('../models/deck');
const Card = require('../models/card');
const Score = require('../models/score');
const asyncHandler = require('express-async-handler');

// JSON version of create_card
exports.createCard = asyncHandler(async (req, res, next) => {
    const deck_id = req.body.deck_id;

    const owner = await User.findByDeckId(deck_id);
    if (!req.user || req.user.name !== owner.name) {
        return res.sendStatus(401);
    }

    const front = req.body.front.trim();
    const back = req.body.back.trim();

    const savedCard = await Card.save({ front, back, deck_id });
    res.json({ card: savedCard });
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
    const updatedCard = await Card.findById(id);
    res.json({ card: updatedCard });
});

exports.update_score = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }

        const user_id = req.user.id;
        const card_id = req.params.id;
        const score = req.body.score;
        await Score.save({ score, user_id, card_id });

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
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
