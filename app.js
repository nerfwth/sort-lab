'use strict';
const $ = id => document.getElementById(id);
const descriptions = {
  bubble: ['冒泡排序', '反复比较相邻的两个元素，将较大的元素向右交换。每一轮，当前最大的元素都会到达末尾；若一轮没有交换，就可以提前结束。', '每轮缩短右侧边界\n  比较相邻的两个元素\n  如果左边更大：交换\n  本轮没有交换：提前结束'],
  insertion: ['插入排序', '将左侧视为有序区。每次取下一个元素，通过相邻交换向左移动，直到找到合适的位置。就像整理手中的扑克牌。', '从第二个元素开始\n  向左比较相邻元素\n  如果前一个更大：交换并继续\n  否则：插入完成'],
  selection: ['选择排序', '在未排序区中寻找最小的元素，然后将它放到未排序区的开头。每一轮确定一个位置，交换次数通常少于冒泡排序。', '遍历每个待确定的位置\n  在剩余元素中寻找最小值\n  将最小值交换到当前位置\n  向右移动有序区边界']
};
let original = [], frames = [], position = 0, timer = null;
function stop() { clearTimeout(timer); timer = null; $('play').textContent = '▶ 继续排序'; }
function render() {
  const frame = frames[position];
  $('chart').replaceChildren(...frame.values.map((value, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar' + (frame.done ? ' done' : frame.active.includes(i) ? ' active' : '');
    bar.style.height = `${value}%`;
    const number = document.createElement('span'); number.textContent = value; bar.append(number);
    return bar;
  }));
  $('chart').setAttribute('aria-label', `当前序列：${frame.values.join('、')}`);
  $('phase').textContent = frame.text;
  $('comparisons').textContent = frame.comparisons;
  $('swaps').textContent = frame.swaps;
  $('progress').textContent = `步骤 ${position} / ${frames.length - 1}`;
  $('step').disabled = !!frame.done;
  $('play').disabled = !!frame.done;
  if (frame.done) { stop(); $('play').textContent = '✓ 排序完成'; }
}
function reset() {
  stop(); position = 0;
  frames = SortLab.trace(original, $('algorithm').value);
  const [title, explanation, code] = descriptions[$('algorithm').value];
  $('title').textContent = title; $('explanation').textContent = explanation; $('pseudocode').textContent = code;
  render(); $('play').textContent = '▶ 开始排序';
}
function shuffle() { original = Array.from({ length: Number($('size').value) }, () => 8 + Math.floor(Math.random() * 88)); reset(); }
function tick() {
  if (position >= frames.length - 1) return;
  position++; render();
  if (position < frames.length - 1) timer = setTimeout(tick, 1000 / Number($('speed').value));
}
$('play').addEventListener('click', () => {
  if (timer !== null) { stop(); return; }
  $('play').textContent = 'Ⅱ 暂停';
  timer = setTimeout(tick, 1000 / Number($('speed').value));
});
$('step').addEventListener('click', () => { stop(); if (position < frames.length - 1) position++; render(); });
$('reset').addEventListener('click', reset);
$('shuffle').addEventListener('click', shuffle);
$('algorithm').addEventListener('change', reset);
$('size').addEventListener('input', () => { $('size-value').textContent = $('size').value; shuffle(); });
$('speed').addEventListener('input', () => { $('speed-value').textContent = `${$('speed').value} 步/秒`; });
shuffle();
