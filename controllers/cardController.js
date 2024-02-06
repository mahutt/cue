const User = require('../models/user');
const Course = require('../models/course');
const Deck = require('../models/deck');
const Card = require('../models/card');
const asyncHandler = require('express-async-handler');

// Display list of all decks.
exports.course_list = asyncHandler(async (req, res, next) => {
    const allDecks = await Deck.allByCourseId();
    res.render('course/index', { course_list: allCourses });
});

// Create a card
exports.create_card = asyncHandler(async (req, res, next) => {
    const { front, back, deck_id } = req.body;
    const savedDeck = await Card.save({ front, back, deck_id });
    res.render('card/preview', { card: savedDeck });
});

// Read a deck
exports.view_deck = asyncHandler(async (req, res, next) => {
    const { userName, courseCode, deckPosition } = req.params;

    const department = courseCode.substring(0, 4);
    const number = courseCode.substring(4);

    const user = await User.findByName(userName);
    console.log(user);
    const course = await Course.find({ department, number, user_id: user.id });
    console.log(course);
    const deck = await Deck.find({ position: deckPosition, course_id: course.id });
    console.log(deckPosition);
    console.log(deck);
    res.render('deck/view', { deck: deck, cards: [] });
});

// Update a course
exports.update_card = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const front = req.body.front.trim();
    const back = req.body.back.trim();

    await Card.updateById({ id, front, back });
    res.sendStatus(200);
});

// Delete a course
exports.delete_card = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    await Card.deleteById(id);
    res.sendStatus(200);
});
