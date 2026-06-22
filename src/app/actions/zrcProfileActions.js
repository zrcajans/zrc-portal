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
    setEmailAccountDraft,
    profileMutationLockRef,
    tryAcquireActionLock,
    releaseActionLock
  } = deps;

  const saveProfileSection = async (overrides = {}) => {
    if (!tryAcquireActionLock(profileMutationLockRef, 'save-profile')) return false;

    try {
    const overrideProfileDraft = normalizeStorageObject(overrides?.profileDraft || {}, {});
    const overrideProfilePreferences = normalizeStorageObject(overrides?.profilePreferences || {}, {});

    const mergedProfileDraft = {
      ...profileDraft,
      ...overrideProfileDraft
    };

    const pendingAvatarDataUrl = String(mergedProfileDraft.pendingAvatarDataUrl || '').trim();
    const shouldShowProfileAvatarSavedToast = Boolean(pendingAvatarDataUrl);
    const nextProfileDraftBase = {
      ...mergedProfileDraft
    };

    // Bekleyen taslak alanı yalnızca kayıt anında gerçek avatarDataUrl'e çevrilir.
    // Kalıcı profil verisine pendingAvatarDataUrl olarak taşınmaz.
    delete nextProfileDraftBase.pendingAvatarDataUrl;

    // Seçilen görsel yalnızca Güncelle'ye basıldığında gerçek avatar olur.
    // Böylece dosya seçmek tek başına sidebar / ekip / Supabase profilini değiştirmez.
    const nextProfileDraft = {
      ...nextProfileDraftBase,
      avatarDataUrl: pendingAvatarDataUrl || nextProfileDraftBase.avatarDataUrl || ''
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

    const profileSaved = await saveProfileToSupabase(safeProfileDraftForState, nextPreferences);
    if (!profileSaved) return false;

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

    if (shouldShowProfileAvatarSavedToast) {
      zrcShowProfileAvatarSavedToast();
    }

    return true;
    } finally {
      releaseActionLock(profileMutationLockRef, 'save-profile');
    }
  };

  const persistProfilePreferences = async (nextPreferences) => {
    if (!tryAcquireActionLock(profileMutationLockRef, 'save-profile')) return false;

    try {
      const preferencesSaved = await saveUserPreferencesToSupabase({
        profilePreferences: nextPreferences
      });

      if (!preferencesSaved) {
        await window.zrcAlert('Profil tercihleri kaydedilemedi; yerel ayarlar değiştirilmedi.');
        return false;
      }

      setProfilePreferences(nextPreferences);
      return true;
    } finally {
      releaseActionLock(profileMutationLockRef, 'save-profile');
    }
  };

  const toggleProfilePreference = async (keyName) => {
    const nextPreferences = {
      ...profilePreferences,
      [keyName]: !profilePreferences[keyName],
      lastSavedAt: new Date().toISOString()
    };

    return persistProfilePreferences(nextPreferences);
  };

  const addProfileEmailAccount = async (event) => {
    event.preventDefault();

    const cleanEmail = emailAccountDraft.trim();

    if (!cleanEmail) return;

    if (!cleanEmail.includes('@')) {
      await window.zrcAlert('Geçerli bir e-posta adresi yaz.');
      return;
    }

    if ((profilePreferences.emailAccounts || []).some((account) => account.email.toLocaleLowerCase('tr-TR') === cleanEmail.toLocaleLowerCase('tr-TR'))) {
      await window.zrcAlert('Bu e-posta hesabı zaten ekli.');
      return;
    }

    const nextPreferences = {
      ...profilePreferences,
      emailAccounts: [
        ...(profilePreferences.emailAccounts || []),
        {
          id: `mailbox-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          email: cleanEmail,
          status: 'Bağlı'
        }
      ],
      lastSavedAt: new Date().toISOString()
    };

    const preferencesSaved = await persistProfilePreferences(nextPreferences);
    if (preferencesSaved) setEmailAccountDraft('');
    return preferencesSaved;
  };

  const removeProfileEmailAccount = async (accountId) => {
    const nextPreferences = {
      ...profilePreferences,
      emailAccounts: (profilePreferences.emailAccounts || []).filter((account) => account.id !== accountId),
      lastSavedAt: new Date().toISOString()
    };

    return persistProfilePreferences(nextPreferences);
  };

  const removeProfileSession = async (sessionId) => {
    const nextPreferences = {
      ...profilePreferences,
      sessions: (profilePreferences.sessions || []).filter((session) => session.id !== sessionId),
      lastSavedAt: new Date().toISOString()
    };

    return persistProfilePreferences(nextPreferences);
  };

  const markSuspiciousEventAsMine = async (eventId) => {
    const nextPreferences = {
      ...profilePreferences,
      suspiciousEvents: (profilePreferences.suspiciousEvents || []).filter((event) => event.id !== eventId),
      lastSavedAt: new Date().toISOString()
    };

    return persistProfilePreferences(nextPreferences);
  };

  const handleProfileAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      await window.zrcAlert('Lütfen bir görsel dosyası seç.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const pendingAvatarDataUrl = String(reader.result || '').trim();

      if (!pendingAvatarDataUrl) return;

      // Burada kesinlikle Supabase kaydı, ekip güncellemesi veya global avatar değişimi yok.
      // Görsel yalnızca taslağa alınır; kullanıcı Güncelle'ye basınca saveProfileSection
      // bunu gerçek avatarDataUrl alanına taşıyıp kaydeder.
      setProfileDraft((prev) => ({
        ...(prev || {}),
        pendingAvatarDataUrl
      }));
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

const zrcShowProfileAvatarSavedToast = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const toastId = 'zrc-profile-avatar-saved-toast';
  document.getElementById(toastId)?.remove();

  const toast = document.createElement('div');
  toast.id = toastId;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = 'Profil fotoğrafı güncellendi';

  Object.assign(toast.style, {
    position: 'fixed',
    top: '18px',
    left: '50%',
    zIndex: '2147483646',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    border: '1px solid rgba(255,255,255,0.9)',
    borderRadius: '999px',
    background: '#1f2937',
    color: '#ffffff',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '700',
    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.18)',
    pointerEvents: 'none',
    opacity: '0',
    transform: 'translate(-50%, -12px)',
    transition: 'opacity 180ms ease, transform 180ms ease'
  });

  const check = document.createElement('span');
  check.textContent = '✓';

  Object.assign(check.style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '999px',
    background: '#45bd78',
    color: '#ffffff',
    fontSize: '11px',
    lineHeight: '1'
  });

  toast.prepend(check);
  document.body.appendChild(toast);

  window.requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
  });

  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -12px)';

    window.setTimeout(() => toast.remove(), 220);
  }, 2400);
};
