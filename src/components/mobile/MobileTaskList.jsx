import MobileTaskCard from './MobileTaskCard';

const zrcMobilePreserveIncomingTaskOrder = (tasks = []) => {
  // zrc-mobile-preserve-incoming-order-v3
  // Mobil burada yeniden sıralama yapmaz.
  // Masaüstü/Core/Supabase tarafından gelen görev sırası neyse onu aynen gösterir.
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
  onMobileTaskMoveToast,
  onOpenTaskDetail
}) {
  const safeBoardColumns = Array.isArray(boardColumns) ? boardColumns : [];
  const safeAllBoardColumns = Array.isArray(allBoardColumns) ? allBoardColumns : safeBoardColumns;

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
            key={task.id || task.supabaseId || task.title}
            task={task}
            normalizeColumnTitleForDisplay={normalizeColumnTitleForDisplay}
            renderProfileAvatar={renderProfileAvatar}
            createAvatarFromName={createAvatarFromName}
            getMobileTaskCardAssignees={getMobileTaskCardAssignees}
            moveMobileTaskToActiveColumn={moveMobileTaskToActiveColumn}
            allBoardColumns={safeAllBoardColumns}
            setMobileActiveColumnId={setMobileActiveColumnId}
            onMobileTaskMoveToast={onMobileTaskMoveToast}
            onOpenTaskDetail={onOpenTaskDetail}
          />
        ))
      )}
    </div>
  );
}
