import createError from 'http-errors';
import express, { NextFunction, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import authController from './controllers/authController';

import authRouter from './routes/auth';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import coursesRouter from './routes/courses';
import decksRouter from './routes/decks';
import cardsRouter from './routes/cards';
import apiRouter from './routes/api';
import messagesRouter from './routes/messages';
import { AuthenticatedRequest } from './controllers/types';
import HttpStatusCodes from './constants/HttpStatusCodes';

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

app.get('/', (_, res) => {
    res.json({ message: 'Welcome to the Cue API' });
});

app.use(authController.authenticate);

app.use('/api', apiRouter);
app.use('/courses', coursesRouter);
app.use('/decks', decksRouter);
app.use('/cards', cardsRouter);
app.use('/messages', messagesRouter);
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err: any, req: AuthenticatedRequest, res: Response, _: NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || HttpStatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ error: err.message });
});

export default app;
