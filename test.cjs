const assert = require('node:assert/strict');
const { trace } = require('./algorithms.js');
let cases = 0;
let seed = 42;
const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
for (const algorithm of ['bubble', 'insertion', 'selection']) {
  const inputs = [[], [1], [4, 4, 4], [1, 2, 3, 4], [4, 3, 2, 1], [-5, 0, 8, -5]];
  for (let i = 0; i < 50; i++) inputs.push(Array.from({length: 5 + i % 36}, () => Math.floor(random() * 100)));
  for (const input of inputs) {
    const before = input.slice(), frames = trace(input, algorithm), expected = input.slice().sort((a, b) => a - b);
    assert.deepEqual(input, before);
    assert.deepEqual(frames.at(-1).values, expected);
    assert.equal(frames.at(-1).done, true);
    frames.forEach((frame, i) => {
      assert.deepEqual(frame.values.slice().sort((a,b) => a-b), expected);
      assert.ok(frame.active.every(index => index >= 0 && index < input.length));
      if (i) { assert.ok(frame.comparisons >= frames[i-1].comparisons); assert.ok(frame.swaps >= frames[i-1].swaps); }
    });
    cases++;
  }
}
assert.equal(trace([1,2,3,4], 'bubble').at(-1).comparisons, 3);
assert.equal(trace([3,2,1], 'selection').at(-1).comparisons, 3);
console.log(`Passed ${cases} algorithm cases and counter checks.`);
