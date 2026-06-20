import { flushSync } from 'react-dom';
import { getScopedStorageKey } from '../utils/storageScopeHelpers.js';
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
    ensureSupabaseColumn,
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
    draggedTaskInfo,
    setProjectBoards,
    taskDetailSyncQueueRef
  } = deps;

  const persistTaskBatch = async (tasks = [], mutation) => {
    const outcomes = await Promise.all(
      tasks.map(async (task) => {
        if (!task?.supabaseId) return { task, ok: true };
        return { task, ok: await mutation(task) };
      })
    );

    return {
      succeeded: outcomes.filter((item) => item.ok).map((item) => item.task),
      failed: outcomes.filter((item) => !item.ok).map((item) => item.task)
    };
  };

  const zrcClearDesktopDragSource = () => {
    if (typeof document === 'undefined') return;

    document.documentElement.classList.remove('zrc-desktop-task-dragging');
    document.documentElement.classList.remove('zrc-desktop-task-live-previewing');
    document.documentElement.classList.remove('zrc-premium-task-reorder-active');

    document
      .querySelectorAll('.zrc-desktop-task-drag-source, .zrc-task-drop-before, .zrc-task-drop-after')
      .forEach((element) => {
        element.classList.remove('zrc-desktop-task-drag-source');
        element.classList.remove('zrc-task-drop-before');
        element.classList.remove('zrc-task-drop-after');
        if (element?.dataset) delete element.dataset.zrcDropPlacement;
      });
  };

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

    const { succeeded, failed } = await persistTaskBatch(tasksToArchive, (task) =>
      archiveSupabaseTask({
        ...task,
        sourceColumnId: column.id,
        sourceColumnTitle: column.title
      })
    );
    const succeededIds = new Set(succeeded.map((task) => task.id));

    setArchivedTasks((prev) => [
      ...succeeded.map((task) => ({
        ...task,
        archivedAt: new Date().toISOString(),
        sourceColumnId: column.id,
        sourceColumnTitle: column.title
      })),
      ...prev
    ]);

    setBoardColumns((prev) =>
      prev.map((col) =>
        col.id === column.id
          ? { ...col, tasks: col.tasks.filter((task) => !succeededIds.has(task.id)) }
          : col
      )
    );

    setOpenMenuColumnId(null);

    if (failed.length > 0) {
      await window.zrcAlert(`${failed.length} görev Supabase'e kaydedilemedi ve kolonda bırakıldı.`);
    }
  };

  const handleArchiveColumn = async (column) => {
    if (!requirePermission('manageColumns', 'Kolon arşivleme yetkisi sadece Yönetici rolünde var.')) return;

    const confirmed = await window.zrcConfirm(`${column.title} kolonunu arşivlemek istediğine emin misin? Kolondaki görevler de Arşiv sekmesine taşınır.`);
    if (!confirmed) return;

    const tasksToArchive = column.tasks || [];
    const { succeeded, failed } = await persistTaskBatch(tasksToArchive, (task) =>
      archiveSupabaseTask({
        ...task,
        sourceColumnId: column.id,
        sourceColumnTitle: column.title
      })
    );
    const succeededIds = new Set(succeeded.map((task) => task.id));

    if (succeeded.length > 0) {
      setArchivedTasks((prev) => [
        ...succeeded.map((task) => ({
          ...task,
          archivedAt: new Date().toISOString(),
          sourceColumnId: column.id,
          sourceColumnTitle: column.title
        })),
        ...prev
      ]);
    }

    if (failed.length > 0) {
      setBoardColumns((prev) =>
        prev.map((item) =>
          item.id === column.id
            ? { ...item, tasks: item.tasks.filter((task) => !succeededIds.has(task.id)) }
            : item
        )
      );
      setOpenMenuColumnId(null);
      await window.zrcAlert(`${failed.length} görev Supabase'e kaydedilemedi; kolon arşivlenmedi.`);
      return;
    }

    setOpenMenuColumnId(null);

    if (!isSupabaseUuid(column.id)) {
      setBoardColumns((prev) => prev.filter((col) => col.id !== column.id));
      return;
    }

    zrcSetSupabaseWriteInfo('saving', 'Supabase kolon arşivleniyor');

    try {
      const { error } = await supabase
        .from('board_columns')
        .update({ is_archived: true })
        .eq('id', column.id)
        .eq('workspace_id', getCurrentSupabaseWorkspaceId());

      if (error) throw error;

      setBoardColumns((prev) => prev.filter((col) => col.id !== column.id));
      zrcSetSupabaseWriteInfo('saved', 'Supabase kolon arşivlendi');
      setTimeout(() => loadSelectedProjectBoardFromSupabase(), 500);
    } catch (error) {
      setBoardColumns((prev) =>
        prev.map((item) =>
          item.id === column.id
            ? { ...item, tasks: item.tasks.filter((task) => !succeededIds.has(task.id)) }
            : item
        )
      );
      zrcSetSupabaseWriteInfo('error', `Supabase kolon arşiv hatası: ${error?.message || 'bilinmeyen hata'}`);
      await window.zrcAlert('Görevler arşivlendi ancak kolon Supabase’e kaydedilemedi; kolon aktif bırakıldı.');
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
      const previousSync = taskDetailSyncQueueRef.current.get(taskId) || Promise.resolve(true);
      const nextSync = previousSync
        .catch(() => false)
        .then(() =>
          syncTaskDetailsToSupabase(taskId, updates, {
            syncDescription: historyEntry?.type === 'description'
          })
        );

      taskDetailSyncQueueRef.current.set(taskId, nextSync);

      void nextSync
        .then(async (saved) => {
          if (saved) return;

          await window.zrcAlert('Görev detayı Supabase’e kaydedilemedi. Güncel sunucu verisi yeniden yüklenecek.');
          await loadSelectedProjectBoardFromSupabase();
        })
        .finally(() => {
          if (taskDetailSyncQueueRef.current.get(taskId) === nextSync) {
            taskDetailSyncQueueRef.current.delete(taskId);
          }
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
    const commentId = globalThis.crypto?.randomUUID?.() || `comment-${Date.now()}`;

    const newComment = {
      id: commentId,
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


  /* === ZRC TASK ORDER DB PERSIST HELPERS START === */
  const zrcGetSupabaseTaskIdForOrder = (task = {}) => {
    const rawId = String(task?.id || '').trim();
    const supabaseId = String(
      task?.supabaseId ||
      task?.supabase_id ||
      (rawId.startsWith('supabase-') ? rawId.replace('supabase-', '') : '') ||
      (isSupabaseUuid(rawId) ? rawId : '') ||
      ''
    ).trim();

    return supabaseId;
  };

  const zrcMarkTaskOrderSavingWindow = (durationMs = 3500) => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(
        getScopedStorageKey('zrc-task-order-saving-until'),
        String(Date.now() + durationMs)
      );
    } catch {
      // Storage erişimi kapalıysa kısa süreli optimistic pencere olmadan devam et.
    }
  };

  const zrcPersistBoardTaskOrderToSupabase = async (columnsToPersist = []) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !selectedProject || !Array.isArray(columnsToPersist) || !supabase) return false;

    zrcMarkTaskOrderSavingWindow(6000);

    try {
      const projectId = await ensureSupabaseProject(selectedProject);
      if (!projectId) return false;

      const updates = [];

      for (const [columnIndex, column] of columnsToPersist.entries()) {
        if (!column) continue;

        const columnId = await ensureSupabaseColumn(projectId, column, columnIndex);

        for (const [taskIndex, task] of (column.tasks || []).entries()) {
          const taskId = zrcGetSupabaseTaskIdForOrder(task);
          if (!taskId) continue;

          const updatePayload = {
            task_order: taskIndex,
            updated_at: new Date().toISOString()
          };

          if (columnId) updatePayload.column_id = columnId;
          if (column.title) updatePayload.status = column.title;

          updates.push({ taskId, updatePayload });
        }
      }

      if (updates.length === 0) return true;

      await Promise.all(
        updates.map(async ({ taskId, updatePayload }) => {
          const { error } = await supabase
            .from('tasks')
            .update(updatePayload)
            .eq('id', taskId)
            .eq('workspace_id', workspaceId);

          if (error) throw error;
        })
      );

      zrcMarkTaskOrderSavingWindow(1800);

      if (typeof zrcSetSupabaseWriteInfo === 'function') {
        zrcSetSupabaseWriteInfo('saved', 'Supabase görev sırası kaydedildi');
      }

      return true;
    } catch (error) {
      console.warn('ZRC görev sırası Supabase kaydı başarısız:', error);

      if (typeof zrcSetSupabaseWriteInfo === 'function') {
        zrcSetSupabaseWriteInfo('error', `Supabase görev sırası kaydedilemedi: ${error?.message || 'bilinmeyen hata'}`);
      }

      return false;
    } finally {
      zrcMarkTaskOrderSavingWindow(1200);
    }
  };
  /* === ZRC TASK ORDER DB PERSIST HELPERS END === */

  const handleMoveTaskToColumn = async (sourceColumnId, targetColumnId, task = {}) => {
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
      const finalColumns = boardColumns.map((column) => ({
        ...column,
        tasks: Array.isArray(column.tasks) ? column.tasks.map((task, taskIndex) => ({
          ...task,
          taskOrder: taskIndex,
          task_order: taskIndex
        })) : []
      }));

      const finalColumnAfterPreview = finalColumns.find((column) =>
        (column.tasks || []).some((columnTask) => columnTask.id === sourceTask.id)
      );

      const orderSaved = await zrcPersistBoardTaskOrderToSupabase(finalColumns);

      if (!orderSaved) {
        await window.zrcAlert('Görev sırası Supabase’e kaydedilemedi. Pano güncel veriden yenilenecek.');
        await loadSelectedProjectBoardFromSupabase();
      } else if (sourceColumnId !== (finalColumnAfterPreview?.id || targetColumnId)) {
        createActivityNotification({
          type: 'status',
          title: 'Görev durumu değişti',
          text: sourceTask.title || 'Adsız görev',
          meta: `${sourceColumn?.title || 'Eski durum'} → ${finalColumnAfterPreview?.title || 'Yeni durum'}`,
          task: { ...sourceTask, columnTitle: finalColumnAfterPreview?.title },
          columnTitle: finalColumnAfterPreview?.title,
          targetUserIds: getTaskAssigneeUserIdsForNotification(sourceTask).filter((userId) => !isCurrentSupabaseUserId(userId)),
          sortWeight: 820
        });
      }

      draggedTaskInfo.current = null;
      zrcClearDesktopDragSource();

      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('zrc-desktop-task-live-previewing');
        document.documentElement.classList.remove('zrc-premium-task-reorder-active');
      }

      return;
    }
    /* === ZRC PREVIEW DROP FINALIZE WITHOUT APPEND END === */

    if (sourceTask.supabaseId) {
      const saved = await updateSupabaseTaskColumn(movedTask, targetColumn, targetColumn.tasks.length);

      if (!saved) {
        await window.zrcAlert('Görev durumu Supabase’e kaydedilemedi; görev taşınmadı.');
        return;
      }
    }

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

      if (task.supabaseId && !(await archiveSupabaseTask({ ...task, sourceColumnId: columnId, sourceColumnTitle: columnTitle }))) {
        await window.zrcAlert('Görev Supabase’e arşivlenemedi; yerel pano değiştirilmedi.');
        return;
      }

      setArchivedTasks((prev) => [{ ...task, archivedAt: new Date().toISOString(), sourceColumnId: columnId, sourceColumnTitle: columnTitle }, ...prev]);

      setBoardColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((item) => item.id !== task.id) }
            : col
        )
      );
      setSelectedTasks((prev) => prev.filter((id) => id !== task.id));
      if (detailTaskInfo?.task?.id === task.id) setDetailTaskInfo(null);
      return;
    }

    if (action === 'sil') {
      if (!requirePermission('deleteTasks', 'Görev silme yetkisi sadece Yönetici rolünde var.')) return;

      const confirmed = await window.zrcConfirm('Bu görevi silmek istediğine emin misin?');
      if (!confirmed) return;

      if (task.supabaseId && !(await deleteSupabaseTask(task))) {
        await window.zrcAlert('Görev Supabase’den silinemedi; yerel pano değiştirilmedi.');
        return;
      }

      setBoardColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((item) => item.id !== task.id) }
            : col
        )
      );
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

      const { succeeded, failed } = await persistTaskBatch(tasksToDelete, deleteSupabaseTask);
      const succeededIds = new Set(succeeded.map((task) => task.id));

      setBoardColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.filter((task) => !succeededIds.has(task.id))
        }))
      );

      setSelectedTasks(failed.map((task) => task.id));

      if (failed.length > 0) {
        await window.zrcAlert(`${failed.length} görev Supabase’den silinemedi ve panoda bırakıldı.`);
      }
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

    const { succeeded, failed } = await persistTaskBatch(tasksToArchive, archiveSupabaseTask);
    const succeededIds = new Set(succeeded.map((task) => task.id));

    setArchivedTasks((prev) => [...prev, ...succeeded]);

    setBoardColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => !succeededIds.has(task.id))
      }))
    );

    setSelectedTasks(failed.map((task) => task.id));
    await window.zrcAlert(
      failed.length > 0
        ? `${succeeded.length} görev arşivlendi; ${failed.length} görev Supabase hatası nedeniyle panoda bırakıldı.`
        : `${succeeded.length} görev arşivlendi.`
    );
  };

  const handleRestoreArchivedTask = async (task) => {
    if (!requirePermission('deleteTasks', 'Arşivden geri getirme yetkisi sadece Yönetici rolünde var.')) return;

    const restoredTask = { ...task };
    delete restoredTask.archivedAt;
    delete restoredTask.sourceColumnId;
    delete restoredTask.sourceColumnTitle;

    const originalColumnIndex = boardColumns.findIndex((column) => column.id === task.sourceColumnId);
    const waitingColumnIndex = boardColumns.findIndex((column) => column.title === 'Bekliyor' || column.title.includes('Bekliyor'));
    const targetIndex = originalColumnIndex !== -1 ? originalColumnIndex : waitingColumnIndex !== -1 ? waitingColumnIndex : 0;
    const targetColumn = boardColumns[targetIndex];

    if (!targetColumn) {
      await window.zrcAlert('Görevin geri getirileceği aktif kolon bulunamadı.');
      return;
    }

    if (task.supabaseId && !(await restoreSupabaseTask(restoredTask, targetColumn))) {
      await window.zrcAlert('Görev Supabase’den geri getirilemedi; arşiv kaydı korundu.');
      return;
    }

    setArchivedTasks((prev) => prev.filter((archivedTask) => archivedTask.id !== task.id));
    setBoardColumns((prev) =>
      prev.map((column, index) =>
        index === targetIndex ? { ...column, tasks: [...column.tasks, restoredTask] } : column
      )
    );
  };

  const handleDeleteArchivedTask = async (taskId) => {
    const confirmed = await window.zrcConfirm('Bu arşiv kaydını kalıcı olarak silmek istediğine emin misin?');
    if (!confirmed) return;

    const archivedTask = archivedTasks.find((task) => task.id === taskId);

    if (archivedTask?.supabaseId && !(await deleteSupabaseTask(archivedTask))) {
      await window.zrcAlert('Arşiv kaydı Supabase’den silinemedi; kayıt korundu.');
      return;
    }

    setArchivedTasks((prev) => prev.filter((archivedTask) => archivedTask.id !== taskId));
  };


  /* === ZRC PREMIUM LIVE TASK REORDER HELPERS START === */
  const zrcCaptureTaskLayoutRects = () => {
    if (typeof document === 'undefined') return new Map();

    try {
      return new Map(
        Array.from(document.querySelectorAll('[data-zrc-task-card="true"]'))
          .map((element) => {
            const taskId = String(element?.dataset?.zrcTaskId || '').trim();
            if (!taskId) return null;

            const rect = element.getBoundingClientRect();
            return [taskId, { top: rect.top, left: rect.left }];
          })
          .filter(Boolean)
      );
    } catch {
      return new Map();
    }
  };

  const zrcAnimateTaskLayoutShift = (previousRects) => {
    if (typeof document === 'undefined' || !previousRects || previousRects.size === 0) return;

    window.requestAnimationFrame(() => {
      try {
        document
          .querySelectorAll('[data-zrc-task-card="true"]')
          .forEach((element) => {
            const taskId = String(element?.dataset?.zrcTaskId || '').trim();
            if (!taskId || element.classList.contains('zrc-desktop-task-drag-source')) return;

            const previousRect = previousRects.get(taskId);
            if (!previousRect) return;

            const nextRect = element.getBoundingClientRect();
            const deltaX = previousRect.left - nextRect.left;
            const deltaY = previousRect.top - nextRect.top;

            if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

            if (typeof element.animate === 'function') {
              element.animate(
                [
                  { transform: `translate(${deltaX}px, ${deltaY}px)` },
                  { transform: 'translate(0, 0)' }
                ],
                {
                  duration: 315,
                  easing: 'cubic-bezier(0.2, 1.2, 0.22, 1)',
                  fill: 'both'
                }
              );
            }
          });
      } catch {
        // Animasyon desteği yoksa sıralama işlemini animasyonsuz tamamla.
      }
    });
  };
  /* === ZRC PREMIUM LIVE TASK REORDER HELPERS END === */

  const handleDragStart = (e, taskId, sourceColId) => {
    const sourceColumn = boardColumns.find((column) => column.id === sourceColId);
    const sourceTask = sourceColumn?.tasks.find((task) => task.id === taskId) || null;

    if (!sourceTask || !canCurrentUserModifyTask(sourceTask, selectedProject)) {
      draggedTaskInfo.current = null;

    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('zrc-desktop-task-live-previewing');
        document.documentElement.classList.remove('zrc-premium-task-reorder-active');
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
        document.documentElement.classList.remove('zrc-premium-task-reorder-active');

        document
          .querySelectorAll('.zrc-desktop-task-drag-source, .zrc-task-drop-before, .zrc-task-drop-after')
          .forEach((element) => {
            element.classList.remove('zrc-desktop-task-drag-source');
            element.classList.remove('zrc-task-drop-before');
            element.classList.remove('zrc-task-drop-after');
            if (element?.dataset) delete element.dataset.zrcDropPlacement;
          });
      }
    };

    if (zrcDesktopDragSourceElement?.classList && typeof window !== 'undefined') {
      zrcDesktopDragSourceElement.addEventListener('dragend', zrcClearDesktopDragSource, { once: true });

      window.requestAnimationFrame(() => {
        if (draggedTaskInfo.current?.taskId === taskId) {
          document.documentElement.classList.add('zrc-desktop-task-dragging');
          document.documentElement.classList.add('zrc-premium-task-reorder-active');
          zrcDesktopDragSourceElement.classList.add('zrc-desktop-task-drag-source');
        }
      });
    }
    /* === ZRC DESKTOP DRAG SOURCE HIDE END === */
  };




  // zrc-hide-in-list-drag-clone-v2
  // Native drag ghost imleç altında zaten görünür. Canlı preview sırasında listede aynı görevin
  // içerikli ikinci kopyasını gizleyip sadece sakin bir slot/boşluk hissi bırakır.
  const zrcGetTaskCardDomId = (element = {}) =>
    String(
      element?.dataset?.zrcTaskId ||
      element?.dataset?.taskId ||
      element?.dataset?.id ||
      ''
    );

  const zrcClearDraggedTaskInListCopies = () => {
    if (typeof document === 'undefined') return;

    document
      .querySelectorAll('[data-zrc-drag-hidden-clone="true"], .zrc-task-drag-in-list-copy-hidden')
      .forEach((element) => {
        element.classList.remove('zrc-task-drag-in-list-copy-hidden');
        element.removeAttribute('data-zrc-drag-hidden-clone');
      });

    document.documentElement.classList.remove('zrc-task-drag-clone-hidden-active');
  };

  const zrcEnsureDraggedTaskCloneCleanupListeners = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window.__zrcTaskDragCloneCleanupAttached) return;

    window.__zrcTaskDragCloneCleanupAttached = true;

    const cleanup = () => {
      zrcClearDraggedTaskInListCopies();
    };

    window.addEventListener('dragend', cleanup, true);
    window.addEventListener('drop', cleanup, true);
    window.addEventListener('pointerup', cleanup, true);
    window.addEventListener('blur', cleanup, true);
    document.addEventListener('keyup', (event) => {
      if (event?.key === 'Escape') cleanup();
    }, true);
  };

  const zrcMarkDraggedTaskInListCopies = (draggedTaskId) => {
    if (typeof document === 'undefined' || !draggedTaskId) return;

    zrcEnsureDraggedTaskCloneCleanupListeners();

    const normalizedTaskId = String(draggedTaskId);
    let markedCount = 0;

    document
      .querySelectorAll('[data-zrc-task-card="true"]')
      .forEach((element) => {
        const cardTaskId = zrcGetTaskCardDomId(element);

        if (cardTaskId && cardTaskId === normalizedTaskId) {
          element.classList.add('zrc-task-drag-in-list-copy-hidden');
          element.setAttribute('data-zrc-drag-hidden-clone', 'true');
          markedCount += 1;
        }
      });

    if (markedCount > 0) {
      document.documentElement.classList.add('zrc-task-drag-clone-hidden-active');
    }

    window.clearTimeout(window.__zrcTaskDragCloneCleanupTimer);
    window.__zrcTaskDragCloneCleanupTimer = window.setTimeout(() => {
      zrcClearDraggedTaskInListCopies();
    }, 18000);
  };

  const handleDragOverTaskPreview = (e, targetColId, targetTaskId = null, insertPlacement = 'before') => {
    if (!draggedTaskInfo.current) return;

    e.preventDefault();

    const { taskId } = draggedTaskInfo.current;
    if (!taskId || !targetColId || taskId === targetTaskId) return;

    const placement = insertPlacement === 'after' ? 'after' : 'before';
    const slotKey = `${targetColId || ''}:${targetTaskId || '__end__'}:${placement}`;

    // zrc-apple-spring-live-drag-v3
    // V2'de hedef 70ms bekleyince state değişimi doğru yapılıyordu ama DOM animasyon yakalamadan
    // bir anda yer değiştiriyordu. Burada state değişimini flushSync ile DOM'a bastırıp
    // hemen ardından FLIP animasyonunu başlatıyoruz; böylece "tak" değil kayarak yer değiştirir.
    if (draggedTaskInfo.current?.zrcSpringLastAppliedSlotKey === slotKey) return;

    if (draggedTaskInfo.current?.zrcSpringPreviewTimer) {
      window.clearTimeout(draggedTaskInfo.current.zrcSpringPreviewTimer);
    }

    draggedTaskInfo.current = {
      ...draggedTaskInfo.current,
      zrcSpringPendingSlotKey: slotKey,
      lastPreviewTargetColId: targetColId,
      lastPreviewTargetTaskId: targetTaskId,
      lastPreviewPlacement: placement
    };

    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('zrc-desktop-task-dragging');
      document.documentElement.classList.add('zrc-apple-spring-task-dragging');
    }

    zrcMarkDraggedTaskInListCopies(taskId);

    draggedTaskInfo.current.zrcSpringPreviewTimer = window.setTimeout(() => {
      if (!draggedTaskInfo.current || draggedTaskInfo.current.zrcSpringPendingSlotKey !== slotKey) return;

      const beforeRects =
        typeof zrcCaptureTaskLayoutRects === 'function'
          ? zrcCaptureTaskLayoutRects()
          : null;

      let didMove = false;
      let nextColumnsForProject = null;

      const applySpringPreviewUpdate = () => {
        setBoardColumns((prevColumns) => {
          const safeColumns = Array.isArray(prevColumns) ? prevColumns : [];

          const sourceColIndex = safeColumns.findIndex((column) =>
            (column.tasks || []).some((task) => String(task?.id || task?.supabaseId || '') === String(taskId))
          );

          const targetColIndex = safeColumns.findIndex((column) => String(column?.id || '') === String(targetColId));

          if (sourceColIndex === -1 || targetColIndex === -1) return prevColumns;

          const sourceTasks = [...(safeColumns[sourceColIndex]?.tasks || [])];
          const sourceTaskIndex = sourceTasks.findIndex((task) => String(task?.id || task?.supabaseId || '') === String(taskId));

          if (sourceTaskIndex === -1) return prevColumns;

          const [draggedTask] = sourceTasks.splice(sourceTaskIndex, 1);

          const nextColumns = safeColumns.map((column, index) =>
            index === sourceColIndex
              ? { ...column, tasks: sourceTasks }
              : { ...column, tasks: [...(column.tasks || [])] }
          );

          const targetTasks = nextColumns[targetColIndex].tasks;
          let insertIndex = targetTasks.length;

          if (targetTaskId) {
            const targetTaskIndex = targetTasks.findIndex((task) => String(task?.id || task?.supabaseId || '') === String(targetTaskId));

            if (targetTaskIndex !== -1) {
              insertIndex = placement === 'after' ? targetTaskIndex + 1 : targetTaskIndex;
            }
          }

          insertIndex = Math.max(0, Math.min(targetTasks.length, insertIndex));

          if (sourceColIndex === targetColIndex && insertIndex === sourceTaskIndex) return prevColumns;

          const targetColumn = nextColumns[targetColIndex] || {};
          const previewTask = {
            ...draggedTask,
            status: targetColumn.title || draggedTask.status,
            columnTitle: targetColumn.title || draggedTask.columnTitle,
            columnColor: targetColumn.color || draggedTask.columnColor
          };

          targetTasks.splice(insertIndex, 0, previewTask);

          nextColumnsForProject = nextColumns;
          didMove = true;

          draggedTaskInfo.current = {
            ...draggedTaskInfo.current,
            hasPreviewMoved: true,
            currentColumnId: targetColId,
            zrcSpringLastAppliedSlotKey: slotKey,
            zrcSpringPendingSlotKey: null,
            lastPreviewTargetColId: targetColId,
            lastPreviewTargetTaskId: targetTaskId,
            lastPreviewPlacement: placement
          };

          return nextColumns;
        });
      };

      if (typeof flushSync === 'function') {
        flushSync(applySpringPreviewUpdate);
      } else {
        applySpringPreviewUpdate();
      }

      if (didMove && nextColumnsForProject && typeof setProjectBoards === 'function' && typeof selectedProject !== 'undefined' && selectedProject) {
        const applyProjectBoardPreviewUpdate = () => {
          setProjectBoards((prevBoards) => ({
            ...(prevBoards || {}),
            [selectedProject]: {
              ...((prevBoards || {})[selectedProject] || {}),
              columns: nextColumnsForProject
            }
          }));
        };

        if (typeof flushSync === 'function') {
          flushSync(applyProjectBoardPreviewUpdate);
        } else {
          applyProjectBoardPreviewUpdate();
        }
      }

      if (didMove) {
        window.requestAnimationFrame(() => zrcMarkDraggedTaskInListCopies(taskId));
      }

      if (didMove && beforeRects && typeof zrcAnimateTaskLayoutShift === 'function') {
        window.requestAnimationFrame(() => {
          zrcAnimateTaskLayoutShift(beforeRects, {
            duration: 315,
            easing: 'cubic-bezier(0.2, 1.2, 0.22, 1)'
          });
        });
      }
    }, 70);
  };

  const handleDrop = async (e, targetColId, targetTaskId = null, insertPlacement = 'before') => {

    zrcClearDraggedTaskInListCopies();

    if (draggedTaskInfo.current?.zrcSpringPreviewTimer) {
      window.clearTimeout(draggedTaskInfo.current.zrcSpringPreviewTimer);
      draggedTaskInfo.current.zrcSpringPreviewTimer = null;
    }
    e.preventDefault();
    e.stopPropagation();

    const zrcClearDesktopDragSource = () => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('zrc-desktop-task-dragging');
        document.documentElement.classList.remove('zrc-desktop-task-live-previewing');
        document.documentElement.classList.remove('zrc-premium-task-reorder-active');

        document
          .querySelectorAll('.zrc-desktop-task-drag-source, .zrc-task-drop-before, .zrc-task-drop-after')
          .forEach((element) => {
            element.classList.remove('zrc-desktop-task-drag-source');
            element.classList.remove('zrc-task-drop-before');
            element.classList.remove('zrc-task-drop-after');
            if (element?.dataset) delete element.dataset.zrcDropPlacement;
          });
      }
    };

    if (!draggedTaskInfo.current) {
      zrcClearDesktopDragSource();
      return;
    }

    const dragInfoSnapshot = { ...draggedTaskInfo.current };
    const { taskId } = dragInfoSnapshot;
    const originalSourceColId = dragInfoSnapshot.originalSourceColId || dragInfoSnapshot.sourceColId;
    const sourceColId = dragInfoSnapshot.sourceColId || originalSourceColId;
    const hasLivePreviewMoved = Boolean(dragInfoSnapshot.hasPreviewMoved);
    const placement = insertPlacement === 'after' ? 'after' : 'before';

    if (!taskId || !targetColId) {
      draggedTaskInfo.current = null;
      zrcClearDesktopDragSource();
      return;
    }

    /* === ZRC RESOLVE FINAL DROP TARGET START === */
    let resolvedTargetTaskId = targetTaskId;
    let resolvedInsertPlacement = placement;

    if (!resolvedTargetTaskId && e?.currentTarget?.querySelectorAll) {
      try {
        const pointerY = Number(e.clientY || 0);
        const taskCards = Array.from(e.currentTarget.querySelectorAll('[data-zrc-task-card="true"]'))
          .filter((card) => {
            const cardTaskId = String(card?.dataset?.zrcTaskId || '').trim();
            return cardTaskId && cardTaskId !== String(taskId || '').trim();
          });

        if (taskCards.length > 0) {
          let chosenCard = null;
          let chosenPlacement = 'after';

          for (const card of taskCards) {
            const rect = card.getBoundingClientRect();
            const middleY = rect.top + rect.height / 2;

            if (pointerY < middleY) {
              chosenCard = card;
              chosenPlacement = 'before';
              break;
            }

            chosenCard = card;
            chosenPlacement = 'after';
          }

          const chosenTaskId = String(chosenCard?.dataset?.zrcTaskId || '').trim();

          if (chosenTaskId) {
            resolvedTargetTaskId = chosenTaskId;
            resolvedInsertPlacement = chosenPlacement;
          }
        }
      } catch {
        // DOM hedef çözümlemesi başarısızsa kolon sonuna bırakma fallback'i kullanılır.
      }
    }
    /* === ZRC RESOLVE FINAL DROP TARGET END === */

    const currentTaskColumnBeforeDrop = boardColumns.find((column) =>
      (column.tasks || []).some((task) => task.id === taskId)
    );

    const finalTargetColId = targetColId;
    const sourceColumnBeforeMove =
      boardColumns.find((column) => column.id === originalSourceColId) ||
      boardColumns.find((column) => column.id === sourceColId) ||
      currentTaskColumnBeforeDrop;

    const targetColumnBeforeMove =
      boardColumns.find((column) => column.id === finalTargetColId) ||
      boardColumns.find((column) => column.id === targetColId);

    const taskBeforeMove =
      sourceColumnBeforeMove?.tasks?.find((task) => task.id === taskId) ||
      currentTaskColumnBeforeDrop?.tasks?.find((task) => task.id === taskId) ||
      boardColumns.flatMap((column) => column.tasks || []).find((task) => task.id === taskId) ||
      null;

    if (taskBeforeMove && !canCurrentUserModifyTask(taskBeforeMove, selectedProject)) {
      draggedTaskInfo.current = null;
      zrcClearDesktopDragSource();
      showPermissionWarning('Bu görev sana atanmadığı için durumunu değiştiremezsin.');
      return;
    }

    const shouldCreateStatusNotification =
      taskBeforeMove &&
      originalSourceColId &&
      finalTargetColId &&
      originalSourceColId !== finalTargetColId;

    const updatedCols = boardColumns.map((column) => ({
      ...column,
      tasks: Array.isArray(column.tasks) ? [...column.tasks] : []
    }));

    if (!hasLivePreviewMoved) {
      const sourceColumn =
        updatedCols.find((column) => column.id === sourceColId) ||
        updatedCols.find((column) => (column.tasks || []).some((task) => task.id === taskId));
      const targetColumn = updatedCols.find((column) => column.id === targetColId);

      if (!sourceColumn || !targetColumn) {
        draggedTaskInfo.current = null;
        zrcClearDesktopDragSource();
        return;
      }

      const taskToMoveIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId);

      if (taskToMoveIndex === -1) {
        draggedTaskInfo.current = null;
        zrcClearDesktopDragSource();
        return;
      }

      const [rawTaskToMove] = sourceColumn.tasks.splice(taskToMoveIndex, 1);
      const taskToMove = { ...rawTaskToMove, status: targetColumn.title };

      if (resolvedTargetTaskId && resolvedTargetTaskId !== taskId) {
        const targetIndex = targetColumn.tasks.findIndex((task) => task.id === resolvedTargetTaskId);
        const insertIndex = targetIndex === -1
          ? targetColumn.tasks.length
          : resolvedInsertPlacement === 'after'
            ? targetIndex + 1
            : targetIndex;

        targetColumn.tasks.splice(insertIndex, 0, taskToMove);
      } else {
        targetColumn.tasks.push(taskToMove);
      }
    }

    const normalizedCols = updatedCols.map((column) => ({
      ...column,
      tasks: (column.tasks || []).map((task, index) => ({
        ...task,
        taskOrder: index,
        task_order: index,
        ...(task.id === taskId ? { status: column.title, columnTitle: column.title } : {})
      }))
    }));
    const orderSaved = await zrcPersistBoardTaskOrderToSupabase(normalizedCols);

    if (!orderSaved) {
      await window.zrcAlert('Görev sırası Supabase’e kaydedilemedi. Pano güncel veriden yenilenecek.');
      await loadSelectedProjectBoardFromSupabase();
      draggedTaskInfo.current = null;
      zrcClearDesktopDragSource();
      return;
    }

    setBoardColumns(normalizedCols);

    if (shouldCreateStatusNotification) {
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
