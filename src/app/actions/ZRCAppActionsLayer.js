// v537: ZRCAppShell içinden ayrılan büyük action/handler fonksiyonları.
// Not: Bu dosya hook içermez. Shell içindeki wrapperlar aynı fonksiyon isimlerini korur.

export async function zrcHandleSaveTaskAction(ctx, taskData, targetStatus) {
  const {selectedProject, editingTask, requirePermission, ensureCanCreateTaskInSelectedProject, currentAccountType, isCurrentUserProjectMember, showPermissionWarning, boardColumns, getSupabaseTaskIdFromLocalTask, normalizeAssigneesForCurrentAccountSave, filterTaskFollowersForSave, canCurrentUserModifyTask, isCurrentProfileInUsers, getTaskAssigneeUserIdsForNotification, setBoardColumns, createActivityNotification, isCurrentSupabaseUserId, saveTaskToSupabase, zrcV448PlayDesktopNotificationSound, zrcV442SendTaskSavePush, loadSelectedProjectBoardFromSupabase, setIsTaskModalOpen, setEditingTask, setCalendarTaskModalContext} = ctx;

    // v339c-kesin-gorev-duzeltme:
    // Yeni görevde TaskModal otomatik id üretiyor.
    // Bu yüzden taskData.id varsa bile bu düzenleme anlamına gelmez.
    // Gerçek düzenleme sadece editingTask varsa yapılır.
    const isEditingExistingTask = Boolean(editingTask?.id);

    if (!requirePermission(isEditingExistingTask ? 'editTasks' : 'createTasks', 'Bu rol görev oluşturamaz veya düzenleyemez.')) return;

    if (!isEditingExistingTask && !ensureCanCreateTaskInSelectedProject('Bu rol görev oluşturamaz.')) return;

    if (currentAccountType === 'Ekip Üyesi' && !isCurrentUserProjectMember(selectedProject)) {
      showPermissionWarning('Bu projede görev düzenleme yetkin yok.');
      return;
    }

    const previousColumn = isEditingExistingTask
      ? boardColumns.find((column) =>
          (column.tasks || []).some((task) =>
            task.id === editingTask?.id ||
            task.id === taskData.id ||
            (editingTask?.supabaseId && task.supabaseId === editingTask.supabaseId) ||
            (task.supabaseId && task.supabaseId === taskData.supabaseId) ||
            (task.supabaseId && task.id === `supabase-${task.supabaseId}`)
          )
        )
      : null;

    const previousTask = isEditingExistingTask
      ? previousColumn?.tasks.find((task) =>
          task.id === editingTask?.id ||
          task.id === taskData.id ||
          (editingTask?.supabaseId && task.supabaseId === editingTask.supabaseId) ||
          (task.supabaseId && task.supabaseId === taskData.supabaseId) ||
          (task.supabaseId && task.id === `supabase-${task.supabaseId}`)
        ) || null
      : null;

    const existingSupabaseTaskId = isEditingExistingTask
      ? (
          editingTask?.supabaseId ||
          taskData.supabaseId ||
          previousTask?.supabaseId ||
          getSupabaseTaskIdFromLocalTask(editingTask) ||
          getSupabaseTaskIdFromLocalTask(taskData) ||
          getSupabaseTaskIdFromLocalTask(editingTask?.id || taskData.id)
        )
      : '';

    const finalTargetStatus = targetStatus || taskData.status || previousColumn?.title || boardColumns[0]?.title || 'Yeni Görev';
    const generatedTaskId = `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const cleanedTaskData = {
      ...(previousTask || {}),
      ...taskData,
      id: isEditingExistingTask
        ? (previousTask?.id || editingTask?.id || taskData.id || generatedTaskId)
        : generatedTaskId,
      supabaseId: isEditingExistingTask
        ? (existingSupabaseTaskId || taskData.supabaseId || previousTask?.supabaseId || editingTask?.supabaseId || '')
        : '',
      status: finalTargetStatus,
      assignees: normalizeAssigneesForCurrentAccountSave(
        taskData.assignees || previousTask?.assignees || [],
        previousTask?.assignees || [],
        Boolean(previousTask)
      ),
      followers: filterTaskFollowersForSave(taskData.followers || previousTask?.followers || [])
    };

    const targetColumn = boardColumns.find((column) => column.title === finalTargetStatus) || previousColumn || boardColumns[0];

    if (previousTask && !canCurrentUserModifyTask(previousTask, previousTask.projectName || cleanedTaskData.projectName || selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için düzenleyemezsin.');
      return;
    }

    const wasAssignedToMe = previousTask ? isCurrentProfileInUsers(previousTask.assignees || []) : false;
    const isAssignedToMe = isCurrentProfileInUsers(cleanedTaskData.assignees || []);
    const previousAssigneeUserIds = previousTask ? getTaskAssigneeUserIdsForNotification(previousTask) : [];
    const nextAssigneeUserIds = getTaskAssigneeUserIdsForNotification(cleanedTaskData);
    const addedAssigneeUserIds = nextAssigneeUserIds.filter((userId) => !previousAssigneeUserIds.includes(userId));
    const removedAssigneeUserIds = previousAssigneeUserIds.filter((userId) => !nextAssigneeUserIds.includes(userId));

    setBoardColumns((prev) => {
      const updatedCols = prev.map((col) => ({
        ...col,
        tasks: isEditingExistingTask
          ? (col.tasks || []).filter((t) =>
              t.id !== cleanedTaskData.id &&
              !(cleanedTaskData.supabaseId && t.supabaseId === cleanedTaskData.supabaseId)
            )
          : [...(col.tasks || [])]
      }));

      const targetColIndex = updatedCols.findIndex((c) => c.title === finalTargetStatus);

      if (targetColIndex !== -1) {
        updatedCols[targetColIndex].tasks.push(cleanedTaskData);
      } else {
        updatedCols[0].tasks.push(cleanedTaskData);
      }

      return updatedCols;
    });

    if (!previousTask) {
      createActivityNotification({
        type: 'task',
        title: 'Yeni görev oluşturuldu',
        text: cleanedTaskData.title || 'Adsız görev',
        meta: `${selectedProject} · ${finalTargetStatus || targetColumn?.title || 'Görev'}`,
        task: { ...cleanedTaskData, columnTitle: finalTargetStatus || targetColumn?.title },
        columnTitle: finalTargetStatus || targetColumn?.title,
        targetUserIds: addedAssigneeUserIds.filter((userId) => !isCurrentSupabaseUserId(userId)),
        sortWeight: 740
      });
    }

    if (addedAssigneeUserIds.length > 0) {
      createActivityNotification({
        type: 'assignment',
        title: 'Sana yeni görev atandı',
        text: cleanedTaskData.title || 'Adsız görev',
        meta: `${selectedProject} · ${finalTargetStatus || targetColumn?.title || 'Görev'}`,
        task: { ...cleanedTaskData, columnTitle: finalTargetStatus || targetColumn?.title },
        columnTitle: finalTargetStatus || targetColumn?.title,
        targetUserIds: addedAssigneeUserIds.filter((userId) => !isCurrentSupabaseUserId(userId)),
        sortWeight: 940
      });
    }

    if (removedAssigneeUserIds.length > 0) {
      createActivityNotification({
        type: 'assignment',
        title: 'Görev ataman kaldırıldı',
        text: cleanedTaskData.title || 'Adsız görev',
        meta: `${selectedProject} · ${finalTargetStatus || targetColumn?.title || 'Görev'}`,
        task: { ...cleanedTaskData, columnTitle: finalTargetStatus || targetColumn?.title },
        columnTitle: finalTargetStatus || targetColumn?.title,
        targetUserIds: removedAssigneeUserIds.filter((userId) => !isCurrentSupabaseUserId(userId)),
        sortWeight: 930
      });
    }

    if (previousTask && previousColumn?.title !== finalTargetStatus) {
      createActivityNotification({
        type: 'status',
        title: 'Görev durumu değişti',
        text: cleanedTaskData.title || 'Adsız görev',
        meta: `${previousColumn?.title || 'Eski durum'} → ${finalTargetStatus || targetColumn?.title || 'Yeni durum'}`,
        task: { ...cleanedTaskData, columnTitle: finalTargetStatus || targetColumn?.title },
        columnTitle: finalTargetStatus || targetColumn?.title,
        sortWeight: 820
      });
    }

    const didSaveToSupabase = await saveTaskToSupabase(cleanedTaskData, finalTargetStatus || targetColumn?.title);

    // zrc-v442-single-task-push-trigger
    if (didSaveToSupabase) {
      zrcV448PlayDesktopNotificationSound();
      zrcV442SendTaskSavePush({
        type: previousTask ? 'task_update' : 'task_create',
        title: 'ZRC',
        body: previousTask
          ? `Görev güncellendi: ${cleanedTaskData.title || 'Adsız görev'}`
          : `Yeni görev oluşturuldu: ${cleanedTaskData.title || 'Adsız görev'}`
      });
    }


    if (didSaveToSupabase) {
      setTimeout(() => loadSelectedProjectBoardFromSupabase(), 1500);
    } else if (existingSupabaseTaskId) {
      alert('Görev yerelde güncellendi ama Supabase kaydı tamamlanamadı. Sağ alttaki hata mesajını kontrol et.');
      return;
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
    setCalendarTaskModalContext({
      isOpen: false,
      pendingOpen: false,
      projectName: '',
      date: ''
    });
}

export async function zrcSaveTeamMemberEditAction(ctx, event) {
  const {teamMembers, setTeamMembers, customers, setCustomers, requirePermission, editingTeamMember, normalizeTeamRole, teamMemberEditDraft, getCustomerById, normalizeCredentialText, isLastActiveAdmin, showPermissionWarning, createAvatarFromName, getCurrentSupabaseWorkspaceId, isSupabaseUuid, zrcSetSupabaseWriteInfo, error, setBoardColumns, updateTaskUserList, setArchivedTasks, setSelectedTeamMemberId, closeTeamMemberEditModal} = ctx;

    event.preventDefault();

    if (!requirePermission('manageTeam', 'Ekip üyelerini sadece Yönetici düzenleyebilir.')) return;
    if (!editingTeamMember) return;

    const role = normalizeTeamRole(teamMemberEditDraft.role);
    const customerId = role === 'Müşteri/Misafir' ? teamMemberEditDraft.customerId : '';
    const linkedCustomer = customerId ? getCustomerById(customerId) : null;
    const name =
      role === 'Müşteri/Misafir'
        ? (linkedCustomer?.name || '').trim()
        : teamMemberEditDraft.name.trim();
    const email =
      role === 'Müşteri/Misafir'
        ? (teamMemberEditDraft.email.trim() || linkedCustomer?.email || '')
        : teamMemberEditDraft.email.trim();
    const username = normalizeCredentialText(teamMemberEditDraft.username || name);
    const password = String(teamMemberEditDraft.password || '').trim();

    if (role === 'Müşteri/Misafir' && !customerId) {
      alert('Müşteri/Misafir hesabı için bağlı müşteri seçmelisin.');
      return;
    }

    if (!name) {
      alert(role === 'Müşteri/Misafir' ? 'Bağlı müşteri kaydı bulunamadı.' : 'Kişi adı boş olamaz.');
      return;
    }

    if (!username) {
      alert('Kullanıcı adı boş olamaz.');
      return;
    }

    if (password.length < 4) {
      alert('Şifre en az 4 karakter olmalı.');
      return;
    }

    const isCustomerLinkedToAnotherAccount = customerId
      ? customers.some(
          (customer) =>
            customer.id === customerId &&
            customer.accountUserId &&
            customer.accountUserId !== editingTeamMember.id
        ) ||
        teamMembers.some(
          (member) =>
            member.id !== editingTeamMember.id &&
            member.customerId === customerId
        )
      : false;

    if (isCustomerLinkedToAnotherAccount) {
      alert('Bu müşteri zaten başka bir giriş hesabına bağlı.');
      return;
    }

    const hasDuplicate =
      role !== 'Müşteri/Misafir' &&
      teamMembers.some(
        (member) =>
          member.id !== editingTeamMember.id &&
          member.name.toLocaleLowerCase('tr-TR') === name.toLocaleLowerCase('tr-TR')
      );

    if (hasDuplicate) {
      alert('Bu isimde başka bir ekip üyesi zaten var.');
      return;
    }

    const hasDuplicateUsername = teamMembers.some(
      (member) =>
        member.id !== editingTeamMember.id &&
        normalizeCredentialText(member.username) === username
    );

    if (hasDuplicateUsername) {
      alert('Bu kullanıcı adı zaten kullanılıyor.');
      return;
    }

    if (isLastActiveAdmin(editingTeamMember) && role !== 'Yönetici') {
      showPermissionWarning('Son aktif yöneticinin rolünü değiştiremezsin.');
      return;
    }

    const nextMember = {
      ...editingTeamMember,
      name,
      email,
      username,
      password,
      role,
      customerId,
      avatar: editingTeamMember.avatar?.startsWith?.('data:image') ? editingTeamMember.avatar : createAvatarFromName(name)
    };
    // zrc-v404c-team-role-persist
    const zrcEditedMemberId = String(editingTeamMember?.id || '').trim();
    const zrcWorkspaceIdForMemberUpdate = getCurrentSupabaseWorkspaceId();

    if (isSupabaseUuid(zrcEditedMemberId) && isSupabaseUuid(zrcWorkspaceIdForMemberUpdate)) {
      try {
        zrcSetSupabaseWriteInfo('saving', 'Ekip rolü Supabase kaydediliyor');

        const response = await fetch('/api/update-team-member', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            workspaceId: zrcWorkspaceIdForMemberUpdate,
            userId: zrcEditedMemberId,
            name,
            username,
            role,
            status: editingTeamMember?.status || 'Aktif',
            customerId
          })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result?.error) {
          throw new Error(result?.error || 'Ekip rolü güncellenemedi.');
        }

        zrcSetSupabaseWriteInfo('saved', 'Ekip rolü Supabase kaydedildi');
      } catch (error) {
        const message = error?.message || 'Ekip rolü güncellenemedi.';
        zrcSetSupabaseWriteInfo('error', message);
        alert(message);
        return;
      }
    }



    setTeamMembers((prevMembers) =>
      prevMembers.map((member) => (member.id === editingTeamMember.id ? nextMember : member))
    );

    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) => {
        if (customer.accountUserId === editingTeamMember.id && customer.id !== customerId) {
          return { ...customer, accountUserId: '' };
        }

        if (customer.id === customerId) {
          return { ...customer, accountUserId: editingTeamMember.id };
        }

        return customer;
      })
    );

    setBoardColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => ({
          ...task,
          assignees: updateTaskUserList(task.assignees || [], editingTeamMember, nextMember),
          followers: updateTaskUserList(task.followers || [], editingTeamMember, nextMember)
        }))
      }))
    );

    setArchivedTasks((prevArchivedTasks) =>
      prevArchivedTasks.map((task) => ({
        ...task,
        assignees: updateTaskUserList(task.assignees || [], editingTeamMember, nextMember),
        followers: updateTaskUserList(task.followers || [], editingTeamMember, nextMember)
      }))
    );

    setSelectedTeamMemberId(editingTeamMember.id);
    closeTeamMemberEditModal();
}

export async function zrcHandleSaveProjectSettingsAction(ctx) {
  const {selectedProject, projects, setProjects, requirePermission, projectSettingsDraft, getCustomerByName, projectSettings, projectTeamAssignableMembers, getTeamMemberNameById, createProjectTeamHistoryEntry, setProjectSettings, syncProjectTasksWithTeam, createActivityNotification, isCurrentSupabaseUserId, setProjectBoards, setSelectedProject, saveProjectSettingsToSupabase, loadWorkspaceStructureFromSupabase} = ctx;

    if (!requirePermission('manageProjectSettings', 'Proje ayarlarını sadece Yönetici düzenleyebilir.')) return;

    if (!selectedProject) return;

    const cleanTitle = projectSettingsDraft.title.trim();

    if (!cleanTitle) {
      alert('Proje adı boş olamaz.');
      return;
    }

    const isRenaming = cleanTitle !== selectedProject;
    const linkedProjectCustomer = getCustomerByName(projectSettingsDraft.customer);
    const previousSettings = {
      ...createDefaultProjectSettings(selectedProject),
      ...(projectSettings[selectedProject] || {})
    };

    const assignableMemberIds = projectTeamAssignableMembers.map((member) => String(member.id));

    const previousTeamMemberIds = Array.isArray(previousSettings.teamMemberIds)
      ? previousSettings.teamMemberIds.map(String).filter((memberId) => assignableMemberIds.includes(memberId))
      : [];

    const nextTeamMemberIds = Array.from(
      new Set(
        (Array.isArray(projectSettingsDraft.teamMemberIds) ? projectSettingsDraft.teamMemberIds : [])
          .map(String)
          .filter((memberId) => assignableMemberIds.includes(memberId))
      )
    );

    const addedTeamMemberIds = nextTeamMemberIds.filter((memberId) => !previousTeamMemberIds.includes(memberId));
    const removedTeamMemberIds = previousTeamMemberIds.filter((memberId) => !nextTeamMemberIds.includes(memberId));
    const addedTeamMemberNames = addedTeamMemberIds.map((memberId) => getTeamMemberNameById(memberId));
    const removedTeamMemberNames = removedTeamMemberIds.map((memberId) => getTeamMemberNameById(memberId));

    const teamHistoryEntries = [
      ...(addedTeamMemberIds.length > 0
        ? [
            createProjectTeamHistoryEntry(
              'team-add',
              'Proje ekibine kişi eklendi',
              `${addedTeamMemberNames.join(', ')} projeye eklendi.`,
              addedTeamMemberIds,
              cleanTitle
            )
          ]
        : []),
      ...(removedTeamMemberIds.length > 0
        ? [
            createProjectTeamHistoryEntry(
              'team-remove',
              'Proje ekibinden kişi çıkarıldı',
              `${removedTeamMemberNames.join(', ')} projeden çıkarıldı ve görevli/takipçi listelerinden temizlendi.`,
              removedTeamMemberIds,
              cleanTitle
            )
          ]
        : [])
    ];

    if (isRenaming && projects.includes(cleanTitle)) {
      alert('Bu isimde başka bir proje zaten var.');
      return;
    }

    setProjectSettings((prevSettings) => {
      const nextSettings = { ...prevSettings };
      delete nextSettings[selectedProject];

      nextSettings[cleanTitle] = {
        ...projectSettingsDraft,
        title: cleanTitle,
        description: projectSettingsDraft.description?.trim() || '',
        customer: projectSettingsDraft.customer?.trim() || '',
        customerId: projectSettingsDraft.customerId || linkedProjectCustomer?.id || '',
        teamMemberIds: nextTeamMemberIds,
        teamHistory: [
          ...teamHistoryEntries,
          ...(Array.isArray(previousSettings.teamHistory) ? previousSettings.teamHistory : [])
        ].slice(0, 60),
        status: projectSettingsDraft.status || 'Aktif',
        color: projectSettingsDraft.color || '#ff3600'
      };

      return nextSettings;
    });

    if (removedTeamMemberIds.length > 0) {
      syncProjectTasksWithTeam(selectedProject, nextTeamMemberIds, removedTeamMemberIds);
    }

    if (addedTeamMemberIds.length > 0) {
      createActivityNotification({
        type: 'project-team',
        title: 'Projeye ekip üyesi eklendi',
        text: addedTeamMemberNames.join(', '),
        meta: `${cleanTitle} · Proje Ekibi`,
        projectName: cleanTitle,
        targetUserIds: addedTeamMemberIds.filter((userId) => !isCurrentSupabaseUserId(userId)),
        sortWeight: 840
      });
    }

    if (removedTeamMemberIds.length > 0) {
      createActivityNotification({
        type: 'project-team',
        title: 'Projeden ekip üyesi çıkarıldı',
        text: removedTeamMemberNames.join(', '),
        meta: `${cleanTitle} · Görevli/takipçi listeleri temizlendi`,
        projectName: cleanTitle,
        sortWeight: 840
      });
    }

    if (isRenaming) {
      setProjects((prevProjects) => prevProjects.map((project) => (project === selectedProject ? cleanTitle : project)));

      setProjectBoards((prevBoards) => {
        const nextBoards = { ...prevBoards };

        if (nextBoards[selectedProject]) {
          nextBoards[cleanTitle] = nextBoards[selectedProject];
          delete nextBoards[selectedProject];
        }

        return nextBoards;
      });

      setSelectedProject(cleanTitle);
    }

    const projectSettingsSupabaseSaved = await saveProjectSettingsToSupabase(
      cleanTitle,
      {
        ...projectSettingsDraft,
        title: cleanTitle,
        description: projectSettingsDraft.description?.trim() || '',
        customer: projectSettingsDraft.customer?.trim() || '',
        customerId: projectSettingsDraft.customerId || linkedProjectCustomer?.id || '',
        teamMemberIds: nextTeamMemberIds,
        status: projectSettingsDraft.status || 'Aktif',
        color: projectSettingsDraft.color || '#ff3600'
      },
      selectedProject
    );

    if (!projectSettingsSupabaseSaved) {
      await loadWorkspaceStructureFromSupabase();
      alert('Proje ayarları veritabanına kaydedilemedi. Ekran veritabanındaki son sağlam hale geri senkronlandı.');
      return;
    }

    await loadWorkspaceStructureFromSupabase();

    alert(
      removedTeamMemberIds.length > 0
        ? 'Proje ayarları kaydedildi. Çıkarılan kişiler görevli/takipçi listelerinden temizlendi.'
        : 'Proje ayarları kaydedildi.'
    );
}

export async function zrcLoadWorkspaceStructureFromSupabaseAction(ctx) {
  const {supabase, selectedProject, setProjects, getCurrentSupabaseWorkspaceId, authSessionLoading, mergeSupabaseCustomersIntoLocalState, normalizeCredentialText, setSelectedProject, setProjectSettings, isSupabaseUuid, supabaseAuthUserId, currentUserId, currentRoleMember, isZrcAjansIdentityRecord, currentAccountType, projectName, settings, setProjectBoards, mergeSupabaseWorkspaceMembersIntoLocalState, zrcSetSupabaseWriteInfo, error} = ctx;

    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || authSessionLoading) return;

    try {
      const { data: dbCustomers, error: customersError } = await supabase
        .from('customers')
        .select('id, name, contact_name, email, phone, note, status, account_user_id')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;

      mergeSupabaseCustomersIntoLocalState(dbCustomers || []);

      const { data: dbProjects, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, description, customer_id, status, color')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (projectsError) throw projectsError;

      const legacyProjectNameKeys = new Set(['eticaretarayuztasarimi', 'odev']);
      const cleanDbProjects = (dbProjects || []).filter((project) => {
        const projectNameKey = normalizeCredentialText(project?.name || '');
        return project?.name && !legacyProjectNameKeys.has(projectNameKey);
      });

      const projectIds = cleanDbProjects.map((project) => project.id).filter(Boolean);
      let dbProjectMembers = [];
      let dbProjectCustomers = [];

      if (projectIds.length > 0) {
        const { data: projectMembersData, error: projectMembersError } = await supabase
          .from('project_members')
          .select('project_id, user_id')
          .in('project_id', projectIds);

        if (!projectMembersError) {
          dbProjectMembers = projectMembersData || [];
        }

        const { data: projectCustomersData, error: projectCustomersError } = await supabase
          .from('project_customers')
          .select('project_id, customer_id')
          .in('project_id', projectIds);

        if (!projectCustomersError) {
          dbProjectCustomers = projectCustomersData || [];
        }
      }

      if (cleanDbProjects.length > 0) {
        const dbProjectNames = cleanDbProjects.map((project) => project.name).filter(Boolean);

        setProjects(dbProjectNames);

        if (!dbProjectNames.includes(selectedProject)) {
          setSelectedProject(dbProjectNames[0] || '');
        }

        const customersById = new Map((dbCustomers || []).map((customer) => [customer.id, customer]));
        const projectMembersByProjectId = new Map();
        dbProjectMembers.forEach((member) => {
          projectMembersByProjectId.set(member.project_id, [
            ...(projectMembersByProjectId.get(member.project_id) || []),
            member.user_id
          ]);
        });

        const projectCustomersByProjectId = new Map();
        dbProjectCustomers.forEach((customerLink) => {
          projectCustomersByProjectId.set(customerLink.project_id, customerLink.customer_id);
        });

        setProjectSettings((prevSettings) => {
          const nextSettings = {};

          cleanDbProjects.forEach((project) => {
            const linkedCustomerId = projectCustomersByProjectId.get(project.id) || project.customer_id || '';
            const linkedCustomer = customersById.get(linkedCustomerId);
            const previousProjectSettings = prevSettings[project.name] || {};
            const dbTeamMemberIds = projectMembersByProjectId.get(project.id) || [];
            const localTeamMemberIds = (Array.isArray(previousProjectSettings.teamMemberIds)
              ? previousProjectSettings.teamMemberIds
              : []
            ).filter((memberId) => !isSupabaseUuid(memberId));

            const ownerLikeMemberIds = [
              supabaseAuthUserId,
              currentUserId,
              currentRoleMember?.id
            ]
              .filter(Boolean)
              .map(String);

            const cleanDbTeamMemberIds = dbTeamMemberIds.filter((memberId) => {
              const cleanMemberId = String(memberId || '');

              if (!cleanMemberId) return false;
              if (isZrcAjansIdentityRecord({ id: cleanMemberId })) return false;
              if (currentAccountType === 'Patron' && ownerLikeMemberIds.includes(cleanMemberId)) return false;

              return true;
            });

            nextSettings[project.name] = {
              ...createDefaultProjectSettings(project.name),
              ...previousProjectSettings,
              title: project.name,
              description: project.description || previousProjectSettings.description || '',
              customer: linkedCustomer?.name || previousProjectSettings.customer || '',
              customerId: linkedCustomerId || previousProjectSettings.customerId || '',
              teamMemberIds: Array.from(new Set([...cleanDbTeamMemberIds, ...localTeamMemberIds])),
              status: project.status || previousProjectSettings.status || 'Aktif',
              color: project.color || previousProjectSettings.color || '#ff3600'
            };
          });

          Object.entries(prevSettings || {}).forEach(([projectName, settings]) => {
            if (!nextSettings[projectName] && !cleanDbProjects.some((project) => project.name === projectName)) {
              nextSettings[projectName] = settings;
            }
          });

          return nextSettings;
        });
      } else {
        setProjects([]);
        setSelectedProject('');
        setProjectSettings({});
        setProjectBoards({});
      }

      const { data: dbMembers, error: membersError } = await supabase
        .from('workspace_members')
        .select('workspace_id, user_id, role, status, username, customer_id, profiles(display_name, email, avatar_url)')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (!membersError) {
        mergeSupabaseWorkspaceMembersIntoLocalState(dbMembers || []);
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase çalışma alanı yüklendi');
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase çalışma alanı okuma hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
}

export async function zrcCreateCustomerFromCenterAction(ctx, event) {
  const {supabase, teamMembers, setTeamMembers, customers, setCustomers, requirePermission, customerDraft, normalizeCredentialText, setSelectedCustomerId, setPendingCustomerDeleteId, saveCustomerToSupabase, getCurrentSupabaseWorkspaceId, zrcSetSupabaseWriteInfo, isSupabaseUuid, normalizeTeamMember, setSelectedTeamMemberId, error, setCustomerDraft} = ctx;

    event.preventDefault();

    if (!requirePermission('manageCustomers', 'Müşteri ekleme yetkisi sadece Yönetici rolünde var.')) return;

    const name = customerDraft.name.trim();
    const contact = customerDraft.contact.trim();
    const email = '';
    const phone = customerDraft.phone.trim();
    const note = customerDraft.note.trim();
    const accountUsername = normalizeCredentialText(customerDraft.username || '');
    const accountPassword = String(customerDraft.password || '').trim();
    const wantsLoginAccount = Boolean(accountUsername || accountPassword);

    if (!name) {
      alert('Müşteri adı boş olamaz.');
      return;
    }

    if (customers.some((customer) => customer.name.toLocaleLowerCase('tr-TR') === name.toLocaleLowerCase('tr-TR'))) {
      alert('Bu isimde bir müşteri zaten var.');
      return;
    }

    if (wantsLoginAccount && !accountUsername) {
      alert('Müşteri giriş hesabı için kullanıcı adı yazmalısın.');
      return;
    }

    if (wantsLoginAccount && accountPassword.length < 4) {
      alert('Müşteri giriş şifresi en az 4 karakter olmalı.');
      return;
    }

    if (
      wantsLoginAccount &&
      teamMembers.some((member) => normalizeCredentialText(member.username) === accountUsername)
    ) {
      alert('Bu kullanıcı adı zaten kullanılıyor.');
      return;
    }

    const nextCustomer = {
      id: `customer-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      contact,
      email,
      phone,
      note,
      accountUserId: '',
      status: 'Aktif'
    };

    setCustomers((prevCustomers) => [nextCustomer, ...prevCustomers]);
    setSelectedCustomerId(nextCustomer.id);
    setPendingCustomerDeleteId(null);

    const savedCustomer = await saveCustomerToSupabase(nextCustomer);
    const savedCustomerId = savedCustomer?.id || nextCustomer.id;

    if (wantsLoginAccount) {
      const workspaceId = getCurrentSupabaseWorkspaceId();

      if (!workspaceId) {
        alert('Müşteri oluşturuldu ama giriş hesabı için workspace bilgisi alınamadı. Çıkış yapıp tekrar giriş yap.');
        return;
      }

      try {
        zrcSetSupabaseWriteInfo('saving', 'Müşteri giriş hesabı oluşturuluyor');

        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token || '';

        if (!accessToken) {
          alert('Müşteri oluşturuldu ama yönetici oturumu bulunamadığı için giriş hesabı açılamadı.');
          zrcSetSupabaseWriteInfo('error', 'Yönetici oturumu bulunamadı');
          return;
        }

        const response = await fetch('/api/create-team-member', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            workspaceId,
            name,
            username: accountUsername,
            password: accountPassword,
            role: 'Müşteri/Misafir',
            customerId: isSupabaseUuid(savedCustomerId) ? savedCustomerId : ''
          })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result?.error || 'Müşteri giriş hesabı oluşturulamadı.');
        }

        const nextMember = normalizeTeamMember({
          ...(result.member || {}),
          password: '',
          authProvider: 'supabase'
        });

        setTeamMembers((prevMembers) => {
          const withoutSameMember = (prevMembers || []).filter((member) => member.id !== nextMember.id);
          return [nextMember, ...withoutSameMember].map(normalizeTeamMember);
        });

        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.id === nextCustomer.id || customer.id === savedCustomerId
              ? { ...customer, accountUserId: nextMember.id }
              : customer
          )
        );

        await saveCustomerToSupabase({
          ...nextCustomer,
          id: savedCustomerId,
          accountUserId: nextMember.id
        });

        setSelectedTeamMemberId(nextMember.id);
        zrcSetSupabaseWriteInfo('saved', 'Müşteri ve giriş hesabı oluşturuldu');
      } catch (error) {
        const errorMessage = error?.message || 'Müşteri giriş hesabı oluşturulamadı.';
        alert(`Müşteri oluşturuldu ama giriş hesabı açılamadı: ${errorMessage}`);
        zrcSetSupabaseWriteInfo('error', errorMessage);
      }
    }

    setCustomerDraft({
      name: '',
      contact: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      note: '',
      accountUserId: ''
    });
}

