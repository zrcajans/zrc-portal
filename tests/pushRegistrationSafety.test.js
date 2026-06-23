import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('push registration authorizes the explicitly selected workspace', async () => {
  const apiSource = await readFile(
    new URL('../api/register-push-subscription.js', import.meta.url),
    'utf8'
  );
  const clientSource = await readFile(
    new URL('../src/utils/browserEnhancements.js', import.meta.url),
    'utf8'
  );

  assert.match(clientSource, /workspaceId: getActiveStorageWorkspaceId\(\)/);
  assert.match(apiSource, /authorizeWorkspaceRequest\(\{/);
  assert.match(apiSource, /workspaceId,/);
  assert.doesNotMatch(apiSource, /\.limit\(1\)/);
  assert.match(apiSource, /if \(deleteError\) throw deleteError/);
});

test('test push uses only the current users registered workspace subscription', async () => {
  const apiSource = await readFile(new URL('../api/send-test-push.js', import.meta.url), 'utf8');
  const clientSource = await readFile(
    new URL('../src/utils/browserEnhancements.js', import.meta.url),
    'utf8'
  );

  assert.match(apiSource, /authorizeWorkspaceRequest\(\{/);
  assert.match(apiSource, /\.eq\('workspace_id', workspaceId\)/);
  assert.match(apiSource, /\.eq\('user_id', userId\)/);
  assert.match(apiSource, /\.eq\('type', 'push_subscription'\)/);
  assert.doesNotMatch(apiSource, /req\.body\?\.subscription/);
  assert.match(clientSource, /source: 'v541-manual-worker-recovery'/);
});

test('stale push cleanup stays inside the active workspace and reports failures', async () => {
  const apiSource = await readFile(new URL('../api/send-task-push.js', import.meta.url), 'utf8');
  const cleanupSource = apiSource.slice(
    apiSource.indexOf('if (staleIds.length > 0)'),
    apiSource.indexOf('staleRemoved: staleIds.length')
  );

  assert.match(cleanupSource, /\.eq\('workspace_id', workspaceId\)/);
  assert.match(cleanupSource, /\.eq\('type', 'push_subscription'\)/);
  assert.match(cleanupSource, /if \(staleDeleteError\) throw staleDeleteError/);
});


test('mobile push registration renews old subscriptions and task updates target current assignees', async () => {
  const clientSource = await readFile(
    new URL('../src/utils/browserEnhancements.js', import.meta.url),
    'utf8'
  );
  const coreSource = await readFile(
    new URL('../src/app/ZRCAppCore.jsx', import.meta.url),
    'utf8'
  );
  const apiSource = await readFile(new URL('../api/send-task-push.js', import.meta.url), 'utf8');

  assert.match(clientSource, /zrc-v541-push-worker-compatibility/);
  assert.match(clientSource, /await subscription\.unsubscribe\(\)/);
  assert.match(clientSource, /navigator\.serviceWorker\.register\('\/zrc-sw\.js', \{ scope: '\/' \}\)/);
  assert.match(coreSource, /getTaskAssigneeUserIdsForNotification\(previousTask \|\| \{\}\)/);
  assert.match(coreSource, /getTaskAssigneeUserIdsForNotification\(cleanedTaskData\)/);
  assert.match(apiSource, /normalizedType === 'task_create'/);
  assert.match(apiSource, /normalizedType === 'task_update'/);
});

test('task push recipients are intersected with active workspace members', async () => {
  const apiSource = await readFile(new URL('../api/send-task-push.js', import.meta.url), 'utf8');
  const clientSource = await readFile(
    new URL('../src/utils/browserEnhancements.js', import.meta.url),
    'utf8'
  );

  assert.match(clientSource, /recipientUserIds: recipients/);
  assert.match(apiSource, /\.from\('workspace_members'\)/);
  assert.match(apiSource, /\.eq\('workspace_id', workspaceId\)/);
  assert.match(apiSource, /\.eq\('status', 'Aktif'\)/);
  assert.match(apiSource, /\.in\('user_id', requestedRecipientUserIds\)/);
  assert.match(apiSource, /\.in\('user_id', activeRecipientUserIds\)/);
});
