import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRelationshipSyncPlan } from '../src/app/utils/relationshipSyncHelpers.js';

test('relationship sync only inserts and deletes changed links', () => {
  assert.deepEqual(
    buildRelationshipSyncPlan(['member-a', 'member-b'], ['member-b', 'member-c']),
    { toInsert: ['member-c'], toDelete: ['member-a'] }
  );
});

test('relationship sync is idempotent and removes duplicate inputs', () => {
  assert.deepEqual(
    buildRelationshipSyncPlan(['member-a', 'member-a'], ['member-a', 'member-a']),
    { toInsert: [], toDelete: [] }
  );
});
