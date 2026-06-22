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
  profilePreferences: {},
  setProfilePreferences: () => {},
  setIsMessagesOpen: () => {},
  setIsMessageTaskPickerOpen: () => {},
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

test('clearing notifications persists the current user scope and updates only matching rows', async () => {
  const notificationId = '11111111-1111-4111-8111-111111111111';
  const workspaceId = '22222222-2222-4222-8222-222222222222';
  const currentUserId = '33333333-3333-4333-8333-333333333333';
  const notification = {
    id: `supabase-notification-${notificationId}`,
    title: 'Görev güncellendi',
    createdAt: '2026-06-22T10:00:00.000Z'
  };
  const storage = new Map();
  const previousWindow = globalThis.window;
  const filters = [];
  let persistedPreferences = null;
  let committedReadIds = [];
  let remainingNotifications = [notification];

  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value)
    },
    zrcAlert: async () => {}
  };

  const mutation = {
    eq(column, value) {
      filters.push([column, value]);
      return this;
    },
    async in(column, values) {
      filters.push([column, values]);
      return { error: null };
    }
  };

  try {
    const actions = createZRCMessageNotificationActions(createDeps({
      isSupabaseUuid: (value) => value === notificationId,
      supabase: {
        from: (table) => ({
          update: (values) => {
            assert.equal(table, 'notifications');
            assert.deepEqual(values, { is_read: true });
            return mutation;
          }
        })
      },
      currentUserId,
      getCurrentSupabaseWorkspaceId: () => workspaceId,
      notificationItems: [notification],
      saveUserPreferencesToSupabase: async (preferences) => {
        persistedPreferences = preferences;
        return true;
      },
      setReadNotificationIds: (updater) => {
        committedReadIds = updater([]);
      },
      setActivityNotifications: (updater) => {
        remainingNotifications = updater(remainingNotifications);
      }
    }));

    await actions.markAllNotificationsAsRead();
  } finally {
    globalThis.window = previousWindow;
  }

  assert.equal(persistedPreferences.notificationClearSource, currentUserId);
  assert.ok(persistedPreferences.readNotificationIds.includes(notificationId));
  assert.ok(persistedPreferences.readNotificationIds.some((id) => id.startsWith('clear-all:')));
  assert.deepEqual(filters, [
    ['workspace_id', workspaceId],
    ['user_id', currentUserId],
    ['id', [notificationId]]
  ]);
  assert.ok(committedReadIds.includes(notificationId));
  assert.deepEqual(remainingNotifications, []);
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

test('clearing messages saves hidden ids without deleting shared messages', async () => {
  const previousWindow = globalThis.window;
  let persistedPatch = null;
  let committedPreferences = null;
  let committedReadIds = [];
  let panelClosed = false;

  globalThis.window = {
    zrcConfirm: async () => true,
    zrcAlert: async () => {}
  };

  try {
    const actions = createZRCMessageNotificationActions(createDeps({
      profilePreferences: {
        clearedMessageIds: ['old-message']
      },
      messageItems: [
        { id: 'message-1' },
        { id: 'message-2' }
      ],
      saveUserPreferencesToSupabase: async (patch) => {
        persistedPatch = patch;
        return true;
      },
      setProfilePreferences: (updater) => {
        committedPreferences = updater({
          clearedMessageIds: ['old-message']
        });
      },
      setReadMessageIds: (updater) => {
        committedReadIds = updater([]);
      },
      setIsMessagesOpen: (value) => {
        panelClosed = value === false;
      },
      setIsMessageTaskPickerOpen: () => {}
    }));

    assert.equal(await actions.clearAllMessages(), true);
  } finally {
    globalThis.window = previousWindow;
  }

  assert.deepEqual(
    persistedPatch.profilePreferences.clearedMessageIds,
    ['old-message', 'message-1', 'message-2']
  );
  assert.deepEqual(
    committedPreferences.clearedMessageIds,
    ['old-message', 'message-1', 'message-2']
  );
  assert.deepEqual(committedReadIds, ['message-1', 'message-2']);
  assert.equal(panelClosed, true);
});
