export function createZRCProjectSettingsActions(deps) {
  const {
    requirePermission,
    selectedProject,
    projectSettingsDraft,
    getCustomerByName,
    createDefaultProjectSettings,
    projectSettings,
    projectTeamAssignableMembers,
    getTeamMemberNameById,
    createProjectTeamHistoryEntry,
    projects,
    setProjectSettings,
    syncProjectTasksWithTeam,
    createActivityNotification,
    isCurrentSupabaseUserId,
    setProjects,
    setProjectBoards,
    setSelectedProject,
    saveProjectSettingsToSupabase,
    loadWorkspaceStructureFromSupabase,
    updateProjectStatusInSupabase,
    setProjectSettingsDraft,
    deleteProjectFromSupabase,
    setActivityNotifications,
    setActiveTab
  } = deps;

  const handleSaveProjectSettings = async () => {
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
  };

  const handleArchiveProject = async () => {
    if (!requirePermission('manageProjectSettings', 'Projeyi sadece Yönetici arşivleyebilir.')) return;

    if (!selectedProject) return;

    const projectNameToArchive = selectedProject;

    const didArchiveProject = await updateProjectStatusInSupabase(projectNameToArchive, 'Arşiv');

    if (!didArchiveProject) {
      alert('Proje arşivlenemedi. Veritabanı kaydı tamamlanmadığı için ekranda değişiklik yapılmadı.');
      return;
    }

    setProjectSettingsDraft((prevDraft) => ({
      ...prevDraft,
      status: 'Arşiv'
    }));

    setProjectSettings((prevSettings) => ({
      ...prevSettings,
      [projectNameToArchive]: {
        ...createDefaultProjectSettings(projectNameToArchive),
        ...(prevSettings[projectNameToArchive] || {}),
        status: 'Arşiv'
      }
    }));
  };

  const handleDeleteProject = async () => {
    if (!requirePermission('manageProjects', 'Projeyi sadece Yönetici silebilir.')) return;

    if (!selectedProject) return;

    const projectNameToDelete = selectedProject;

    const confirmed = window.confirm(`"${projectNameToDelete}" projesi silinsin mi? Bu işlem projedeki görevleri de kaldırır.`);
    if (!confirmed) return;

    const didDeleteProject = await deleteProjectFromSupabase(projectNameToDelete);

    if (!didDeleteProject) {
      alert('Proje veritabanından silinemedi. Ekranda değişiklik yapılmadı.');
      return;
    }

    const remainingProjects = projects.filter((project) => project !== projectNameToDelete);
    const nextSelectedProject = remainingProjects[0] || '';

    setProjects(remainingProjects);

    setProjectBoards((prevBoards) => {
      const nextBoards = { ...prevBoards };
      delete nextBoards[projectNameToDelete];
      return nextBoards;
    });

    setProjectSettings((prevSettings) => {
      const nextSettings = { ...prevSettings };
      delete nextSettings[projectNameToDelete];
      return nextSettings;
    });

    setActivityNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.projectName !== projectNameToDelete)
    );

    setSelectedProject(nextSelectedProject);
    setActiveTab('Görevler');
  };

  return {
    handleSaveProjectSettings,
    handleArchiveProject,
    handleDeleteProject
  };
}
