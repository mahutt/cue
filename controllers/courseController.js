const Course = require('../models/course');
const Deck = require('../models/deck');
const asyncHandler = require('express-async-handler');

// Display list of all users.
exports.course_list = asyncHandler(async (req, res, next) => {
    const allCourses = await Course.find({}, '_id name');
    res.render('course/index', { course_list: allCourses });
});

// Create a course.
exports.create_course = asyncHandler(async (req, res, next) => {
    const { name, department, number } = req.body;
    const newCourse = new Course({ name, department, number });
    const savedCourse = await newCourse.save();
    res.redirect('/courses');
});

// Display a course
exports.show_course = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const course = await Course.findById(id);
    const courseDecks = await Deck.find({ course: id });

    res.render('course/show', { course: course, decks: courseDecks });
});
