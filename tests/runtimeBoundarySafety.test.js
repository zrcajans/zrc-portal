import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('global asynchronous errors are recorded without replacing the live UI', async () => {
  const source = await readFile(
    new URL('../src/components/ZRCGlobalRuntimeBoundary.jsx', import.meta.url),
    'utf8'
  );
  const mountSection = source.slice(
    source.indexOf('componentDidMount()'),
    source.indexOf('componentWillUnmount()')
  );

  assert.match(mountSection, /recordRuntimeDiagnostic\(detail, 'window\.error'\)/);
  assert.match(mountSection, /recordRuntimeDiagnostic\(detail, 'unhandledrejection'\)/);
  assert.doesNotMatch(mountSection, /this\.setState/);
  assert.doesNotMatch(mountSection, /window\.location\.href/);
  assert.match(source, /getScopedStorageKey\('zrc-last-runtime-error'\)/);
});
