import { transform } from 'jet-validators/utils';
import { parseReq } from './common/util';
import { isNumber, isString } from 'jet-validators';

import * as User from '../models/user';
import * as Card from '../models/card';
import * as Score from '../models/score';
import { AuthenticatedRequest } from './types';
import { Response } from 'express';

import asyncHandler from 'express-async-handler';
import HttpStatusCodes from '../constants/HttpStatusCodes';

const Validators = {
    createCard: parseReq({
        deck_id: transform(Number, isNumber),
        front: transform(String, isString),
        back: transform(String, isString),
    }),
    updateCard: parseReq({
        front: transform(String, isString),
        back: transform(String, isString),
    }),
    deleteCard: parseReq({
        id: transform(Number, isNumber),
    }),
} as const;

const createCard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    let { deck_id, front, back } = Validators.createCard(req.body);

    const owner = await User.findByDeckId(deck_id);
    if (!req.user || req.user.name !== owner.name) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
    }

    front = req.body.front.trim();
    back = req.body.back.trim();

    const savedCard = await Card.save({ deck_id, front, back });
    res.json({ card: savedCard });
});

const update_card = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const owner = await User.findByCardId(id);

    if (!req.user || req.user.name !== owner.name) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
    }

    const front = req.body.front.trim();
    const back = req.body.back.trim();

    await Card.updateById({ id, front, back });
    const updatedCard = await Card.findById(id);
    res.json({ card: updatedCard });
});

const update_score = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    const user_id = req.user.id;
    const card_id = parseInt(req.params.id);
    const score = req.body.score;
    await Score.save({ score, user_id, card_id });

    res.sendStatus(HttpStatusCodes.OK);
});

const delete_card = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = Validators.deleteCard(req.params).id;
    const owner = await User.findByCardId(id);
    if (!req.user || req.user.name !== owner.name) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
    }

    await Card.deleteById(id);
    res.sendStatus(HttpStatusCodes.OK);
});

export default {
    createCard,
    update_card,
    update_score,
    delete_card,
};
