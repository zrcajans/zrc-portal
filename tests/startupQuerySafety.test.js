import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('startup does not run an unused unauthenticated workspace health query', async () => {
  const source = await readFile(new URL('../src/app/ZRCAppCore.jsx', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /supabaseConnectionStatus/);
  assert.doesNotMatch(source, /checkSupabaseConnection/);
  assert.doesNotMatch(source, /select\('id', \{ count: 'exact', head: true \}\)[\s\S]{0,180}Supabase bağlı/);
});
