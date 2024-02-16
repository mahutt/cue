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
    res.render('course/preview', { course: course });
});

exports.view_course = asyncHandler(async (req, res, next) => {
    const { userName, courseCode } = req.params;

    const department = courseCode.substring(0, 4);
    const number = courseCode.substring(4);
    const user = await User.findByName(userName);

    const course = await Course.find({ department, number, user_id: user.id });
    const decks = await Deck.allByCourseId(course.id);
    const belongs = Boolean(req.user) && req.user.name === user.name;
    res.render('course/view', { course: course, decks: decks, belongs: belongs });
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
