// const db = require('../../src/dataLayer/db');
const {Game, writeGame, readGame} = require('../../src/gameController/gameController');

// test('Game obj ids are string', () => {
//     let game = new Game(3);
//     expect(typeof game.id === 'string').toBe(true);
// });

// test('Game init creates a UID', () => {
//     let gameA = new Game(3);
//     let gameB = new Game(3);
//     expect(gameA.id !== gameB.id).toBe(true);
// });

test('Game.setRoundEndTime() sets `curRoundEnd` attr', () => {
    let game = new Game(3);
    expect(game.curRoundEnd).toBe(undefined);
    game.setRoundEndTime();
    expect(game.curRoundEnd).not.toBe(undefined);
});

test('Game.setRoundEndTime() creates valid timestamp', () => {
    let game = new Game(3);
    game.setRoundEndTime();
    timestamp = game.curRoundEnd
    expect(new Date(timestamp).getTime() > 0).toBe(true);
});

test('Game.setRoundEndTime() creates future timestamp', () => {
    let game = new Game(3);
    game.setRoundEndTime();
    let now = new Date();
    expect(new Date(timestamp).getTime() > now.getTime()).toBe(true);
});

test('can write game to cache', async () => {
    let game = new Game(3);
    await writeGame(game);
    let result = await readGame(game.id);
    expect(result.id).toBe(game.id)
})