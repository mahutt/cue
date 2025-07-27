const db = require('../database/database');

exports.findById = function (id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM cards WHERE id = ?`, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// Find courses by user_id
exports.allByDeckId = function (deck_id) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM cards WHERE deck_id = ?`, [deck_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Save a deck
exports.save = function ({ front, back, deck_id }) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(`SELECT COUNT(*) as count FROM cards WHERE deck_id = ?`, [deck_id], (err, row) => {
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
            });
        });
    });
};

exports.updateById = function ({ id, front, back }) {
    return new Promise((resolve, reject) => {
        return db.run(`UPDATE cards SET front = ?, back = ? WHERE id = ?`, [front, back, id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.scoreById = function ({ id, score }) {
    return new Promise((resolve, reject) => {
        return db.run(`UPDATE cards SET score = ? WHERE id = ?`, [score, id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.deleteById = function (id) {
    return new Promise((resolve, reject) => {
        return db.run(`DELETE from cards WHERE id = ?`, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Find 10 weakest, ordered randomly within their score categories.
exports.findWeakestByDeckId = function ({ deck_id, limit }) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM cards WHERE deck_id = ? ORDER BY score ASC, RANDOM() LIMIT ${limit};`,
            [deck_id],
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

exports.findWeakestByUserIdAndDeckId = function ({ user_id, deck_id, limit }) {
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
