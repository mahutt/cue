import * as Message from '../models/message';
import asyncHandler from 'express-async-handler';
import { AuthenticatedRequest } from './types';
import { Response } from 'express';

const allMessages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // since users don't have a roles attribute, I hardcode my username for now
    if (!req.user || req.user.name !== 'mahutt') {
        res.sendStatus(401);
        return;
    }
    const messages = await Message.all();
    res.send(messages);
});

const createMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    const { content } = req.body;
    const id = await Message.create(content, req.user.id);
    res.send({ id });
});

const deleteMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // since users don't have a roles attribute, I hardcode my username for now
    if (!req.user || req.user.name !== 'mahutt') {
        res.sendStatus(401);
        return;
    }
    const { id } = req.params;
    await Message.deleteById(parseInt(id, 10));
    res.sendStatus(204);
});

export default { allMessages, createMessage, deleteMessage };
