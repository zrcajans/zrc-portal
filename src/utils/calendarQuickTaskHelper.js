// ZRC calendar quick task helper
// Bu dosya v515 ile App.jsx içinden ayrıldı.
// App içindeki state setterları zrcContext ile gönderilir.

export const openCalendarQuickTaskCreatorHelper = async (date, event = null, zrcContext = {}) => {
  const {
    currentAccountType,
    projectBoards,
    selectedProject,
    setCalendarFocusedDate,
    setCalendarNewTaskDate,
    setCalendarTaskModalContext,
    setEditingTask,
    setIsTaskModalOpen,
    setSelectedProject
  } = zrcContext;


    event?.preventDefault?.();
    event?.stopPropagation?.();

    const now = Date.now();

    if (now - calendarTaskOpenLockRef.current < 220) return;

    calendarTaskOpenLockRef.current = now;

    if (!requirePermission('createTasks', 'Bu rol takvimden görev oluşturamaz.')) return;

    const safeDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
    const safeDateValue = formatDateForTaskModal(safeDate);
    const fallbackProjectName =
      selectedProject ||
      visibleProjectNames[0] ||
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
