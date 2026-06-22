export function createZRCTeamCustomerActions(deps) {
  const {
    requirePermission,
    normalizeTeamRole,
    teamMemberDraft,
    getCustomerById,
    normalizeCredentialText,
    customers,
    teamMembers,
    getCurrentSupabaseWorkspaceId,
    zrcSetSupabaseWriteInfo,
    supabase,
    isSupabaseUuid,
    normalizeTeamMember,
    setTeamMembers,
    setCustomers,
    setTeamMemberDraft,
    setSelectedTeamMemberId,
    setPendingTeamDeleteId,
    isLastActiveAdmin,
    showPermissionWarning,
    currentUserId,
    setCurrentUserId,
    removeStorageValue,
    pendingTeamDeleteId,
    selectedTeamMemberId,
    setEditingTeamMember,
    setTeamMemberEditDraft,
    createUsernameFromMember,
    getMemberLinkedCustomer,
    editingTeamMember,
    teamMemberEditDraft,
    createAvatarFromName,
    setBoardColumns,
    setArchivedTasks,
    customerDraft,
    setSelectedCustomerId,
    setPendingCustomerDeleteId,
    saveCustomerToSupabase,
    setCustomerDraft,
    updateCustomerStatusInSupabase,
    setEditingCustomer,
    setCustomerEditDraft,
    getCustomerLinkedAccount,
    editingCustomer,
    customerEditDraft,
    setProjectSettings,
    pendingCustomerDeleteId,
    rememberDeletedCustomer,
    deleteCustomerFromSupabase,
    selectedCustomerId,
    teamCustomerMutationLockRef,
    tryAcquireActionLock,
    releaseActionLock
  } = deps;




  // zrc-service-role-workspace-member-delete-v1
  const deleteWorkspaceMemberFromDatabase = async (member = {}) => {
    const workspaceId = typeof getCurrentSupabaseWorkspaceId === 'function'
      ? getCurrentSupabaseWorkspaceId()
      : '';

    if (!workspaceId) {
      throw new Error('workspaceId bulunamadı');
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token || '';

    if (!accessToken) {
      throw new Error('Yönetici oturumu bulunamadı. Çıkış yapıp tekrar giriş yap.');
    }

    const response = await fetch('/api/delete-workspace-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        workspaceId,
        member,
        userId: member.userId || member.user_id || member.authUserId || member.auth_user_id || member.supabaseUserId || member.supabase_user_id || member.profileId || member.profile_id || member.id || '',
        username: member.username || member.email || member.name || '',
        customerId: member.customerId || member.customer_id || ''
      })
    });

    const result = await response.json().catch(() => ({}));

    if (response.status === 404) {
      return { ok: true, alreadyDeleted: true };
    }

    if (!response.ok || !result.ok) {
      throw new Error(result?.error || 'Veritabanı silme işlemi başarısız oldu');
    }

    if (typeof zrcSetSupabaseWriteInfo === 'function') {
      zrcSetSupabaseWriteInfo('saved', 'Ekip üyesi veritabanından silindi.');
    }

    return result;
  };

  const createTeamMemberFromCenter = async (event) => {
    event.preventDefault();

    if (!requirePermission('manageTeam', 'Ekip yönetimi sadece Yönetici rolünde var.')) return;

    const role = normalizeTeamRole(teamMemberDraft.role);
    const customerId = role === 'Müşteri/Misafir' ? teamMemberDraft.customerId : '';
    const linkedCustomer = customerId ? getCustomerById(customerId) : null;
    const name =
      role === 'Müşteri/Misafir'
        ? (linkedCustomer?.name || '').trim()
        : teamMemberDraft.name.trim();
    const username = normalizeCredentialText(teamMemberDraft.username || name);
    const password = String(teamMemberDraft.password || '').trim();

    if (role === 'Müşteri/Misafir' && !customerId) {
      await window.zrcAlert('Müşteri/Misafir hesabı için bağlı müşteri seçmelisin.');
      return;
    }

    if (!name) {
      await window.zrcAlert(role === 'Müşteri/Misafir' ? 'Bağlı müşteri kaydı bulunamadı.' : 'Ad Soyad boş olamaz.');
      return;
    }

    if (!username) {
      await window.zrcAlert('Kullanıcı adı boş olamaz.');
      return;
    }

    if (password.length < 8) {
      await window.zrcAlert('Şifre en az 8 karakter olmalı.');
      return;
    }

    const isCustomerAlreadyLinked = customerId
      ? customers.some((customer) => customer.id === customerId && customer.accountUserId) ||
        teamMembers.some((member) => member.customerId === customerId)
      : false;

    if (isCustomerAlreadyLinked) {
      await window.zrcAlert('Bu müşteri zaten başka bir giriş hesabına bağlı.');
      return;
    }

    const hasDuplicateUsername = teamMembers.some(
      (member) => normalizeCredentialText(member.username) === username
    );

    if (hasDuplicateUsername) {
      await window.zrcAlert('Bu kullanıcı adı zaten kullanılıyor.');
      return;
    }

    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId) {
      await window.zrcAlert('Workspace bilgisi alınamadı. Önce ZRC AJANS hesabıyla yeniden giriş yap.');
      return;
    }

    if (!tryAcquireActionLock(teamCustomerMutationLockRef, 'team-customer-mutation')) return false;

    try {
      zrcSetSupabaseWriteInfo('saving', 'Merkezi ekip hesabı oluşturuluyor');

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || '';

      if (!accessToken) {
        await window.zrcAlert('Yönetici oturumu bulunamadı. Çıkış yapıp ZRC AJANS hesabıyla tekrar giriş yap.');
        zrcSetSupabaseWriteInfo('error', 'Yönetici oturumu bulunamadı');
        return false;
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
          username,
          password,
          role,
          customerId: isSupabaseUuid(customerId) ? customerId : ''
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.error || 'Merkezi ekip hesabı oluşturulamadı.');
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

      if (customerId) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.id === customerId ? { ...customer, accountUserId: nextMember.id } : customer
          )
        );
      }

      setTeamMemberDraft({ name: '', email: '', username: '', password: '', role: 'Ekip Üyesi', customerId: '' });
      setSelectedTeamMemberId(nextMember.id);
      setPendingTeamDeleteId(null);
      zrcSetSupabaseWriteInfo('saved', 'Merkezi ekip hesabı oluşturuldu');
      return true;
    } catch (error) {
      const errorMessage = error?.message || 'Merkezi ekip hesabı oluşturulamadı.';
      await window.zrcAlert(errorMessage);
      zrcSetSupabaseWriteInfo('error', errorMessage);
      return false;
    } finally {
      releaseActionLock(teamCustomerMutationLockRef, 'team-customer-mutation');
    }
  };

  const toggleTeamMemberStatus = async (memberId) => {
    if (!requirePermission('manageTeam', 'Ekip durumunu sadece Yönetici değiştirebilir.')) return;

    const targetMember = teamMembers.find((member) => member.id === memberId);
    if (!targetMember) return;

    if (targetMember?.status !== 'Pasif' && isLastActiveAdmin(targetMember)) {
      showPermissionWarning('Son aktif yöneticiyi pasif yapamazsın.');
      return;
    }

    const nextStatus = targetMember.status === 'Pasif' ? 'Aktif' : 'Pasif';
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (isSupabaseUuid(targetMember.id) && isSupabaseUuid(workspaceId)) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token || '';

        if (!accessToken) {
          throw new Error('Yönetici oturumu bulunamadı. Çıkış yapıp tekrar giriş yap.');
        }

        const response = await fetch('/api/update-team-member', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            workspaceId,
            userId: targetMember.id,
            name: targetMember.name,
            username: targetMember.username || createUsernameFromMember(targetMember),
            role: normalizeTeamRole(targetMember.role),
            status: nextStatus,
            customerId: targetMember.customerId || ''
          })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result?.error) {
          throw new Error(result?.error || 'Ekip üyesi durumu güncellenemedi.');
        }
      } catch (error) {
        const message = error?.message || 'Ekip üyesi durumu güncellenemedi.';
        zrcSetSupabaseWriteInfo('error', message);
        await window.zrcAlert(message);
        return;
      }
    }

    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId
          ? {
              ...member,
              status: nextStatus
            }
          : member
      )
    );

    if (currentUserId === memberId && nextStatus === 'Pasif') {
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch (error) {
        console.warn('[ZRC Auth] Pasifleştirilen kullanıcı oturumu kapatılamadı.', error);
      }

      setCurrentUserId('');
      removeStorageValue('currentUserId');
      window.location.reload();
      return;
    }

    zrcSetSupabaseWriteInfo('saved', 'Ekip üyesi durumu kaydedildi');
    setPendingTeamDeleteId(null);
  };

  const deleteTeamMemberFromCenter = async (memberId) => {
    if (!requirePermission('manageTeam', 'Ekip üyesi silme yetkisi sadece Yönetici rolünde var.')) return;

    const targetMember = teamMembers.find((member) => member.id === memberId);
    if (isLastActiveAdmin(targetMember)) {
      showPermissionWarning('Son aktif yöneticiyi silemezsin.');
      return;
    }

    if (pendingTeamDeleteId !== memberId) {
      setPendingTeamDeleteId(memberId);
      return;
    }

    if (!tryAcquireActionLock(teamCustomerMutationLockRef, 'team-customer-mutation')) return false;

    try {
      if (targetMember) {
        try {
          await deleteWorkspaceMemberFromDatabase(targetMember);
        } catch (error) {
          await window.zrcAlert(`Ekip üyesi veritabanından silinemedi: ${error?.message || 'bilinmeyen hata'}`);
          return false;
        }
      }

      setTeamMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId));

      if (targetMember) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.accountUserId === memberId || customer.id === targetMember.customerId
              ? { ...customer, accountUserId: '' }
              : customer
          )
        );
      }

      if (currentUserId === memberId) {
        setCurrentUserId('');
        removeStorageValue('currentUserId');
      }

      if (selectedTeamMemberId === memberId) {
        setSelectedTeamMemberId(null);
      }

      setPendingTeamDeleteId(null);
      return true;
    } finally {
      releaseActionLock(teamCustomerMutationLockRef, 'team-customer-mutation');
    }
  };

  const openTeamMemberEditModal = (member) => {
    if (!member) return;
    if (!requirePermission('manageTeam', 'Ekip üyelerini sadece Yönetici düzenleyebilir.')) return;

    setEditingTeamMember(member);
    setTeamMemberEditDraft({
      name: member.name || '',
      email: member.email || '',
      username: member.username || createUsernameFromMember(member),
      password: member.password || '',
      role: normalizeTeamRole(member.role),
      customerId: member.customerId || getMemberLinkedCustomer(member)?.id || ''
    });
    setPendingTeamDeleteId(null);
  };

  const closeTeamMemberEditModal = () => {
    setEditingTeamMember(null);
    setTeamMemberEditDraft({ name: '', email: '', username: '', password: '', role: 'Ekip Üyesi', customerId: '' });
  };

  const updateTaskUserList = (users = [], oldMember, nextMember) =>
    users.map((user) =>
      user.id === oldMember.id || user.name === oldMember.name
        ? {
            ...user,
            id: nextMember.id,
            name: nextMember.name,
            avatar: nextMember.avatar,
            role: nextMember.role
          }
        : user
    );

  const saveTeamMemberEdit = async (event) => {
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

    if (role === 'Müşteri/Misafir' && !customerId) {
      await window.zrcAlert('Müşteri/Misafir hesabı için bağlı müşteri seçmelisin.');
      return;
    }

    if (!name) {
      await window.zrcAlert(role === 'Müşteri/Misafir' ? 'Bağlı müşteri kaydı bulunamadı.' : 'Kişi adı boş olamaz.');
      return;
    }

    if (!username) {
      await window.zrcAlert('Kullanıcı adı boş olamaz.');
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
      await window.zrcAlert('Bu müşteri zaten başka bir giriş hesabına bağlı.');
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
      await window.zrcAlert('Bu isimde başka bir ekip üyesi zaten var.');
      return;
    }

    const hasDuplicateUsername = teamMembers.some(
      (member) =>
        member.id !== editingTeamMember.id &&
        normalizeCredentialText(member.username) === username
    );

    if (hasDuplicateUsername) {
      await window.zrcAlert('Bu kullanıcı adı zaten kullanılıyor.');
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
      password: '',
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

        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token || '';

        if (!accessToken) {
          throw new Error('Yönetici oturumu bulunamadı. Çıkış yapıp tekrar giriş yap.');
        }

        const response = await fetch('/api/update-team-member', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
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
        await window.zrcAlert(message);
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
  };

  const createCustomerFromCenter = async (event) => {
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
      await window.zrcAlert('Müşteri adı boş olamaz.');
      return;
    }

    if (customers.some((customer) => customer.name.toLocaleLowerCase('tr-TR') === name.toLocaleLowerCase('tr-TR'))) {
      await window.zrcAlert('Bu isimde bir müşteri zaten var.');
      return;
    }

    if (wantsLoginAccount && !accountUsername) {
      await window.zrcAlert('Müşteri giriş hesabı için kullanıcı adı yazmalısın.');
      return;
    }

    if (wantsLoginAccount && accountPassword.length < 8) {
      await window.zrcAlert('Müşteri giriş şifresi en az 8 karakter olmalı.');
      return;
    }

    if (
      wantsLoginAccount &&
      teamMembers.some((member) => normalizeCredentialText(member.username) === accountUsername)
    ) {
      await window.zrcAlert('Bu kullanıcı adı zaten kullanılıyor.');
      return;
    }

    if (!tryAcquireActionLock(teamCustomerMutationLockRef, 'team-customer-mutation')) return false;

    try {
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

      const savedCustomer = await saveCustomerToSupabase(nextCustomer);

      if (!savedCustomer) {
        await window.zrcAlert('Müşteri kaydedilemedi. Form bilgileri korundu; lütfen tekrar deneyin.');
        return false;
      }

      const savedCustomerId = savedCustomer?.id || nextCustomer.id;
      const persistedCustomer = {
        ...nextCustomer,
        id: savedCustomerId,
        supabaseId: savedCustomerId
      };

      setCustomers((prevCustomers) => [
        persistedCustomer,
        ...prevCustomers.filter((customer) => customer.id !== savedCustomerId)
      ]);
      setSelectedCustomerId(savedCustomerId);
      setPendingCustomerDeleteId(null);

    if (wantsLoginAccount) {
      const workspaceId = getCurrentSupabaseWorkspaceId();

      if (!workspaceId) {
        await window.zrcAlert('Müşteri oluşturuldu ama giriş hesabı için workspace bilgisi alınamadı. Çıkış yapıp tekrar giriş yap.');
        return;
      }

      try {
        zrcSetSupabaseWriteInfo('saving', 'Müşteri giriş hesabı oluşturuluyor');

        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token || '';

        if (!accessToken) {
          await window.zrcAlert('Müşteri oluşturuldu ama yönetici oturumu bulunamadığı için giriş hesabı açılamadı.');
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

        const customerLinkSaved = await saveCustomerToSupabase({
          ...nextCustomer,
          id: savedCustomerId,
          accountUserId: nextMember.id
        });

        if (!customerLinkSaved) {
          await window.zrcAlert('Giriş hesabı oluşturuldu ancak müşteri bağlantısı kaydedilemedi. Liste sunucudan yenilenmelidir.');
          return false;
        }

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

        setSelectedTeamMemberId(nextMember.id);
        zrcSetSupabaseWriteInfo('saved', 'Müşteri ve giriş hesabı oluşturuldu');
      } catch (error) {
        const errorMessage = error?.message || 'Müşteri giriş hesabı oluşturulamadı.';
        await window.zrcAlert(`Müşteri oluşturuldu ama giriş hesabı açılamadı: ${errorMessage}`);
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
      return true;
    } finally {
      releaseActionLock(teamCustomerMutationLockRef, 'team-customer-mutation');
    }
  };

  const toggleCustomerStatus = async (customerId) => {
    if (!requirePermission('manageCustomers', 'Müşteri durumunu sadece Yönetici değiştirebilir.')) return;

    const targetCustomer = customers.find((customer) => customer.id === customerId);
    const nextStatus = targetCustomer?.status === 'Pasif' ? 'Aktif' : 'Pasif';

    if (targetCustomer) {
      const hasPersistedCustomerId = isSupabaseUuid(targetCustomer.supabaseId || targetCustomer.id);
      const didUpdateStatus = hasPersistedCustomerId
        ? await updateCustomerStatusInSupabase(targetCustomer, nextStatus)
        : true;

      if (!didUpdateStatus) {
        await window.zrcAlert('Müşteri durumu veritabanına kaydedilemedi. Ekranda değişiklik yapılmadı.');
        return;
      }
    }

    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              status: customer.status === 'Pasif' ? 'Aktif' : 'Pasif'
            }
          : customer
      )
    );

    setPendingCustomerDeleteId(null);
  };

  const openCustomerEditModal = (customer) => {
    if (!customer || customer.source === 'task') return;
    if (!requirePermission('manageCustomers', 'Müşterileri sadece Yönetici düzenleyebilir.')) return;

    setEditingCustomer(customer);
    setCustomerEditDraft({
      name: customer.name || '',
      contact: customer.contact || '',
      email: customer.email || '',
      phone: customer.phone || '',
      note: customer.note || '',
      accountUserId: customer.accountUserId || getCustomerLinkedAccount(customer)?.id || ''
    });
    setPendingCustomerDeleteId(null);
  };

  const closeCustomerEditModal = () => {
    setEditingCustomer(null);
    setCustomerEditDraft({
      name: '',
      contact: '',
      email: '',
      phone: '',
      note: '',
      accountUserId: ''
    });
  };

  const saveCustomerEdit = async (event) => {
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
      await window.zrcAlert('Müşteri adı boş olamaz.');
      return;
    }

    const hasDuplicate = customers.some(
      (customer) =>
        customer.id !== editingCustomer.id &&
        customer.name.toLocaleLowerCase('tr-TR') === name.toLocaleLowerCase('tr-TR')
    );

    if (hasDuplicate) {
      await window.zrcAlert('Bu isimde başka bir müşteri zaten var.');
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
      await window.zrcAlert('Bu müşteri hesabı zaten başka bir müşteri kartına bağlı.');
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
      await window.zrcAlert('Müşteri bilgileri veritabanına kaydedilemedi. Lütfen tekrar dene.');
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
  };

  const deleteCustomerFromCenter = async (customerId) => {
    if (!requirePermission('manageCustomers', 'Müşteri silme yetkisi sadece Yönetici rolünde var.')) return;

    if (pendingCustomerDeleteId !== customerId) {
      setPendingCustomerDeleteId(customerId);
      return;
    }

    const deletedCustomer = customers.find((customer) => customer.id === customerId);

    if (!deletedCustomer) return;

    if (!tryAcquireActionLock(teamCustomerMutationLockRef, 'team-customer-mutation')) return false;

    try {
      const linkedCustomerAccountIds = new Set(
        teamMembers
          .filter((member) =>
            member.customerId === customerId &&
            normalizeTeamRole(member.role) === 'Müşteri/Misafir'
          )
          .map((member) => member.id)
          .filter(Boolean)
      );

      if (deletedCustomer?.accountUserId) {
        linkedCustomerAccountIds.add(deletedCustomer.accountUserId);
      }

      if (linkedCustomerAccountIds.size > 0) {
        const linkedCustomerMembers = teamMembers.filter((member) => linkedCustomerAccountIds.has(member.id));

        for (const accountId of linkedCustomerAccountIds) {
          if (!linkedCustomerMembers.some((member) => member.id === accountId)) {
            linkedCustomerMembers.push({
              id: accountId,
              userId: accountId,
              username: deletedCustomer?.username || deletedCustomer?.email || ''
            });
          }
        }

        try {
          for (const member of linkedCustomerMembers) {
            await deleteWorkspaceMemberFromDatabase(member);
          }
        } catch (error) {
          await window.zrcAlert(`Bağlı müşteri hesabı veritabanından silinemedi: ${error?.message || 'bilinmeyen hata'}`);
          return false;
        }
      }

      try {
        const hasPersistedCustomerId = isSupabaseUuid(deletedCustomer.supabaseId || deletedCustomer.id);

        if (hasPersistedCustomerId && typeof deleteCustomerFromSupabase === 'function') {
          const didDeleteCustomer = await deleteCustomerFromSupabase(deletedCustomer);

          if (!didDeleteCustomer) {
            await window.zrcAlert('Müşteri veritabanından silinemedi. Ekranda değişiklik yapılmadı.');
            window.location.reload();
            return false;
          }
        }
      } catch (error) {
        await window.zrcAlert(`Müşteri veritabanından silinemedi: ${error?.message || 'bilinmeyen hata'}`);
        window.location.reload();
        return false;
      }

      rememberDeletedCustomer(deletedCustomer);

      setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== customerId));

      setTeamMembers((prevMembers) =>
        prevMembers
          .filter((member) => !linkedCustomerAccountIds.has(member.id))
          .map((member) =>
            member.customerId === customerId
              ? { ...member, customerId: '' }
              : member
          )
      );

      setProjectSettings((prevSettings) =>
        Object.fromEntries(
          Object.entries(prevSettings).map(([projectName, settings]) => [
            projectName,
            settings.customerId === customerId || settings.customer === deletedCustomer?.name
              ? { ...settings, customer: '', customerId: '' }
              : settings
          ])
        )
      );

      if (selectedCustomerId === customerId) {
        setSelectedCustomerId(null);
      }

      setPendingCustomerDeleteId(null);
      return true;
    } finally {
      releaseActionLock(teamCustomerMutationLockRef, 'team-customer-mutation');
    }
  };

  return {
    createTeamMemberFromCenter,
    toggleTeamMemberStatus,
    deleteTeamMemberFromCenter,
    openTeamMemberEditModal,
    closeTeamMemberEditModal,
    saveTeamMemberEdit,
    createCustomerFromCenter,
    toggleCustomerStatus,
    openCustomerEditModal,
    closeCustomerEditModal,
    saveCustomerEdit,
    deleteCustomerFromCenter
  };
}
