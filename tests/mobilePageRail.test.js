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

  assert.match(workspace, /useState\('assigned'\)/);
  assert.doesNotMatch(workspace, /<MobilePageRail/);
  assert.match(workspace, /<MobilePremiumHeader/);
  assert.match(workspace, /activePage=\{activeMobilePage\}/);
  assert.match(workspace, /onChangePage=\{handlePageChange\}/);
  assert.match(workspace, /<MobileAssignedTasks/);
  assert.match(workspace, /homeAssignedTasks = \[\]/);
  assert.match(workspace, /getMobileTaskCardAssignees=\{getMobileTaskCardAssignees\}/);
  assert.match(workspace, /onUpdateTaskDescription=\{onUpdateTaskDescription\}/);

  assert.match(header, /label: 'Atananlar'/);
  assert.match(header, /label: 'Projeler'/);
  assert.match(header, /Bildirim/);
  assert.match(header, /aria-label="Mobil sayfalar"/);
  assert.match(header, /onChangePage\?\.\(item\.id\)/);
  assert.match(header, /onToggleNotifications/);
  assert.match(header, /zrc-mobile-top-page-nav-notification/);
  assert.match(header, /zrc-mobile-top-page-nav-content/);
  assert.doesNotMatch(header, /<span className="zrc-mobile-top-page-nav-label">Bildirim<\/span>/);
  assert.doesNotMatch(header, /zrc-mobile-brand-logo/);

  assert.match(assigned, /Görevlerim/);
  assert.match(assigned, /setSelectedTask\(task\)/);
  assert.match(assigned, /<MobileTaskDetailSheet/);
  assert.match(assigned, /formatZrcDateTime/);

  assert.match(css, /ZRC MOBILE TOP PAGE NAVIGATION START/);
  assert.match(css, /\.zrc-mobile-top-page-nav/);
  assert.match(css, /\.zrc-mobile-page-rail\s*\{\s*display: none !important;/);
  assert.match(css, /ZRC MOBILE HEADER LOGO REMOVAL \+ DISTINCT NOTIFICATION START/);
  assert.match(css, /ZRC MOBILE COMPACT TOP NAV REFINEMENT START/);
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1fr\) 44px !important;/);
  assert.match(css, /position: static !important;/);
  assert.match(css, /zrc-mobile-top-page-nav-notification/);
  assert.match(css, /body \.zrc-mobile-simple-workspace::before,[\s\S]*?content: none !important;/);
});
