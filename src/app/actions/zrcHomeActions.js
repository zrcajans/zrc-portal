export function createZRCHomeActions(deps) {
  const {
    setSelectedProject,
    setActiveContentMenu,
    setActiveMenu,
    setActiveTab,
    openTaskDetail,
    setQuickNoteTitleDraft,
    setQuickNoteDraft,
    setEditingQuickNoteId,
    setPendingDeleteQuickNoteId,
    parseQuickNoteContent,
    setIsQuickNoteComposerOpen,
    quickNoteTitleDraft,
    quickNoteDraft,
    editingQuickNoteId,
    quickNotes,
    buildQuickNoteText,
    setQuickNotes,
    updateQuickNoteInSupabase,
    saveQuickNoteToSupabase,
    deleteQuickNoteFromSupabase,
    ensureCanCreateTaskInSelectedProject,
    setEditingTask,
    setCalendarNewTaskDate,
    setIsTaskModalOpen,
    openCalendarQuickTaskCreator,
    calendarFocusedDate
  } = deps;

  const openHomeTaskDetail = (task) => {
    if (!task) return;

    if (task.projectName) {
      setSelectedProject(task.projectName);
    }

    setActiveContentMenu('Projeler');
    setActiveMenu('Projeler');
    setActiveTab('Görevler');
    openTaskDetail(task, task.columnTitle);
  };

  const resetQuickNoteComposer = () => {
    setQuickNoteTitleDraft('');
    setQuickNoteDraft('');
    setEditingQuickNoteId(null);
    setPendingDeleteQuickNoteId(null);
  };

  const openQuickNoteComposerForEdit = (note = {}) => {
    const parsedNote = parseQuickNoteContent(note);

    setQuickNoteTitleDraft(parsedNote.title === 'Başlıksız not' ? '' : parsedNote.title);
    setQuickNoteDraft(parsedNote.detail || '');
    setEditingQuickNoteId(note.id);
    setPendingDeleteQuickNoteId(null);
    setIsQuickNoteComposerOpen(true);
  };

  const createQuickNoteFromHome = async (event) => {
    event.preventDefault();

    const title = quickNoteTitleDraft.trim();
    const detail = quickNoteDraft.trim();

    if (!title && !detail) return;

    const safeTitle = title || detail.split('\n')[0]?.slice(0, 42) || 'Başlıksız not';
    const text = buildQuickNoteText(safeTitle, detail);

    if (editingQuickNoteId) {
      const existingNote = quickNotes.find((note) => note.id === editingQuickNoteId);
      const updatedNote = {
        ...(existingNote || {}),
        id: editingQuickNoteId,
        title: safeTitle,
        detail,
        text,
        updatedAt: new Date().toISOString()
      };

      setQuickNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === editingQuickNoteId ? updatedNote : note))
      );

      await updateQuickNoteInSupabase(updatedNote);

      resetQuickNoteComposer();
      setIsQuickNoteComposerOpen(false);
      return;
    }

    const nextNote = {
      id: `quick-note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: safeTitle,
      detail,
      text,
      createdAt: new Date().toISOString()
    };

    setQuickNotes((prevNotes) => [
      nextNote,
      ...prevNotes
    ]);

    await saveQuickNoteToSupabase(nextNote);
    resetQuickNoteComposer();
    setIsQuickNoteComposerOpen(false);
  };

  const deleteQuickNoteFromHome = (noteId) => {
    const noteToDelete = quickNotes.find((note) => note.id === noteId);

    if (noteToDelete) {
      deleteQuickNoteFromSupabase(noteToDelete);
    }

    setQuickNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    setPendingDeleteQuickNoteId(null);
  };

  const openQuickTaskFromHome = () => {
    if (!ensureCanCreateTaskInSelectedProject('Bu rol hızlı görev oluşturamaz.')) return;

    setActiveContentMenu('Projeler');
    setActiveMenu('Projeler');
    setActiveTab('Görevler');
    setEditingTask(null);
    setCalendarNewTaskDate(null);
    setIsTaskModalOpen(true);
  };

  const openMenuCalendarTask = (task) => {
    if (!task) return;

    if (task.projectName) {
      setSelectedProject(task.projectName);
    }

    setActiveContentMenu('Projeler');
    setActiveMenu('Projeler');
    setActiveTab('Görevler');
    openTaskDetail(task, task.columnTitle);
  };

  const openMenuCalendarQuickTask = (event = null) => {
    openCalendarQuickTaskCreator(calendarFocusedDate, event);
  };

  const openHomeCalendarQuickTaskForDate = (targetDate, event = null) => {
    openCalendarQuickTaskCreator(targetDate, event);
  };

  return {
    openHomeTaskDetail,
    resetQuickNoteComposer,
    openQuickNoteComposerForEdit,
    createQuickNoteFromHome,
    deleteQuickNoteFromHome,
    openQuickTaskFromHome,
    openMenuCalendarTask,
    openMenuCalendarQuickTask,
    openHomeCalendarQuickTaskForDate
  };
}
