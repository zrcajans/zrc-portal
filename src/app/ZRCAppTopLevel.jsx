import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Sidebar from '../components/Layout/Sidebar';
import MobileWorkspace from '../components/mobile/MobileWorkspace';
import MobileTaskMoveButtons from '../components/mobile/MobileTaskMoveButtons';
import ZRCErrorBoundary from '../components/common/ZRCErrorBoundary';
import { ProfileSelect, SoftSelect } from '../components/common/SelectControls';
import { resolveMobileTaskCardAssignees } from '../utils/mobileTaskAssignees';
import { createAvatarFromName, renderProfileAvatar } from '../utils/avatarHelpers';
import {
  getSupabaseSafeDate
} from '../utils/appSafeHelpers';
import {
  isLegacyDemoCustomerRecord,
  getDeletedCustomerMarkers,
  buildDeletedCustomerMarker,
  isCustomerMarkedDeleted,
  rememberDeletedCustomer
} from '../utils/customerDeletionHelpers';
import {
  teamRoleOptions,
  normalizeTeamRole,
  normalizeCredentialText,
  isLegacyDemoTeamMemberRecord,
  isZrcAjansIdentityRecord,
  createUsernameFromMember,
  normalizeTeamMember,
  normalizeCustomerRecord,
  getTeamRoleTone,
  getPermissionsForRole,
  getAccountTypeFromRole,
  getStartPanelForAccountType,
  createDefaultTeamMembers,
  createDefaultCustomers
} from '../utils/teamHelpers';
import {
  sanitizeClientPreferences,
  sanitizeProfileCredentials,
  sanitizeTeamMemberCredentials
} from '../utils/credentialSafetyHelpers';
import { getScopedStorageKey } from './utils/storageScopeHelpers.js';
import '../zrc-mobile.css';
import TopNavbar from '../components/Layout/TopNavbar';
import TaskModal from '../components/Modals/TaskModal';
import StageModal from '../components/Modals/StageModal';
import TaskDetailModal from '../components/Modals/TaskDetailModal';
import { supabase } from '../supabaseClient';
import { copyTextToClipboard } from '../utils/clipboardHelpers';
import {
  defaultBoardColumns,
  normalizeColumnTitleForDisplay,
  createDefaultProjectBoard,
  createDefaultProjectSettings,
  getZrcToastMessage,
  showZrcUpdateToast
} from '../utils/projectDefaults';
import { openCalendarQuickTaskCreatorHelper } from '../utils/calendarQuickTaskHelper';
import {
  parseTaskDateValue,
  formatCalendarDate,
  formatCalendarWeekday,
  getCalendarPriorityStyle,
  normalizeHexColor,
  mixHexWithWhite,
  isTaskCompletedForCalendar,
  isTaskLongForCalendar,
  doesTaskOverlapCalendarRange,
  getCalendarTaskStartDate,
  getCalendarTaskEndDate,
  formatDateForTaskModal,
  getReportTaskDate,
  getReportPercentage,
  getTimeChartDateKey,
  getStartOfWeekForTimeChart,
  getTaskPossibleDateValues,
  getFirstValidTaskDate,
  getTimeChartTaskDate,
  getTimeChartTaskStartDate,
  getTimeChartTaskEndDate,
  doesTimeChartTaskOverlapPeriod,
  getTimeChartTaskColor,
  getGanttTaskStartDate,
  getGanttTaskEndDate,
  getNotificationTaskDate,
  getNotificationDateLabel,
  getNotificationTone,
  normalizeSearchText,
  getGlobalSearchTypeStyle,
  parseQuickNoteContent,
  getQuickNoteTitle,
  getQuickNoteDetail,
  buildQuickNoteText
} from '../utils/dashboardHelpers';
import {
  formatProjectFileSize,
  getProjectFileIconStyle,
  buildProjectFileSecondaryText,
  buildProjectFileInfoRows
} from '../utils/projectFileHelpers';
import {
  hexToRgb,
  rgbToHsl,
  hslToCss,
  isLightColor,
  getReadableColumnColor,
  getReadableColumnMutedColor,
  getColumnEditToolsStyle
} from '../utils/colorHelpers';
import {
  zrcV426bNormalizeTaskDateFields,
  zrcV442SendTaskSavePush,
  zrcV448PlayDesktopNotificationSound
} from '../utils/browserEnhancements';

// ZRC top-level constants/helpers
// Bu dosya v519 ile ZRCAppShell.jsx içinden ayrıldı.

// zrc-v507-local-helper-fallbacks
export const zrcV426bApplyDueDateColors = (value, ...args) => {
  console.warn('[ZRC fallback] zrcV426bApplyDueDateColors helper ayrıma takıldı, no-op çalıştı.', { value, args });
  return value;
};

