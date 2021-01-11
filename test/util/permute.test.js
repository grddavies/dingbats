const permute = require('../../src/utils/permute');

DIGITS = [...Array(10).keys()];
ALPHASTR = 'abcdefghijklmopqrstuvwxyz';
ALPHA = ALPHASTR.split('');

test('returns an array', () => {
  expect(Array.isArray(permute([]))).toBe(true);
  expect(Array.isArray(permute([1]))).toBe(true);
  expect(Array.isArray(permute(DIGITS))).toBe(true);
  expect(Array.isArray(permute(ALPHASTR))).toBe(true);
  expect(Array.isArray(permute(ALPHA))).toBe(true);
});

test('result has same number of elements', () => {
  expect(permute([]).length).toBe(0);
  expect(permute([1, 2, 3]).length).toBe(3);
  expect(permute([1, 'a', 42, 4]).length).toBe(4);
  expect(permute('string').length).toBe(6);
});

test('result retains `undefined` elements', () => {
  expect(permute([undefined]).length).toBe(1);
  expect(permute([1, undefined, 3]).length).toBe(3);
  expect(permute([1, 'a', 42, undefined]).length).toBe(4);
});

test('singleton Array unchanged', () => {
  expect(permute([1])).toStrictEqual([1]);
  expect(permute(['a'])).toStrictEqual(['a']);
});

test('is undone by `Array.sort()`', () => {
  expect(permute(DIGITS).sort()).toStrictEqual(DIGITS);
  expect(permute(ALPHA).sort()).toStrictEqual(ALPHA);
});

test('doesnt *usually* leave Array unchanged', () => {
  expect(permute(DIGITS)).not.toEqual(DIGITS);
  expect(permute(ALPHA)).not.toEqual(ALPHA);
});

test('doesnt *usually* have the same effect on repetition', () => {
  [foo, bar, baz, bat] = [DIGITS, DIGITS].map(permute);
  expect(foo).not.toEqual(bar);
  expect(foo).not.toEqual(baz);
  expect(foo).not.toEqual(bat);
  [foo, bar] = [ALPHA, ALPHA].map(permute);
  expect(foo).not.toEqual(bar);
});
