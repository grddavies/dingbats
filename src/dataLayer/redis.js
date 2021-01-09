redis = require('redis');

let client;

function start() {
    client = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    });
    
    client.on('error', (err) => {
        console.error(`Error: ${err}`);
    });
}

async function set(key, data) {
    return new Promise((resolve, reject) => {
        client.set(key, data, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function get(key) {
    return new Promise((resolve, reject) => {
        client.get(key, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}

async function del(key) {
    return new Promise((resolve, reject) => {
        client.unlink(key, (err, res) => {
            if (err) {
                console.error(err);
            }
            resolve(res);
        });
    });
}

async function teardown() {
    return new Promise((resolve, reject) => {
        client.quit((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(console.log(`Redis quit: ${res}`));
        });
    });
}

module.exports = { set, get, del, start, teardown };