export const ZRC_APP_BUILD_LABEL = 'v519-mega-shell-and-top-level-split';









export const APP_DATA_VERSION = 113;

export const STORAGE_KEYS = {
  projects: 'zrc-projects',
  teamMembers: 'zrc-team-members',
  customers: 'zrc-customers',
  deletedCustomers: 'zrc-deleted-customers',
  selectedProject: 'zrc-selected-project',
  quickNotes: 'zrc-home-quick-notes',
  activityNotifications: 'zrc-activity-notifications',
  readNotifications: 'zrc-read-notifications',
  projectMessages: 'zrc-project-messages',
  readMessages: 'zrc-read-messages',
  chatGroups: 'zrc-chat-groups',
  profileDraft: 'zrc-profile-draft',
  profilePreferences: 'zrc-profile-preferences',
  projectSettings: 'zrc-project-settings',
  projectBoards: 'zrc-project-boards',
  legacyBoardColumns: 'zrc-board-columns',
  legacyArchivedTasks: 'zrc-archived-tasks',
  currentUserId: 'zrc-current-user-id',
  customerLinkMigrated: 'zrc-customer-link-migrated',
  dataVersion: 'zrc-data-version'
};

export const getStorageKey = (key) => {
  const baseKey = STORAGE_KEYS[key] || key;

  return baseKey === STORAGE_KEYS.dataVersion ? baseKey : getScopedStorageKey(baseKey);
};

export const readStorageValue = (key, fallbackValue) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallbackValue;
  }

  const storageKey = getStorageKey(key);

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return fallbackValue;
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      return typeof fallbackValue === 'string' ? rawValue : fallbackValue;
    }
  } catch (error) {
    console.warn(`[ZRC Storage] ${storageKey} okunamadı.`, error);
    return fallbackValue;
  }
};

export const writeStorageValue = (key, value) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  const storageKey = getStorageKey(key);

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[ZRC Storage] ${storageKey} kaydedilemedi.`, error);
    return false;
  }
};

export const removeStorageValue = (key) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  const storageKey = getStorageKey(key);

  try {
    window.localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.warn(`[ZRC Storage] ${storageKey} silinemedi.`, error);
    return false;
  }
};


export const NAVIGATION_STORAGE_KEYS = {
  activeMenu: 'zrcLastActiveMenu',
  activeContentMenu: 'zrcLastActiveContentMenu',
  activeTab: 'zrcLastActiveTab'
};

export const getSavedNavigationState = (fallback = {}) => {
  const savedActiveMenu = readStorageValue(NAVIGATION_STORAGE_KEYS.activeMenu, '');
  const savedActiveContentMenu = readStorageValue(NAVIGATION_STORAGE_KEYS.activeContentMenu, '');
  const savedActiveTab = readStorageValue(NAVIGATION_STORAGE_KEYS.activeTab, '');

  return {
    activeMenu: savedActiveMenu || fallback.activeMenu || fallback.menu || 'Ana Sayfa',
    activeContentMenu: savedActiveContentMenu || fallback.activeContentMenu || fallback.content || savedActiveMenu || 'Ana Sayfa',
    activeTab: savedActiveTab || fallback.activeTab || fallback.tab || 'Görevler'
  };
};

export const normalizeStorageArray = (value, fallbackValue = []) =>
  Array.isArray(value) ? value : fallbackValue;

export const normalizeStorageObject = (value, fallbackValue = {}) =>
  value && typeof value === 'object' && !Array.isArray(value) ? value : fallbackValue;

export const createDataSnapshot = ({
  projects,
  teamMembers,
  customers,
  selectedProject,
  projectSettings,
  projectBoards,
  quickNotes,
  activityNotifications,
  readNotificationIds,
  projectMessages,
  readMessageIds,
  chatGroups,
  profileDraft,
  profilePreferences
}) => ({
  app: 'zrc-is-takip',
  version: APP_DATA_VERSION,
  exportedAt: new Date().toISOString(),
  data: {
    projects,
    teamMembers: (Array.isArray(teamMembers) ? teamMembers : []).map(sanitizeTeamMemberCredentials),
    customers,
    selectedProject,
    projectSettings,
    projectBoards,
    quickNotes,
    activityNotifications,
    readNotificationIds,
    projectMessages,
    readMessageIds,
    chatGroups,
    profileDraft: sanitizeProfileCredentials(profileDraft),
    profilePreferences: sanitizeClientPreferences(profilePreferences)
  }
});








if (typeof document !== 'undefined' && !document.getElementById('zrc-v423-popup-force-hide')) {
  const style = document.createElement('style');
  style.id = 'zrc-v423-popup-force-hide';
  style.textContent = '#zrc-global-update-toast{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
  document.head.appendChild(style);
}
