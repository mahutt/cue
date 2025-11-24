import db from '../database/database';
import { Score } from '../controllers/types';

// Save or update a score
export function save({ score, user_id, card_id }: { score: Score; user_id: number; card_id: number }): Promise<number> {
    return new Promise((resolve, reject) => {
        return db.run(
            `
                INSERT OR REPLACE INTO scores (score, user_id, card_id)
                VALUES (?, ?, ?);
            `,
            [score, user_id, card_id],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
}
