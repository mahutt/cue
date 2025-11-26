import { ICard, IScoredCard } from '../controllers/types';
import db from '../database/database';

export function findById(id: number): Promise<ICard> {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM cards WHERE id = ?`, [id], (err, row: ICard) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Find courses by user_id
export function allByDeckId(deck_id: number): Promise<ICard[]> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM cards WHERE deck_id = ?`, [deck_id], (err, rows: ICard[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Save a deck
export function save({ front, back, deck_id }: { front: string; back: string; deck_id: number }): Promise<ICard> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(
                `SELECT COUNT(*) as count FROM cards WHERE deck_id = ?`,
                [deck_id],
                (err, row: { count: number }) => {
                    if (err) {
                        reject(err);
                    } else {
                        let position = row.count + 1;
                        db.run(
                            `
                            INSERT INTO cards (position, front, back, deck_id)
                            VALUES (?, ?, ?, ?);
                        `,
                            [position, front, back, deck_id],
                            function (err) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({ id: this.lastID, position, front, back, deck_id });
                                }
                            }
                        );
                    }
                }
            );
        });
    });
}

export function updateById({ id, front, back }: { id: number; front: string; back: string }): Promise<void> {
    return new Promise((resolve, reject) => {
        return db.run(`UPDATE cards SET front = ?, back = ? WHERE id = ?`, [front, back, id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function deleteById(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        return db.run(`DELETE from cards WHERE id = ?`, [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function findWeakestByUserIdAndDeckId({
    user_id,
    deck_id,
    limit,
}: {
    user_id: number;
    deck_id: number;
    limit: number;
}): Promise<IScoredCard[]> {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT
                c.id,
                c.deck_id,
                c.position,
                c.front,
                c.back,
                COALESCE(s.score,  0) AS score
            FROM  
                cards c
            LEFT JOIN  
                scores s ON c.id = s.card_id AND s.user_id = ?
            WHERE  
                c.deck_id = ?
            ORDER BY 
                score ASC, RANDOM()
            LIMIT  ${limit}
            `,
            [user_id, deck_id],
            (err, rows: IScoredCard[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}
