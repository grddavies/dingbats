const gc = require('../../src/gameController/gameController');
const cache = require('../../src/dataLayer/redis');
const db = require('../../src/dataLayer/db');
const assert = require('assert');

// test('Game obj ids are string', () => {
//     let game = new Game(3);
//     expect(typeof game.id === 'string').toBe(true);
// });

// test('Game init creates a UID', () => {
//     let gameA = new Game(3);
//     let gameB = new Game(3);
//     expect(gameA.id !== gameB.id).toBe(true);
// });

test('newGame creates an object', () => {
    let game = gc.newGame(3);
    expect(typeof game).toBe('object');
});

test('setTimer sets `curRoundEnd` attr', () => {
    let game = gc.newGame(3);
    expect(game.curRoundEnd).toBe(undefined);
    gc.setTimer(game);
    expect(game.curRoundEnd).not.toBe(undefined);
});

test('setTimer creates valid timestamp', () => {
    let game = gc.newGame(3);
    gc.setTimer(game);
    timestamp = game.curRoundEnd;
    expect(new Date(timestamp).getTime() > 0).toBe(true);
});

test('setTimer creates future timestamp', () => {
    let game = gc.newGame(3);
    gc.setTimer(game);
    let now = new Date();
    expect(new Date(timestamp).getTime() > now.getTime()).toBe(true);
});

test('should be able to write a game-like object to cache', async () => {
    cache.start();
    let game = gc.newGame(3);
    await gc.writeGame(game);
    let result = await gc.readGame(game.id);
    expect(result.id).toBe(game.id);
    await gc.deleteGame(game.id);
    await cache.teardown();
});

test('shuffleCards should set `cardOrder` attr', async () => {
    await db.start();
    let game = gc.newGame(3);
    await gc.shuffleCards(game);
    result = game.cardOrder;
    expect(Array.isArray(result)).toBe(true);
});

test('shuffleCards should return an object', async () => {
    await db.start();
    let game = gc.newGame(3);
    result = await gc.shuffleCards(game);
    expect(typeof result).toBe('object');
    await db.teardown();
});

test('nextPuzzle accesses puzzleID from cardOrder attr', async () => {
    await db.start();
    let game = gc.newGame(3);
    assert(game.shown == 0);
    await gc.shuffleCards(game);
    result = await gc.nextPuzzle(game);
    expect(result.id).toBe(game.cardOrder[0]);
    game.shown++;
    result = await gc.nextPuzzle(game);
    expect(result.id).toBe(game.cardOrder[1]);
    game.shown = 33;
    result = await gc.nextPuzzle(game);
    expect(result.id).toBe(game.cardOrder[33]);
    await db.teardown();
});

test('nextPuzzle wraps after showing all', async () => {
    await db.start();
    let game = gc.newGame(3);
    assert(game.shown == 0);
    await gc.shuffleCards(game);
    numCards = game.cardOrder.length;
    game.shown = numCards - 1;
    result = await gc.nextPuzzle(game);
    expect(result.id).toBe(game.cardOrder[numCards - 1]);
    game.shown = numCards;
    result = await gc.nextPuzzle(game);
    expect(result.id).toBe(game.cardOrder[0]);
    await db.teardown();
});
