import db from '../database/database';

// Find courses by user_id
exports.allByCourseId = function (course_id: number) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM decks WHERE course_id = ?`, [course_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Save a deck
exports.save = function ({ name, course_id }: { name: string; course_id: number }) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(
                `SELECT COUNT(*) as count FROM decks WHERE course_id = ?`,
                [course_id],
                (
                    err,
                    row: {
                        count: number;
                    }
                ) => {
                    if (err) {
                        reject(err);
                    } else {
                        let position = row.count + 1;
                        db.run(
                            `
                            INSERT INTO decks (position, name, course_id)
                            VALUES (?, ?, ?);
                        `,
                            [position, name, course_id],
                            function (err) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({ id: this.lastID, position, name, course_id });
                                }
                            }
                        );
                    }
                }
            );
        });
    });
};

// Find deck by position, and course_id
exports.find = function ({ position, course_id }: { position: number; course_id: number }) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM decks WHERE position = ? AND course_id = ?`, [position, course_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.updateById = function (
    id: number,
    {
        name,
    }: {
        name: string;
    }
): Promise<void> {
    return new Promise((resolve, reject) => {
        return db.run(
            `
            UPDATE decks SET name = ? WHERE id = ?
            `,
            [name, id],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
};

exports.deleteById = function (id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        return db.run(`DELETE from decks WHERE id = ?`, [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

exports.getPercentageByUserIdAndDeckId = function ({ user_id, deck_id }: { user_id: number; deck_id: number }) {
    return new Promise((resolve, reject) => {
        return db.get(
            `
            SELECT AVG(COALESCE(s.score,  0)) AS average
            FROM cards c
            LEFT JOIN scores s ON c.id = s.card_id AND s.user_id = ?
            WHERE c.deck_id = ?
            `,
            [user_id, deck_id],
            (
                err,
                rows: {
                    average: number | null;
                }
            ) => {
                if (err) {
                    reject(err);
                } else {
                    const average = rows.average;
                    const percentage = average !== null ? Math.round((average / 2) * 100) : null;
                    resolve(percentage);
                }
            }
        );
    });
};

exports.resetProgress = function ({ userId, deckId }: { userId: number; deckId: number }) {
    return new Promise((resolve, reject) => {
        return db.get(
            `
            DELETE FROM scores
            WHERE user_id = ?
            AND card_id IN (
                SELECT cards.id
                FROM cards
                JOIN decks ON cards.deck_id = decks.id
                WHERE decks.id = ?
            )
            `,
            [userId, deckId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
};
