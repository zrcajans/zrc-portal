import assert from 'node:assert/strict';
import test from 'node:test';
import { triggerBrowserDownload } from '../src/app/utils/browserDownloadHelpers.js';

test('blob download revokes its object URL after a delay', () => {
  const calls = [];
  let scheduledCleanup;
  const link = {
    click: () => calls.push('click'),
    remove: () => calls.push('remove')
  };
  const documentRef = {
    body: { appendChild: () => calls.push('append') },
    createElement: () => link
  };
  const urlApi = {
    createObjectURL: () => 'blob:test',
    revokeObjectURL: (url) => calls.push(`revoke:${url}`)
  };
  const schedule = (callback, delay) => {
    calls.push(`schedule:${delay}`);
    scheduledCleanup = callback;
  };

  assert.equal(
    triggerBrowserDownload({}, 'rapor.json', { documentRef, urlApi, schedule, revokeDelay: 1200 }),
    true
  );
  assert.equal(link.href, 'blob:test');
  assert.equal(link.download, 'rapor.json');
  assert.deepEqual(calls, ['append', 'click', 'remove', 'schedule:1200']);

  scheduledCleanup();
  assert.deepEqual(calls, ['append', 'click', 'remove', 'schedule:1200', 'revoke:blob:test']);
});
