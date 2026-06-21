import assert from 'node:assert/strict';
import test from 'node:test';
import { createZRCTeamCustomerActions } from '../src/app/actions/zrcTeamCustomerActions.js';
import { releaseActionLock, tryAcquireActionLock } from '../src/app/utils/asyncActionLock.js';

const createDeps = (overrides = {}) => ({
  requirePermission: () => true,
  normalizeTeamRole: (role) => role,
  teamMemberDraft: {
    name: 'Ekip Üyesi',
    username: 'ekip-uyesi',
    password: 'guvenli-sifre',
    role: 'Ekip Üyesi',
    customerId: ''
  },
  getCustomerById: () => null,
  normalizeCredentialText: (value = '') => String(value).trim().toLowerCase(),
  customers: [],
  teamMembers: [],
  getCurrentSupabaseWorkspaceId: () => '11111111-1111-4111-8111-111111111111',
  zrcSetSupabaseWriteInfo: () => {},
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: { access_token: 'test-token' } } })
    }
  },
  isSupabaseUuid: (value = '') => /^[0-9a-f-]{36}$/i.test(String(value)),
  normalizeTeamMember: (member) => member,
  setTeamMembers: () => {},
  setCustomers: () => {},
  setTeamMemberDraft: () => {},
  setSelectedTeamMemberId: () => {},
  setPendingTeamDeleteId: () => {},
  customerDraft: {
    name: 'Müşteri',
    contact: '',
    phone: '',
    note: '',
    username: '',
    password: ''
  },
  setSelectedCustomerId: () => {},
  setPendingCustomerDeleteId: () => {},
  saveCustomerToSupabase: async () => false,
  setCustomerDraft: () => {},
  teamCustomerMutationLockRef: { current: new Set() },
  tryAcquireActionLock,
  releaseActionLock,
  ...overrides
});

test('duplicate team member submits call the account API only once', async (t) => {
  let resolveResponse;
  let fetchCallCount = 0;
  let localMemberCommitCount = 0;
  const responseResult = new Promise((resolve) => { resolveResponse = resolve; });
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => {
    fetchCallCount += 1;
    return responseResult;
  };

  const deps = createDeps({
    setTeamMembers: () => { localMemberCommitCount += 1; }
  });
  const actions = createZRCTeamCustomerActions(deps);
  const event = { preventDefault: () => {} };

  const firstSubmit = actions.createTeamMemberFromCenter(event);
  const duplicateSubmit = await actions.createTeamMemberFromCenter(event);

  assert.equal(duplicateSubmit, false);
  assert.equal(fetchCallCount, 1);
  assert.equal(localMemberCommitCount, 0);

  resolveResponse({
    ok: true,
    json: async () => ({ member: { id: 'member-1', name: 'Ekip Üyesi' } })
  });
  assert.equal(await firstSubmit, true);
  assert.equal(localMemberCommitCount, 1);
  assert.equal(deps.teamCustomerMutationLockRef.current.size, 0);
});

test('duplicate customer submits create only one persisted and local record', async () => {
  let resolveSave;
  let saveCallCount = 0;
  let localCustomerCommitCount = 0;
  const saveResult = new Promise((resolve) => { resolveSave = resolve; });
  const deps = createDeps({
    saveCustomerToSupabase: async () => {
      saveCallCount += 1;
      return saveResult;
    },
    setCustomers: () => { localCustomerCommitCount += 1; }
  });
  const actions = createZRCTeamCustomerActions(deps);
  const event = { preventDefault: () => {} };

  const firstSubmit = actions.createCustomerFromCenter(event);
  const duplicateSubmit = await actions.createCustomerFromCenter(event);

  assert.equal(duplicateSubmit, false);
  assert.equal(saveCallCount, 1);
  assert.equal(localCustomerCommitCount, 0);

  resolveSave({ id: '22222222-2222-4222-8222-222222222222' });
  assert.equal(await firstSubmit, true);
  assert.equal(localCustomerCommitCount, 1);
  assert.equal(deps.teamCustomerMutationLockRef.current.size, 0);
});
