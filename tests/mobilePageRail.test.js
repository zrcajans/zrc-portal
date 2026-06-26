import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mobile page navigation sits in the top header instead of the left edge', async () => {
  const workspace = await readFile(
    new URL('../src/components/mobile/MobileWorkspace.jsx', import.meta.url),
    'utf8'
  );
  const header = await readFile(
    new URL('../src/components/mobile/MobilePremiumHeader.jsx', import.meta.url),
    'utf8'
  );
  const assigned = await readFile(
    new URL('../src/components/mobile/MobileAssignedTasks.jsx', import.meta.url),
    'utf8'
  );
  const css = await readFile(
    new URL('../src/zrc-mobile.css', import.meta.url),
    'utf8'
  );

  assert.match(workspace, /useState\('projects'\)/);
  assert.doesNotMatch(workspace, /<MobilePageRail/);
  assert.match(workspace, /<MobilePremiumHeader/);
  assert.match(workspace, /activePage=\{activeMobilePage\}/);
  assert.match(workspace, /onChangePage=\{handlePageChange\}/);
  assert.match(workspace, /<MobileAssignedTasks/);
  assert.match(workspace, /homeAssignedTasks = \[\]/);
  assert.match(workspace, /onOpenTask=\{onOpenAssignedTask \|\| onOpenTaskDetail\}/);

  assert.match(header, /label: 'Atananlar'/);
  assert.match(header, /label: 'Projeler'/);
  assert.match(header, /Bildirim/);
  assert.match(header, /aria-label="Mobil sayfalar"/);
  assert.match(header, /onChangePage\?\.\(item\.id\)/);
  assert.match(header, /onToggleNotifications/);
  assert.doesNotMatch(header, /zrc-mobile-brand-logo/);

  assert.match(assigned, /Size Atanan Görevler/);
  assert.match(assigned, /onOpenTask\?\.\(task\)/);
  assert.match(assigned, /formatZrcDateTime/);

  assert.match(css, /ZRC MOBILE TOP PAGE NAVIGATION START/);
  assert.match(css, /\.zrc-mobile-top-page-nav/);
  assert.match(css, /\.zrc-mobile-page-rail\s*\{\s*display: none !important;/);
});
