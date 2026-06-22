import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('notification tables use the dedicated sync channel instead of full workspace refresh', async () => {
  const source = await readFile(new URL('../src/app/ZRCAppCore.jsx', import.meta.url), 'utf8');
  const generalTables = source.slice(
    source.indexOf('const realtimeTables = ['),
    source.indexOf('const channel = supabase.channel(`zrc-workspace-realtime-')
  );
  const notificationSync = source.slice(
    source.indexOf('// zrc-notification-live-sync-v1'),
    source.indexOf('const unreadNotificationCount')
  );

  for (const table of ['notifications', 'activity_logs', 'user_preferences']) {
    assert.doesNotMatch(generalTables, new RegExp(`'${table}'`));
    assert.match(notificationSync, new RegExp(`table: '${table}'`));
  }
});
