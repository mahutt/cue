const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('./database/cue.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(function () {
    db.run(`PRAGMA foreign_keys = ON;`);

    db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            hash TEXT NOT NULL
        );`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL CHECK(length(name) <= 100),
            department TEXT NOT NULL CHECK(length(department) <= 4),
            number INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            UNIQUE (department, number, user_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS decks (
            id INTEGER PRIMARY KEY,
            position INTEGER NOT NULL,
            name TEXT NOT NULL CHECK(length(name) <= 100),
            course_id INTEGER NOT NULL,
            UNIQUE (position, course_id),
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        )`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY,
            position INTEGER NOT NULL,
            front TEXT NOT NULL,
            back TEXT NOT NULL,
            score INTEGER NOT NULL DEFAULT 0 CHECK(score IN (0, 1, 2)),
            deck_id INTEGER NOT NULL,
            UNIQUE (position, deck_id),
            FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
        )`
    );

    db.run("INSERT OR IGNORE INTO users (name) VALUES ('mahutt');");
});

module.exports = db;
