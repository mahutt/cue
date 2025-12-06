import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: IUserFromToken;
}

export interface IUserFromToken {
    id: number;
    name: string;
}

export interface IUser {
    id: number;
    name: string;
    hash: string;
}

export interface IMessage {
    id: number;
    content: string;
    user_id: number | null;
    username?: string;
    created_at: string;
}

export interface ICourse {
    id: number;
    name: string;
    department: string;
    number: number;
    user_id: number;
    code?: string;
}

export interface IDeck {
    id: number;
    position: number;
    name: string;
    course_id: number;
    percentage?: number | null;
}

export interface ICard {
    id: number;
    position: number;
    front: string;
    back: string;
    deck_id: number;
}

export interface IScoredCard extends ICard {
    score: Score;
}

export type Score = 0 | 1 | 2;
