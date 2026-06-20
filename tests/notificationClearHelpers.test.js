import assert from 'node:assert/strict';
import test from 'node:test';
import { getNotificationClearTokensForUser } from '../src/app/utils/notificationClearHelpers.js';

const clearedAt = '2026-06-20T10:00:00.000Z';

test('notification clear events only apply to the user that created them', () => {
  const logs = [{
    type: 'notification_clear_all',
    created_at: clearedAt,
    payload: { clearedByUserId: 'user-a', clearedBefore: clearedAt }
  }];

  assert.deepEqual(getNotificationClearTokensForUser(logs, 'user-b'), []);
  assert.deepEqual(getNotificationClearTokensForUser(logs, 'user-a'), [
    `clear-all:${clearedAt}`,
    `cleared-before:${clearedAt}`
  ]);
});

test('legacy workspace-wide clear events without an owner are ignored', () => {
  const logs = [{
    type: 'notification_clear_all',
    created_at: clearedAt,
    payload: { zrcNotificationClearAll: true }
  }];

  assert.deepEqual(getNotificationClearTokensForUser(logs, 'user-a'), []);
});
