import assert from 'node:assert/strict';
import test from 'node:test';
import { requireMatchingMutationRow } from '../src/app/utils/supabaseMutationHelpers.js';

test('verified mutation returns the matching affected row', () => {
  assert.deepEqual(
    requireMatchingMutationRow({ data: { id: 'row-id' }, error: null }, 'row-id', 'Görev'),
    { id: 'row-id' }
  );
});

test('zero-row mutation is rejected instead of becoming a false success', () => {
  assert.throws(
    () => requireMatchingMutationRow({ data: null, error: null }, 'row-id', 'Görev'),
    /Görev yazması doğrulanamadı/
  );
});

test('database mutation errors are preserved', () => {
  const databaseError = new Error('database denied');
  assert.throws(
    () => requireMatchingMutationRow({ data: null, error: databaseError }, 'row-id'),
    databaseError
  );
});
