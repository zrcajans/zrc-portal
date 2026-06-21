const persistenceIdentityKeys = new Set([
  'id',
  'supabaseId',
  'workspaceId',
  'workspace_id',
  'projectId',
  'project_id',
  'columnId',
  'column_id',
  'taskId',
  'task_id'
]);

const omitPersistenceIdentity = (record = {}) => Object.fromEntries(
  Object.entries(record || {}).filter(([key]) => !persistenceIdentityKeys.has(key))
);

export const getUniqueColumnCopyTitle = (sourceTitle = '', columns = []) => {
  const baseTitle = `${String(sourceTitle || 'Kolon').trim() || 'Kolon'} - Kopya`;
  const existingTitles = new Set((columns || []).map((column) => String(column?.title || '').trim()));

  if (!existingTitles.has(baseTitle)) return baseTitle;

  let copyNumber = 2;
  while (existingTitles.has(`${baseTitle} ${copyNumber}`)) copyNumber += 1;
  return `${baseTitle} ${copyNumber}`;
};

export const buildPersistableTaskCopy = (
  sourceTask = {},
  {
    title = `${sourceTask?.title || 'Adsız görev'} - Kopya`,
    status = sourceTask?.status || '',
    taskOrder = 0,
    now = Date.now(),
    copyComments = false,
    copySteps = true
  } = {}
) => ({
  ...omitPersistenceIdentity(sourceTask),
  id: `task-${now}-${taskOrder}`,
  title,
  status,
  taskOrder,
  comments: copyComments
    ? (sourceTask?.comments || []).map(omitPersistenceIdentity)
    : [],
  steps: copySteps
    ? (sourceTask?.steps || []).map(omitPersistenceIdentity)
    : [],
  files: [],
  history: []
});

export const buildPersistableColumnCopy = (sourceColumn = {}, columns = [], now = Date.now()) => {
  const title = getUniqueColumnCopyTitle(sourceColumn?.title, columns);

  return {
    id: `col-${now}`,
    title,
    color: sourceColumn?.color || '#64748b',
    desc: sourceColumn?.desc || sourceColumn?.description || '',
    tasks: (sourceColumn?.tasks || []).map((sourceTask, taskIndex) =>
      buildPersistableTaskCopy(sourceTask, {
        status: title,
        taskOrder: taskIndex,
        now,
        copyComments: true
      })
    )
  };
};
