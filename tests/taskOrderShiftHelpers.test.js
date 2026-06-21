import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildTaskOrderRollbackPlan,
  buildTopInsertTaskOrderShiftPlan
} from '../src/app/utils/taskOrderShiftHelpers.js';

test('top insert shifts tasks from the end to avoid order collisions', () => {
  assert.deepEqual(
    buildTopInsertTaskOrderShiftPlan([
      { id: 'task-a', task_order: 0 },
      { id: 'task-b', task_order: 1 },
      { id: 'task-c', task_order: 2 }
    ]),
    [
      { taskId: 'task-c', previousOrder: 2, nextOrder: 3 },
      { taskId: 'task-b', previousOrder: 1, nextOrder: 2 },
      { taskId: 'task-a', previousOrder: 0, nextOrder: 1 }
    ]
  );
});

test('order rollback restores applied shifts from the front', () => {
  const shiftPlan = buildTopInsertTaskOrderShiftPlan([
    { id: 'task-a', task_order: 0 },
    { id: 'task-b', task_order: 1 }
  ]);

  assert.deepEqual(buildTaskOrderRollbackPlan(shiftPlan), [
    { taskId: 'task-a', nextOrder: 0 },
    { taskId: 'task-b', nextOrder: 1 }
  ]);
});
