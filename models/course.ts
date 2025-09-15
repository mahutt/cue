import db from '../database/database';

// Find courses by user_id
export function allByUserId(user_id: string) {
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
}

// Find course by department, number, and user_id
export function find({ department, number, user_id }: { department: string; number: number; user_id: string }) {
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
}

// Save a course
export function save({
    name,
    department,
    number,
    user_id,
}: {
    name: string;
    department: string;
    number: number;
    user_id: string;
}) {
    return new Promise((resolve, reject) => {
        return db.run(
            `
                INSERT INTO courses (name, department, number, user_id)
                VALUES (?, ?, ?, ?);
            `,
            [name, department, number, user_id],
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

export function updateById(
    id: string,
    { name, department, number }: { name: string; department: string; number: string }
) {
    name = name.trim();
    department = department.trim().toLowerCase();
    const typedNumber = parseInt(number.trim(), 10);

    return new Promise((resolve, reject) => {
        return db.run(
            `
                UPDATE courses
                SET name = ?, department = ?, number = ?
                WHERE id = ?
            `,
            [name, department, typedNumber, id],
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

export function deleteById(id: string) {
    return new Promise((resolve, reject) => {
        return db.run(`DELETE from courses WHERE id = ?`, [id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

export function getIdByDepartmentAndNumber(department: string, number: number) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT id FROM courses WHERE department = ? AND number = ?`,
            [department, number],
            (err, row: { id: string }) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.id);
                }
            }
        );
    });
}
