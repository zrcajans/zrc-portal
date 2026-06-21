import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildPersistableColumnCopy,
  getUniqueColumnCopyTitle
} from '../src/app/utils/columnCopyHelpers.js';

test('column copy titles remain unique on the current board', () => {
  const columns = [
    { title: 'Aktif' },
    { title: 'Aktif - Kopya' },
    { title: 'Aktif - Kopya 2' }
  ];

  assert.equal(getUniqueColumnCopyTitle('Aktif', columns), 'Aktif - Kopya 3');
});

test('copied tasks never reuse persisted ids or storage objects', () => {
  const copiedColumn = buildPersistableColumnCopy({
    id: 'persisted-column',
    title: 'Aktif',
    tasks: [{
      id: 'persisted-task',
      supabaseId: 'task-row',
      columnId: 'persisted-column',
      title: 'Görev',
      comments: [{ id: 'comment-local', supabaseId: 'comment-row', text: 'Not' }],
      steps: [{ id: 'step-local', supabaseId: 'step-row', text: 'Adım' }],
      files: [{ id: 'file-local', supabaseId: 'file-row', storagePath: 'workspace/file' }],
      history: [{ id: 'history-local' }]
    }]
  }, [], 123);

  const copiedTask = copiedColumn.tasks[0];
  assert.equal(copiedTask.id, 'task-123-0');
  assert.equal(copiedTask.supabaseId, undefined);
  assert.equal(copiedTask.columnId, undefined);
  assert.equal(copiedTask.comments[0].id, undefined);
  assert.equal(copiedTask.comments[0].supabaseId, undefined);
  assert.equal(copiedTask.steps[0].id, undefined);
  assert.equal(copiedTask.steps[0].supabaseId, undefined);
  assert.deepEqual(copiedTask.files, []);
  assert.deepEqual(copiedTask.history, []);
});
