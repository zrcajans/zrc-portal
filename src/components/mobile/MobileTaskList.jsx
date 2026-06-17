import React from 'react';
import MobileTaskCard from './MobileTaskCard';

export default function MobileTaskList({
  boardColumns,
  allBoardColumns,
  normalizeColumnTitleForDisplay,
  renderProfileAvatar,
  createAvatarFromName,
  getMobileTaskCardAssignees,
  moveMobileTaskToActiveColumn,
  setMobileActiveColumnId
}) {
  const mobileTasks = boardColumns
    .flatMap((column) =>
      (column.tasks || []).map((task) => ({
        ...task,
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
          />
        ))
      )}
    </div>
  );
}
