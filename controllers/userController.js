const User = require('../models/user');
const Course = require('../models/course');
const asyncHandler = require('express-async-handler');

// View profile
exports.view_profile = asyncHandler(async (req, res, next) => {
    const name = req.params.name;
    const user = await User.findByName(name);
    const courses = await Course.allByUserId(user.id);

    const belongs = Boolean(req.user) && req.user.name === user.name;
    const otherUsers = await User.allExcept(name);
    res.render('profile', { user: user, courses: courses, belongs: belongs, users: otherUsers });
});

exports.allUsers = asyncHandler(async (req, res, next) => {
    const users = await User.allNames();
    res.send(users);
});
