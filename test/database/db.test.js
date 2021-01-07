const db = require('../../src/database/db');

const PUZZLE_01 = {
    id: 1,
    filename: '1_01.jpg',
    solution: 'Cough Mixture',
    par: undefined,
    clue: undefined,
    auth_id: 1,
};


beforeEach(() => {db.start()});
afterEach(() => {db.teardown()});

test('can fetch puzzle by ID', async () => {
    puzzle = await db.getPuzzle(1);
    expect(puzzle.id).toEqual(1);
    expect(puzzle.filename).toMatch(/1_01.jpg/);
    expect(puzzle.solution).toMatch(/Cough Mixture/);
});

test('`getNextPuzzle` returns a puzzle with higher id', async () => {
    result = await db.getNextPuzzle(21);
    expect(result.id).toBeGreaterThan(21);
    result = await db.getNextPuzzle(0);
    expect(result.id).toBeGreaterThan(0);
});

test('`getNextPuzzle` wraps around after last puzzle ID', async () => {
    MAX_PUZZLE_ID = await db.getMaxPuzzleId();
    result = await db.getNextPuzzle(MAX_PUZZLE_ID);
    MIN_PUZZLE_ID = await db.getFirstPuzzle();
    expect(result).toEqual(MIN_PUZZLE_ID);
});
