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
