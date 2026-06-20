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
    calendarFocusedDate,
    quickNoteMutationLockRef,
    tryAcquireActionLock,
    releaseActionLock
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
    if (!tryAcquireActionLock(quickNoteMutationLockRef, 'save-quick-note')) return;

    try {
      const safeTitle = title || detail.split('\n')[0]?.slice(0, 42) || 'Başlıksız not';
      const text = buildQuickNoteText(safeTitle, detail);

      if (editingQuickNoteId) {
        const existingNote = quickNotes.find((note) => note.id === editingQuickNoteId);

        if (!existingNote) {
          await window.zrcAlert('Düzenlenecek not artık bulunamadı. Listeyi yenileyip tekrar deneyin.');
          return;
        }

        const updatedNote = {
          ...existingNote,
          id: editingQuickNoteId,
          title: safeTitle,
          detail,
          text,
          updatedAt: new Date().toISOString()
        };

        setQuickNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === editingQuickNoteId ? updatedNote : note))
        );

        const didUpdateNote = await updateQuickNoteInSupabase(updatedNote);

        if (!didUpdateNote) {
          setQuickNotes((prevNotes) =>
            prevNotes.map((note) => (note.id === editingQuickNoteId ? existingNote : note))
          );
          await window.zrcAlert('Not güncellenemedi. Taslak korundu; lütfen tekrar deneyin.');
          return;
        }

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

      const didSaveNote = await saveQuickNoteToSupabase(nextNote);

      if (!didSaveNote) {
        setQuickNotes((prevNotes) => prevNotes.filter((note) => note.id !== nextNote.id));
        await window.zrcAlert('Not kaydedilemedi. Taslak korundu; lütfen tekrar deneyin.');
        return;
      }

      resetQuickNoteComposer();
      setIsQuickNoteComposerOpen(false);
    } finally {
      releaseActionLock(quickNoteMutationLockRef, 'save-quick-note');
    }
  };

  const deleteQuickNoteFromHome = async (noteId) => {
    const noteToDelete = quickNotes.find((note) => note.id === noteId);
    const actionKey = `delete-quick-note:${noteId}`;

    if (!noteToDelete || !tryAcquireActionLock(quickNoteMutationLockRef, actionKey)) return;

    try {
      const hasPersistedId = Boolean(
        noteToDelete.supabaseId || String(noteToDelete.id || '').startsWith('supabase-note-')
      );

      if (hasPersistedId) {
        const didDeleteNote = await deleteQuickNoteFromSupabase(noteToDelete);

        if (!didDeleteNote) {
          await window.zrcAlert('Not silinemedi. Sunucu kaydı korunuyor; lütfen tekrar deneyin.');
          return;
        }
      }

      setQuickNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      setPendingDeleteQuickNoteId(null);
    } finally {
      releaseActionLock(quickNoteMutationLockRef, actionKey);
    }
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
