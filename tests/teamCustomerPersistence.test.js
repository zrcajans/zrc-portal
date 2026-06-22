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
  isLastActiveAdmin: () => false,
  showPermissionWarning: () => {},
  currentUserId: '',
  setCurrentUserId: () => {},
  removeStorageValue: () => {},
  pendingTeamDeleteId: '',
  selectedTeamMemberId: '',
  createUsernameFromMember: (member) => member.username || 'ekip-uyesi',
  setEditingTeamMember: () => {},
  setTeamMemberEditDraft: () => {},
  getMemberLinkedCustomer: () => null,
  editingTeamMember: null,
  teamMemberEditDraft: {},
  createAvatarFromName: () => '',
  setBoardColumns: () => {},
  setArchivedTasks: () => {},
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
  setProjectSettings: () => {},
  pendingCustomerDeleteId: '',
  rememberDeletedCustomer: () => {},
  deleteCustomerFromSupabase: async () => false,
  selectedCustomerId: '',
  saveCustomerToSupabase: async () => false,
  updateCustomerStatusInSupabase: async () => false,
  setCustomerDraft: () => {},
  setEditingCustomer: () => {},
  setCustomerEditDraft: () => {},
  editingCustomer: null,
  customerEditDraft: {},
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

test('duplicate confirmed team member deletes call the account API only once', async (t) => {
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

  const targetMember = { id: 'member-1', name: 'Ekip Üyesi', role: 'Ekip Üyesi' };
  const deps = createDeps({
    teamMembers: [targetMember],
    pendingTeamDeleteId: targetMember.id,
    setTeamMembers: () => { localMemberCommitCount += 1; }
  });
  const actions = createZRCTeamCustomerActions(deps);

  const firstDelete = actions.deleteTeamMemberFromCenter(targetMember.id);
  const duplicateDelete = await actions.deleteTeamMemberFromCenter(targetMember.id);

  assert.equal(duplicateDelete, false);
  assert.equal(fetchCallCount, 1);
  assert.equal(localMemberCommitCount, 0);

  resolveResponse({
    ok: true,
    status: 200,
    json: async () => ({ ok: true })
  });
  assert.equal(await firstDelete, true);
  assert.equal(localMemberCommitCount, 1);
  assert.equal(deps.teamCustomerMutationLockRef.current.size, 0);
});

test('duplicate confirmed customer deletes persist and commit only once', async () => {
  let resolveDelete;
  let deleteCallCount = 0;
  let localCustomerCommitCount = 0;
  const deleteResult = new Promise((resolve) => { resolveDelete = resolve; });
  const customerId = '33333333-3333-4333-8333-333333333333';
  const deps = createDeps({
    customers: [{ id: customerId, supabaseId: customerId, name: 'Müşteri', accountUserId: '' }],
    pendingCustomerDeleteId: customerId,
    deleteCustomerFromSupabase: async () => {
      deleteCallCount += 1;
      return deleteResult;
    },
    setCustomers: () => { localCustomerCommitCount += 1; }
  });
  const actions = createZRCTeamCustomerActions(deps);

  const firstDelete = actions.deleteCustomerFromCenter(customerId);
  const duplicateDelete = await actions.deleteCustomerFromCenter(customerId);

  assert.equal(duplicateDelete, false);
  assert.equal(deleteCallCount, 1);
  assert.equal(localCustomerCommitCount, 0);

  resolveDelete(true);
  assert.equal(await firstDelete, true);
  assert.equal(localCustomerCommitCount, 1);
  assert.equal(deps.teamCustomerMutationLockRef.current.size, 0);
});

test('duplicate team status toggles call the update API only once', async (t) => {
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

  const memberId = '44444444-4444-4444-8444-444444444444';
  const deps = createDeps({
    teamMembers: [{ id: memberId, name: 'Ekip Üyesi', username: 'ekip-uyesi', role: 'Ekip Üyesi', status: 'Aktif' }],
    setTeamMembers: () => { localMemberCommitCount += 1; }
  });
  const actions = createZRCTeamCustomerActions(deps);

  const firstToggle = actions.toggleTeamMemberStatus(memberId);
  const duplicateToggle = await actions.toggleTeamMemberStatus(memberId);

  assert.equal(duplicateToggle, false);
  assert.equal(fetchCallCount, 1);
  assert.equal(localMemberCommitCount, 0);

  resolveResponse({ ok: true, json: async () => ({ ok: true }) });
  assert.equal(await firstToggle, true);
  assert.equal(localMemberCommitCount, 1);
  assert.equal(deps.teamCustomerMutationLockRef.current.size, 0);
});

