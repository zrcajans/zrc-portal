import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeAuthoritativeServerRecords } from '../src/app/utils/authoritativeMergeHelpers.js';

test('server merge drops persisted rows that are no longer returned', () => {
  const result = mergeAuthoritativeServerRecords({
    serverRecords: [{ id: 'server-a', supabaseId: 'a', text: 'fresh' }],
    localRecords: [
      { id: 'local-a', supabaseId: 'a', text: 'stale' },
      { id: 'local-b', supabaseId: 'b', text: 'deleted remotely' }
    ],
    getKey: (record) => record.supabaseId || record.id
  });

  assert.deepEqual(result, [{ id: 'server-a', supabaseId: 'a', text: 'fresh' }]);
});

test('server merge preserves only unsynced local records', () => {
  const result = mergeAuthoritativeServerRecords({
    serverRecords: [{ id: 'server-a', supabaseId: 'a' }],
    localRecords: [{ id: 'local-draft' }, { id: 'local-a', supabaseId: 'a' }],
    getKey: (record) => record.supabaseId || record.id
  });

  assert.deepEqual(result, [
    { id: 'server-a', supabaseId: 'a' },
    { id: 'local-draft' }
  ]);
});
