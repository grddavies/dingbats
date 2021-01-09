const cache = require('../../src/dataLayer/redis');

test('can read and write strings', async () => {
    await cache.set(1, 'data');
    let result = await cache.get(1);
    expect(result).toBe('data');
});

test('can read and write simple objects', async () => {
    let obj = {thing: 1, other: [1, 2, 4, 8]};
    await cache.set(1, JSON.stringify(obj));
    let result = await cache.get(1);
    expect(JSON.parse(result)).toEqual(obj);
});
