const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Render the signup page.
exports.view_signup = asyncHandler(async (req, res, next) => {
    res.render('signup');
});

exports.register = asyncHandler(async (req, res, next) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    try {
        await User.register({ name: req.body.name, hash: hash });
    } catch (e) {
        if (e.code === 'SQLITE_CONSTRAINT' && e.errno === 19) {
            res.render('signup', { error: 'Username is already taken.' });
        } else {
            res.render('signup', { error: 'Unknown error occured.' });
        }
    }
    res.render('signup');
});

exports.view_login = asyncHandler(async (req, res, next) => {
    res.render('login');
});

exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findByName(req.body.name);

    if (user === undefined) {
        return res.send({ error: 'Cannot find user.' });
    }
    console.log(req.body);
    if (await bcrypt.compare(req.body.password, user.hash)) {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false, // @todo: obtain ssl certificate, serve over https, and set this to true
            sameSite: 'Strict',
            expires: new Date(Date.now() + 3600000),
        });
        return res.send({ token: token });
    } else {
        return res.send({ error: 'Access denied.' });
    }
});

exports.authenticate = asyncHandler(async (req, res, next) => {
    if (!req.cookies || !req.cookies.jwt) {
        req.user = null;
        next();
    } else {
        jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    }
});
