import { getScopedStorageKey } from '../utils/storageScopeHelpers.js';

const ZRC_CLEARED_NOTIFICATION_IDS_KEY = 'zrcClearedNotificationIds';
const ZRC_CLEARED_NOTIFICATION_KEYS_KEY = 'zrcClearedNotificationKeys';
const ZRC_CLEARED_NOTIFICATION_TOKEN_PREFIX = 'cleared:';
const ZRC_CLEARED_NOTIFICATION_KEY_PREFIX = 'cleared-key:';
const ZRC_CLEARED_NOTIFICATION_BEFORE_PREFIX = 'cleared-before:';
const ZRC_CLEAR_ALL_NOTIFICATION_PREFIX = 'clear-all:';

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
    const parsed = JSON.parse(window.localStorage.getItem(getScopedStorageKey(storageKey)) || '[]');
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const zrcWriteJsonArray = (storageKey, values) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(
      getScopedStorageKey(storageKey),
      JSON.stringify(Array.from(new Set((values || []).map(String))))
    );
  } catch (error) {
    console.warn('[ZRC] Bildirim temizleme bilgisi kaydedilemedi.', error);
  }
};

const zrcClearedNotificationTokensFromItems = (notifications = []) => {
  const ids = notifications.flatMap(zrcNotificationIdVariants).filter(Boolean);
  const keys = notifications.map(zrcNotificationFingerprint).filter(Boolean);

  return {
    ids,
    keys,
    tokens: [
      ...ids.map((id) => `${ZRC_CLEARED_NOTIFICATION_TOKEN_PREFIX}${id}`),
      ...keys.map((key) => `${ZRC_CLEARED_NOTIFICATION_KEY_PREFIX}${key}`)
    ]
  };
};


