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
  assert.match(clientSource, /source: 'v429-manual-test'/);
});
