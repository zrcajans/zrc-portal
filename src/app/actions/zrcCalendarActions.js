export function createZRCCalendarActions(deps) {
  const {
    calendarView,
    calendarFocusedDate,
    setCalendarFocusedDate,
    setCalendarMonthDate,
    setCalendarView,
    setIsCalendarDisplayMenuOpen,
    openCalendarQuickTaskCreator,
    setSelectedProject,
    setCalendarTaskModalContext,
    setCalendarQuickTaskDraft,
    setCalendarNewTaskDate,
    getCalendarQuickTaskStatusOptions,
    calendarQuickTaskDraft,
    formatDateForTaskModal,
    currentAccountType,
    isCurrentUserProjectMember,
    projectBoards,
    createDefaultProjectBoard,
    normalizeAssigneesForCurrentAccountSave,
    setProjectBoards,
    createActivityNotification,
    saveTaskToSupabaseForProject
  } = deps;

  const goToPreviousCalendarPeriod = () => {
    if (calendarView === 'Hafta') {
      setCalendarFocusedDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setDate(prevDate.getDate() - 7);
        return nextDate;
      });
      return;
    }

    if (calendarView === 'Gün') {
      setCalendarFocusedDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setDate(prevDate.getDate() - 1);
        return nextDate;
      });
      return;
    }

    setCalendarMonthDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextCalendarPeriod = () => {
    if (calendarView === 'Hafta') {
      setCalendarFocusedDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setDate(prevDate.getDate() + 7);
        return nextDate;
      });
      return;
    }

    if (calendarView === 'Gün') {
      setCalendarFocusedDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setDate(prevDate.getDate() + 1);
        return nextDate;
      });
      return;
    }

    setCalendarMonthDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const goToCurrentCalendarPeriod = () => {
    const now = new Date();
    setCalendarMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setCalendarFocusedDate(now);
  };

  const changeCalendarView = (view) => {
    setCalendarView(view);
    setIsCalendarDisplayMenuOpen(false);

    if (view === 'Ay') {
      setCalendarMonthDate(new Date(calendarFocusedDate.getFullYear(), calendarFocusedDate.getMonth(), 1));
    }
  };

  const openTaskModalForCalendarDay = (date, event = null) => {
    openCalendarQuickTaskCreator(date, event);
  };

  const handleCalendarDayClick = (event, date) => {
    const target = event.target;

    if (target?.closest?.('[data-calendar-task-button="true"]')) {
      return;
    }

    event.stopPropagation();
    setCalendarFocusedDate(date);
    openTaskModalForCalendarDay(date);
  };

  const handleCalendarGridClick = (event) => {
    const target = event.target;

    if (target?.closest?.('[data-calendar-task-button="true"]')) {
      return;
    }

    const dayElement = target?.closest?.('[data-calendar-day]');
    const dateValue = dayElement?.getAttribute?.('data-calendar-day');

    if (!dateValue) return;

    event.stopPropagation();

    const [year, month, day] = dateValue.split('-').map(Number);
    openTaskModalForCalendarDay(new Date(year, month - 1, day));
  };

  const changeCalendarTaskModalProject = (projectName) => {
    setSelectedProject(projectName);
    setCalendarTaskModalContext((prevContext) => ({
      ...prevContext,
      projectName
    }));
  };

  const closeCalendarQuickTaskCreator = () => {
    setCalendarQuickTaskDraft({
      isOpen: false,
      projectName: '',
      title: '',
      description: '',
      status: '',
      date: ''
    });
    setCalendarNewTaskDate(null);
  };

  const updateCalendarQuickTaskProject = (projectName) => {
    const statusOptions = getCalendarQuickTaskStatusOptions(projectName);

    setCalendarQuickTaskDraft((prevDraft) => ({
      ...prevDraft,
      projectName,
      status: statusOptions.includes(prevDraft.status) ? prevDraft.status : statusOptions[0] || 'Yeni Görev'
    }));
  };

  const saveCalendarQuickTaskFromModal = async (event) => {
    event.preventDefault();

    const projectName = calendarQuickTaskDraft.projectName;
    const title = calendarQuickTaskDraft.title.trim();
    const description = calendarQuickTaskDraft.description.trim();
    const taskDate = calendarQuickTaskDraft.date || formatDateForTaskModal(new Date());

    if (!projectName) {
      await window.zrcAlert('Lütfen görev için bir proje seç.');
      return;
    }

    if (!title) {
      await window.zrcAlert('Lütfen görev başlığı yaz.');
      return;
    }

    if (currentAccountType === 'Ekip Üyesi' && !isCurrentUserProjectMember(projectName)) {
      await window.zrcAlert('Bu projede görev oluşturmak için önce Proje Ayarları > Proje Ekibi alanına eklenmelisin.');
      return;
    }

    const projectBoard = projectBoards[projectName] || createDefaultProjectBoard();
    const projectColumns = projectBoard.columns || createDefaultProjectBoard().columns || [];
    const targetStatus = calendarQuickTaskDraft.status || projectColumns[0]?.title || 'Yeni Görev';
    const targetColumn = projectColumns.find((column) => column.title === targetStatus) || projectColumns[0] || {
      id: `col-${Date.now()}`,
      title: targetStatus,
      color: '#55ace8',
      tasks: []
    };

    const nextTask = {
      id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      description,
      note: description,
      priority: 'Normal',
      status: targetColumn.title,
      startDate: taskDate,
      dueDate: '',
      endDate: '',
      date: '',
      assignees: normalizeAssigneesForCurrentAccountSave([], [], false),
      followers: [],
      tags: [],
      customer: '',
      customerId: '',
      steps: [],
      comments: [],
      files: [],
      createdAt: new Date().toISOString()
    };

    setProjectBoards((prevBoards) => {
      const existingBoard = prevBoards[projectName] || createDefaultProjectBoard();
      const existingColumns = existingBoard.columns || createDefaultProjectBoard().columns || [];
      const safeColumns = existingColumns.length > 0 ? existingColumns : [targetColumn];
      const targetColumnIndex = Math.max(0, safeColumns.findIndex((column) => column.title === targetColumn.title));

      return {
        ...prevBoards,
        [projectName]: {
          ...existingBoard,
          columns: safeColumns.map((column, index) =>
            index === targetColumnIndex
              ? {
                  ...column,
                  tasks: [
                    ...(column.tasks || []),
                    nextTask
                  ]
                }
              : column
          )
        }
      };
    });

    setSelectedProject(projectName);

    createActivityNotification({
      type: 'task',
      title: 'Yeni görev oluşturuldu',
      text: nextTask.title,
      meta: `${projectName} · ${targetColumn.title}`,
      task: { ...nextTask, projectName, columnTitle: targetColumn.title },
      columnTitle: targetColumn.title,
      sortWeight: 740
    });

    await saveTaskToSupabaseForProject(projectName, nextTask, targetColumn.title);
    closeCalendarQuickTaskCreator();
  };

  return {
    goToPreviousCalendarPeriod,
    goToNextCalendarPeriod,
    goToCurrentCalendarPeriod,
    changeCalendarView,
    handleCalendarDayClick,
    handleCalendarGridClick,
    changeCalendarTaskModalProject,
    openTaskModalForCalendarDay,
    closeCalendarQuickTaskCreator,
    updateCalendarQuickTaskProject,
    saveCalendarQuickTaskFromModal
  };
}
