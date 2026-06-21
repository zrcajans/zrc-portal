import assert from 'node:assert/strict';
import test from 'node:test';
import { createZRCBoardTaskActions } from '../src/app/actions/zrcBoardTaskActions.js';
import { releaseActionLock, tryAcquireActionLock } from '../src/app/utils/asyncActionLock.js';

const workspaceId = '11111111-1111-4111-8111-111111111111';
const projectId = '22222222-2222-4222-8222-222222222222';
const firstColumnId = '33333333-3333-4333-8333-333333333333';
const secondColumnId = '44444444-4444-4444-8444-444444444444';

const normalizeTitle = (value = '') => String(value || '').trim();

const createQuery = (result, recordFilter = () => {}) => {
  const query = {
    eq: (column, value) => {
      recordFilter('eq', column, value);
      return query;
    },
    in: (column, value) => {
      recordFilter('in', column, value);
      return query;
    },
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject)
  };
  return query;
};

const createBaseDeps = (overrides = {}) => ({
  requirePermission: () => true,
  boardColumns: [],
  setBoardColumns: () => {},
  setOpenMenuColumnId: () => {},
  setOpenTaskMenuId: () => {},
  normalizeColumnTitleForDisplay: normalizeTitle,
  selectedProject: 'Portal',
  normalizeStorageArray: (value, fallback) => Array.isArray(value) ? value : fallback,
  readStorageValue: () => [],
  writeStorageValue: () => {},
  setMobileActiveColumnId: () => {},
  setZrcMobileColumnRefreshKey: () => {},
  setEditingColumn: () => {},
  setIsStageModalOpen: () => {},
  saveStageToSupabase: async () => false,
  saveTaskToSupabaseForProject: async () => false,
  syncTaskDetailsToSupabase: async () => false,
  ensureCanCreateTaskInSelectedProject: () => true,
  normalizeAssigneesForCurrentAccountSave: (people) => people,
  currentAccountType: 'Patron',
  taskMutationLockRef: { current: new Set() },
  setTimeout: () => {},
  loadSelectedProjectBoardFromSupabase: async () => {},
  getCurrentSupabaseWorkspaceId: () => workspaceId,
  zrcSetSupabaseWriteInfo: () => {},
  ensureSupabaseProject: async () => projectId,
  isSupabaseUuid: (value = '') => /^[0-9a-f-]{36}$/i.test(String(value)),
  columnMutationLockRef: { current: new Set() },
  tryAcquireActionLock,
  releaseActionLock,
  ...overrides
});

test('column reorder reaches the database before committing UI order', async () => {
  const boardColumns = [
    { id: firstColumnId, title: 'İlk' },
    { id: secondColumnId, title: 'İkinci' }
  ];
  const writes = [];
  const uiOrders = [];
  const deps = createBaseDeps({
    boardColumns,
    setBoardColumns: (columns) => uiOrders.push(columns.map((column) => column.id)),
    supabase: {
      from: () => ({
        update: (payload) => {
          writes.push(payload.position);
          return createQuery({ error: null });
        }
      })
    }
  });

  const result = await createZRCBoardTaskActions(deps).handleMoveColumn(0, 1);

  assert.equal(result, true);
  assert.deepEqual(writes, [0, 1]);
  assert.deepEqual(uiOrders, [[secondColumnId, firstColumnId]]);
  assert.equal(deps.columnMutationLockRef.current.size, 0);
});

test('failed column reorder leaves UI untouched and reloads authoritative state', async () => {
  const boardColumns = [
    { id: firstColumnId, title: 'İlk' },
    { id: secondColumnId, title: 'İkinci' }
  ];
  let writeCount = 0;
  let uiCommitCount = 0;
  let reloadCount = 0;
  let alertCount = 0;
  const previousWindow = globalThis.window;
  globalThis.window = { zrcAlert: async () => { alertCount += 1; } };

  try {
    const deps = createBaseDeps({
      boardColumns,
      setBoardColumns: () => { uiCommitCount += 1; },
      loadSelectedProjectBoardFromSupabase: async () => { reloadCount += 1; },
      supabase: {
        from: () => ({
          update: () => {
            writeCount += 1;
            return createQuery({ error: writeCount === 2 ? new Error('write failed') : null });
          }
        })
      }
    });

    const result = await createZRCBoardTaskActions(deps).handleMoveColumn(0, 1);

    assert.equal(result, false);
    assert.equal(uiCommitCount, 0);
    assert.equal(reloadCount, 1);
    assert.equal(alertCount, 1);
    assert.equal(deps.columnMutationLockRef.current.size, 0);
  } finally {
    globalThis.window = previousWindow;
  }
});

