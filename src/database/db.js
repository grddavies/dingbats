const sqlite3 = require('sqlite3').verbose();

const DBFILE = 'src/database/cave.db';

let db;

function init() {
    return new Promise((res, rej) => {
        db = new sqlite3.Database(DBFILE, err => {
            if (err) return rej(err);
            console.log(`Connected to database at ${DBFILE}`);
            res();
        });
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getPuzzle(id) {
    return new Promise((res, rej) => {
        let sql = `SELECT * FROM puzzle WHERE id  = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) rej(err);
            res(row);
        });
    });
}

async function getNextPuzzle(id) {
    return new Promise((res, rej) => {
        let sql = `SELECT * FROM puzzle WHERE id  > ? LIMIT 1`;
        db.get(sql, [id], (err, row) => {
            if (err) rej(err);
            res(row ? row : console.log(`No puzzle found with the id > ${id}`));
        });
    });
}

async function getMaxPuzzleId() {
    return new Promise((res, rej) => {
        let sql = `SELECT * 
                   FROM puzzle 
                   WHERE id = (select max(id) from puzzle);`;
        db.get(sql, (err, row) => {
            if (err) {rej(err)};
            res(row.id);
        });
    });
}

module.exports = {
    init,
    teardown,
    getPuzzle,
    getNextPuzzle,
    getMaxPuzzleId
}