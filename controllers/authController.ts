import * as User from '../models/user';
import * as Course from '../models/course';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, IUserFromToken } from './types';

exports.login = asyncHandler(async (req: Request, res: Response, _: NextFunction) => {
    const user = await User.findByName(req.body.name);

    if (user === undefined) {
        res.send({ error: 'Cannot find user.' });
        return;
    }

    if (await bcrypt.compare(req.body.password, user.hash)) {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 30 * 24 * 3600000),
        });
        res.send({ token: token });
    } else {
        res.send({ error: 'Access denied.' });
    }
});

exports.logout = asyncHandler(async (_, res, __) => {
    res.clearCookie('jwt');
    res.sendStatus(200);
});

exports.authenticate = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.cookies || !req.cookies.jwt) {
        req.user = undefined;
        next();
    } else {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET as string,
            (err: VerifyErrors | null, decoded: any) => {
                if (err) return res.sendStatus(403);
                req.user = decoded as IUserFromToken;
                next();
            }
        );
    }
});

exports.get_authenticated_user = asyncHandler(async (req: AuthenticatedRequest, res: Response, _: NextFunction) => {
    if (!req.user || req.user === null) {
        res.sendStatus(403);
        return;
    }

    const user = await User.findByName(req.user.name);
    const courses = await Course.allByUserId(`${user.id}`);

    if (user === undefined) {
        res.sendStatus(403);
        return;
    }

    res.send({
        name: user.name,
        courses,
    });
});
