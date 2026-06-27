import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mobile task cards hide descriptions and open the existing task detail modal on tap', async () => {
  const card = await readFile(
    new URL('../src/components/mobile/MobileTaskCard.jsx', import.meta.url),
    'utf8'
  );
  const taskList = await readFile(
    new URL('../src/components/mobile/MobileTaskList.jsx', import.meta.url),
    'utf8'
  );
  const section = await readFile(
    new URL('../src/components/mobile/MobileTaskSection.jsx', import.meta.url),
    'utf8'
  );
  const workspace = await readFile(
    new URL('../src/components/mobile/MobileWorkspace.jsx', import.meta.url),
    'utf8'
  );
  const shell = await readFile(
    new URL('../src/app/sections/ZRCAppAuthenticatedShell.jsx', import.meta.url),
    'utf8'
  );

  assert.match(card, /zrc-mobile-task-local-detail-v1/);
  assert.match(card, /setIsTaskDetailOpen\(true\)/);
  assert.match(card, /import MobileTaskDetailSheet/);
  assert.match(card, /<MobileTaskDetailSheet/);
  assert.match(card, /role="button"/);
  assert.match(card, /onKeyDown=\{handleTaskCardKeyDown\}/);
  assert.doesNotMatch(card, /\{task\.description &&\s*\(/);
  assert.match(taskList, /onOpenTaskDetail=\{onOpenTaskDetail\}/);
  assert.match(section, /onOpenTaskDetail=\{onOpenTaskDetail\}/);
  assert.match(workspace, /onOpenTaskDetail=\{onOpenTaskDetail\}/);
  assert.match(shell, /onOpenTaskDetail=\{openTaskDetail\}/);
});
