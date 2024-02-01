var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const decksRouter = require('./routes/decks');
const cardsRouter = require('./routes/cards');

var app = express();

// mongoose connection setup
const config = require('./config');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = config.mongoDB;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

require('./database/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/courses', coursesRouter);
app.use('/decks', decksRouter);
app.use('/cards', cardsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
