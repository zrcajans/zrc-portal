export function createZRCBoardTaskActions(deps) {
  const {
    requirePermission,
    setEditingColumn,
    setIsStageModalOpen,
    setOpenMenuColumnId,
    boardColumns,
    setBoardColumns,
    editingColumn,
    normalizeColumnTitleForDisplay,
    selectedProject,
    normalizeStorageArray,
    readStorageValue,
    writeStorageValue,
    setMobileActiveColumnId,
    setZrcMobileColumnRefreshKey,
    saveStageToSupabase,
    setTimeout,
    loadSelectedProjectBoardFromSupabase,
    getCurrentSupabaseWorkspaceId,
    zrcSetSupabaseWriteInfo,
    ensureSupabaseProject,
    supabase,
    isSupabaseUuid,
    currentActorName,
    currentActorAvatar,
    currentActorId,
    setArchivedTasks,
    archiveSupabaseTask,
    isTaskAccessibleForCurrentUser,
    showPermissionWarning,
    setOpenTaskMenuId,
    setDetailTaskInfo,
    detailTaskInfo,
    currentAccountType,
    isCurrentUserProjectMember,
    canCurrentUserModifyTask,
    getProjectNameForTask,
    setEditingTask,
    setIsTaskModalOpen,
    reportTasks,
    createActivityNotification,
    getProfileNameForRecord,
    currentProfileName,
    getProfileAvatarForRecord,
    currentProfileAvatar,
    getTaskAssigneeUserIdsForNotification,
    isCurrentSupabaseUserId,
    syncTaskDetailsToSupabase,
    createHistoryEntry,
    currentPermissions,
    updateSupabaseTaskColumn,
    ensureCanCreateTaskInSelectedProject,
    normalizeAssigneesForCurrentAccountSave,
    setSelectedTasks,
    deleteSupabaseTask,
    selectedTasks,
    restoreSupabaseTask,
    archivedTasks,
    draggedTaskInfo
  } = deps;

  const openAddStageModal = () => {
    if (!requirePermission('manageColumns', 'Yeni kolon ekleme yetkisi sadece Yönetici rolünde var.')) return;

    setEditingColumn({
      id: `col-${Date.now()}`,
      title: '',
      color: '#64748b',
      desc: 'Bu aşamada bekleyen işler yer alır.',
      tasks: []
    });
    setIsStageModalOpen(true);
    setOpenMenuColumnId(null);
  };

  const openEditStageModal = (column) => {
    if (!requirePermission('manageColumns', 'Kolon düzenleme yetkisi sadece Yönetici rolünde var.')) return;

    setEditingColumn(column);
    setIsStageModalOpen(true);
    setOpenMenuColumnId(null);
  };

  const handleMoveColumn = (index, direction) => {
    if (!requirePermission('manageColumns', 'Kolon sıralama yetkisi sadece Yönetici rolünde var.')) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= boardColumns.length) return;

    const nextColumns = [...boardColumns];
    [nextColumns[index], nextColumns[targetIndex]] = [nextColumns[targetIndex], nextColumns[index]];

    setBoardColumns(nextColumns);

    const persistColumnOrderToSupabase = async () => {
      const workspaceId =
        typeof getCurrentSupabaseWorkspaceId === 'function'
          ? getCurrentSupabaseWorkspaceId()
          : null;

      if (!workspaceId || !selectedProject || !supabase) return;

      const isUuid = (value = '') =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || '').trim());

      try {
        if (typeof zrcSetSupabaseWriteInfo === 'function') {
          zrcSetSupabaseWriteInfo('saving', 'Supabase kolon sırası kaydediliyor');
        }

        const projectId =
          typeof ensureSupabaseProject === 'function'
            ? await ensureSupabaseProject(selectedProject)
            : null;

        if (!projectId) return;

        for (const [position, column] of nextColumns.entries()) {
          const columnTitle = normalizeColumnTitleForDisplay(column?.title || 'Yeni Görev');
          const columnId = String(column?.id || '').trim();

          let query = supabase
            .from('board_columns')
            .update({ position })
            .eq('workspace_id', workspaceId)
            .eq('project_id', projectId);

          if (isUuid(columnId)) {
            query = query.eq('id', columnId);
          } else {
            query = query.eq('title', columnTitle);
          }

          const { error } = await query;

          if (error) throw error;
        }

        if (typeof zrcSetSupabaseWriteInfo === 'function') {
          zrcSetSupabaseWriteInfo('saved', 'Supabase kolon sırası kaydedildi');
        }
      } catch (error) {
        console.warn('Kolon sırası Supabase kaydı başarısız:', error);

        if (typeof zrcSetSupabaseWriteInfo === 'function') {
          zrcSetSupabaseWriteInfo('error', `Supabase kolon sırası kaydedilemedi: ${error?.message || 'bilinmeyen hata'}`);
        }
      }
    };

    persistColumnOrderToSupabase();
  };

  const handleSaveStage = async (updatedColumn) => {
    if (!requirePermission('manageColumns', 'Kolonları sadece Yönetici düzenleyebilir.')) return;

    const columnToSave = {
      ...(editingColumn || {}),
      ...(updatedColumn || {}),
      id: editingColumn?.id || updatedColumn?.id || `col-${Date.now()}`,
      title: normalizeColumnTitleForDisplay(updatedColumn?.title || editingColumn?.title || 'Yeni Görev'),
      tasks: updatedColumn?.tasks || editingColumn?.tasks || []
    };

    const deletedColumnStorageKey = `zrc-deleted-column-titles-${selectedProject}`;
    const savedColumnTitleKey = normalizeColumnTitleForDisplay(columnToSave.title);
    const cleanedDeletedColumnTitles = normalizeStorageArray(readStorageValue(deletedColumnStorageKey, []), [])
      .filter((title) => normalizeColumnTitleForDisplay(title) !== savedColumnTitleKey);
    writeStorageValue(deletedColumnStorageKey, cleanedDeletedColumnTitles);

    const zrcV458IsNewColumn = !boardColumns.some(
      (col) => col.id === columnToSave.id || normalizeColumnTitleForDisplay(col.title) === normalizeColumnTitleForDisplay(columnToSave.title)
    );

    setBoardColumns((prev) => {
      const exists = prev.some((col) => col.id === columnToSave.id);

      if (exists) {
        return prev.map((col) => (col.id === columnToSave.id ? { ...col, ...columnToSave } : col));
      }

      return [...prev, { ...columnToSave, tasks: columnToSave.tasks || [] }];
    });

    // zrc-v458-mobile-new-column-live-capsule
    if (zrcV458IsNewColumn) {
      setMobileActiveColumnId(columnToSave.id);
    }

    setZrcMobileColumnRefreshKey((value) => value + 1);

    window.setTimeout(() => {
      setZrcMobileColumnRefreshKey((value) => value + 1);
    }, 120);

    const didSaveStageToSupabase = await saveStageToSupabase(columnToSave);

    if (didSaveStageToSupabase) {
      setTimeout(() => {
        loadSelectedProjectBoardFromSupabase();
        // zrc-v458-mobile-refresh-after-supabase-reload
        setZrcMobileColumnRefreshKey((value) => value + 1);
      }, 500);
    }

    setIsStageModalOpen(false);
    setEditingColumn(null);
  };

  const handleDeleteColumn = async (columnId) => {
    if (!requirePermission('manageColumns', 'Kolon silme yetkisi sadece Yönetici rolünde var.')) return;

    const columnToDelete = boardColumns.find((column) => column.id === columnId);
    const confirmed = await window.zrcConfirm('Bu kolonu ve içindeki tüm görevleri kalıcı olarak silmek istediğine emin misin?');
    if (!confirmed) return;

    const deletedColumnTitleKey = normalizeColumnTitleForDisplay(columnToDelete?.title || '');
    const deletedColumnStorageKey = `zrc-deleted-column-titles-${selectedProject}`;
    const previousDeletedColumnTitles = normalizeStorageArray(readStorageValue(deletedColumnStorageKey, []), []);

    if (deletedColumnTitleKey && !previousDeletedColumnTitles.map(normalizeColumnTitleForDisplay).includes(deletedColumnTitleKey)) {
      writeStorageValue(deletedColumnStorageKey, [...previousDeletedColumnTitles, deletedColumnTitleKey]);
    }

    setBoardColumns((prev) => prev.filter((col) => col.id !== columnId));
    setOpenMenuColumnId(null);

    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !selectedProject || !columnToDelete) {
      zrcSetSupabaseWriteInfo('saved', 'Kolon yerelden silindi');
      return;
    }

    zrcSetSupabaseWriteInfo('saving', 'Supabase kolon siliniyor');

    try {
      const projectId = await ensureSupabaseProject(selectedProject);
      if (!projectId) throw new Error('Proje ID bulunamadı');

      const { data: projectColumns, error: columnsSelectError } = await supabase
        .from('board_columns')
        .select('id, title')
        .eq('project_id', projectId);

      if (columnsSelectError) throw columnsSelectError;

      const targetTitleKey = normalizeColumnTitleForDisplay(columnToDelete.title);
      const columnIdsToDelete = (projectColumns || [])
        .filter((column) => {
          const columnTitleKey = normalizeColumnTitleForDisplay(column.title);
          return column.id === columnId || columnTitleKey === targetTitleKey;
        })
        .map((column) => column.id)
        .filter(isSupabaseUuid);

      const localTaskIdsToDelete = (columnToDelete.tasks || [])
        .map((task) => task.supabaseId)
        .filter(isSupabaseUuid);

      let dbTaskIdsToDelete = [];

      if (columnIdsToDelete.length > 0) {
        const { data: columnTasks, error: columnTasksError } = await supabase
          .from('tasks')
          .select('id')
          .in('column_id', columnIdsToDelete);

        if (columnTasksError) throw columnTasksError;

        dbTaskIdsToDelete = (columnTasks || []).map((task) => task.id).filter(isSupabaseUuid);
      }

      const taskIdsToDelete = [...new Set([...localTaskIdsToDelete, ...dbTaskIdsToDelete])];

      if (taskIdsToDelete.length > 0) {
        const { error: taskDeleteError } = await supabase
          .from('tasks')
          .delete()
          .in('id', taskIdsToDelete);

        if (taskDeleteError) throw taskDeleteError;
      }

      if (columnIdsToDelete.length > 0) {
        const { error: columnDeleteError } = await supabase
          .from('board_columns')
          .delete()
          .in('id', columnIdsToDelete);

        if (columnDeleteError) throw columnDeleteError;
      } else {
        const titleCandidates = [...new Set([
          columnToDelete.title,
          normalizeColumnTitleForDisplay(columnToDelete.title),
          targetTitleKey === 'Yeni Görev' ? 'Bekliyor' : ''
        ].filter(Boolean))];

        const { error: titleDeleteError } = await supabase
          .from('board_columns')
          .delete()
          .eq('project_id', projectId)
          .in('title', titleCandidates);

        if (titleDeleteError) throw titleDeleteError;
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase kolon silindi');
      setTimeout(() => loadSelectedProjectBoardFromSupabase(), 700);
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase kolon silme hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
  };

  const handleCopyColumn = (column, index) => {
    if (!requirePermission('manageColumns', 'Kolon kopyalama yetkisi sadece Yönetici rolünde var.')) return;

    const now = Date.now();

    const copiedColumn = {
      id: `col-${now}`,
      title: `${column.title} - Kopya`,
      color: column.color,
      desc: column.desc,
      tasks: (column.tasks || []).map((task, taskIndex) => ({
        ...task,
        id: `task-${now}-${taskIndex}`,
        title: `${task.title} - Kopya`,
        history: [
          {
            id: `history-${now}-${taskIndex}`,
            type: 'description',
            title: 'Görev kopyalandı',
            description: `${task.title} görevinden kolon kopyası içinde yeni görev oluşturuldu.`,
            actor: currentActorName,
            avatar: currentActorAvatar,
            userId: currentActorId,
            date: `${new Date().getDate()} ${new Date().toLocaleString('tr-TR', { month: 'long' })} ${new Date().getFullYear()}`,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          },
          ...(task.history || [])
        ]
      }))
    };

    setBoardColumns((prev) => {
      const updated = [...prev];
      updated.splice(index + 1, 0, copiedColumn);
      return updated;
    });

    setOpenMenuColumnId(null);
  };

  const handleArchiveColumnTasks = async (column) => {
    if (!requirePermission('deleteTasks', 'Kolondaki görevleri arşivleme yetkisi sadece Yönetici rolünde var.')) return;

    const tasksToArchive = column.tasks || [];

    if (tasksToArchive.length === 0) {
      await window.zrcAlert('Bu kolonda arşivlenecek görev yok.');
      setOpenMenuColumnId(null);
      return;
    }

    const confirmed = await window.zrcConfirm(`${column.title} kolonundaki tüm görevleri arşivlemek istediğine emin misin?`);
    if (!confirmed) return;

    setArchivedTasks((prev) => [
      ...tasksToArchive.map((task) => ({
        ...task,
        archivedAt: new Date().toISOString(),
        sourceColumnId: column.id,
        sourceColumnTitle: column.title
      })),
      ...prev
    ]);

    tasksToArchive.forEach((task) => archiveSupabaseTask({
      ...task,
      sourceColumnId: column.id,
      sourceColumnTitle: column.title
    }));

    setBoardColumns((prev) =>
      prev.map((col) =>
        col.id === column.id ? { ...col, tasks: [] } : col
      )
    );

    setOpenMenuColumnId(null);
  };

  const handleArchiveColumn = async (column) => {
    if (!requirePermission('manageColumns', 'Kolon arşivleme yetkisi sadece Yönetici rolünde var.')) return;

    const confirmed = await window.zrcConfirm(`${column.title} kolonunu arşivlemek istediğine emin misin? Kolondaki görevler de Arşiv sekmesine taşınır.`);
    if (!confirmed) return;

    const tasksToArchive = column.tasks || [];

    if (tasksToArchive.length > 0) {
      setArchivedTasks((prev) => [
        ...tasksToArchive.map((task) => ({
          ...task,
          archivedAt: new Date().toISOString(),
          sourceColumnId: column.id
        })),
        ...prev
      ]);

      tasksToArchive.forEach((task) => archiveSupabaseTask({
        ...task,
        sourceColumnId: column.id,
        sourceColumnTitle: column.title
      }));
    }

    setBoardColumns((prev) => prev.filter((col) => col.id !== column.id));
    setOpenMenuColumnId(null);

    if (!isSupabaseUuid(column.id)) return;

    zrcSetSupabaseWriteInfo('saving', 'Supabase kolon arşivleniyor');

    try {
      const { error } = await supabase
        .from('board_columns')
        .update({ is_archived: true })
        .eq('id', column.id);

      if (error) throw error;

      zrcSetSupabaseWriteInfo('saved', 'Supabase kolon arşivlendi');
      setTimeout(() => loadSelectedProjectBoardFromSupabase(), 500);
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase kolon arşiv hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
  };

  const openTaskDetail = (task, columnTitle) => {
    if (task && !isTaskAccessibleForCurrentUser(task)) {
      showPermissionWarning('Bu görevi görüntüleme yetkin yok.');
      return;
    }

    setOpenTaskMenuId(null);
    setOpenMenuColumnId(null);
    setDetailTaskInfo({ task, columnTitle });
  };

  const closeTaskDetail = () => {
    setDetailTaskInfo(null);
  };

  const editTaskFromDetail = () => {
    if (!detailTaskInfo?.task) return;
    if (!requirePermission('editTasks', 'Bu rol görev düzenleyemez.')) return;

    if (currentAccountType === 'Ekip Üyesi' && !isCurrentUserProjectMember(selectedProject)) {
      showPermissionWarning('Bu projede görev düzenleme yetkin yok.');
      return;
    }

    if (!canCurrentUserModifyTask(detailTaskInfo.task, getProjectNameForTask(detailTaskInfo.task) || selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için düzenleyemezsin.');
      return;
    }

    setEditingTask({
      ...detailTaskInfo.task,
      status: detailTaskInfo.columnTitle || 'Bekliyor'
    });

    setDetailTaskInfo(null);
    setIsTaskModalOpen(true);
  };

  const updateTaskFromDetail = (taskId, updates, historyEntry = null) => {
    if (historyEntry?.type?.startsWith('file') && !requirePermission('manageFiles', 'Bu rol dosya ekleyemez veya silemez.')) return;
    if (['description', 'step', 'step-delete'].includes(historyEntry?.type) && !requirePermission('editTasks', 'Bu rol görev detaylarını düzenleyemez.')) return;

    const sourceTask = detailTaskInfo?.task || reportTasks.find((task) => task.id === taskId) || null;
    const sourceColumnTitle = detailTaskInfo?.columnTitle || sourceTask?.columnTitle || '';

    if (sourceTask && !isTaskAccessibleForCurrentUser(sourceTask)) {
      showPermissionWarning('Bu görev üzerinde işlem yapma yetkin yok.');
      return;
    }

    if (sourceTask && !canCurrentUserModifyTask(sourceTask, getProjectNameForTask(sourceTask) || selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için işlem yapamazsın.');
      return;
    }

    setBoardColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => {
          if (task.id !== taskId) return task;

          const nextTask = { ...task, ...updates };

          if (historyEntry) {
            nextTask.history = [historyEntry, ...(task.history || [])];
          }

          return nextTask;
        })
      }))
    );

    setDetailTaskInfo((prev) => {
      if (prev?.task?.id !== taskId) return prev;

      const nextTask = { ...prev.task, ...updates };

      if (historyEntry) {
        nextTask.history = [historyEntry, ...(prev.task.history || [])];
      }

      return { ...prev, task: nextTask };
    });

    if (historyEntry?.type === 'file') {
      createActivityNotification({
        type: 'file',
        title: historyEntry.title || 'Dosya eklendi',
        text: historyEntry.description || sourceTask?.title || 'Dosya',
        meta: `${sourceTask?.title || 'Görev'} · ${selectedProject}`,
        task: sourceTask ? { ...sourceTask, ...updates } : null,
        columnTitle: sourceColumnTitle,
        actor: getProfileNameForRecord(historyEntry, currentProfileName),
        avatar: getProfileAvatarForRecord(historyEntry, currentProfileAvatar),
        targetUserIds: getTaskAssigneeUserIdsForNotification(sourceTask || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
        sortWeight: 780
      });
    }

    if (historyEntry?.type === 'description') {
      createActivityNotification({
        type: 'history',
        title: historyEntry.title || 'Görev güncellendi',
        text: sourceTask?.title || 'Görev',
        meta: `${sourceColumnTitle || 'Görev'} · ${selectedProject}`,
        task: sourceTask ? { ...sourceTask, ...updates } : null,
        columnTitle: sourceColumnTitle,
        actor: getProfileNameForRecord(historyEntry, currentProfileName),
        avatar: getProfileAvatarForRecord(historyEntry, currentProfileAvatar),
        targetUserIds: getTaskAssigneeUserIdsForNotification(sourceTask || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
        sortWeight: 520
      });
    }

    const shouldSyncDetailUpdate =
      Array.isArray(updates.comments) ||
      Array.isArray(updates.steps) ||
      Array.isArray(updates.files) ||
      historyEntry?.type === 'description';

    if (shouldSyncDetailUpdate) {
      syncTaskDetailsToSupabase(taskId, updates, {
        syncDescription: historyEntry?.type === 'description'
      });
    }
  };

  const addTaskComment = (taskId, commentText) => {
    const sourceTask = detailTaskInfo?.task || reportTasks.find((task) => task.id === taskId) || null;

    if (sourceTask && !canCurrentUserModifyTask(sourceTask, getProjectNameForTask(sourceTask) || selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için yorum ekleyemezsin.');
      return;
    }

    const cleanComment = commentText.trim();
    if (!cleanComment) return;

    const now = new Date();

    const newComment = {
      id: `comment-${Date.now()}`,
      author: currentProfileName,
      avatar: currentProfileAvatar,
      userId: currentActorId,
      text: cleanComment,
      createdAt: now.toISOString(),
      date: `${now.getDate()} ${now.toLocaleString('tr-TR', { month: 'long' })} ${now.getFullYear()}`,
      time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    const currentComments = detailTaskInfo?.task?.comments || [];
    updateTaskFromDetail(
      taskId,
      { comments: [...currentComments, newComment] },
      createHistoryEntry('comment', 'Yorum eklendi', cleanComment)
    );

    createActivityNotification({
      type: 'comment',
      title: 'Yeni yorum',
      text: cleanComment,
      meta: `${detailTaskInfo?.task?.title || 'Görev'} · ${currentProfileName}`,
      task: detailTaskInfo?.task || null,
      columnTitle: detailTaskInfo?.columnTitle || '',
      targetUserIds: getTaskAssigneeUserIdsForNotification(detailTaskInfo?.task || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
      sortWeight: 860
    });
  };

  const deleteTaskComment = (taskId, commentId) => {
    const sourceTask = detailTaskInfo?.task || reportTasks.find((task) => task.id === taskId) || null;

    if (sourceTask && !canCurrentUserModifyTask(sourceTask, getProjectNameForTask(sourceTask) || selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için yorum silemezsin.');
      return;
    }

    const currentComments = detailTaskInfo?.task?.comments || [];
    const deletedComment = currentComments.find((comment) => comment.id === commentId);

    updateTaskFromDetail(
      taskId,
      {
        comments: currentComments.filter((comment) => comment.id !== commentId)
      },
      createHistoryEntry('comment-delete', 'Yorum silindi', deletedComment?.text || '')
    );
  };

  const handleMoveTaskToColumn = (sourceColumnId, targetColumnId, task = {}) => {
    setOpenTaskMenuId(null);

    if (!currentPermissions.editTasks) {
      showPermissionWarning('Bu rol görev durumunu değiştiremez.');
      return;
    }

    const sourceColumn = boardColumns.find((column) => column.id === sourceColumnId);
    const targetColumn = boardColumns.find((column) => column.id === targetColumnId);

    if (!sourceColumn || !targetColumn || sourceColumnId === targetColumnId) return;

    const sourceTask = sourceColumn.tasks.find((item) => item.id === task.id) || task;

    if (!sourceTask?.id) return;

    if (!canCurrentUserModifyTask(sourceTask, selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için durumunu değiştiremezsin.');
      return;
    }

    const movedTask = {
      ...sourceTask,
      status: targetColumn.title,
      columnTitle: targetColumn.title
    };

    /* === ZRC PREVIEW DROP FINALIZE WITHOUT APPEND START === */
    if (draggedTaskInfo.current?.hasPreviewMoved) {
      const finalColumnAfterPreview = boardColumns.find((column) =>
        (column.tasks || []).some((task) => task.id === taskId)
      );

      const finalTaskAfterPreview =
        finalColumnAfterPreview?.tasks?.find((task) => task.id === taskId) || taskBeforeMove;

      const finalTargetColumn =
        finalColumnAfterPreview || boardColumns.find((column) => column.id === targetColId);

      const finalColumnId = finalTargetColumn?.id || targetColId;

      if (taskBeforeMove && originalSourceColId !== finalColumnId) {
        createActivityNotification({
          type: 'status',
          title: 'Görev durumu değişti',
          text: taskBeforeMove.title || 'Adsız görev',
          meta: `${sourceColumnBeforeMove?.title || 'Eski durum'} → ${finalTargetColumn?.title || 'Yeni durum'}`,
          task: { ...taskBeforeMove, columnTitle: finalTargetColumn?.title },
          columnTitle: finalTargetColumn?.title,
          targetUserIds: getTaskAssigneeUserIdsForNotification(taskBeforeMove || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
          sortWeight: 820
        });

        if (finalTargetColumn) {
          updateSupabaseTaskColumn(finalTaskAfterPreview || taskBeforeMove, finalTargetColumn);
        }
      }

      draggedTaskInfo.current = null;
      zrcClearDesktopDragSource();

      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('zrc-desktop-task-live-previewing');
      }

      return;
    }
    /* === ZRC PREVIEW DROP FINALIZE WITHOUT APPEND END === */

    setBoardColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((column) => ({
        ...column,
        tasks: [...(column.tasks || [])]
      }));

      const nextSourceColumn = updatedColumns.find((column) => column.id === sourceColumnId);
      const nextTargetColumn = updatedColumns.find((column) => column.id === targetColumnId);

      if (!nextSourceColumn || !nextTargetColumn) return prevColumns;

      nextSourceColumn.tasks = nextSourceColumn.tasks.filter((item) => item.id !== sourceTask.id);
      nextTargetColumn.tasks = [...nextTargetColumn.tasks, movedTask];

      return updatedColumns;
    });

    createActivityNotification({
      type: 'status',
      title: 'Görev durumu değişti',
      text: sourceTask.title || 'Adsız görev',
      meta: `${sourceColumn.title || 'Eski durum'} → ${targetColumn.title || 'Yeni durum'}`,
      task: movedTask,
      columnTitle: targetColumn.title,
      targetUserIds: getTaskAssigneeUserIdsForNotification(sourceTask || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
      sortWeight: 820
    });

    updateSupabaseTaskColumn(movedTask, targetColumn);
  };

  const handleTaskAction = async (action, columnId, task) => {
    setOpenTaskMenuId(null);

    const columnTitle = boardColumns.find((column) => column.id === columnId)?.title || task.status || 'Yeni Görev';

    if (action === 'detay') {
      openTaskDetail(task, columnTitle);
      return;
    }

    if (action === 'duzenle') {
      if (!requirePermission('editTasks', 'Bu rol görev düzenleyemez.')) return;

      if (currentAccountType === 'Ekip Üyesi' && !isCurrentUserProjectMember(selectedProject)) {
        showPermissionWarning('Bu projede görev düzenleme yetkin yok.');
        return;
      }

      if (!canCurrentUserModifyTask(task, selectedProject)) {
        showPermissionWarning('Bu görev sana atanmadığı için düzenleyemezsin.');
        return;
      }

      setEditingTask({ ...task, status: columnTitle });
      setIsTaskModalOpen(true);
      return;
    }

    if (action === 'kopyala') {
      if (!ensureCanCreateTaskInSelectedProject('Bu rol görev kopyalayamaz.')) return;

      if (currentAccountType === 'Ekip Üyesi' && !canCurrentUserModifyTask(task, selectedProject)) {
        showPermissionWarning('Bu görev sana atanmadığı için kopyalayamazsın.');
        return;
      }

      const copiedTask = {
        ...task,
        id: `task-${Date.now()}`,
        assignees: normalizeAssigneesForCurrentAccountSave(task.assignees || [], [], false),
        followers: [],
        title: `${task.title} - Kopya`,
        comments: [],
        files: [],
        history: [
          {
            id: `history-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            type: 'description',
            title: 'Görev kopyalandı',
            description: `${task.title} görevinden kopya oluşturuldu.`,
            actor: currentActorName,
            avatar: currentActorAvatar,
            userId: currentActorId,
            date: `${new Date().getDate()} ${new Date().toLocaleString('tr-TR', { month: 'long' })} ${new Date().getFullYear()}`,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };

      setBoardColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, tasks: [copiedTask, ...col.tasks] } : col
        )
      );
      return;
    }

    if (action === 'arsivle') {
      if (!requirePermission('deleteTasks', 'Görev arşivleme yetkisi sadece Yönetici rolünde var.')) return;

      setArchivedTasks((prev) => [{ ...task, archivedAt: new Date().toISOString(), sourceColumnId: columnId, sourceColumnTitle: columnTitle }, ...prev]);

      setBoardColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((item) => item.id !== task.id) }
            : col
        )
      );

      archiveSupabaseTask({ ...task, sourceColumnId: columnId, sourceColumnTitle: columnTitle });

      setSelectedTasks((prev) => prev.filter((id) => id !== task.id));
      if (detailTaskInfo?.task?.id === task.id) setDetailTaskInfo(null);
      return;
    }

    if (action === 'sil') {
      if (!requirePermission('deleteTasks', 'Görev silme yetkisi sadece Yönetici rolünde var.')) return;

      const confirmed = await window.zrcConfirm('Bu görevi silmek istediğine emin misin?');
      if (!confirmed) return;

      setBoardColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((item) => item.id !== task.id) }
            : col
        )
      );

      deleteSupabaseTask(task);

      setSelectedTasks((prev) => prev.filter((id) => id !== task.id));
      if (detailTaskInfo?.task?.id === task.id) setDetailTaskInfo(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!requirePermission('deleteTasks', 'Toplu görev silme yetkisi sadece Yönetici rolünde var.')) return;

    if (await window.zrcConfirm(`${selectedTasks.length} görevi silmek istediğinize emin misiniz?`)) {
      const tasksToDelete = [];

      boardColumns.forEach((col) => {
        col.tasks.forEach((task) => {
          if (selectedTasks.includes(task.id)) {
            tasksToDelete.push(task);
          }
        });
      });

      tasksToDelete.forEach((task) => deleteSupabaseTask(task));

      setBoardColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.filter((t) => !selectedTasks.includes(t.id))
        }))
      );

      setSelectedTasks([]);
    }
  };

  const handleBulkArchive = async () => {
    if (!requirePermission('deleteTasks', 'Toplu görev arşivleme yetkisi sadece Yönetici rolünde var.')) return;

    const tasksToArchive = [];

    boardColumns.forEach((col) => {
      col.tasks.forEach((t) => {
        if (selectedTasks.includes(t.id)) {
          tasksToArchive.push({
            ...t,
            archivedAt: new Date().toISOString(),
            sourceColumnId: col.id,
            sourceColumnTitle: col.title
          });
        }
      });
    });

    tasksToArchive.forEach((task) => archiveSupabaseTask(task));

    setArchivedTasks((prev) => [...prev, ...tasksToArchive]);

    setBoardColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => !selectedTasks.includes(t.id))
      }))
    );

    setSelectedTasks([]);
    await window.zrcAlert(`${tasksToArchive.length} görev arşivlendi.`);
  };

  const handleRestoreArchivedTask = (task) => {
    if (!requirePermission('deleteTasks', 'Arşivden geri getirme yetkisi sadece Yönetici rolünde var.')) return;

    const restoredTask = { ...task };
    delete restoredTask.archivedAt;
    delete restoredTask.sourceColumnId;
    delete restoredTask.sourceColumnTitle;

    setArchivedTasks((prev) => prev.filter((archivedTask) => archivedTask.id !== task.id));

    setBoardColumns((prev) => {
      const updatedColumns = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));
      const originalColumnIndex = updatedColumns.findIndex((col) => col.id === task.sourceColumnId);
      const waitingColumnIndex = updatedColumns.findIndex((col) => col.title === 'Bekliyor' || col.title.includes('Bekliyor'));
      const targetIndex = originalColumnIndex !== -1 ? originalColumnIndex : waitingColumnIndex !== -1 ? waitingColumnIndex : 0;

      const targetColumn = updatedColumns[targetIndex];
      restoreSupabaseTask(restoredTask, targetColumn);

      updatedColumns[targetIndex].tasks.push(restoredTask);

      return updatedColumns;
    });
  };

  const handleDeleteArchivedTask = async (taskId) => {
    const confirmed = await window.zrcConfirm('Bu arşiv kaydını kalıcı olarak silmek istediğine emin misin?');
    if (!confirmed) return;

    const archivedTask = archivedTasks.find((task) => task.id === taskId);

    if (archivedTask) {
      deleteSupabaseTask(archivedTask);
    }

    setArchivedTasks((prev) => prev.filter((archivedTask) => archivedTask.id !== taskId));
  };

  const handleDragStart = (e, taskId, sourceColId) => {
    const sourceColumn = boardColumns.find((column) => column.id === sourceColId);
    const sourceTask = sourceColumn?.tasks.find((task) => task.id === taskId) || null;

    if (!sourceTask || !canCurrentUserModifyTask(sourceTask, selectedProject)) {
      draggedTaskInfo.current = null;

    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('zrc-desktop-task-live-previewing');
    }
      e.preventDefault();
      showPermissionWarning('Bu görev sana atanmadığı için durumunu değiştiremezsin.');
      return;
    }

    draggedTaskInfo.current = { taskId, sourceColId, originalSourceColId: sourceColId, hasPreviewMoved: false };
    e.dataTransfer.effectAllowed = 'move';

    /* === ZRC DESKTOP DRAG SOURCE HIDE START === */
    const zrcDesktopDragSourceElement = e.currentTarget;

    const zrcClearDesktopDragSource = () => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('zrc-desktop-task-dragging');
        document.documentElement.classList.remove('zrc-desktop-task-live-previewing');

        document
          .querySelectorAll('.zrc-desktop-task-drag-source')
          .forEach((element) => element.classList.remove('zrc-desktop-task-drag-source'));
      }
    };

    if (zrcDesktopDragSourceElement?.classList && typeof window !== 'undefined') {
      zrcDesktopDragSourceElement.addEventListener('dragend', zrcClearDesktopDragSource, { once: true });

      window.requestAnimationFrame(() => {
        if (draggedTaskInfo.current?.taskId === taskId) {
          document.documentElement.classList.add('zrc-desktop-task-dragging');
          zrcDesktopDragSourceElement.classList.add('zrc-desktop-task-drag-source');
        }
      });
    }
    /* === ZRC DESKTOP DRAG SOURCE HIDE END === */
  };

  const handleDragOverTaskPreview = (e, targetColId, targetTaskId = null, insertPlacement = 'before') => {
    if (!draggedTaskInfo.current) return;

    e.preventDefault();

    const { taskId } = draggedTaskInfo.current;
    if (!taskId || !targetColId || taskId === targetTaskId) return;

    const placement = insertPlacement === 'after' ? 'after' : 'before';

    setBoardColumns((prevColumns) => {
      const nextColumns = prevColumns.map((column) => ({
        ...column,
        tasks: Array.isArray(column.tasks) ? [...column.tasks] : []
      }));

      const actualSourceIndex = nextColumns.findIndex((column) =>
        column.tasks.some((task) => task.id === taskId)
      );
      const targetColumnIndex = nextColumns.findIndex((column) => column.id === targetColId);

      if (actualSourceIndex === -1 || targetColumnIndex === -1) return prevColumns;

      const actualSourceColumn = nextColumns[actualSourceIndex];
      const sourceTaskIndex = actualSourceColumn.tasks.findIndex((task) => task.id === taskId);

      if (sourceTaskIndex === -1) return prevColumns;

      const movingTask = actualSourceColumn.tasks[sourceTaskIndex];

      actualSourceColumn.tasks.splice(sourceTaskIndex, 1);

      const updatedTargetColumn = nextColumns.find((column) => column.id === targetColId);
      if (!updatedTargetColumn) return prevColumns;

      let targetTaskIndex = targetTaskId
        ? updatedTargetColumn.tasks.findIndex((task) => task.id === targetTaskId)
        : -1;

      if (targetTaskIndex >= 0 && placement === 'after') {
        targetTaskIndex += 1;
      }

      if (targetTaskIndex < 0) {
        targetTaskIndex = updatedTargetColumn.tasks.length;
      }

      const existingIndex = updatedTargetColumn.tasks.findIndex((task) => task.id === taskId);
      if (existingIndex >= 0) {
        updatedTargetColumn.tasks.splice(existingIndex, 1);
        if (existingIndex < targetTaskIndex) {
          targetTaskIndex -= 1;
        }
      }

      updatedTargetColumn.tasks.splice(targetTaskIndex, 0, movingTask);

      draggedTaskInfo.current = {
        ...draggedTaskInfo.current,
        sourceColId: targetColId,
        hasPreviewMoved: true,
        lastPreviewTargetColId: targetColId,
        lastPreviewTargetTaskId: targetTaskId,
        lastPreviewPlacement: placement
      };

      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('zrc-desktop-task-live-previewing');
      }

      return nextColumns;
    });
  };


  const handleDrop = (e, targetColId, targetTaskId = null) => {
    e.preventDefault();
    e.stopPropagation();

    const zrcClearDesktopDragSource = () => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('zrc-desktop-task-dragging');
        document.documentElement.classList.remove('zrc-desktop-task-live-previewing');

        document
          .querySelectorAll('.zrc-desktop-task-drag-source')
          .forEach((element) => element.classList.remove('zrc-desktop-task-drag-source'));
      }
    };

    if (!draggedTaskInfo.current) {
      zrcClearDesktopDragSource();
      return;
    }

    const { taskId } = draggedTaskInfo.current;
    let sourceColId = draggedTaskInfo.current.sourceColId;
    const originalSourceColId = draggedTaskInfo.current.originalSourceColId || sourceColId;

    const zrcActualSourceColumnForDrop = boardColumns.find((column) =>
      (column.tasks || []).some((task) => task.id === taskId)
    );

    if (zrcActualSourceColumnForDrop?.id) {
      sourceColId = zrcActualSourceColumnForDrop.id;
    }

    if (sourceColId === targetColId && taskId === targetTaskId && !draggedTaskInfo.current?.hasPreviewMoved) {
      zrcClearDesktopDragSource();
      draggedTaskInfo.current = null;
      return;
    }

    const sourceColumnBeforeMove = boardColumns.find((column) => column.id === originalSourceColId) || boardColumns.find((column) => column.id === sourceColId);
    const targetColumnBeforeMove = boardColumns.find((column) => column.id === targetColId);
    const taskBeforeMove = sourceColumnBeforeMove?.tasks.find((task) => task.id === taskId) || boardColumns.flatMap((column) => column.tasks || []).find((task) => task.id === taskId) || null;

    if (taskBeforeMove && !canCurrentUserModifyTask(taskBeforeMove, selectedProject)) {
      draggedTaskInfo.current = null;
      zrcClearDesktopDragSource();
      showPermissionWarning('Bu görev sana atanmadığı için durumunu değiştiremezsin.');
      return;
    }

    setBoardColumns((prevColumns) => {
      const updatedCols = prevColumns.map((col) => ({ ...col, tasks: [...col.tasks] }));
      const sourceColumn = updatedCols.find((c) => c.id === sourceColId);
      const targetColumn = updatedCols.find((c) => c.id === targetColId);

      if (!sourceColumn || !targetColumn) return prevColumns;

      const taskToMoveIndex = sourceColumn.tasks.findIndex((t) => t.id === taskId);
      if (taskToMoveIndex === -1) return prevColumns;

      const taskToMove = sourceColumn.tasks[taskToMoveIndex];

      sourceColumn.tasks.splice(taskToMoveIndex, 1);

      if (targetTaskId) {
        const targetIdx = targetColumn.tasks.findIndex((t) => t.id === targetTaskId);

        if (targetIdx !== -1) {
          targetColumn.tasks.splice(targetIdx, 0, taskToMove);
        } else {
          targetColumn.tasks.push(taskToMove);
        }
      } else {
        targetColumn.tasks.push(taskToMove);
      }

      return updatedCols;
    });

    if (taskBeforeMove && originalSourceColId !== targetColId) {
      createActivityNotification({
        type: 'status',
        title: 'Görev durumu değişti',
        text: taskBeforeMove.title || 'Adsız görev',
        meta: `${sourceColumnBeforeMove?.title || 'Eski durum'} → ${targetColumnBeforeMove?.title || 'Yeni durum'}`,
        task: { ...taskBeforeMove, columnTitle: targetColumnBeforeMove?.title },
        columnTitle: targetColumnBeforeMove?.title,
        targetUserIds: getTaskAssigneeUserIdsForNotification(taskBeforeMove || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
        sortWeight: 820
      });

      if (targetColumnBeforeMove) {
        updateSupabaseTaskColumn(taskBeforeMove, targetColumnBeforeMove);
      }
    }

    draggedTaskInfo.current = null;
    zrcClearDesktopDragSource();
  };

  return {
    openAddStageModal,
    openEditStageModal,
    handleMoveColumn,
    handleSaveStage,
    handleDeleteColumn,
    handleCopyColumn,
    handleArchiveColumnTasks,
    handleArchiveColumn,
    openTaskDetail,
    closeTaskDetail,
    editTaskFromDetail,
    updateTaskFromDetail,
    addTaskComment,
    deleteTaskComment,
    handleMoveTaskToColumn,
    handleTaskAction,
    handleBulkDelete,
    handleBulkArchive,
    handleRestoreArchivedTask,
    handleDeleteArchivedTask,
    handleDragStart,
    handleDragOverTaskPreview,
    handleDrop
  };
}
