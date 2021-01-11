const db = require('../../src/dataLayer/db');

const PUZZLE_01 = {
  id: 1,
  filename: '1_01.jpg',
  solution: 'Cough Mixture',
  par: undefined,
  clue: undefined,
  auth_id: 1,
};

beforeAll(() => {
  return db.start();
});
afterAll(() => {
  return db.teardown();
});

test('can fetch puzzle by ID', async () => {
  puzzle = await db.getPuzzle(1);
  expect(puzzle.id).toEqual(1);
  expect(puzzle.filename).toMatch(/1_01.jpg/);
  expect(puzzle.solution).toMatch(/Cough Mixture/);
  puzzle = await db.getPuzzle(29);
  expect(puzzle.id).toEqual(29);
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

test('`getAllIds` returns an array', async () => {
  result = await db.getAllIds();
  expect(Array.isArray(result)).toBe(true);
});

test('`getAllIds` returns an array of Integers', async () => {
  result = await db.getAllIds();
  expect(result[0]).toBe(1);
  expect(Number.isInteger(result[result.length - 1])).toBe(true);
  expect(
    result.map(Number.isInteger).every((e) => {
      return e === true;
    }),
  ).toBe(true);
});
