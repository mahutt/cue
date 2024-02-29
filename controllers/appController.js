const User = require('../models/user');
const Course = require('../models/course');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.serve = asyncHandler(async (req, res, next) => {
    if (req.method !== 'GET' || req.headers['cue-app-request'] === 'true') {
        next();
    } else {
        let navbar;
        if (req.user) {
            const name = req.user.name;
            const user = await User.findByName(name);
            const courses = await Course.allByUserId(user.id);
            const otherUsers = await User.allExcept(name);
            navbar = { name, courses, otherUsers };
        } else {
            const allUsers = await User.allNames();
            navbar = { allUsers };
        }
        res.render('app', { navbar: navbar, url: req.originalUrl });
    }
});
