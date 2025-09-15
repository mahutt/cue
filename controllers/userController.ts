import * as User from '../models/user';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from './types';
import { Response } from 'express';

exports.allUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // since users don't have a roles attribute, I hardcode my username for now
    if (!req.user || req.user.name !== 'mahutt') {
        res.sendStatus(401);
        return;
    }
    const users = await User.all();
    res.send(users);
});

exports.allUserNames = asyncHandler(async (_, res) => {
    const users = await User.allNames();
    res.send(users);
});

exports.create_user = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
        // since users don't have a roles attribute, I hardcode my username for now
        if (!req.user || req.user.name !== 'mahutt') {
            res.sendStatus(401);
            return;
        }

        const { name, password } = req.body;

        if (!name || !password) {
            res.status(400).send({ error: 'Name and password are required.' });
            return;
        }

        const hash = await bcrypt.hash(password, 10);
        try {
            await User.register({ name, hash });
        } catch (e: any) {
            if (e.code === 'SQLITE_CONSTRAINT' && e.errno === 19) {
                res.status(409).send({ error: 'Username already exists.' });
                return;
            } else {
                res.status(500).send({ error: 'Unknown error occurred.' });
                return;
            }
        }

        const newUser = await User.findByName(name);
        if (!newUser) {
            res.status(500).send({ error: 'User creation failed.' });
            return;
        }

        res.status(201).send({ message: 'User created successfully.', user: { id: newUser.id, name: newUser.name } });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ error: 'An unexpected error occurred.' });
    }
});