export async function zrcSaveCustomerEditAction(ctx, event) {
  const {teamMembers, setTeamMembers, customers, setCustomers, requirePermission, editingCustomer, customerEditDraft, saveCustomerToSupabase, setBoardColumns, setArchivedTasks, setProjectSettings, projectName, settings, setSelectedCustomerId, closeCustomerEditModal} = ctx;

    event.preventDefault();

    if (!requirePermission('manageCustomers', 'Müşterileri sadece Yönetici düzenleyebilir.')) return;
    if (!editingCustomer) return;

    const name = customerEditDraft.name.trim();
    const contact = customerEditDraft.contact.trim();
    const email = editingCustomer.email || '';
    const phone = customerEditDraft.phone.trim();
    const note = customerEditDraft.note.trim();
    const accountUserId = editingCustomer.accountUserId || '';

    if (!name) {
      alert('Müşteri adı boş olamaz.');
      return;
    }

    const hasDuplicate = customers.some(
      (customer) =>
        customer.id !== editingCustomer.id &&
        customer.name.toLocaleLowerCase('tr-TR') === name.toLocaleLowerCase('tr-TR')
    );

    if (hasDuplicate) {
      alert('Bu isimde başka bir müşteri zaten var.');
      return;
    }

    const accountAlreadyLinked = accountUserId
      ? customers.some(
          (customer) =>
            customer.id !== editingCustomer.id &&
            customer.accountUserId === accountUserId
        ) ||
        teamMembers.some(
          (member) =>
            member.id === accountUserId &&
            member.customerId &&
            member.customerId !== editingCustomer.id
        )
      : false;

    if (accountAlreadyLinked) {
      alert('Bu müşteri hesabı zaten başka bir müşteri kartına bağlı.');
      return;
    }

    const oldName = editingCustomer.name;
    const nextCustomer = {
      ...editingCustomer,
      name,
      contact,
      email,
      phone,
      note,
      accountUserId
    };

    const savedCustomerResult = await saveCustomerToSupabase(nextCustomer);

    if (!savedCustomerResult) {
      alert('Müşteri bilgileri veritabanına kaydedilemedi. Lütfen tekrar dene.');
      return;
    }

    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === editingCustomer.id
          ? {
              ...customer,
              name,
              contact,
              email,
              phone,
              note,
              accountUserId
            }
          : customer
      )
    );

    setTeamMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.id === accountUserId) {
          return { ...member, role: 'Müşteri/Misafir', customerId: editingCustomer.id };
        }

        if (member.customerId === editingCustomer.id || member.id === editingCustomer.accountUserId) {
          return { ...member, customerId: '' };
        }

        return member;
      })
    );

    if (oldName && oldName !== name) {
      setBoardColumns((prevColumns) =>
        prevColumns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.customer === oldName
              ? {
                  ...task,
                  customer: name
                }
              : task
          )
        }))
      );

      setArchivedTasks((prevArchivedTasks) =>
        prevArchivedTasks.map((task) =>
          task.customer === oldName
            ? {
                ...task,
                customer: name
              }
            : task
        )
      );

      setProjectSettings((prevSettings) =>
        Object.fromEntries(
          Object.entries(prevSettings).map(([projectName, settings]) => [
            projectName,
            settings.customer === oldName
              ? {
                  ...settings,
                  customer: name,
                  customerId: editingCustomer.id
                }
              : settings
          ])
        )
      );
    }

    setSelectedCustomerId(editingCustomer.id);
    closeCustomerEditModal();
}

