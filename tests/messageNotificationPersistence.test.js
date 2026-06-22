import assert from 'node:assert/strict';
import test from 'node:test';
import { createZRCMessageNotificationActions } from '../src/app/actions/zrcMessageNotificationActions.js';

const createDeps = (overrides = {}) => ({
  isSupabaseUuid: () => false,
  supabase: null,
  currentUserId: 'user-1',
  getCurrentSupabaseWorkspaceId: () => 'workspace-1',
  readNotificationIds: [],
  setReadNotificationIds: () => {},
  saveUserPreferencesToSupabase: async () => false,
  readMessageIds: [],
  setReadMessageIds: () => {},
  messageItems: [],
  ...overrides
});

test('failed notification preference persistence leaves local read state untouched', async () => {
  let localCommitCount = 0;
  const actions = createZRCMessageNotificationActions(createDeps({
    setReadNotificationIds: () => { localCommitCount += 1; }
  }));

  assert.equal(await actions.markNotificationAsRead('notification-1'), false);
  assert.equal(localCommitCount, 0);
});

test('message read state commits only after preference persistence', async () => {
  let resolveSave;
  let localCommitCount = 0;
  const saveResult = new Promise((resolve) => { resolveSave = resolve; });
  const actions = createZRCMessageNotificationActions(createDeps({
    saveUserPreferencesToSupabase: async () => saveResult,
    setReadMessageIds: () => { localCommitCount += 1; }
  }));

  const markResult = actions.markMessageAsRead('message-1');
  assert.equal(localCommitCount, 0);

  resolveSave(true);
  assert.equal(await markResult, true);
  assert.equal(localCommitCount, 1);
});

test('marking all messages persists the complete id set before local commit', async () => {
  let persistedIds = [];
  let localCommitCount = 0;
  const actions = createZRCMessageNotificationActions(createDeps({
    readMessageIds: ['message-1'],
    messageItems: [{ id: 'message-1' }, { id: 'message-2' }],
    saveUserPreferencesToSupabase: async ({ readMessageIds }) => {
      persistedIds = readMessageIds;
      return true;
    },
    setReadMessageIds: () => { localCommitCount += 1; }
  }));

  assert.equal(await actions.markAllMessagesAsRead(), true);
  assert.deepEqual(persistedIds, ['message-1', 'message-2']);
  assert.equal(localCommitCount, 1);
});