export function createZRCMessageNotificationActions(deps) {
  const {
    isSupabaseUuid,
    supabase,
    currentUserId,
    getCurrentSupabaseWorkspaceId,
    readNotificationIds,
    setReadNotificationIds,
    setActivityNotifications,
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
    readMessageIds,
    setReadMessageIds,
    messageItems,
    profilePreferences,
    setProfilePreferences,
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
    setChatPageDraft,
    messageMutationLockRef,
    tryAcquireActionLock,
    releaseActionLock
  } = deps;

  const markNotificationAsRead = async (notificationId) => {
    if (readNotificationIds.includes(notificationId)) return true;

    const nextIds = [...readNotificationIds, notificationId];
    const preferencesSaved = await saveUserPreferencesToSupabase({ readNotificationIds: nextIds });

    if (!preferencesSaved) return false;

    if (String(notificationId || '').startsWith('supabase-notification-')) {
      const supabaseNotificationId = String(notificationId).replace('supabase-notification-', '');

      if (isSupabaseUuid(supabaseNotificationId)) {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', supabaseNotificationId)
          .eq('workspace_id', getCurrentSupabaseWorkspaceId())
          .eq('user_id', currentUserId);

        if (error) {
          console.warn('[ZRC] Bildirim kaydı okundu olarak işaretlenemedi.', error);
        }
      }
    }

    setReadNotificationIds((prevIds) =>
      prevIds.includes(notificationId) ? prevIds : [...prevIds, notificationId]
    );
    return true;
  };

  const markAllNotificationsAsRead = async () => {
    const visibleNotifications = Array.isArray(notificationItems) ? notificationItems : [];
    const clearState = zrcClearedNotificationTokensFromItems(visibleNotifications);
    const clearedBefore = new Date().toISOString();
    const clearedBeforeToken = `${ZRC_CLEARED_NOTIFICATION_BEFORE_PREFIX}${clearedBefore}`;
    const clearAllToken = `${ZRC_CLEAR_ALL_NOTIFICATION_PREFIX}${clearedBefore}`;
    const workspaceIdForNotificationClear =
      typeof getCurrentSupabaseWorkspaceId === 'function'
        ? getCurrentSupabaseWorkspaceId()
        : '';

    const supabaseNotificationIds = clearState.ids
      .filter((id) => !String(id).startsWith('supabase-notification-'))
      .filter(isSupabaseUuid);

    const nextClearedNotificationIds = Array.from(new Set([
      ...zrcReadJsonArray(ZRC_CLEARED_NOTIFICATION_IDS_KEY),
      ...clearState.ids
    ]));

    const nextClearedNotificationKeys = Array.from(new Set([
      ...zrcReadJsonArray(ZRC_CLEARED_NOTIFICATION_KEYS_KEY),
      ...clearState.keys
    ]));

    const nextReadTokens = Array.from(new Set([
      ...clearState.ids,
      ...clearState.tokens,
      clearedBeforeToken,
      clearAllToken
    ]));

    const preferencesSaved = await saveUserPreferencesToSupabase({
      readNotificationIds: nextReadTokens,
      notificationsClearedBefore: clearedBefore,
      notificationClearAllAt: clearedBefore,
      notificationsClearAllAt: clearedBefore,
      notificationsClearedAt: clearedBefore,
      notificationClearVersion: clearedBefore,
      notificationClearSource: currentUserId,
      clearedNotificationIds: nextClearedNotificationIds,
      clearedNotificationKeys: nextClearedNotificationKeys
    });

    if (!preferencesSaved) {
      await window.zrcAlert('Bildirimler temizlenemedi. Sunucu kaydı tamamlanmadığı için liste değiştirilmedi.');
      return;
    }

    if (supabaseNotificationIds.length > 0 && supabase) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('workspace_id', workspaceIdForNotificationClear)
        .eq('user_id', currentUserId)
        .in('id', supabaseNotificationIds);

      if (error) {
        console.warn('[ZRC] Bildirimler Supabase tarafında okundu işaretlenemedi.', error);
      }
    }

    zrcWriteJsonArray(ZRC_CLEARED_NOTIFICATION_IDS_KEY, nextClearedNotificationIds);
    zrcWriteJsonArray(ZRC_CLEARED_NOTIFICATION_KEYS_KEY, nextClearedNotificationKeys);

    setReadNotificationIds((prevIds) => {
      const nextIds = Array.from(new Set([
        ...(prevIds || []),
        ...nextReadTokens
      ]));

      return nextIds;
    });

    if (typeof setActivityNotifications === 'function') {
      const clearIdSet = new Set(clearState.ids.map(String));
      const clearKeySet = new Set(clearState.keys.map(String));

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

    markNotificationAsRead(notification.id).catch((error) => {
      console.warn('[ZRC] Bildirim okundu bilgisi kaydedilemedi.', error);
    });
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

  const markMessageAsRead = async (messageId) => {
    if (readMessageIds.includes(messageId)) return true;

    const nextIds = [...readMessageIds, messageId];
    const preferencesSaved = await saveUserPreferencesToSupabase({ readMessageIds: nextIds });

    if (!preferencesSaved) return false;

    setReadMessageIds((prevIds) =>
      prevIds.includes(messageId) ? prevIds : [...prevIds, messageId]
    );
    return true;
  };

  const markAllMessagesAsRead = async () => {
    const nextIds = Array.from(new Set([...readMessageIds, ...messageItems.map((message) => message.id)]));
    const preferencesSaved = await saveUserPreferencesToSupabase({ readMessageIds: nextIds });

    if (!preferencesSaved) return false;

    setReadMessageIds((prevIds) =>
      Array.from(new Set([...prevIds, ...nextIds]))
    );
    return true;
  };

  const clearAllMessages = async () => {
    const visibleMessageIds = Array.from(new Set(
      (Array.isArray(messageItems) ? messageItems : [])
        .map((message) => String(message?.id || '').trim())
        .filter(Boolean)
    ));

    if (visibleMessageIds.length === 0) {
      setIsMessagesOpen(false);
      setIsMessageTaskPickerOpen(false);
      return true;
    }

    const confirmed = await window.zrcConfirm(
      'Mesaj listesini temizlemek istiyor musun? Bu işlem yalnızca senin hesabındaki mesaj görünümünü temizler; diğer kullanıcıların mesajları silinmez.'
    );

    if (!confirmed) return false;

    const existingClearedIds = Array.isArray(profilePreferences?.clearedMessageIds)
      ? profilePreferences.clearedMessageIds.map((id) => String(id))
      : [];

    // Son 500 temizleme kaydı tutulur. Yeni mesajların görünmesi engellenmez.
    const nextClearedMessageIds = Array.from(new Set([
      ...existingClearedIds,
      ...visibleMessageIds
    ])).slice(-500);

    const preferencesSaved = await saveUserPreferencesToSupabase({
      profilePreferences: {
        clearedMessageIds: nextClearedMessageIds
      }
    });

    if (!preferencesSaved) {
      await window.zrcAlert(
        'Mesajlar temizlenemedi. Sunucu kaydı tamamlanmadığı için liste değiştirilmedi.'
      );
      return false;
    }

    setProfilePreferences((previousPreferences) => ({
      ...(previousPreferences || {}),
      clearedMessageIds: nextClearedMessageIds
    }));

    setReadMessageIds((previousIds) => Array.from(new Set([
      ...(previousIds || []),
      ...visibleMessageIds
    ])));

    setIsMessagesOpen(false);
    setIsMessageTaskPickerOpen(false);
    return true;
  };

  const handleMessageClick = (message) => {
    if (!isProjectMessageVisibleForCurrentUser(message)) {
      showPermissionWarning('Bu mesajın bağlı olduğu projeye artık erişimin yok.');
      return;
    }

    markMessageAsRead(message.id).catch((error) => {
      console.warn('[ZRC] Mesaj okundu bilgisi kaydedilemedi.', error);
    });
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
    if (!tryAcquireActionLock(messageMutationLockRef, 'project-message')) return;

    try {
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
      const savedMessageId = await saveProjectMessageToSupabase(nextMessage);

      if (!savedMessageId) {
        setProjectMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
        setReadMessageIds((prevIds) => prevIds.filter((messageId) => messageId !== id));
        await window.zrcAlert('Mesaj gönderilemedi. Taslak korundu; lütfen tekrar deneyin.');
        return;
      }

      createActivityNotification({
        type: 'message',
        title: 'Yeni mesaj',
        text,
        meta: selectedMessageTask ? selectedMessageTask.title : 'Genel proje mesajı',
        task: selectedMessageTask,
        projectName: messageProjectName,
        columnTitle: selectedMessageTask?.columnTitle || '',
        messageId: savedMessageId,
        sortWeight: 760
      });

      setMessageDraft('');
      setIsMessageTaskPickerOpen(false);
    } finally {
      releaseActionLock(messageMutationLockRef, 'project-message');
    }
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
    if (!tryAcquireActionLock(messageMutationLockRef, 'create-chat-group')) return;

    try {
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
      const savedGroupId = await saveChatGroupToSupabase(nextGroup);

      if (!savedGroupId) {
        setChatGroups((prevGroups) => prevGroups.filter((group) => group.id !== nextGroup.id));
        await window.zrcAlert('Yazışma grubu oluşturulamadı. İsim taslağı korundu.');
        return;
      }

      setSelectedChatGroupId(nextGroup.id);
      setChatGroupDraft('');
      setIsChatGroupModalOpen(false);
      setIsChatActionMenuOpen(false);
    } finally {
      releaseActionLock(messageMutationLockRef, 'create-chat-group');
    }
  };

  const handleSendChatPageMessage = async (event) => {
    event.preventDefault();

    if (!currentPermissions.message) {
      showPermissionWarning('Bu rol mesaj gönderemez.');
      return;
    }

    const text = chatPageDraft.trim();

    if (!text || !selectedChatGroup) return;
    if (!tryAcquireActionLock(messageMutationLockRef, 'chat-page-message')) return;

    try {
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
      const savedMessageId = await saveProjectMessageToSupabase(nextMessage);

      if (!savedMessageId) {
        setProjectMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
        setReadMessageIds((prevIds) => prevIds.filter((messageId) => messageId !== id));
        await window.zrcAlert('Mesaj gönderilemedi. Taslak korundu; lütfen tekrar deneyin.');
        return;
      }

      createActivityNotification({
        type: 'message',
        title: 'Yazışmaya mesaj eklendi',
        text,
        meta: selectedChatGroup.name,
        projectName: messageProjectName,
        chatGroupId: selectedChatGroup.id,
        messageId: savedMessageId,
        sortWeight: 760
      });

      setChatPageDraft('');
    } finally {
      releaseActionLock(messageMutationLockRef, 'chat-page-message');
    }
  };

  return {
    markNotificationAsRead,
    markAllNotificationsAsRead,
    handleNotificationClick,
    markMessageAsRead,
    markAllMessagesAsRead,
    clearAllMessages,
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
