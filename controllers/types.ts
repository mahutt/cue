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

export type Score = 0 | 1 | 2;
