redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
});

// const getAsync = promisify(client.set).bind(client);
// const setAsync = promisify(client.get).bind(client);

client.on('error', (err) => {
    console.log('Error ' + err);
});

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
            if (err) {reject(err)}
            resolve(res)
        })
    });
}

async function del(key) {
    return new Promise((resolve, reject) => {
        client.unlink(key, (err, res) => {
            if (err) {console.error(err)};
            res()
        })
    })
}

module.exports = { set, get, del };
