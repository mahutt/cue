var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const authController = require('./controllers/authController');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const decksRouter = require('./routes/decks');
const cardsRouter = require('./routes/cards');
const apiRouter = require('./routes/api');

var app = express();

require('dotenv').config();
require('./database/database');

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'cue-app-request'],
};
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-icons')));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Cue API' });
});

app.use(authController.authenticate);

app.use('/api', apiRouter);
app.use('/courses', coursesRouter);
app.use('/decks', decksRouter);
app.use('/cards', cardsRouter);
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({ error: err.message });
});

module.exports = app;
