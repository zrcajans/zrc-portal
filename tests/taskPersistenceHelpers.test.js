import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getClientGeneratedTaskChildId,
  getPersistedTaskChildId
} from '../src/app/utils/taskPersistenceHelpers.js';

const rowId = '33333333-3333-4333-8333-333333333333';

test('reads persisted child ids from Supabase metadata', () => {
  assert.equal(getPersistedTaskChildId({ supabaseId: rowId }, 'supabase-step-'), rowId);
  assert.equal(getPersistedTaskChildId({ id: `supabase-step-${rowId}` }, 'supabase-step-'), rowId);
});

test('keeps a new client UUID separate from persisted rows', () => {
  assert.equal(getPersistedTaskChildId({ id: rowId }, 'supabase-step-'), '');
  assert.equal(getClientGeneratedTaskChildId({ id: rowId }), rowId);
});

test('does not reuse a persisted id as a client-generated insert id', () => {
  assert.equal(getClientGeneratedTaskChildId({ id: rowId, supabaseId: rowId }), null);
});
