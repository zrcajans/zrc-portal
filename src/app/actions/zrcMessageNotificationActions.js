
const ZRC_CLEARED_NOTIFICATION_IDS_KEY = 'zrcClearedNotificationIds';
const ZRC_CLEARED_NOTIFICATION_KEYS_KEY = 'zrcClearedNotificationKeys';

const zrcNotificationFingerprint = (notification = {}) =>
  [
    notification.id,
    notification.type,
    notification.title,
    notification.text,
    notification.meta,
    notification.projectName,
    notification.chatGroupId,
    notification.task?.id,
    notification.task?.title,
    notification.createdAt,
    notification.updatedAt,
    notification.time
  ]
    .map((value) => String(value || '').trim().toLowerCase())
    .join('|');

const zrcNotificationIdVariants = (notification = {}) => {
  const rawId = String(notification?.id || '').trim();
  const ids = new Set();

  if (rawId) {
    ids.add(rawId);

    if (rawId.startsWith('supabase-notification-')) {
      const cleanId = rawId.replace('supabase-notification-', '');
      if (cleanId) ids.add(cleanId);
    } else {
      ids.add(`supabase-notification-${rawId}`);
    }
  }

  return Array.from(ids);
};

const zrcReadJsonArray = (storageKey) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const zrcWriteJsonArray = (storageKey, values) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(storageKey, JSON.stringify(Array.from(new Set((values || []).map(String)))));
  } catch (error) {
    console.warn('[ZRC] Bildirim temizleme bilgisi kaydedilemedi.', error);
  }
};


