import { IMessage } from '../controllers/types';
import db from '../database/database';

export function all(): Promise<IMessage[]> {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM messages ORDER BY created_at DESC', [], (err, rows: IMessage[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
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
