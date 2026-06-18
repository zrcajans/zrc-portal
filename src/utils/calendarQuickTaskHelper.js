// ZRC calendar quick task helper
// Bu dosya v515 ile App.jsx içinden ayrıldı.
// App içindeki state setterları zrcContext ile gönderilir.

export const openCalendarQuickTaskCreatorHelper = async (date, event = null, zrcContext = {}) => {
  const {
    calendarTaskOpenLockRef,
    currentAccountType,
    formatDateForTaskModal,
    projectBoards,
    requirePermission,
    selectedProject,
    setCalendarFocusedDate,
    setCalendarNewTaskDate,
    setCalendarTaskModalContext,
    setEditingTask,
    setIsTaskModalOpen,
    setSelectedProject,
    visibleProjectNames = []
  } = zrcContext;


    event?.preventDefault?.();
    event?.stopPropagation?.();

    const now = Date.now();
    const safeCalendarTaskOpenLockRef = calendarTaskOpenLockRef || { current: 0 };

    if (now - Number(safeCalendarTaskOpenLockRef.current || 0) < 220) return;

    safeCalendarTaskOpenLockRef.current = now;

    const canCreateCalendarTask =
      typeof requirePermission === 'function'
        ? requirePermission('createTasks', 'Bu rol takvimden görev oluşturamaz.')
        : currentAccountType !== 'Müşteri';

    if (!canCreateCalendarTask) return;

    const safeDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
    const safeFormatDateForTaskModal =
      typeof formatDateForTaskModal === 'function'
        ? formatDateForTaskModal
        : (value) => value.toISOString().slice(0, 10);

    const safeDateValue = safeFormatDateForTaskModal(safeDate);
    const fallbackProjectName =
      selectedProject ||
      (Array.isArray(visibleProjectNames) ? visibleProjectNames[0] : '') ||
      Object.keys(projectBoards || {})[0] ||
      '';

    if (!fallbackProjectName) {
      await window.zrcAlert('Görev oluşturmak için önce proje oluşturmalısın.');
      return;
    }

    if (currentAccountType === 'Müşteri') {
      await window.zrcAlert('Müşteri/Misafir hesabı görev oluşturamaz.');
      return;
    }

    setCalendarFocusedDate(safeDate);
    setCalendarNewTaskDate(safeDateValue);
    setEditingTask(null);
    setSelectedProject(fallbackProjectName);
    setCalendarTaskModalContext({
      isOpen: true,
      pendingOpen: false,
      projectName: fallbackProjectName,
      date: safeDateValue
    });
    setIsTaskModalOpen(true);
  };
