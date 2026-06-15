import { useState, useRef } from 'react';
import {
  readStorageValue,
  getSavedNavigationState,
  normalizeStorageArray,
  normalizeStorageObject
} from '../ZRCAppTopLevel';
import {
  isLegacyDemoCustomerRecord,
  getDeletedCustomerMarkers,
  isCustomerMarkedDeleted
} from '../../utils/customerDeletionHelpers';
import {
  normalizeTeamRole,
  isLegacyDemoTeamMemberRecord,
  isZrcAjansIdentityRecord,
  normalizeTeamMember,
  normalizeCustomerRecord,
  getPermissionsForRole,
  createDefaultTeamMembers,
  createDefaultCustomers
} from '../../utils/teamHelpers';
import { createAvatarFromName } from '../../utils/avatarHelpers';
import {
  createDefaultProjectBoard,
  createDefaultProjectSettings
} from '../../utils/projectDefaults';

// v535: ZRCAppShell içinden ayrılan state katmanı.
// Amaç: Shell dosyasını küçültmek, hook sırasını bozmadan state sorumluluğunu ayırmak.

export function useZRCAppCoreState() {
  const [projects, setProjects] = useState(() => ['Çalışma']);

  const [teamMembers, setTeamMembers] = useState(() => {
    const parsedMembers = readStorageValue('teamMembers', null);
    const initialMembers = Array.isArray(parsedMembers) && parsedMembers.length > 0 ? parsedMembers : createDefaultTeamMembers();

    return initialMembers
      .map(normalizeTeamMember)
      .filter((member) => !isLegacyDemoTeamMemberRecord(member));
  });

  const [currentUserId, setCurrentUserId] = useState(() => readStorageValue('currentUserId', '') || '');
  const [supabaseAuthUserId, setSupabaseAuthUserId] = useState('');
  const [currentAssignedSupabaseTaskIds, setCurrentAssignedSupabaseTaskIds] = useState([]);
  const [loginDraft, setLoginDraft] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [authLoginLoading, setAuthLoginLoading] = useState(false);
  const [authSessionLoading, setAuthSessionLoading] = useState(true);
  const [supabaseWorkspaceId, setSupabaseWorkspaceId] = useState('');
  const [supabaseWriteStatus, setSupabaseWriteStatus] = useState({
    state: 'idle',
    label: 'Supabase yazma hazır'
  });
  const [supabaseHealthLoading, setSupabaseHealthLoading] = useState(false);
  const [supabaseBackupLoading, setSupabaseBackupLoading] = useState(false);
  const [supabaseRealtimeStatus, setSupabaseRealtimeStatus] = useState({
    state: 'idle',
    label: 'Realtime beklemede'
  });
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState(null);
  const [pwaInstallStatus, setPwaInstallStatus] = useState({
    state: 'idle',
    label: 'Mobil kurulum beklemede'
  });
  const [supabaseHealthReport, setSupabaseHealthReport] = useState([]);
  const [supabaseLastFullRefreshAt, setSupabaseLastFullRefreshAt] = useState('');
  const [supabaseLastBackupAt, setSupabaseLastBackupAt] = useState('');
  const [supabaseLastRealtimeAt, setSupabaseLastRealtimeAt] = useState('');
  const [teamMemberDraft, setTeamMemberDraft] = useState({ name: '', email: '', username: '', password: '', role: 'Ekip Üyesi', customerId: '' });
  const [pendingTeamDeleteId, setPendingTeamDeleteId] = useState(null);

  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState(null);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [teamMemberEditDraft, setTeamMemberEditDraft] = useState({ name: '', email: '', username: '', password: '', role: 'Ekip Üyesi', customerId: '' });

  const [customers, setCustomers] = useState(() => {
    const parsedCustomers = readStorageValue('customers', null);
    const deletedCustomerMarkers = getDeletedCustomerMarkers();
    const initialCustomers = Array.isArray(parsedCustomers) ? parsedCustomers : createDefaultCustomers();

    return initialCustomers
      .map(normalizeCustomerRecord)
      .filter((customer) => !isLegacyDemoCustomerRecord(customer))
      .filter((customer) => !isCustomerMarkedDeleted(customer, deletedCustomerMarkers));
  });
  const [customerDraft, setCustomerDraft] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    note: '',
    accountUserId: ''
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [pendingCustomerDeleteId, setPendingCustomerDeleteId] = useState(null);

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerEditDraft, setCustomerEditDraft] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    note: '',
    accountUserId: ''
  });

  const getInitialSelectedProject = () => {
    const savedProject = String(readStorageValue('selectedProject', '') || '').trim();
    const legacyProjectNames = ['Çalışma', 'Calisma', 'E-Ticaret Arayüz Tasarımı'];

    if (savedProject && !legacyProjectNames.includes(savedProject)) {
      return savedProject;
    }

    return '';
  };

  const [selectedProject, setSelectedProject] = useState(() => getInitialSelectedProject());

  const [activeTab, setActiveTab] = useState(() => getSavedNavigationState().activeTab);
  const [activeContentMenu, setActiveContentMenu] = useState(() => getSavedNavigationState().activeContentMenu);
  const [homeWorkView, setHomeWorkView] = useState('Görevli');
  const [quickNoteTitleDraft, setQuickNoteTitleDraft] = useState('');
  const [quickNoteDraft, setQuickNoteDraft] = useState('');
  const [editingQuickNoteId, setEditingQuickNoteId] = useState(null);
  const [quickNoteSearch, setQuickNoteSearch] = useState('');
  const [pendingDeleteQuickNoteId, setPendingDeleteQuickNoteId] = useState(null);
  const [isQuickNoteSearchOpen, setIsQuickNoteSearchOpen] = useState(false);
  const [isQuickNoteComposerOpen, setIsQuickNoteComposerOpen] = useState(false);
  const [quickNotes, setQuickNotes] = useState(() =>
    normalizeStorageArray(readStorageValue('quickNotes', []), [])
  );
  const [boardView, setBoardView] = useState('Tüm Görevler');
  const [mobileActiveColumnId, setMobileActiveColumnId] = useState('');
  const [zrcMobileColumnRefreshKey, setZrcMobileColumnRefreshKey] = useState(0);

  const [calendarMonthDate, setCalendarMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [calendarNewTaskDate, setCalendarNewTaskDate] = useState(null);
  const [calendarQuickTaskDraft, setCalendarQuickTaskDraft] = useState({
    isOpen: false,
    projectName: '',
    title: '',
    description: '',
    status: '',
    date: ''
  });

  const [calendarTaskModalContext, setCalendarTaskModalContext] = useState({
    isOpen: false,
    pendingOpen: false,
    projectName: '',
    date: ''
  });

  const [isCalendarDisplayMenuOpen, setIsCalendarDisplayMenuOpen] = useState(false);
  const [isMenuCalendarFilterOpen, setIsMenuCalendarFilterOpen] = useState(false);
  const [isMenuCalendarStatusOpen, setIsMenuCalendarStatusOpen] = useState(false);
  const [menuCalendarStatusFilter, setMenuCalendarStatusFilter] = useState('Tüm Durumlar');
  const [calendarView, setCalendarView] = useState('Ay');
  const [calendarFocusedDate, setCalendarFocusedDate] = useState(() => new Date());

  const timeChartScrollRef = useRef(null);
  const calendarTaskOpenLockRef = useRef(0);
  const [timeChartView, setTimeChartView] = useState('Gün');
  const [timeChartStartDate, setTimeChartStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);
  });
  const [timeChartSearch, setTimeChartSearch] = useState('');
  const [isTimeChartFilterOpen, setIsTimeChartFilterOpen] = useState(false);
  const [isTimeChartSettingsOpen, setIsTimeChartSettingsOpen] = useState(false);
  const [timeChartFilters, setTimeChartFilters] = useState({
    hideCompleted: false,
    hideArchived: true,
    hideNoDate: true
  });
  const [timeChartSettings, setTimeChartSettings] = useState({
    showWeekends: true,
    compactCards: false
  });

  const ganttScrollRef = useRef(null);
  const [ganttView, setGanttView] = useState('Gün');
  const [ganttStartDate, setGanttStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);
  });
  const [ganttSearch, setGanttSearch] = useState('');
  const [ganttShowCompleted, setGanttShowCompleted] = useState(true);

  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('Tümü');
  const [selectedProjectFileKey, setSelectedProjectFileKey] = useState(null);
  const [pendingFileDeleteKey, setPendingFileDeleteKey] = useState(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activityNotifications, setActivityNotifications] = useState(() =>
    normalizeStorageArray(readStorageValue('activityNotifications', []), [])
  );
  const [readNotificationIds, setReadNotificationIds] = useState(() =>
    normalizeStorageArray(readStorageValue('readNotifications', []), [])
  );

  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  const [isMobileProjectPickerOpen, setIsMobileProjectPickerOpen] = useState(false);
  const [isMobileTaskWizardOpen, setIsMobileTaskWizardOpen] = useState(false);
  const [mobileTaskWizardStep, setMobileTaskWizardStep] = useState(1);
  const [mobileTaskWizardData, setMobileTaskWizardData] = useState({
    projectName: '',
    taskTitle: '',
    startDate: '',
    endDate: '',
    assigneeIds: [],
    assignees: []
  });

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalSearchFilter, setGlobalSearchFilter] = useState('Tümü');

  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [projectMessages, setProjectMessages] = useState(() =>
    normalizeStorageArray(readStorageValue('projectMessages', []), [])
  );
  const [readMessageIds, setReadMessageIds] = useState(() =>
    normalizeStorageArray(readStorageValue('readMessages', []), [])
  );
  const [messageDraft, setMessageDraft] = useState('');
  const [messageLinkedTaskId, setMessageLinkedTaskId] = useState('');
  const [isMessageTaskPickerOpen, setIsMessageTaskPickerOpen] = useState(false);

  const [chatGroups, setChatGroups] = useState(() =>
    normalizeStorageArray(readStorageValue('chatGroups', []), []).filter(
      (group) => !['chat-afs', 'chat-deneme'].includes(group.id)
    )
  );
  const [selectedChatGroupId, setSelectedChatGroupId] = useState('');
  const [chatGroupDraft, setChatGroupDraft] = useState('');
  const [chatGroupSearch, setChatGroupSearch] = useState('');
  const [chatPageDraft, setChatPageDraft] = useState('');
  const [isChatGroupModalOpen, setIsChatGroupModalOpen] = useState(false);
  const [isChatActionMenuOpen, setIsChatActionMenuOpen] = useState(false);

  const [activeProfileTab, setActiveProfileTab] = useState('Hesap');
  const profileAvatarInputRef = useRef(null);
  const dataImportInputRef = useRef(null);
  const [openProfileDropdown, setOpenProfileDropdown] = useState(null);
  const [profileDraft, setProfileDraft] = useState(() => {
    const savedProfile = normalizeStorageObject(readStorageValue('profileDraft', null), null);
    const fallbackProfile = {
      firstName: 'ZRC AJANS',
      lastName: '',
      title: '',
      language: 'Türkçe',
      status: 'Hiçbiri',
      email: 'info@zrcajans.com',
      password: '',
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
      dateFormat: 'DD/MM/YYYY (30/05/2026)',
      timeFormat: '24-Saat Formatı (02:21)',
      timezone: 'UTC+03:00',
      theme: 'Açık Mod',
      color: 'Cubicl Mavisi',
      avatarDataUrl: ''
    };

    if (!savedProfile) return fallbackProfile;

    const savedName = `${savedProfile.firstName || ''} ${savedProfile.lastName || ''}`.trim();

    if (isLegacyDemoTeamMemberRecord({ name: savedName, email: savedProfile.email })) {
      return {
        ...fallbackProfile,
        avatarDataUrl: savedProfile.avatarDataUrl || ''
      };
    }

    return savedProfile;
  });

  const currentAuthUserIdForRole = String(supabaseAuthUserId || '').trim();
  const hasSupabaseAuthUserForRole =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentAuthUserIdForRole);

  const currentRoleMember =
    (hasSupabaseAuthUserForRole
      ? teamMembers.find((member) => String(member.id) === currentAuthUserIdForRole && member.status !== 'Pasif')
      : null) ||
    (currentUserId
      ? teamMembers.find((member) => String(member.id) === String(currentUserId) && member.status !== 'Pasif') || null
      : null);

  const currentProfileNameParts = [profileDraft.firstName, profileDraft.lastName]
    .map((part) => String(part || '').trim())
    .filter(Boolean);
  const rawCurrentProfileName = currentProfileNameParts.join(' ');
  const currentProfileName = isLegacyDemoTeamMemberRecord({ name: rawCurrentProfileName, email: profileDraft.email })
    ? 'ZRC AJANS'
    : rawCurrentProfileName || currentRoleMember?.name || 'ZRC AJANS';
  const currentProfileInitials = createAvatarFromName(currentProfileName);

  const currentProfileAvatar =
    profileDraft.avatarDataUrl ||
    (typeof currentRoleMember?.avatar === 'string' && currentRoleMember.avatar.startsWith('data:image')
      ? currentRoleMember.avatar
      : '') ||
    currentProfileInitials;

  const normalizedCurrentRawRole = normalizeTeamRole(currentRoleMember?.role || '');
  const isZrcOwnerAccount = Boolean(
    currentRoleMember &&
      isZrcAjansIdentityRecord(currentRoleMember) &&
      (
        !hasSupabaseAuthUserForRole ||
        String(currentRoleMember.id || '') === currentAuthUserIdForRole
      )
  );
  const currentUserRole =
    normalizedCurrentRawRole === 'Yönetici'
      ? 'Yönetici'
      : normalizedCurrentRawRole === 'Müşteri/Misafir'
        ? 'Müşteri/Misafir'
        : 'Ekip Üyesi';

  // ZRC içinde eski bazı kontroller "Patron" permission bucket'ını kullanıyor.
  // Bundan sonra bu bucket sadece ZRC AJANS'a özel değil; rolü Yönetici olan herkes için geçerli.
  const currentAccountType =
    currentUserRole === 'Yönetici'
      ? 'Patron'
      : currentUserRole === 'Müşteri/Misafir'
        ? 'Müşteri'
        : 'Ekip Üyesi';
  const isLoggedIn = Boolean(currentUserId && currentRoleMember);
  const currentPermissions = getPermissionsForRole(currentUserRole);
  const currentActorId = currentUserId || currentRoleMember?.id || 'anonymous-user';
  const currentActorName = currentProfileName;
  const currentActorAvatar = currentProfileAvatar;

  const [profilePreferences, setProfilePreferences] = useState(() => {
    const savedPreferences = normalizeStorageObject(readStorageValue('profilePreferences', null), null);

    if (savedPreferences) return savedPreferences;

    return {
      emailInstant: false,
      emailChat: true,
      emailActivity: true,
      emailLeave: false,
      emailReminder: true,
      emailImportant: false,
      browserEnabled: true,
      doNotDisturb: 'Kapalı',
      twoFactorEnabled: false,
      emailAccounts: [],
      lastSavedAt: '',
      lastDataExportAt: '',
      lastDataImportAt: '',
      sessions: [
        {
          id: 'session-current',
          device: 'Masaüstü',
          os: 'OS X',
          browser: 'Chrome',
          date: '29 Mayıs, 17:49',
          ip: '109.228.21.240',
          location: 'Gaziantep, TR'
        },
        {
          id: 'session-old',
          device: 'Masaüstü',
          os: 'OS X',
          browser: 'Chrome',
          date: '28 Mayıs, 17:57',
          ip: '109.228.21.240',
          location: 'Gaziantep, TR'
        }
      ],
      suspiciousEvents: [
        {
          id: 'event-1',
          device: 'Masaüstü',
          os: 'OS X',
          browser: 'Chrome',
          date: '29 Mayıs, 17:49',
          ip: '109.228.21.240',
          location: 'Gaziantep, TR',
          event: 'Şifre Girişi Hatalı'
        },
        {
          id: 'event-2',
          device: 'Masaüstü',
          os: 'OS X',
          browser: 'Chrome',
          date: '29 Mayıs, 17:49',
          ip: '109.228.21.240',
          location: 'Gaziantep, TR',
          event: 'Şifre Girişi Hatalı'
        }
      ]
    };
  });
  const [emailAccountDraft, setEmailAccountDraft] = useState('');
  const [pendingProfileDelete, setPendingProfileDelete] = useState(false);

  const [calendarDisplayOptions, setCalendarDisplayOptions] = useState({
    hideLongTasks: false,
    hideCompletedTasks: true,
    hideArchivedTasks: false
  });

  const [projectSettings, setProjectSettings] = useState(() =>
    normalizeStorageObject(readStorageValue('projectSettings', {}), {})
  );

  const [projectSettingsDraft, setProjectSettingsDraft] = useState(() => createDefaultProjectSettings(selectedProject));
  const [isProjectTeamPickerOpen, setIsProjectTeamPickerOpen] = useState(false);

  return {projects, setProjects, teamMembers, setTeamMembers, currentUserId, setCurrentUserId, supabaseAuthUserId, setSupabaseAuthUserId, currentAssignedSupabaseTaskIds, setCurrentAssignedSupabaseTaskIds, loginDraft, setLoginDraft, loginError, setLoginError, authLoginLoading, setAuthLoginLoading, authSessionLoading, setAuthSessionLoading, supabaseWorkspaceId, setSupabaseWorkspaceId, supabaseWriteStatus, setSupabaseWriteStatus, supabaseHealthLoading, setSupabaseHealthLoading, supabaseBackupLoading, setSupabaseBackupLoading, supabaseRealtimeStatus, setSupabaseRealtimeStatus, pwaInstallPrompt, setPwaInstallPrompt, pwaInstallStatus, setPwaInstallStatus, supabaseHealthReport, setSupabaseHealthReport, supabaseLastFullRefreshAt, setSupabaseLastFullRefreshAt, supabaseLastBackupAt, setSupabaseLastBackupAt, supabaseLastRealtimeAt, setSupabaseLastRealtimeAt, teamMemberDraft, setTeamMemberDraft, pendingTeamDeleteId, setPendingTeamDeleteId, selectedTeamMemberId, setSelectedTeamMemberId, editingTeamMember, setEditingTeamMember, teamMemberEditDraft, setTeamMemberEditDraft, customers, setCustomers, customerDraft, setCustomerDraft, selectedCustomerId, setSelectedCustomerId, pendingCustomerDeleteId, setPendingCustomerDeleteId, editingCustomer, setEditingCustomer, customerEditDraft, setCustomerEditDraft, selectedProject, setSelectedProject, activeTab, setActiveTab, activeContentMenu, setActiveContentMenu, homeWorkView, setHomeWorkView, quickNoteTitleDraft, setQuickNoteTitleDraft, quickNoteDraft, setQuickNoteDraft, editingQuickNoteId, setEditingQuickNoteId, quickNoteSearch, setQuickNoteSearch, pendingDeleteQuickNoteId, setPendingDeleteQuickNoteId, isQuickNoteSearchOpen, setIsQuickNoteSearchOpen, isQuickNoteComposerOpen, setIsQuickNoteComposerOpen, quickNotes, setQuickNotes, boardView, setBoardView, mobileActiveColumnId, setMobileActiveColumnId, zrcMobileColumnRefreshKey, setZrcMobileColumnRefreshKey, calendarMonthDate, setCalendarMonthDate, calendarNewTaskDate, setCalendarNewTaskDate, calendarQuickTaskDraft, setCalendarQuickTaskDraft, calendarTaskModalContext, setCalendarTaskModalContext, isCalendarDisplayMenuOpen, setIsCalendarDisplayMenuOpen, isMenuCalendarFilterOpen, setIsMenuCalendarFilterOpen, isMenuCalendarStatusOpen, setIsMenuCalendarStatusOpen, menuCalendarStatusFilter, setMenuCalendarStatusFilter, calendarView, setCalendarView, calendarFocusedDate, setCalendarFocusedDate, timeChartView, setTimeChartView, timeChartStartDate, setTimeChartStartDate, timeChartSearch, setTimeChartSearch, isTimeChartFilterOpen, setIsTimeChartFilterOpen, isTimeChartSettingsOpen, setIsTimeChartSettingsOpen, timeChartFilters, setTimeChartFilters, timeChartSettings, setTimeChartSettings, ganttView, setGanttView, ganttStartDate, setGanttStartDate, ganttSearch, setGanttSearch, ganttShowCompleted, setGanttShowCompleted, fileSearch, setFileSearch, fileTypeFilter, setFileTypeFilter, selectedProjectFileKey, setSelectedProjectFileKey, pendingFileDeleteKey, setPendingFileDeleteKey, isNotificationsOpen, setIsNotificationsOpen, activityNotifications, setActivityNotifications, readNotificationIds, setReadNotificationIds, isGlobalSearchOpen, setIsGlobalSearchOpen, isMobileProjectPickerOpen, setIsMobileProjectPickerOpen, isMobileTaskWizardOpen, setIsMobileTaskWizardOpen, mobileTaskWizardStep, setMobileTaskWizardStep, mobileTaskWizardData, setMobileTaskWizardData, globalSearchQuery, setGlobalSearchQuery, globalSearchFilter, setGlobalSearchFilter, isMessagesOpen, setIsMessagesOpen, projectMessages, setProjectMessages, readMessageIds, setReadMessageIds, messageDraft, setMessageDraft, messageLinkedTaskId, setMessageLinkedTaskId, isMessageTaskPickerOpen, setIsMessageTaskPickerOpen, chatGroups, setChatGroups, selectedChatGroupId, setSelectedChatGroupId, chatGroupDraft, setChatGroupDraft, chatGroupSearch, setChatGroupSearch, chatPageDraft, setChatPageDraft, isChatGroupModalOpen, setIsChatGroupModalOpen, isChatActionMenuOpen, setIsChatActionMenuOpen, activeProfileTab, setActiveProfileTab, openProfileDropdown, setOpenProfileDropdown, profileDraft, setProfileDraft, profilePreferences, setProfilePreferences, emailAccountDraft, setEmailAccountDraft, pendingProfileDelete, setPendingProfileDelete, calendarDisplayOptions, setCalendarDisplayOptions, projectSettings, setProjectSettings, projectSettingsDraft, setProjectSettingsDraft, isProjectTeamPickerOpen, setIsProjectTeamPickerOpen, getInitialSelectedProject, timeChartScrollRef, calendarTaskOpenLockRef, ganttScrollRef, profileAvatarInputRef, dataImportInputRef, currentAuthUserIdForRole, hasSupabaseAuthUserForRole, currentRoleMember, currentProfileNameParts, rawCurrentProfileName, currentProfileName, currentProfileInitials, currentProfileAvatar, normalizedCurrentRawRole, isZrcOwnerAccount, currentUserRole, currentAccountType, isLoggedIn, currentPermissions, currentActorId, currentActorName, currentActorAvatar};
}

