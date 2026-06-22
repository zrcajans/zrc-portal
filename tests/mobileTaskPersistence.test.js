import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mobile task move shows success only after persistence succeeds', async () => {
  const source = await readFile(
    new URL('../src/components/mobile/MobileTaskCard.jsx', import.meta.url),
    'utf8'
  );
  const handlerStart = source.indexOf('const handleMoveToColumn');
  const moveHandler = source.slice(handlerStart, source.indexOf('\n  return (', handlerStart));

  assert.match(moveHandler, /const moved = await moveMobileTaskToActiveColumn/);
  assert.match(moveHandler, /if \(!moved\) return;/);
  assert.ok(
    moveHandler.indexOf('if (!moved) return;') < moveHandler.indexOf('onMobileTaskMoveToast(')
  );
});
