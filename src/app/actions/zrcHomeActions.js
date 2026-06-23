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

  const createQuickNoteFromMobile = async ({ title = '', detail = '' } = {}) => {
    const normalizedTitle = String(title || '').trim();
    const normalizedDetail = String(detail || '').trim();

    if (!normalizedTitle && !normalizedDetail) return false;
    if (!tryAcquireActionLock(quickNoteMutationLockRef, 'save-mobile-quick-note')) return false;

    try {
      const safeTitle = normalizedTitle || normalizedDetail.split('\n')[0]?.slice(0, 42) || 'Başlıksız not';
      const text = buildQuickNoteText(safeTitle, normalizedDetail);

      const nextNote = {
        id: `quick-note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: safeTitle,
        detail: normalizedDetail,
        text,
        createdAt: new Date().toISOString()
      };

      setQuickNotes((previousNotes) => [
        nextNote,
        ...(Array.isArray(previousNotes) ? previousNotes : [])
      ]);

      const didSaveNote = await saveQuickNoteToSupabase(nextNote);

      if (!didSaveNote) {
        setQuickNotes((previousNotes) =>
          (Array.isArray(previousNotes) ? previousNotes : []).filter((note) => note.id !== nextNote.id)
        );
        await window.zrcAlert('Not kaydedilemedi. Lütfen tekrar deneyin.');
        return false;
      }

      return true;
    } finally {
      releaseActionLock(quickNoteMutationLockRef, 'save-mobile-quick-note');
    }
  };

  const deleteQuickNoteFromHome = async (noteId) => {
    const requestedId = String(noteId || '').trim();
    const noteToDelete = quickNotes.find((note) => {
      const localId = String(note?.id || '').trim();
      const serverId = String(note?.supabaseId || '').trim();
      return localId === requestedId || serverId === requestedId;
    });
    const actionKey = `delete-quick-note:${requestedId}`;

    if (!noteToDelete || !tryAcquireActionLock(quickNoteMutationLockRef, actionKey)) return false;

    try {
      const persistedId = String(noteToDelete?.supabaseId || noteToDelete?.id || '')
        .replace(/^supabase-note-/, '')
        .trim();

      const isPersistedNote = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(persistedId);

      if (isPersistedNote) {
        const didDeleteNote = await deleteQuickNoteFromSupabase(noteToDelete);

        if (!didDeleteNote) {
          await window.zrcAlert('Not silinemedi. Sunucu kaydı korunuyor; lütfen tekrar deneyin.');
          return false;
        }
      }

      const deletedLocalId = String(noteToDelete?.id || '').trim();
      const deletedServerId = String(noteToDelete?.supabaseId || '').trim();

      setQuickNotes((previousNotes) =>
        (Array.isArray(previousNotes) ? previousNotes : []).filter((note) => {
          const localId = String(note?.id || '').trim();
          const serverId = String(note?.supabaseId || '').trim();
          return (
            localId !== deletedLocalId &&
            localId !== deletedServerId &&
            serverId !== deletedLocalId &&
            serverId !== deletedServerId
          );
        })
      );

      setPendingDeleteQuickNoteId(null);
      return true;
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
    createQuickNoteFromMobile,
    deleteQuickNoteFromHome,
    openQuickTaskFromHome,
    openMenuCalendarTask,
    openMenuCalendarQuickTask,
    openHomeCalendarQuickTaskForDate
  };
}