export function createZRCMessageNotificationActions(deps) {
  const {
    isSupabaseUuid,
    supabase,
    currentUserId,
    setReadNotificationIds,
    saveUserPreferencesToSupabase,
    notificationItems,
    isNotificationVisibleForCurrentUser,
    showPermissionWarning,
    setIsNotificationsOpen,
    getProjectNameForNotification,
    guardProjectAccess,
    isChatGroupIdVisibleForCurrentUser,
    setActiveMenu,
    setActiveContentMenu,
    setSelectedChatGroupId,
    setSelectedProject,
    openTaskDetail,
    setReadMessageIds,
    messageItems,
    isProjectMessageVisibleForCurrentUser,
    setIsMessagesOpen,
    setIsMessageTaskPickerOpen,
    getProjectNameForMessage,
    currentPermissions,
    messageDraft,
    selectedMessageTask,
    getProjectNameForTask,
    selectedProject,
    isTaskAccessibleForCurrentUser,
    messageLinkedTaskId,
    currentActorId,
    currentProfileName,
    currentProfileAvatar,
    setProjectMessages,
    saveProjectMessageToSupabase,
    createActivityNotification,
    setMessageDraft,
    setOpenMenuColumnId,
    setOpenTaskMenuId,
    setIsPanelOpen,
    setIsGlobalSearchOpen,
    setGlobalSearchQuery,
    setGlobalSearchFilter,
    isProjectFileVisibleForCurrentUser,
    setActiveTab,
    setSelectedProjectFileKey,
    canCreateChatGroups,
    setIsChatGroupModalOpen,
    setIsChatActionMenuOpen,
    chatGroupDraft,
    allChatGroups,
    createAvatarFromName,
    setChatGroups,
    saveChatGroupToSupabase,
    setChatGroupDraft,
    chatPageDraft,
    selectedChatGroup,
    isChatGroupVisibleForCurrentUser,
    getProjectNameFromChatGroupId,
    setChatPageDraft
  } = deps;

  const markNotificationAsRead = (notificationId) => {
    if (String(notificationId || '').startsWith('supabase-notification-')) {
      const supabaseNotificationId = String(notificationId).replace('supabase-notification-', '');

      if (isSupabaseUuid(supabaseNotificationId)) {
        supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', supabaseNotificationId)
          .eq('user_id', currentUserId)
          .then(() => {});
      }
    }

    setReadNotificationIds((prevIds) => {
      if (prevIds.includes(notificationId)) return prevIds;

      const nextIds = [...prevIds, notificationId];
      saveUserPreferencesToSupabase({ readNotificationIds: nextIds });
      return nextIds;
    });
  };

  const markAllNotificationsAsRead = () => {
    const visibleNotifications = Array.isArray(notificationItems) ? notificationItems : [];

    const clearIds = visibleNotifications.flatMap(zrcNotificationIdVariants).filter(Boolean);
    const clearKeys = visibleNotifications.map(zrcNotificationFingerprint).filter(Boolean);

    zrcWriteJsonArray(ZRC_CLEARED_NOTIFICATION_IDS_KEY, [
      ...zrcReadJsonArray(ZRC_CLEARED_NOTIFICATION_IDS_KEY),
      ...clearIds
    ]);

    zrcWriteJsonArray(ZRC_CLEARED_NOTIFICATION_KEYS_KEY, [
      ...zrcReadJsonArray(ZRC_CLEARED_NOTIFICATION_KEYS_KEY),
      ...clearKeys
    ]);

    const supabaseNotificationIds = clearIds
      .filter((id) => !String(id).startsWith('supabase-notification-'))
      .filter(isSupabaseUuid);

    if (supabaseNotificationIds.length > 0 && supabase) {
      supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', supabaseNotificationIds)
        .then(({ error }) => {
          if (error) {
            console.warn('[ZRC] Bildirimler Supabase tarafında okundu işaretlenemedi.', error);
          }
        });
    }

    setReadNotificationIds((prevIds) => {
      const nextIds = Array.from(new Set([...(prevIds || []), ...clearIds]));
      saveUserPreferencesToSupabase({ readNotificationIds: nextIds });
      return nextIds;
    });

    if (typeof setActivityNotifications === 'function') {
      const clearIdSet = new Set(clearIds.map(String));
      const clearKeySet = new Set(clearKeys.map(String));

      setActivityNotifications((prevNotifications) =>
        (prevNotifications || []).filter((notification) => {
          const variants = zrcNotificationIdVariants(notification);
          const fingerprint = zrcNotificationFingerprint(notification);

          if (variants.some((id) => clearIdSet.has(String(id)))) return false;
          if (clearKeySet.has(String(fingerprint))) return false;

          return true;
        })
      );
    }

    if (typeof setIsNotificationsOpen === 'function') {
      setIsNotificationsOpen(false);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!isNotificationVisibleForCurrentUser(notification)) {
      showPermissionWarning('Bu bildirimin bağlı olduğu projeye artık erişimin yok.');
      return;
    }

    markNotificationAsRead(notification.id);
    setIsNotificationsOpen(false);

    const notificationProjectName = getProjectNameForNotification(notification);

    if (notificationProjectName && !guardProjectAccess(notificationProjectName, 'Bu bildirimin projesine erişim yetkin yok.')) {
      return;
    }

    if (notification.chatGroupId) {
      if (!isChatGroupIdVisibleForCurrentUser(notification.chatGroupId)) {
        showPermissionWarning('Bu yazışmayı görüntüleme yetkin yok.');
        return;
      }

      setActiveMenu('Yazışmalar');
      setActiveContentMenu('Yazışmalar');
      setSelectedChatGroupId(notification.chatGroupId);
      return;
    }

    if (notificationProjectName) {
      setSelectedProject(notificationProjectName);
    }

    if (notification.task) {
      openTaskDetail(notification.task, notification.columnTitle);
    }
  };

  const markMessageAsRead = (messageId) => {
    setReadMessageIds((prevIds) => {
      if (prevIds.includes(messageId)) return prevIds;

      const nextIds = [...prevIds, messageId];
      saveUserPreferencesToSupabase({ readMessageIds: nextIds });
      return nextIds;
    });
  };

  const markAllMessagesAsRead = () => {
    setReadMessageIds((prevIds) => {
      const nextIds = Array.from(new Set([...prevIds, ...messageItems.map((message) => message.id)]));
      saveUserPreferencesToSupabase({ readMessageIds: nextIds });
      return nextIds;
    });
  };

  const handleMessageClick = (message) => {
    if (!isProjectMessageVisibleForCurrentUser(message)) {
      showPermissionWarning('Bu mesajın bağlı olduğu projeye artık erişimin yok.');
      return;
    }

    markMessageAsRead(message.id);
    setIsMessagesOpen(false);
    setIsMessageTaskPickerOpen(false);

    const messageProjectName = getProjectNameForMessage(message);

    if (messageProjectName) {
      setSelectedProject(messageProjectName);
    }

    if (message.task) {
      openTaskDetail(message.task, message.columnTitle);
    }
  };

  const handleSendProjectMessage = async (event) => {
    event.preventDefault();

    if (!currentPermissions.message) {
      showPermissionWarning('Bu rol mesaj gönderemez.');
      return;
    }

    const text = messageDraft.trim();
    if (!text) return;

    const messageProjectName = selectedMessageTask ? getProjectNameForTask(selectedMessageTask) : selectedProject;

    if (!guardProjectAccess(messageProjectName, 'Bu projeye mesaj gönderme yetkin yok.')) return;

    if (selectedMessageTask && !isTaskAccessibleForCurrentUser(selectedMessageTask)) {
      showPermissionWarning('Bu göreve mesaj bağlama yetkin yok.');
      return;
    }

    const id = `project-message-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const nextMessage = {
      id,
      senderId: currentActorId,
      sender: currentProfileName,
      avatar: currentProfileAvatar,
      text,
      projectName: messageProjectName,
      taskId: messageLinkedTaskId || null,
      createdAt: new Date().toISOString()
    };

    setProjectMessages((prevMessages) => [nextMessage, ...prevMessages]);
    setReadMessageIds((prevIds) => Array.from(new Set([...prevIds, id])));
    await saveProjectMessageToSupabase(nextMessage);

    createActivityNotification({
      type: 'message',
      title: 'Yeni mesaj',
      text,
      meta: selectedMessageTask ? selectedMessageTask.title : 'Genel proje mesajı',
      task: selectedMessageTask,
      projectName: messageProjectName,
      columnTitle: selectedMessageTask?.columnTitle || '',
      messageId: id,
      sortWeight: 760
    });

    setMessageDraft('');
    setIsMessageTaskPickerOpen(false);
  };

  const openMessagesPanel = () => {
    setOpenMenuColumnId(null);
    setOpenTaskMenuId(null);
    setIsPanelOpen(false);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
    setIsMessageTaskPickerOpen(false);
    setIsGlobalSearchOpen(false);
    setIsMessagesOpen((prev) => !prev);
  };

  const closeGlobalSearch = () => {
    setIsGlobalSearchOpen(false);
    setGlobalSearchQuery('');
    setGlobalSearchFilter('Tümü');
  };

  const openGlobalSearch = () => {
    setOpenMenuColumnId(null);
    setOpenTaskMenuId(null);
    setIsPanelOpen(false);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
    setIsGlobalSearchOpen(true);
  };

  const handleGlobalSearchItemClick = (item) => {
    const itemProjectName = item.projectName || item.file?.projectName || getProjectNameForTask(item.task);

    if (itemProjectName && !guardProjectAccess(itemProjectName, 'Bu arama sonucunun projesine erişim yetkin yok.')) {
      closeGlobalSearch();
      return;
    }

    if (item.task && !isTaskAccessibleForCurrentUser(item.task)) {
      showPermissionWarning('Bu arama sonucundaki görevi görüntüleme yetkin yok.');
      closeGlobalSearch();
      return;
    }

    if (item.type === 'Dosya' && item.file) {
      if (!isProjectFileVisibleForCurrentUser(item.file)) {
        showPermissionWarning('Bu dosyayı görüntüleme yetkin yok.');
        closeGlobalSearch();
        return;
      }

      if (itemProjectName) {
        setSelectedProject(itemProjectName);
      }

      setActiveContentMenu('Projeler');
      setActiveMenu('Projeler');
      setActiveTab('Dosyalar');
      setSelectedProjectFileKey(item.file.fileKey);
      closeGlobalSearch();
      return;
    }

    if (item.task) {
      if (itemProjectName) {
        setSelectedProject(itemProjectName);
      }

      setActiveContentMenu('Projeler');
      setActiveMenu('Projeler');
      openTaskDetail(item.task, item.columnTitle);
    }

    closeGlobalSearch();
  };

  const createChatGroupFromPage = async (event) => {
    event.preventDefault();

    if (!canCreateChatGroups) {
      setIsChatGroupModalOpen(false);
      setIsChatActionMenuOpen(false);
      return;
    }

    const name = chatGroupDraft.trim();

    if (!name) return;

    const alreadyExists = allChatGroups.some(
      (group) => group.name.toLocaleLowerCase('tr-TR') === name.toLocaleLowerCase('tr-TR')
    );

    if (alreadyExists) {
      await window.zrcAlert('Bu isimde bir yazışma grubu zaten var.');
      return;
    }

    const nextGroup = {
      id: `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: 'custom',
      name,
      avatar: createAvatarFromName(name),
      members: [currentProfileName],
      createdAt: new Date().toISOString()
    };

    setChatGroups((prevGroups) => [nextGroup, ...prevGroups]);
    await saveChatGroupToSupabase(nextGroup);
    setSelectedChatGroupId(nextGroup.id);
    setChatGroupDraft('');
    setIsChatGroupModalOpen(false);
    setIsChatActionMenuOpen(false);
  };

  const handleSendChatPageMessage = async (event) => {
    event.preventDefault();

    if (!currentPermissions.message) {
      showPermissionWarning('Bu rol mesaj gönderemez.');
      return;
    }

    const text = chatPageDraft.trim();

    if (!text || !selectedChatGroup) return;

    if (!isChatGroupVisibleForCurrentUser(selectedChatGroup)) {
      showPermissionWarning('Bu yazışmaya mesaj gönderme yetkin yok.');
      return;
    }

    const messageProjectName = getProjectNameFromChatGroupId(selectedChatGroup.id) || selectedChatGroup.projectName || '';

    if (messageProjectName && !guardProjectAccess(messageProjectName, 'Bu projeye mesaj gönderme yetkin yok.')) return;

    const id = `chat-message-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const nextMessage = {
      id,
      senderId: currentActorId,
      sender: currentProfileName,
      avatar: currentProfileAvatar,
      text,
      projectName: messageProjectName,
      chatGroupId: selectedChatGroup.id,
      createdAt: new Date().toISOString()
    };

    setProjectMessages((prevMessages) => [...prevMessages, nextMessage]);
    setReadMessageIds((prevIds) => Array.from(new Set([...prevIds, id])));
    await saveProjectMessageToSupabase(nextMessage);

    createActivityNotification({
      type: 'message',
      title: 'Yazışmaya mesaj eklendi',
      text,
      meta: selectedChatGroup.name,
      projectName: messageProjectName,
      chatGroupId: selectedChatGroup.id,
      messageId: id,
      sortWeight: 760
    });

    setChatPageDraft('');
  };

  return {
    markNotificationAsRead,
    markAllNotificationsAsRead,
    handleNotificationClick,
    markMessageAsRead,
    markAllMessagesAsRead,
    handleMessageClick,
    handleSendProjectMessage,
    openMessagesPanel,
    closeGlobalSearch,
    openGlobalSearch,
    handleGlobalSearchItemClick,
    createChatGroupFromPage,
    handleSendChatPageMessage
  };
}
