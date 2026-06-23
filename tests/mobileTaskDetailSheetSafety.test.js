import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mobile task card opens its own local detail sheet without relying on the desktop detail handler', async () => {
  const card = await readFile(
    new URL('../src/components/mobile/MobileTaskCard.jsx', import.meta.url),
    'utf8'
  );
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

  assert.match(card, /zrc-mobile-task-local-detail-v1/);
  assert.match(card, /setIsTaskDetailOpen\(true\)/);
  assert.match(card, /zrc-mobile-task-detail-sheet/);
  assert.match(card, /taskDescription/);
  assert.match(card, /onClick=\{closeTaskDetails\}/);
  assert.match(css, /ZRC MOBILE TASK DETAIL SHEET START/);
  assert.match(css, /\.zrc-mobile-task-detail-backdrop/);
  assert.match(css, /\.zrc-mobile-task-detail-sheet/);
});
