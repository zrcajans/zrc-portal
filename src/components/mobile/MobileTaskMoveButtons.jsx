import React from 'react';

export default function MobileTaskMoveButtons({
  task,
  column,
  visibleBoardColumns,
  currentPermissions,
  selectedProject,
  canCurrentUserModifyTask,
  handleMoveTaskToColumn,
  setMobileActiveColumnId
}) {
  if (!currentPermissions?.editTasks) return null;
  if (!canCurrentUserModifyTask(task, selectedProject)) return null;

  const currentColumnIndex = visibleBoardColumns.findIndex((item) => item.id === column.id);
  const previousColumn = currentColumnIndex > 0 ? visibleBoardColumns[currentColumnIndex - 1] : null;
  const nextColumn =
    currentColumnIndex >= 0 && currentColumnIndex < visibleBoardColumns.length - 1
      ? visibleBoardColumns[currentColumnIndex + 1]
      : null;

  if (!previousColumn && !nextColumn) return null;

  return (
    <div className="md:hidden mt-3 pt-2 border-t border-zinc-100 grid grid-cols-2 gap-1.5">
      {previousColumn ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleMoveTaskToColumn(column.id, previousColumn.id, task);
}}
          className="h-9 rounded-[10px] bg-white border border-zinc-200 text-[9.5px] font-black text-zinc-600 active:scale-[0.98] transition-all flex items-center justify-center px-2"
        >
          ← {previousColumn.title}
        </button>
      ) : (
        <span />
      )}

      {nextColumn ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleMoveTaskToColumn(column.id, nextColumn.id, task);
}}
          className="h-9 rounded-[10px] bg-[#ff3600] border border-[#ff3600] text-[9.5px] font-black text-white active:scale-[0.98] transition-all flex items-center justify-center px-2"
        >
          {nextColumn.title} →
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
