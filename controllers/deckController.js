const User = require('../models/user');
const Course = require('../models/course');
const Deck = require('../models/deck');
const Card = require('../models/card');
const asyncHandler = require('express-async-handler');

// Create a deck.
exports.create_deck = asyncHandler(async (req, res, next) => {
    const { name, course_id } = req.body;

    const owner = await User.findByCourseId(course_id);
    if (!req.user || req.user.name !== owner.name) {
        return res.sendStatus(401);
    }

    const savedDeck = await Deck.save({ name, course_id });
    res.render('deck/preview', { deck: savedDeck });
});

// Read a deck
exports.view_deck = asyncHandler(async (req, res, next) => {
    const { userName, courseCode, deckPosition } = req.params;

    const department = courseCode.substring(0, 4);
    const number = courseCode.substring(4);

    const user = await User.findByName(userName);
    const course = await Course.find({ department, number, user_id: user.id });
    const deck = await Deck.find({ position: deckPosition, course_id: course.id });
    const cards = await Card.allByDeckId(deck.id);

    const belongs = Boolean(req.user) && req.user.name === user.name;
    res.render('deck/view', { deck: deck, cards: cards, belongs: belongs });
});

// Update a deck
exports.update_deck = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const owner = await User.findByDeckId(id);
    if (!req.user || req.user.name !== owner.name) {
        return res.sendStatus(401);
    }

    const name = req.body.name.trim();
    await Deck.updateById(id, { name });
    res.sendStatus(200);
});

// Delete a course
exports.delete_deck = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const owner = await User.findByDeckId(id);
    if (!req.user || req.user.name !== owner.name) {
        return res.sendStatus(401);
    }

    await Deck.deleteById(id);
    res.sendStatus(200);
});

// @todo: serve different cards based on logged in user
exports.study = asyncHandler(async (req, res, next) => {
    const { userName, courseCode, deckPosition } = req.params;

    const department = courseCode.substring(0, 4);
    const number = courseCode.substring(4);

    const user = await User.findByName(userName);
    const course = await Course.find({ department, number, user_id: user.id });
    const deck = await Deck.find({ position: deckPosition, course_id: course.id });
    console.log(deck);
    const cards = await Card.findWeakestByDeckId({ deck_id: deck.id, limit: 2 });

    console.log(cards.length);

    res.render('deck/study', { deck, cards });
});

// @todo:should only get score of currently signed in user
exports.get_score = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const score = await Deck.getScoreById(id);
    const percentage = (score / 2) * 100;
    res.send({ percentage });
});
