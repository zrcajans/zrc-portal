import React, { useEffect } from 'react';
import MobileTaskCard from './MobileTaskCard';

const zrcMobilePreserveIncomingTaskOrder = (tasks = []) => {
  // zrc-mobile-stop-created-date-sort-v1
  // Mobil kesinlikle oluşturulma tarihine göre yeniden sıralama yapmaz.
  // Core/masaüstü/Supabase tarafından gelen görev dizilimini aynen gösterir.
  return Array.isArray(tasks) ? tasks : [];
};

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

  useEffect(() => {
    // zrc-mobile-clear-created-date-sort-cache-v1
    // Mobilde daha önce kalmış yerel sıra cache'i oluşturulma tarihine göre görünümü dayatmasın.
    if (typeof window === 'undefined') return;

    try {
      const isMobile =
        window.matchMedia?.('(max-width: 768px)')?.matches ||
        window.innerWidth <= 768 ||
        /Android|iPhone|iPad|iPod/i.test(window.navigator?.userAgent || '');

      if (!isMobile) return;

      Object.keys(window.localStorage || {}).forEach((key) => {
        if (String(key).startsWith('zrc-task-order-v1:')) {
          window.localStorage.removeItem(key);
        }
      });

      window.localStorage.removeItem('zrc-task-order-saving-until');

      if (!window.sessionStorage.getItem('zrc-mobile-created-date-sort-cache-cleared-v1')) {
        window.localStorage.removeItem('projectBoards');
        window.sessionStorage.setItem('zrc-mobile-created-date-sort-cache-cleared-v1', '1');
      }
    } catch (error) {}
  }, []);

  const mobileTasks = safeBoardColumns.flatMap((column) =>
    zrcMobilePreserveIncomingTaskOrder(column.tasks || []).map((task) => ({
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
