import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mobile task card opens its own shared local detail sheet without relying on the desktop detail handler', async () => {
  const card = await readFile(
    new URL('../src/components/mobile/MobileTaskCard.jsx', import.meta.url),
    'utf8'
  );
  const sheet = await readFile(
    new URL('../src/components/mobile/MobileTaskDetailSheet.jsx', import.meta.url),
    'utf8'
  );
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

  assert.match(card, /zrc-mobile-task-local-detail-v1/);
  assert.match(card, /setIsTaskDetailOpen\(true\)/);
  assert.match(card, /<MobileTaskDetailSheet/);
  assert.match(sheet, /zrc-mobile-task-detail-sheet/);
  assert.match(sheet, /zrc-mobile-task-detail-description-input/);
  assert.match(sheet, /onClick=\{onClose\}/);
  assert.match(css, /ZRC MOBILE TASK DETAIL SHEET START/);
  assert.match(css, /\.zrc-mobile-task-detail-backdrop/);
  assert.match(css, /\.zrc-mobile-task-detail-sheet/);
});
