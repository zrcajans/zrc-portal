import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const modalFiles = [
  '../src/components/Modals/StageModal.jsx',
  '../src/components/Modals/TaskModal.jsx',
  '../src/components/Modals/TaskDetailModal.jsx'
];

test('primary modals expose dialog names and modal semantics', async () => {
  for (const relativePath of modalFiles) {
    const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');

    assert.match(source, /role="dialog"/);
    assert.match(source, /aria-modal="true"/);
    assert.match(source, /aria-labelledby=/);
  }
});

test('task detail modal supports Escape and cleans its close timer', async () => {
  const source = await readFile(
    new URL('../src/components/Modals/TaskDetailModal.jsx', import.meta.url),
    'utf8'
  );

  assert.match(source, /event\.key !== 'Escape'/);
  assert.match(source, /removeEventListener\('keydown', handleEscapeKey\)/);
  assert.match(source, /clearTimeout\(closeTimerRef\.current\)/);
  assert.match(source, /aria-label="Görev detayını kapat"/);
});
