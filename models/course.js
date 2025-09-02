const db = require('../database/database');

// Find courses by user_id
exports.allByUserId = function (user_id) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT *, department || number AS code
            FROM courses WHERE user_id = ?`,
            [user_id],
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

// Find course by department, number, and user_id
exports.find = function ({ department, number, user_id }) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT *, department || number AS code
            FROM courses WHERE department = ? AND number = ? AND user_id = ?`,
            [department, number, user_id],
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

// Save a course
exports.save = function ({ name, department, number, user_id }) {
    return new Promise((resolve, reject) => {
        return db.run(
            `
                INSERT INTO courses (name, department, number, user_id)
                VALUES (?, ?, ?, ?);
            `,
            [name, department, number, user_id],
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

exports.updateById = function (id, { name, department, number }) {
    name = name.trim();
    department = department.trim().toLowerCase();
    number = parseInt(number.trim(), 10);

    return new Promise((resolve, reject) => {
        return db.run(
            `
                UPDATE courses
                SET name = ?, department = ?, number = ?
                WHERE id = ?
            `,
            [name, department, number, id],
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
        return db.run(`DELETE from courses WHERE id = ?`, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.getIdByDepartmentAndNumber = function (department, number) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id FROM courses WHERE department = ? AND number = ?`, [department, number], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.id);
            }
        });
    });
};
