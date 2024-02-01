const db = require('../database/database');

// // Find courses by user_id
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

// // Save a deck
exports.save = function ({ question, answer, deck_id }) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(`SELECT COUNT(*) as count FROM cards WHERE deck_id = ?`, [deck_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    let position = row.count + 1;
                    db.run(
                        `
                            INSERT INTO cards (position, question, answer, deck_id)
                            VALUES (?, ?, ?, ?);
                        `,
                        [position, question, answer, deck_id],
                        function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({ id: this.lastID, position, question, answer, deck_id });
                            }
                        }
                    );
                }
            });
        });
    });
};

exports.updateById = function ({ id, column, value }) {
    return new Promise((resolve, reject) => {
        return db.run(`UPDATE cards SET ${column} = ? WHERE id = ?`, [value, id], (err, rows) => {
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
