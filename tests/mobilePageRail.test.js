import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mobile page rail keeps project workspace and assigned-task page as separate views', async () => {
  const workspace = await readFile(
    new URL('../src/components/mobile/MobileWorkspace.jsx', import.meta.url),
    'utf8'
  );
  const rail = await readFile(
    new URL('../src/components/mobile/MobilePageRail.jsx', import.meta.url),
    'utf8'
  );
  const assigned = await readFile(
    new URL('../src/components/mobile/MobileAssignedTasks.jsx', import.meta.url),
    'utf8'
  );
  const shell = await readFile(
    new URL('../src/app/sections/ZRCAppAuthenticatedShell.jsx', import.meta.url),
    'utf8'
  );

  assert.match(workspace, /useState\('projects'\)/);
  assert.match(workspace, /<MobilePageRail/);
  assert.match(workspace, /activeMobilePage === 'projects'/);
  assert.match(workspace, /<MobileAssignedTasks/);
  assert.match(workspace, /homeAssignedTasks = \[\]/);
  assert.match(workspace, /onOpenTask=\{onOpenAssignedTask \|\| onOpenTaskDetail\}/);

  assert.match(rail, /id: 'projects'/);
  assert.match(rail, /id: 'assigned'/);
  assert.match(rail, /aria-label="Mobil sayfalar"/);
  assert.match(rail, /assignedTaskCount/);

  assert.match(assigned, /Size Atanan Görevler/);
  assert.match(assigned, /onOpenTask\?\.\(task\)/);
  assert.match(assigned, /formatZrcDateTime/);

  assert.match(shell, /homeAssignedTasks=\{homeAssignedTasks\}/);
  assert.match(shell, /onOpenAssignedTask=\{openHomeTaskDetail\}/);
});
