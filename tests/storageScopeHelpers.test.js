import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ACTIVE_STORAGE_SCOPE_KEY,
  activateStorageScope,
  clearActiveStorageScope,
  createStorageScope,
  getActiveStorageWorkspaceId,
  getScopedStorageKey
} from '../src/app/utils/storageScopeHelpers.js';

const createMemoryStorage = () => {
  const values = new Map();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key)
  };
};

test('storage keys are isolated by workspace and user', () => {
  const storage = createMemoryStorage();
  const first = activateStorageScope({ workspaceId: 'workspace-a', userId: 'user-a' }, storage);
  const firstKey = getScopedStorageKey('zrc-project-boards', storage);
  const second = activateStorageScope({ workspaceId: 'workspace-a', userId: 'user-b' }, storage);
  const secondKey = getScopedStorageKey('zrc-project-boards', storage);

  assert.equal(first.changed, true);
  assert.equal(second.changed, true);
  assert.notEqual(firstKey, secondKey);
});

test('legacy unscoped keys are not reused for anonymous state', () => {
  const storage = createMemoryStorage();

  assert.equal(getScopedStorageKey('zrc-project-boards', storage), 'zrc-project-boards:anonymous');
});

test('scope activation is stable and can be cleared without deleting scoped data', () => {
  const storage = createMemoryStorage();
  const expectedScope = createStorageScope({ workspaceId: 'workspace-a', userId: 'user-a' });

  activateStorageScope({ workspaceId: 'workspace-a', userId: 'user-a' }, storage);
  const secondActivation = activateStorageScope({ workspaceId: 'workspace-a', userId: 'user-a' }, storage);
  storage.setItem(getScopedStorageKey('zrc-projects', storage), 'preserved');

  assert.equal(secondActivation.changed, false);
  assert.equal(storage.getItem(ACTIVE_STORAGE_SCOPE_KEY), expectedScope);
  assert.equal(clearActiveStorageScope(storage), true);
  assert.equal(storage.getItem(`zrc-projects:${expectedScope}`), 'preserved');
});

test('active workspace id is recovered from the isolated browser scope', () => {
  const storage = createMemoryStorage();

  activateStorageScope({ workspaceId: 'workspace/one', userId: 'user@example.com' }, storage);

  assert.equal(getActiveStorageWorkspaceId(storage), 'workspace/one');
});
