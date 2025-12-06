import * as User from '../models/user';
import * as Course from '../models/course';
import * as Deck from '../models/deck';
import * as Card from '../models/card';
import asyncHandler from 'express-async-handler';
import { extractDepartmentAndNumber } from './common';
import { AuthenticatedRequest } from './types';
import { Response } from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { parseReq } from './common/util';
import { transform } from 'jet-validators/utils';
import { isNumber, isString } from 'jet-validators';

const Validators = {
    viewDeck: parseReq({
        userName: transform(String, isString),
        courseCode: transform(String, isString),
        deckPosition: transform(Number, isNumber),
    }),
    updateDeckParams: parseReq({
        id: transform(Number, isNumber),
    }),
    updateDeckBody: parseReq({
        name: transform(String, isString),
    }),
    deleteDeck: parseReq({
        id: transform(Number, isNumber),
    }),
    deleteDeckProgress: parseReq({
        id: transform(Number, isNumber),
    }),
    getStudyCards: parseReq({
        id: transform(Number, isNumber),
    }),
    studyDeck: parseReq({
        userName: transform(String, isString),
        courseCode: transform(String, isString),
        deckPosition: transform(Number, isNumber),
    }),
    getScore: parseReq({
        id: transform(Number, isNumber),
    }),
} as const;

const createDeck = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { name, course_id } = req.body;

    const owner = await User.findByCourseId(course_id);
    if (!req.user || req.user.name !== owner.name) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    const savedDeck = await Deck.save({ name, course_id });
    savedDeck.percentage = null;
    res.json({ deck: savedDeck });
});

// JSON endpoint to read a deck
const viewDeck = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { userName, courseCode, deckPosition } = Validators.viewDeck(req.params);

    const result = extractDepartmentAndNumber(courseCode);
    if (!result) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST);
        return;
    }
    const { department, number } = result;

    const user = await User.findByName(userName);
    const course = await Course.find({ department, number, user_id: user.id });
    const deck = await Deck.find({ position: deckPosition, course_id: course.id });

    if (!deck) {
        res.sendStatus(HttpStatusCodes.NOT_FOUND);
        return;
    }

    const cards = await Card.allByDeckId(deck.id);
    res.json({ deck: deck, cards: cards });
});

// Update a deck
const update_deck = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = Validators.updateDeckParams(req.params);
    const owner = await User.findByDeckId(id);
    if (!req.user || req.user.name !== owner.name) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    const name = req.body.name.trim();
    await Deck.updateById(id, { name });
    res.sendStatus(HttpStatusCodes.OK);
});

// Delete a course
const delete_deck = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = Validators.deleteDeck(req.params);
    const owner = await User.findByDeckId(id);
    if (!req.user || req.user.name !== owner.name) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    await Deck.deleteById(id);
    res.sendStatus(HttpStatusCodes.OK);
});

const delete_deck_progress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id: deckId } = Validators.deleteDeckProgress(req.params);
    if (!req.user) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    await Deck.resetProgress({ userId: req.user.id, deckId });
    res.sendStatus(HttpStatusCodes.OK);
});

// TODO: revisit whether getStudyCards and studyDeck should be merged
const getStudyCards = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    const { id } = Validators.getStudyCards(req.params);
    const criteria = { user_id: req.user.id, deck_id: id, limit: 10 }; // Hardcoded 10
    const cards = await Card.findWeakestByUserIdAndDeckId(criteria);

    res.send({ cards });
});

const studyDeck = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    const { userName, courseCode, deckPosition } = Validators.studyDeck(req.params);

    const result = extractDepartmentAndNumber(courseCode);
    if (!result) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST);
        return;
    }
    const { department, number } = result;

    const user = await User.findByName(userName);
    const course = await Course.find({ department, number, user_id: user.id });
    const deck = await Deck.find({ position: deckPosition, course_id: course.id });

    if (!deck) {
        res.sendStatus(HttpStatusCodes.NOT_FOUND);
        return;
    }

    const { id } = deck;
    const criteria = { user_id: req.user.id, deck_id: id, limit: 10 }; // Hardcoded 10
    const cards = await Card.findWeakestByUserIdAndDeckId(criteria);

    res.send({ cards, deckId: id });
});

const get_score = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }
    const user_id = req.user.id;
    const { id: deck_id } = Validators.getScore(req.params);
    const percentage = await Deck.getPercentageByUserIdAndDeckId({ user_id, deck_id });
    res.send({ percentage });
});

export default {
    createDeck,
    viewDeck,
    update_deck,
    delete_deck,
    delete_deck_progress,
    getStudyCards,
    studyDeck,
    get_score,
};
