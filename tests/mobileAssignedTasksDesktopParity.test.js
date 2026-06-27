import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mobile assigned tasks use the same relaxed table structure as the desktop dashboard', async () => {
  const assigned = await readFile(
    new URL('../src/components/mobile/MobileAssignedTasks.jsx', import.meta.url),
    'utf8'
  );
  const css = await readFile(
    new URL('../src/zrc-mobile.css', import.meta.url),
    'utf8'
  );

  assert.match(assigned, /zrc-mobile-assigned-card/);
  assert.match(assigned, /zrc-mobile-assigned-table-head/);
  assert.match(assigned, /Durum \/ Ad/);
  assert.match(assigned, /Bitiş/);
  assert.match(assigned, /zrc-mobile-assigned-task-order/);
  assert.match(assigned, /zrc-mobile-assigned-task-row/);
  assert.match(assigned, /useState\(null\)/);
  assert.match(assigned, /setSelectedTask\(task\)/);
  assert.match(assigned, /<MobileTaskDetailSheet/);
  assert.match(assigned, /formatZrcDateTime/);

  assert.match(css, /\.zrc-mobile-assigned-card\s*\{[\s\S]*?border-radius: 13px !important;/);
  assert.match(css, /\.zrc-mobile-assigned-table-head,[\s\S]*?grid-template-columns: 28px minmax\(0, 1fr\) minmax\(88px, 112px\) !important;/);
  assert.match(css, /\.zrc-mobile-assigned-task-row\s*\{[\s\S]*?min-height: 48px !important;/);
  assert.match(css, /\.zrc-mobile-assigned-empty\s*\{[\s\S]*?min-height: 116px !important;/);
});
