const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = asyncHandler(async (req, res, next) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    try {
        const user = await User.register({ name: req.body.name, hash: hash });
        const token = jwt.sign({ id: user.id, name: user.name }, process.env.ACCESS_TOKEN_SECRET);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            expires: new Date(Date.now() + 30 * 24 * 3600000),
        });
        res.status(201).json({ user: { id: user.id, name: user.name } });
    } catch (e) {
        if (e.code === 'SQLITE_CONSTRAINT' && e.errno === 19) {
            res.status(400).json({ error: 'Username is already taken.' });
        } else {
            res.status(500).json({ error: 'Unknown error occurred.' });
        }
    }
});

exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findByName(req.body.name);
    if (user === undefined) {
        return res.status(400).json({ error: 'Cannot find user.' });
    }
    if (await bcrypt.compare(req.body.password, user.hash)) {
        const token = jwt.sign({ id: user.id, name: user.name }, process.env.ACCESS_TOKEN_SECRET);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            expires: new Date(Date.now() + 30 * 24 * 3600000),
        });
        return res.json({ user: { id: user.id, name: user.name } });
    } else {
        return res.status(401).json({ error: 'Access denied.' });
    }
});

exports.logout = asyncHandler(async (req, res, next) => {
    res.clearCookie('jwt');
    res.sendStatus(200);
});

exports.authenticate = asyncHandler(async (req, res, next) => {
    if (!req.cookies || !req.cookies.jwt) {
        req.user = null;
        next();
    } else {
        jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: 'Invalid token' });
            req.user = user;
            next();
        });
    }
});

exports.getCurrentUser = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ user: { id: req.user.id, name: req.user.name } });
});
