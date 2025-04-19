const User = require('../models/user');
const Course = require('../models/course');
const Deck = require('../models/deck');
const asyncHandler = require('express-async-handler');

// Create a course.
exports.create_course = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }

    const name = req.body.name.trim();
    const department = req.body.department.trim().toLowerCase();
    const number = parseInt(req.body.number.trim(), 10);
    const user_id = req.user.id;

    const course = { name, department, number, user_id };
    await Course.save(course);

    course.code = `${department}${number}`;
    res.render('course/preview', { username: req.user.name, course: course });
});

// JSON API for creating a course
exports.createCourse = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }

    const name = req.body.name.trim();
    const department = req.body.department.trim().toLowerCase();
    const number = parseInt(req.body.number.trim(), 10);
    const user_id = req.user.id;

    const course = { name, department, number, user_id };
    await Course.save(course);

    course.code = `${department}${number}`;
    course.id = await Course.getIdByDepartmentAndNumber(department, number);

    res.json({ course: course });
});

exports.view_course = asyncHandler(async (req, res, next) => {
    const { userName, courseCode } = req.params;

    const department = courseCode.substring(0, 4);
    const number = courseCode.substring(4);
    const user = await User.findByName(userName);

    const course = await Course.find({ department, number, user_id: user.id });
    const decks = await Deck.allByCourseId(course.id);

    if (req.user) {
        await Promise.all(
            decks.map(async (deck) => {
                const percentage = await Deck.getPercentageByUserIdAndDeckId({
                    user_id: req.user.id,
                    deck_id: deck.id,
                });
                deck.percentage = percentage;
            })
        );
    }

    const belongs = Boolean(req.user) && req.user.name === user.name;
    res.render('course/view', { course: course, decks: decks, belongs: belongs });
});

// JSON API for viewing a course
exports.getCourse = asyncHandler(async (req, res, next) => {
    const { userName, courseCode } = req.params;
    const department = courseCode.substring(0, 4);
    const number = courseCode.substring(4);
    const user = await User.findByName(userName);

    const course = await Course.find({ department, number, user_id: user.id });
    const decks = await Deck.allByCourseId(course.id);

    if (req.user) {
        await Promise.all(
            decks.map(async (deck) => {
                const percentage = await Deck.getPercentageByUserIdAndDeckId({
                    user_id: req.user.id,
                    deck_id: deck.id,
                });
                deck.percentage = percentage;
            })
        );
    }
    res.json({ course, decks });
});

// Update a course
exports.update_course = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const owner = await User.findByCourseId(id);
    if (!req.user || req.user.name !== owner.name) {
        return res.sendStatus(401);
    }

    const name = req.body.name;
    const code = req.body.code.toLowerCase().replace(/\s/g, '');
    const department = code.substring(0, 4);
    const number = code.substring(4);

    await Course.updateById(id, { name, department, number });
    res.send(code);
});

// Delete a course
exports.delete_course = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const owner = await User.findByCourseId(id);
    if (!req.user || req.user.name !== owner.name) {
        return res.sendStatus(401);
    }

    await Course.deleteById(id);
    res.sendStatus(200);
});

exports.getCoursesByUser = asyncHandler(async (req, res, next) => {
    const { name } = req.params;
    const user = await User.findByName(name);
    if (!user) {
        return res.sendStatus(404);
    }

    const courses = await Course.allByUserId(user.id);
    res.json(courses);
});
