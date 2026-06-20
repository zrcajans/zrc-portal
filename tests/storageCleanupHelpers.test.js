import assert from 'node:assert/strict';
import test from 'node:test';
import { chunkValues, getSafeWorkspaceStoragePaths } from '../src/app/utils/storageCleanupHelpers.js';

test('storage cleanup only accepts project-files paths under the active workspace', () => {
  assert.deepEqual(
    getSafeWorkspaceStoragePaths([
      { bucket: 'project-files', storage_path: 'workspace-a/tasks/one/file.pdf' },
      { bucket: 'project-files', storage_path: 'workspace-b/tasks/two/file.pdf' },
      { bucket: 'public', storage_path: 'workspace-a/tasks/three/file.pdf' }
    ], 'workspace-a'),
    ['workspace-a/tasks/one/file.pdf']
  );
});

test('storage cleanup chunks large remove requests', () => {
  assert.deepEqual(chunkValues(['a', 'b', 'c'], 2), [['a', 'b'], ['c']]);
});
