import { IMessage } from '../controllers/types';
import db from '../database/database';

export function all(): Promise<IMessage[]> {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT messages.*, users.name as username
             FROM messages 
             LEFT JOIN users ON messages.user_id = users.id 
             ORDER BY messages.created_at DESC`,
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as IMessage[]);
                }
            }
        );
    });
}

export function create(content: string, user_id: number | null): Promise<number> {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO messages (content, user_id) VALUES (?, ?)', [content, user_id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}
