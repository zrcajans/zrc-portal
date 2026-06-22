import assert from 'node:assert/strict';
import test from 'node:test';
import { upsertUserPreferencesForUser } from '../src/app/utils/userPreferencesPersistence.js';

test('user preferences use the table user id conflict key', async () => {
  let capturedTable = '';
  let capturedRecord = null;
  let capturedOptions = null;
  const supabase = {
    from(table) {
      capturedTable = table;
      return {
        async upsert(record, options) {
          capturedRecord = record;
          capturedOptions = options;
          return { error: null };
        }
      };
    }
  };

  const result = await upsertUserPreferencesForUser(supabase, {
    workspaceId: 'workspace-1',
    userId: 'user-1',
    preferences: { notificationClearSource: 'user-1' },
    updatedAt: '2026-06-22T10:00:00.000Z'
  });

  assert.equal(result.error, null);
  assert.equal(capturedTable, 'user_preferences');
  assert.deepEqual(capturedOptions, { onConflict: 'user_id' });
  assert.deepEqual(capturedRecord, {
    workspace_id: 'workspace-1',
    user_id: 'user-1',
    preferences: { notificationClearSource: 'user-1' },
    updated_at: '2026-06-22T10:00:00.000Z'
  });
});

test('user preference upsert preserves Supabase errors for the caller', async () => {
  const expectedError = new Error('row-level security policy');
  const supabase = {
    from() {
      return {
        async upsert() {
          return { error: expectedError };
        }
      };
    }
  };

  const result = await upsertUserPreferencesForUser(supabase, {
    workspaceId: 'workspace-1',
    userId: 'user-1',
    preferences: {},
    updatedAt: '2026-06-22T10:00:00.000Z'
  });

  assert.equal(result.error, expectedError);
});
