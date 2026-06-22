import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('floating version cleanup does not keep a full-document observer alive', async () => {
  const source = await readFile(
    new URL('../src/utils/browserEnhancements.js', import.meta.url),
    'utf8'
  );
  const cleanupSection = source.slice(
    source.indexOf('const zrcInstallFloatingVersionBadgeKiller'),
    source.indexOf('zrcInstallFloatingVersionBadgeKiller();')
  );

  assert.match(cleanupSection, /setTimeout\(zrcKillFloatingVersionBadge, 2500\)/);
  assert.doesNotMatch(cleanupSection, /MutationObserver/);
  assert.doesNotMatch(cleanupSection, /requestAnimationFrame/);
});
