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

exports.createDeck = asyncHandler(async (req, res, next) => {
    const { name, course_id } = req.body;

    const owner = await User.findByCourseId(course_id);
    if (!req.user || req.user.name !== owner.name) {
        return res.sendStatus(401);
    }

    const savedDeck = await Deck.save({ name, course_id });
    savedDeck.percentage = null;
    res.json({ deck: savedDeck });
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

exports.delete_deck_progress = asyncHandler(async (req, res, next) => {
    const deckId = req.params.id;
    if (!req.user) {
        return res.sendStatus(401);
    }

    await Deck.resetProgress({ userId: req.user.id, deckId });
    res.sendStatus(200);
});

exports.getStudyStack = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }

    const { userName, courseCode, deckPosition } = req.params;
    const department = courseCode.substring(0, 4);
    const number = courseCode.substring(4);

    const user = await User.findByName(userName);
    const course = await Course.find({ department, number, user_id: user.id });
    const deck = await Deck.find({ position: deckPosition, course_id: course.id });

    res.render('study', { deckId: deck.id });
});

exports.getStudyCards = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }

    const { id } = req.params;
    const criteria = { user_id: req.user.id, deck_id: id, limit: 10 }; // Hardcoded 10
    const cards = await Card.findWeakestByUserIdAndDeckId(criteria);

    res.send({ cards });
});

exports.get_score = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }
    const user_id = req.user.id;
    const deck_id = req.params.id;
    const percentage = await Deck.getPercentageByUserIdAndDeckId({ user_id, deck_id });
    res.send({ percentage });
});
