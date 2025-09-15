const db = require('../database/database').default;

// Save or update a score
exports.save = function ({ score, user_id, card_id }) {
    return new Promise((resolve, reject) => {
        return db.run(
            `
                INSERT OR REPLACE INTO scores (score, user_id, card_id)
                VALUES (?, ?, ?);
            `,
            [score, user_id, card_id],
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
