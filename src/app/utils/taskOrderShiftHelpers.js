export const buildTopInsertTaskOrderShiftPlan = (tasks = []) =>
  (Array.isArray(tasks) ? tasks : [])
    .map((task, index) => ({
      taskId: String(task?.id || '').trim(),
      previousOrder: task?.task_order ?? null,
      nextOrder: index + 1
    }))
    .filter((item) => item.taskId)
    .reverse();

export const buildTaskOrderRollbackPlan = (appliedShiftPlan = []) =>
  (Array.isArray(appliedShiftPlan) ? appliedShiftPlan : [])
    .slice()
    .reverse()
    .map((item) => ({
      taskId: item.taskId,
      nextOrder: item.previousOrder
    }));
