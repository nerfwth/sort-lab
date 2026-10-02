(function (root) {
  'use strict';
  // Immutable snapshots keep playback independent from algorithm execution.
  function trace(input, algorithm) {
    const a = input.slice(), frames = [];
    let comparisons = 0, swaps = 0;
    const save = (active, text) => frames.push({ values: a.slice(), active, text, comparisons, swaps });
    const compare = (i, j) => { comparisons++; save([i, j], `比较 ${a[i]} 与 ${a[j]}`); };
    const swap = (i, j) => { [a[i], a[j]] = [a[j], a[i]]; swaps++; save([i, j], '交换两个元素的位置'); };
    save([], '准备就绪，开始探索');
    if (algorithm === 'bubble') {
      for (let end = a.length - 1; end > 0; end--) {
        let changed = false;
        for (let j = 0; j < end; j++) { compare(j, j + 1); if (a[j] > a[j + 1]) { swap(j, j + 1); changed = true; } }
        if (!changed) break;
      }
    } else if (algorithm === 'insertion') {
      for (let i = 1; i < a.length; i++) {
        for (let j = i; j > 0; j--) { compare(j - 1, j); if (a[j - 1] <= a[j]) break; swap(j - 1, j); }
      }
    } else if (algorithm === 'selection') {
      for (let i = 0; i < a.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < a.length; j++) { compare(min, j); if (a[j] < a[min]) min = j; }
        if (min !== i) swap(i, min);
      }
    } else throw new Error('Unknown algorithm');
    save([], '排序完成，每一个元素都找到了自己的位置');
    frames[frames.length - 1].done = true;
    return frames;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { trace };
  else root.SortLab = { trace };
})(typeof window !== 'undefined' ? window : this);
