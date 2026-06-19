import React, { useEffect } from 'react';
import MobileTaskCard from './MobileTaskCard';

const zrcMobileKeepIncomingTaskOrder = (tasks = []) => {
  // zrc-mobile-trust-board-order-only-v2b
  // Mobil kendi içinde yeniden sıralama yapmaz.
  // Masaüstünden/Core'dan gelen görev dizilimini aynen gösterir.
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
    // zrc-mobile-clear-stale-order-cache-only-v2b
    // Sadece mobilde eski yerel görev sırası kalıntıları temizlenir.
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

      if (!window.sessionStorage.getItem('zrc-mobile-order-cache-cleared-v2b')) {
        window.localStorage.removeItem('projectBoards');
        window.sessionStorage.setItem('zrc-mobile-order-cache-cleared-v2b', '1');
      }
    } catch (error) {}
  }, []);


  useEffect(() => {
    // zrc-mobile-clear-stale-order-cache-only-v1
    // Sadece mobil ekranda: eski mobil cache, masaüstü/DB sırasını bozmasın.
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

      // projectBoards cache'i mobilde eski sıra taşıyorsa ilk açılışta bir kere temizlenir.
      if (!window.sessionStorage.getItem('zrc-mobile-order-cache-cleared-once-v1')) {
        window.localStorage.removeItem('projectBoards');
        window.sessionStorage.setItem('zrc-mobile-order-cache-cleared-once-v1', '1');
      }
    } catch (error) {}
  }, []);


  // zrc-mobile-task-order-sync-v1
  // Masaüstünde kaydedilen task_order/taskOrder sırası mobilde de birebir uygulansın.
  const mobileTasks = safeBoardColumns
    .flatMap((column) =>
      zrcMobileKeepIncomingTaskOrder(column.tasks || []).map((task) => ({
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
