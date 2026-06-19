import React from 'react';
import MobileTaskCard from './MobileTaskCard';

const zrcMobileTaskOrderValue = (task = {}, fallbackIndex = 0) => {
  const candidates = [
    task.task_order,
    task.taskOrder,
    task.order,
    task.sort_order,
    task.sortOrder,
    task.position
  ];

  for (const value of candidates) {
    if (value === null || value === undefined || value === '') continue;

    const numericValue = Number(value);

    if (Number.isFinite(numericValue)) return numericValue;
  }

  return fallbackIndex;
};

const zrcMobileTaskTieBreakerValue = (task = {}, fallbackIndex = 0) => {
  // zrc-mobile-list-preserve-desktop-order-v2
  // Aynı task_order varsa createdAt/updatedAt ile yeniden karıştırma; gelen masaüstü/DB sırasını koru.
  return fallbackIndex;
};

const zrcMobileSortTasksBySavedOrder = (tasks = []) =>
  (Array.isArray(tasks) ? tasks : [])
    .map((task, index) => ({
      task,
      index,
      orderValue: zrcMobileTaskOrderValue(task, index),
      tieBreakerValue: zrcMobileTaskTieBreakerValue(task, index)
    }))
    .sort((first, second) => {
      if (first.orderValue !== second.orderValue) return first.orderValue - second.orderValue;
      if (first.tieBreakerValue !== second.tieBreakerValue) return first.tieBreakerValue - second.tieBreakerValue;

      return first.index - second.index;
    })
    .map((entry) => entry.task);


export default function MobileTaskList({
  boardColumns,
  allBoardColumns,
  normalizeColumnTitleForDisplay,
  renderProfileAvatar,
  createAvatarFromName,
  getMobileTaskCardAssignees,
  moveMobileTaskToActiveColumn,
  setMobileActiveColumnId,
  onMobileTaskMoveToast
}) {
  const safeBoardColumns = Array.isArray(boardColumns) ? boardColumns : [];
  const safeAllBoardColumns = Array.isArray(allBoardColumns) ? allBoardColumns : safeBoardColumns;

  // zrc-mobile-task-order-sync-v1
  // Masaüstünde kaydedilen task_order/taskOrder sırası mobilde de birebir uygulansın.
  const mobileTasks = safeBoardColumns
    .flatMap((column) =>
      zrcMobileSortTasksBySavedOrder(column.tasks || []).map((task) => ({
        ...task,
        columnId: column.id,
        columnTitle: column.title,
        columnColor: column.color
      }))
    );

  return (
    <div className="zrc-mobile-task-list">
      {mobileTasks.length === 0 ? (
        <div className="zrc-mobile-empty-task">
          Bu projede henüz görev yok.
        </div>
      ) : (
        mobileTasks.map((task) => (
          <MobileTaskCard
            key={task.id || task.title}
            task={task}
            normalizeColumnTitleForDisplay={normalizeColumnTitleForDisplay}
            renderProfileAvatar={renderProfileAvatar}
            createAvatarFromName={createAvatarFromName}
            getMobileTaskCardAssignees={getMobileTaskCardAssignees}
            moveMobileTaskToActiveColumn={moveMobileTaskToActiveColumn}
            allBoardColumns={safeAllBoardColumns}
            setMobileActiveColumnId={setMobileActiveColumnId}
            onMobileTaskMoveToast={onMobileTaskMoveToast}
          />
        ))
      )}
    </div>
  );
}
