import assert from 'node:assert/strict';
import test from 'node:test';
import { createZRCProfileActions } from '../src/app/actions/zrcProfileActions.js';

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
