import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { shouldRegisterZrcPwa } from '../src/pwaRegister.js';

test('PWA registration is limited to production hosts', () => {
  assert.equal(shouldRegisterZrcPwa('portal.zrcajans.com'), true);
  assert.equal(shouldRegisterZrcPwa('zrc-preview.vercel.app'), true);
  assert.equal(shouldRegisterZrcPwa('localhost'), false);
  assert.equal(shouldRegisterZrcPwa('portal.zrcajans.com.attacker.test'), false);
});

test('service worker never substitutes app HTML for API or asset requests', async () => {
  const source = await readFile(new URL('../public/zrc-sw.js', import.meta.url), 'utf8');

  assert.match(source, /requestUrl\.pathname\.startsWith\('\/api\/'\)/);
  assert.match(source, /request\.mode === 'navigate'/);
  assert.match(source, /caches\.match\(request\)\) \|\| Response\.error\(\)/);
  assert.doesNotMatch(source, /cached \|\| caches\.match\('\/'\)/);
});
