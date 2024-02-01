const db = require('../database/database');

// Find courses by user_id
exports.allByCourseId = function (course_id) {
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
exports.save = function ({ name, course_id }) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(`SELECT COUNT(*) as count FROM decks WHERE course_id = ?`, [course_id], (err, row) => {
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
            });
        });
    });
};

// Find deck by position, and course_id
exports.find = function ({ position, course_id }) {
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

exports.updateById = function (id, { name }) {
    return new Promise((resolve, reject) => {
        return db.run(
            `
                UPDATE decks SET name = ? WHERE id = ?
            `,
            [name, id],
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

exports.deleteById = function (id) {
    return new Promise((resolve, reject) => {
        return db.run(`DELETE from decks WHERE id = ?`, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};