test('failed stage save preserves the open form and current board', async () => {
  let uiCommitCount = 0;
  let modalCloseCount = 0;
  let storageWriteCount = 0;
  let alertCount = 0;
  const previousWindow = globalThis.window;
  globalThis.window = { zrcAlert: async () => { alertCount += 1; } };

  try {
    const deps = createBaseDeps({
      editingColumn: { id: 'local-column', title: 'Taslak', tasks: [] },
      setBoardColumns: () => { uiCommitCount += 1; },
      setIsStageModalOpen: () => { modalCloseCount += 1; },
      writeStorageValue: () => { storageWriteCount += 1; }
    });

    const result = await createZRCBoardTaskActions(deps).handleSaveStage({ title: 'Taslak' });

    assert.equal(result, false);
    assert.equal(uiCommitCount, 0);
    assert.equal(modalCloseCount, 0);
    assert.equal(storageWriteCount, 0);
    assert.equal(alertCount, 1);
    assert.equal(deps.columnMutationLockRef.current.size, 0);
  } finally {
    globalThis.window = previousWindow;
  }
});

test('successful stage save commits the persisted column id before closing', async () => {
  let currentColumns = [];
  let modalOpen = true;
  let activeColumnId = '';
  const deps = createBaseDeps({
    saveStageToSupabase: async () => firstColumnId,
    setBoardColumns: (updater) => {
      currentColumns = typeof updater === 'function' ? updater(currentColumns) : updater;
    },
    setIsStageModalOpen: (value) => { modalOpen = value; },
    setMobileActiveColumnId: (value) => { activeColumnId = value; }
  });

  const result = await createZRCBoardTaskActions(deps).handleSaveStage({
    id: 'local-column',
    title: 'Yeni',
    tasks: []
  });

  assert.equal(result, true);
  assert.equal(currentColumns[0].id, firstColumnId);
  assert.equal(activeColumnId, firstColumnId);
  assert.equal(modalOpen, false);
  assert.equal(deps.columnMutationLockRef.current.size, 0);
});

test('failed column delete keeps local UI and deletion marker untouched', async () => {
  let uiCommitCount = 0;
  let storageWriteCount = 0;
  let reloadCount = 0;
  let alertCount = 0;
  const previousWindow = globalThis.window;
  globalThis.window = {
    zrcConfirm: async () => true,
    zrcAlert: async () => { alertCount += 1; }
  };

  try {
    const deps = createBaseDeps({
      boardColumns: [{ id: firstColumnId, title: 'Silinecek', tasks: [] }],
      setBoardColumns: () => { uiCommitCount += 1; },
      writeStorageValue: () => { storageWriteCount += 1; },
      loadSelectedProjectBoardFromSupabase: async () => { reloadCount += 1; },
      supabase: {
        from: () => ({
          select: () => createQuery({ data: null, error: new Error('read failed') })
        })
      }
    });

    const result = await createZRCBoardTaskActions(deps).handleDeleteColumn(firstColumnId);

    assert.equal(result, false);
    assert.equal(uiCommitCount, 0);
    assert.equal(storageWriteCount, 0);
    assert.equal(reloadCount, 1);
    assert.equal(alertCount, 1);
    assert.equal(deps.columnMutationLockRef.current.size, 0);
  } finally {
    globalThis.window = previousWindow;
  }
});

