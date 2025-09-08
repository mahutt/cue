const User = require('../models/user');
const Course = require('../models/course');
const Deck = require('../models/deck');
const Card = require('../models/card');
const asyncHandler = require('express-async-handler');
const { extractDepartmentAndNumber } = require('./common');

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

// JSON endpoint to read a deck
exports.viewDeck = asyncHandler(async (req, res, next) => {
    const { userName, courseCode, deckPosition } = req.params;

    const { department, number } = extractDepartmentAndNumber(courseCode);

    const user = await User.findByName(userName);
    const course = await Course.find({ department, number, user_id: user.id });
    const deck = await Deck.find({ position: deckPosition, course_id: course.id });
    const cards = await Card.allByDeckId(deck.id);

    res.json({ deck: deck, cards: cards });
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

exports.getStudyCards = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }

    const { id } = req.params;
    const criteria = { user_id: req.user.id, deck_id: id, limit: 10 }; // Hardcoded 10
    const cards = await Card.findWeakestByUserIdAndDeckId(criteria);

    res.send({ cards });
});

exports.studyDeck = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }

    const { userName, courseCode, deckPosition } = req.params;
    const { department, number } = extractDepartmentAndNumber(courseCode);

    const user = await User.findByName(userName);
    const course = await Course.find({ department, number, user_id: user.id });
    const deck = await Deck.find({ position: deckPosition, course_id: course.id });

    const { id } = deck;
    const criteria = { user_id: req.user.id, deck_id: id, limit: 10 }; // Hardcoded 10
    const cards = await Card.findWeakestByUserIdAndDeckId(criteria);

    res.send({ cards, deckId: id });
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
