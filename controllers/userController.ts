import * as User from '../models/user';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from './types';
import { Response } from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';

const allUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // since users don't have a roles attribute, I hardcode my username for now
    if (!req.user || req.user.name !== 'mahutt') {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }
    const users = await User.all();
    res.send(users);
});

const allUserNames = asyncHandler(async (_, res) => {
    const users = await User.allNames();
    res.send(users);
});

const create_user = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
        // since users don't have a roles attribute, I hardcode my username for now
        if (!req.user || req.user.name !== 'mahutt') {
            res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
            return;
        }

        const { name, password } = req.body;

        if (!name || !password) {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ error: 'Name and password are required.' });
            return;
        }

        const hash = await bcrypt.hash(password, 10);
        try {
            await User.register({ name, hash });
        } catch (e: any) {
            if (e.code === 'SQLITE_CONSTRAINT' && e.errno === 19) {
                res.status(HttpStatusCodes.CONFLICT).send({ error: 'Username already exists.' });
                return;
            } else {
                res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Unknown error occurred.' });
                return;
            }
        }

        const newUser = await User.findByName(name);
        if (!newUser) {
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'User creation failed.' });
            return;
        }

        res.status(HttpStatusCodes.CREATED).send({
            message: 'User created successfully.',
            user: { id: newUser.id, name: newUser.name },
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'An unexpected error occurred.' });
    }
});

const delete_user = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // since users don't have a roles attribute, I hardcode my username for now
    if (!req.user || req.user.name !== 'mahutt') {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    await User.deleteById(req.params.id);
    res.send({ message: 'User deleted successfully.' });
});

export default { allUsers, allUserNames, create_user, delete_user };
