const User = require('../models/user');
const Course = require('../models/course');
const Deck = require('../models/deck');
const asyncHandler = require('express-async-handler');

// Display list of all courses.
exports.course_list = asyncHandler(async (req, res, next) => {
    const allCourses = await Course.all();
    res.render('course/index', { course_list: allCourses });
});

// Create a course.
exports.create_course = asyncHandler(async (req, res, next) => {
    const name = req.body.name.trim();
    const department = req.body.department.trim().toLowerCase();
    const number = parseInt(req.body.number.trim(), 10);
    const user_id = req.body.user_id;

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
    res.render('course/view', { course: course, decks: decks });
});

// Update a course
exports.update_course = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
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
    await Course.deleteById(id);
    res.sendStatus(200);
});
