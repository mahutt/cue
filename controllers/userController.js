const User = require('../models/user');
const Course = require('../models/course');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// View profile
exports.view_profile = asyncHandler(async (req, res, next) => {
    const name = req.params.name;
    const user = await User.findByName(name);
    const courses = await Course.allByUserId(user.id);

    const belongs = Boolean(req.user) && req.user.name === user.name;
    const otherUsers = await User.allExcept(name);
    res.render('profile', { user: user, courses: courses, belongs: belongs, users: otherUsers });
});

exports.allUsers = asyncHandler(async (req, res, _) => {
    // since users don't have a roles attribute, I hardcode my username for now
    if (!req.user || req.user.name !== 'mahutt') {
        return res.sendStatus(401);
    }
    const users = await User.all();
    res.send(users);
});

exports.allUserNames = asyncHandler(async (req, res, next) => {
    const users = await User.allNames();
    res.send(users);
});

exports.create_user = asyncHandler(async (req, res, _) => {
    try {
        // since users don't have a roles attribute, I hardcode my username for now
        if (!req.user || req.user.name !== 'mahutt') {
            return res.sendStatus(401);
        }

        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).send({ error: 'Name and password are required.' });
        }

        const hash = await bcrypt.hash(password, 10);
        try {
            await User.register({ name, hash });
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT' && e.errno === 19) {
                res.status(409).send({ error: 'Username already exists.' });
            } else {
                res.status(500).send({ error: 'Unknown error occurred.' });
            }
        }

        const newUser = await User.findByName(name);
        if (!newUser) {
            return res.status(500).send({ error: 'User creation failed.' });
        }

        res.status(201).send({ message: 'User created successfully.', user: { id: newUser.id, name: newUser.name } });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ error: 'An unexpected error occurred.' });
    }
});
