/**
 * Permute items of an iterable Durstenfeld Shuffle Algorithm
 * @param {Iterable} iterable  Any iterable
 * @return {Array}      Shuffled copy of `array`
 */
module.exports = function permute(iterable) {
  const a = [...iterable]; // Spread take any iterable as input

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
