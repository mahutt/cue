import * as User from '../models/user';
import * as Course from '../models/course';
import * as Deck from '../models/deck';
import asyncHandler from 'express-async-handler';
import { extractDepartmentAndNumber } from './common';
import { AuthenticatedRequest } from './types';
import { Response } from 'express';
import { parseReq } from './common/util';
import { transform } from 'jet-validators/utils';
import { isNumber, isString } from 'jet-validators';
import HttpStatusCodes from '../constants/HttpStatusCodes';

const Validators = {
    createCourse: parseReq({
        name: transform(String, isString),
        department: transform(String, isString),
        number: transform(Number, isNumber),
    }),
    getCourse: parseReq({
        userName: transform(String, isString),
        courseCode: transform(String, isString),
    }),
    updateCourse: parseReq({
        name: transform(String, isString),
        code: transform(String, isString),
    }),
} as const;

// JSON API for creating a course
exports.createCourse = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    let { name, department, number } = Validators.createCourse(req.body);

    name = name.trim();
    department = department.trim().toLowerCase();
    const user_id = req.user.id;

    const params = { name, department, number, user_id };
    const courseId = await Course.save(params);

    const course = {
        id: courseId,
        name,
        department,
        number,
        code: `${department}${number}`,
    };

    res.json({ course: course });
});

// JSON API for viewing a course
exports.getCourse = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { userName, courseCode } = Validators.getCourse(req.params);
    const result = extractDepartmentAndNumber(courseCode);

    if (!result) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST);
        return;
    }

    const { department, number } = result;

    const user = await User.findByName(userName);

    const course = await Course.find({ department, number, user_id: user.id });
    const decks = await Deck.allByCourseId(course.id);

    if (req.user) {
        await Promise.all(
            decks.map(async (deck) => {
                if (!req.user) {
                    deck.percentage = null;
                    return;
                }
                const percentage = await Deck.getPercentageByUserIdAndDeckId({
                    user_id: req.user.id,
                    deck_id: deck.id,
                });
                deck.percentage = percentage;
            })
        );
    }
    res.json({ course, decks });
});

// Update a course
exports.update_course = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id;
    const owner = await User.findByCourseId(id);
    if (!req.user || req.user.name !== owner.name) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    let { name, code } = Validators.updateCourse(req.body);
    code = code.toLowerCase().replace(/\s/g, '');
    const result = extractDepartmentAndNumber(code);
    if (!result) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST);
        return;
    }
    const { department, number } = result;

    await Course.updateById(id, { name, department, number });
    res.send(code);
});

// Delete a course
exports.delete_course = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id;
    const owner = await User.findByCourseId(id);
    if (!req.user || req.user.name !== owner.name) {
        res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
        return;
    }

    await Course.deleteById(id);
    res.sendStatus(HttpStatusCodes.OK);
});

exports.getCoursesByUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { name } = req.params;
    const user = await User.findByName(name);
    if (!user) {
        res.sendStatus(HttpStatusCodes.NOT_FOUND);
        return;
    }

    const courses = await Course.allByUserId(user.id);
    res.json(courses);
});
