import { IUser } from '../controllers/types';
import db from '../database/database';

export function all() {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, name FROM users ORDER BY id', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// find all usernames
export function allNames() {
    return new Promise((resolve, reject) => {
        db.all('SELECT name FROM users', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// find user by name
export function findByName(name: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE name = ?', [name], (err, rows: IUser) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Given a course ID, returns the user that owns this course.
export function findByCourseId(id: string) {
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
}

// Given a deck ID, returns the user that owns this deck.
export function findByDeckId(id: string) {
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
}

export function findByCardId(id: string) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT users.* FROM users
            JOIN courses ON users.id = courses.user_id
            JOIN decks ON courses.id = decks.course_id
            JOIN cards ON decks.id = cards.deck_id
            WHERE cards.id = ?`,
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
}

// register a new user
export function register({ name, hash }: { name: string; hash: string }) {
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
}

export function allExcept(name: string) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users WHERE name != ?', [name], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