test('successful column delete scopes reads and writes before committing UI', async () => {
  let currentColumns = [{ id: firstColumnId, title: 'Silinecek', tasks: [] }];
  let storageWriteCount = 0;
  const filters = [];
  const previousWindow = globalThis.window;
  globalThis.window = {
    zrcConfirm: async () => true,
    zrcAlert: async () => {}
  };

  try {
    const makeTableQuery = (table, operation, result) => createQuery(
      result,
      (filter, column, value) => filters.push({ table, operation, filter, column, value })
    );
    const deps = createBaseDeps({
      boardColumns: currentColumns,
      setBoardColumns: (updater) => {
        currentColumns = typeof updater === 'function' ? updater(currentColumns) : updater;
      },
      writeStorageValue: () => { storageWriteCount += 1; },
      supabase: {
        from: (table) => ({
          select: () => makeTableQuery(
            table,
            'select',
            table === 'board_columns'
              ? { data: [{ id: firstColumnId, title: 'Silinecek' }], error: null }
              : { data: [], error: null }
          ),
          delete: () => makeTableQuery(table, 'delete', { error: null })
        }),
        storage: {
          from: () => ({ remove: async () => ({ error: null }) })
        }
      }
    });

    const result = await createZRCBoardTaskActions(deps).handleDeleteColumn(firstColumnId);

    assert.equal(result, true);
    assert.deepEqual(currentColumns, []);
    assert.equal(storageWriteCount, 1);
    assert.ok(filters.some(({ table, operation, column, value }) =>
      table === 'board_columns' && operation === 'select' && column === 'workspace_id' && value === workspaceId
    ));
    assert.ok(filters.some(({ table, operation, column, value }) =>
      table === 'tasks' && operation === 'select' && column === 'project_id' && value === projectId
    ));
    assert.ok(filters.some(({ table, operation, column, value }) =>
      table === 'board_columns' && operation === 'delete' && column === 'workspace_id' && value === workspaceId
    ));
    assert.equal(deps.columnMutationLockRef.current.size, 0);
  } finally {
    globalThis.window = previousWindow;
  }
});

test('column copy persists sanitized records before adding them to the board', async () => {
  const timeline = [];
  let currentColumns = [{
    id: 'source-column',
    title: 'Aktif',
    tasks: [{
      id: 'source-task',
      supabaseId: '55555555-5555-4555-8555-555555555555',
      title: 'Görev',
      comments: [{ id: 'source-comment', supabaseId: '66666666-6666-4666-8666-666666666666', text: 'Not' }],
      steps: [],
      files: [{ id: 'source-file', storagePath: `${workspaceId}/tasks/file.pdf` }]
    }]
  }];
  let alertCount = 0;
  const previousWindow = globalThis.window;
  globalThis.window = { zrcAlert: async () => { alertCount += 1; } };

  try {
    const deps = createBaseDeps({
      boardColumns: currentColumns,
      saveStageToSupabase: async (column) => {
        timeline.push('column');
        assert.deepEqual(column.tasks, []);
        return firstColumnId;
      },
      saveTaskToSupabaseForProject: async (projectName, task, status, options) => {
        timeline.push('task');
        assert.equal(projectName, 'Portal');
        assert.equal(task.supabaseId, undefined);
        assert.deepEqual(task.files, []);
        assert.equal(status, 'Aktif - Kopya');
        assert.equal(options.targetColumn.id, firstColumnId);
        return secondColumnId;
      },
      syncTaskDetailsToSupabase: async (taskId, updates) => {
        timeline.push('details');
        assert.ok(taskId.startsWith('task-'));
        assert.equal(updates.supabaseId, secondColumnId);
        assert.equal(updates.comments[0].supabaseId, undefined);
        return true;
      },
      setBoardColumns: (updater) => {
        timeline.push('ui');
        currentColumns = typeof updater === 'function' ? updater(currentColumns) : updater;
      }
    });

    const result = await createZRCBoardTaskActions(deps).handleCopyColumn(currentColumns[0], 0);

    assert.equal(result, true);
    assert.deepEqual(timeline, ['column', 'task', 'details', 'ui']);
    assert.equal(currentColumns[1].id, firstColumnId);
    assert.equal(currentColumns[1].tasks[0].supabaseId, secondColumnId);
    assert.deepEqual(currentColumns[1].tasks[0].files, []);
    assert.equal(alertCount, 1);
    assert.equal(deps.columnMutationLockRef.current.size, 0);
  } finally {
    globalThis.window = previousWindow;
  }
});

