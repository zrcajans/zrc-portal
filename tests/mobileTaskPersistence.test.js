import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mobile task move closes the menu and locks the action before persistence', async () => {
  const source = await readFile(
    new URL('../src/components/mobile/MobileTaskCard.jsx', import.meta.url),
    'utf8'
  );
  const handlerStart = source.indexOf('const handleMoveToColumn');
  const moveHandler = source.slice(handlerStart, source.indexOf('\n  const taskDescription', handlerStart));

  assert.match(source, /const \[isColumnMoveInFlight, setIsColumnMoveInFlight\] = useState\(false\)/);
  assert.match(moveHandler, /setIsColumnMenuOpen\(false\);/);
  assert.match(moveHandler, /setIsColumnMoveInFlight\(true\);/);
  assert.match(moveHandler, /const moved = await moveMobileTaskToActiveColumn/);
  assert.match(moveHandler, /finally \{\s*setIsColumnMoveInFlight\(false\);\s*\}/);

  assert.ok(
    moveHandler.indexOf('setIsColumnMenuOpen(false);') < moveHandler.indexOf('const moved = await moveMobileTaskToActiveColumn')
  );
  assert.ok(
    moveHandler.indexOf('setIsColumnMoveInFlight(true);') < moveHandler.indexOf('const moved = await moveMobileTaskToActiveColumn')
  );
});

test('mobile task move controls prevent card click-through and repeated target taps', async () => {
  const source = await readFile(
    new URL('../src/components/mobile/MobileTaskCard.jsx', import.meta.url),
    'utf8'
  );

  assert.match(source, /onPointerDown=\{stopTaskCardActivation\}/);
  assert.match(source, /disabled=\{isColumnMoveInFlight\}/);
  assert.match(source, /role="menu"/);
});