test('duplicate customer status toggles persist and commit only once', async () => {
  let resolveUpdate;
  let updateCallCount = 0;
  let localCustomerCommitCount = 0;
  const updateResult = new Promise((resolve) => { resolveUpdate = resolve; });
  const customerId = '55555555-5555-4555-8555-555555555555';
  const deps = createDeps({
    customers: [{ id: customerId, supabaseId: customerId, name: 'Müşteri', status: 'Aktif' }],
    updateCustomerStatusInSupabase: async () => {
      updateCallCount += 1;
      return updateResult;
    },
    setCustomers: () => { localCustomerCommitCount += 1; }
  });
  const actions = createZRCTeamCustomerActions(deps);

  const firstToggle = actions.toggleCustomerStatus(customerId);
  const duplicateToggle = await actions.toggleCustomerStatus(customerId);

  assert.equal(duplicateToggle, false);
  assert.equal(updateCallCount, 1);
  assert.equal(localCustomerCommitCount, 0);

  resolveUpdate(true);
  assert.equal(await firstToggle, true);
  assert.equal(localCustomerCommitCount, 1);
  assert.equal(deps.teamCustomerMutationLockRef.current.size, 0);
});

test('duplicate team member edits call the update API only once', async (t) => {
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

  const memberId = '66666666-6666-4666-8666-666666666666';
  const editingTeamMember = {
    id: memberId,
    name: 'Ekip Üyesi',
    username: 'ekip-uyesi',
    role: 'Ekip Üyesi',
    status: 'Aktif',
    avatar: ''
  };
  const deps = createDeps({
    teamMembers: [editingTeamMember],
    editingTeamMember,
    teamMemberEditDraft: {
      name: 'Yeni Ad',
      email: '',
      username: 'yeni-ad',
      role: 'Ekip Üyesi',
      customerId: ''
    },
    setTeamMembers: () => { localMemberCommitCount += 1; }
  });
  const actions = createZRCTeamCustomerActions(deps);
  const event = { preventDefault: () => {} };

  const firstSave = actions.saveTeamMemberEdit(event);
  const duplicateSave = await actions.saveTeamMemberEdit(event);

  assert.equal(duplicateSave, false);
  assert.equal(fetchCallCount, 1);
  assert.equal(localMemberCommitCount, 0);

  resolveResponse({ ok: true, json: async () => ({ ok: true }) });
  assert.equal(await firstSave, true);
  assert.equal(localMemberCommitCount, 1);
  assert.equal(deps.teamCustomerMutationLockRef.current.size, 0);
});

test('duplicate customer edits persist and commit only once', async () => {
  let resolveSave;
  let saveCallCount = 0;
  let localCustomerCommitCount = 0;
  const saveResult = new Promise((resolve) => { resolveSave = resolve; });
  const customerId = '77777777-7777-4777-8777-777777777777';
  const editingCustomer = {
    id: customerId,
    name: 'Müşteri',
    email: '',
    accountUserId: ''
  };
  const deps = createDeps({
    customers: [editingCustomer],
    editingCustomer,
    customerEditDraft: {
      name: 'Yeni Müşteri',
      contact: '',
      phone: '',
      note: ''
    },
    saveCustomerToSupabase: async () => {
      saveCallCount += 1;
      return saveResult;
    },
    setCustomers: () => { localCustomerCommitCount += 1; }
  });
  const actions = createZRCTeamCustomerActions(deps);
  const event = { preventDefault: () => {} };

  const firstSave = actions.saveCustomerEdit(event);
  const duplicateSave = await actions.saveCustomerEdit(event);

  assert.equal(duplicateSave, false);
  assert.equal(saveCallCount, 1);
  assert.equal(localCustomerCommitCount, 0);

  resolveSave({ id: customerId });
  assert.equal(await firstSave, true);
  assert.equal(localCustomerCommitCount, 1);
  assert.equal(deps.teamCustomerMutationLockRef.current.size, 0);
});
