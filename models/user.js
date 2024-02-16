const db = require('../database/database');

// find user by name
exports.findByName = function (name) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE name = ?', [name], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Given a course ID, returns the user that owns this course.
exports.findByCourseId = function (id) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT users.* FROM users
            JOIN courses ON users.id = courses.user_id
            WHERE courses.id = ?`,
            [id],
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

// Given a deck ID, returns the user that owns this deck.
exports.findByDeckId = function (id) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT users.* FROM users
            JOIN courses ON users.id = courses.user_id
            JOIN decks ON courses.id = decks.course_id
            WHERE decks.id = ?`,
            [id],
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

// register a new user
exports.register = function ({ name, hash }) {
    console.log({ name, hash });
    return new Promise((resolve, reject) => {
        db.get('INSERT INTO users (name, hash) VALUES (?, ?);', [name, hash], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};