export async function zrcSaveTaskToSupabaseAction(ctx, taskData, targetStatus) {
  const {supabase, selectedProject, getCurrentSupabaseWorkspaceId, zrcSetSupabaseWriteInfo, ensureSupabaseProject, boardColumns, ensureSupabaseColumn, isSupabaseUuid, getPlainTaskDescription, getSafeSupabasePriority, getSupabaseSafeDate, currentUserId, getSupabaseTaskIdFromLocalTask, setBoardColumns, supabaseAuthUserId, person, isZrcAjansIdentityRecord, zrcAjansSystemMember, currentAccountType, people} = ctx;

    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !selectedProject || !taskData?.title) return;

    zrcSetSupabaseWriteInfo('saving', 'Supabase görev kaydediliyor');

    try {
      const projectId = await ensureSupabaseProject(selectedProject);
      const targetColumn = boardColumns.find((column) => column.title === targetStatus) || boardColumns[0];
      const targetColumnIndex = Math.max(0, boardColumns.findIndex((column) => column.title === targetStatus));
      const columnId = await ensureSupabaseColumn(projectId, targetColumn || { title: targetStatus }, targetColumnIndex);

      if (!projectId) return;

      const payload = {
        workspace_id: workspaceId,
        project_id: projectId,
        column_id: columnId || null,
        customer_id: isSupabaseUuid(taskData.customerId) ? taskData.customerId : null,
        title: taskData.title || 'Adsız görev',
        description: getPlainTaskDescription(taskData.description || taskData.note),
        rich_description: typeof taskData.richDescription === 'object' && taskData.richDescription !== null ? taskData.richDescription : (typeof taskData.rich_description === 'object' && taskData.rich_description !== null ? taskData.rich_description : {}),
        priority: getSafeSupabasePriority(taskData.priority),
        status: targetStatus || targetColumn?.title || 'Bekliyor',
        start_date: getSupabaseSafeDate(taskData.startDate),
        due_date: getSupabaseSafeDate(taskData.dueDate || taskData.endDate),
        end_date: getSupabaseSafeDate(taskData.endDate),
        tags: Array.isArray(taskData.tags) ? taskData.tags : [],
        is_archived: false,
        updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null
      };

      let savedTask = null;
      const existingSupabaseTaskId = getSupabaseTaskIdFromLocalTask(taskData) || getSupabaseTaskIdFromLocalTask(taskData.id);

      if (existingSupabaseTaskId) {
        const { data, error } = await supabase
          .from('tasks')
          .update(payload)
          .eq('id', existingSupabaseTaskId)
          .select('id')
          .maybeSingle();

        if (error) throw error;
        savedTask = data || { id: existingSupabaseTaskId };
      } else {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            ...payload,
            created_by: isSupabaseUuid(currentUserId) ? currentUserId : null
          })
          .select('id')
          .single();

        if (error) throw error;
        savedTask = data;
      }

      if (savedTask?.id) {
        setBoardColumns((prevColumns) =>
          prevColumns.map((column) => ({
            ...column,
            tasks: (column.tasks || []).map((task) =>
              task.id === taskData.id ? { ...task, supabaseId: savedTask.id } : task
            )
          }))
        );

        const { data: activeSessionData } = await supabase.auth.getSession();
        const activeAuthUserId = activeSessionData?.session?.user?.id || supabaseAuthUserId || currentUserId;

        const getSupabaseUserIdForTaskPerson = (person = {}) => {
          const rawId = person?.id || person?.userId;

          if (isSupabaseUuid(rawId)) return rawId;

          if (isZrcAjansIdentityRecord(person) && isSupabaseUuid(zrcAjansSystemMember?.id)) {
            return zrcAjansSystemMember.id;
          }

          if (isZrcAjansIdentityRecord(person) && isSupabaseUuid(activeAuthUserId) && currentAccountType === 'Patron') {
            return activeAuthUserId;
          }

          return null;
        };

        const uniqueSupabaseUserIds = (people = []) =>
          Array.from(
            new Set(
              (people || [])
                .map(getSupabaseUserIdForTaskPerson)
                .filter(isSupabaseUuid)
            )
          );

        const assigneeIds = uniqueSupabaseUserIds(taskData.assignees || []);
        const followerIds = uniqueSupabaseUserIds(taskData.followers || []);

        const { error: deleteAssigneesError } = await supabase.from('task_assignees').delete().eq('task_id', savedTask.id);
        if (deleteAssigneesError) throw deleteAssigneesError;

        const { error: deleteFollowersError } = await supabase.from('task_followers').delete().eq('task_id', savedTask.id);
        if (deleteFollowersError) throw deleteFollowersError;

        if (assigneeIds.length > 0) {
          const { error: insertAssigneesError } = await supabase
            .from('task_assignees')
            .insert(assigneeIds.map((userId) => ({ task_id: savedTask.id, user_id: userId })));

          if (insertAssigneesError) throw insertAssigneesError;
        }

        if (followerIds.length > 0) {
          const { error: insertFollowersError } = await supabase
            .from('task_followers')
            .insert(followerIds.map((userId) => ({ task_id: savedTask.id, user_id: userId })));

          if (insertFollowersError) throw insertFollowersError;
        }
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase görev kaydedildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase görev hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
}

