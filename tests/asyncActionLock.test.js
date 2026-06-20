import assert from 'node:assert/strict';
import test from 'node:test';
import { releaseActionLock, tryAcquireActionLock } from '../src/app/utils/asyncActionLock.js';

test('action locks reject duplicate in-flight submissions and can be released', () => {
  const lockRef = { current: new Set() };

  assert.equal(tryAcquireActionLock(lockRef, 'send-message'), true);
  assert.equal(tryAcquireActionLock(lockRef, 'send-message'), false);
  assert.equal(releaseActionLock(lockRef, 'send-message'), true);
  assert.equal(tryAcquireActionLock(lockRef, 'send-message'), true);
});
