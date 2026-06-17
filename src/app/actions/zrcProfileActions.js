export function createZRCProfileActions(deps) {
  const {
    normalizeStorageObject,
    profileDraft,
    currentProfileName,
    createAvatarFromName,
    profilePreferences,
    normalizeCredentialText,
    currentUserId,
    currentUserRole,
    setProfileDraft,
    setTeamMembers,
    setProjectBoards,
    setActivityNotifications,
    setProjectMessages,
    setProfilePreferences,
    saveProfileToSupabase,
    saveUserPreferencesToSupabase,
    emailAccountDraft,
    setEmailAccountDraft
  } = deps;

  const saveProfileSection = async (overrides = {}) => {
    const overrideProfileDraft = normalizeStorageObject(overrides?.profileDraft || {}, {});
    const overrideProfilePreferences = normalizeStorageObject(overrides?.profilePreferences || {}, {});

    const nextProfileDraft = {
      ...profileDraft,
      ...overrideProfileDraft
    };

    const nextProfileNameParts = [nextProfileDraft.firstName, nextProfileDraft.lastName]
      .map((part) => String(part || '').trim())
      .filter(Boolean);

    const nextProfileName = nextProfileNameParts.join(' ') || currentProfileName || 'ZRC AJANS';
    const nextProfileAvatar = nextProfileDraft.avatarDataUrl || createAvatarFromName(nextProfileName);
    const nextProfileEmail = nextProfileDraft.email || profileDraft.email || '';

    const safeProfileDraftForState = {
      ...nextProfileDraft,
      currentPassword: '',
      newPassword: '',
      repeatPassword: ''
    };

    const nextPreferences = {
      ...profilePreferences,
      ...overrideProfilePreferences,
      lastSavedAt: new Date().toISOString()
    };

    const isCurrentProfileRecord = (record = {}) => {
      const recordId = String(record.id || record.userId || record.actorId || record.senderId || '').trim();
      const recordName = String(record.name || record.sender || record.actor || record.title || record.actorName || '').trim();
      const recordEmail = normalizeCredentialText(record.email || '');

      return (
        (recordId && String(currentUserId || '') && recordId === String(currentUserId || '')) ||
        (recordName && currentProfileName && recordName === currentProfileName) ||
        (recordEmail && normalizeCredentialText(profileDraft.email || '') && recordEmail === normalizeCredentialText(profileDraft.email || ''))
      );
    };

    const applyCurrentProfileToPerson = (person = {}) =>
      isCurrentProfileRecord(person)
        ? {
            ...person,
            id: person.id || currentUserId,
            userId: person.userId || currentUserId,
            name: nextProfileName,
            sender: person.sender ? nextProfileName : person.sender,
            actor: person.actor ? nextProfileName : person.actor,
            actorName: person.actorName ? nextProfileName : person.actorName,
            title: person.title && person.sender ? nextProfileName : person.title,
            email: nextProfileEmail || person.email,
            avatar: nextProfileAvatar,
            role: person.role || currentUserRole
          }
        : person;

    const applyCurrentProfileToTask = (task = {}) => ({
      ...task,
      assignees: Array.isArray(task.assignees) ? task.assignees.map(applyCurrentProfileToPerson) : task.assignees,
      followers: Array.isArray(task.followers) ? task.followers.map(applyCurrentProfileToPerson) : task.followers,
      comments: Array.isArray(task.comments)
        ? task.comments.map((comment) => applyCurrentProfileToPerson(comment))
        : task.comments,
      history: Array.isArray(task.history)
        ? task.history.map((entry) => applyCurrentProfileToPerson(entry))
        : task.history
    });

    setProfileDraft(safeProfileDraftForState);

    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        String(member.id || '') === String(currentUserId || '')
          ? {
              ...member,
              name: nextProfileName,
              email: nextProfileEmail || member.email,
              avatar: nextProfileAvatar
            }
          : member
      )
    );

    setProjectBoards((prevBoards) =>
      Object.fromEntries(
        Object.entries(prevBoards || {}).map(([projectName, board]) => [
          projectName,
          {
            ...board,
            columns: (board.columns || []).map((column) => ({
              ...column,
              tasks: (column.tasks || []).map(applyCurrentProfileToTask)
            })),
            archivedTasks: (board.archivedTasks || []).map(applyCurrentProfileToTask)
          }
        ])
      )
    );

    setActivityNotifications((prevNotifications) =>
      (prevNotifications || []).map((notification) =>
        isCurrentProfileRecord(notification)
          ? {
              ...notification,
              actor: nextProfileName,
              avatar: nextProfileAvatar,
              userId: notification.userId || currentUserId
            }
          : notification
      )
    );

    setProjectMessages((prevMessages) =>
      (prevMessages || []).map((message) =>
        isCurrentProfileRecord(message)
          ? {
              ...message,
              sender: nextProfileName,
              avatar: nextProfileAvatar,
              senderId: message.senderId || currentUserId
            }
          : message
      )
    );

    setProfilePreferences(nextPreferences);

    await saveProfileToSupabase(safeProfileDraftForState, nextPreferences);
  };

  const toggleProfilePreference = (keyName) => {
    setProfilePreferences((prev) => {
      const nextPreferences = {
        ...prev,
        [keyName]: !prev[keyName],
        lastSavedAt: new Date().toISOString()
      };

      saveUserPreferencesToSupabase({ profilePreferences: nextPreferences });
      return nextPreferences;
    });
  };

  const addProfileEmailAccount = async (event) => {
    event.preventDefault();

    const cleanEmail = emailAccountDraft.trim();

    if (!cleanEmail) return;

    if (!cleanEmail.includes('@')) {
      await window.zrcAlert('Geçerli bir e-posta adresi yaz.');
      return;
    }

    if (profilePreferences.emailAccounts.some((account) => account.email.toLocaleLowerCase('tr-TR') === cleanEmail.toLocaleLowerCase('tr-TR'))) {
      await window.zrcAlert('Bu e-posta hesabı zaten ekli.');
      return;
    }

    setProfilePreferences((prev) => {
      const nextPreferences = {
        ...prev,
        emailAccounts: [
          ...prev.emailAccounts,
          {
            id: `mailbox-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            email: cleanEmail,
            status: 'Bağlı'
          }
        ],
        lastSavedAt: new Date().toISOString()
      };

      saveUserPreferencesToSupabase({ profilePreferences: nextPreferences });
      return nextPreferences;
    });

    setEmailAccountDraft('');
  };

  const removeProfileEmailAccount = (accountId) => {
    setProfilePreferences((prev) => {
      const nextPreferences = {
        ...prev,
        emailAccounts: prev.emailAccounts.filter((account) => account.id !== accountId),
        lastSavedAt: new Date().toISOString()
      };

      saveUserPreferencesToSupabase({ profilePreferences: nextPreferences });
      return nextPreferences;
    });
  };

  const removeProfileSession = (sessionId) => {
    setProfilePreferences((prev) => {
      const nextPreferences = {
        ...prev,
        sessions: prev.sessions.filter((session) => session.id !== sessionId),
        lastSavedAt: new Date().toISOString()
      };

      saveUserPreferencesToSupabase({ profilePreferences: nextPreferences });
      return nextPreferences;
    });
  };

  const markSuspiciousEventAsMine = (eventId) => {
    setProfilePreferences((prev) => {
      const nextPreferences = {
        ...prev,
        suspiciousEvents: prev.suspiciousEvents.filter((event) => event.id !== eventId),
        lastSavedAt: new Date().toISOString()
      };

      saveUserPreferencesToSupabase({ profilePreferences: nextPreferences });
      return nextPreferences;
    });
  };

  const handleProfileAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      await window.zrcAlert('Lütfen bir görsel dosyası seç.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileDraft((prev) => ({
        ...prev,
        avatarDataUrl: reader.result
      }));

      if (currentUserId) {
        setTeamMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === currentUserId
              ? { ...member, avatar: reader.result }
              : member
          )
        );
      }

      const nextPreferences = {
        ...profilePreferences,
        lastSavedAt: new Date().toISOString()
      };

      setProfilePreferences(nextPreferences);
      saveProfileToSupabase(
        {
          ...profileDraft,
          avatarDataUrl: reader.result
        },
        nextPreferences
      );
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return {
    saveProfileSection,
    toggleProfilePreference,
    addProfileEmailAccount,
    removeProfileEmailAccount,
    removeProfileSession,
    markSuspiciousEventAsMine,
    handleProfileAvatarChange
  };
}
