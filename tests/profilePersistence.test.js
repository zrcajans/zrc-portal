import assert from 'node:assert/strict';
import test from 'node:test';
import { createZRCProfileActions } from '../src/app/actions/zrcProfileActions.js';
import { releaseActionLock, tryAcquireActionLock } from '../src/app/utils/asyncActionLock.js';

const createDeps = (overrides = {}) => ({
  normalizeStorageObject: (value, fallback) => value && typeof value === 'object' ? value : fallback,
  profileDraft: { firstName: 'Eski', lastName: 'Kullanıcı', email: 'old@example.com' },
  currentProfileName: 'Eski Kullanıcı',
  createAvatarFromName: () => 'EK',
  profilePreferences: {},
  normalizeCredentialText: (value = '') => String(value).trim().toLowerCase(),
  currentUserId: 'user-id',
  currentUserRole: 'Patron',
  setProfileDraft: () => {},
  setTeamMembers: () => {},
  setProjectBoards: () => {},
  setActivityNotifications: () => {},
  setProjectMessages: () => {},
  setProfilePreferences: () => {},
  saveProfileToSupabase: async () => false,
  saveUserPreferencesToSupabase: async () => false,
  emailAccountDraft: '',
  setEmailAccountDraft: () => {},
  profileMutationLockRef: { current: new Set() },
  tryAcquireActionLock,
  releaseActionLock,
  ...overrides
});

test('failed profile persistence leaves all local profile state untouched', async () => {
  let localMutationCount = 0;
  const trackMutation = () => { localMutationCount += 1; };
  const deps = createDeps({
    setProfileDraft: trackMutation,
    setTeamMembers: trackMutation,
    setProjectBoards: trackMutation,
    setActivityNotifications: trackMutation,
    setProjectMessages: trackMutation,
    setProfilePreferences: trackMutation
  });

  const result = await createZRCProfileActions(deps).saveProfileSection({
    profileDraft: { firstName: 'Yeni' }
  });

  assert.equal(result, false);
  assert.equal(localMutationCount, 0);
});

test('duplicate profile saves share one in-flight persistence request', async () => {
  let resolveSave;
  let saveCallCount = 0;
  const saveResult = new Promise((resolve) => { resolveSave = resolve; });
  const deps = createDeps({
    saveProfileToSupabase: async () => {
      saveCallCount += 1;
      return saveResult;
    }
  });
  const actions = createZRCProfileActions(deps);

  const firstSave = actions.saveProfileSection({ profileDraft: { firstName: 'Yeni' } });
  const duplicateSave = await actions.saveProfileSection({ profileDraft: { firstName: 'Yine' } });

  assert.equal(duplicateSave, false);
  assert.equal(saveCallCount, 1);

  resolveSave(true);
  assert.equal(await firstSave, true);
  assert.equal(deps.profileMutationLockRef.current.size, 0);
});

test('failed preference persistence leaves local preferences untouched', async () => {
  let preferenceMutationCount = 0;
  let alertCount = 0;
  const previousWindow = globalThis.window;
  globalThis.window = { zrcAlert: async () => { alertCount += 1; } };

  try {
    const deps = createDeps({
      profilePreferences: { compactMode: false },
      setProfilePreferences: () => { preferenceMutationCount += 1; }
    });

    const result = await createZRCProfileActions(deps).toggleProfilePreference('compactMode');

    assert.equal(result, false);
    assert.equal(preferenceMutationCount, 0);
    assert.equal(alertCount, 1);
    assert.equal(deps.profileMutationLockRef.current.size, 0);
  } finally {
    globalThis.window = previousWindow;
  }
});
