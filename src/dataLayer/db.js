const sqlite3 = require('sqlite3').verbose();
const DBFILE = 'src/dataLayer/cave.db';

let db;

function start() {
    return new Promise((res, rej) => {
        db = new sqlite3.Database(DBFILE, (err) => {
            if (err) return rej(err);
            console.log(`Connected to database at ${DBFILE}`);
            res();
        });
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close((err) => {
            if (err) rej(err);
            else acc(console.log('sqlite connection closed'));
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
        db.get(sql, [id], async (err, row) => {
            if (err) rej(err);
            if (!row) {
                console.log(
                    `No puzzle found with the id > ${id}` +
                        ' fetching first puzzle',
                );
                row = await getFirstPuzzle();
            }
            res(row);
        });
    });
}

async function getMaxPuzzleId() {
    return new Promise((res, rej) => {
        let sql = `SELECT * 
                   FROM puzzle 
                   WHERE id = (select max(id) from puzzle);`;
        db.get(sql, (err, row) => {
            if (err) {
                rej(err);
            }
            res(row.id);
        });
    });
}

async function getFirstPuzzle() {
    return new Promise((res, rej) => {
        let sql = `SELECT * FROM puzzle ORDER BY id LIMIT 1`;
        db.get(sql, (err, row) => {
            if (err) {
                rej(err);
            }
            res(row);
        });
    });
}

async function getAllIds() {
    return new Promise((res, rej) => {
        let sql = `SELECT id FROM puzzle`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                rej(err);
            }
            // if (!rows) {rej('No rows returned')}
            res(
                rows.map((row) => {
                    return row.id;
                }),
            );
        });
    });
}

module.exports = {
    start,
    teardown,
    getPuzzle,
    getNextPuzzle,
    getMaxPuzzleId,
    getFirstPuzzle,
    getAllIds,
};
