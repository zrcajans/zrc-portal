import assert from 'node:assert/strict';
import test from 'node:test';
import {
  enqueueAsyncAction,
  releaseActionLock,
  tryAcquireActionLock
} from '../src/app/utils/asyncActionLock.js';

test('action locks reject duplicate in-flight submissions and can be released', () => {
  const lockRef = { current: new Set() };

  assert.equal(tryAcquireActionLock(lockRef, 'send-message'), true);
  assert.equal(tryAcquireActionLock(lockRef, 'send-message'), false);
  assert.equal(releaseActionLock(lockRef, 'send-message'), true);
  assert.equal(tryAcquireActionLock(lockRef, 'send-message'), true);
});

test('queued actions run sequentially even when submitted together', async () => {
  const queueRef = { current: Promise.resolve() };
  const calls = [];
  let releaseFirst;
  const firstGate = new Promise((resolve) => { releaseFirst = resolve; });

  const first = enqueueAsyncAction(queueRef, async () => {
    calls.push('first:start');
    await firstGate;
    calls.push('first:end');
    return 'first';
  });
  const second = enqueueAsyncAction(queueRef, async () => {
    calls.push('second');
    return 'second';
  });

  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(calls, ['first:start']);

  releaseFirst();
  assert.equal(await first, 'first');
  assert.equal(await second, 'second');
  assert.deepEqual(calls, ['first:start', 'first:end', 'second']);
});
