export function createZRCDataManagementActions(deps) {
  const {
    getCurrentSupabaseWorkspaceId,
    setSupabaseHealthLoading,
    zrcSetSupabaseWriteInfo,
    createSupabaseHealthRow,
    setSupabaseHealthReport,
    countSupabaseTableRows,
    supabase,
    supabaseRealtimeStatus,
    pwaInstallStatus,
    readSupabaseTableForBackup,
    APP_DATA_VERSION,
    currentUserId,
    setSupabaseBackupLoading,
    downloadJsonSnapshot,
    setSupabaseLastBackupAt,
    setProfilePreferences,
    copyTextToClipboard,
    currentAccountType,
    showPermissionWarning,
    getCurrentDataSnapshot,
    normalizeStorageArray,
    writeStorageValue,
    createDefaultTeamMembers,
    normalizeTeamMember,
    createDefaultCustomers,
    normalizeCustomerRecord,
    isLegacyDemoCustomerRecord,
    normalizeStorageObject,
    profileDraft,
    profilePreferences
  } = deps;

  const runSupabaseHealthCheck = async () => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    setSupabaseHealthLoading(true);
    zrcSetSupabaseWriteInfo('saving', 'Supabase sağlık kontrolü yapılıyor');

    const rows = [];

    try {
      if (!workspaceId) {
        rows.push(createSupabaseHealthRow('workspace', 'Workspace bağlantısı', 'error', 'Aktif workspace bulunamadı.'));
        setSupabaseHealthReport(rows);
        zrcSetSupabaseWriteInfo('error', 'Supabase sağlık kontrolü: workspace yok');
        return;
      }

      rows.push(createSupabaseHealthRow('workspace', 'Workspace bağlantısı', 'ok', workspaceId));

      const tableChecks = [
        ['projects', 'Projeler'],
        ['board_columns', 'Kolonlar'],
        ['tasks', 'Görevler'],
        ['task_comments', 'Yorumlar'],
        ['task_steps', 'Adımlar'],
        ['files', 'Dosya kayıtları'],
        ['customers', 'Müşteriler'],
        ['messages', 'Mesajlar'],
        ['activity_logs', 'Aktivite kayıtları'],
        ['quick_notes', 'Hızlı notlar']
      ];

      for (const [tableName, label] of tableChecks) {
        try {
          const { count, error } = await countSupabaseTableRows(tableName);

          if (error) {
            rows.push(createSupabaseHealthRow(tableName, label, 'error', error.message || 'Okuma hatası'));
          } else {
            rows.push(createSupabaseHealthRow(tableName, label, 'ok', `${count || 0} kayıt`));
          }
        } catch (error) {
          rows.push(createSupabaseHealthRow(tableName, label, 'error', error?.message || 'Kontrol edilemedi'));
        }
      }

      try {
        const { data, error } = await supabase.storage
          .from('project-files')
          .list(workspaceId, { limit: 1 });

        if (error) {
          rows.push(createSupabaseHealthRow('storage', 'Storage / project-files', 'error', error.message || 'Storage erişim hatası'));
        } else {
          rows.push(createSupabaseHealthRow('storage', 'Storage / project-files', 'ok', `${Array.isArray(data) ? data.length : 0} örnek klasör/dosya göründü`));
        }
      } catch (error) {
        rows.push(createSupabaseHealthRow('storage', 'Storage / project-files', 'warning', error?.message || 'Storage listesi kontrol edilemedi'));
      }

      rows.push(createSupabaseHealthRow(
        'realtime',
        'Realtime canlı senkron',
        supabaseRealtimeStatus.state === 'connected' ? 'ok' : supabaseRealtimeStatus.state === 'error' ? 'error' : 'warning',
        supabaseRealtimeStatus.label
      ));

      rows.push(createSupabaseHealthRow(
        'pwa',
        'Mobil/PWA kurulum',
        pwaInstallStatus.state === 'installed' || pwaInstallStatus.state === 'ready' ? 'ok' : 'warning',
        pwaInstallStatus.label
      ));

      const hasError = rows.some((row) => row.state === 'error');
      const hasWarning = rows.some((row) => row.state === 'warning');

      setSupabaseHealthReport(rows);
      zrcSetSupabaseWriteInfo(
        hasError ? 'error' : hasWarning ? 'saved' : 'saved',
        hasError ? 'Supabase sağlık kontrolünde hata var' : 'Supabase sağlık kontrolü tamamlandı'
      );
    } finally {
      setSupabaseHealthLoading(false);
    }
  };

  const buildSupabaseBackupSnapshot = async () => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId) {
      throw new Error('Supabase workspace bulunamadı.');
    }

    const backupTables = [
      ['workspaces', 'customWorkspace'],
      ['profiles', 'currentUser'],
      ['workspace_members', 'workspace'],
      ['customers', 'workspace'],
      ['projects', 'workspace'],
      ['project_members', 'workspace'],
      ['project_customers', 'workspace'],
      ['board_columns', 'workspace'],
      ['tasks', 'workspace'],
      ['task_assignees', 'taskOnly'],
      ['task_followers', 'taskOnly'],
      ['task_comments', 'workspace'],
      ['task_steps', 'workspace'],
      ['files', 'workspace'],
      ['messages', 'workspace'],
      ['chat_groups', 'workspace'],
      ['chat_group_members', 'chatGroupOnly'],
      ['notifications', 'workspace'],
      ['activity_logs', 'workspace'],
      ['quick_notes', 'workspace'],
      ['user_preferences', 'currentUserPreference']
    ];

    const tables = {};
    const errors = [];

    const { data: taskRowsForRelations } = await supabase
      .from('tasks')
      .select('id')
      .eq('workspace_id', workspaceId);

    const taskIds = (taskRowsForRelations || []).map((task) => task.id).filter(Boolean);

    const { data: chatRowsForRelations } = await supabase
      .from('chat_groups')
      .select('id')
      .eq('workspace_id', workspaceId);

    const chatGroupIds = (chatRowsForRelations || []).map((group) => group.id).filter(Boolean);

    for (const [tableName, mode] of backupTables) {
      try {
        let result = null;

        if (mode === 'customWorkspace') {
          result = await supabase.from(tableName).select('*').eq('id', workspaceId);
        } else if (mode === 'taskOnly') {
          result = taskIds.length
            ? await supabase.from(tableName).select('*').in('task_id', taskIds)
            : { data: [], error: null };
        } else if (mode === 'chatGroupOnly') {
          result = chatGroupIds.length
            ? await supabase.from(tableName).select('*').in('chat_group_id', chatGroupIds)
            : { data: [], error: null };
        } else {
          result = await readSupabaseTableForBackup(tableName, mode);
        }

        if (result?.error) {
          errors.push({ table: tableName, message: result.error.message || 'Okuma hatası' });
          tables[tableName] = [];
        } else {
          tables[tableName] = result?.data || [];
        }
      } catch (error) {
        errors.push({ table: tableName, message: error?.message || 'Okuma hatası' });
        tables[tableName] = [];
      }
    }

    let storage = {
      bucket: 'project-files',
      root: workspaceId,
      items: [],
      error: ''
    };

    try {
      const { data, error } = await supabase.storage
        .from('project-files')
        .list(workspaceId, { limit: 100 });

      if (error) {
        storage.error = error.message || 'Storage listelenemedi';
      } else {
        storage.items = data || [];
      }
    } catch (error) {
      storage.error = error?.message || 'Storage listelenemedi';
    }

    return {
      source: 'zrc-supabase-backup',
      appDataVersion: APP_DATA_VERSION,
      exportedAt: new Date().toISOString(),
      workspaceId,
      currentUserId,
      tables,
      storage,
      errors
    };
  };

  const downloadSupabaseBackupSnapshot = async () => {
    if (!ensureCanManageLocalData()) return;

    setSupabaseBackupLoading(true);
    zrcSetSupabaseWriteInfo('saving', 'Supabase yedeği hazırlanıyor');

    try {
      const snapshot = await buildSupabaseBackupSnapshot();

      downloadJsonSnapshot(snapshot, 'zrc-supabase-yedek');
      setSupabaseLastBackupAt(snapshot.exportedAt);

      setProfilePreferences((prev) => ({
        ...prev,
        lastSupabaseBackupAt: snapshot.exportedAt,
        lastSavedAt: new Date().toISOString()
      }));

      zrcSetSupabaseWriteInfo(
        snapshot.errors?.length ? 'error' : 'saved',
        snapshot.errors?.length
          ? `Supabase yedeği alındı ama ${snapshot.errors.length} tablo uyarı verdi`
          : 'Supabase yedeği indirildi'
      );
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase yedek hatası: ${error?.message || 'bilinmeyen hata'}`);
    } finally {
      setSupabaseBackupLoading(false);
    }
  };

  const copySupabaseBackupSnapshot = async () => {
    if (!ensureCanManageLocalData()) return;

    setSupabaseBackupLoading(true);
    zrcSetSupabaseWriteInfo('saving', 'Supabase yedeği kopyalanıyor');

    try {
      const snapshot = await buildSupabaseBackupSnapshot();

      await copyTextToClipboard(
        JSON.stringify(snapshot, null, 2),
        snapshot.errors?.length
          ? `Supabase yedeği kopyalandı ama ${snapshot.errors.length} tablo uyarı verdi.`
          : 'Supabase yedeği kopyalandı.'
      );

      setSupabaseLastBackupAt(snapshot.exportedAt);

      setProfilePreferences((prev) => ({
        ...prev,
        lastSupabaseBackupAt: snapshot.exportedAt,
        lastSavedAt: new Date().toISOString()
      }));

      zrcSetSupabaseWriteInfo('saved', 'Supabase yedeği kopyalandı');
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase yedek kopyalama hatası: ${error?.message || 'bilinmeyen hata'}`);
    } finally {
      setSupabaseBackupLoading(false);
    }
  };

  const ensureCanManageLocalData = () => {
    if (currentAccountType !== 'Patron') {
      showPermissionWarning('Veri yönetimi işlemlerini sadece Patron hesabı yapabilir.');
      return false;
    }

    return true;
  };

  const copyCurrentDataSnapshot = () => {
    if (!ensureCanManageLocalData()) return;

    const snapshot = getCurrentDataSnapshot();

    copyTextToClipboard(
      JSON.stringify(snapshot, null, 2),
      'Uygulama veri yedeği kopyalandı.'
    );

    setProfilePreferences((prev) => ({
      ...prev,
      lastDataExportAt: snapshot.exportedAt,
      lastSavedAt: new Date().toISOString()
    }));
  };

  const downloadCurrentDataSnapshot = () => {
    if (!ensureCanManageLocalData()) return;

    const snapshot = getCurrentDataSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `zrc-veri-yedegi-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setProfilePreferences((prev) => ({
      ...prev,
      lastDataExportAt: snapshot.exportedAt,
      lastSavedAt: new Date().toISOString()
    }));
  };

  const restoreDataSnapshot = (snapshot) => {
    const data = snapshot?.data || snapshot;

    if (!data || typeof data !== 'object') {
      alert('Yedek dosyası okunamadı.');
      return;
    }

    const importedProjects = normalizeStorageArray(data.projects, ['E-Ticaret Arayüz Tasarımı']);
    const importedSelectedProject = importedProjects.includes(data.selectedProject)
      ? data.selectedProject
      : importedProjects[0] || '';

    writeStorageValue('projects', importedProjects);
    writeStorageValue('teamMembers', normalizeStorageArray(data.teamMembers, createDefaultTeamMembers()).map(normalizeTeamMember));
    writeStorageValue('customers', normalizeStorageArray(data.customers, createDefaultCustomers()).map(normalizeCustomerRecord).filter((customer) => !isLegacyDemoCustomerRecord(customer)));
    writeStorageValue('selectedProject', importedSelectedProject);
    writeStorageValue('projectSettings', normalizeStorageObject(data.projectSettings, {}));
    writeStorageValue('projectBoards', normalizeStorageObject(data.projectBoards, {}));
    writeStorageValue('quickNotes', normalizeStorageArray(data.quickNotes, []));
    writeStorageValue('activityNotifications', normalizeStorageArray(data.activityNotifications, []));
    writeStorageValue('readNotifications', normalizeStorageArray(data.readNotificationIds || data.readNotifications, []));
    writeStorageValue('projectMessages', normalizeStorageArray(data.projectMessages, []));
    writeStorageValue('readMessages', normalizeStorageArray(data.readMessageIds || data.readMessages, []));
    writeStorageValue('chatGroups', normalizeStorageArray(data.chatGroups, []));
    writeStorageValue('profileDraft', normalizeStorageObject(data.profileDraft, profileDraft));
    writeStorageValue('profilePreferences', {
      ...profilePreferences,
      ...normalizeStorageObject(data.profilePreferences, {}),
      lastDataImportAt: new Date().toISOString(),
      lastSavedAt: new Date().toISOString()
    });
    writeStorageValue('dataVersion', snapshot?.version || APP_DATA_VERSION);

    alert('Yedek geri yüklendi. Sayfa şimdi yenilenecek.');
    window.location.reload();
  };

  const handleDataImportFile = (event) => {
    if (!ensureCanManageLocalData()) {
      event.target.value = '';
      return;
    }

    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const snapshot = JSON.parse(String(reader.result || '{}'));
        const confirmed = window.confirm('Bu yedek dosyası mevcut yerel verilerin üzerine yazılacak. Devam edilsin mi?');

        if (!confirmed) return;

        restoreDataSnapshot(snapshot);
      } catch {
        alert('Yedek dosyası geçerli JSON formatında değil.');
      } finally {
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      alert('Yedek dosyası okunamadı.');
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  return {
    runSupabaseHealthCheck,
    buildSupabaseBackupSnapshot,
    downloadSupabaseBackupSnapshot,
    copySupabaseBackupSnapshot,
    ensureCanManageLocalData,
    copyCurrentDataSnapshot,
    downloadCurrentDataSnapshot,
    restoreDataSnapshot,
    handleDataImportFile
  };
}
