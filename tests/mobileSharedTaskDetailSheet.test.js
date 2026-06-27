import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mobile assigned tasks open the same local task detail sheet as project cards', async () => {
  const assigned = await readFile(
    new URL('../src/components/mobile/MobileAssignedTasks.jsx', import.meta.url),
    'utf8'
  );
  const card = await readFile(
    new URL('../src/components/mobile/MobileTaskCard.jsx', import.meta.url),
    'utf8'
  );
  const sheet = await readFile(
    new URL('../src/components/mobile/MobileTaskDetailSheet.jsx', import.meta.url),
    'utf8'
  );

  assert.match(assigned, /import MobileTaskDetailSheet/);
  assert.match(card, /import MobileTaskDetailSheet/);
  assert.match(assigned, /setSelectedTask\(task\)/);
  assert.doesNotMatch(assigned, /onOpenTask\?\.\(task\)/);
  assert.match(assigned, /<MobileTaskDetailSheet/);
  assert.match(card, /<MobileTaskDetailSheet/);
  assert.match(sheet, /zrc-mobile-task-detail-sheet/);
});

test('mobile task detail description is editable and persists through updateTaskFromDetail', async () => {
  const sheet = await readFile(
    new URL('../src/components/mobile/MobileTaskDetailSheet.jsx', import.meta.url),
    'utf8'
  );
  const card = await readFile(
    new URL('../src/components/mobile/MobileTaskCard.jsx', import.meta.url),
    'utf8'
  );
  const list = await readFile(
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
  const css = await readFile(
    new URL('../src/zrc-mobile.css', import.meta.url),
    'utf8'
  );

  assert.match(sheet, /textarea/);
  assert.match(sheet, /zrc-mobile-task-detail-description-input/);
  assert.match(sheet, /Açıklamayı Kaydet/);
  assert.match(sheet, /onUpdateTaskDescription\(\s*task,\s*nextDescription,/);
  assert.match(card, /onUpdateTaskDescription=\{onUpdateTaskDescription\}/);
  assert.match(list, /onUpdateTaskDescription=\{onUpdateTaskDescription\}/);
  assert.match(section, /onUpdateTaskDescription=\{onUpdateTaskDescription\}/);
  assert.match(workspace, /onUpdateTaskDescription=\{onUpdateTaskDescription\}/);
  assert.match(shell, /const saveMobileTaskDescription = async/);
  assert.match(shell, /updateTaskFromDetail\(/);
  assert.match(shell, /description: nextDescription/);
  assert.match(css, /ZRC MOBILE SHARED TASK DETAIL DESCRIPTION EDIT START/);
});