test('single task copy inserts a new Supabase row before updating the board', async () => {
  const timeline = [];
  const sourceTask = {
    id: 'source-task',
    supabaseId: '55555555-5555-4555-8555-555555555555',
    title: 'Görev',
    assignees: [{ id: 'member' }],
    steps: [{ id: 'source-step', supabaseId: '66666666-6666-4666-8666-666666666666', text: 'Adım' }],
    files: [{ storagePath: `${workspaceId}/tasks/file.pdf` }]
  };
  let currentColumns = [{ id: 'source-column', title: 'Aktif', tasks: [sourceTask] }];
  const deps = createBaseDeps({
    boardColumns: currentColumns,
    saveTaskToSupabaseForProject: async (projectName, task, status, options) => {
      timeline.push('task');
      assert.equal(projectName, 'Portal');
      assert.equal(task.supabaseId, undefined);
      assert.deepEqual(task.files, []);
      assert.equal(task.steps[0].supabaseId, undefined);
      assert.equal(status, 'Aktif');
      assert.equal(options.targetColumn.id, 'source-column');
      return secondColumnId;
    },
    syncTaskDetailsToSupabase: async (taskId, updates) => {
      timeline.push('details');
      assert.ok(taskId.startsWith('task-'));
      assert.equal(updates.supabaseId, secondColumnId);
      return true;
    },
    setBoardColumns: (updater) => {
      timeline.push('ui');
      currentColumns = typeof updater === 'function' ? updater(currentColumns) : updater;
    }
  });

  await createZRCBoardTaskActions(deps).handleTaskAction('kopyala', 'source-column', sourceTask);

  assert.deepEqual(timeline, ['task', 'details', 'ui']);
  assert.equal(currentColumns[0].tasks[0].supabaseId, secondColumnId);
  assert.equal(currentColumns[0].tasks[1], sourceTask);
  assert.equal(deps.taskMutationLockRef.current.size, 0);
});

test('failed comment persistence reports failure without creating activity', async () => {
  const task = { id: 'task-local', supabaseId: secondColumnId, title: 'Görev', comments: [], history: [] };
  let board = [{ id: 'column', title: 'Aktif', tasks: [task] }];
  let detail = { task, columnTitle: 'Aktif' };
  let activityCount = 0;
  let reloadCount = 0;
  let alertCount = 0;
  const previousWindow = globalThis.window;
  globalThis.window = { zrcAlert: async () => { alertCount += 1; } };

  try {
    const deps = createBaseDeps({
      boardColumns: board,
      detailTaskInfo: detail,
      reportTasks: [],
      isTaskAccessibleForCurrentUser: () => true,
      canCurrentUserModifyTask: () => true,
      getProjectNameForTask: () => 'Portal',
      showPermissionWarning: () => {},
      currentProfileName: 'Kullanıcı',
      currentProfileAvatar: 'KU',
      currentActorId: 'actor',
      createHistoryEntry: (type, title, description) => ({ type, title, description }),
      setBoardColumns: (updater) => {
        board = typeof updater === 'function' ? updater(board) : updater;
      },
      setDetailTaskInfo: (updater) => {
        detail = typeof updater === 'function' ? updater(detail) : updater;
      },
      syncTaskDetailsToSupabase: async () => false,
      taskDetailSyncQueueRef: { current: new Map() },
      createActivityNotification: () => { activityCount += 1; },
      loadSelectedProjectBoardFromSupabase: async () => { reloadCount += 1; }
    });

    const result = await createZRCBoardTaskActions(deps).addTaskComment(task.id, 'Kaydedilmeyen yorum');

    assert.equal(result, false);
    assert.equal(activityCount, 0);
    assert.equal(reloadCount, 1);
    assert.equal(alertCount, 1);
    assert.equal(deps.taskDetailSyncQueueRef.current.size, 0);
  } finally {
    globalThis.window = previousWindow;
  }
});
