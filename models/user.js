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
