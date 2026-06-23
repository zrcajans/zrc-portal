import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('real task pushes use persisted task ids and server-side assignee resolution', async () => {
  const client = await readFile(new URL('../src/utils/browserEnhancements.js', import.meta.url), 'utf8');
  const api = await readFile(new URL('../api/send-task-push.js', import.meta.url), 'utf8');
  const core = await readFile(new URL('../src/app/ZRCAppCore.jsx', import.meta.url), 'utf8');
  const board = await readFile(new URL('../src/app/actions/zrcBoardTaskActions.js', import.meta.url), 'utf8');

  assert.match(client, /taskId = ''/);
  assert.match(client, /taskId: normalizedTaskId/);
  assert.match(client, /recipients\.length === 0 && !normalizedTaskId/);
  assert.match(api, /\.from\('task_assignees'\)/);
  assert.match(api, /taskAssigneeUserIds/);
  assert.match(api, /taskId = String\(bodyPayload\.taskId \|\| ''\)\.trim\(\)/);
  assert.match(core, /taskId: savedTaskId/);
  assert.match(core, /mobileMoveRecipientUserIds/);
  assert.match(board, /const zrcSendTaskStatusPush/);
  assert.match(board, /zrcV442SendTaskSavePush/);
});