export function useZRCBoardStateLayer({ selectedProject, setSelectedProject }) {
  // --- KANBAN PANO STATE'LERİ ---
  const [isEditMode, setIsEditMode] = useState(false);

  const [projectBoards, setProjectBoards] = useState(() => {
    const savedProjectBoards = normalizeStorageObject(readStorageValue('projectBoards', null), null);

    if (savedProjectBoards) {
      return savedProjectBoards;
    }

    // Eski tek-pano kayıtlarını yeni proje bazlı sisteme taşıma.
    const savedBoardColumns = readStorageValue('legacyBoardColumns', null);
    const savedArchivedTasks = readStorageValue('legacyArchivedTasks', null);

    if (savedBoardColumns || savedArchivedTasks) {
      return {
        [selectedProject || 'E-Ticaret Arayüz Tasarımı']: {
          columns: normalizeStorageArray(savedBoardColumns, createDefaultProjectBoard().columns),
          archivedTasks: normalizeStorageArray(savedArchivedTasks, [])
        }
      };
    }

    return {};
  });

  return {isEditMode, setIsEditMode, projectBoards, setProjectBoards};
}

export function useZRCTaskSelectionState() {
  const [openMenuColumnId, setOpenMenuColumnId] = useState(null);
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  return {openMenuColumnId, setOpenMenuColumnId, openTaskMenuId, setOpenTaskMenuId, selectedTasks, setSelectedTasks};
}

export function useZRCModalState() {
  // --- MODAL YÖNETİM STATE'LERİ ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [detailTaskInfo, setDetailTaskInfo] = useState(null);

  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);

  return {isTaskModalOpen, setIsTaskModalOpen, editingTask, setEditingTask, detailTaskInfo, setDetailTaskInfo, isStageModalOpen, setIsStageModalOpen, editingColumn, setEditingColumn};
}