export async function zrcLoadSelectedProjectBoardFromSupabaseAction(ctx) {
  const {supabase, selectedProject, getCurrentSupabaseWorkspaceId, authSessionLoading, zrcSetSupabaseWriteInfo, mergeSupabaseBoardIntoLocalState, error} = ctx;

    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !selectedProject || authSessionLoading) return;

    zrcSetSupabaseWriteInfo('saving', 'Supabase görevler okunuyor');

    try {
      const { data: projectRecord, error: projectError } = await supabase
        .from('projects')
        .select('id, name')
        .eq('workspace_id', workspaceId)
        .eq('name', selectedProject)
        .maybeSingle();

      if (projectError) throw projectError;

      if (!projectRecord?.id) {
        zrcSetSupabaseWriteInfo('saved', 'Supabase proje henüz boş');
        return;
      }

      const { data: dbColumns, error: columnsError } = await supabase
        .from('board_columns')
        .select('id, title, description, color, position, is_archived')
        .eq('project_id', projectRecord.id)
        .eq('is_archived', false)
        .order('position', { ascending: true });

      if (columnsError) throw columnsError;

      const { data: dbTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id, column_id, title, description, rich_description, priority, status, start_date, due_date, end_date, tags, is_archived, customer_id, created_at, updated_at')
        .eq('project_id', projectRecord.id)
        .order('created_at', { ascending: true });

      if (tasksError) throw tasksError;

      const taskIds = (dbTasks || []).map((task) => task.id).filter(Boolean);
      let enrichedTasks = dbTasks || [];

      if (taskIds.length > 0) {
        const { data: dbComments, error: commentsError } = await supabase
          .from('task_comments')
          .select('id, task_id, author_id, body, created_at')
          .in('task_id', taskIds)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;

        const { data: dbSteps, error: stepsError } = await supabase
          .from('task_steps')
          .select('id, task_id, text, is_completed, position, created_at')
          .in('task_id', taskIds)
          .order('position', { ascending: true });

        if (stepsError) throw stepsError;

        const { data: dbFiles, error: filesError } = await supabase
          .from('files')
          .select('id, task_id, uploaded_by, bucket, storage_path, file_name, file_type, size_bytes, note, created_at')
          .in('task_id', taskIds)
          .order('created_at', { ascending: true });

        if (filesError) throw filesError;

        const { data: dbAssignees, error: assigneesError } = await supabase
          .from('task_assignees')
          .select('task_id, user_id')
          .in('task_id', taskIds);

        if (assigneesError) {
          console.warn('[ZRC Supabase] Görevli bağlantıları okunamadı.', assigneesError);
        }

        const { data: dbFollowers, error: followersError } = await supabase
          .from('task_followers')
          .select('task_id, user_id')
          .in('task_id', taskIds);

        if (followersError) {
          console.warn('[ZRC Supabase] Takipçi bağlantıları okunamadı.', followersError);
        }

        const commentsByTask = new Map();
        (dbComments || []).forEach((comment) => {
          commentsByTask.set(comment.task_id, [...(commentsByTask.get(comment.task_id) || []), comment]);
        });

        const stepsByTask = new Map();
        (dbSteps || []).forEach((step) => {
          stepsByTask.set(step.task_id, [...(stepsByTask.get(step.task_id) || []), step]);
        });

        const filesByTask = new Map();
        (dbFiles || []).forEach((file) => {
          filesByTask.set(file.task_id, [...(filesByTask.get(file.task_id) || []), file]);
        });

        const assigneesByTask = new Map();
        (dbAssignees || []).forEach((assignee) => {
          assigneesByTask.set(assignee.task_id, [...(assigneesByTask.get(assignee.task_id) || []), assignee]);
        });

        const followersByTask = new Map();
        (dbFollowers || []).forEach((follower) => {
          followersByTask.set(follower.task_id, [...(followersByTask.get(follower.task_id) || []), follower]);
        });

        enrichedTasks = (dbTasks || []).map((task) => ({
          ...task,
          _comments: commentsByTask.get(task.id) || [],
          _steps: stepsByTask.get(task.id) || [],
          _files: filesByTask.get(task.id) || [],
          _assignees: assigneesByTask.get(task.id) || [],
          _followers: followersByTask.get(task.id) || []
        }));
      }

      mergeSupabaseBoardIntoLocalState(selectedProject, dbColumns || [], enrichedTasks);
      zrcSetSupabaseWriteInfo('saved', 'Supabase görev ve detaylar yüklendi');
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase okuma hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
}
