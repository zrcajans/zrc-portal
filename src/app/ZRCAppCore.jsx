import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import MobileTaskMoveButtons from '../components/mobile/MobileTaskMoveButtons';
import ZRCErrorBoundary from '../components/common/ZRCErrorBoundary';
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
import '../zrc-mobile.css';
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
import {
  zrcV426bApplyDueDateColors,
  ZRC_APP_BUILD_LABEL,
  APP_DATA_VERSION,
  STORAGE_KEYS,
  getStorageKey,
  readStorageValue,
  writeStorageValue,
  removeStorageValue,
  NAVIGATION_STORAGE_KEYS,
  getSavedNavigationState,
  normalizeStorageArray,
  normalizeStorageObject,
  createDataSnapshot
} from './ZRCAppTopLevel';

import { useZRCAppCoreState, useZRCBoardStateLayer, useZRCTaskSelectionState, useZRCModalState } from './state/useZRCAppStateLayer';
import ZRCAppLoginScreen from './sections/ZRCAppLoginScreen';
import ZRCAppAuthenticatedShell from './sections/ZRCAppAuthenticatedShell';
import { renderZRCProfileSelect, renderZRCSoftSelect } from './blocks/ZRCAppSelectRenderers';
import { createZRCTeamCustomerActions } from './actions/zrcTeamCustomerActions';
import { createZRCBoardTaskActions } from './actions/zrcBoardTaskActions';
import { createZRCDataManagementActions } from './actions/zrcDataManagementActions';
import { createZRCProfileActions } from './actions/zrcProfileActions';
import { createZRCMessageNotificationActions } from './actions/zrcMessageNotificationActions';
import { createZRCProjectSettingsActions } from './actions/zrcProjectSettingsActions';
import { createZRCCalendarActions } from './actions/zrcCalendarActions';
import { createZRCHomeActions } from './actions/zrcHomeActions';
import { installZRCPremiumDialogRuntime } from './utils/zrcPremiumDialogRuntime';

import {
  formatDateStringShort,
  getTaskCardDateParts,
  isSupabaseUuid,
  getSafeSupabasePriority,
  getPlainTaskDescription,
  formatSupabaseDateTimeParts,
  mapSupabaseStepToLocalStep,
  getSupabaseFileTypeLabel,
  sanitizeStorageFileName,
  mapSupabaseCustomerToLocal,
  mapSupabaseWorkspaceMemberToLocal,
  normalizeProjectNameList,
  mergeUniqueByKey,
  sanitizeProfileDraftForSafeApi,
  sanitizeProfilePreferencesForSafeApi,
  mapSupabaseQuickNoteToLocal,
  createSupabaseHealthRow,
  getSupabaseHealthStateClass,
  formatSupabaseDateForLocalTask,
  getIdentityValuesFromRecord,
  getActivityDateLabel,
  isReportTaskCompleted,
  getReportPriorityStyle
} from './utils/zrcCorePureHelpers';
function App() {
  // zrc-premium-dialog-install-v1
  useEffect(() => {
    installZRCPremiumDialogRuntime();
  }, []);


  const zrcSetSupabaseWriteInfo = (status, message) => {
    setSupabaseWriteInfo(status, message);
  };

  // --- TEMEL STATE'LER ---
  // zrc-safe-shortcuts-v319
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const toastId = 'zrc-v319-mini-toast';

    const showToast = (message) => {
      const oldToast = document.getElementById(toastId);
      if (oldToast) oldToast.remove();

      const toast = document.createElement('div');
      toast.id = toastId;
      toast.textContent = message;
      toast.style.cssText = [
        'position:fixed',
        'left:50%',
        'bottom:calc(max(12px, env(safe-area-inset-bottom)) + 76px)',
        'transform:translateX(-50%)',
        'z-index:999999',
        'max-width:calc(100vw - 28px)',
        'border-radius:999px',
        'background:#111827',
        'color:#ffffff',
        'box-shadow:0 18px 50px rgba(15,23,42,.24)',
        'padding:10px 14px',
        'font-size:11px',
        'font-weight:900',
        'font-family:Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        'text-align:center',
        'pointer-events:none'
      ].join(';');

      document.body.appendChild(toast);

      window.setTimeout(() => {
        toast.remove();
      }, 1600);
    };

    const focusSearchLikeInput = () => {
      const inputs = Array.from(document.querySelectorAll('input, textarea'));
      const visibleInputs = inputs.filter((input) => {
        const rect = input.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && !input.disabled && input.type !== 'hidden';
      });

      const target =
        visibleInputs.find((input) => /ara|search|bul/i.test(input.placeholder || '')) ||
        visibleInputs.find((input) => input.type === 'search') ||
        visibleInputs[0];

      if (target) {
        target.focus();
        if (typeof target.select === 'function') target.select();
        showToast('Hızlı arama hazır');
      } else {
        showToast('Arama alanı bulunamadı');
      }
    };

    const copyTechInfo = async () => {
      const recoveryUrl = `${window.location.origin}/?zrc-reset-pwa=1`;
      const text = [
        'ZRC Teknik Bilgi',
        `Build: ${ZRC_APP_BUILD_LABEL}`,
        `Adres: ${window.location.href}`,
        `Kurtarma: ${recoveryUrl}`,
        `Online: ${window.navigator.onLine ? 'Evet' : 'Hayır'}`,
        `Zaman: ${new Date().toISOString()}`
      ].join('\n');

      try {
        await window.navigator.clipboard.writeText(text);
        showToast('Teknik bilgi kopyalandı');
      } catch (error) {
        await window.zrcPrompt('ZRC teknik bilgi:', text);
      }
    };

    const closeTopLayer = () => {
      const closeCandidates = Array.from(
        document.querySelectorAll('button[aria-label*="Kapat"], button[aria-label*="kapat"], button[title*="Kapat"], button[title*="kapat"]')
      );

      const visibleCloseButton = closeCandidates.find((button) => {
        const rect = button.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

      if (visibleCloseButton) {
        visibleCloseButton.click();
        return;
      }

      document.body.click();
    };

    const handleKeyDown = (event) => {
      const key = String(event.key || '').toLowerCase();

      if ((event.metaKey || event.ctrlKey) && key === 'k') {
        event.preventDefault();
        focusSearchLikeInput();
        return;
      }

      if (event.altKey && event.shiftKey && key === 'z') {
        event.preventDefault();
        copyTechInfo();
        return;
      }

      if (event.key === 'Escape') {
        closeTopLayer();
      }
    };

    const handleOnline = () => {
      showToast('Bağlantı geri geldi');
    };

    const handleOffline = () => {
      showToast('Bağlantı yok');
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        window.dispatchEvent(new CustomEvent('zrc-app-visible-again'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const styleId = 'zrc-notification-mobile-style-v317';

    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .zrc-notification-panel {
        max-width: calc(100vw - 24px);
      }

      @media (max-width: 720px) {
        .zrc-notification-panel {
          width: calc(100vw - 24px) !important;
          max-width: calc(100vw - 24px) !important;
          top: calc(max(58px, env(safe-area-inset-top) + 50px)) !important;
          max-height: calc(100svh - 88px) !important;
          border-radius: 16px !important;
        }

        .zrc-notification-panel > span {
          display: none !important;
        }

        .zrc-notification-panel .custom-scrollbar {
          max-height: calc(100svh - 174px) !important;
        }
      }

      @media (max-width: 420px) {
        .zrc-notification-panel {
          width: calc(100vw - 18px) !important;
          max-width: calc(100vw - 18px) !important;
        }
      }
    `;

    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const styleId = 'zrc-ui-polish-style-v316';

    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        :root {
          --zrc-safe-bottom: max(12px, env(safe-area-inset-bottom));
          --zrc-safe-left: max(12px, env(safe-area-inset-left));
          --zrc-safe-right: max(12px, env(safe-area-inset-right));
        }

        #zrc-live-build-badge {
          right: var(--zrc-safe-right) !important;
          bottom: var(--zrc-safe-bottom) !important;
          height: 22px !important;
          padding: 0 8px !important;
          font-size: 8.5px !important;
          opacity: .58 !important;
          box-shadow: 0 8px 22px rgba(15,23,42,.07) !important;
        }

        #zrc-live-build-badge:hover {
          opacity: .92 !important;
        }

        #zrc-pwa-install-button {
          left: var(--zrc-safe-left) !important;
          bottom: calc(var(--zrc-safe-bottom) + 34px) !important;
          min-width: 0 !important;
          height: 32px !important;
          padding: 0 12px !important;
          font-size: 10.5px !important;
        }

        #zrc-ios-pwa-install-tip {
          bottom: calc(var(--zrc-safe-bottom) + 48px) !important;
          left: var(--zrc-safe-left) !important;
          right: var(--zrc-safe-right) !important;
        }

        #zrc-offline-status-banner {
          bottom: calc(var(--zrc-safe-bottom) + 34px) !important;
        }

        @media (max-width: 720px) {
          #zrc-live-build-badge {
            height: 20px !important;
            font-size: 8px !important;
            opacity: .42 !important;
          }

          #zrc-pwa-install-button {
            bottom: calc(var(--zrc-safe-bottom) + 28px) !important;
          }

          #zrc-ios-pwa-install-tip {
            bottom: calc(var(--zrc-safe-bottom) + 44px) !important;
          }
        }

        @media (max-width: 420px) {
          #zrc-live-build-badge {
            transform: scale(.92) !important;
            transform-origin: right bottom !important;
          }
        }

        @media print {
          #zrc-live-build-badge,
          #zrc-pwa-install-button,
          #zrc-ios-pwa-install-tip,
          #zrc-offline-status-banner,
          #zrc-startup-loader {
            display: none !important;
          }
        }
      `;

      document.head.appendChild(style);
    }

    document.documentElement.classList.add('zrc-app-ready');

    return () => {
      document.documentElement.classList.remove('zrc-app-ready');
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const tipId = 'zrc-ios-pwa-install-tip';
    const dismissedKey = 'zrc-ios-pwa-install-tip-dismissed';

    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;
    if (window.localStorage.getItem(dismissedKey) === '1') return;

    const ua = window.navigator.userAgent || '';
    const isIOS =
      /iPhone|iPad|iPod/i.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

    if (!isIOS) return;
    if (document.getElementById(tipId)) return;

    const tip = document.createElement('div');
    tip.id = tipId;
    tip.style.cssText = [
      'position:fixed',
      'left:12px',
      'right:12px',
      'bottom:64px',
      'z-index:99992',
      'max-width:420px',
      'margin:0 auto',
      'border-radius:20px',
      'background:#111827',
      'color:#ffffff',
      'box-shadow:0 18px 50px rgba(15,23,42,.28)',
      'padding:12px 12px 12px 14px',
      'font-family:Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
    ].join(';');

    tip.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <div style="width:28px;height:28px;border-radius:10px;background:#ff3600;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex:0 0 auto;">Z</div>
        <div style="min-width:0;flex:1;">
          <div style="font-size:12px;font-weight:950;margin-bottom:3px;">ZRC’yi iPhone’a kur</div>
          <div style="font-size:10.5px;font-weight:750;line-height:1.45;color:rgba(255,255,255,.78);">
            Safari’de Paylaş simgesine bas, sonra <b>Ana Ekrana Ekle</b> seç.
          </div>
        </div>
        <button type="button" aria-label="Kapat" style="width:26px;height:26px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:15px;font-weight:900;cursor:pointer;flex:0 0 auto;">×</button>
      </div>
    `;

    const closeButton = tip.querySelector('button');

    closeButton?.addEventListener('click', () => {
      window.localStorage.setItem(dismissedKey, '1');
      window.clearTimeout(showTimer);
      window.clearTimeout(autoCloseTimer);
      tip.remove();
    });

    const showTimer = window.setTimeout(() => {
      if (!document.getElementById(tipId) && window.localStorage.getItem(dismissedKey) !== '1') {
        document.body.appendChild(tip);
      }
    }, 3500);

    const autoCloseTimer = window.setTimeout(() => {
      if (document.body.contains(tip)) {
        tip.remove();
      }
    }, 18000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(autoCloseTimer);
      tip.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const buttonId = 'zrc-pwa-install-button';
    const dismissedKey = 'zrc-pwa-install-button-dismissed';
    let deferredPrompt = null;

    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    const isLikelyMobileInstallTarget =
      window.innerWidth <= 900 ||
      /Android|Mobile|Tablet|iPhone|iPad|iPod/i.test(window.navigator.userAgent || '');

    if (!isLikelyMobileInstallTarget) return;
    if (window.sessionStorage.getItem('zrc-pwa-install-button-session-hidden') === '1') return;

    const removeButton = () => {
      const oldButton = document.getElementById(buttonId);
      if (oldButton) oldButton.remove();
    };

    const showInstallButton = () => {
      removeButton();

      const button = document.createElement('button');
      button.id = buttonId;
      button.type = 'button';
      button.innerHTML = '<span>ZRC’yi Kur</span><span aria-hidden="true" style="margin-left:8px;opacity:.82;font-size:14px;line-height:1;">×</span>';
      button.title = 'ZRC Portalı bu cihaza kur';
      button.style.cssText = [
        'position:fixed',
        'left:12px',
        'bottom:46px',
        'z-index:99991',
        'height:34px',
        'padding:0 13px',
        'border:0',
        'border-radius:999px',
        'background:#ff3600',
        'color:#ffffff',
        'font-family:Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        'font-size:11px',
        'font-weight:900',
        'box-shadow:0 14px 34px rgba(255,54,0,.28)',
        'cursor:pointer'
      ].join(';');

      button.addEventListener('click', async (event) => {
        const targetText = event.target?.textContent?.trim();

        if (targetText === '×') {
          window.localStorage.setItem(dismissedKey, '1');
          deferredPrompt = null;
          removeButton();
          return;
        }

        if (!deferredPrompt) return;

        button.textContent = 'Açılıyor...';

        try {
          deferredPrompt.prompt();
          await deferredPrompt.userChoice;
        } catch (error) {
          console.warn('ZRC PWA kurulum penceresi açılamadı:', error);
        } finally {
          deferredPrompt = null;
          removeButton();
        }
      });

      document.body.appendChild(button);

      window.setTimeout(() => {
        const currentButton = document.getElementById(buttonId);

        if (currentButton && deferredPrompt) {
          window.sessionStorage.setItem('zrc-pwa-install-button-session-hidden', '1');
          currentButton.remove();
        }
      }, 18000);
    };

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      deferredPrompt = event;

      window.setTimeout(() => {
        if (deferredPrompt && !document.getElementById(buttonId)) {
          showInstallButton();
        }
      }, 3500);
    };

    const handleInstalled = () => {
      deferredPrompt = null;
      removeButton();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      removeButton();
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const loader = document.getElementById('zrc-startup-loader');

    if (!loader) return;

    loader.classList.add('zrc-startup-loader-hide');

    window.setTimeout(() => {
      loader.remove();
    }, 420);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const badgeId = 'zrc-live-build-badge';

    if (document.getElementById(badgeId)) return;

    const badge = document.createElement('button');
    badge.id = badgeId;
    badge.type = 'button';
    const zrcBuildShortLabel = ZRC_APP_BUILD_LABEL.match(/^v\d+/)?.[0] || ZRC_APP_BUILD_LABEL;
    badge.textContent = `ZRC ${zrcBuildShortLabel}`;
    badge.title = 'Tıkla: PWA kurtarma adresini kopyala';
    badge.style.cssText = [
      'position:fixed',
      'right:10px',
      'bottom:12px',
      'z-index:99990',
      'height:24px',
      'padding:0 9px',
      'border:1px solid rgba(15,23,42,.08)',
      'border-radius:999px',
      'background:rgba(255,255,255,.82)',
      'backdrop-filter:blur(8px)',
      'color:#6b7280',
      'font-size:9px',
      'font-weight:900',
      'letter-spacing:.02em',
      'box-shadow:0 8px 24px rgba(15,23,42,.08)',
      'cursor:pointer'
    ].join(';');

    badge.addEventListener('click', async () => {
      const recoveryUrl = `${window.location.origin}/?zrc-reset-pwa=1`;

      try {
        await navigator.clipboard.writeText(recoveryUrl);
        badge.textContent = 'Kopyalandı';
        window.setTimeout(() => {
          badge.textContent = `ZRC ${zrcBuildShortLabel}`;
        }, 1400);
      } catch (error) {
        await window.zrcPrompt('PWA kurtarma adresi:', recoveryUrl);
      }
    });

    document.body.appendChild(badge);

    return () => {
      badge.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const bannerId = 'zrc-offline-status-banner';

    const removeBannerLater = () => {
      window.setTimeout(() => {
        const banner = document.getElementById(bannerId);
        if (banner && window.navigator.onLine) {
          banner.remove();
        }
      }, 2200);
    };

    const showConnectionBanner = (mode) => {
      let banner = document.getElementById(bannerId);

      if (!banner) {
        banner = document.createElement('div');
        banner.id = bannerId;
        banner.style.cssText = [
          'position:fixed',
          'left:50%',
          'bottom:16px',
          'transform:translateX(-50%)',
          'z-index:99998',
          'width:min(calc(100vw - 28px), 360px)',
          'border-radius:999px',
          'box-shadow:0 18px 50px rgba(15,23,42,.22)',
          'padding:10px 14px',
          'font-family:Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          'font-size:11px',
          'font-weight:900',
          'text-align:center'
        ].join(';');

        document.body.appendChild(banner);
      }

      if (mode === 'offline') {
        banner.textContent = 'İnternet bağlantısı yok. Değişiklikler kaydedilemeyebilir.';
        banner.style.background = '#111827';
        banner.style.color = '#ffffff';
        return;
      }

      banner.textContent = 'Bağlantı geri geldi.';
      banner.style.background = '#16a34a';
      banner.style.color = '#ffffff';
      removeBannerLater();
    };

    const handleOffline = () => showConnectionBanner('offline');
    const handleOnline = () => showConnectionBanner('online');

    if (!window.navigator.onLine) {
      showConnectionBanner('offline');
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const styleId = 'zrc-mobile-viewport-style';

    const updateViewportUnit = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--zrc-vh', `${vh}px`);
    };

    updateViewportUnit();
    window.addEventListener('resize', updateViewportUnit);
    window.addEventListener('orientationchange', updateViewportUnit);

    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        :root {
          --zrc-vh: 1vh;
        }

        .zrc-mobile-full-height {
          min-height: calc(var(--zrc-vh) * 100);
        }

        @media (max-width: 720px) {
          .min-h-screen {
            min-height: calc(var(--zrc-vh) * 100) !important;
          }

          .h-screen {
            height: calc(var(--zrc-vh) * 100) !important;
          }

          .max-h-screen {
            max-height: calc(var(--zrc-vh) * 100) !important;
          }

          .zrc-safe-area-panel {
            padding-bottom: max(12px, env(safe-area-inset-bottom));
          }
        }
      `;

      document.head.appendChild(style);
    }

    return () => {
      window.removeEventListener('resize', updateViewportUnit);
      window.removeEventListener('orientationchange', updateViewportUnit);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const diagnosticPayload = {
      app: 'ZRC Portal',
      build: ZRC_APP_BUILD_LABEL,
      url: window.location.href,
      userAgent: navigator.userAgent,
      createdAt: new Date().toISOString()
    };

    try {
      window.localStorage.setItem('zrc-current-build-info', JSON.stringify(diagnosticPayload, null, 2));
    } catch (error) {
      // localStorage erişimi yoksa sessiz geç.
    }

    console.info('[ZRC Portal Build]', diagnosticPayload);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const styleId = 'zrc-mobile-overflow-fix-style';

    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      html,
      body,
      #root {
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
      }

      * {
        box-sizing: border-box;
      }

      img,
      svg,
      video,
      canvas {
        max-width: 100%;
      }

      @media (max-width: 720px) {
        body {
          position: relative;
        }

        .custom-scrollbar {
          overscroll-behavior: contain;
        }

        input,
        textarea,
        select,
        button {
          max-width: 100%;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const oldBanner = document.getElementById('zrc-pwa-update-banner');
    if (oldBanner) oldBanner.remove();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentUrl = new URL(window.location.href);

    if (currentUrl.searchParams.get('zrc-reset-pwa') !== '1') return;

    let isCancelled = false;

    const resetPwaCacheFromUrl = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }

        try {
          window.localStorage.removeItem('zrc-ios-pwa-install-tip-dismissed');
          window.localStorage.removeItem('zrc-pwa-install-button-dismissed');
          window.sessionStorage.removeItem('zrc-pwa-install-button-session-hidden');
        } catch (storageError) {
          console.warn('ZRC PWA kurulum kayıtları temizlenemedi:', storageError);
        }

        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames
              .filter((cacheName) => cacheName.startsWith('zrc-portal-'))
              .map((cacheName) => caches.delete(cacheName))
          );
        }
      } catch (error) {
        console.warn('[ZRC PWA] URL ile önbellek temizlenemedi:', error);
      }

      if (isCancelled) return;

      currentUrl.searchParams.delete('zrc-reset-pwa');
      window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
      window.location.reload();
    };

    resetPwaCacheFromUrl();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const styleId = 'zrc-mobile-comfort-style';

    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      html {
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
        overscroll-behavior: none;
      }

      body {
        overscroll-behavior: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      button,
      [role="button"],
      input,
      textarea,
      select {
        touch-action: manipulation;
      }

      @media (max-width: 720px) {
        input,
        textarea,
        select {
          font-size: 16px !important;
        }

        .custom-scrollbar {
          -webkit-overflow-scrolling: touch;
        }

        .zrc-mobile-safe-bottom {
          padding-bottom: max(14px, env(safe-area-inset-bottom));
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const isLocalDev =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    const isZrcLiveDomain =
      window.location.hostname === 'portal.zrcajans.com' ||
      window.location.hostname.endsWith('.vercel.app');

    if (isLocalDev) {
      console.info('[ZRC PWA] Local geliştirme ortamında service worker kapalı.');
      return;
    }

    if (!isZrcLiveDomain) {
      console.info('[ZRC PWA] Bu domain için service worker kaydı atlandı:', window.location.hostname);
      return;
    }

    let isCancelled = false;

    const registerZrcServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/zrc-sw.js', { scope: '/' });

        if (!isCancelled) {
          console.info('[ZRC PWA] Service worker hazır:', registration.scope);
        }
      } catch (error) {
        console.warn('[ZRC PWA] Service worker kaydı başarısız:', error);
      }
    };

    if (document.readyState === 'complete') {
      registerZrcServiceWorker();
    } else {
      window.addEventListener('load', registerZrcServiceWorker, { once: true });
    }

    return () => {
      isCancelled = true;
      window.removeEventListener('load', registerZrcServiceWorker);
    };
  }, []);

  const [activeMenu, setActiveMenu] = useState(() => getSavedNavigationState().activeMenu);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [supabaseConnectionStatus, setSupabaseConnectionStatus] = useState({
    state: 'checking',
    label: 'Supabase kontrol ediliyor'
  });

  useEffect(() => {
    let isMounted = true;

    const checkSupabaseConnection = async () => {
      const hasSupabaseConfig = Boolean(
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
      );

      if (!hasSupabaseConfig) {
        if (isMounted) {
          setSupabaseConnectionStatus({
            state: 'error',
            label: 'Supabase ayarı eksik'
          });
        }
        return;
      }

      try {
        const { error } = await supabase
          .from('workspaces')
          .select('id', { count: 'exact', head: true });

        if (error) {
          if (isMounted) {
            setSupabaseConnectionStatus({
              state: 'error',
              label: `Supabase hata: ${error.message}`
            });
          }
          return;
        }

        if (isMounted) {
          setSupabaseConnectionStatus({
            state: 'connected',
            label: 'Supabase bağlı'
          });
        }
      } catch (error) {
        if (isMounted) {
          setSupabaseConnectionStatus({
            state: 'error',
            label: `Supabase bağlantı hatası`
          });
        }
      }
    };

    checkSupabaseConnection();

    return () => {
      isMounted = false;
    };
  }, []);


  const {projects, setProjects, teamMembers, setTeamMembers, currentUserId, setCurrentUserId, supabaseAuthUserId, setSupabaseAuthUserId, currentAssignedSupabaseTaskIds, setCurrentAssignedSupabaseTaskIds, loginDraft, setLoginDraft, loginError, setLoginError, authLoginLoading, setAuthLoginLoading, authSessionLoading, setAuthSessionLoading, supabaseWorkspaceId, setSupabaseWorkspaceId, supabaseWriteStatus, setSupabaseWriteStatus, supabaseHealthLoading, setSupabaseHealthLoading, supabaseBackupLoading, setSupabaseBackupLoading, supabaseRealtimeStatus, setSupabaseRealtimeStatus, pwaInstallPrompt, setPwaInstallPrompt, pwaInstallStatus, setPwaInstallStatus, supabaseHealthReport, setSupabaseHealthReport, supabaseLastFullRefreshAt, setSupabaseLastFullRefreshAt, supabaseLastBackupAt, setSupabaseLastBackupAt, supabaseLastRealtimeAt, setSupabaseLastRealtimeAt, teamMemberDraft, setTeamMemberDraft, pendingTeamDeleteId, setPendingTeamDeleteId, selectedTeamMemberId, setSelectedTeamMemberId, editingTeamMember, setEditingTeamMember, teamMemberEditDraft, setTeamMemberEditDraft, customers, setCustomers, customerDraft, setCustomerDraft, selectedCustomerId, setSelectedCustomerId, pendingCustomerDeleteId, setPendingCustomerDeleteId, editingCustomer, setEditingCustomer, customerEditDraft, setCustomerEditDraft, selectedProject, setSelectedProject, activeTab, setActiveTab, activeContentMenu, setActiveContentMenu, homeWorkView, setHomeWorkView, quickNoteTitleDraft, setQuickNoteTitleDraft, quickNoteDraft, setQuickNoteDraft, editingQuickNoteId, setEditingQuickNoteId, quickNoteSearch, setQuickNoteSearch, pendingDeleteQuickNoteId, setPendingDeleteQuickNoteId, isQuickNoteSearchOpen, setIsQuickNoteSearchOpen, isQuickNoteComposerOpen, setIsQuickNoteComposerOpen, quickNotes, setQuickNotes, boardView, setBoardView, mobileActiveColumnId, setMobileActiveColumnId, zrcMobileColumnRefreshKey, setZrcMobileColumnRefreshKey, calendarMonthDate, setCalendarMonthDate, calendarNewTaskDate, setCalendarNewTaskDate, calendarQuickTaskDraft, setCalendarQuickTaskDraft, calendarTaskModalContext, setCalendarTaskModalContext, isCalendarDisplayMenuOpen, setIsCalendarDisplayMenuOpen, isMenuCalendarFilterOpen, setIsMenuCalendarFilterOpen, isMenuCalendarStatusOpen, setIsMenuCalendarStatusOpen, menuCalendarStatusFilter, setMenuCalendarStatusFilter, calendarView, setCalendarView, calendarFocusedDate, setCalendarFocusedDate, timeChartView, setTimeChartView, timeChartStartDate, setTimeChartStartDate, timeChartSearch, setTimeChartSearch, isTimeChartFilterOpen, setIsTimeChartFilterOpen, isTimeChartSettingsOpen, setIsTimeChartSettingsOpen, timeChartFilters, setTimeChartFilters, timeChartSettings, setTimeChartSettings, ganttView, setGanttView, ganttStartDate, setGanttStartDate, ganttSearch, setGanttSearch, ganttShowCompleted, setGanttShowCompleted, fileSearch, setFileSearch, fileTypeFilter, setFileTypeFilter, selectedProjectFileKey, setSelectedProjectFileKey, pendingFileDeleteKey, setPendingFileDeleteKey, isNotificationsOpen, setIsNotificationsOpen, activityNotifications, setActivityNotifications, readNotificationIds, setReadNotificationIds, isGlobalSearchOpen, setIsGlobalSearchOpen, isMobileProjectPickerOpen, setIsMobileProjectPickerOpen, isMobileTaskWizardOpen, setIsMobileTaskWizardOpen, mobileTaskWizardStep, setMobileTaskWizardStep, mobileTaskWizardData, setMobileTaskWizardData, globalSearchQuery, setGlobalSearchQuery, globalSearchFilter, setGlobalSearchFilter, isMessagesOpen, setIsMessagesOpen, projectMessages, setProjectMessages, readMessageIds, setReadMessageIds, messageDraft, setMessageDraft, messageLinkedTaskId, setMessageLinkedTaskId, isMessageTaskPickerOpen, setIsMessageTaskPickerOpen, chatGroups, setChatGroups, selectedChatGroupId, setSelectedChatGroupId, chatGroupDraft, setChatGroupDraft, chatGroupSearch, setChatGroupSearch, chatPageDraft, setChatPageDraft, isChatGroupModalOpen, setIsChatGroupModalOpen, isChatActionMenuOpen, setIsChatActionMenuOpen, activeProfileTab, setActiveProfileTab, openProfileDropdown, setOpenProfileDropdown, profileDraft, setProfileDraft, profilePreferences, setProfilePreferences, emailAccountDraft, setEmailAccountDraft, pendingProfileDelete, setPendingProfileDelete, calendarDisplayOptions, setCalendarDisplayOptions, projectSettings, setProjectSettings, projectSettingsDraft, setProjectSettingsDraft, isProjectTeamPickerOpen, setIsProjectTeamPickerOpen, getInitialSelectedProject, timeChartScrollRef, calendarTaskOpenLockRef, ganttScrollRef, profileAvatarInputRef, dataImportInputRef, currentAuthUserIdForRole, hasSupabaseAuthUserForRole, currentRoleMember, currentProfileNameParts, rawCurrentProfileName, currentProfileName, currentProfileInitials, currentProfileAvatar, normalizedCurrentRawRole, isZrcOwnerAccount, currentUserRole, currentAccountType, isLoggedIn, currentPermissions, currentActorId, currentActorName, currentActorAvatar} = useZRCAppCoreState();

  const getCurrentDataSnapshot = () =>
    createDataSnapshot({
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
    });

  useEffect(() => {
    writeStorageValue('dataVersion', APP_DATA_VERSION);
  }, []);

  useEffect(() => {
    writeStorageValue('projects', projects);
  }, [projects]);

  useEffect(() => {
    writeStorageValue('teamMembers', teamMembers);
  }, [teamMembers]);

  useEffect(() => {
    writeStorageValue('customers', customers);
  }, [customers]);

  useEffect(() => {
    const customerMembers = teamMembers.filter((member) => normalizeTeamRole(member.role) === 'Müşteri/Misafir');
    if (customerMembers.length === 0 || customers.length === 0) return;

    const hasLegacyLinkMigrationRun = readStorageValue('customerLinkMigrated', '') === '1';
    const nextCustomerAccountMap = {};
    const nextMemberCustomerMap = {};

    customerMembers.forEach((member) => {
      const alreadyLinkedCustomer = customers.find(
        (customer) => customer.accountUserId === member.id || customer.id === member.customerId
      );

      const fallbackCustomer =
        alreadyLinkedCustomer ||
        customers.find(
          (customer) =>
            normalizeCredentialText(customer.email) === normalizeCredentialText(member.email) ||
            normalizeCredentialText(customer.contact) === normalizeCredentialText(member.name)
        ) ||
        (!hasLegacyLinkMigrationRun && normalizeCredentialText(member.username) === 'misafir'
          ? customers.find((customer) => normalizeCredentialText(customer.name) === normalizeCredentialText('Örnek Şirket'))
          : null);

      if (!fallbackCustomer) return;

      if (fallbackCustomer.accountUserId !== member.id) {
        nextCustomerAccountMap[fallbackCustomer.id] = member.id;
      }

      if (member.customerId !== fallbackCustomer.id) {
        nextMemberCustomerMap[member.id] = fallbackCustomer.id;
      }
    });

    if (Object.keys(nextCustomerAccountMap).length > 0) {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          nextCustomerAccountMap[customer.id]
            ? { ...customer, accountUserId: nextCustomerAccountMap[customer.id] }
            : customer
        )
      );
    }

    if (Object.keys(nextMemberCustomerMap).length > 0) {
      setTeamMembers((prevMembers) =>
        prevMembers.map((member) =>
          nextMemberCustomerMap[member.id]
            ? { ...member, customerId: nextMemberCustomerMap[member.id] }
            : member
        )
      );
    }

    if (!hasLegacyLinkMigrationRun) {
      writeStorageValue('customerLinkMigrated', '1');
    }
  }, [teamMembers, customers]);

  useEffect(() => {
    const validCustomerAccountIds = new Set(
      teamMembers
        .filter((member) => normalizeTeamRole(member.role) === 'Müşteri/Misafir')
        .map((member) => member.id)
    );
    const validCustomerIds = new Set(customers.map((customer) => customer.id));

    const hasBrokenCustomerAccountLink = customers.some(
      (customer) => customer.accountUserId && !validCustomerAccountIds.has(customer.accountUserId)
    );
    const hasBrokenMemberCustomerLink = teamMembers.some((member) => {
      const role = normalizeTeamRole(member.role);

      if (role !== 'Müşteri/Misafir') return Boolean(member.customerId);
      return Boolean(member.customerId && !validCustomerIds.has(member.customerId));
    });

    if (hasBrokenCustomerAccountLink) {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.accountUserId && !validCustomerAccountIds.has(customer.accountUserId)
            ? { ...customer, accountUserId: '' }
            : customer
        )
      );
    }

    if (hasBrokenMemberCustomerLink) {
      setTeamMembers((prevMembers) =>
        prevMembers.map((member) => {
          const role = normalizeTeamRole(member.role);

          if (role !== 'Müşteri/Misafir' && member.customerId) {
            return { ...member, customerId: '' };
          }

          if (role === 'Müşteri/Misafir' && member.customerId && !validCustomerIds.has(member.customerId)) {
            return { ...member, customerId: '' };
          }

          return member;
        })
      );
    }
  }, [teamMembers, customers]);

  useEffect(() => {
    writeStorageValue('quickNotes', quickNotes);
  }, [quickNotes]);

  useEffect(() => {
    writeStorageValue('projectSettings', projectSettings);
  }, [projectSettings]);

  useEffect(() => {
    writeStorageValue('activityNotifications', activityNotifications);
  }, [activityNotifications]);

  useEffect(() => {
    writeStorageValue('readNotifications', readNotificationIds);
  }, [readNotificationIds]);

  useEffect(() => {
    writeStorageValue('projectMessages', projectMessages);
  }, [projectMessages]);

  useEffect(() => {
    writeStorageValue('chatGroups', chatGroups);
  }, [chatGroups]);

  useEffect(() => {
    const safeProfileDraftForStorage = {
      ...profileDraft,
      currentPassword: '',
      newPassword: '',
      repeatPassword: ''
    };

    writeStorageValue('profileDraft', safeProfileDraftForStorage);
  }, [profileDraft]);

  useEffect(() => {
    writeStorageValue('profilePreferences', profilePreferences);
  }, [profilePreferences]);

  useEffect(() => {
    writeStorageValue('readMessages', readMessageIds);
  }, [readMessageIds]);

  useEffect(() => {
    if (currentUserId) {
      writeStorageValue('currentUserId', currentUserId);
    } else {
      removeStorageValue('currentUserId');
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    writeStorageValue(NAVIGATION_STORAGE_KEYS.activeMenu, activeMenu || 'Ana Sayfa');
    writeStorageValue(NAVIGATION_STORAGE_KEYS.activeContentMenu, activeContentMenu || activeMenu || 'Ana Sayfa');
    writeStorageValue(NAVIGATION_STORAGE_KEYS.activeTab, activeTab || 'Görevler');
  }, [currentUserId, activeMenu, activeContentMenu, activeTab]);

  useEffect(() => {
    const handleGlobalSearchKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsGlobalSearchOpen(false);
        setIsMessagesOpen(false);
        setIsMessageTaskPickerOpen(false);
      }
    };

    document.addEventListener('keydown', handleGlobalSearchKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalSearchKeyDown);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    setProjectSettingsDraft({
      ...createDefaultProjectSettings(selectedProject),
      ...(projectSettings[selectedProject] || {}),
      title: projectSettings[selectedProject]?.title || selectedProject
    });
    setIsProjectTeamPickerOpen(false);
  }, [selectedProject, projectSettings]);

  useEffect(() => {
    writeStorageValue('selectedProject', selectedProject || '');
    setSelectedTasks([]);
    setOpenMenuColumnId(null);
    setOpenTaskMenuId(null);
    setBoardView('Tüm Görevler');
  }, [selectedProject]);

  const {isEditMode, setIsEditMode, projectBoards, setProjectBoards} = useZRCBoardStateLayer({ selectedProject, setSelectedProject });

  /* === ZRC REMOVE LEGACY DEFAULT PROJECTS START === */
  useEffect(() => {
    const legacyProjectNames = ['Çalışma', 'Calisma', 'E-Ticaret Arayüz Tasarımı'];

    setProjects((prevProjects) =>
      Array.isArray(prevProjects)
        ? prevProjects.filter((projectName) => !legacyProjectNames.includes(projectName))
        : []
    );

    setSelectedProject((prevProject) =>
      legacyProjectNames.includes(prevProject) ? '' : prevProject
    );

    setProjectBoards((prevBoards) => {
      if (!prevBoards || typeof prevBoards !== 'object' || Array.isArray(prevBoards)) return {};

      const cleanedBoards = Object.fromEntries(
        Object.entries(prevBoards).filter(([projectName]) =>
          projectName && !legacyProjectNames.includes(projectName)
        )
      );

      return Object.keys(cleanedBoards).length === Object.keys(prevBoards).length
        ? prevBoards
        : cleanedBoards;
    });

    const cachedSelectedProject = String(readStorageValue('selectedProject', '') || '').trim();

    if (legacyProjectNames.includes(cachedSelectedProject)) {
      writeStorageValue('selectedProject', '');
    }

    const cachedBoards = normalizeStorageObject(readStorageValue('projectBoards', null), null);

    if (cachedBoards && typeof cachedBoards === 'object' && !Array.isArray(cachedBoards)) {
      const cleanedCachedBoards = Object.fromEntries(
        Object.entries(cachedBoards).filter(([projectName]) =>
          projectName && !legacyProjectNames.includes(projectName)
        )
      );

      if (Object.keys(cleanedCachedBoards).length !== Object.keys(cachedBoards).length) {
        writeStorageValue('projectBoards', cleanedCachedBoards);
      }
    }
  }, []);
  /* === ZRC REMOVE LEGACY DEFAULT PROJECTS END === */



  // zrc-v426b-mobile-end-date-hard-fix
  // Mobil kartlar endDate beklediği için dueDate/end_date/due_date alanlarını endDate'e kesin olarak taşır.
  useEffect(() => {
    setProjectBoards((prevBoards) => {
      let changed = false;

      const nextBoards = Object.fromEntries(
        Object.entries(prevBoards || {}).map(([projectName, board]) => {
          const nextColumns = (board?.columns || []).map((column) => {
            const nextTasks = (column?.tasks || []).map((task) => {
              const normalizedTask = zrcV426bNormalizeTaskDateFields(task);

              if (normalizedTask !== task) changed = true;

              return normalizedTask;
            });

            return {
              ...column,
              tasks: nextTasks
            };
          });

          const nextArchivedTasks = (board?.archivedTasks || []).map((task) => {
            const normalizedTask = zrcV426bNormalizeTaskDateFields(task);

            if (normalizedTask !== task) changed = true;

            return normalizedTask;
          });

          return [
            projectName,
            {
              ...board,
              columns: nextColumns,
              archivedTasks: nextArchivedTasks
            }
          ];
        })
      );

      return changed ? nextBoards : prevBoards;
    });

    window.setTimeout(zrcV426bApplyDueDateColors, 180);
  }, [projectBoards]);


  // zrc-v425-instant-task-cache
  // Sayfa yenilenince görev kartları Supabase beklemeden son yerel cache'ten anında gösterilir.
  // Supabase arkada güncel veriyi getirince mevcut akış zaten panoyu tazeler.
  useEffect(() => {
    const cachedBoards = normalizeStorageObject(readStorageValue('projectBoards', null), null);

    if (!cachedBoards || typeof cachedBoards !== 'object' || Array.isArray(cachedBoards)) {
      return;
    }

    const cachedProjectNames = Object.keys(cachedBoards);

    if (cachedProjectNames.length === 0) {
      return;
    }

    const cachedHasTasks = Object.values(cachedBoards).some((board) =>
      Array.isArray(board?.columns) &&
      board.columns.some((column) => Array.isArray(column?.tasks) && column.tasks.length > 0)
    );

    if (!cachedHasTasks) {
      return;
    }

    setProjectBoards((prevBoards) => {
      const currentHasTasks = Object.values(prevBoards || {}).some((board) =>
        Array.isArray(board?.columns) &&
        board.columns.some((column) => Array.isArray(column?.tasks) && column.tasks.length > 0)
      );

      return currentHasTasks ? prevBoards : cachedBoards;
    });

    const cachedSelectedProject = String(readStorageValue('selectedProject', '') || '').trim();

    if (cachedSelectedProject) {
      setSelectedProject((prevProject) => prevProject || cachedSelectedProject);
    }
  }, []);


  const currentBoard = projectBoards[selectedProject] || createDefaultProjectBoard();
  const boardColumns = currentBoard.columns;
  const archivedTasks = currentBoard.archivedTasks;

  const totalStoredTasks = Object.values(projectBoards || {}).reduce((total, board) => {
    const activeTasks = (board?.columns || []).reduce((columnTotal, column) => columnTotal + (column.tasks || []).length, 0);
    const archivedCount = (board?.archivedTasks || []).length;

    return total + activeTasks + archivedCount;
  }, 0);

  const dataManagementStats = [
    ['Projeler', projects.length],
    ['Görevler', totalStoredTasks],
    ['Ekip', teamMembers.length],
    ['Müşteriler', customers.length],
    ['Pano', Object.keys(projectBoards || {}).length],
    ['Mesajlar', projectMessages.length],
    ['Bildirim', activityNotifications.length],
    ['Yazışma Grubu', chatGroups.length]
  ];

  
  /* === ZRC TASK ORDER PERSISTENCE HELPERS START === */
  const zrcTaskOrderStorageKeyForProject = (projectName = '') =>
    `zrc-task-order-v1:${String(projectName || '').trim()}`;

  const zrcGetStableTaskOrderId = (task = {}) => {
    const rawId = String(task?.id || '').trim();
    const supabaseId = String(
      task?.supabaseId ||
      task?.supabase_id ||
      (rawId.startsWith('supabase-') ? rawId.replace('supabase-', '') : '') ||
      ''
    ).trim();

    return supabaseId || rawId || String(task?.title || '').trim();
  };

  const zrcGetColumnOrderKey = (column = {}) =>
    String(column?.id || normalizeColumnTitleForDisplay(column?.title || '') || '').trim();

  const zrcReadStoredTaskOrder = (projectName = '') => {
    const storageKey = zrcTaskOrderStorageKeyForProject(projectName);
    const storedOrder = normalizeStorageObject(readStorageValue(storageKey, {}), {});

    return storedOrder && typeof storedOrder === 'object' && !Array.isArray(storedOrder)
      ? storedOrder
      : {};
  };

  const zrcPersistTaskOrderForColumns = (columns = [], projectName = selectedProject) => {
    if (!projectName || !Array.isArray(columns)) return;

    const orderMap = {};

    columns.forEach((column) => {
      const columnKey = zrcGetColumnOrderKey(column);
      const titleKey = normalizeColumnTitleForDisplay(column?.title || '');

      const taskIds = (column?.tasks || [])
        .map(zrcGetStableTaskOrderId)
        .filter(Boolean);

      if (columnKey) orderMap[columnKey] = taskIds;
      if (titleKey) orderMap[titleKey] = taskIds;
    });

    writeStorageValue(zrcTaskOrderStorageKeyForProject(projectName), orderMap);
  };


  const zrcApplyStoredTaskOrderToColumns = (columns = [], projectName = selectedProject) => {
    if (!projectName || !Array.isArray(columns)) return columns;

    const storedOrder = zrcReadStoredTaskOrder(projectName);
    let didChange = false;

    const orderedColumns = columns.map((column) => {
      const tasks = Array.isArray(column?.tasks) ? column.tasks : [];
      if (tasks.length <= 1) return column;

      const beforeIds = tasks.map(zrcGetStableTaskOrderId).join('|');

      if (!storedOrder || Object.keys(storedOrder).length === 0) return column;

      const columnKey = zrcGetColumnOrderKey(column);
      const titleKey = normalizeColumnTitleForDisplay(column?.title || '');
      const taskOrder = storedOrder[columnKey] || storedOrder[titleKey];

      if (!Array.isArray(taskOrder) || taskOrder.length === 0) return column;

      const orderIndex = new Map(taskOrder.map((taskId, index) => [String(taskId), index]));

      const orderedTasks = [...tasks].sort((leftTask, rightTask) => {
        const leftId = zrcGetStableTaskOrderId(leftTask);
        const rightId = zrcGetStableTaskOrderId(rightTask);

        const leftOrder = orderIndex.has(leftId) ? orderIndex.get(leftId) : Number.MAX_SAFE_INTEGER;
        const rightOrder = orderIndex.has(rightId) ? orderIndex.get(rightId) : Number.MAX_SAFE_INTEGER;

        if (leftOrder !== rightOrder) return leftOrder - rightOrder;

        return 0;
      });

      const afterIds = orderedTasks.map(zrcGetStableTaskOrderId).join('|');

      if (beforeIds !== afterIds) didChange = true;

      return {
        ...column,
        tasks: orderedTasks
      };
    });

    return didChange ? orderedColumns : columns;
  };

  const zrcTaskOrderSignatureForColumns = (columns = []) =>
    (Array.isArray(columns) ? columns : [])
      .map((column) =>
        `${zrcGetColumnOrderKey(column)}:${(column?.tasks || []).map(zrcGetStableTaskOrderId).join(',')}`
      )
      .join('||');

  /* === ZRC DESKTOP ORDER DB MIRROR START === */
  const zrcDesktopOrderDbMirrorRef = useRef({ signature: '', timer: null, inFlight: false });
  const zrcDesktopOrderDbMirrorSignature = zrcTaskOrderSignatureForColumns(boardColumns);

  useEffect(() => {
    // zrc-desktop-order-db-mirror-v1
    // Masaüstü doğru sırayı localStorage ile koruyordu; mobil ise başka cihaz olduğu için bunu göremiyordu.
    // Bu effect masaüstündeki mevcut sırayı DB task_order alanına aynalar. Mobil de DB'den aynı sırayı okur.
    if (!selectedProject) return;
    if (!Array.isArray(boardColumns) || boardColumns.length === 0) return;
    if (typeof window === 'undefined') return;

    try {
      const isMobile =
        window.matchMedia?.('(max-width: 768px)')?.matches ||
        window.innerWidth <= 768 ||
        /Android|iPhone|iPad|iPod/i.test(window.navigator?.userAgent || '');

      if (isMobile) return;
    } catch (error) {}

    const workspaceId = typeof getCurrentSupabaseWorkspaceId === 'function'
      ? getCurrentSupabaseWorkspaceId()
      : '';

    if (!workspaceId || !supabase) return;

    const storedOrder = zrcReadStoredTaskOrder(selectedProject);
    if (!storedOrder || Object.keys(storedOrder).length === 0) return;

    const orderedColumns = zrcApplyStoredTaskOrderToColumns(boardColumns, selectedProject);
    const orderSignature = `${selectedProject}::${zrcTaskOrderSignatureForColumns(orderedColumns)}`;

    if (!orderSignature || zrcDesktopOrderDbMirrorRef.current.signature === orderSignature) return;

    window.clearTimeout(zrcDesktopOrderDbMirrorRef.current.timer);

    zrcDesktopOrderDbMirrorRef.current.timer = window.setTimeout(async () => {
      if (zrcDesktopOrderDbMirrorRef.current.inFlight) return;

      zrcDesktopOrderDbMirrorRef.current.inFlight = true;

      try {
        const projectId = await ensureSupabaseProject(selectedProject);
        if (!projectId) return;

        const updates = [];

        for (const [columnIndex, column] of orderedColumns.entries()) {
          if (!column) continue;

          const columnId = await ensureSupabaseColumn(projectId, column, columnIndex);

          for (const [taskIndex, task] of (column.tasks || []).entries()) {
            const rawId = String(task?.id || '').trim();
            const taskId = String(
              task?.supabaseId ||
              task?.supabase_id ||
              (rawId.startsWith('supabase-') ? rawId.replace('supabase-', '') : '') ||
              (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawId) ? rawId : '') ||
              ''
            ).trim();

            if (!taskId) continue;

            updates.push({
              taskId,
              payload: {
                task_order: taskIndex,
                column_id: columnId || task?.column_id || null,
                status: column?.title || task?.status || '',
                updated_at: new Date().toISOString()
              }
            });
          }
        }

        if (updates.length === 0) return;

        await Promise.all(
          updates.map(async ({ taskId, payload }) => {
            const { error } = await supabase
              .from('tasks')
              .update(payload)
              .eq('id', taskId)
              .eq('workspace_id', workspaceId);

            if (error) throw error;
          })
        );

        zrcDesktopOrderDbMirrorRef.current.signature = orderSignature;

        try {
          window.localStorage.setItem('zrc-task-order-saving-until', String(Date.now() + 700));
        } catch (error) {}
      } catch (error) {
        console.warn('ZRC masaüstü görev sırası DB aynalama başarısız:', error);
      } finally {
        zrcDesktopOrderDbMirrorRef.current.inFlight = false;
      }
    }, 250);

    return () => {
      window.clearTimeout(zrcDesktopOrderDbMirrorRef.current.timer);
    };
  }, [selectedProject, zrcDesktopOrderDbMirrorSignature]);
  /* === ZRC DESKTOP ORDER DB MIRROR END === */

  /* === ZRC TASK ORDER PERSISTENCE HELPERS END === */

  const setBoardColumns = (updater) => {
    if (!selectedProject) return;

    setProjectBoards((prevBoards) => {
      const existingBoard = prevBoards[selectedProject] || createDefaultProjectBoard();
      const rawNextColumns = typeof updater === 'function' ? updater(existingBoard.columns) : updater;
      const safeNextColumns = Array.isArray(rawNextColumns) ? rawNextColumns : existingBoard.columns;

      const nextColumns =
        typeof updater === 'function'
          ? safeNextColumns
          : zrcApplyStoredTaskOrderToColumns(safeNextColumns, selectedProject);

      zrcPersistTaskOrderForColumns(nextColumns, selectedProject);

      return {
        ...prevBoards,
        [selectedProject]: {
          ...existingBoard,
          columns: nextColumns
        }
      };
    });
  };

  const setArchivedTasks = (updater) => {
    if (!selectedProject) return;

    setProjectBoards((prevBoards) => {
      const existingBoard = prevBoards[selectedProject] || createDefaultProjectBoard();
      const nextArchivedTasks = typeof updater === 'function' ? updater(existingBoard.archivedTasks) : updater;

      return {
        ...prevBoards,
        [selectedProject]: {
          ...existingBoard,
          archivedTasks: nextArchivedTasks
        }
      };
    });
  };

  const {openMenuColumnId, setOpenMenuColumnId, openTaskMenuId, setOpenTaskMenuId, selectedTasks, setSelectedTasks} = useZRCTaskSelectionState();


  useEffect(() => {
    writeStorageValue('projectBoards', projectBoards);
  }, [projectBoards]);

  useEffect(() => {
    if (!selectedProject) return;

    setProjectBoards((prevBoards) => {
      if (prevBoards[selectedProject]) {
        return prevBoards;
      }

      return {
        ...prevBoards,
        [selectedProject]: createDefaultProjectBoard()
      };
    });
  }, [selectedProject]);

  const {isTaskModalOpen, setIsTaskModalOpen, editingTask, setEditingTask, detailTaskInfo, setDetailTaskInfo, isStageModalOpen, setIsStageModalOpen, editingColumn, setEditingColumn} = useZRCModalState();

  const priorityOptions = [
    { label: 'En Düşük', color: '#9ca3af' },
    { label: 'Düşük', color: '#10b981' },
    { label: 'Orta', color: '#f59e0b' },
    { label: 'Yüksek', color: '#f97316' },
    { label: 'Acil', color: '#ef4444' }
  ];

  // --- YARDIMCI FONKSİYONLAR ---


  // --- STİLLER ---


  const getCurrentSupabaseWorkspaceId = () =>
    supabaseWorkspaceId || currentRoleMember?.workspaceId || '';

  const setSupabaseWriteInfo = (state, label) => {
    setSupabaseWriteStatus({ state, label });
  };





  const ensureSupabaseProject = async (projectName = selectedProject) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();
    const cleanProjectName = String(projectName || '').trim();

    if (!workspaceId || !cleanProjectName) return null;

    const { data: existingProject, error: selectError } = await supabase
      .from('projects')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('name', cleanProjectName)
      .maybeSingle();

    if (selectError) throw selectError;
    if (existingProject?.id) return existingProject.id;

    const currentSettings = projectSettings[cleanProjectName] || createDefaultProjectSettings(cleanProjectName);

    const { data: createdProject, error: insertError } = await supabase
      .from('projects')
      .insert({
        workspace_id: workspaceId,
        name: cleanProjectName,
        description: currentSettings.description || '',
        customer_id: isSupabaseUuid(currentSettings.customerId) ? currentSettings.customerId : null,
        status: currentSettings.status === 'Pasif' ? 'Pasif' : 'Aktif',
        color: currentSettings.color || '#ff3600',
        created_by: isSupabaseUuid(currentUserId) ? currentUserId : null
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    return createdProject?.id || null;
  };

  const ensureSupabaseColumn = async (projectId, column = {}, position = 0) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();
    const cleanTitle = normalizeColumnTitleForDisplay(column?.title || 'Yeni Görev');

    if (!workspaceId || !projectId || !cleanTitle) return null;

    const columnPayload = {
      workspace_id: workspaceId,
      project_id: projectId,
      title: cleanTitle,
      description: column?.desc || column?.description || '',
      color: column?.color || '#64748b',
      position,
      is_archived: false
    };

    const titleAliases = cleanTitle === 'Yeni Görev' ? ['Yeni Görev', 'Bekliyor'] : [cleanTitle];

    const { data: existingColumns, error: selectError } = await supabase
      .from('board_columns')
      .select('id, title, position')
      .eq('project_id', projectId)
      .in('title', titleAliases)
      .order('position', { ascending: true });

    if (selectError) throw selectError;

    const exactColumn = (existingColumns || []).find(
      (item) => normalizeColumnTitleForDisplay(item.title) === cleanTitle && item.title === cleanTitle
    );
    const fallbackColumn = (existingColumns || [])[0] || null;
    const preferredColumn = exactColumn || fallbackColumn;

    if (preferredColumn?.id) {
      const { error: updateError } = await supabase
        .from('board_columns')
        .update(columnPayload)
        .eq('id', preferredColumn.id);

      if (updateError) throw updateError;

      const duplicateIds = (existingColumns || [])
        .filter((item) => item.id && item.id !== preferredColumn.id)
        .map((item) => item.id);

      if (duplicateIds.length > 0) {
        await supabase
          .from('board_columns')
          .update({ is_archived: true })
          .in('id', duplicateIds);
      }

      return preferredColumn.id;
    }

    const { data: createdColumn, error: insertError } = await supabase
      .from('board_columns')
      .insert(columnPayload)
      .select('id')
      .single();

    if (insertError) throw insertError;

    return createdColumn?.id || null;
  };

  const saveTaskToSupabase = async (taskData, targetStatus) => {
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
        updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null,
        task_order: typeof taskData?.taskOrder === 'number' ? taskData.taskOrder : ((targetColumn?.tasks || []).length || 0)
      };

      let savedTask = null;
      const existingSupabaseTaskId = getSupabaseTaskIdFromLocalTask(taskData) || getSupabaseTaskIdFromLocalTask(taskData.id);

      const shouldInsertTaskAtTop =
        !existingSupabaseTaskId &&
        taskData?.zrcInsertAtTop === true &&
        payload.task_order === 0 &&
        Boolean(columnId);

      if (shouldInsertTaskAtTop) {
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem('zrc-task-order-saving-until', String(Date.now() + 5000));
          } catch (error) {}
        }

        const { data: existingOrderTasks, error: existingOrderTasksError } = await supabase
          .from('tasks')
          .select('id, task_order, created_at')
          .eq('workspace_id', workspaceId)
          .eq('project_id', projectId)
          .eq('column_id', columnId)
          .eq('is_archived', false)
          .order('task_order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: true });

        if (existingOrderTasksError) throw existingOrderTasksError;

        await Promise.all(
          (existingOrderTasks || []).map((item, index) =>
            supabase
              .from('tasks')
              .update({
                task_order: index + 1,
                updated_at: new Date().toISOString()
              })
              .eq('id', item.id)
              .eq('workspace_id', workspaceId)
          )
        );
      }

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
  };


  const saveTaskToSupabaseForProject = async (projectName, taskData, targetStatus) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !projectName || !taskData?.title) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase görev kaydediliyor');

    try {
      const projectId = await ensureSupabaseProject(projectName);
      const projectBoard = projectBoards[projectName] || (projectName === selectedProject ? currentBoard : null) || createDefaultProjectBoard();
      const projectColumns = projectName === selectedProject ? boardColumns : (projectBoard.columns || createDefaultProjectBoard().columns || []);
      const targetColumn = projectColumns.find((column) => column.title === targetStatus) || projectColumns[0] || { title: targetStatus || 'Yeni Görev' };
      const targetColumnIndex = Math.max(0, projectColumns.findIndex((column) => column.title === targetColumn.title));
      const columnId = await ensureSupabaseColumn(projectId, targetColumn, targetColumnIndex);

      if (!projectId) return false;

      const payload = {
        workspace_id: workspaceId,
        project_id: projectId,
        column_id: columnId || null,
        customer_id: isSupabaseUuid(taskData.customerId) ? taskData.customerId : null,
        title: taskData.title || 'Adsız görev',
        description: getPlainTaskDescription(taskData.description || taskData.note),
        rich_description: typeof taskData.richDescription === 'object' && taskData.richDescription !== null ? taskData.richDescription : (typeof taskData.rich_description === 'object' && taskData.rich_description !== null ? taskData.rich_description : {}),
        priority: getSafeSupabasePriority(taskData.priority),
        status: targetStatus || targetColumn?.title || 'Yeni Görev',
        start_date: getSupabaseSafeDate(taskData.startDate),
        due_date: getSupabaseSafeDate(taskData.dueDate || taskData.endDate),
        end_date: getSupabaseSafeDate(taskData.endDate),
        tags: Array.isArray(taskData.tags) ? taskData.tags : [],
        is_archived: false,
        updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null,
        task_order: typeof taskData?.taskOrder === 'number' ? taskData.taskOrder : ((targetColumn?.tasks || []).length || 0)
      };

      if (taskData?.zrcInsertAtTop === true && payload.task_order === 0 && columnId) {
        const { data: existingOrderTasks, error: existingOrderTasksError } = await supabase
          .from('tasks')
          .select('id, task_order, created_at')
          .eq('workspace_id', workspaceId)
          .eq('project_id', projectId)
          .eq('column_id', columnId)
          .eq('is_archived', false)
          .order('task_order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: true });

        if (existingOrderTasksError) throw existingOrderTasksError;

        await Promise.all(
          (existingOrderTasks || []).map((item, index) =>
            supabase
              .from('tasks')
              .update({
                task_order: index + 1,
                updated_at: new Date().toISOString()
              })
              .eq('id', item.id)
              .eq('workspace_id', workspaceId)
          )
        );
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...payload,
          created_by: isSupabaseUuid(currentUserId) ? currentUserId : null
        })
        .select('id')
        .single();

      if (error) throw error;

      if (data?.id) {
        setProjectBoards((prevBoards) => {
          const existingBoard = prevBoards[projectName] || createDefaultProjectBoard();

          return {
            ...prevBoards,
            [projectName]: {
              ...existingBoard,
              columns: (existingBoard.columns || []).map((column) => ({
                ...column,
                tasks: (column.tasks || []).map((task) =>
                  task.id === taskData.id ? { ...task, supabaseId: data.id } : task
                )
              }))
            }
          };
        });

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

        const { error: deleteAssigneesError } = await supabase.from('task_assignees').delete().eq('task_id', data.id);
        if (deleteAssigneesError) throw deleteAssigneesError;

        const { error: deleteFollowersError } = await supabase.from('task_followers').delete().eq('task_id', data.id);
        if (deleteFollowersError) throw deleteFollowersError;

        if (assigneeIds.length > 0) {
          const { error: insertAssigneesError } = await supabase
            .from('task_assignees')
            .insert(assigneeIds.map((userId) => ({ task_id: data.id, user_id: userId })));

          if (insertAssigneesError) throw insertAssigneesError;
        }

        if (followerIds.length > 0) {
          const { error: insertFollowersError } = await supabase
            .from('task_followers')
            .insert(followerIds.map((userId) => ({ task_id: data.id, user_id: userId })));

          if (insertFollowersError) throw insertFollowersError;
        }
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase görev kaydedildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase görev hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const saveStageToSupabase = async (columnData) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !selectedProject || !columnData?.title) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase kolon kaydediliyor');

    try {
      const projectId = await ensureSupabaseProject(selectedProject);
      if (!projectId) return false;

      const columnPosition = Math.max(
        0,
        boardColumns.findIndex((column) => column.id === columnData.id || column.title === columnData.title)
      );

      const payload = {
        workspace_id: workspaceId,
        project_id: projectId,
        title: normalizeColumnTitleForDisplay(columnData.title || 'Yeni Görev'),
        description: columnData.desc || columnData.description || '',
        color: columnData.color || '#64748b',
        position: columnPosition >= 0 ? columnPosition : boardColumns.length,
        is_archived: false
      };

      if (isSupabaseUuid(columnData.id)) {
        const { error: updateError } = await supabase
          .from('board_columns')
          .update(payload)
          .eq('id', columnData.id);

        if (updateError) throw updateError;

        zrcSetSupabaseWriteInfo('saved', 'Supabase kolon güncellendi');
        return true;
      }

      const savedColumnId = await ensureSupabaseColumn(projectId, payload, payload.position);

      if (savedColumnId) {
        setBoardColumns((prevColumns) =>
          prevColumns.map((column) =>
            column.id === columnData.id || column.title === columnData.title
              ? { ...column, id: savedColumnId }
              : column
          )
        );
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase kolon kaydedildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase kolon hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };


  const updateSupabaseTaskColumn = async (task, targetColumn, taskOrder = null) => {
    if (!task?.supabaseId || !targetColumn?.title) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase görev durumu güncelleniyor');

    try {
      const projectId = await ensureSupabaseProject(selectedProject);
      const targetColumnIndex = Math.max(0, boardColumns.findIndex((column) => column.id === targetColumn.id || column.title === targetColumn.title));
      const columnId = await ensureSupabaseColumn(projectId, targetColumn, targetColumnIndex);

      const updatePayload = {
        column_id: columnId || null,
        status: targetColumn.title,
        is_archived: false,
        updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null
      };

      if (typeof taskOrder === 'number' && Number.isFinite(taskOrder)) {
        updatePayload.task_order = taskOrder;
      }

      const { error } = await supabase
        .from('tasks')
        .update(updatePayload)
        .eq('id', task.supabaseId);

      if (error) throw error;

      zrcSetSupabaseWriteInfo('saved', 'Supabase görev durumu kaydedildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase durum hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const archiveSupabaseTask = async (task) => {
    zrcMarkOptimisticHiddenTask(task, 9000);

    if (!task?.supabaseId) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase görev arşivleniyor');

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          is_archived: true,
          archived_at: new Date().toISOString(),
          updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null,
        task_order: typeof taskData?.taskOrder === 'number' ? taskData.taskOrder : ((targetColumn?.tasks || []).length || 0)
        })
        .eq('id', task.supabaseId);

      if (error) throw error;

      zrcSetSupabaseWriteInfo('saved', 'Supabase görev arşivlendi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase arşiv hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const restoreSupabaseTask = async (task, targetColumn) => {
    if (!task?.supabaseId) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase görev geri getiriliyor');

    try {
      const projectId = await ensureSupabaseProject(selectedProject);
      const targetColumnIndex = Math.max(0, boardColumns.findIndex((column) => column.id === targetColumn?.id || column.title === targetColumn?.title));
      const columnId = await ensureSupabaseColumn(projectId, targetColumn || boardColumns[0], targetColumnIndex);

      const { error } = await supabase
        .from('tasks')
        .update({
          column_id: columnId || null,
          status: targetColumn?.title || 'Yeni Görev',
          is_archived: false,
          archived_at: null,
          updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null,
        task_order: typeof taskData?.taskOrder === 'number' ? taskData.taskOrder : ((targetColumn?.tasks || []).length || 0)
        })
        .eq('id', task.supabaseId);

      if (error) throw error;

      zrcSetSupabaseWriteInfo('saved', 'Supabase görev geri getirildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase geri getirme hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const deleteSupabaseTask = async (task) => {
    zrcMarkOptimisticHiddenTask(task, 9000);

    if (!task?.supabaseId) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase görev siliniyor');

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.supabaseId);

      if (error) throw error;

      zrcSetSupabaseWriteInfo('saved', 'Supabase görev silindi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase silme hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const getSupabaseTaskIdFromLocalTask = (taskOrId) => {
    const rawId = typeof taskOrId === 'string' ? taskOrId : taskOrId?.id || '';
    const directSupabaseId = typeof taskOrId === 'object' ? taskOrId?.supabaseId : '';

    if (isSupabaseUuid(directSupabaseId)) return directSupabaseId;

    if (String(rawId).startsWith('supabase-')) {
      const possibleId = String(rawId).replace('supabase-', '');
      return isSupabaseUuid(possibleId) ? possibleId : '';
    }

    const detailTask = detailTaskInfo?.task?.id === rawId ? detailTaskInfo.task : null;
    if (isSupabaseUuid(detailTask?.supabaseId)) return detailTask.supabaseId;

    const reportTask = reportTasks.find((task) => task.id === rawId);
    if (isSupabaseUuid(reportTask?.supabaseId)) return reportTask.supabaseId;

    return '';
  };

  const getTaskProjectIdForSupabaseDetail = async (taskSupabaseId) => {
    if (!taskSupabaseId) return null;

    const { data, error } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('id', taskSupabaseId)
      .maybeSingle();

    if (error) throw error;

    return data?.project_id || null;
  };


  const mapSupabaseCommentToLocalComment = (comment = {}) => {
    const parts = formatSupabaseDateTimeParts(comment.created_at);

    return {
      id: `supabase-comment-${comment.id}`,
      supabaseId: comment.id,
      author: comment.author_id === currentUserId ? currentProfileName : 'Kullanıcı',
      avatar: comment.author_id === currentUserId ? currentProfileAvatar : createAvatarFromName('Kullanıcı'),
      userId: comment.author_id || '',
      text: comment.body || '',
      createdAt: comment.created_at || '',
      date: parts.date,
      time: parts.time
    };
  };


  const mapSupabaseFileToLocalFile = (file = {}) => {
    const parts = formatSupabaseDateTimeParts(file.created_at);

    return {
      id: `supabase-file-${file.id}`,
      supabaseId: file.id,
      name: file.file_name || 'Dosya',
      type: file.file_type || 'Dosya',
      size: Number(file.size_bytes || 0),
      bucket: file.bucket || 'project-files',
      storagePath: file.storage_path || '',
      notes: file.note || '',
      uploader: file.uploaded_by === currentUserId ? currentProfileName : 'Kullanıcı',
      avatar: file.uploaded_by === currentUserId ? currentProfileAvatar : createAvatarFromName('Kullanıcı'),
      userId: file.uploaded_by || '',
      date: parts.date,
      time: parts.time
    };
  };

  const syncTaskDetailsToSupabase = async (taskId, updates = {}, options = {}) => {
    const taskSupabaseId = getSupabaseTaskIdFromLocalTask({ id: taskId, supabaseId: updates.supabaseId });

    if (!taskSupabaseId || !getCurrentSupabaseWorkspaceId()) return false;

    const shouldSyncDescription = options.syncDescription === true && Object.prototype.hasOwnProperty.call(updates, 'description');
    const shouldSyncComments = Array.isArray(updates.comments);
    const shouldSyncSteps = Array.isArray(updates.steps);
    const shouldSyncFiles = Array.isArray(updates.files);

    if (!shouldSyncDescription && !shouldSyncComments && !shouldSyncSteps && !shouldSyncFiles) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase görev detayı kaydediliyor');

    try {
      const workspaceId = getCurrentSupabaseWorkspaceId();

      if (shouldSyncDescription) {
        const { error: descriptionError } = await supabase
          .from('tasks')
          .update({
            description: updates.description || '',
            updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null,
        task_order: typeof taskData?.taskOrder === 'number' ? taskData.taskOrder : ((targetColumn?.tasks || []).length || 0)
          })
          .eq('id', taskSupabaseId);

        if (descriptionError) throw descriptionError;
      }

      if (shouldSyncComments) {
        await supabase.from('task_comments').delete().eq('task_id', taskSupabaseId);

        const commentsPayload = (updates.comments || [])
          .map((comment) => ({
            workspace_id: workspaceId,
            task_id: taskSupabaseId,
            author_id: isSupabaseUuid(comment.userId) ? comment.userId : isSupabaseUuid(currentUserId) ? currentUserId : null,
            body: String(comment.text || '').trim(),
            created_at: comment.createdAt || new Date().toISOString()
          }))
          .filter((comment) => comment.body);

        if (commentsPayload.length > 0) {
          const { error: commentsError } = await supabase
            .from('task_comments')
            .insert(commentsPayload);

          if (commentsError) throw commentsError;
        }
      }

      if (shouldSyncSteps) {
        await supabase.from('task_steps').delete().eq('task_id', taskSupabaseId);

        const stepsPayload = (updates.steps || [])
          .map((step, index) => ({
            workspace_id: workspaceId,
            task_id: taskSupabaseId,
            text: String(step.text || '').trim(),
            is_completed: step.completed === true,
            position: index,
            created_by: isSupabaseUuid(currentUserId) ? currentUserId : null
          }))
          .filter((step) => step.text);

        if (stepsPayload.length > 0) {
          const { error: stepsError } = await supabase
            .from('task_steps')
            .insert(stepsPayload);

          if (stepsError) throw stepsError;
        }
      }

      if (shouldSyncFiles) {
        const projectId = await getTaskProjectIdForSupabaseDetail(taskSupabaseId);

        await supabase.from('files').delete().eq('task_id', taskSupabaseId);

        const filesPayload = (updates.files || [])
          .map((file) => ({
            workspace_id: workspaceId,
            project_id: projectId,
            task_id: taskSupabaseId,
            uploaded_by: isSupabaseUuid(file.userId) ? file.userId : isSupabaseUuid(currentUserId) ? currentUserId : null,
            bucket: file.bucket || 'project-files',
            storage_path: file.storagePath || null,
            file_name: String(file.name || 'Dosya').trim(),
            file_type: file.type || 'Dosya',
            size_bytes: Number(file.size || 0),
            note: file.notes || ''
          }))
          .filter((file) => file.file_name);

        if (filesPayload.length > 0) {
          const { error: filesError } = await supabase
            .from('files')
            .insert(filesPayload);

          if (filesError) throw filesError;
        }
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase görev detayı kaydedildi');

      // zrc-v410b-task-detail-safe-refresh
      window.setTimeout(() => {
        loadSelectedProjectBoardFromSupabase();
      }, 900);
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase detay hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };



  const uploadTaskFilesToSupabase = async (task, selectedFiles = [], getFileTypeLabel = getSupabaseFileTypeLabel) => {
    const taskSupabaseId = getSupabaseTaskIdFromLocalTask(task);
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !taskSupabaseId || !selectedFiles.length) {
      zrcSetSupabaseWriteInfo('error', 'Supabase dosya için önce görev kaydı gerekli');
      return [];
    }

    zrcSetSupabaseWriteInfo('saving', 'Supabase dosya yükleniyor');

    const now = new Date();
    const uploadedFiles = [];

    try {
      for (const file of selectedFiles) {
        const safeFileName = sanitizeStorageFileName(file.name);
        const storagePath = `${workspaceId}/tasks/${taskSupabaseId}/${Date.now()}-${Math.random().toString(16).slice(2)}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || undefined
          });

        if (uploadError) throw uploadError;

        uploadedFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: file.name,
          type: getFileTypeLabel(file.name),
          size: file.size,
          bucket: 'project-files',
          storagePath,
          uploader: currentProfileName,
          avatar: currentProfileAvatar,
          userId: currentActorId,
          date: `${now.getDate()} ${now.toLocaleString('tr-TR', { month: 'long' })} ${now.getFullYear()}`,
          time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        });
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase dosya yüklendi');
      return uploadedFiles;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase dosya yükleme hatası: ${error?.message || 'bilinmeyen hata'}`);
      return [];
    }
  };

  const downloadTaskFileFromSupabase = async (file) => {
    if (!file?.storagePath) {
      await window.zrcAlert('Bu dosyanın Supabase yükleme yolu bulunamadı. Eski metadata kaydı olabilir.');
      return;
    }

    zrcSetSupabaseWriteInfo('saving', 'Supabase dosya indiriliyor');

    try {
      const { data, error } = await supabase.storage
        .from(file.bucket || 'project-files')
        .download(file.storagePath);

      if (error) throw error;

      const objectUrl = window.URL.createObjectURL(data);
      const link = document.createElement('a');

      link.href = objectUrl;
      link.download = file.name || 'dosya';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(objectUrl);
      zrcSetSupabaseWriteInfo('saved', 'Supabase dosya indirildi');
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase dosya indirme hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
  };

  const deleteTaskStoredFileFromSupabase = async (file) => {
    if (!file?.storagePath) return false;

    try {
      const { error } = await supabase.storage
        .from(file.bucket || 'project-files')
        .remove([file.storagePath]);

      if (error) throw error;

      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase dosya silme hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const getSupabaseCustomerId = (customerOrId = '') => {
    if (typeof customerOrId === 'object') {
      if (isSupabaseUuid(customerOrId.supabaseId)) return customerOrId.supabaseId;
      if (isSupabaseUuid(customerOrId.id)) return customerOrId.id;
      return '';
    }

    if (isSupabaseUuid(customerOrId)) return customerOrId;

    const matchedCustomer = customers.find((customer) => customer.id === customerOrId || customer.name === customerOrId);

    if (isSupabaseUuid(matchedCustomer?.supabaseId)) return matchedCustomer.supabaseId;
    if (isSupabaseUuid(matchedCustomer?.id)) return matchedCustomer.id;

    return '';
  };


  const mergeSupabaseCustomersIntoLocalState = (dbCustomers = []) => {
    if (!Array.isArray(dbCustomers)) return;

    const deletedCustomerMarkers = getDeletedCustomerMarkers();
    const mappedCustomers = dbCustomers
      .map(mapSupabaseCustomerToLocal)
      .filter((customer) => !isLegacyDemoCustomerRecord(customer))
      .filter((customer) => !isCustomerMarkedDeleted(customer, deletedCustomerMarkers));

    setCustomers(mappedCustomers);
  };

  const replaceLocalCustomerIdWithSupabaseId = (localCustomerId, dbCustomerId) => {
    if (!localCustomerId || !dbCustomerId || localCustomerId === dbCustomerId) return;

    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === localCustomerId
          ? { ...customer, id: dbCustomerId, supabaseId: dbCustomerId }
          : customer
      )
    );

    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.customerId === localCustomerId ? { ...member, customerId: dbCustomerId } : member
      )
    );

    setProjectSettings((prevSettings) =>
      Object.fromEntries(
        Object.entries(prevSettings).map(([projectName, settings]) => [
          projectName,
          settings.customerId === localCustomerId ? { ...settings, customerId: dbCustomerId } : settings
        ])
      )
    );

    setBoardColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: (column.tasks || []).map((task) =>
          task.customerId === localCustomerId ? { ...task, customerId: dbCustomerId } : task
        )
      }))
    );

    setArchivedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.customerId === localCustomerId ? { ...task, customerId: dbCustomerId } : task
      )
    );

    setSelectedCustomerId((prevSelectedCustomerId) =>
      prevSelectedCustomerId === localCustomerId ? dbCustomerId : prevSelectedCustomerId
    );
  };

  const saveCustomerToSupabase = async (customer = {}) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();
    const cleanName = String(customer.name || '').trim();

    if (!workspaceId || !cleanName) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase müşteri kaydediliyor');

    try {
      const payload = {
        workspace_id: workspaceId,
        name: cleanName,
        contact_name: customer.contact || '',
        email: customer.email || '',
        phone: customer.phone || '',
        note: customer.note || '',
        status: customer.status === 'Pasif' ? 'Pasif' : 'Aktif',
        account_user_id: isSupabaseUuid(customer.accountUserId) ? customer.accountUserId : null,
        created_by: isSupabaseUuid(currentUserId) ? currentUserId : null
      };

      let savedCustomer = null;
      const customerId = getSupabaseCustomerId(customer);

      if (customerId) {
        const { data, error } = await supabase
          .from('customers')
          .update(payload)
          .eq('id', customerId)
          .select('id, name, contact_name, email, phone, note, status, account_user_id')
          .single();

        if (error) throw error;
        savedCustomer = data;
      } else {
        const { data, error } = await supabase
          .from('customers')
          .insert(payload)
          .select('id, name, contact_name, email, phone, note, status, account_user_id')
          .single();

        if (error) throw error;
        savedCustomer = data;
      }

      if (savedCustomer?.id) {
        replaceLocalCustomerIdWithSupabaseId(customer.id, savedCustomer.id);
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase müşteri kaydedildi');
      return savedCustomer || true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase müşteri hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const updateCustomerStatusInSupabase = async (customer = {}, nextStatus = 'Aktif') => {
    const customerId = getSupabaseCustomerId(customer);

    if (!customerId) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase müşteri durumu kaydediliyor');

    try {
      const { error } = await supabase
        .from('customers')
        .update({ status: nextStatus === 'Pasif' ? 'Pasif' : 'Aktif' })
        .eq('id', customerId);

      if (error) throw error;

      zrcSetSupabaseWriteInfo('saved', 'Supabase müşteri durumu kaydedildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase müşteri durum hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const deleteCustomerFromSupabase = async (customer = {}) => {
    const customerId = getSupabaseCustomerId(customer);

    if (!customerId) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase müşteri siliniyor');

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;

      zrcSetSupabaseWriteInfo('saved', 'Supabase müşteri silindi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase müşteri silme hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };


  const mergeSupabaseWorkspaceMembersIntoLocalState = (dbMembers = []) => {
    if (!Array.isArray(dbMembers) || dbMembers.length === 0) return;

    const mappedMembers = dbMembers.map(mapSupabaseWorkspaceMemberToLocal);
    const dbUserIds = new Set(mappedMembers.map((member) => member.id).filter(Boolean));

    setTeamMembers((prevMembers) => {
      const localOnlyMembers = (prevMembers || [])
        .filter((member) => !dbUserIds.has(member.id))
        .filter((member) => !isLegacyDemoTeamMemberRecord(member));

      return [...mappedMembers, ...localOnlyMembers];
    });
  };

  const saveProjectSettingsToSupabase = async (projectName, settings = {}, previousProjectName = '') => {
    const workspaceId = getCurrentSupabaseWorkspaceId();
    const cleanProjectName = String(projectName || '').trim();

    if (!workspaceId || !cleanProjectName) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase proje ayarları kaydediliyor');

    try {
      const customerId = getSupabaseCustomerId(settings.customerId || settings.customer);
      let projectId = null;

      if (previousProjectName) {
        const { data: previousProject, error: previousProjectError } = await supabase
          .from('projects')
          .select('id')
          .eq('workspace_id', workspaceId)
          .eq('name', previousProjectName)
          .maybeSingle();

        if (previousProjectError) throw previousProjectError;
        projectId = previousProject?.id || null;
      }

      if (!projectId) {
        const { data: existingProject, error: existingProjectError } = await supabase
          .from('projects')
          .select('id')
          .eq('workspace_id', workspaceId)
          .eq('name', cleanProjectName)
          .maybeSingle();

        if (existingProjectError) throw existingProjectError;
        projectId = existingProject?.id || null;
      }

      const projectPayload = {
        workspace_id: workspaceId,
        name: cleanProjectName,
        description: settings.description || '',
        customer_id: customerId || null,
        status: ['Aktif', 'Arşiv', 'Pasif'].includes(settings.status) ? settings.status : 'Aktif',
        color: settings.color || '#ff3600',
        created_by: isSupabaseUuid(currentUserId) ? currentUserId : null
      };

      let savedProject = null;

      if (projectId) {
        const { data, error } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', projectId)
          .select('id')
          .single();

        if (error) throw error;
        savedProject = data;
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert(projectPayload)
          .select('id')
          .single();

        if (error) throw error;
        savedProject = data;
      }

      const savedProjectId = savedProject?.id || projectId;

      if (savedProjectId) {
        await supabase.from('project_members').delete().eq('project_id', savedProjectId);
        await supabase.from('project_customers').delete().eq('project_id', savedProjectId);

        const memberIds = Array.from(
          new Set(
            (Array.isArray(settings.teamMemberIds) ? settings.teamMemberIds : [])
              .map(String)
              .filter(isSupabaseUuid)
          )
        );

        if (memberIds.length > 0) {
          const { data: workspaceMemberRows, error: workspaceMemberCheckError } = await supabase
            .from('workspace_members')
            .select('user_id')
            .eq('workspace_id', workspaceId)
            .eq('status', 'Aktif')
            .in('user_id', memberIds);

          if (workspaceMemberCheckError) throw workspaceMemberCheckError;

          const activeWorkspaceMemberIds = new Set(
            (workspaceMemberRows || [])
              .map((member) => String(member.user_id || ''))
              .filter(isSupabaseUuid)
          );

          const cleanMemberIds = memberIds.filter((memberId) => activeWorkspaceMemberIds.has(memberId));

          if (cleanMemberIds.length > 0) {
            const { error: membersError } = await supabase
              .from('project_members')
              .insert(
                cleanMemberIds.map((userId) => ({
                  workspace_id: workspaceId,
                  project_id: savedProjectId,
                  user_id: userId,
                  role: 'Üye'
                }))
              );

            if (membersError) throw membersError;
          }
        }

        if (customerId) {
          const { error: customerLinkError } = await supabase
            .from('project_customers')
            .insert({
              workspace_id: workspaceId,
              project_id: savedProjectId,
              customer_id: customerId
            });

          if (customerLinkError) throw customerLinkError;
        }
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase proje ayarları kaydedildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase proje ayar hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const updateProjectStatusInSupabase = async (projectName = selectedProject, status = 'Aktif') => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !projectName) return false;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('workspace_id', workspaceId)
        .eq('name', projectName);

      if (error) throw error;
      zrcSetSupabaseWriteInfo('saved', 'Supabase proje durumu kaydedildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase proje durum hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const deleteProjectFromSupabase = async (projectName = selectedProject) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();
    const cleanProjectName = String(projectName || '').trim();

    if (!workspaceId || !cleanProjectName) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase proje siliniyor');

    try {
      const { data: projectsToDelete, error: projectSelectError } = await supabase
        .from('projects')
        .select('id')
        .eq('workspace_id', workspaceId)
        .eq('name', cleanProjectName);

      if (projectSelectError) throw projectSelectError;

      const projectIds = (projectsToDelete || []).map((project) => project.id).filter(isSupabaseUuid);

      if (projectIds.length === 0) {
        zrcSetSupabaseWriteInfo('saved', 'Supabase proje zaten yok');
        return true;
      }

      const { data: projectTasks, error: taskSelectError } = await supabase
        .from('tasks')
        .select('id')
        .in('project_id', projectIds);

      if (taskSelectError) throw taskSelectError;

      const taskIds = (projectTasks || []).map((task) => task.id).filter(isSupabaseUuid);

      if (taskIds.length > 0) {
        await supabase.from('task_assignees').delete().in('task_id', taskIds);
        await supabase.from('task_followers').delete().in('task_id', taskIds);
        await supabase.from('task_comments').delete().in('task_id', taskIds);
        await supabase.from('task_steps').delete().in('task_id', taskIds);
        await supabase.from('files').delete().in('task_id', taskIds);
        await supabase.from('tasks').delete().in('id', taskIds);
      }

      await supabase.from('board_columns').delete().in('project_id', projectIds);
      await supabase.from('project_members').delete().in('project_id', projectIds);
      await supabase.from('project_customers').delete().in('project_id', projectIds);

      const { error: projectDeleteError } = await supabase
        .from('projects')
        .delete()
        .in('id', projectIds);

      if (projectDeleteError) throw projectDeleteError;

      zrcSetSupabaseWriteInfo('saved', 'Supabase proje silindi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase proje silme hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };


  const createSupabaseProjectWithDefaultColumns = async (projectName = '') => {
    const cleanProjectName = String(projectName || '').trim();

    if (!cleanProjectName || !getCurrentSupabaseWorkspaceId()) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase proje oluşturuluyor');

    try {
      await saveProjectSettingsToSupabase(
        cleanProjectName,
        projectSettings[cleanProjectName] || createDefaultProjectSettings(cleanProjectName),
        cleanProjectName
      );

      const projectId = await ensureSupabaseProject(cleanProjectName);

      if (projectId) {
        for (const [columnIndex, column] of defaultBoardColumns.entries()) {
          await ensureSupabaseColumn(projectId, column, columnIndex);
        }
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase proje oluşturuldu');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase proje oluşturma hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const syncProjectListChangeToSupabase = (previousProjects = [], nextProjects = []) => {
    if (currentAccountType !== 'Patron') return;

    const previousProjectNames = normalizeProjectNameList(previousProjects);
    const nextProjectNames = normalizeProjectNameList(nextProjects);

    const addedProjects = nextProjectNames.filter((projectName) => !previousProjectNames.includes(projectName));
    const removedProjects = previousProjectNames.filter((projectName) => !nextProjectNames.includes(projectName));

    if (addedProjects.length === 0 && removedProjects.length === 0) return;

    addedProjects.forEach((projectName) => {
      createSupabaseProjectWithDefaultColumns(projectName);
    });

    removedProjects.forEach((projectName) => {
      deleteProjectFromSupabase(projectName);
    });
  };

  const handleSidebarProjectsChange = (updater) => {
    setProjects((prevProjects) => {
      const previousProjectNames = normalizeProjectNameList(prevProjects);
      const rawNextProjects = typeof updater === 'function' ? updater(previousProjectNames) : updater;
      const nextProjectNames = normalizeProjectNameList(rawNextProjects);
      const addedProjectNames = nextProjectNames.filter((projectName) => !previousProjectNames.includes(projectName));

      if (addedProjectNames.length > 0) {
        setProjectSettings((prevSettings) => {
          const nextSettings = { ...prevSettings };

          addedProjectNames.forEach((projectName) => {
            const baseSettings = {
              ...createDefaultProjectSettings(projectName),
              ...(nextSettings[projectName] || {}),
              title: nextSettings[projectName]?.title || projectName
            };

            const ownerTeamMemberIds =
              currentAccountType === 'Ekip Üyesi' && currentUserId
                ? [currentUserId]
                : (Array.isArray(baseSettings.teamMemberIds) ? baseSettings.teamMemberIds : []);

            nextSettings[projectName] = {
              ...baseSettings,
              teamMemberIds: Array.from(new Set(ownerTeamMemberIds)),
              ownerId: currentUserId || baseSettings.ownerId || '',
              createdById: currentUserId || baseSettings.createdById || ''
            };
          });

          return nextSettings;
        });
      }

      window.setTimeout(() => {
        syncProjectListChangeToSupabase(previousProjectNames, nextProjectNames);
      }, 0);

      return nextProjectNames;
    });
  };

  const loadWorkspaceStructureFromSupabase = async () => {
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
  };

  useEffect(() => {
    loadWorkspaceStructureFromSupabase();
  }, [supabaseWorkspaceId, currentUserId, authSessionLoading]);


  const getSupabaseProjectIdForName = async (projectName = selectedProject, createIfMissing = false) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();
    const cleanProjectName = String(projectName || '').trim();

    if (!workspaceId || !cleanProjectName) return null;

    const { data: existingProject, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('name', cleanProjectName)
      .maybeSingle();

    if (projectError) throw projectError;
    if (existingProject?.id) return existingProject.id;

    if (!createIfMissing) return null;

    return ensureSupabaseProject(cleanProjectName);
  };

  const saveUserPreferencesToSupabase = async (preferencesPatch = {}) => {
    if (!supabase || !supabaseWorkspaceId) return false;

    const workspaceId = getCurrentSupabaseWorkspaceId();
    const cleanUserId = String(currentUserId || '').trim();

    if (!isSupabaseUuid(workspaceId) || !isSupabaseUuid(cleanUserId)) {
      return false;
    }

    try {
      const nowIso = new Date().toISOString();

      const { data: existingRecord, error: existingError } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('workspace_id', workspaceId)
        .eq('user_id', cleanUserId)
        .maybeSingle();

      if (existingError) throw existingError;

      const existingPreferences = normalizeStorageObject(existingRecord?.preferences, {});

      const safeProfileDraft = {
        ...(existingPreferences.profileDraft || {}),
        ...(profileDraft || {}),
        ...(normalizeStorageObject(preferencesPatch.profileDraft || {}, {})),
        currentPassword: '',
        newPassword: '',
        repeatPassword: ''
      };

      const nextProfilePreferences = {
        ...(existingPreferences.profilePreferences || {}),
        ...(profilePreferences || {}),
        ...(normalizeStorageObject(preferencesPatch.profilePreferences || {}, {}))
      };

      const nextReadNotificationIds = Array.from(
        new Set([
          ...normalizeStorageArray(existingPreferences.readNotificationIds || [], []),
          ...normalizeStorageArray(readNotificationIds || [], []),
          ...normalizeStorageArray(preferencesPatch.readNotificationIds || [], [])
        ])
      );

      const nextReadMessageIds = Array.from(
        new Set([
          ...normalizeStorageArray(existingPreferences.readMessageIds || [], []),
          ...normalizeStorageArray(readMessageIds || [], []),
          ...normalizeStorageArray(preferencesPatch.readMessageIds || [], [])
        ])
      );

      const nextPreferences = {
        ...existingPreferences,
        ...preferencesPatch,
        profileDraft: safeProfileDraft,
        profilePreferences: nextProfilePreferences,
        readNotificationIds: nextReadNotificationIds,
        readMessageIds: nextReadMessageIds,
        updatedAt: nowIso
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          {
            workspace_id: workspaceId,
            user_id: cleanUserId,
            preferences: nextPreferences,
            updated_at: nowIso
          },
          {
            onConflict: 'workspace_id,user_id'
          }
        );

      if (error) throw error;

      // zrc-v412-user-preferences-merge
      const shouldAnnouncePreferenceSave = Boolean(
        preferencesPatch.profileDraft ||
        preferencesPatch.profilePreferences
      );

      if (shouldAnnouncePreferenceSave) {
        zrcSetSupabaseWriteInfo('saved', 'Supabase tercih kaydedildi');
      }

      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase tercih hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const loadProfileAndPreferencesFromSupabase = async () => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !isSupabaseUuid(currentUserId) || authSessionLoading) return;

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name, email, avatar_url, phone, title, status')
        .eq('id', currentUserId)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profile) {
        const nameParts = String(profile.display_name || '').trim().split(' ').filter(Boolean);
        const firstName = nameParts[0] || profile.display_name || 'Kullanıcı';
        const lastName = nameParts.slice(1).join(' ');

        setProfileDraft((prevDraft) => ({
          ...prevDraft,
          firstName,
          lastName,
          title: profile.title || prevDraft.title || '',
          email: profile.email || prevDraft.email || '',
          avatarDataUrl: profile.avatar_url || prevDraft.avatarDataUrl || ''
        }));

        setTeamMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === currentUserId
              ? {
                  ...member,
                  name: profile.display_name || member.name,
                  email: profile.email || member.email,
                  avatar: profile.avatar_url || member.avatar,
                  status: profile.status || member.status
                }
              : member
          )
        );
      }

      const { data: preferencesRecord, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', currentUserId)
        .maybeSingle();

      if (preferencesError) throw preferencesError;

      const preferences = preferencesRecord?.preferences || {};

      if (preferences.profileDraft && typeof preferences.profileDraft === 'object') {
        setProfileDraft((prevDraft) => ({
          ...prevDraft,
          ...preferences.profileDraft
        }));
      }

      if (preferences.profilePreferences && typeof preferences.profilePreferences === 'object') {
        setProfilePreferences((prevPreferences) => ({
          ...prevPreferences,
          ...preferences.profilePreferences
        }));
      }

      if (Array.isArray(preferences.readNotificationIds)) {
        setReadNotificationIds((prevIds) => Array.from(new Set([...prevIds, ...preferences.readNotificationIds])));
      }

      if (Array.isArray(preferences.readMessageIds)) {
        setReadMessageIds((prevIds) => Array.from(new Set([...prevIds, ...preferences.readMessageIds])));
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase profil/tercih yüklendi');
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase profil okuma hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
  };

  // zrc-profile-settings-safe-api-client-v325


  const saveProfileSettingsWithSafeApi = async ({
    profileDraft: nextProfileDraft = profileDraft,
    profilePreferences: nextProfilePreferences = profilePreferences
  } = {}) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !isSupabaseUuid(currentUserId)) {
      return {
        ok: false,
        fallback: true,
        reason: 'workspace-or-user-missing'
      };
    }

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        return {
          ok: false,
          fallback: true,
          reason: 'session-token-missing'
        };
      }

      const response = await fetch('/api/profile-settings-safe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          action: 'save-profile',
          workspaceId,
          profileDraft: sanitizeProfileDraftForSafeApi(nextProfileDraft),
          profilePreferences: sanitizeProfilePreferencesForSafeApi(nextProfilePreferences)
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = payload?.error || 'Profil güvenli API kaydı başarısız.';

        if (response.status === 401 || response.status === 403) {
          return {
            ok: false,
            blocked: true,
            message
          };
        }

        return {
          ok: false,
          fallback: true,
          message
        };
      }

      return {
        ok: true,
        payload
      };
    } catch (error) {
      return {
        ok: false,
        fallback: true,
        message: error?.message || 'Güvenli API kullanılamadı'
      };
    }
  };

  const saveProfileToSupabase = async (nextProfileDraft = profileDraft, nextPreferences = profilePreferences) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !isSupabaseUuid(currentUserId)) return false;

    // zrc-v325-safe-api-first-profile-save
    const safeApiResult = await saveProfileSettingsWithSafeApi({
      profileDraft: nextProfileDraft,
      profilePreferences: nextPreferences
    });

    if (safeApiResult?.ok) {
      zrcSetSupabaseWriteInfo('saved', 'Profil güvenli API ile kaydedildi');
      return true;
    }

    if (safeApiResult?.blocked) {
      zrcSetSupabaseWriteInfo('error', safeApiResult.message || 'Bu profil ayarı için yetkin yok');
      await window.zrcAlert(safeApiResult.message || 'Bu profil ayarı için yetkin yok.');
      return false;
    }

    zrcSetSupabaseWriteInfo('saving', 'Supabase profil kaydediliyor');

    try {
      const displayName = `${nextProfileDraft.firstName || ''} ${nextProfileDraft.lastName || ''}`.trim() || currentProfileName || 'Kullanıcı';

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          email: nextProfileDraft.email || '',
          avatar_url: nextProfileDraft.avatarDataUrl || null,
          title: nextProfileDraft.title || '',
          status: 'Aktif'
        })
        .eq('id', currentUserId);

      if (profileError) throw profileError;

      await saveUserPreferencesToSupabase({
        profileDraft: nextProfileDraft,
        profilePreferences: nextPreferences
      });

      zrcSetSupabaseWriteInfo('saved', 'Supabase profil kaydedildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase profil hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };


  const saveQuickNoteToSupabase = async (note = {}) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !isSupabaseUuid(currentUserId) || !String(note.text || '').trim()) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase not kaydediliyor');

    try {
      const { data, error } = await supabase
        .from('quick_notes')
        .insert({
          workspace_id: workspaceId,
          user_id: currentUserId,
          text: String(note.text || '').trim()
        })
        .select('id')
        .single();

      if (error) throw error;

      if (data?.id) {
        setQuickNotes((prevNotes) =>
          prevNotes.map((item) =>
            item.id === note.id ? { ...item, supabaseId: data.id, id: `supabase-note-${data.id}` } : item
          )
        );
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase not kaydedildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase not hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const updateQuickNoteInSupabase = async (note = {}) => {
    const noteId = note?.supabaseId || (String(note?.id || '').startsWith('supabase-note-') ? String(note.id).replace('supabase-note-', '') : '');

    if (!isSupabaseUuid(noteId) || !String(note.text || '').trim()) return false;

    try {
      const { error } = await supabase
        .from('quick_notes')
        .update({
          text: String(note.text || '').trim()
        })
        .eq('id', noteId);

      if (error) throw error;

      zrcSetSupabaseWriteInfo('saved', 'Supabase not güncellendi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase not güncelleme hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const deleteQuickNoteFromSupabase = async (note = {}) => {
    const noteId = note?.supabaseId || (String(note?.id || '').startsWith('supabase-note-') ? String(note.id).replace('supabase-note-', '') : '');

    if (!isSupabaseUuid(noteId)) return false;

    try {
      const { error } = await supabase
        .from('quick_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      zrcSetSupabaseWriteInfo('saved', 'Supabase not silindi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase not silme hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const loadQuickNotesFromSupabase = async () => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !isSupabaseUuid(currentUserId) || authSessionLoading) return;

    try {
      const { data, error } = await supabase
        .from('quick_notes')
        .select('id, text, created_at')
        .eq('workspace_id', workspaceId)
        .eq('user_id', currentUserId)
        .neq('type', 'push_subscription')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedNotes = (data || []).map(mapSupabaseQuickNoteToLocal);

      setQuickNotes((prevNotes) =>
        mergeUniqueByKey(prevNotes, mappedNotes, (note) => note.supabaseId || note.id)
      );
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase not okuma hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
  };

  const saveActivityNotificationToSupabase = async (notification = {}) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !isSupabaseUuid(currentUserId)) return false;

    try {
      const projectId = notification.projectName
        ? await getSupabaseProjectIdForName(notification.projectName, false)
        : null;
      const taskId = getSupabaseTaskIdFromLocalTask(notification.task || notification.taskId || '');

      const payload = {
        meta: notification.meta || '',
        text: notification.text || '',
        projectName: notification.projectName || '',
        columnTitle: notification.columnTitle || '',
        chatGroupId: notification.chatGroupId || '',
        messageId: notification.messageId || '',
        localId: notification.id || '',
        targetUserIds: Array.isArray(notification.targetUserIds) ? notification.targetUserIds : []
      };

      await supabase
        .from('activity_logs')
        .insert({
          workspace_id: workspaceId,
          project_id: projectId || null,
          task_id: taskId || null,
          actor_id: isSupabaseUuid(currentUserId) ? currentUserId : null,
          type: notification.type || 'activity',
          title: notification.title || 'Aktivite',
          description: notification.text || notification.meta || '',
          payload
        });

      const targetUserIds = Array.from(
        new Set(
          [
            ...(Array.isArray(notification.targetUserIds) ? notification.targetUserIds : []),
            ...(Array.isArray(notification.recipientUserIds) ? notification.recipientUserIds : [])
          ]
            .map((value) => String(value || '').trim())
            .filter(isSupabaseUuid)
        )
      );

      // zrc-v424-self-notification-dup-fix
      // Kendi yaptığın işlem için ayrıca Supabase notifications satırı oluşturma.
      // Aktivite kaydı activity_logs tarafında zaten tutuluyor; aksi halde bildirim sayısı +2 artıyor.
      const finalUserIds = targetUserIds.filter(
        (userId) => String(userId || '').trim() !== String(currentUserId || '').trim()
      );

      if (finalUserIds.length > 0) {
        const notificationRows = finalUserIds.map((userId) => ({
          workspace_id: workspaceId,
          user_id: userId,
          project_id: projectId || null,
          task_id: taskId || null,
          type: notification.type || 'activity',
          title: notification.title || 'Bildirim',
          body: notification.meta ? `${notification.text || 'Bildirim'} — ${notification.meta}` : (notification.text || notification.meta || ''),
          is_read: userId === currentUserId ? false : false
        }));

        const { error: notificationInsertError } = await supabase
          .from('notifications')
          .insert(notificationRows);

        if (notificationInsertError) throw notificationInsertError;
      }

      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase aktivite hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const findLocalTaskBySupabaseId = (supabaseTaskId = '') => {
    const cleanTaskId = String(supabaseTaskId || '').trim();
    if (!cleanTaskId) return null;

    for (const [projectName, board] of Object.entries(projectBoards || {})) {
      const allTasks = [
        ...(board?.columns || []).flatMap((column) =>
          (column.tasks || []).map((task) => ({ ...task, projectName, columnTitle: column.title }))
        ),
        ...(board?.archivedTasks || []).map((task) => ({
          ...task,
          projectName,
          columnTitle: task.sourceColumnTitle || task.columnTitle || 'Arşiv'
        }))
      ];

      const matchedTask = allTasks.find((task) =>
        String(task.supabaseId || '') === cleanTaskId ||
        String(task.id || '') === `supabase-${cleanTaskId}` ||
        String(task.id || '') === cleanTaskId
      );

      if (matchedTask) return matchedTask;
    }

    return null;
  };

  const mapSupabaseNotificationToLocal = (notification = {}) => {
    const linkedTask = findLocalTaskBySupabaseId(notification.task_id);
    const createdAt = notification.created_at || new Date().toISOString();

    return {
      id: `supabase-notification-${notification.id}`,
      supabaseId: notification.id,
      source: 'notification',
      type: notification.type || 'activity',
      title: notification.title || 'Bildirim',
      text: notification.body || '',
      meta: linkedTask
        ? `${linkedTask.projectName || selectedProject || 'Proje'} · ${linkedTask.columnTitle || linkedTask.status || 'Görev'}`
        : '',
      task: linkedTask || null,
      taskId: linkedTask?.id || notification.task_id || '',
      taskTitle: linkedTask?.title || '',
      projectName: linkedTask?.projectName || '',
      columnTitle: linkedTask?.columnTitle || '',
      actor: 'ZRC AJANS',
      avatar: 'ZRC',
      userId: currentUserId,
      createdAt,
      dateLabel: getActivityDateLabel(createdAt),
      sortWeight: notification.type === 'assignment' ? 940 : 730
    };
  };


  // zrc-workspace-notification-clear-event-core-v1
  const zrcIsNotificationClearAllActivityLog = (log = {}) =>
    log.type === 'notification_clear_all' ||
    log.payload?.zrcNotificationClearAll === true ||
    log.payload?.clearAllToken;

  const zrcNotificationClearTokensFromActivityLogs = (logs = []) => {
    const tokens = [];

    (logs || []).forEach((log) => {
      if (!zrcIsNotificationClearAllActivityLog(log)) return;

      const payload = log.payload || {};
      const clearedAt =
        payload.clearedBefore ||
        payload.notificationClearAllAt ||
        payload.notificationsClearAllAt ||
        log.created_at ||
        '';

      if (!clearedAt) return;

      tokens.push(`clear-all:${clearedAt}`);
      tokens.push(`cleared-before:${clearedAt}`);
    });

    return Array.from(new Set(tokens));
  };

  const mapSupabaseActivityLogToLocal = (log = {}) => {
    const payload = log.payload || {};

    if (zrcIsNotificationClearAllActivityLog(log)) return null;

    return {
      id: payload.localId || `supabase-activity-${log.id}`,
      supabaseId: payload.localId || log.id,
      activityLogId: log.id,
      source: 'activity',
      type: log.type || 'activity',
      title: log.title || 'Aktivite',
      text: payload.text || log.description || '',
      meta: payload.meta || '',
      projectName: payload.projectName || '',
      columnTitle: payload.columnTitle || '',
      chatGroupId: payload.chatGroupId || '',
      messageId: payload.messageId || '',
      actor: log.actor_id === currentUserId ? currentProfileName : 'Kullanıcı',
      avatar: log.actor_id === currentUserId ? currentProfileAvatar : createAvatarFromName('Kullanıcı'),
      userId: log.actor_id || '',
      createdAt: log.created_at || '',
      dateLabel: getActivityDateLabel(log.created_at),
      sortWeight: 700
    };
  };

  const loadActivityLogsFromSupabase = async () => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || authSessionLoading) return;

    try {
      const { data: logs, error: logsError } = await supabase
        .from('activity_logs')
        .select('id, actor_id, type, title, description, payload, created_at')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(80);

      if (logsError) throw logsError;

      const notificationClearTokens = zrcNotificationClearTokensFromActivityLogs(logs);

      if (notificationClearTokens.length > 0) {
        setReadNotificationIds((prevIds) => Array.from(new Set([...(prevIds || []), ...notificationClearTokens])));
      }

      const mappedLogs = (logs || []).map(mapSupabaseActivityLogToLocal).filter(Boolean);

      setActivityNotifications((prevNotifications) =>
        mergeUniqueByKey(prevNotifications, mappedLogs, (notification) => notification.supabaseId || notification.id).slice(0, 80)
      );

      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('id, type, title, body, is_read, project_id, task_id, created_at')
        .eq('workspace_id', workspaceId)
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(80);

      if (!notificationsError) {
        const mappedNotifications = (notificationsData || []).map(mapSupabaseNotificationToLocal);

        setActivityNotifications((prevNotifications) =>
          mergeUniqueByKey(prevNotifications, mappedNotifications, (notification) => notification.supabaseId || notification.id).slice(0, 80)
        );

        const supabaseReadIds = (notificationsData || [])
          .filter((notification) => notification.is_read)
          .map((notification) => `supabase-notification-${notification.id}`);

        let preferenceReadIds = [];

        try {
          const { data: preferencesRecord, error: preferencesReadError } = await supabase
            .from('user_preferences')
            .select('preferences')
            .eq('user_id', currentUserId)
            .maybeSingle();

          if (!preferencesReadError) {
            const preferences = preferencesRecord?.preferences || {};
            preferenceReadIds = zrcCoreBuildRemoteNotificationClearIds(preferences);
          }
        } catch (error) {
          preferenceReadIds = [];
        }

        const syncedReadIds = Array.from(new Set([
          ...supabaseReadIds,
          ...preferenceReadIds
        ]));

        if (syncedReadIds.length > 0) {
          setReadNotificationIds((prevIds) => Array.from(new Set([...prevIds, ...syncedReadIds])));
        }
      }
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase aktivite okuma hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
  };

  // zrc-notification-auto-refresh-v317
  useEffect(() => {
    if (!isLoggedIn || authSessionLoading || !supabaseWorkspaceId || !isSupabaseUuid(currentUserId)) return;

    loadActivityLogsFromSupabase();

    const refreshTimer = window.setInterval(() => {
      loadActivityLogsFromSupabase();
    }, 60000);

    return () => {
      window.clearInterval(refreshTimer);
    };
  }, [isLoggedIn, authSessionLoading, supabaseWorkspaceId, currentUserId]);

  const ensureSupabaseChatGroup = async (group = {}) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();
    const existingId = group.supabaseId || (isSupabaseUuid(group.id) ? group.id : '');

    if (existingId) return existingId;
    if (!workspaceId) return null;

    const groupTitle = String(group.name || group.title || 'Yazışma').trim();
    const groupType = group.type === 'project' ? 'project' : 'custom';
    const projectName = group.projectName || '';
    const projectId = projectName ? await getSupabaseProjectIdForName(projectName, false) : null;

    const { data: existingGroup, error: selectError } = await supabase
      .from('chat_groups')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('title', groupTitle)
      .eq('type', groupType)
      .maybeSingle();

    if (selectError) throw selectError;
    if (existingGroup?.id) return existingGroup.id;

    const { data: createdGroup, error: insertError } = await supabase
      .from('chat_groups')
      .insert({
        workspace_id: workspaceId,
        project_id: projectId || null,
        title: groupTitle,
        type: groupType,
        created_by: isSupabaseUuid(currentUserId) ? currentUserId : null
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    if (createdGroup?.id && isSupabaseUuid(currentUserId)) {
      await supabase
        .from('chat_group_members')
        .insert({
          chat_group_id: createdGroup.id,
          user_id: currentUserId
        });
    }

    return createdGroup?.id || null;
  };

  const saveChatGroupToSupabase = async (group = {}) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !String(group.name || group.title || '').trim()) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase yazışma grubu kaydediliyor');

    try {
      const supabaseChatGroupId = await ensureSupabaseChatGroup(group);

      if (supabaseChatGroupId) {
        setChatGroups((prevGroups) =>
          prevGroups.map((item) =>
            item.id === group.id ? { ...item, supabaseId: supabaseChatGroupId } : item
          )
        );
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase yazışma grubu kaydedildi');
      return supabaseChatGroupId;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase yazışma grubu hatası: ${error?.message || 'bilinmeyen hata'}`);
      return null;
    }
  };

  const saveProjectMessageToSupabase = async (message = {}) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !isSupabaseUuid(currentUserId) || !String(message.text || '').trim()) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase mesaj kaydediliyor');

    try {
      const projectId = message.projectName
        ? await getSupabaseProjectIdForName(message.projectName, true)
        : null;

      const localChatGroup =
        (selectedChatGroup?.id === message.chatGroupId ? selectedChatGroup : null) ||
        chatGroups.find((group) => group.id === message.chatGroupId || group.supabaseId === message.chatGroupId) ||
        null;

      const chatGroupId = message.chatGroupId
        ? await ensureSupabaseChatGroup({
            ...(localChatGroup || {}),
            id: message.chatGroupId,
            name: localChatGroup?.name || message.chatGroupName || 'Yazışma',
            projectName: message.projectName || localChatGroup?.projectName || '',
            type: localChatGroup?.type || 'custom'
          })
        : null;

      const taskId = message.taskId ? getSupabaseTaskIdFromLocalTask(message.taskId) : null;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          workspace_id: workspaceId,
          project_id: projectId || null,
          chat_group_id: chatGroupId || null,
          task_id: taskId || null,
          sender_id: currentUserId,
          body: message.text
        })
        .select('id')
        .single();

      if (error) throw error;

      if (data?.id) {
        setProjectMessages((prevMessages) =>
          prevMessages.map((item) =>
            item.id === message.id ? { ...item, supabaseId: data.id } : item
          )
        );
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase mesaj kaydedildi');
      return true;
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase mesaj hatası: ${error?.message || 'bilinmeyen hata'}`);
      return false;
    }
  };

  const mapSupabaseChatGroupToLocal = (group = {}) => ({
    id: group.id,
    supabaseId: group.id,
    type: group.type || 'custom',
    name: group.title || 'Yazışma',
    avatar: createAvatarFromName(group.title || 'Yazışma'),
    members: [currentProfileName],
    projectId: group.project_id || '',
    projectName: '',
    createdAt: group.created_at || ''
  });

  const mapSupabaseMessageToLocal = (message = {}, projectNameById = new Map()) => ({
    id: `supabase-message-${message.id}`,
    supabaseId: message.id,
    senderId: message.sender_id || '',
    sender: message.sender_id === currentUserId ? currentProfileName : 'Kullanıcı',
    avatar: message.sender_id === currentUserId ? currentProfileAvatar : createAvatarFromName('Kullanıcı'),
    text: message.body || '',
    projectName: projectNameById.get(message.project_id) || '',
    taskId: message.task_id ? `supabase-${message.task_id}` : null,
    chatGroupId: message.chat_group_id || '',
    createdAt: message.created_at || ''
  });

  const loadChatsAndMessagesFromSupabase = async () => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || authSessionLoading) return;

    try {
      const { data: dbProjects, error: projectsError } = await supabase
        .from('projects')
        .select('id, name')
        .eq('workspace_id', workspaceId);

      if (projectsError) throw projectsError;

      const projectNameById = new Map((dbProjects || []).map((project) => [project.id, project.name]));

      const { data: dbChatGroups, error: chatGroupsError } = await supabase
        .from('chat_groups')
        .select('id, project_id, title, type, created_at')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (chatGroupsError) throw chatGroupsError;

      const mappedGroups = (dbChatGroups || []).map((group) => ({
        ...mapSupabaseChatGroupToLocal(group),
        projectName: projectNameById.get(group.project_id) || ''
      }));

      setChatGroups((prevGroups) =>
        mergeUniqueByKey(prevGroups, mappedGroups, (group) => group.supabaseId || `${group.type}-${group.name}`)
      );

      const { data: dbMessages, error: messagesError } = await supabase
        .from('messages')
        .select('id, project_id, chat_group_id, task_id, sender_id, body, created_at')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const mappedMessages = (dbMessages || []).map((message) => mapSupabaseMessageToLocal(message, projectNameById));

      setProjectMessages((prevMessages) =>
        mergeUniqueByKey(prevMessages, mappedMessages, (message) => message.supabaseId || message.id)
      );

      zrcSetSupabaseWriteInfo('saved', 'Supabase yazışmalar yüklendi');
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase yazışma okuma hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
  };

  useEffect(() => {
    loadProfileAndPreferencesFromSupabase();
    loadQuickNotesFromSupabase();
    loadActivityLogsFromSupabase();
    loadChatsAndMessagesFromSupabase();
  }, [supabaseWorkspaceId, currentUserId, authSessionLoading]);



  const countSupabaseTableRows = async (tableName, filterColumn = 'workspace_id', filterValue = getCurrentSupabaseWorkspaceId()) => {
    if (!filterValue) return { count: 0, error: { message: 'workspace bulunamadı' } };

    const query = supabase
      .from(tableName)
      .select('id', { count: 'exact', head: true });

    if (filterColumn && filterValue) {
      query.eq(filterColumn, filterValue);
    }

    return query;
  };




  const runFullSupabaseRefresh = async () => {
    setSupabaseHealthLoading(true);
    zrcSetSupabaseWriteInfo('saving', 'Supabase toplu yenileme yapılıyor');

    try {
      await loadWorkspaceStructureFromSupabase();
      await loadSelectedProjectBoardFromSupabase();
      await loadProfileAndPreferencesFromSupabase();
      await loadQuickNotesFromSupabase();
      await loadActivityLogsFromSupabase();
      await loadChatsAndMessagesFromSupabase();

      const refreshedAt = new Date().toISOString();
      setSupabaseLastFullRefreshAt(refreshedAt);
      zrcSetSupabaseWriteInfo('saved', 'Supabase toplu yenileme tamamlandı');
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase toplu yenileme hatası: ${error?.message || 'bilinmeyen hata'}`);
    } finally {
      setSupabaseHealthLoading(false);
    }
  };

  const getSupabaseHealthSummary = () => {
    const total = supabaseHealthReport.length;
    const okCount = supabaseHealthReport.filter((row) => row.state === 'ok').length;
    const warningCount = supabaseHealthReport.filter((row) => row.state === 'warning').length;
    const errorCount = supabaseHealthReport.filter((row) => row.state === 'error').length;

    if (!total) return 'Henüz kontrol yapılmadı.';

    return `${okCount} başarılı · ${warningCount} uyarı · ${errorCount} hata`;
  };

  function downloadJsonSnapshot(snapshot, fileNamePrefix = 'zrc-yedek') {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${fileNamePrefix}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function readSupabaseTableForBackup(tableName, mode = 'workspace') {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (mode === 'workspace' && !workspaceId) {
      return { data: [], error: { message: 'workspace bulunamadı' } };
    }

    let query = supabase.from(tableName).select('*');

    if (mode === 'workspace') {
      query = query.eq('workspace_id', workspaceId);
    }

    if (mode === 'currentUser') {
      query = query.eq('id', currentUserId);
    }

    if (mode === 'currentUserPreference') {
      query = query.eq('user_id', currentUserId);
    }

    return query;
  }




  const updateLocalTaskSupabaseId = (localTaskId, supabaseTaskId) => {
    if (!localTaskId || !supabaseTaskId) return;

    setBoardColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: (column.tasks || []).map((task) =>
          task.id === localTaskId ? { ...task, supabaseId: supabaseTaskId } : task
        )
      }))
    );

    setArchivedTasks((prevTasks) =>
      (prevTasks || []).map((task) =>
        task.id === localTaskId ? { ...task, supabaseId: supabaseTaskId } : task
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
              tasks: (column.tasks || []).map((task) =>
                task.id === localTaskId ? { ...task, supabaseId: supabaseTaskId } : task
              )
            })),
            archivedTasks: (board.archivedTasks || []).map((task) =>
              task.id === localTaskId ? { ...task, supabaseId: supabaseTaskId } : task
            )
          }
        ])
      )
    );
  };

  const migrateSingleTaskToSupabase = async (task = {}, column = {}, projectName = selectedProject, isArchived = false) => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !String(task.title || '').trim()) return null;

    const projectId = await ensureSupabaseProject(projectName);
    const columnIndex = Math.max(0, (projectBoards?.[projectName]?.columns || boardColumns).findIndex((item) => item.title === column.title));
    const columnId = isArchived ? null : await ensureSupabaseColumn(projectId, column || { title: task.status || 'Yeni Görev' }, columnIndex);

    const payload = {
      workspace_id: workspaceId,
      project_id: projectId,
      column_id: columnId || null,
      customer_id: isSupabaseUuid(task.customerId) ? task.customerId : null,
      title: task.title || 'Adsız görev',
      description: getPlainTaskDescription(task.description || task.note),
      rich_description: task.richDescription || task.rich_description || {},
      priority: getSafeSupabasePriority(task.priority),
      status: isArchived ? (task.status || column?.title || 'Arşiv') : (column?.title || task.status || 'Yeni Görev'),
      start_date: getSupabaseSafeDate(task.startDate),
      due_date: getSupabaseSafeDate(task.dueDate || task.endDate),
      end_date: getSupabaseSafeDate(task.endDate),
      tags: Array.isArray(task.tags) ? task.tags : String(task.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
      is_archived: isArchived || task.isArchived === true,
      archived_at: isArchived || task.isArchived === true ? new Date().toISOString() : null,
      updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null,
        task_order: typeof taskData?.taskOrder === 'number' ? taskData.taskOrder : ((targetColumn?.tasks || []).length || 0)
    };

    let savedTask = null;

    if (isSupabaseUuid(task.supabaseId)) {
      const { data, error } = await supabase
        .from('tasks')
        .update(payload)
        .eq('id', task.supabaseId)
        .select('id')
        .single();

      if (error) throw error;
      savedTask = data;
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

    const savedTaskId = savedTask?.id || task.supabaseId || null;

    if (!savedTaskId) return null;

    updateLocalTaskSupabaseId(task.id, savedTaskId);

    const assigneeIds = (task.assignees || [])
      .map((person) => person?.id || person?.userId)
      .filter(isSupabaseUuid);

    const followerIds = (task.followers || [])
      .map((person) => person?.id || person?.userId)
      .filter(isSupabaseUuid);

    await supabase.from('task_assignees').delete().eq('task_id', savedTaskId);
    await supabase.from('task_followers').delete().eq('task_id', savedTaskId);

    if (assigneeIds.length > 0) {
      const { error: assigneesError } = await supabase
        .from('task_assignees')
        .insert(assigneeIds.map((userId) => ({ task_id: savedTaskId, user_id: userId })));

      if (assigneesError) throw assigneesError;
    }

    if (followerIds.length > 0) {
      const { error: followersError } = await supabase
        .from('task_followers')
        .insert(followerIds.map((userId) => ({ task_id: savedTaskId, user_id: userId })));

      if (followersError) throw followersError;
    }

    await syncTaskDetailsToSupabase(task.id, {
      ...task,
      supabaseId: savedTaskId,
      description: getPlainTaskDescription(task.description || task.note),
      comments: task.comments || [],
      steps: task.steps || [],
      files: task.files || []
    }, { syncDescription: true });

    return savedTaskId;
  };

  const migrateLocalDataToSupabase = async () => {
    if (!ensureCanManageLocalData()) return;

    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId) {
      zrcSetSupabaseWriteInfo('error', 'Supabase aktarımı için workspace bulunamadı');
      return;
    }

    const confirmed = await window.zrcConfirm(
      'Yerel tarayıcı verilerini Supabase’e aktaracağız. Bu işlem mevcut Supabase verilerini silmez; eksik/veritabanına geçmemiş kayıtları ekler veya günceller. Devam edilsin mi?'
    );

    if (!confirmed) return;

    setSupabaseBackupLoading(true);
    zrcSetSupabaseWriteInfo('saving', 'Yerel veri Supabase’e aktarılıyor');

    const report = {
      customers: 0,
      projects: 0,
      columns: 0,
      tasks: 0,
      archivedTasks: 0,
      errors: []
    };

    try {
      for (const customer of customers || []) {
        try {
          await saveCustomerToSupabase(customer);
          report.customers += 1;
        } catch (error) {
          report.errors.push(`Müşteri: ${customer?.name || 'Adsız'} · ${error?.message || 'hata'}`);
        }
      }

      const projectNames = Array.from(new Set([...(projects || []), ...Object.keys(projectBoards || {})])).filter(Boolean);

      for (const projectName of projectNames) {
        try {
          const settings = projectSettings[projectName] || createDefaultProjectSettings(projectName);

          await saveProjectSettingsToSupabase(projectName, settings, projectName);
          report.projects += 1;

          const projectId = await ensureSupabaseProject(projectName);
          const board = projectBoards[projectName] || (projectName === selectedProject ? { columns: boardColumns, archivedTasks } : createDefaultProjectBoard());

          for (const [columnIndex, column] of (board.columns || []).entries()) {
            try {
              await ensureSupabaseColumn(projectId, column, columnIndex);
              report.columns += 1;
            } catch (error) {
              report.errors.push(`Kolon: ${projectName}/${column?.title || 'Adsız'} · ${error?.message || 'hata'}`);
            }

            for (const task of column.tasks || []) {
              try {
                await migrateSingleTaskToSupabase(task, column, projectName, false);
                report.tasks += 1;
              } catch (error) {
                report.errors.push(`Görev: ${projectName}/${task?.title || 'Adsız'} · ${error?.message || 'hata'}`);
              }
            }
          }

          for (const archivedTask of board.archivedTasks || []) {
            try {
              await migrateSingleTaskToSupabase(archivedTask, { title: archivedTask.status || 'Arşiv' }, projectName, true);
              report.archivedTasks += 1;
            } catch (error) {
              report.errors.push(`Arşiv: ${projectName}/${archivedTask?.title || 'Adsız'} · ${error?.message || 'hata'}`);
            }
          }
        } catch (error) {
          report.errors.push(`Proje: ${projectName} · ${error?.message || 'hata'}`);
        }
      }

      await saveProfileToSupabase(profileDraft, profilePreferences);

      for (const note of quickNotes || []) {
        if (!note.supabaseId) {
          await saveQuickNoteToSupabase(note);
        }
      }

      await runFullSupabaseRefresh();

      const reportText = [
        'ZRC Yerel Veri → Supabase Aktarım Raporu',
        `Tarih: ${new Date().toLocaleString('tr-TR')}`,
        `Müşteri: ${report.customers}`,
        `Proje: ${report.projects}`,
        `Kolon: ${report.columns}`,
        `Görev: ${report.tasks}`,
        `Arşiv görev: ${report.archivedTasks}`,
        `Hata/Uyarı: ${report.errors.length}`,
        '',
        ...report.errors
      ].join('\n');

      await copyTextToClipboard(reportText, 'Aktarım raporu panoya kopyalandı.');

      zrcSetSupabaseWriteInfo(
        report.errors.length ? 'error' : 'saved',
        report.errors.length
          ? `Aktarım tamamlandı, ${report.errors.length} uyarı var`
          : 'Yerel veri Supabase’e aktarıldı'
      );
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase aktarım hatası: ${error?.message || 'bilinmeyen hata'}`);
    } finally {
      setSupabaseBackupLoading(false);
    }
  };

  const runRealtimeTriggeredRefresh = (tableName = '', options = {}) => {
    if (supabaseRealtimeRefreshTimer.current) {
      clearTimeout(supabaseRealtimeRefreshTimer.current);
    }

    const zrcTaskOrderSavingUntil =
      tableName === 'tasks' && typeof window !== 'undefined'
        ? Number(window.localStorage.getItem('zrc-task-order-saving-until') || 0)
        : 0;

    const zrcRealtimeDefaultDelay =
      tableName === 'tasks' && Number.isFinite(zrcTaskOrderSavingUntil) && zrcTaskOrderSavingUntil > Date.now()
        ? Math.max(1800, zrcTaskOrderSavingUntil - Date.now())
        : tableName === 'tasks'
          ? 1200
          : 80;

    const refreshDelay = Number.isFinite(options?.delay) ? options.delay : zrcRealtimeDefaultDelay;

    setSupabaseRealtimeStatus({
      state: 'syncing',
      label: `${tableName || 'Supabase'} değişti, yenileniyor`
    });

    supabaseRealtimeRefreshTimer.current = setTimeout(async () => {
      try {
        await loadWorkspaceStructureFromSupabase();
        await loadSelectedProjectBoardFromSupabase();
        await loadQuickNotesFromSupabase();
        await loadActivityLogsFromSupabase();
        await loadChatsAndMessagesFromSupabase();

        setZrcMobileColumnRefreshKey((value) => value + 1);

        const syncedAt = new Date().toISOString();
        setSupabaseLastRealtimeAt(syncedAt);
        setSupabaseRealtimeStatus({
          state: 'connected',
          label: 'Canlı senkron aktif'
        });
      } catch (error) {
        setSupabaseRealtimeStatus({
          state: 'error',
          label: `Canlı yenileme hatası: ${error?.message || 'bilinmeyen hata'}`
        });
      }
    }, Math.max(0, refreshDelay));
  };

  const getSupabaseRealtimeClass = () => {
    if (supabaseRealtimeStatus.state === 'connected') return 'bg-emerald-50 border-emerald-100 text-emerald-700';
    if (supabaseRealtimeStatus.state === 'syncing') return 'bg-zinc-100 border-zinc-200 text-zinc-700';
    if (supabaseRealtimeStatus.state === 'error') return 'bg-red-50 border-red-100 text-red-600';

    return 'bg-slate-50 border-slate-100 text-slate-600';
  };

  useEffect(() => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || authSessionLoading || !currentUserId) {
      setSupabaseRealtimeStatus({
        state: 'idle',
        label: 'Realtime beklemede'
      });
      return undefined;
    }

    const realtimeTables = [
      'projects',
      'board_columns',
      'tasks',
      'task_comments',
      'task_steps',
      'files',
      'customers',
      'messages',
      'chat_groups',
      'notifications',
      'activity_logs',
      'quick_notes',
      'user_preferences',
    ];

    const channel = supabase.channel(`zrc-workspace-realtime-${workspaceId}`);

    realtimeTables.forEach((tableName) => {
      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => runRealtimeTriggeredRefresh(tableName)
      );
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setSupabaseRealtimeStatus({
          state: 'connected',
          label: 'Realtime senkron aktif'
        });
      }

      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        setSupabaseRealtimeStatus({
          state: 'error',
          label: `Realtime bağlantı sorunu: ${status}`
        });
      }

      if (status === 'CLOSED') {
        setSupabaseRealtimeStatus({
          state: 'idle',
          label: 'Realtime bağlantı kapandı'
        });
      }
    });

    return () => {
      if (supabaseRealtimeRefreshTimer.current) {
        clearTimeout(supabaseRealtimeRefreshTimer.current);
      }

      supabase.removeChannel(channel);
    };
  }, [supabaseWorkspaceId, currentUserId, authSessionLoading, selectedProject]);

  const isRunningAsInstalledPwa = () => {
    if (typeof window === 'undefined') return false;

    return (
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator?.standalone === true
    );
  };

  const isIosDevice = () => {
    if (typeof window === 'undefined') return false;

    return /iphone|ipad|ipod/i.test(window.navigator?.userAgent || '');
  };

  const getPwaInstallClass = () => {
    if (pwaInstallStatus.state === 'installed') return 'bg-emerald-50 border-emerald-100 text-emerald-700';
    if (pwaInstallStatus.state === 'ready') return 'bg-zinc-100 border-zinc-200 text-zinc-700';
    if (pwaInstallStatus.state === 'error') return 'bg-red-50 border-red-100 text-red-600';

    return 'bg-slate-50 border-slate-100 text-slate-600';
  };

  const handleInstallPwa = async () => {
    if (isRunningAsInstalledPwa()) {
      setPwaInstallStatus({
        state: 'installed',
        label: 'Mobil uygulama olarak açık'
      });
      return;
    }

    if (isIosDevice() && !pwaInstallPrompt) {
      const iosInstallMessage = [
        'iPhone/iPad kurulumu:',
        '',
        '1. Bu siteyi Safari ile aç.',
        '2. Alt menüden Paylaş butonuna bas.',
        '3. “Ana Ekrana Ekle” seçeneğini seç.',
        '4. Ekle dediğinde ZRC panel telefonunda uygulama gibi açılır.'
      ].join('\n');

      setPwaInstallStatus({
        state: 'ready',
        label: 'iPhone: Safari > Paylaş > Ana Ekrana Ekle'
      });

      await window.zrcAlert(iosInstallMessage);
      return;
    }

    if (!pwaInstallPrompt) {
      setPwaInstallStatus({
        state: 'error',
        label: 'Kurulum hazır değil: sayfayı yenileyip tekrar dene'
      });

      await window.zrcAlert('Kurulum penceresi şu an hazır değil. Chrome/Edge kullanıyorsan sayfayı bir kez yenileyip tekrar dene. iPhone kullanıyorsan Safari > Paylaş > Ana Ekrana Ekle yolunu kullan.');
      return;
    }

    try {
      pwaInstallPrompt.prompt();
      const choiceResult = await pwaInstallPrompt.userChoice;

      if (choiceResult?.outcome === 'accepted') {
        setPwaInstallStatus({
          state: 'installed',
          label: 'Mobil kurulum başlatıldı'
        });
      } else {
        setPwaInstallStatus({
          state: 'idle',
          label: 'Mobil kurulum iptal edildi'
        });
      }

      setPwaInstallPrompt(null);
    } catch (error) {
      setPwaInstallStatus({
        state: 'error',
        label: `Mobil kurulum hatası: ${error?.message || 'bilinmeyen hata'}`
      });
    }
  };

  useEffect(() => {
    if (isRunningAsInstalledPwa()) {
      setPwaInstallStatus({
        state: 'installed',
        label: 'Mobil uygulama olarak açık'
      });
      return undefined;
    }

    if (isIosDevice()) {
      setPwaInstallStatus({
        state: 'ready',
        label: 'iPhone: Safari > Paylaş > Ana Ekrana Ekle'
      });
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setPwaInstallPrompt(event);
      setPwaInstallStatus({
        state: 'ready',
        label: 'Mobil kurulum hazır'
      });
    };

    const handleAppInstalled = () => {
      setPwaInstallPrompt(null);
      setPwaInstallStatus({
        state: 'installed',
        label: 'Mobil uygulama kuruldu'
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);


  const mapSupabaseTaskUserLinkToLocalPerson = (link = {}) => {
    const userId = String(link.user_id || link.userId || link.id || '').trim();

    if (!userId) return null;

    if (userId === String(supabaseAuthUserId || '') || userId === String(currentUserId || '') || userId === String(currentRoleMember?.id || '')) {
      if (currentRoleMember && !isLegacyDemoTeamMemberRecord(currentRoleMember)) {
        return {
          id: currentRoleMember.id,
          name: currentRoleMember.name,
          username: currentRoleMember.username || '',
          email: currentRoleMember.email || '',
          avatar: currentRoleMember.avatar || createAvatarFromName(currentRoleMember.name),
          role: normalizeTeamRole(currentRoleMember.role)
        };
      }

      return {
        id: userId,
        name: 'ZRC AJANS',
        username: 'zrcajans',
        email: 'info@zrcajans.com',
        avatar: currentProfileAvatar || 'ZRC',
        role: 'Yönetici'
      };
    }

    const matchedMember = teamMembers.find((member) => String(member.id || '') === userId);

    if (!matchedMember || isLegacyDemoTeamMemberRecord(matchedMember)) return null;

    return {
      id: matchedMember.id,
      name: matchedMember.name,
      username: matchedMember.username || '',
      email: matchedMember.email || '',
      avatar: matchedMember.avatar || createAvatarFromName(matchedMember.name),
      role: normalizeTeamRole(matchedMember.role)
    };
  };

  const mapSupabaseTaskToLocalTask = (task = {}, columnTitle = 'Yeni Görev') => {
    const dateValue = task.due_date || task.end_date || task.start_date || '';

    return {
      id: `supabase-${task.id}`,
      supabaseId: task.id,
          taskOrder: typeof task.task_order === 'number' ? task.task_order : Number(task.task_order ?? 0),
          task_order: typeof task.task_order === 'number' ? task.task_order : Number(task.task_order ?? 0),
      title: task.title || 'Adsız görev',
      description: getPlainTaskDescription(task.description),
      note: getPlainTaskDescription(task.description),
      richDescription: task.rich_description || {},
      priority: task.priority || 'Normal',
      status: task.status || columnTitle,
      date: formatSupabaseDateForLocalTask(dateValue),
      startDate: task.start_date || '',
      dueDate: task.due_date || '',
      endDate: task.end_date || '',
      tags: Array.isArray(task.tags) ? task.tags : [],
      assigneeIds: (task._assignees || [])
        .map((link) => String(link.user_id || link.userId || link.id || '').trim())
        .filter(Boolean),
      followerIds: (task._followers || [])
        .map((link) => String(link.user_id || link.userId || link.id || '').trim())
        .filter(Boolean),
      assignees: (task._assignees || []).map(mapSupabaseTaskUserLinkToLocalPerson).filter(Boolean),
      followers: (task._followers || []).map(mapSupabaseTaskUserLinkToLocalPerson).filter(Boolean),
      comments: (task._comments || []).map(mapSupabaseCommentToLocalComment),
      steps: (task._steps || []).map(mapSupabaseStepToLocalStep),
      files: (task._files || []).map(mapSupabaseFileToLocalFile),
      customerId: task.customer_id || '',
      isArchived: task.is_archived === true,
      createdAt: task.created_at || '',
      updatedAt: task.updated_at || ''
    };
  };

  
  /* === ZRC TASK FLICKER OPTIMISTIC GUARD START === */
  const zrcGetOptimisticTaskSupabaseId = (taskOrId = {}) => {
    const rawValue = typeof taskOrId === 'string' ? taskOrId : '';
    const task = typeof taskOrId === 'object' && taskOrId ? taskOrId : {};

    const rawId = String(
      task.supabaseId ||
      task.supabase_id ||
      task.dbId ||
      rawValue ||
      task.id ||
      ''
    ).trim();

    if (!rawId) return '';
    if (rawId.startsWith('supabase-')) return rawId.replace('supabase-', '');
    return rawId;
  };

  const zrcReadOptimisticHiddenTaskIds = () => {
    if (typeof window === 'undefined') return new Set();

    try {
      const now = Date.now();
      const rawItems = JSON.parse(window.localStorage.getItem('zrc-optimistic-hidden-task-ids') || '[]');
      const validItems = Array.isArray(rawItems)
        ? rawItems.filter((item) => item?.id && Number(item.until || 0) > now)
        : [];

      if (validItems.length !== rawItems.length) {
        window.localStorage.setItem('zrc-optimistic-hidden-task-ids', JSON.stringify(validItems));
      }

      return new Set(validItems.map((item) => String(item.id)));
    } catch (error) {
      return new Set();
    }
  };

  const zrcIsTaskOptimisticWindowActive = () => {
    if (typeof window === 'undefined') return false;

    try {
      return Number(window.localStorage.getItem('zrc-task-order-saving-until') || 0) > Date.now();
    } catch (error) {
      return false;
    }
  };

  const zrcMarkOptimisticHiddenTask = (taskOrId, durationMs = 9000) => {
    if (typeof window === 'undefined') return;

    const taskId = zrcGetOptimisticTaskSupabaseId(taskOrId);
    if (!taskId) return;

    try {
      const now = Date.now();
      const until = now + durationMs;
      const rawItems = JSON.parse(window.localStorage.getItem('zrc-optimistic-hidden-task-ids') || '[]');
      const validItems = Array.isArray(rawItems)
        ? rawItems.filter((item) => item?.id && Number(item.until || 0) > now && String(item.id) !== String(taskId))
        : [];

      validItems.push({ id: String(taskId), until });
      window.localStorage.setItem('zrc-optimistic-hidden-task-ids', JSON.stringify(validItems));
      window.localStorage.setItem('zrc-task-order-saving-until', String(until));
    } catch (error) {}
  };
  /* === ZRC TASK FLICKER OPTIMISTIC GUARD END === */

const mergeSupabaseBoardIntoLocalState = (projectName, dbColumns = [], incomingDbTasks = []) => {
    const zrcOptimisticHiddenTaskIds = zrcReadOptimisticHiddenTaskIds();
    const zrcTaskOptimisticWindowActive = zrcIsTaskOptimisticWindowActive();

    let dbTasks = (incomingDbTasks || []).filter((task) => {
      const taskId = String(task?.id || '').trim();
      return !taskId || !zrcOptimisticHiddenTaskIds.has(taskId);
    });
    const dbTaskIds = new Set((dbTasks || []).map((task) => task.id).filter(Boolean));

    setProjectBoards((prevBoards) => {
      const existingBoard = prevBoards[projectName] || createDefaultProjectBoard();
      const dbColumnsById = new Map((dbColumns || []).map((column) => [column.id, column]));
      const hasSupabaseColumns = Array.isArray(dbColumns) && dbColumns.length > 0;
      const deletedColumnTitleKeys = new Set(
        normalizeStorageArray(readStorageValue(`zrc-deleted-column-titles-${projectName}`, []), [])
          .map((title) => normalizeColumnTitleForDisplay(title))
          .filter(Boolean)
      );

      const rawBaseColumns = hasSupabaseColumns
        ? (dbColumns || []).map((dbColumn, index) => ({
            id: dbColumn.id || `db-col-${index + 1}`,
            title: normalizeColumnTitleForDisplay(dbColumn.title || `Kolon ${index + 1}`),
            color: dbColumn.color || '#64748b',
            desc: dbColumn.description || '',
            tasks: []
          }))
        : [];

      const seenColumnTitles = new Set();
      const baseColumns = rawBaseColumns.filter((column) => {
        const normalizedTitle = normalizeColumnTitleForDisplay(column.title);

        if (!normalizedTitle || seenColumnTitles.has(normalizedTitle) || deletedColumnTitleKeys.has(normalizedTitle)) return false;

        seenColumnTitles.add(normalizedTitle);
        return true;
      });

      const allExistingTasks = [
        ...((existingBoard.columns || []).flatMap((item) => item.tasks || [])),
        ...(existingBoard.archivedTasks || [])
      ];

      const zrcLocalSupabaseTaskIdsForOptimisticMerge = new Set(
        allExistingTasks
          .map((task) => zrcGetOptimisticTaskSupabaseId(task))
          .filter(Boolean)
      );

      if (zrcTaskOptimisticWindowActive && zrcLocalSupabaseTaskIdsForOptimisticMerge.size > 0) {
        dbTasks = dbTasks.filter((task) => {
          const dbTaskId = String(task?.id || '').trim();
          return !dbTaskId || !zrcLocalSupabaseTaskIdsForOptimisticMerge.has(dbTaskId);
        });
      }

      const getExistingLocalTaskForSupabaseTask = (supabaseTaskId = '') =>
        allExistingTasks.find((task) => {
          const taskSupabaseId = String(task.supabaseId || '').trim();
          const taskId = String(task.id || '').trim();

          return taskSupabaseId === String(supabaseTaskId) || taskId === `supabase-${supabaseTaskId}`;
        }) || null;

      const mergeLocalOnlyTaskPeople = (mappedTask = {}, previousTask = {}) => {
        const mergePeople = (dbPeople = [], localPeople = []) => {
          const nextPeopleMap = new Map();

          (dbPeople || []).forEach((person) => {
            if (person?.id) nextPeopleMap.set(String(person.id), person);
          });

          (localPeople || []).forEach((person) => {
            if (!person?.id) return;

            const personId = String(person.id);

            if (isSupabaseUuid(personId)) return;
            if (isZrcAjansIdentityRecord(person)) return;
            if (!zrcTaskSelectableMembers.some((member) => String(member.id) === personId)) return;
            if (!nextPeopleMap.has(personId)) nextPeopleMap.set(personId, person);
          });

          return Array.from(nextPeopleMap.values());
        };

        return {
          ...mappedTask,
          assignees: mergePeople(mappedTask.assignees || [], previousTask?.assignees || []),
          followers: mergePeople(mappedTask.followers || [], previousTask?.followers || [])
        };
      };

      const nextColumns = baseColumns.map((column) => {
        const existingColumn = (existingBoard.columns || []).find((item) => {
          const itemTitle = normalizeColumnTitleForDisplay(item.title);
          const columnTitle = normalizeColumnTitleForDisplay(column.title);

          return item.id === column.id || itemTitle === columnTitle;
        });

        // v383b:
        // Supabase'e kaydedilmiş bir görev DB'den dönmüyorsa,
        // başka cihazdan/webden silinmiş kabul edilir ve localde korunmaz.
        // Sadece henüz Supabase kimliği almamış geçici local görevler korunur.
        const localOnlyTasks = (existingColumn?.tasks || []).filter((existingTask) => {
          if (!existingTask?.id) return false;
          if (existingTask.isArchived || existingTask.is_archived) return false;

          const existingId = String(existingTask.id || '').trim();
          const existingSupabaseId = String(
            existingTask.supabaseId ||
            existingTask.supabase_id ||
            existingTask.dbId ||
            existingTask.databaseId ||
            ''
          ).trim();

          const hasSupabaseIdentity = Boolean(
            existingSupabaseId ||
            existingId.startsWith('supabase-') ||
            isSupabaseUuid(existingId)
          );

          if (hasSupabaseIdentity) return zrcTaskOptimisticWindowActive;

          return !(dbTasks || []).some((dbTask) => {
            const dbId = String(dbTask.id || '').trim();

            if (!dbId) return false;

            return existingId === dbId || existingId === `supabase-${dbId}`;
          });
        });

        const dbTasksForColumn = (dbTasks || [])
          .filter((task) => {
            if (task.is_archived === true) return false;

            const dbColumn = dbColumnsById.get(task.column_id);
            const dbColumnTitle = normalizeColumnTitleForDisplay(dbColumn?.title || task.status || 'Yeni Görev');

            return dbColumnTitle === normalizeColumnTitleForDisplay(column.title);
          })
          .map((task) =>
            mergeLocalOnlyTaskPeople(
              mapSupabaseTaskToLocalTask(task, column.title),
              getExistingLocalTaskForSupabaseTask(task.id)
            )
          );

        return {
          ...column,
          tasks: [...localOnlyTasks, ...dbTasksForColumn]
        };
      });

      const dbArchivedTasks = (dbTasks || [])
        .filter((task) => task.is_archived === true)
        .map((task) => {
          const dbColumn = dbColumnsById.get(task.column_id);

          return mergeLocalOnlyTaskPeople(
            mapSupabaseTaskToLocalTask(task, normalizeColumnTitleForDisplay(dbColumn?.title || task.status || 'Arşiv')),
            getExistingLocalTaskForSupabaseTask(task.id)
          );
        });

      return {
        ...prevBoards,
        [projectName]: {
          ...existingBoard,
          columns: zrcApplyStoredTaskOrderToColumns(nextColumns, projectName),
          archivedTasks: dbArchivedTasks
        }
      };
    });
  };


  const loadSelectedProjectBoardFromSupabase = async () => {
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
        .select('id, column_id, title, description, rich_description, priority, status, start_date, due_date, end_date, tags, is_archived, customer_id, task_order, created_at, updated_at')
        .eq('project_id', projectRecord.id)
        .order('task_order', { ascending: true, nullsFirst: false })
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
  };

  useEffect(() => {
    loadSelectedProjectBoardFromSupabase();
  }, [selectedProject, supabaseWorkspaceId, currentUserId, supabaseAuthUserId, authSessionLoading]);


  // --- MODAL KAYIT İŞLEMLERİ ---
  const handleSaveTask = async (taskData, targetStatus) => {
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

    const finalTargetStatus =
      targetStatus ||
      taskData.zrcNewTaskTargetStatus ||
      taskData.columnTitle ||
      taskData.status ||
      previousColumn?.title ||
      boardColumns[0]?.title ||
      'Yeni Görev';
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
      followers: filterTaskFollowersForSave(taskData.followers || previousTask?.followers || []),
      columnTitle: finalTargetStatus,
      taskOrder: isEditingExistingTask
        ? (
            typeof previousTask?.taskOrder === 'number'
              ? previousTask.taskOrder
              : (typeof taskData?.taskOrder === 'number' ? taskData.taskOrder : 0)
          )
        : 0,
      zrcInsertAtTop: !isEditingExistingTask
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

      const targetColIndex = updatedCols.findIndex((c) =>
        c.title === finalTargetStatus ||
        c.id === taskData.zrcNewTaskTargetColumnId ||
        c.title === taskData.zrcNewTaskTargetStatus ||
        c.title === taskData.columnTitle
      );

      const targetIndexForInsert = targetColIndex !== -1 ? targetColIndex : 0;

      if (isEditingExistingTask) {
        updatedCols[targetIndexForInsert].tasks.push(cleanedTaskData);
      } else {
        updatedCols[targetIndexForInsert].tasks = [cleanedTaskData, ...(updatedCols[targetIndexForInsert].tasks || [])];
      }

      return updatedCols.map((col) => ({
        ...col,
        tasks: (col.tasks || []).map((task, index) => ({
          ...task,
          taskOrder: index
        }))
      }));
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
        workspaceId: getCurrentSupabaseWorkspaceId(),
        body: previousTask
          ? `Görev güncellendi: ${cleanedTaskData.title || 'Adsız görev'}`
          : `Yeni görev oluşturuldu: ${cleanedTaskData.title || 'Adsız görev'}`
      });
    }


    if (didSaveToSupabase) {
      setTimeout(() => loadSelectedProjectBoardFromSupabase(), 1500);
    } else if (existingSupabaseTaskId) {
      await window.zrcAlert('Görev yerelde güncellendi ama Supabase kaydı tamamlanamadı. Sağ alttaki hata mesajını kontrol et.');
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
  };







  // --- SÜTUN İŞLEMLERİ ---










  useEffect(() => {
    let isMounted = true;

    const loadAssignedTaskIds = async () => {
      const assignedLookupUserId = isSupabaseUuid(supabaseAuthUserId)
        ? supabaseAuthUserId
        : (isSupabaseUuid(currentUserId) ? currentUserId : '');

      if (currentAccountType !== 'Ekip Üyesi' || !assignedLookupUserId || authSessionLoading) {
        if (isMounted) setCurrentAssignedSupabaseTaskIds([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('task_assignees')
          .select('task_id')
          .eq('user_id', assignedLookupUserId);

        if (error) throw error;

        const nextIds = Array.from(
          new Set(
            (data || [])
              .map((row) => String(row.task_id || '').trim())
              .filter(Boolean)
          )
        );

        if (isMounted) setCurrentAssignedSupabaseTaskIds(nextIds);
      } catch {
        if (isMounted) setCurrentAssignedSupabaseTaskIds([]);
      }
    };

    loadAssignedTaskIds();

    return () => {
      isMounted = false;
    };
  }, [currentAccountType, currentUserId, supabaseAuthUserId, authSessionLoading, supabaseLastRealtimeAt]);


  const currentIdentityValues = [
    currentUserId,
    currentRoleMember?.id,
    currentRoleMember?.name,
    currentRoleMember?.email,
    currentRoleMember?.username,
    currentProfileName,
    profileDraft.email
  ]
    .filter(Boolean)
    .map((value) => normalizeCredentialText(value));

  const isRecordLinkedToCurrentUser = (record = {}) => {
    const recordValues = getIdentityValuesFromRecord(record);

    return recordValues.some((value) => currentIdentityValues.includes(value));
  };

  const isPeopleListLinkedToCurrentUser = (people = []) =>
    Array.isArray(people) && people.some((person) => isRecordLinkedToCurrentUser(person));

  const customerAccountMembers = teamMembers.filter(
    (member) => normalizeTeamRole(member.role) === 'Müşteri/Misafir'
  );

  const customerLinkNoneLabel = 'Müşteri Seç';
  const customerAccountNoneLabel = 'Hesap Yok';

  const getCustomerById = (customerId = '') =>
    customers.find((customer) => customer.id === customerId) || null;

  const getCustomerByName = (customerName = '') =>
    customers.find(
      (customer) =>
        customer.name.toLocaleLowerCase('tr-TR') === String(customerName || '').toLocaleLowerCase('tr-TR')
    ) || null;

  const getCustomerIdByName = (customerName = '') =>
    getCustomerByName(customerName)?.id || '';

  const getCustomerNameById = (customerId = '') =>
    getCustomerById(customerId)?.name || '';

  const getCustomerAccountLabel = (member = {}) =>
    member?.id ? `${member.name || 'Müşteri'} (@${member.username || createUsernameFromMember(member)})` : customerAccountNoneLabel;

  const getCustomerAccountByLabel = (label = '') =>
    customerAccountMembers.find((member) => getCustomerAccountLabel(member) === label) || null;

  const getCustomerAccountName = (memberId = '') => {
    const member = customerAccountMembers.find((item) => item.id === memberId);
    return member ? getCustomerAccountLabel(member) : customerAccountNoneLabel;
  };

  const customerLinkOptions = [
    customerLinkNoneLabel,
    ...customers.map((customer) => customer.name)
  ];

  const customerAccountOptions = [
    customerAccountNoneLabel,
    ...customerAccountMembers.map((member) => getCustomerAccountLabel(member))
  ];

  const getCustomerLinkedAccount = (customer = {}) =>
    customerAccountMembers.find(
      (member) => member.id === customer.accountUserId || member.customerId === customer.id
    ) || null;

  const getMemberLinkedCustomer = (member = {}) =>
    customers.find(
      (customer) => customer.id === member.customerId || customer.accountUserId === member.id
    ) || null;

  const currentCustomerRecords = customers.filter((customer) => {
    const customerValues = [
      customer.id,
      customer.accountUserId,
      customer.name,
      customer.contact,
      customer.email,
      customer.phone
    ]
      .filter(Boolean)
      .map((value) => normalizeCredentialText(value));

    return (
      customer.accountUserId === currentUserId ||
      customer.id === currentRoleMember?.customerId ||
      customerValues.some((value) => currentIdentityValues.includes(value))
    );
  });

  const currentCustomerNames = currentCustomerRecords
    .map((customer) => customer.name)
    .filter(Boolean);

  const currentCustomerKeys = currentCustomerRecords
    .flatMap((customer) => [
      customer.id,
      customer.accountUserId,
      customer.name,
      customer.contact,
      customer.email,
      customer.phone
    ])
    .filter(Boolean)
    .map((value) => normalizeCredentialText(value));

  const isCustomerLinkedToCurrentUser = (customerNameOrId = '') => {
    const customerKey = normalizeCredentialText(customerNameOrId);

    if (!customerKey) return false;
    if (currentCustomerKeys.includes(customerKey)) return true;

    return currentIdentityValues.includes(customerKey);
  };

  const isTaskAssignedOrFollowedByCurrentUser = (task = {}) =>
    isPeopleListLinkedToCurrentUser(task.assignees || []) ||
    isPeopleListLinkedToCurrentUser(task.followers || []) ||
    isRecordLinkedToCurrentUser({
      id: task.ownerId || task.creatorId || task.createdById,
      name: task.owner || task.creator || task.createdBy,
      email: task.ownerEmail || task.creatorEmail || task.createdByEmail
    });

  const isTaskVisibleForCurrentUser = (task = {}) => {
    if (currentAccountType === 'Patron') return true;

    if (currentAccountType === 'Ekip Üyesi') {
      return isTaskAssignedOrFollowedByCurrentUser(task);
    }

    if (currentAccountType === 'Müşteri') {
      return isCustomerLinkedToCurrentUser(task.customer || task.customerName || task.client || task.company);
    }

    return false;
  };

  const getProjectBoardForVisibility = (projectName) =>
    projectBoards[projectName] ||
    (projectName === selectedProject ? currentBoard : null);

  const isCurrentUserProjectMember = (projectName = '') => {
    const settings = projectSettings[projectName] || {};
    const teamMemberIds = Array.isArray(settings.teamMemberIds) ? settings.teamMemberIds.map(String) : [];

    if (!currentUserId || teamMemberIds.length === 0) return false;
    if (teamMemberIds.includes(String(currentUserId))) return true;

    if (isZrcAjansIdentityRecord(currentRoleMember)) {
      return teamMemberIds.some((memberId) => isZrcAjansIdentityRecord({ id: memberId }));
    }

    return false;
  };

  const isCurrentCustomerProject = (projectName = '') => {
    const settings = projectSettings[projectName] || {};

    return Boolean(
      currentAccountType === 'Müşteri' &&
      isCustomerLinkedToCurrentUser(settings.customerId || settings.customer || settings.customerName)
    );
  };

  const isTaskVisibleForProject = (task = {}, projectName = '') => {
    if (currentAccountType === 'Patron') return true;
    if (currentAccountType === 'Ekip Üyesi') return isCurrentUserProjectMember(projectName);
    if (currentAccountType === 'Müşteri') return isCurrentCustomerProject(projectName);

    return false;
  };

  const getCurrentStrictUserIdSet = () => {
    if (isSupabaseUuid(supabaseAuthUserId)) {
      return new Set([String(supabaseAuthUserId)]);
    }

    return new Set(
      [
        currentUserId,
        currentRoleMember?.id
      ]
        .filter(Boolean)
        .map((value) => String(value))
    );
  };

  const isPersonStrictlyCurrentUser = (person = {}) => {
    const currentIds = getCurrentStrictUserIdSet();

    return [
      person.id,
      person.userId,
      person.memberId,
      person.ownerId,
      person.creatorId,
      person.createdById
    ]
      .filter(Boolean)
      .some((value) => currentIds.has(String(value)));
  };

  const getTaskSupabaseRecordId = (task = {}) => {
    const directId = String(task.supabaseId || '').trim();
    if (directId) return directId;

    const rawId = String(task.id || '').trim();
    if (rawId.startsWith('supabase-')) return rawId.replace('supabase-', '').trim();

    return '';
  };

  const isTaskAssignedToCurrentUserForCalendar = (task = {}) => {
    const currentIds = getCurrentStrictUserIdSet();
    const taskSupabaseId = getTaskSupabaseRecordId(task);

    const assignedLookupUserId = isSupabaseUuid(supabaseAuthUserId)
      ? supabaseAuthUserId
      : (isSupabaseUuid(currentUserId) ? currentUserId : '');

    if (taskSupabaseId && assignedLookupUserId) {
      const rawAssigneeIds = Array.isArray(task.assigneeIds)
        ? task.assigneeIds.map((value) => String(value || '').trim()).filter(Boolean)
        : [];

      if (rawAssigneeIds.length > 0) {
        return rawAssigneeIds.includes(String(assignedLookupUserId));
      }

      return currentAssignedSupabaseTaskIds.map(String).includes(String(taskSupabaseId));
    }

    return Array.isArray(task.assignees) && task.assignees.some(isPersonStrictlyCurrentUser);
  };

  const isTaskVisibleInCalendarForCurrentUser = (task = {}, projectName = '') => {
    if (currentUserRole === 'Yönetici') return true;

    if (currentAccountType === 'Müşteri') {
      return isCurrentCustomerProject(projectName);
    }

    return isTaskAssignedToCurrentUserForCalendar(task);
  };

  const isTaskAssignedToCurrentUserForAction = (task = {}) =>
    isTaskAssignedToCurrentUserForCalendar(task);

  const canCurrentUserModifyTask = (task = {}, projectName = '') => {
    if (!task) return false;
    if (currentUserRole === 'Yönetici') return true;

    if (currentAccountType === 'Ekip Üyesi') {
      const taskProjectName = projectName || task.projectName || task.project || task.projectTitle || selectedProject;

      return Boolean(
        taskProjectName &&
        isCurrentUserProjectMember(taskProjectName) &&
        isTaskAssignedToCurrentUserForAction(task)
      );
    }

    return false;
  };

  const isCurrentUserAssignedToTask = (task = {}) =>
    currentAccountType === 'Ekip Üyesi' && isTaskAssignedToCurrentUserForAction(task);

  const isCurrentUserReadonlyTask = (task = {}, projectName = '') =>
    currentAccountType === 'Ekip Üyesi' &&
    isCurrentUserProjectMember(projectName || task.projectName || selectedProject) &&
    !isTaskAssignedToCurrentUserForAction(task);

  const getTaskAssigneeUserIdsForNotification = (task = {}) =>
    Array.from(
      new Set(
        [
          ...(Array.isArray(task.assigneeIds) ? task.assigneeIds : []),
          ...(Array.isArray(task.assignees) ? task.assignees.map((person) => person?.id || person?.userId) : [])
        ]
          .map((value) => String(value || '').trim())
          .filter(isSupabaseUuid)
      )
    );

  const isCurrentSupabaseUserId = (userId = '') =>
    isSupabaseUuid(currentUserId) && String(userId) === String(currentUserId);

    const isProjectVisibleForCurrentUser = (projectName = '') => {
    const cleanProjectName = String(projectName || '').trim();

    if (!cleanProjectName) return false;

    const isMainZrcOwner =
      isZrcOwnerAccount ||
      currentUserRole === 'Yönetici' ||
      currentAccountType === 'Patron' ||
      currentAccountType === 'Yönetici' ||
      String(currentUserId || '') === 'a7b13472-0efa-4dac-965f-5937c58b8794' ||
      String(supabaseAuthUserId || '') === 'a7b13472-0efa-4dac-965f-5937c58b8794';

    if (isMainZrcOwner) return true;

    if (currentAccountType === 'Ekip Üyesi') return isCurrentUserProjectMember(cleanProjectName);
    if (currentAccountType === 'Müşteri') return isCurrentCustomerProject(cleanProjectName);

    return false;
  };
  const isMainZrcProjectOwner =
    isZrcOwnerAccount ||
    currentUserRole === 'Yönetici' ||
    currentAccountType === 'Patron' ||
    currentAccountType === 'Yönetici' ||
    String(currentUserId || '') === 'a7b13472-0efa-4dac-965f-5937c58b8794' ||
    String(supabaseAuthUserId || '') === 'a7b13472-0efa-4dac-965f-5937c58b8794';

  const visibleProjectNames = isMainZrcProjectOwner
    ? (projects || []).filter(Boolean)
    : (projects || []).filter((projectName) => isProjectVisibleForCurrentUser(projectName));


  const moveMobileTaskToActiveColumn = async (taskToMove = {}, targetColumnId = '') => {
    const activeProjectName = selectedProject;

    if (!activeProjectName || !taskToMove?.id) return;

    const normalizedTargetColumnId = String(targetColumnId || '').trim();
    const normalizedTargetColumnTitle = normalizeColumnTitleForDisplay(normalizedTargetColumnId);

    const targetColumn = (boardColumns || []).find((column) => {
      const columnId = String(column?.id || '').trim();
      const columnTitle = normalizeColumnTitleForDisplay(column?.title || '');

      return (
        (normalizedTargetColumnId && columnId === normalizedTargetColumnId) ||
        (normalizedTargetColumnId && columnTitle === normalizedTargetColumnTitle) ||
        (!normalizedTargetColumnId && columnTitle === 'Aktif')
      );
    });

    if (!targetColumn) {
      await window.zrcAlert(normalizedTargetColumnId ? 'Hedef kolon bulunamadı.' : 'Aktif kolonu bulunamadı.');
      return;
    }

    const targetStatus = targetColumn.title || 'Aktif';
    const rawTaskId = String(taskToMove.id || '').trim();
    const taskSupabaseId = String(
      taskToMove.supabaseId ||
      taskToMove.supabase_id ||
      (rawTaskId.startsWith('supabase-') ? rawTaskId.replace('supabase-', '') : '') ||
      (isSupabaseUuid(rawTaskId) ? rawTaskId : '') ||
      ''
    ).trim();

    const movedTask = {
      ...taskToMove,
      projectName: activeProjectName,
      project: activeProjectName,
      status: targetStatus,
      columnId: targetColumn.id,
      columnTitle: targetStatus,
      columnColor: targetColumn.color,
      updatedAt: new Date().toISOString()
    };

    const isSameTask = (left = {}, right = {}) => {
      const leftId = String(left.id || '').trim();
      const rightId = String(right.id || '').trim();
      const leftSupabaseId = String(left.supabaseId || left.supabase_id || '').trim();
      const rightSupabaseId = String(right.supabaseId || right.supabase_id || '').trim();

      return Boolean(
        (leftId && rightId && leftId === rightId) ||
        (leftSupabaseId && rightSupabaseId && leftSupabaseId === rightSupabaseId) ||
        (leftSupabaseId && rightId === `supabase-${leftSupabaseId}`) ||
        (rightSupabaseId && leftId === `supabase-${rightSupabaseId}`)
      );
    };

    setProjectBoards((prevBoards) => {
      const existingBoard = prevBoards[activeProjectName] || createDefaultProjectBoard();

      const nextColumns = (existingBoard.columns || []).map((column) => ({
        ...column,
        tasks: (column.tasks || []).filter((task) => !isSameTask(task, movedTask))
      }));

      const targetIndex = nextColumns.findIndex((column) =>
        String(column?.id || '').trim() === String(targetColumn.id || '').trim() ||
        normalizeColumnTitleForDisplay(column?.title || '') === normalizeColumnTitleForDisplay(targetColumn.title || targetStatus)
      );

      if (targetIndex < 0) return prevBoards;

      nextColumns[targetIndex] = {
        ...nextColumns[targetIndex],
        tasks: [...(nextColumns[targetIndex].tasks || []), movedTask]
      };

      return {
        ...prevBoards,
        [activeProjectName]: {
          ...existingBoard,
          columns: nextColumns
        }
      };
    });

    try {
      const workspaceId = getCurrentSupabaseWorkspaceId();

      if (taskSupabaseId && workspaceId) {
        const projectId = await ensureSupabaseProject(activeProjectName);
        const targetColumnIndex = Math.max(
          0,
          (boardColumns || []).findIndex((column) =>
            String(column?.id || '').trim() === String(targetColumn.id || '').trim() ||
            normalizeColumnTitleForDisplay(column?.title || '') === normalizeColumnTitleForDisplay(targetColumn.title || targetStatus)
          )
        );
        const targetSupabaseColumnId = await ensureSupabaseColumn(projectId, targetColumn, targetColumnIndex);

        const { error } = await supabase
          .from('tasks')
          .update({
            column_id: targetSupabaseColumnId,
            status: targetStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', taskSupabaseId)
          .eq('workspace_id', workspaceId);

        if (error) throw error;
      } else {
        await saveTaskToSupabaseForProject(activeProjectName, movedTask, targetStatus);
      }

      zrcSetSupabaseWriteInfo('saved', 'Görev Aktif kolonuna taşındı');
      setTimeout(() => loadSelectedProjectBoardFromSupabase(), 700);
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Görev Aktif kolonuna taşınamadı: ${error?.message || 'bilinmeyen hata'}`);
    }
  };

  // Mobil görünüm dahil tüm görünür kolonlarda DB task_order sırası korunur.
  const visibleBoardColumns = boardColumns.map((column) => ({
    ...column,
    tasks: (
      (column.tasks || []).filter((task) => isTaskVisibleForProject(task, selectedProject))
    )
  }));

  // zrc-v454c-mobile-active-column-sync
  const mobileVisibleBoardColumnIds = visibleBoardColumns.map((column) => column.id).join('|');
  const mobileActiveColumnIndex = Math.max(0, visibleBoardColumns.findIndex((column) => column.id === mobileActiveColumnId));

  useEffect(() => {
    if (visibleBoardColumns.length === 0) {
      if (mobileActiveColumnId) setMobileActiveColumnId('');
      return;
    }

    const hasActiveColumn = visibleBoardColumns.some((column) => column.id === mobileActiveColumnId);

    if (!mobileActiveColumnId || !hasActiveColumn) {
      setMobileActiveColumnId(visibleBoardColumns[0].id);
    }
  }, [mobileVisibleBoardColumnIds, mobileActiveColumnId]);


  const visibleArchivedTasks = archivedTasks.filter((task) => isTaskVisibleForProject(task, selectedProject));

  const canCreateTaskInSelectedProject = Boolean(
    currentPermissions.createTasks &&
      selectedProject &&
      (
        currentAccountType === 'Patron' ||
        (currentAccountType === 'Ekip Üyesi' && isCurrentUserProjectMember(selectedProject))
      )
  );

  // Ana Sayfa takvimi için: seçili proje şartı aranmaz,
  // çünkü tıklayınca zaten proje seçici açılır.
  const canCreateTaskFromCalendar = Boolean(
    currentPermissions.createTasks &&
    currentAccountType !== 'Müşteri' &&
    visibleProjectNames.length > 0
  );

  const showProjectSettingsControls = Boolean(currentPermissions.manageProjectSettings || currentPermissions.manageProjects);
  const showTeamManagementPage = Boolean(currentPermissions.manageTeam);
  const showCustomerManagementPage = Boolean(currentPermissions.manageCustomers);
  const showDataManagementTab = currentAccountType === 'Patron';

  const visibleProjectTabs = [
    'Görevler',
    'Takvim',
    'Zaman Çizelgesi',
    'Dosyalar',
    'Gantt Çizelgesi',
    'Raporlar',
    ...(showProjectSettingsControls ? ['Ayarlar'] : [])
  ];

  const visibleProfileTabs = [
    'Hesap',
    'E-Posta Bildirimi',
    'Tarayıcı Bildirimi',
    'E-Posta Kutusu',
    'Özelleştirmeler',
    ...(showDataManagementTab ? ['Veri Yönetimi'] : []),
    'Oturumlar'
  ];

  useEffect(() => {
    if (activeContentMenu === 'Projeler' && !visibleProjectTabs.includes(activeTab)) {
      setActiveTab('Görevler');
      return;
    }

    if (activeContentMenu !== 'Diğer') return;

    if (activeTab === 'Ekip' && !showTeamManagementPage) {
      setActiveTab(showCustomerManagementPage ? 'Müşteriler' : 'Görevler');
      return;
    }

    if (activeTab === 'Müşteriler' && !showCustomerManagementPage) {
      setActiveTab(showTeamManagementPage ? 'Ekip' : 'Görevler');
    }
  }, [
    activeContentMenu,
    activeTab,
    visibleProjectTabs.join('|'),
    showTeamManagementPage,
    showCustomerManagementPage
  ]);

  useEffect(() => {
    if (!currentPermissions.manageColumns && isEditMode) {
      setIsEditMode(false);
      setOpenMenuColumnId(null);
    }
  }, [currentPermissions.manageColumns, isEditMode]);

  useEffect(() => {
    if (!visibleProfileTabs.includes(activeProfileTab)) {
      setActiveProfileTab('Hesap');
    }
  }, [activeProfileTab, visibleProfileTabs.join('|')]);

  const ensureCanCreateTaskInSelectedProject = async (permissionMessage = 'Bu rol görev oluşturamaz.') => {
    if (!requirePermission('createTasks', permissionMessage)) return false;

    if (!selectedProject) {
      await window.zrcAlert('Görev oluşturmak için önce proje seçmelisin.');
      return false;
    }

    if (currentAccountType === 'Ekip Üyesi' && !isCurrentUserProjectMember(selectedProject)) {
      await window.zrcAlert('Bu projede görev oluşturmak için önce Proje Ayarları > Proje Ekibi alanına eklenmelisin.');
      return false;
    }

    if (currentAccountType === 'Müşteri') {
      await window.zrcAlert('Müşteri/Misafir hesabı görev oluşturamaz.');
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!isLoggedIn || currentAccountType === 'Patron') return;
    if (!selectedProject) return;
    if (visibleProjectNames.includes(selectedProject)) return;

    setSelectedProject(visibleProjectNames[0] || '');
  }, [isLoggedIn, currentAccountType, selectedProject, visibleProjectNames.join('|')]);

  const getProjectNameFromChatGroupId = (chatGroupId = '') => {
    const text = String(chatGroupId || '');
    return text.startsWith('project-chat-') ? text.replace('project-chat-', '') : '';
  };

  const getProjectNameForTask = (task = {}) => {
    if (!task) return '';

    const directProjectName = task.projectName || task.project || task.projectTitle || task.boardName;
    if (directProjectName) return directProjectName;

    if (!task.id) return '';

    const selectedBoardHasTask = (currentBoard?.columns || []).some((column) =>
      (column.tasks || []).some((item) => item.id === task.id)
    ) || (currentBoard?.archivedTasks || []).some((item) => item.id === task.id);

    if (selectedBoardHasTask) return selectedProject;

    const matchedProject = projects.find((projectName) => {
      const board = projectBoards[projectName];

      if (!board) return false;

      const hasActiveTask = (board.columns || []).some((column) =>
        (column.tasks || []).some((item) => item.id === task.id)
      );
      const hasArchivedTask = (board.archivedTasks || []).some((item) => item.id === task.id);

      return hasActiveTask || hasArchivedTask;
    });

    return matchedProject || '';
  };

  const getProjectNameForFile = (file = {}) =>
    file.projectName || file.project || getProjectNameForTask(file.task) || selectedProject;

  const isTaskAccessibleForCurrentUser = (task = {}) => {
    if (!task) return false;

    const projectName = getProjectNameForTask(task);

    if (projectName) return isTaskVisibleForProject(task, projectName);

    return isTaskVisibleForCurrentUser(task);
  };

  const isProjectFileVisibleForCurrentUser = (file = {}) => {
    const projectName = getProjectNameForFile(file);

    if (!projectName) return currentAccountType === 'Patron';

    return isProjectVisibleForCurrentUser(projectName);
  };

  const getProjectNameForMessage = (message = {}) => {
    if (message.projectName) return message.projectName;
    if (message.chatGroupId) return getProjectNameFromChatGroupId(message.chatGroupId);
    if (message.taskId) return getProjectNameForTask(getMessageLinkedTask(message.taskId));

    return '';
  };

  const getProjectNameForNotification = (notification = {}) =>
    notification.projectName ||
    getProjectNameFromChatGroupId(notification.chatGroupId) ||
    getProjectNameForTask(notification.task);

  const guardProjectAccess = (projectName = '', message = 'Bu projeye erişim yetkin yok.') => {
    if (!projectName || isProjectVisibleForCurrentUser(projectName)) return true;

    showPermissionWarning(message);
    return false;
  };

  const isChatGroupVisibleForCurrentUser = (group = {}) => {
    if (currentAccountType === 'Patron') return true;

    if (group.type === 'project' || String(group.id || '').startsWith('project-chat-')) {
      const projectName = group.projectName || getProjectNameFromChatGroupId(group.id) || group.name;
      return isProjectVisibleForCurrentUser(projectName);
    }

    return isPeopleListLinkedToCurrentUser((group.members || []).map((member) =>
      typeof member === 'string' ? { name: member } : member
    ));
  };

  const isChatGroupIdVisibleForCurrentUser = (chatGroupId = '') => {
    if (!chatGroupId) return false;
    if (currentAccountType === 'Patron') return true;

    const projectName = getProjectNameFromChatGroupId(chatGroupId);

    if (projectName) {
      return isProjectVisibleForCurrentUser(projectName);
    }

    const group = chatGroups.find((item) => item.id === chatGroupId);
    return group ? isChatGroupVisibleForCurrentUser(group) : false;
  };

  const activeAdminCount = teamMembers.filter(
    (member) => member.status !== 'Pasif' && normalizeTeamRole(member.role) === 'Yönetici'
  ).length;

  const shouldShowPermissionWarnings = currentAccountType === 'Patron';

  async function showPermissionWarning(message = 'Bu işlem için yetkin yok.') {
    if (shouldShowPermissionWarnings) {
      await window.zrcAlert(message);
    }
  }

  

const {
    runSupabaseHealthCheck,
    buildSupabaseBackupSnapshot,
    downloadSupabaseBackupSnapshot,
    copySupabaseBackupSnapshot,
    ensureCanManageLocalData,
    copyCurrentDataSnapshot,
    downloadCurrentDataSnapshot,
    restoreDataSnapshot,
    handleDataImportFile
  } = createZRCDataManagementActions({
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
  });
const requirePermission = (permissionKey, message = 'Bu işlem için yetkin yok.') => {
    if (currentPermissions[permissionKey]) return true;

    showPermissionWarning(message);
    return false;
  };

  const isLastActiveAdmin = (member) =>
    member?.status !== 'Pasif' &&
    normalizeTeamRole(member.role) === 'Yönetici' &&
    activeAdminCount <= 1;

  const isCurrentProfileRecord = (record = {}) =>
    Boolean(currentActorId && currentActorId !== 'anonymous-user' && (
      record.userId === currentActorId ||
      record.senderId === currentActorId ||
      record.ownerId === currentActorId ||
      record.creatorId === currentActorId ||
      record.createdById === currentActorId ||
      record.memberId === currentActorId
    )) ||
    record.author === currentActorName ||
    record.sender === currentActorName ||
    record.actor === currentActorName;

  const getProfileNameForRecord = (record = {}, fallback = 'Ekip') =>
    isCurrentProfileRecord(record)
      ? currentProfileName
      : record.author || record.user || record.sender || record.actor || fallback;

  const getProfileAvatarForRecord = (record = {}, fallback = 'EK') =>
    isCurrentProfileRecord(record)
      ? currentProfileAvatar
      : record.avatar || fallback;

  const isCurrentProfileInUsers = (users = []) => isPeopleListLinkedToCurrentUser(users);



    const createActivityNotification = ({
    type = 'activity',
    title = 'Yeni aktivite',
    text = '',
    meta = '',
    task = null,
    columnTitle = '',
    projectName = selectedProject,
    chatGroupId = '',
    messageId = '',
    actor = currentProfileName,
    avatar = currentProfileAvatar,
    targetUserIds = [],
    recipientUserIds = [],
    sortWeight = 760
  }) => {
    const createdAt = new Date().toISOString();

    const nextNotification = {
      id: `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      source: 'activity',
      type,
      title,
      text,
      meta,
      task,
      taskId: task?.id || '',
      taskTitle: task?.title || '',
      columnTitle,
      projectName,
      chatGroupId,
      messageId,
      actor,
      avatar,
      userId: actor === currentProfileName ? currentActorId : '',
      targetUserIds,
      recipientUserIds,
      createdAt,
      dateLabel: getActivityDateLabel(createdAt),
      sortWeight
    };

    setActivityNotifications((prevNotifications) => [nextNotification, ...prevNotifications].slice(0, 80));
    zrcV448PlayDesktopNotificationSound();
    saveActivityNotificationToSupabase(nextNotification);

    return nextNotification;
  };

  const createHistoryEntry = (type, title, description = '') => {
    const now = new Date();

    return {
      id: `history-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      title,
      description,
      actor: currentProfileName,
      avatar: currentProfileAvatar,
      userId: currentActorId,
      date: `${now.getDate()} ${now.toLocaleString('tr-TR', { month: 'long' })} ${now.getFullYear()}`,
      time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTeamMemberById = (memberId = '') =>
    teamMembers.find((member) => member.id === memberId) || null;

  const getTeamMemberNameById = (memberId = '') =>
    getTeamMemberById(memberId)?.name || 'Bilinmeyen kişi';

  const createProjectTeamHistoryEntry = (type, title, description, memberIds = [], projectName = selectedProject) => {
    const now = new Date();

    return {
      id: `project-history-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      title,
      description,
      memberIds,
      projectName,
      actor: currentProfileName,
      avatar: currentProfileAvatar,
      userId: currentActorId,
      createdAt: now.toISOString(),
      date: `${now.getDate()} ${now.toLocaleString('tr-TR', { month: 'long' })} ${now.getFullYear()}`,
      time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const cleanTaskPeopleByProjectTeam = (people = [], allowedMemberIds = []) => {
    const allowedSet = new Set(allowedMemberIds);

    return (people || []).filter((person) => {
      if (!person?.id) return false;
      if (isZrcAjansIdentityRecord(person)) return true;

      return allowedSet.has(person.id);
    });
  };

  const syncProjectTasksWithTeam = (projectName, allowedMemberIds = [], removedMemberIds = []) => {
    if (!projectName || removedMemberIds.length === 0) return;

    const removedNames = removedMemberIds.map((memberId) => getTeamMemberNameById(memberId)).filter(Boolean);
    const historyDescription = `${removedNames.join(', ')} projeden çıkarıldığı için bu görevdeki görevli/takipçi listesinden temizlendi.`;

    const cleanTask = (task) => {
      const nextAssignees = cleanTaskPeopleByProjectTeam(task.assignees || [], allowedMemberIds);
      const nextFollowers = cleanTaskPeopleByProjectTeam(task.followers || [], allowedMemberIds);
      const assigneesChanged = nextAssignees.length !== (task.assignees || []).length;
      const followersChanged = nextFollowers.length !== (task.followers || []).length;

      if (!assigneesChanged && !followersChanged) return task;

      return {
        ...task,
        assignees: nextAssignees,
        followers: nextFollowers,
        history: [
          createHistoryEntry('project-team', 'Proje ekibi güncellendi', historyDescription),
          ...(task.history || [])
        ]
      };
    };

    setProjectBoards((prevBoards) => {
      const existingBoard = prevBoards[projectName] || createDefaultProjectBoard();

      return {
        ...prevBoards,
        [projectName]: {
          ...existingBoard,
          columns: (existingBoard.columns || []).map((column) => ({
            ...column,
            tasks: (column.tasks || []).map(cleanTask)
          })),
          archivedTasks: (existingBoard.archivedTasks || []).map(cleanTask)
        }
      };
    });

    setDetailTaskInfo((prevInfo) => {
      if (!prevInfo?.task) return prevInfo;

      const cleanedTask = cleanTask(prevInfo.task);

      if (cleanedTask === prevInfo.task) return prevInfo;

      return {
        ...prevInfo,
        task: cleanedTask
      };
    });
  };




















  // --- KART (GÖREV) İŞLEMLERİ ---

  // --- TOPLU İŞLEMLER ---





  // --- SÜRÜKLE BIRAK ---
  const draggedTaskInfo = useRef(null);
  const supabaseRealtimeRefreshTimer = useRef(null);





  const getProjectFileSecondaryText = (file = {}) =>
    buildProjectFileSecondaryText(file, {
      currentAccountType,
      selectedProject
    });

  const getProjectFileInfoRows = (file = {}) =>
    buildProjectFileInfoRows(file, {
      currentAccountType,
      selectedProject,
      currentProfileName
    });





  const projectFiles = visibleBoardColumns.flatMap((column) =>
    column.tasks.flatMap((task) =>
      (task.files || []).map((file) => ({
        ...file,
        fileKey: `${task.id}-${file.id || file.name}`,
        taskId: task.id,
        taskTitle: task.title,
        task,
        projectName: selectedProject,
        columnTitle: column.title,
        customer: task.customer || '-',
        priority: task.priority || 'Normal',
        columnColor: column.color
      }))
    )
  );

  const projectFileTypeOptions = ['Tümü', ...Array.from(new Set(projectFiles.map((file) => file.type || 'Dosya')))];
  const filteredProjectFiles = projectFiles.filter((file) => {
    const searchText = fileSearch.trim().toLocaleLowerCase('tr-TR');
    const matchesSearch =
      !searchText ||
      [file.name, file.taskTitle, file.columnTitle, file.customer, file.type, file.uploader]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(searchText));

    const matchesType = fileTypeFilter === 'Tümü' || (file.type || 'Dosya') === fileTypeFilter;

    return matchesSearch && matchesType;
  });

  const selectedProjectFile =
    filteredProjectFiles.find((file) => file.fileKey === selectedProjectFileKey) ||
    filteredProjectFiles[0] ||
    null;

  const projectFileTypeStats = projectFileTypeOptions
    .filter((type) => type !== 'Tümü')
    .map((type) => ({
      type,
      count: projectFiles.filter((file) => (file.type || 'Dosya') === type).length
    }));





  const projectFileEmptyTitle = projectFiles.length > 0 ? 'Eşleşen dosya yok' : 'Henüz dosya yok';
  const projectFileEmptyDescription =
    projectFiles.length > 0
      ? 'Arama veya filtreyi değiştirerek tekrar dene.'
      : currentAccountType === 'Patron'
        ? 'Görev detayındaki Dosyalar sekmesinden dosya eklediğinde burada proje geneli olarak görünür.'
        : 'Erişimin olan görevlerde paylaşılan dosyalar burada görünür.';

  const handleSelectProjectFile = (file) => {
    if (!isProjectFileVisibleForCurrentUser(file)) {
      showPermissionWarning('Bu dosyayı görüntüleme yetkin yok.');
      return;
    }

    setSelectedProjectFileKey(file.fileKey);
    setPendingFileDeleteKey(null);
  };

  const handleDeleteProjectFile = async (file) => {
    if (!file) return;
    if (!requirePermission('manageFiles', 'Bu rol dosya silemez.')) return;

    if (!isProjectFileVisibleForCurrentUser(file)) {
      showPermissionWarning('Bu dosyayı silme yetkin yok.');
      return;
    }

    const sourceTask =
      file.task ||
      reportTasks.find((task) => task.id === file.taskId) ||
      null;

    if (sourceTask && !canCurrentUserModifyTask(sourceTask, getProjectNameForTask(sourceTask) || file.projectName || selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için dosya silemezsin.');
      return;
    }

    if (pendingFileDeleteKey !== file.fileKey) {
      setPendingFileDeleteKey(file.fileKey);
      return;
    }

    zrcSetSupabaseWriteInfo('saving', 'Dosya siliniyor');

    if (file.storagePath) {
      const storageDeleted = await deleteTaskStoredFileFromSupabase(file);
      if (!storageDeleted) return;
    }

    const isSameFile = (taskFile) =>
      (taskFile.id || taskFile.name) === (file.id || file.name) ||
      (file.supabaseId && taskFile.supabaseId === file.supabaseId) ||
      (file.storagePath && taskFile.storagePath === file.storagePath);

    if (sourceTask?.id) {
      const nextFiles = (sourceTask.files || []).filter((taskFile) => !isSameFile(taskFile));

      updateTaskFromDetail(
        sourceTask.id,
        { files: nextFiles },
        createHistoryEntry('file-delete', 'Dosya silindi', file.name || 'Dosya')
      );
    } else {
      setBoardColumns((prevColumns) =>
        prevColumns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === file.taskId
              ? {
                  ...task,
                  files: (task.files || []).filter((taskFile) => !isSameFile(taskFile))
                }
              : task
          )
        }))
      );
    }

    setSelectedProjectFileKey(null);
    setPendingFileDeleteKey(null);
    zrcSetSupabaseWriteInfo('saved', 'Dosya silindi');
  };









  const getCalendarTaskAccentColor = (task = {}) =>
    task.isArchivedCalendarTask
      ? '#94a3b8'
      : task.columnColor ||
        projectSettings?.[task.projectName || selectedProject]?.color ||
        '#ff3600';





  const getPremiumCalendarTaskStyle = (task = {}) => {
    const accentColor = getCalendarTaskAccentColor(task);
    const surfaceColor = mixHexWithWhite(accentColor, task.isArchivedCalendarTask ? 0.84 : 0.78);

    return {
      backgroundColor: surfaceColor,
      borderColor: mixHexWithWhite(accentColor, 0.45),
      borderLeftColor: accentColor,
      color: '#1f2937'
    };
  };

  const getPremiumCalendarDotStyle = (task = {}) => ({
    backgroundColor: getCalendarTaskAccentColor(task)
  });

  const todayDate = new Date();
  const todayStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  const weekEndDate = new Date(todayStart);
  weekEndDate.setDate(todayStart.getDate() + 7);











  const visibleCalendarTasks = [
    ...visibleBoardColumns.flatMap((column) =>
      column.tasks
        .filter((task) => isTaskVisibleInCalendarForCurrentUser(task, selectedProject))
        .map((task) => {
          const startDate = getCalendarTaskStartDate(task);
          const endDate = getCalendarTaskEndDate(task);

          return {
            ...task,
            columnTitle: column.title,
            calendarStartDate: startDate,
            calendarEndDate: endDate,
            calendarSortDate: endDate || startDate,
            isArchivedCalendarTask: false
          };
        })
    ),
    ...(calendarDisplayOptions.hideArchivedTasks
      ? []
      : visibleArchivedTasks
          .filter((task) => isTaskVisibleInCalendarForCurrentUser(task, selectedProject))
          .map((task) => {
            const startDate = getCalendarTaskStartDate(task);
            const endDate = getCalendarTaskEndDate(task);

            return {
              ...task,
              columnTitle: task.sourceColumnTitle || 'Arşiv',
              calendarStartDate: startDate,
              calendarEndDate: endDate,
              calendarSortDate: endDate || startDate,
              isArchivedCalendarTask: true
            };
          }))
  ];

  const calendarTasks = visibleCalendarTasks
    .filter((task) => task.calendarStartDate || task.calendarEndDate)
    .filter((task) => !calendarDisplayOptions.hideCompletedTasks || !isTaskCompletedForCalendar(task))
    .filter((task) =>
      !calendarDisplayOptions.hideLongTasks ||
      !isTaskLongForCalendar(task) ||
      doesTaskOverlapCalendarRange(task, todayStart, new Date(tomorrowStart.getTime() - 1))
    )
    .sort((firstTask, secondTask) => {
      const firstTime = firstTask.calendarSortDate ? firstTask.calendarSortDate.getTime() : Number.MAX_SAFE_INTEGER;
      const secondTime = secondTask.calendarSortDate ? secondTask.calendarSortDate.getTime() : Number.MAX_SAFE_INTEGER;

      return firstTime - secondTime;
    });

  const overdueCalendarTasks = calendarTasks.filter(
    (task) => task.calendarEndDate && task.calendarEndDate < todayStart
  );

  const todayCalendarTasks = calendarTasks.filter((task) =>
    doesTaskOverlapCalendarRange(task, todayStart, new Date(tomorrowStart.getTime() - 1))
  );

  const weekCalendarTasks = calendarTasks.filter((task) =>
    doesTaskOverlapCalendarRange(task, tomorrowStart, weekEndDate)
  );

  const monthStartDate = new Date(calendarMonthDate.getFullYear(), calendarMonthDate.getMonth(), 1);
  const calendarGridStartDate = new Date(monthStartDate);
  const calendarStartOffset = (monthStartDate.getDay() + 6) % 7;
  calendarGridStartDate.setDate(monthStartDate.getDate() - calendarStartOffset);

  const calendarGridDays = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(calendarGridStartDate);
    day.setDate(calendarGridStartDate.getDate() + index);
    return day;
  });

  const getCalendarWeekStartDate = (date) => {
    const weekStart = new Date(date);
    const offset = (weekStart.getDay() + 6) % 7;
    weekStart.setDate(weekStart.getDate() - offset);
    return new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
  };

  const calendarWeekStartDate = getCalendarWeekStartDate(calendarFocusedDate);
  const calendarWeekDays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(calendarWeekStartDate);
    day.setDate(calendarWeekStartDate.getDate() + index);
    return day;
  });

  const monthTitle = new Intl.DateTimeFormat('tr-TR', {
    month: 'long',
    year: 'numeric'
  }).format(calendarMonthDate);

  const formatCalendarFullDate = (date) => {
    if (!date) return '';

    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const isSameCalendarDay = (firstDate, secondDate) => {
    if (!firstDate || !secondDate) return false;

    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  };

  const getTasksForCalendarDay = (day) => {
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    return calendarTasks.filter((task) => {
      const taskStart = task.calendarStartDate || task.calendarEndDate;
      const taskEnd = task.calendarEndDate || task.calendarStartDate;

      if (!taskStart || !taskEnd) return false;

      return taskStart <= dayEnd && taskEnd >= dayStart;
    });
  };

  const selectedDayCalendarTasks = getTasksForCalendarDay(calendarFocusedDate);

  const calendarHeaderTitle = (() => {
    if (calendarView === 'Hafta') {
      const weekEnd = new Date(calendarWeekStartDate);
      weekEnd.setDate(calendarWeekStartDate.getDate() + 6);
      return `${formatCalendarDate(calendarWeekStartDate)} - ${formatCalendarDate(weekEnd)}`;
    }

    if (calendarView === 'Gün') {
      return formatCalendarFullDate(calendarFocusedDate);
    }

    if (calendarView === 'Liste') {
      return 'Takvim Listesi';
    }

    return monthTitle;
  })();

  const getCalendarTaskBarStyle = (priority, isArchivedTask = false) => {
    if (isArchivedTask) return 'bg-slate-50 text-slate-500 border-slate-200 border-l-[3px] shadow-[0_8px_18px_rgba(15,23,42,0.045)]';

    return 'bg-white text-current border-[#dfe5ee] border-l-[3px] shadow-[0_8px_18px_rgba(15,23,42,0.055)] hover:border-[#cbd5e1] hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)]';
  };

  const getCalendarQuickTaskStatusOptions = (projectName = selectedProject) => {
    const projectBoard =
      projectBoards[projectName] ||
      (projectName === selectedProject ? currentBoard : null) ||
      createDefaultProjectBoard();

    return (projectBoard.columns || createDefaultProjectBoard().columns || []).map((column) => column.title);
  };

  const openCalendarQuickTaskCreator = (...args) =>
    openCalendarQuickTaskCreatorHelper(...args, {
      calendarTaskOpenLockRef,
      currentAccountType,
      formatDateForTaskModal,
      projectBoards,
      requirePermission,
      selectedProject,
      setCalendarFocusedDate,
      setCalendarNewTaskDate,
      setCalendarTaskModalContext,
      setEditingTask,
      setIsTaskModalOpen,
      setSelectedProject,
      visibleProjectNames
    });






  useEffect(() => {
    if (!calendarTaskModalContext.pendingOpen || !calendarTaskModalContext.projectName) return;

    setCalendarTaskModalContext((prevContext) => ({
      ...prevContext,
      isOpen: true,
      pendingOpen: false
    }));
    setIsTaskModalOpen(true);
  }, [
    calendarTaskModalContext.pendingOpen,
    calendarTaskModalContext.projectName
  ]);

  const reportTasks = visibleBoardColumns.flatMap((column) =>
    column.tasks.map((task) => ({
      ...task,
      columnTitle: column.title,
      columnColor: column.color
    }))
  );

  // zrc-notification-cross-device-count-v1
  // Bildirim butonu sayısı mobil/masaüstü farklı seçili projelerde de aynı kalsın diye
  // takvim/görev kaynaklı bildirimler sadece seçili projeden değil, erişilebilir tüm proje panolarından hesaplanır.
  const zrcNotificationReportTasks = (() => {
    const allVisibleProjectTasks = Object.entries(projectBoards || {})
      .filter(([projectName, board]) =>
        String(projectName || '').trim() &&
        Array.isArray(board?.columns) &&
        isProjectVisibleForCurrentUser(projectName)
      )
      .flatMap(([projectName, board]) =>
        (board.columns || []).flatMap((column) =>
          (column.tasks || []).map((task) => ({
            ...task,
            projectName,
            columnTitle: column.title,
            columnColor: column.color
          }))
        )
      );

    if (allVisibleProjectTasks.length > 0) return allVisibleProjectTasks;

    return reportTasks.map((task) => ({
      ...task,
      projectName: task.projectName || selectedProject
    }));
  })();






  const reportTotalTasks = reportTasks.length;
  const reportCompletedTasks = reportTasks.filter(isReportTaskCompleted).length;
  const reportOpenTasks = Math.max(reportTotalTasks - reportCompletedTasks, 0);
  const reportArchivedCount = visibleArchivedTasks.length;
  const reportProgressPercentage = getReportPercentage(reportCompletedTasks, reportTotalTasks);
  const reportOverdueTasks = reportTasks.filter((task) => {
    const taskDate = getReportTaskDate(task);
    return taskDate && taskDate < todayStart && !isReportTaskCompleted(task);
  });
  const reportUrgentTasks = reportTasks.filter((task) => task.priority === 'Acil' || task.priority === 'Yüksek');
  const reportFileCount = projectFiles.length;
  const reportCustomerCount = new Set(reportTasks.map((task) => task.customer).filter(Boolean)).size;

  const getRoleAwareTaskMeta = (task = {}) => {
    const statusText = task.columnTitle || task.status || 'Durum yok';

    if (currentAccountType === 'Patron') {
      return `${task.customer || '-'} · ${statusText}`;
    }

    return `${getProjectNameForTask(task) || selectedProject || 'Proje'} · ${statusText}`;
  };

  const scheduleSearchPlaceholder =
    currentAccountType === 'Patron'
      ? 'Kullanıcı veya görev ara...'
      : 'Görev veya durum ara...';

  const ganttSearchPlaceholder =
    currentAccountType === 'Patron'
      ? 'Görev, müşteri veya kolon ara...'
      : 'Görev veya kolon ara...';

  const reportIntroText =
    currentAccountType === 'Patron'
      ? 'Projenin görev, öncelik, tarih ve kolon durumunu hızlıca incele.'
      : 'Erişimin olan görevlerin tarih, öncelik ve durum özetini incele.';

  const calendarDayHelperText =
    canCreateTaskInSelectedProject
      ? 'Boş alana basınca bu güne görev eklenir.'
      : 'Bu günün görünür görevleri aşağıda listelenir.';

  const reportPriorityTitle =
    currentAccountType === 'Müşteri' ? 'Durum Önceliği' : 'Öncelik Dağılımı';

  const reportPriorityDescription =
    currentAccountType === 'Müşteri'
      ? 'Size açık görevlerin öncelik görünümü.'
      : 'Görevlerin öncelik yoğunluğu.';

  const reportPriorityStats = ['Acil', 'Yüksek', 'Normal', 'Düşük'].map((priority) => {
    const count = reportTasks.filter((task) => task.priority === priority).length;

    return {
      priority,
      count,
      percentage: getReportPercentage(count, reportTotalTasks)
    };
  });

  const reportColumnStats = visibleBoardColumns.map((column) => ({
    id: column.id,
    title: column.title,
    color: column.color,
    count: column.tasks.length,
    percentage: getReportPercentage(column.tasks.length, reportTotalTasks)
  }));

  const reportUpcomingTasks = reportTasks
    .map((task) => ({
      ...task,
      reportDate: getReportTaskDate(task)
    }))
    .filter((task) => task.reportDate && task.reportDate >= todayStart && !isReportTaskCompleted(task))
    .sort((firstTask, secondTask) => firstTask.reportDate.getTime() - secondTask.reportDate.getTime())
    .slice(0, 5);


  const reportSummaryCards = [
    {
      title: 'Toplam Görev',
      value: reportTotalTasks,
      description: 'Aktif görev havuzu',
      tone: 'bg-zinc-100 text-zinc-700'
    },
    {
      title: 'Tamamlanan',
      value: reportCompletedTasks,
      description: `${reportProgressPercentage}% ilerleme`,
      tone: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Geciken',
      value: reportOverdueTasks.length,
      description: 'Bitiş tarihi geçmiş',
      tone: 'bg-red-50 text-red-600'
    },
    {
      title: 'Arşiv',
      value: reportArchivedCount,
      description: 'Arşivlenmiş görev',
      tone: 'bg-zinc-100 text-zinc-600'
    }
  ];

  const timelineTasks = reportTasks
    .map((task) => {
      const startDate = parseTaskDateValue(task.startDate || task.start || task.baslangicTarihi);
      const endDate = parseTaskDateValue(task.endDate || task.dueDate || task.deadline || task.bitisTarihi || task.date);
      const timelineDate = endDate || startDate;

      return {
        ...task,
        timelineStartDate: startDate,
        timelineEndDate: endDate,
        timelineDate
      };
    })
    .filter((task) => task.timelineDate)
    .sort((firstTask, secondTask) => firstTask.timelineDate.getTime() - secondTask.timelineDate.getTime());

  const timelineUndatedTasks = reportTasks.filter((task) => {
    const startDate = parseTaskDateValue(task.startDate || task.start || task.baslangicTarihi);
    const endDate = parseTaskDateValue(task.endDate || task.dueDate || task.deadline || task.bitisTarihi || task.date);

    return !startDate && !endDate;
  });

  const timelineOverdueTasks = timelineTasks.filter(
    (task) => task.timelineEndDate && task.timelineEndDate < todayStart && !isReportTaskCompleted(task)
  );

  const timelineThisWeekTasks = timelineTasks.filter((task) => {
    const date = task.timelineDate;
    return date && date >= todayStart && date <= weekEndDate;
  });

  const timelineGroupedTasks = timelineTasks.reduce((groups, task) => {
    const monthKey = new Intl.DateTimeFormat('tr-TR', {
      month: 'long',
      year: 'numeric'
    }).format(task.timelineDate);

    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(task);

    return groups;
  }, {});

  const timelineSummaryCards = [
    {
      title: 'Tarihli Görev',
      value: timelineTasks.length,
      description: 'Takvime bağlı işler'
    },
    {
      title: 'Bu Hafta',
      value: timelineThisWeekTasks.length,
      description: 'Yaklaşan işler'
    },
    {
      title: 'Geciken',
      value: timelineOverdueTasks.length,
      description: 'Kontrol gerekenler'
    },
    {
      title: 'Tarihsiz',
      value: timelineUndatedTasks.length,
      description: 'Planlanmamış işler'
    }
  ];

  const getTimelineStatusText = (task) => {
    if (isReportTaskCompleted(task)) return 'Tamamlandı';
    if (task.timelineEndDate && task.timelineEndDate < todayStart) return 'Gecikti';
    if (task.timelineDate && isSameCalendarDay(task.timelineDate, todayStart)) return 'Bugün';

    return task.status || 'Aktif';
  };

  const getTimelineStatusStyle = (task) => {
    if (isReportTaskCompleted(task)) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (task.timelineEndDate && task.timelineEndDate < todayStart) return 'bg-red-50 text-red-600 border-red-100';
    if (task.timelineDate && isSameCalendarDay(task.timelineDate, todayStart)) return 'bg-zinc-100 text-zinc-700 border-blue-100';

    return 'bg-zinc-50 text-zinc-500 border-zinc-100';
  };





  const timeChartPeriods = Array.from(
    { length: timeChartView === 'Gün' ? 14 : 8 },
    (_, index) => {
      if (timeChartView === 'Gün') {
        const day = new Date(timeChartStartDate);
        day.setDate(timeChartStartDate.getDate() + index);

        return {
          key: getTimeChartDateKey(day),
          type: 'day',
          start: new Date(day.getFullYear(), day.getMonth(), day.getDate()),
          end: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999),
          title: String(day.getDate()),
          subtitle: formatCalendarWeekday(day),
          date: day
        };
      }

      const weekStart = getStartOfWeekForTimeChart(timeChartStartDate);
      weekStart.setDate(weekStart.getDate() + index * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return {
        key: getTimeChartDateKey(weekStart),
        type: 'week',
        start: weekStart,
        end: weekEnd,
        title: `${formatCalendarDate(weekStart)} - ${formatCalendarDate(weekEnd)}`,
        subtitle: 'Hafta',
        date: weekStart
      };
    }
  ).filter((period) => timeChartSettings.showWeekends || period.type === 'week' || (period.date.getDay() !== 0 && period.date.getDay() !== 6));

  const timeChartEndDate = timeChartPeriods[timeChartPeriods.length - 1]?.end || timeChartStartDate;

  const timeChartRangeTitle = timeChartView === 'Gün'
    ? `${formatCalendarDate(timeChartPeriods[0]?.start || timeChartStartDate)} - ${formatCalendarDate(timeChartEndDate)}`
    : `${formatCalendarDate(timeChartPeriods[0]?.start || timeChartStartDate)} - ${formatCalendarDate(timeChartEndDate)}`;

  const timeChartProjectMemberIds = Array.isArray(projectSettings[selectedProject]?.teamMemberIds)
    ? projectSettings[selectedProject].teamMemberIds
    : [];

  const isHiddenTimeChartMember = (member = {}) => {
    const normalize = (value = '') =>
      String(value || '')
        .trim()
        .toLocaleLowerCase('tr-TR')
        .replaceAll('ı', 'i')
        .replaceAll('ğ', 'g')
        .replaceAll('ü', 'u')
        .replaceAll('ş', 's')
        .replaceAll('ö', 'o')
        .replaceAll('ç', 'c')
        .replace(/[^a-z0-9@._-]/g, '');

    const id = String(member.id || '');
    const username = normalize(member.username || '');
    const name = normalize(member.name || '');
    const email = normalize(member.email || '');

    return (
      ['user-2', 'user-3', 'user-4', 'user-5'].includes(id) ||
      ['enes', 'ahmet', 'zeynep', 'can', 'misafir'].includes(username) ||
      ['eneszaric', 'ahmetyilmaz', 'zeynepkaya', 'canoz', 'demomisafir'].includes(name) ||
      ['enes@zrcajans.com', 'enszrc@gmail.com', 'ahmet@zrcajans.com', 'zeynep@zrcajans.com', 'can@zrcajans.com', 'misafir@orneksirket.com'].includes(email)
    );
  };

  const zrcAjansTimelineMember = {
    id: 'user-1',
    name: 'ZRC AJANS',
    username: 'zrcajans',
    email: 'info@zrcajans.com',
    avatar: currentProfileAvatar || 'ZRC',
    role: 'Yönetici',
    status: 'Aktif'
  };

  const timeChartAssignableMembers = Array.from(
    new Map(
      [
        ...teamMembers
          .filter((member) => member.status !== 'Pasif')
          .filter((member) => normalizeTeamRole(member.role) !== 'Müşteri/Misafir')
          .filter((member) => !isHiddenTimeChartMember(member)),
        zrcAjansTimelineMember
      ]
        .filter((member) => member?.id)
        .map((member) => [
          String(member.id),
          {
            id: member.id,
            name: member.name,
            avatar: member.avatar || createAvatarFromName(member.name),
            role: normalizeTeamRole(member.role || 'Yönetici')
          }
        ])
    ).values()
  );

  const timeChartProjectMembers = timeChartProjectMemberIds.length > 0
    ? timeChartAssignableMembers.filter((member) => timeChartProjectMemberIds.includes(member.id))
    : timeChartAssignableMembers;
  const timeChartMembers = timeChartProjectMembers.length > 0 ? timeChartProjectMembers : timeChartAssignableMembers;

  const getTimeChartTaskOwnerId = (task = {}) => {
    const assignedPerson = Array.isArray(task.assignees)
      ? task.assignees.find((person) => person?.id && timeChartMembers.some((member) => member.id === person.id))
      : null;

    return assignedPerson?.id || currentRoleMember?.id || currentActorId;
  };













  const isTimeChartTaskInRange = (task) => {
    return timeChartPeriods.some((period) => doesTimeChartTaskOverlapPeriod(task, period));
  };



  const openTaskModalForTimeChartPeriod = (period, event = null) => {
    const targetDate = period.type === 'week' ? period.start : period.date;
    openCalendarQuickTaskCreator(targetDate, event);
  };

  const scrollTimeChart = (direction) => {
    if (!timeChartScrollRef.current) return;

    timeChartScrollRef.current.scrollBy({
      left: direction === 'right' ? 520 : -520,
      behavior: 'smooth'
    });
  };

  const timeChartAllTasks = [
    ...reportTasks
      .filter((task) => isTaskVisibleInCalendarForCurrentUser(task, selectedProject))
      .map((task) => ({
        ...task,
        isArchivedTimeChartTask: false,
        ownerId: getTimeChartTaskOwnerId(task)
      })),
    ...(timeChartFilters.hideArchived
      ? []
      : archivedTasks
          .filter((task) => isTaskVisibleInCalendarForCurrentUser(task, selectedProject))
          .map((task) => ({
            ...task,
            columnTitle: task.sourceColumnTitle || 'Arşiv',
            columnColor: '#94a3b8',
            isArchivedTimeChartTask: true,
            ownerId: getTimeChartTaskOwnerId(task)
          })))
  ];

  const timeChartFilteredTasks = timeChartAllTasks
    .filter((task) => !timeChartFilters.hideCompleted || !isReportTaskCompleted(task))
    .filter((task) => !timeChartFilters.hideNoDate || Boolean(getTimeChartTaskDate(task)))
    .filter((task) => {
      const searchText = timeChartSearch.trim().toLocaleLowerCase('tr-TR');
      if (!searchText) return true;

      return [
        task.title,
        currentAccountType === 'Patron' ? task.customer : null,
        task.columnTitle,
        task.priority,
        task.status
      ]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(searchText));
    })
    .filter(isTimeChartTaskInRange);

  const getTimeChartTasksForMemberAndPeriod = (memberId, period) => {
    return timeChartFilteredTasks.filter((task) => {
      return task.ownerId === memberId && doesTimeChartTaskOverlapPeriod(task, period);
    });
  };

  const goToPreviousTimeChartPeriod = () => {
    setTimeChartStartDate((prevDate) => {
      const nextDate = new Date(prevDate);
      nextDate.setDate(prevDate.getDate() - (timeChartView === 'Hafta' ? 28 : 7));
      return nextDate;
    });
  };

  const goToNextTimeChartPeriod = () => {
    setTimeChartStartDate((prevDate) => {
      const nextDate = new Date(prevDate);
      nextDate.setDate(prevDate.getDate() + (timeChartView === 'Hafta' ? 28 : 7));
      return nextDate;
    });
  };

  const goToCurrentTimeChartPeriod = () => {
    const now = new Date();

    if (timeChartView === 'Hafta') {
      const offset = (now.getDay() + 6) % 7;
      setTimeChartStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset));
      return;
    }

    setTimeChartStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3));
  };

  const changeTimeChartView = (view) => {
    const now = new Date(timeChartStartDate);

    setTimeChartView(view);

    if (view === 'Hafta') {
      const offset = (now.getDay() + 6) % 7;
      setTimeChartStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset));
      return;
    }

    setTimeChartStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3));
  };

  const toggleTimeChartFilter = (key) => {
    setTimeChartFilters((prevFilters) => ({
      ...prevFilters,
      [key]: !prevFilters[key]
    }));
  };

  const toggleTimeChartSetting = (key) => {
    setTimeChartSettings((prevSettings) => ({
      ...prevSettings,
      [key]: !prevSettings[key]
    }));
  };

  const getGanttPeriodConfig = () => {
    if (ganttView === 'Ay') return { count: 6, width: 170 };
    if (ganttView === 'Hafta') return { count: 10, width: 180 };

    return { count: 21, width: 126 };
  };

  const getGanttPeriodStart = (date) => {
    if (ganttView === 'Ay') {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    if (ganttView === 'Hafta') {
      const weekStart = new Date(date);
      const offset = (weekStart.getDay() + 6) % 7;
      weekStart.setDate(weekStart.getDate() - offset);
      weekStart.setHours(0, 0, 0, 0);
      return weekStart;
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const getGanttPeriods = () => {
    const { count } = getGanttPeriodConfig();
    const startDate = getGanttPeriodStart(ganttStartDate);

    return Array.from({ length: count }, (_, index) => {
      const periodStart = new Date(startDate);

      if (ganttView === 'Ay') {
        periodStart.setMonth(startDate.getMonth() + index);
        const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0, 23, 59, 59, 999);

        return {
          key: formatDateForTaskModal(periodStart),
          start: periodStart,
          end: periodEnd,
          title: new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(periodStart),
          subtitle: String(periodStart.getFullYear())
        };
      }

      if (ganttView === 'Hafta') {
        periodStart.setDate(startDate.getDate() + index * 7);
        const periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6);
        periodEnd.setHours(23, 59, 59, 999);

        return {
          key: formatDateForTaskModal(periodStart),
          start: periodStart,
          end: periodEnd,
          title: `${formatCalendarDate(periodStart)} - ${formatCalendarDate(periodEnd)}`,
          subtitle: 'Hafta'
        };
      }

      periodStart.setDate(startDate.getDate() + index);
      const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth(), periodStart.getDate(), 23, 59, 59, 999);

      return {
        key: formatDateForTaskModal(periodStart),
        start: periodStart,
        end: periodEnd,
        title: String(periodStart.getDate()),
        subtitle: formatCalendarWeekday(periodStart)
      };
    });
  };

  const ganttPeriods = getGanttPeriods();
  const ganttPeriodConfig = getGanttPeriodConfig();
  const ganttRangeStart = ganttPeriods[0]?.start || ganttStartDate;
  const ganttRangeEnd = ganttPeriods[ganttPeriods.length - 1]?.end || ganttStartDate;
  const ganttRangeTitle = `${formatCalendarDate(ganttRangeStart)} - ${formatCalendarDate(ganttRangeEnd)}`;





  const doesGanttTaskOverlapRange = (task) => {
    const startDate = task.ganttStartDate;
    const endDate = task.ganttEndDate;

    if (!startDate || !endDate) return false;

    return startDate <= ganttRangeEnd && endDate >= ganttRangeStart;
  };

  const ganttAllTasks = reportTasks
    .filter((task) => isTaskVisibleInCalendarForCurrentUser(task, selectedProject))
    .map((task) => {
      const startDate = getGanttTaskStartDate(task);
      const endDate = getGanttTaskEndDate(task);

      return {
        ...task,
        ganttStartDate: startDate,
        ganttEndDate: endDate
      };
    });

  const ganttTasks = ganttAllTasks
    .filter((task) => task.ganttStartDate || task.ganttEndDate)
    .filter((task) => ganttShowCompleted || !isReportTaskCompleted(task))
    .filter((task) => {
      const searchText = ganttSearch.trim().toLocaleLowerCase('tr-TR');
      if (!searchText) return true;

      return [task.title, currentAccountType === 'Patron' ? task.customer : null, task.columnTitle, task.priority, task.status]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(searchText));
    })
    .filter(doesGanttTaskOverlapRange)
    .sort((firstTask, secondTask) => {
      const firstTime = firstTask.ganttStartDate?.getTime() || Number.MAX_SAFE_INTEGER;
      const secondTime = secondTask.ganttStartDate?.getTime() || Number.MAX_SAFE_INTEGER;

      return firstTime - secondTime;
    });

  const ganttUndatedTasks = ganttAllTasks
    .filter((task) => !task.ganttStartDate && !task.ganttEndDate)
    .filter((task) => {
      const searchText = ganttSearch.trim().toLocaleLowerCase('tr-TR');
      if (!searchText) return true;

      return [task.title, currentAccountType === 'Patron' ? task.customer : null, task.columnTitle, task.priority, task.status]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(searchText));
    });

  const getGanttTaskPlacement = (task) => {
    const firstIndex = ganttPeriods.findIndex((period) => task.ganttEndDate >= period.start && task.ganttStartDate <= period.end);
    const reversedIndex = [...ganttPeriods]
      .reverse()
      .findIndex((period) => task.ganttEndDate >= period.start && task.ganttStartDate <= period.end);

    if (firstIndex < 0 || reversedIndex < 0) {
      return { columnStart: 1, span: 1 };
    }

    const lastIndex = ganttPeriods.length - 1 - reversedIndex;

    return {
      columnStart: firstIndex + 1,
      span: Math.max(lastIndex - firstIndex + 1, 1)
    };
  };

  const getGanttBarClassName = (task) => {
    if (isReportTaskCompleted(task)) return 'bg-emerald-100 text-emerald-700 border-emerald-200 opacity-70';
    if (task.ganttEndDate && task.ganttEndDate < todayStart) return 'bg-red-100 text-red-700 border-red-200';
    if (task.priority === 'Acil') return 'bg-red-100 text-red-700 border-red-200';
    if (task.priority === 'Yüksek') return 'bg-zinc-900 text-white border-zinc-900';
    if (task.priority === 'Düşük') return 'bg-emerald-100 text-emerald-700 border-emerald-200';

    return 'bg-zinc-900 text-white border-zinc-900';
  };

  const goToPreviousGanttPeriod = () => {
    setGanttStartDate((prevDate) => {
      const nextDate = new Date(prevDate);

      if (ganttView === 'Ay') {
        nextDate.setMonth(prevDate.getMonth() - 3);
        return nextDate;
      }

      nextDate.setDate(prevDate.getDate() - (ganttView === 'Hafta' ? 28 : 7));
      return nextDate;
    });
  };

  const goToNextGanttPeriod = () => {
    setGanttStartDate((prevDate) => {
      const nextDate = new Date(prevDate);

      if (ganttView === 'Ay') {
        nextDate.setMonth(prevDate.getMonth() + 3);
        return nextDate;
      }

      nextDate.setDate(prevDate.getDate() + (ganttView === 'Hafta' ? 28 : 7));
      return nextDate;
    });
  };

  const goToCurrentGanttPeriod = () => {
    const now = new Date();

    if (ganttView === 'Ay') {
      setGanttStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
      return;
    }

    if (ganttView === 'Hafta') {
      const offset = (now.getDay() + 6) % 7;
      setGanttStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset));
      return;
    }

    setGanttStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3));
  };

  const changeGanttView = (view) => {
    setGanttView(view);

    const now = new Date(ganttStartDate);

    if (view === 'Ay') {
      setGanttStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
      return;
    }

    if (view === 'Hafta') {
      const offset = (now.getDay() + 6) % 7;
      setGanttStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset));
      return;
    }

    setGanttStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3));
  };

  const scrollGantt = (direction) => {
    if (!ganttScrollRef.current) return;

    ganttScrollRef.current.scrollBy({
      left: direction === 'right' ? 520 : -520,
      behavior: 'smooth'
    });
  };







  const isNotificationVisibleForCurrentUser = (notification = {}) => {
    if (currentAccountType === 'Patron') return true;

    const notificationProjectName = getProjectNameForNotification(notification);

    if (notificationProjectName && !isProjectVisibleForCurrentUser(notificationProjectName)) return false;
    if (notification.task && !isTaskAccessibleForCurrentUser(notification.task)) return false;
    if (notification.chatGroupId && !isChatGroupIdVisibleForCurrentUser(notification.chatGroupId)) return false;

    if (
      notification.source === 'activity' &&
      !notification.task &&
      !notification.projectName &&
      !notification.chatGroupId
    ) {
      return isRecordLinkedToCurrentUser(notification);
    }

    return true;
  };

  const notificationItems = [
    ...activityNotifications.map((notification) => ({
      ...notification,
      task: notification.task || null,
      dateLabel: notification.dateLabel || getActivityDateLabel(notification.createdAt),
      sortWeight: notification.sortWeight || 720
    })),
    ...zrcNotificationReportTasks.flatMap((task) => {
      const taskDate = getNotificationTaskDate(task);
      const items = [];

      if (taskDate && taskDate < todayStart && !isReportTaskCompleted(task)) {
        items.push({
          id: `overdue-${task.id}`,
          source: 'calendar',
          type: 'overdue',
          title: 'Geciken görev',
          text: task.title,
          meta: `${task.columnTitle} · ${getNotificationDateLabel(taskDate)}`,
          dateLabel: getNotificationDateLabel(taskDate),
          date: taskDate.toISOString(),
          time: taskDate.toISOString(),
          sortWeight: 500,
          task,
          projectName: task.projectName || selectedProject,
          columnTitle: task.columnTitle
        });
      }

      if (taskDate && isSameCalendarDay(taskDate, todayStart)) {
        items.push({
          id: `today-${task.id}`,
          source: 'calendar',
          type: 'today',
          title: 'Bugünün görevi',
          text: task.title,
          meta: `${task.columnTitle} · Bugün`,
          dateLabel: 'Bugün',
          date: taskDate.toISOString(),
          time: taskDate.toISOString(),
          sortWeight: 420,
          task,
          projectName: task.projectName || selectedProject,
          columnTitle: task.columnTitle
        });
      }

      if (taskDate && taskDate > todayStart && taskDate <= weekEndDate && !isReportTaskCompleted(task)) {
        items.push({
          id: `soon-${task.id}`,
          source: 'calendar',
          type: 'soon',
          title: 'Yaklaşan görev',
          text: task.title,
          meta: `${task.columnTitle} · ${getNotificationDateLabel(taskDate)}`,
          dateLabel: getNotificationDateLabel(taskDate),
          date: taskDate.toISOString(),
          time: taskDate.toISOString(),
          sortWeight: 360,
          task,
          projectName: task.projectName || selectedProject,
          columnTitle: task.columnTitle
        });
      }

      return items;
    })
  ]
    .filter(isNotificationVisibleForCurrentUser)
    .filter((item, index, self) => self.findIndex((existingItem) => existingItem.id === item.id) === index)
    .sort((firstItem, secondItem) => {
      const firstDate = firstItem.createdAt ? new Date(firstItem.createdAt).getTime() : 0;
      const secondDate = secondItem.createdAt ? new Date(secondItem.createdAt).getTime() : 0;

      if (firstDate !== secondDate) return secondDate - firstDate;

      return (secondItem.sortWeight || 0) - (firstItem.sortWeight || 0);
    })
    .slice(0, 32);

  const zrcCoreIsPushSubscriptionNotification = (notification = {}) => {
    const haystack = [
      notification.type,
      notification.title,
      notification.text,
      notification.meta,
      notification.projectName
    ]
      .map((value) => String(value || '').toLowerCase())
      .join(' ');

    if (haystack.includes('push subscription')) return true;
    if (haystack.includes('subscription') && haystack.includes('endpoint')) return true;

    return false;
  };

  const zrcCoreNotificationTimeMs = (notification = {}) => {
    const values = [
      notification.createdAt,
      notification.created_at,
      notification.updatedAt,
      notification.updated_at,
      notification.timestamp,
      notification.date,
      notification.time
    ];

    for (const value of values) {
      const parsed = Date.parse(String(value || ''));
      if (Number.isFinite(parsed)) return parsed;
    }

    return 0;
  };

  const zrcCoreClearedBeforeMs = (ids = []) => {
    let maxValue = 0;

    for (const rawValue of ids || []) {
      const value = String(rawValue || '');
      const isClearedBefore = value.startsWith('cleared-before:');
      const isClearAll = value.startsWith('clear-all:');

      if (!isClearedBefore && !isClearAll) continue;

      const prefix = isClearAll ? 'clear-all:' : 'cleared-before:';
      const parsed = Date.parse(value.slice(prefix.length));

      if (Number.isFinite(parsed)) maxValue = Math.max(maxValue, parsed);
    }

    return maxValue;
  };

  const zrcCoreIsNotificationHidden = (notification = {}, ids = []) => {
    if (zrcCoreIsPushSubscriptionNotification(notification)) return true;

    const clearedBeforeMs = zrcCoreClearedBeforeMs(ids);
    const notificationTimeMs = zrcCoreNotificationTimeMs(notification);

    if (clearedBeforeMs && (!notificationTimeMs || notificationTimeMs <= clearedBeforeMs)) return true;

    return false;
  };

  // zrc-notification-clear-sync-core-v1
  // Uzak cihazdan gelen bildirim temizleme bilgisini tek listeye çevirir.
  // Böylece bir cihazda "Temizle" basılınca diğer cihazda id, key ve cleared-before tokenları aynı anda uygulanır.
  const zrcCoreBuildRemoteNotificationClearIds = (preferences = {}) => {
    const readIds = normalizeStorageArray(preferences.readNotificationIds || [], []);
    const clearedIds = normalizeStorageArray(preferences.clearedNotificationIds || [], []);
    const clearedKeys = normalizeStorageArray(preferences.clearedNotificationKeys || [], []);

    const clearedBeforeValue =
      preferences.notificationClearAllAt ||
      preferences.notificationsClearAllAt ||
      preferences.notificationsClearedBefore ||
      preferences.notificationsClearedAt ||
      preferences.notificationClearVersion ||
      '';

    const nextIds = new Set(readIds.map(String));

    clearedIds.forEach((id) => {
      const value = String(id || '').trim();
      if (!value) return;

      nextIds.add(value);
      nextIds.add(`cleared:${value}`);

      if (value.startsWith('supabase-notification-')) {
        const cleanId = value.replace('supabase-notification-', '');
        if (cleanId) {
          nextIds.add(cleanId);
          nextIds.add(`cleared:${cleanId}`);
        }
      } else {
        nextIds.add(`supabase-notification-${value}`);
        nextIds.add(`cleared:supabase-notification-${value}`);
      }
    });

    clearedKeys.forEach((key) => {
      const value = String(key || '').trim();
      if (!value) return;

      nextIds.add(`cleared-key:${value}`);
    });

    if (clearedBeforeValue) {
      nextIds.add(`cleared-before:${clearedBeforeValue}`);
      nextIds.add(`clear-all:${clearedBeforeValue}`);
    }

    return Array.from(nextIds);
  };

  const zrcCoreApplyRemoteNotificationClearState = (preferences = {}) => {
    const remoteIds = zrcCoreBuildRemoteNotificationClearIds(preferences);

    if (remoteIds.length === 0) return;

    setReadNotificationIds((prevIds) => Array.from(new Set([...(prevIds || []), ...remoteIds])));

    const clearedIdSet = new Set();
    const clearedKeySet = new Set();

    remoteIds.forEach((rawValue) => {
      const value = String(rawValue || '');

      if (value.startsWith('cleared:')) {
        const cleanId = value.slice('cleared:'.length);
        if (cleanId) clearedIdSet.add(cleanId);
      }

      if (value.startsWith('cleared-key:')) {
        const cleanKey = value.slice('cleared-key:'.length);
        if (cleanKey) clearedKeySet.add(cleanKey);
      }
    });

    if (clearedIdSet.size === 0 && clearedKeySet.size === 0) return;

    setActivityNotifications((prevNotifications) =>
      (prevNotifications || []).filter((notification) => {
        const rawId = String(notification?.id || '').trim();
        const idVariants = new Set();

        if (rawId) {
          idVariants.add(rawId);

          if (rawId.startsWith('supabase-notification-')) {
            const cleanId = rawId.replace('supabase-notification-', '');
            if (cleanId) idVariants.add(cleanId);
          } else {
            idVariants.add(`supabase-notification-${rawId}`);
          }
        }

        const fingerprint = [
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

        if (Array.from(idVariants).some((id) => clearedIdSet.has(String(id)))) return false;
        if (clearedKeySet.has(String(fingerprint))) return false;

        return true;
      })
    );
  };



  useEffect(() => {
    if (!isLoggedIn || !supabase || !supabaseWorkspaceId || !currentUserId) return undefined;

    let cancelled = false;

    const zrcSyncNotificationClearsAcrossDevices = async () => {
      try {
        const { data: preferencesRecord, error } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('workspace_id', supabaseWorkspaceId)
          .eq('user_id', currentUserId)
          .maybeSingle();

        if (cancelled || error) return;

        const preferences = normalizeStorageObject(preferencesRecord?.preferences || {}, {});
        const remoteReadNotificationIds = zrcCoreBuildRemoteNotificationClearIds(preferences);

        if (remoteReadNotificationIds.length === 0) return;

        setReadNotificationIds((prevIds) =>
          Array.from(new Set([...(prevIds || []), ...remoteReadNotificationIds]))
        );

        zrcCoreApplyRemoteNotificationClearState(preferences);
      } catch (error) {
        console.warn('[ZRC] Bildirim temizleme senkronu atlandı.', error);
      }
    };

    zrcSyncNotificationClearsAcrossDevices();
    const intervalId = window.setInterval(zrcSyncNotificationClearsAcrossDevices, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isLoggedIn, supabase, supabaseWorkspaceId, currentUserId]);



  // zrc-notification-live-sync-v1
  // Bildirim sayısı ve okundu bilgisi mobil/masaüstü aynı anda yürüsün diye
  // notifications, activity_logs ve user_preferences için ayrı hızlı senkron katmanı.
  useEffect(() => {
    if (!isLoggedIn || authSessionLoading || !supabase || !supabaseWorkspaceId || !isSupabaseUuid(currentUserId)) return undefined;

    let cancelled = false;
    let syncTimer = null;
    let syncRunning = false;
    let syncQueued = false;

    const syncRemoteReadNotificationIds = async () => {
      try {
        const { data: preferencesRecord, error } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('workspace_id', supabaseWorkspaceId)
          .eq('user_id', currentUserId)
          .maybeSingle();

        if (cancelled || error) return;

        const preferences = normalizeStorageObject(preferencesRecord?.preferences || {}, {});
        const remoteReadNotificationIds = zrcCoreBuildRemoteNotificationClearIds(preferences);

        if (remoteReadNotificationIds.length === 0) return;

        setReadNotificationIds((prevIds) =>
          Array.from(new Set([...(prevIds || []), ...remoteReadNotificationIds]))
        );

        zrcCoreApplyRemoteNotificationClearState(preferences);
      } catch (error) {
        console.warn('[ZRC] Canlı bildirim okundu senkronu atlandı.', error);
      }
    };

    const runNotificationSyncNow = async () => {
      if (cancelled) return;

      if (syncRunning) {
        syncQueued = true;
        return;
      }

      syncRunning = true;

      try {
        await loadActivityLogsFromSupabase();
        await syncRemoteReadNotificationIds();
      } finally {
        syncRunning = false;

        if (syncQueued && !cancelled) {
          syncQueued = false;
          scheduleNotificationSync(90);
        }
      }
    };

    const scheduleNotificationSync = (delay = 120) => {
      if (cancelled) return;

      if (syncTimer) {
        window.clearTimeout(syncTimer);
      }

      syncTimer = window.setTimeout(runNotificationSyncNow, delay);
    };

    const shouldSyncPayloadForCurrentUser = (payload = {}) => {
      const row = payload.new || payload.old || {};

      if (!row) return true;
      if (row.workspace_id && String(row.workspace_id) !== String(supabaseWorkspaceId)) return false;
      if (row.user_id && String(row.user_id) !== String(currentUserId)) return false;

      return true;
    };

    const channel = supabase.channel(`zrc-notification-live-sync-${supabaseWorkspaceId}-${currentUserId}`);

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUserId}`
        },
        (payload) => {
          if (shouldSyncPayloadForCurrentUser(payload)) scheduleNotificationSync(80);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs',
          filter: `workspace_id=eq.${supabaseWorkspaceId}`
        },
        () => scheduleNotificationSync(140)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_preferences',
          filter: `user_id=eq.${currentUserId}`
        },
        (payload) => {
          if (shouldSyncPayloadForCurrentUser(payload)) scheduleNotificationSync(80);
        }
      )
      .subscribe();

    scheduleNotificationSync(80);

    const fallbackInterval = window.setInterval(() => {
      scheduleNotificationSync(80);
    }, 4000);

    return () => {
      cancelled = true;

      if (syncTimer) {
        window.clearTimeout(syncTimer);
      }

      window.clearInterval(fallbackInterval);
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, authSessionLoading, supabase, supabaseWorkspaceId, currentUserId]);



  // zrc-stable-clear-all-preference-sync-v1
  // Diğer cihazda "Temizle" basılınca readNotificationIds içindeki clear-all tokenını bu cihaza taşır.
  useEffect(() => {
    if (!isLoggedIn || authSessionLoading || !supabase || !supabaseWorkspaceId || !isSupabaseUuid(currentUserId)) return undefined;

    let cancelled = false;
    let timerId = null;

    const readRemoteNotificationPreferences = async () => {
      try {
        const { data: preferencesRecord, error } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('workspace_id', supabaseWorkspaceId)
          .eq('user_id', currentUserId)
          .maybeSingle();

        if (cancelled || error) return;

        const preferences = normalizeStorageObject(preferencesRecord?.preferences || {}, {});
        const remoteIds = Array.from(new Set([
          ...normalizeStorageArray(preferences.readNotificationIds || [], []),
          ...(preferences.notificationClearAllAt ? [`clear-all:${preferences.notificationClearAllAt}`, `cleared-before:${preferences.notificationClearAllAt}`] : []),
          ...(preferences.notificationsClearAllAt ? [`clear-all:${preferences.notificationsClearAllAt}`, `cleared-before:${preferences.notificationsClearAllAt}`] : []),
          ...(preferences.notificationsClearedBefore ? [`cleared-before:${preferences.notificationsClearedBefore}`, `clear-all:${preferences.notificationsClearedBefore}`] : [])
        ]));

        if (remoteIds.length === 0) return;

        setReadNotificationIds((prevIds) => Array.from(new Set([...(prevIds || []), ...remoteIds])));
      } catch (error) {
        console.warn('[ZRC] Bildirim temizleme tercihi okunamadı.', error);
      }
    };

    const scheduleRead = (delay = 120) => {
      if (cancelled) return;

      if (timerId) {
        window.clearTimeout(timerId);
      }

      timerId = window.setTimeout(readRemoteNotificationPreferences, delay);
    };

    const channel = supabase.channel(`zrc-stable-notification-clear-${supabaseWorkspaceId}-${currentUserId}`);

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_preferences',
          filter: `user_id=eq.${currentUserId}`
        },
        () => scheduleRead(80)
      )
      .subscribe();

    scheduleRead(80);
    const intervalId = window.setInterval(() => scheduleRead(80), 2500);

    return () => {
      cancelled = true;

      if (timerId) {
        window.clearTimeout(timerId);
      }

      window.clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, authSessionLoading, supabase, supabaseWorkspaceId, currentUserId]);

  const unreadNotificationCount = notificationItems.filter(
    (item) => !zrcCoreIsNotificationHidden(item, readNotificationIds) && !readNotificationIds.includes(item.id)
  ).length;

  // zrc-notification-title-badge-v317
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const count = Number(unreadNotificationCount || 0);
    const label = count > 99 ? '99+' : String(count);

    document.title = count > 0 ? `(${label}) ZRC Portal` : 'ZRC Portal';
  }, [unreadNotificationCount]);


  const notificationEmptyDescription =
    currentAccountType === 'Patron'
      ? 'Yeni görev, ekip, müşteri ve proje hareketleri burada görünür.'
      : currentAccountType === 'Müşteri'
        ? 'Size açık projelerdeki yeni yorum, dosya ve durum hareketleri burada görünür.'
        : 'Dahil olduğun projelerdeki yeni görev, yorum ve mesaj hareketleri burada görünür.';

  const notificationPanelSummary =
    unreadNotificationCount > 0
      ? `${unreadNotificationCount} okunmamış bildirim`
      : currentAccountType === 'Patron'
        ? 'Tüm bildirimler okundu'
        : 'Size ait yeni bildirim yok';

  const getProjectMessageDateLabel = (createdAt) => {
    if (!createdAt) return 'Şimdi';

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return createdAt;

    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getMessageLinkedTask = (taskId) => {
    if (!taskId) return null;
    return reportTasks.find((task) => task.id === taskId) || null;
  };

  const isProjectMessageVisibleForCurrentUser = (message = {}) => {
    if (currentAccountType === 'Patron') return true;

    const messageProjectName = getProjectNameForMessage(message);

    if (messageProjectName && !isProjectVisibleForCurrentUser(messageProjectName)) return false;

    if (message.taskId) {
      const linkedTask = getMessageLinkedTask(message.taskId);
      return Boolean(linkedTask && isTaskAccessibleForCurrentUser(linkedTask));
    }

    if (message.chatGroupId) {
      return isChatGroupIdVisibleForCurrentUser(message.chatGroupId);
    }

    return isRecordLinkedToCurrentUser(message);
  };

  const messageTaskOptions = reportTasks
    .filter((task) => !isReportTaskCompleted(task))
    .filter(isTaskAccessibleForCurrentUser)
    .slice(0, 24);

  const selectedMessageTask = getMessageLinkedTask(messageLinkedTaskId);

  const messageItems = [
    ...projectMessages.filter(isProjectMessageVisibleForCurrentUser).map((message) => {
      const linkedTask = getMessageLinkedTask(message.taskId);

      return {
        ...message,
        source: 'message',
        sender: getProfileNameForRecord(message, message.sender || currentActorName),
        avatar: getProfileAvatarForRecord(message, message.avatar || currentProfileInitials),
        title: getProfileNameForRecord(message, message.sender || currentActorName),
        text: message.text || '',
        meta: linkedTask ? linkedTask.title : 'Genel proje mesajı',
        task: linkedTask,
        projectName: getProjectNameForMessage(message) || getProjectNameForTask(linkedTask),
        columnTitle: linkedTask?.columnTitle,
        createdAt: message.createdAt || '',
        sortDate: message.createdAt ? new Date(message.createdAt).getTime() : 0
      };
    }),
    ...reportTasks.flatMap((task) =>
      (task.comments || []).slice(-2).map((comment) => ({
        id: `task-comment-message-${task.id}-${comment.id || comment.date || comment.text}`,
        source: 'comment',
        sender: getProfileNameForRecord(comment, 'Ekip'),
        avatar: getProfileAvatarForRecord(comment, 'EK'),
        title: getProfileNameForRecord(comment, 'Ekip'),
        text: comment.text || comment.message || 'Yorum eklendi',
        meta: task.title,
        task,
        projectName: selectedProject,
        columnTitle: task.columnTitle,
        createdAt: comment.createdAt || comment.date || '',
        sortDate: comment.createdAt ? new Date(comment.createdAt).getTime() : 0
      }))
    )
  ]
    .filter((message, index, self) => self.findIndex((item) => item.id === message.id) === index)
    .sort((firstMessage, secondMessage) => secondMessage.sortDate - firstMessage.sortDate)
    .slice(0, 28);

  const unreadMessageCount = messageItems.filter((message) => !readMessageIds.includes(message.id)).length;

  const globalSearchPlaceholder =
    currentAccountType === 'Patron'
      ? 'Görev, dosya, müşteri, yorum veya kolon ara...'
      : currentAccountType === 'Müşteri'
        ? 'Projenizdeki görev, dosya veya yorumlarda ara...'
        : 'Dahil olduğun projelerde görev, dosya veya yorum ara...';

  const getGlobalSearchTaskSubtitle = (task = {}) =>
    currentAccountType === 'Patron'
      ? `${task.columnTitle || task.status || 'Durum yok'} · ${task.customer || 'Müşteri yok'}`
      : `${task.columnTitle || task.status || 'Durum yok'} · ${getProjectNameForTask(task) || selectedProject || 'Proje'}`;

  const getGlobalSearchFileMeta = (file = {}) =>
    currentAccountType === 'Patron'
      ? `${file.customer || '-'} · ${formatProjectFileSize(file.size)}`
      : `${file.projectName || selectedProject || 'Proje'} · ${formatProjectFileSize(file.size)}`;

  const globalSearchItems = [
    ...reportTasks.map((task) => ({
      id: `task-${task.id}`,
      type: 'Görev',
      title: task.title || 'Adsız görev',
      subtitle: getGlobalSearchTaskSubtitle(task),
      meta: `${task.priority || 'Normal'} · ${task.endDate || task.date || task.startDate || 'Tarih yok'}`,
      searchText: [
        task.title,
        task.customer,
        task.columnTitle,
        task.status,
        task.priority,
        getPlainTaskDescription(task.description),
        getPlainTaskDescription(task.richDescription),
        task.tags
      ].join(' '),
      task,
      projectName: selectedProject,
      columnTitle: task.columnTitle,
      sortWeight: isReportTaskCompleted(task) ? 120 : 260
    })),
    ...projectFiles.map((file) => ({
      id: `file-${file.fileKey}`,
      type: 'Dosya',
      title: file.name || 'Adsız dosya',
      subtitle: `${file.taskTitle || 'Görev yok'} · ${file.type || 'Dosya'}`,
      meta: getGlobalSearchFileMeta(file),
      searchText: [file.name, file.type, file.taskTitle, file.columnTitle, file.customer, file.uploader].join(' '),
      file,
      task: file.task,
      projectName: file.projectName || selectedProject,
      columnTitle: file.columnTitle,
      sortWeight: 220
    })),
    ...reportTasks.flatMap((task) =>
      (task.comments || []).map((comment) => ({
        id: `comment-${task.id}-${comment.id || comment.date || comment.text}`,
        type: 'Yorum',
        title: comment.text || comment.message || 'Yorum',
        subtitle: task.title || 'Görev',
        meta: `${comment.author || comment.user || 'Kullanıcı'} · ${comment.date || 'Tarih yok'}`,
        searchText: [comment.text, comment.message, comment.author, comment.user, task.title, task.customer, task.columnTitle].join(' '),
        task,
        projectName: selectedProject,
        columnTitle: task.columnTitle,
        sortWeight: 190
      }))
    ),
    ...reportTasks.flatMap((task) =>
      (task.files || []).flatMap((file) =>
        file.notes
          ? [
              {
                id: `file-note-${task.id}-${file.id || file.name}`,
                type: 'Not',
                title: file.notes,
                subtitle: file.name || task.title,
                meta: `${task.columnTitle || 'Kolon yok'} · Dosya notu`,
                searchText: [file.notes, file.name, task.title, task.customer, task.columnTitle].join(' '),
                task,
                projectName: selectedProject,
                columnTitle: task.columnTitle,
                sortWeight: 150
              }
            ]
          : []
      )
    )
  ];

  const globalSearchFilterOptions =
    currentAccountType === 'Müşteri'
      ? ['Tümü', 'Görev', 'Dosya', 'Yorum']
      : ['Tümü', 'Görev', 'Dosya', 'Yorum', 'Not'];

  useEffect(() => {
    if (!globalSearchFilterOptions.includes(globalSearchFilter)) {
      setGlobalSearchFilter('Tümü');
    }
  }, [globalSearchFilter, globalSearchFilterOptions.join('|')]);

  const filteredGlobalSearchItems = globalSearchItems
    .filter((item, index, self) => self.findIndex((existingItem) => existingItem.id === item.id) === index)
    .filter((item) => currentAccountType !== 'Müşteri' || item.type !== 'Not')
    .filter((item) => globalSearchFilter === 'Tümü' || item.type === globalSearchFilter)
    .filter((item) => {
      const query = normalizeSearchText(globalSearchQuery.trim());
      if (!query) return item.type === 'Görev';

      return normalizeSearchText(`${item.title} ${item.subtitle} ${item.meta} ${item.searchText}`).includes(query);
    })
    .sort((firstItem, secondItem) => {
      if (!globalSearchQuery.trim()) {
        const firstDate = getNotificationTaskDate(firstItem.task)?.getTime() || 0;
        const secondDate = getNotificationTaskDate(secondItem.task)?.getTime() || 0;

        return secondDate - firstDate;
      }

      return secondItem.sortWeight - firstItem.sortWeight;
    })
    .slice(0, globalSearchQuery.trim() ? 30 : 10);



  const activeTeamMembers = teamMembers.filter((member) => member.status !== 'Pasif');
  const passiveTeamMembers = teamMembers.filter((member) => member.status === 'Pasif');

  const isLegacyDemoTaskPerson = (person = {}) => {
    const id = String(person.id || '');
    const username = normalizeCredentialText(person.username || '');
    const name = normalizeCredentialText(person.name || '');
    const email = normalizeCredentialText(person.email || '');

    return (
      ['user-2', 'user-3', 'user-4', 'user-5'].includes(id) ||
      ['enes', 'ahmet', 'zeynep', 'can', 'misafir'].includes(username) ||
      ['eneszaric', 'ahmetyilmaz', 'zeynepkaya', 'canoz', 'demomisafir'].includes(name) ||
      ['enes@zrcajans.com', 'enszrc@gmail.com', 'ahmet@zrcajans.com', 'zeynep@zrcajans.com', 'can@zrcajans.com', 'misafir@orneksirket.com'].includes(email)
    );
  };

  const realActiveTeamMembers = activeTeamMembers.filter((member) => !isLegacyDemoTaskPerson(member));
  const storedZrcAjansMember =
    realActiveTeamMembers.find((member) => isZrcAjansIdentityRecord(member)) ||
    teamMembers.find((member) => isZrcAjansIdentityRecord(member)) ||
    null;

  const zrcCanonicalId =
    currentAccountType === 'Patron' && isSupabaseUuid(supabaseAuthUserId)
      ? supabaseAuthUserId
      : (isSupabaseUuid(storedZrcAjansMember?.id)
        ? storedZrcAjansMember.id
        : (storedZrcAjansMember?.id || 'user-1'));

  const zrcAjansSystemMember = {
    id: zrcCanonicalId,
    name: 'ZRC AJANS',
    username: 'zrcajans',
    email: 'info@zrcajans.com',
    avatar:
      currentAccountType === 'Patron'
        ? currentProfileAvatar || storedZrcAjansMember?.avatar || 'ZRC'
        : storedZrcAjansMember?.avatar || 'ZRC',
    role: 'Yönetici',
    status: 'Aktif',
    workspaceId: storedZrcAjansMember?.workspaceId || currentRoleMember?.workspaceId || ''
  };

  const realActiveTeamMembersWithoutLocalZrc = realActiveTeamMembers.filter(
    (member) => !isZrcAjansIdentityRecord(member)
  );

  const zrcTaskSelectableMembers = Array.from(
    new Map(
      [zrcAjansSystemMember, ...realActiveTeamMembersWithoutLocalZrc]
        .filter((member) => member?.id)
        .map((member) => [String(member.id), member])
    ).values()
  );
  const projectAssignableMembers = zrcTaskSelectableMembers.filter(
    (member) => normalizeTeamRole(member.role) !== 'Müşteri/Misafir'
  );
  const projectTeamAssignableMembers = projectAssignableMembers.filter(
    (member) => !isZrcAjansIdentityRecord(member)
  );

  

const {
    handleSaveProjectSettings,
    handleArchiveProject,
    handleDeleteProject
  } = createZRCProjectSettingsActions({
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
  });
const selectedProjectSettings = projectSettings[selectedProject] || createDefaultProjectSettings(selectedProject);
  const draftProjectTeamMemberIds = Array.isArray(projectSettingsDraft?.teamMemberIds)
    ? projectSettingsDraft.teamMemberIds
    : selectedProjectSettings.teamMemberIds;

  const selectedProjectTeamMemberIds = Array.isArray(draftProjectTeamMemberIds)
    ? draftProjectTeamMemberIds
        .map(String)
        .filter((memberId) => projectTeamAssignableMembers.some((member) => String(member.id) === memberId))
    : [];

  const selectedProjectTeamMembers = projectTeamAssignableMembers.filter((member) =>
    selectedProjectTeamMemberIds.includes(String(member.id))
  );

  const availableProjectTeamMembers = projectTeamAssignableMembers.filter(
    (member) => !selectedProjectTeamMemberIds.includes(String(member.id))
  );

  const currentTaskModalMember =
    projectAssignableMembers.find((member) => String(member.id || '') === String(currentUserId || '')) ||
    projectAssignableMembers.find((member) => String(member.id || '') === String(supabaseAuthUserId || '')) ||
    (currentRoleMember && !isZrcAjansIdentityRecord(currentRoleMember) ? currentRoleMember : null);

  const taskModalTeamMembers =
    currentAccountType === 'Ekip Üyesi'
      ? projectAssignableMembers
      : projectAssignableMembers;

  const normalizeTaskPersonForSave = (person = {}, allowedRoles = []) => {
    if (!person?.id && !person?.name) return null;

    if (isZrcAjansIdentityRecord(person)) {
      return zrcAjansSystemMember;
    }

    const matchedMember = zrcTaskSelectableMembers.find((member) => String(member.id) === String(person.id));
    if (!matchedMember) return null;

    if (allowedRoles.length > 0) {
      const role = normalizeTeamRole(matchedMember.role);
      if (!allowedRoles.includes(role)) return null;
    }

    return {
      id: matchedMember.id,
      name: matchedMember.name,
      username: matchedMember.username || '',
      email: matchedMember.email || '',
      avatar: matchedMember.avatar || createAvatarFromName(matchedMember.name),
      role: normalizeTeamRole(matchedMember.role)
    };
  };

  const uniqueTaskPeopleById = (people = []) =>
    Array.from(
      new Map(
        (people || [])
          .filter((person) => person?.id)
          .map((person) => [String(person.id), person])
      ).values()
    );

  const filterTaskAssigneesForSave = (people = []) =>
    uniqueTaskPeopleById(
      (people || [])
        .map((person) => normalizeTaskPersonForSave(person, ['Yönetici', 'Ekip Üyesi']))
        .filter(Boolean)
    );

  const getCurrentMemberForTaskAssignee = () => {
    if (currentRoleMember && !isZrcAjansIdentityRecord(currentRoleMember)) {
      return normalizeTaskPersonForSave(currentRoleMember, ['Ekip Üyesi']);
    }

    return (
      projectAssignableMembers.find((member) => String(member.id || '') === String(currentUserId || '')) ||
      projectAssignableMembers.find((member) => String(member.id || '') === String(supabaseAuthUserId || '')) ||
      null
    );
  };

  const normalizeAssigneesForCurrentAccountSave = (people = [], previousAssignees = [], isEditingExistingTask = false) => {
    const cleanedAssignees = filterTaskAssigneesForSave(people);
    if (currentAccountType !== 'Ekip Üyesi') return cleanedAssignees;

    const currentMember = getCurrentMemberForTaskAssignee();

    if (cleanedAssignees.length > 0) {
      return cleanedAssignees;
    }

    return uniqueTaskPeopleById(currentMember ? [currentMember] : []);
  };

  



const {
    goToPreviousCalendarPeriod,
    goToNextCalendarPeriod,
    goToCurrentCalendarPeriod,
    changeCalendarView,
    handleCalendarDayClick,
    handleCalendarGridClick,
    changeCalendarTaskModalProject,
    openTaskModalForCalendarDay,
    closeCalendarQuickTaskCreator,
    updateCalendarQuickTaskProject,
    saveCalendarQuickTaskFromModal
  } = createZRCCalendarActions({
    calendarView,
    calendarFocusedDate,
    setCalendarFocusedDate,
    setCalendarMonthDate,
    setCalendarView,
    setIsCalendarDisplayMenuOpen,
    openCalendarQuickTaskCreator,
    setSelectedProject,
    setCalendarTaskModalContext,
    setCalendarQuickTaskDraft,
    setCalendarNewTaskDate,
    getCalendarQuickTaskStatusOptions,
    calendarQuickTaskDraft,
    formatDateForTaskModal,
    currentAccountType,
    isCurrentUserProjectMember,
    projectBoards,
    createDefaultProjectBoard,
    normalizeAssigneesForCurrentAccountSave,
    setProjectBoards,
    createActivityNotification,
    saveTaskToSupabaseForProject
  });
const {
    openAddStageModal,
    openEditStageModal,
    handleMoveColumn,
    handleSaveStage,
    handleDeleteColumn,
    handleCopyColumn,
    handleArchiveColumnTasks,
    handleArchiveColumn,
    openTaskDetail,
    closeTaskDetail,
    editTaskFromDetail,
    updateTaskFromDetail,
    addTaskComment,
    deleteTaskComment,
    handleMoveTaskToColumn,
    handleTaskAction,
    handleBulkDelete,
    handleBulkArchive,
    handleRestoreArchivedTask,
    handleDeleteArchivedTask,
    handleDragStart,
    handleDragOverTaskPreview,
    handleDrop
  } = createZRCBoardTaskActions({
    requirePermission,
    setEditingColumn,
    setIsStageModalOpen,
    setOpenMenuColumnId,
    boardColumns,
    setBoardColumns,
    editingColumn,
    normalizeColumnTitleForDisplay,
    selectedProject,
    normalizeStorageArray,
    readStorageValue,
    writeStorageValue,
    setMobileActiveColumnId,
    setZrcMobileColumnRefreshKey,
    saveStageToSupabase,
    setTimeout,
    loadSelectedProjectBoardFromSupabase,
    getCurrentSupabaseWorkspaceId,
    zrcSetSupabaseWriteInfo,
    ensureSupabaseProject,
    supabase,
    isSupabaseUuid,
    currentActorName,
    currentActorAvatar,
    currentActorId,
    setArchivedTasks,
    archiveSupabaseTask,
    isTaskAccessibleForCurrentUser,
    showPermissionWarning,
    setOpenTaskMenuId,
    setDetailTaskInfo,
    detailTaskInfo,
    currentAccountType,
    isCurrentUserProjectMember,
    canCurrentUserModifyTask,
    getProjectNameForTask,
    setEditingTask,
    setIsTaskModalOpen,
    reportTasks,
    createActivityNotification,
    getProfileNameForRecord,
    currentProfileName,
    getProfileAvatarForRecord,
    currentProfileAvatar,
    getTaskAssigneeUserIdsForNotification,
    isCurrentSupabaseUserId,
    syncTaskDetailsToSupabase,
    createHistoryEntry,
    currentPermissions,
    updateSupabaseTaskColumn,
    ensureCanCreateTaskInSelectedProject,
    normalizeAssigneesForCurrentAccountSave,
    setSelectedTasks,
    deleteSupabaseTask,
    selectedTasks,
    restoreSupabaseTask,
    archivedTasks,
    draggedTaskInfo
  });
const filterTaskFollowersForSave = (people = []) =>
    uniqueTaskPeopleById(
      (people || [])
        .map((person) => {
          if (!person?.id && !person?.name) return null;

          const personId = String(person.id || '');
          if (personId.startsWith('customer-')) return person;

          return normalizeTaskPersonForSave(person);
        })
        .filter(Boolean)
    );

  const {
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
  } = createZRCTeamCustomerActions({
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
    selectedCustomerId
  });








  const activeCustomers = customers.filter((customer) => customer.status !== 'Pasif');
  const passiveCustomers = customers.filter((customer) => customer.status === 'Pasif');

  const customerTaskStatsByName = reportTasks.reduce((acc, task) => {
    const customerName = task.customer || 'Müşteri belirtilmemiş';

    if (!acc[customerName]) {
      acc[customerName] = {
        total: 0,
        completed: 0,
        active: 0,
        overdue: 0
      };
    }

    acc[customerName].total += 1;

    if (isReportTaskCompleted(task)) {
      acc[customerName].completed += 1;
    } else {
      acc[customerName].active += 1;
    }

    const taskDate = getReportTaskDate(task);
    if (taskDate && taskDate < todayStart && !isReportTaskCompleted(task)) {
      acc[customerName].overdue += 1;
    }

    return acc;
  }, {});

  const customerPageItems = customers
    .map((customer) => ({
      ...customer,
      avatar: createAvatarFromName(customer.name),
      taskStats: customerTaskStatsByName[customer.name] || {
        total: 0,
        completed: 0,
        active: 0,
        overdue: 0
      },
      source: 'customer'
    }))
    .sort((firstCustomer, secondCustomer) => {
    if (firstCustomer.status === 'Pasif' && secondCustomer.status !== 'Pasif') return 1;
    if (firstCustomer.status !== 'Pasif' && secondCustomer.status === 'Pasif') return -1;
    return (secondCustomer.taskStats?.total || 0) - (firstCustomer.taskStats?.total || 0);
  });

  const selectedCustomer =
    customerPageItems.find((customer) => customer.id === selectedCustomerId) ||
    customerPageItems[0] ||
    null;









  const homeCurrentUser =
    currentRoleMember ||
    teamMembers.find((member) => member.id === currentUserId) ||
    null;

  const isHomeCurrentUserInList = (users = []) => {
    if (!homeCurrentUser) return false;

    return Array.isArray(users) && users.some(isPersonStrictlyCurrentUser);
  };

  const homeAllProjectTasks = visibleProjectNames.flatMap((projectName) => {
    const board =
      projectBoards[projectName] ||
      (projectName === selectedProject ? currentBoard : null);

    return (board?.columns || []).flatMap((column) =>
      (column.tasks || []).filter((task) => isTaskVisibleForProject(task, projectName)).map((task) => {
        const calendarStartDate = getCalendarTaskStartDate(task);
        const calendarEndDate = getCalendarTaskEndDate(task);

        return {
          ...task,
          projectName,
          columnTitle: column.title,
          columnColor: column.color,
          calendarStartDate,
          calendarEndDate,
          homeDate: calendarEndDate || calendarStartDate || getReportTaskDate(task)
        };
      })
    );
  });

  const homeOpenTasks = homeAllProjectTasks.filter((task) => !isReportTaskCompleted(task));

  const sortHomeTasksByDate = (tasks = []) =>
    [...tasks].sort((firstTask, secondTask) => {
      const firstTime = firstTask.homeDate ? firstTask.homeDate.getTime() : Number.MAX_SAFE_INTEGER;
      const secondTime = secondTask.homeDate ? secondTask.homeDate.getTime() : Number.MAX_SAFE_INTEGER;
      return firstTime - secondTime;
    });

  const homeAssignedTasks = sortHomeTasksByDate(
    homeOpenTasks.filter((task) => isHomeCurrentUserInList(task.assignees || []))
  );

  const homeFollowingTasks = sortHomeTasksByDate(
    homeOpenTasks.filter((task) => isHomeCurrentUserInList(task.followers || []))
  );

  const homeCalendarVisibleOpenTasks =
    currentAccountType === 'Ekip Üyesi'
      ? homeOpenTasks.filter((task) => isTaskVisibleInCalendarForCurrentUser(task, task.projectName))
      : homeOpenTasks;

  const homeTodayTasks = homeCalendarVisibleOpenTasks.filter((task) =>
    doesTaskOverlapCalendarRange(task, todayStart, new Date(tomorrowStart.getTime() - 1))
  );

  const homeOverdueTasks = homeCalendarVisibleOpenTasks.filter((task) => {
    const date = task.homeDate || task.calendarStartDate || task.calendarEndDate;
    return date ? date < todayStart : false;
  });

  const homeWorkFilterItems =
    currentAccountType === 'Ekip Üyesi'
      ? [
          { label: 'Görevli', count: homeAssignedTasks.length },
          { label: 'Takipte', count: homeFollowingTasks.length }
        ]
      : [
          { label: 'Açık', count: homeOpenTasks.length },
          { label: 'Bugün', count: homeTodayTasks.length },
          { label: 'Geciken', count: homeOverdueTasks.length }
        ];

  const homeVisibleWorkTasks =
    currentAccountType === 'Ekip Üyesi'
      ? homeWorkView === 'Takipte'
        ? homeFollowingTasks
        : homeAssignedTasks
      : homeWorkView === 'Bugün'
        ? sortHomeTasksByDate(homeTodayTasks)
        : homeWorkView === 'Geciken'
          ? sortHomeTasksByDate(homeOverdueTasks)
          : sortHomeTasksByDate(homeOpenTasks);

  const homeWorkSectionTitle =
    currentAccountType === 'Patron'
      ? 'Açık İş Akışı'
      : currentAccountType === 'Müşteri'
        ? 'Projelerinizdeki Açık İşler'
        : 'Size Atanan Görevler';

  const homeCalendarTasks = homeAllProjectTasks
    .filter((task) => isTaskVisibleInCalendarForCurrentUser(task, task.projectName))
    .filter((task) => !isReportTaskCompleted(task))
    .filter((task) => task.calendarStartDate || task.calendarEndDate || task.homeDate)
    .sort((firstTask, secondTask) => {
      const firstTime = (firstTask.homeDate || firstTask.calendarStartDate || firstTask.calendarEndDate)?.getTime() || Number.MAX_SAFE_INTEGER;
      const secondTime = (secondTask.homeDate || secondTask.calendarStartDate || secondTask.calendarEndDate)?.getTime() || Number.MAX_SAFE_INTEGER;
      return firstTime - secondTime;
    });

  const visibleHomeProjectMessages = projectMessages.filter(isProjectMessageVisibleForCurrentUser);
  const visibleHomeProjectFiles = projectFiles.filter(isProjectFileVisibleForCurrentUser);

  const homeRoleIntroText =
    currentAccountType === 'Patron'
      ? 'Tüm projeleri, ekip hareketlerini ve kritik işleri buradan takip edebilirsin.'
      : currentAccountType === 'Müşteri'
        ? 'Sadece size bağlı projeleri, yazışmaları, dosyaları ve teslim durumlarını görürsünüz.'
        : 'Dahil olduğun projeleri, sana atanan görevleri ve bugünkü planı buradan yönetebilirsin.';

  const homeRoleQuickActions =
    currentAccountType === 'Patron'
      ? [
          ...(canCreateTaskInSelectedProject
            ? [{ label: 'Yeni Görev', action: () => openQuickTaskFromHome(), tone: 'bg-[#ff3600] text-white border-[#ff3600]' }]
            : []),
          { label: 'Projeler', action: () => { setActiveMenu('Projeler'); setActiveContentMenu('Projeler'); setActiveTab('Görevler'); }, tone: 'bg-white text-[#394150] border-[#e5e8ee]' },
          ...(showTeamManagementPage
            ? [{ label: 'Ekip', action: () => { setActiveMenu('Diğer'); setActiveContentMenu('Diğer'); setActiveTab('Ekip'); }, tone: 'bg-white text-[#394150] border-[#e5e8ee]' }]
            : []),
          ...(showCustomerManagementPage
            ? [{ label: 'Müşteriler', action: () => { setActiveMenu('Diğer'); setActiveContentMenu('Diğer'); setActiveTab('Müşteriler'); }, tone: 'bg-white text-[#394150] border-[#e5e8ee]' }]
            : [])
        ]
      : currentAccountType === 'Müşteri'
        ? [
            { label: 'Projelerim', action: () => { setActiveMenu('Projeler'); setActiveContentMenu('Projeler'); setActiveTab('Görevler'); }, tone: 'bg-[#ff3600] text-white border-[#ff3600]' },
            { label: 'Yazışmalar', action: () => { setActiveMenu('Yazışmalar'); setActiveContentMenu('Yazışmalar'); }, tone: 'bg-white text-[#394150] border-[#e5e8ee]' },
            { label: 'Dosyalarım', action: () => { setActiveMenu('Projeler'); setActiveContentMenu('Projeler'); setActiveTab('Dosyalar'); }, tone: 'bg-white text-[#394150] border-[#e5e8ee]' }
          ]
        : [
            ...(canCreateTaskInSelectedProject
              ? [{ label: 'Yeni Görev', action: () => openQuickTaskFromHome(), tone: 'bg-[#ff3600] text-white border-[#ff3600]' }]
              : []),
            { label: 'Görevlerim', action: () => { setActiveMenu('Projeler'); setActiveContentMenu('Projeler'); setActiveTab('Görevler'); }, tone: 'bg-[#ff3600] text-white border-[#ff3600]' },
            { label: 'Takvimim', action: () => { setActiveMenu('Takvim'); setActiveContentMenu('Takvim'); }, tone: 'bg-white text-[#394150] border-[#e5e8ee]' },
            { label: 'Yazışmalar', action: () => { setActiveMenu('Yazışmalar'); setActiveContentMenu('Yazışmalar'); }, tone: 'bg-white text-[#394150] border-[#e5e8ee]' }
          ];

  const homeRoleSummaryItems =
    currentAccountType === 'Patron'
      ? [
          { label: 'Proje', value: visibleProjectNames.length, tone: 'bg-[#ff3600] text-white border-[#ff3600]' },
          { label: 'Açık Görev', value: homeOpenTasks.length, tone: 'bg-zinc-100 text-zinc-700 border-blue-100' },
          { label: 'Aktif Ekip', value: teamMembers.filter((member) => member.status !== 'Pasif').length, tone: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
          { label: 'Müşteri', value: customers.length, tone: 'bg-violet-50 text-violet-600 border-violet-100' }
        ]
      : currentAccountType === 'Müşteri'
        ? [
            { label: 'Proje', value: visibleProjectNames.length, tone: 'bg-zinc-100 text-zinc-700 border-blue-100' },
            { label: 'Açık İş', value: homeOpenTasks.length, tone: 'bg-[#ff3600] text-white border-[#ff3600]' },
            { label: 'Dosya', value: visibleHomeProjectFiles.length, tone: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
            { label: 'Bildirim', value: unreadNotificationCount, tone: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
          ]
        : [
            { label: 'Atanan', value: homeAssignedTasks.length, tone: 'bg-[#ff3600] text-white border-[#ff3600]' },
            { label: 'Takipte', value: homeFollowingTasks.length, tone: 'bg-zinc-100 text-zinc-700 border-blue-100' },
            { label: 'Bugün', value: homeTodayTasks.length, tone: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
            { label: 'Geciken', value: homeOverdueTasks.length, tone: 'bg-red-50 text-red-600 border-red-100' }
          ];

  const getHomeTasksForCalendarDay = (day) => {
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    return homeCalendarTasks.filter((task) => {
      const taskStart = task.calendarStartDate || task.homeDate;
      const taskEnd = task.calendarEndDate || task.homeDate || task.calendarStartDate;

      if (!taskStart || !taskEnd) return false;

      return taskStart <= dayEnd && taskEnd >= dayStart;
    });
  };

  const {
    openHomeTaskDetail,
    resetQuickNoteComposer,
    openQuickNoteComposerForEdit,
    createQuickNoteFromHome,
    deleteQuickNoteFromHome,
    openQuickTaskFromHome,
    openMenuCalendarTask,
    openMenuCalendarQuickTask,
    openHomeCalendarQuickTaskForDate
  } = createZRCHomeActions({
    setSelectedProject,
    setActiveContentMenu,
    setActiveMenu,
    setActiveTab,
    openTaskDetail,
    setQuickNoteTitleDraft,
    setQuickNoteDraft,
    setEditingQuickNoteId,
    setPendingDeleteQuickNoteId,
    parseQuickNoteContent,
    setIsQuickNoteComposerOpen,
    quickNoteTitleDraft,
    quickNoteDraft,
    editingQuickNoteId,
    quickNotes,
    buildQuickNoteText,
    setQuickNotes,
    updateQuickNoteInSupabase,
    saveQuickNoteToSupabase,
    deleteQuickNoteFromSupabase,
    ensureCanCreateTaskInSelectedProject,
    setEditingTask,
    setCalendarNewTaskDate,
    setIsTaskModalOpen,
    openCalendarQuickTaskCreator,
    calendarFocusedDate
  });

  const menuCalendarStatusOptions = [
    'Tüm Durumlar',
    ...Array.from(new Set(homeAllProjectTasks.map((task) => task.columnTitle).filter(Boolean)))
  ];

  const menuCalendarTasks = homeAllProjectTasks
    .filter((task) => isTaskVisibleInCalendarForCurrentUser(task, task.projectName))
    .filter((task) => {
      if (calendarDisplayOptions.hideCompletedTasks && isReportTaskCompleted(task)) return false;
      if (calendarDisplayOptions.hideArchivedTasks && (task.isArchived || task.archived || task.status === 'Arşiv')) return false;
      if (
        calendarDisplayOptions.hideLongTasks &&
        isTaskLongForCalendar(task) &&
        !doesTaskOverlapCalendarRange(task, todayStart, new Date(tomorrowStart.getTime() - 1))
      ) return false;
      if (menuCalendarStatusFilter !== 'Tüm Durumlar' && task.columnTitle !== menuCalendarStatusFilter) return false;

      return task.calendarStartDate || task.calendarEndDate || task.homeDate;
    })
    .sort((firstTask, secondTask) => {
      const firstTime = (firstTask.homeDate || firstTask.calendarStartDate || firstTask.calendarEndDate)?.getTime() || Number.MAX_SAFE_INTEGER;
      const secondTime = (secondTask.homeDate || secondTask.calendarStartDate || secondTask.calendarEndDate)?.getTime() || Number.MAX_SAFE_INTEGER;
      return firstTime - secondTime;
    });

  const getMenuCalendarTasksForDay = (day) => {
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    return menuCalendarTasks.filter((task) => {
      const taskStart = task.calendarStartDate || task.homeDate || task.calendarEndDate;
      const taskEnd = task.calendarEndDate || task.homeDate || task.calendarStartDate;

      if (!taskStart || !taskEnd) return false;

      return taskStart <= dayEnd && taskEnd >= dayStart;
    });
  };

  const formatMenuCalendarTaskTime = (task) => {
    const sourceDate =
      parseTaskDateValue(
        task.endDate ||
          task.dueDate ||
          task.deadline ||
          task.deadlineDate ||
          task.bitisTarihi ||
          task.finishDate ||
          task.date ||
          task.displayDate ||
          task.taskDate
      ) ||
      task.homeDate ||
      task.calendarEndDate ||
      task.calendarStartDate;

    if (!sourceDate) return '';

    const hours = sourceDate.getHours();
    const minutes = sourceDate.getMinutes();

    if ((hours === 0 && minutes === 0) || (hours === 23 && minutes === 59)) {
      return '';
    }

    return `${hours}:${String(minutes).padStart(2, '0')}`;
  };

  const menuCalendarHours = Array.from({ length: 17 }, (_, index) => index + 6);

  const getMenuCalendarTasksForHour = (day, hour) =>
    getMenuCalendarTasksForDay(day).filter((task) => {
      const sourceDate =
        parseTaskDateValue(
          task.endDate ||
            task.dueDate ||
            task.deadline ||
            task.deadlineDate ||
            task.bitisTarihi ||
            task.finishDate ||
            task.date ||
            task.displayDate ||
            task.taskDate
        ) ||
        task.homeDate ||
        task.calendarEndDate ||
        task.calendarStartDate;

      return sourceDate && sourceDate.getHours() === hour;
    });

  const getMenuCalendarAllDayTasks = (day) =>
    getMenuCalendarTasksForDay(day).filter((task) => !formatMenuCalendarTaskTime(task));

  const menuCalendarListGroups = calendarWeekDays
    .map((day) => ({
      day,
      tasks: getMenuCalendarTasksForDay(day)
    }))
    .filter((group) => group.tasks.length > 0);

  const formatMenuCalendarWeekHeader = (day) => {
    if (!day) return '';

    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(day);
  };

  const getMenuCalendarHolidayLabel = (day) => {
    const month = day.getMonth();
    const date = day.getDate();

    if (month === 4 && date === 1) return 'Emek ve Dayanışma Günü';
    if (month === 4 && date === 19) return 'Atatürk’ü Anma, Gençlik ve Spor Bayramı';

    return '';
  };

  useEffect(() => {
    const handleGlobalCalendarDayPointerUp = (event) => {
      const target = event.target;

      if (target?.closest?.('[data-calendar-task-button="true"]')) return;

      const dayElement = target?.closest?.('[data-zrc-calendar-day], [data-calendar-day]');

      if (!dayElement) return;

      const dateValue =
        dayElement.getAttribute('data-zrc-calendar-day') ||
        dayElement.getAttribute('data-calendar-day');

      if (!dateValue) return;

      const [year, month, day] = dateValue.split('-').map(Number);

      if (!year || !month || !day) return;

      openCalendarQuickTaskCreator(new Date(year, month - 1, day), event);
    };

    document.addEventListener('pointerup', handleGlobalCalendarDayPointerUp, true);

    return () => {
      document.removeEventListener('pointerup', handleGlobalCalendarDayPointerUp, true);
    };
  }, [
    selectedProject,
    visibleProjectNames,
    currentAccountType,
    projectBoards
  ]);

  const projectChatGroups = visibleProjectNames.map((projectName) => ({
    id: `project-chat-${projectName}`,
    type: 'project',
    projectName,
    name: projectName,
    avatar: createAvatarFromName(projectName),
    members: (projectSettings[projectName]?.teamMemberIds || [])
      .map((memberId) => teamMembers.find((member) => member.id === memberId)?.name)
      .filter(Boolean),
    createdAt: ''
  }));

  const allChatGroups = [
    ...projectChatGroups,
    ...chatGroups.filter(isChatGroupVisibleForCurrentUser)
  ];

  const filteredChatGroups = allChatGroups.filter((group) =>
    !chatGroupSearch.trim() ||
    group.name.toLocaleLowerCase('tr-TR').includes(chatGroupSearch.trim().toLocaleLowerCase('tr-TR'))
  );

  const selectedChatGroup = allChatGroups.find((group) => group.id === selectedChatGroupId) || null;

  useEffect(() => {
    if (!selectedChatGroupId) return;
    if (allChatGroups.some((group) => group.id === selectedChatGroupId)) return;

    setSelectedChatGroupId(allChatGroups[0]?.id || '');
  }, [selectedChatGroupId, allChatGroups.map((group) => group.id).join('|')]);

  const selectedChatMessages = selectedChatGroup && isChatGroupVisibleForCurrentUser(selectedChatGroup)
    ? projectMessages
        .filter((message) => message.chatGroupId === selectedChatGroup.id)
        .filter(isProjectMessageVisibleForCurrentUser)
        .sort((firstMessage, secondMessage) => {
          const firstTime = firstMessage.createdAt ? new Date(firstMessage.createdAt).getTime() : 0;
          const secondTime = secondMessage.createdAt ? new Date(secondMessage.createdAt).getTime() : 0;

          return firstTime - secondTime;
        })
    : [];

  const canCreateChatGroups = currentAccountType === 'Patron';
  const canSendSelectedChatMessage = Boolean(
    currentPermissions.message &&
      selectedChatGroup &&
      isChatGroupVisibleForCurrentUser(selectedChatGroup)
  );

  const {
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
  } = createZRCMessageNotificationActions({
    isSupabaseUuid,
    supabase,
    currentUserId,
    getCurrentSupabaseWorkspaceId,
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
  });

  const {
    saveProfileSection,
    toggleProfilePreference,
    addProfileEmailAccount,
    removeProfileEmailAccount,
    removeProfileSession,
    markSuspiciousEventAsMine,
    handleProfileAvatarChange
  } = createZRCProfileActions({
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
  });








  const renderProfileSelect = (props) =>
    renderZRCProfileSelect(props, openProfileDropdown, setOpenProfileDropdown);

  const renderSoftSelect = (props) =>
    renderZRCSoftSelect(props, openProfileDropdown, setOpenProfileDropdown);












  const resetLocalApplicationData = async () => {
    if (!ensureCanManageLocalData()) return;

    const confirmed = await window.zrcConfirm('Tüm yerel veriler sıfırlansın mı? Bu işlem geri alınamaz.');

    if (!confirmed) return;

    Object.keys(STORAGE_KEYS).forEach((key) => removeStorageValue(key));

    await window.zrcAlert('Yerel veri sıfırlandı. Sayfa şimdi yenilenecek.');
    window.location.reload();
  };

  const getCredentialMessageForMember = (member = {}) => {
    const role = normalizeTeamRole(member.role);
    const accountType = getAccountTypeFromRole(role);
    const linkedCustomer = getMemberLinkedCustomer(member);

    const credentialDisplayName = linkedCustomer?.name || member.name || '';

    return [
      `Merhaba ${credentialDisplayName},`,
      '',
      'ZRC iş takip sistemine giriş bilgileriniz aşağıdadır:',
      `Hesap tipi: ${accountType}`,
      linkedCustomer ? `Bağlı müşteri: ${linkedCustomer.name}` : '',
      `Kullanıcı adı: ${member.username || createUsernameFromMember(member)}`,
      `Şifre: ${member.password || '1234'}`,
      '',
      'Giriş yaptıktan sonra size açık olan proje ve görevleri panelinizden takip edebilirsiniz.'
    ]
      .filter((line) => line !== '')
      .join('\n');
  };

  const copyCredentialTextForMember = (member) => {
    if (!member) return;

    copyTextToClipboard(
      getCredentialMessageForMember(member),
      `${member.name || 'Kişi'} için giriş bilgileri kopyalandı.`
    );
  };

  const copyCredentialTextForCustomer = async (customer) => {
    const linkedAccount = getCustomerLinkedAccount(customer);

    if (!linkedAccount) {
      await window.zrcAlert('Bu müşteriye bağlı giriş hesabı yok.');
      return;
    }

    copyCredentialTextForMember(linkedAccount);
  };

  const getLoginAvatar = (member) => {
    const avatar = member?.avatar || createAvatarFromName(member?.name);

    if (typeof avatar === 'string' && avatar.startsWith('data:image')) {
      return <img src={avatar} alt={member.name} className="w-full h-full object-cover" />;
    }

    return <span>{avatar || createAvatarFromName(member?.name)}</span>;
  };

  const syncProfileFromMember = (member) => {
    const role = normalizeTeamRole(member?.role);
    const linkedCustomer = role === 'Müşteri/Misafir' ? getMemberLinkedCustomer(member) : null;
    const displayName = linkedCustomer?.name || member?.name || '';
    const nameParts = String(displayName).trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || 'Kullanıcı';
    const lastName = nameParts.slice(1).join(' ');
    const avatar = member?.avatar || '';
    const avatarDataUrl = typeof avatar === 'string' && avatar.startsWith('data:image') ? avatar : '';

    setProfileDraft((prev) => ({
      ...prev,
      firstName,
      lastName,
      email: member?.email || linkedCustomer?.email || prev.email,
      title: role,
      avatarDataUrl
    }));
  };

  useEffect(() => {
    const isLegacyDemoSession = String(currentUserId || '').startsWith('user-');

    if (isLegacyDemoSession) {
      setCurrentUserId('');
      removeStorageValue('currentUserId');
      setLoginDraft({ username: '', password: '' });
      setLoginError('Supabase girişine geçildi. E-posta ve şifrenle giriş yap.');
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const activeMember = teamMembers.find((member) => member.id === currentUserId && member.status !== 'Pasif');

    if (!activeMember) {
      setCurrentUserId('');
      removeStorageValue('currentUserId');
      setLoginError('Oturum süresi doldu veya hesabınız pasif durumda.');
      return;
    }

    syncProfileFromMember(activeMember);
  }, [currentUserId, teamMembers]);

  const mergeSupabaseMemberIntoLocalState = (member) => {
    if (!member?.id) return member;

    const normalizedMember = normalizeTeamMember(member);

    setTeamMembers((prevMembers) => {
      const existingMembers = Array.isArray(prevMembers) ? prevMembers : [];
      const normalizedUsername = normalizeCredentialText(normalizedMember.username);
      const withoutSameMember = existingMembers.filter((item) => {
        if (item.id === normalizedMember.id) return false;

        const itemUsername = normalizeCredentialText(item.username);
        const isSameLocalAccount =
          normalizedUsername &&
          itemUsername === normalizedUsername &&
          (item.authProvider === 'local' || String(item.id || '').startsWith('local-user-'));

        return !isSameLocalAccount;
      });

      return [normalizedMember, ...withoutSameMember].map(normalizeTeamMember);
    });

    return normalizedMember;
  };

  const fetchSupabaseMemberForUser = async (authUser) => {
    if (!authUser?.id) {
      throw new Error('Supabase kullanıcısı bulunamadı.');
    }

    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('workspace_id, user_id, role, status, username, customer_id')
      .eq('user_id', authUser.id)
      .eq('status', 'Aktif')
      .limit(1)
      .maybeSingle();

    if (membershipError) {
      throw new Error(membershipError.message || 'Workspace üyeliği okunamadı.');
    }

    if (!membership) {
      throw new Error('Bu kullanıcı ZRC workspace içinde aktif üye değil.');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, email, avatar_url, title, status')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message || 'Profil bilgisi okunamadı.');
    }

    const memberName = profile?.display_name || authUser.email || 'ZRC Kullanıcı';

    return normalizeTeamMember({
      id: membership.user_id,
      workspaceId: membership.workspace_id,
      name: memberName,
      email: profile?.email || authUser.email || '',
      username: membership.username || authUser.email || '',
      password: '',
      role: membership.role || 'Ekip Üyesi',
      avatar: profile?.avatar_url || createAvatarFromName(memberName),
      status: membership.status || profile?.status || 'Aktif',
      customerId: membership.customer_id || ''
    });
  };

  useEffect(() => {
    let isMounted = true;

    const restoreSupabaseSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          if (isMounted) {
            setLoginError(`Supabase oturum hatası: ${error.message}`);
          }
          return;
        }

        const authUser = data?.session?.user || null;

        if (isMounted) {
          setSupabaseAuthUserId(authUser?.id || '');
        }

        if (!authUser) {
          const looksLikeSupabaseUser = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(currentUserId || ''));

          if (looksLikeSupabaseUser) {
            setCurrentUserId('');
            removeStorageValue('currentUserId');
          }

          return;
        }

        const supabaseMember = await fetchSupabaseMemberForUser(authUser);
        const normalizedMember = mergeSupabaseMemberIntoLocalState(supabaseMember);

        if (isMounted) {
          handleLoginAsMember(normalizedMember, { restoreNavigation: true });
          setLoginError('');
        }
      } catch (error) {
        if (isMounted) {
          await supabase.auth.signOut();
          setCurrentUserId('');
          removeStorageValue('currentUserId');
          setLoginError(error?.message || 'Supabase oturumu geri yüklenemedi.');
        }
      } finally {
        if (isMounted) {
          setAuthSessionLoading(false);
        }
      }
    };

    restoreSupabaseSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginAsMember = (member, options = {}) => {
    if (!member) return;

    const accountType = getAccountTypeFromRole(member.role);
    const startPanel = getStartPanelForAccountType(accountType);
    const savedNavigation = options.restoreNavigation
      ? getSavedNavigationState(startPanel)
      : {
          activeMenu: startPanel.menu,
          activeContentMenu: startPanel.content,
          activeTab: startPanel.tab
        };

    if (member.workspaceId) {
      setSupabaseWorkspaceId(member.workspaceId);
    }

    setCurrentUserId(member.id);
    writeStorageValue('currentUserId', member.id);
    setLoginDraft({ username: '', password: '' });
    setLoginError('');
    syncProfileFromMember(member);
    setActiveMenu(savedNavigation.activeMenu);
    setActiveContentMenu(savedNavigation.activeContentMenu);
    setActiveTab(savedNavigation.activeTab);
    setIsPanelOpen(false);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
    setIsGlobalSearchOpen(false);
    setIsMessageTaskPickerOpen(false);
    setIsChatActionMenuOpen(false);
    setOpenProfileDropdown(null);
    setIsEditMode(false);
    setPendingTeamDeleteId(null);
    setPendingCustomerDeleteId(null);
  };

  const handleCredentialLogin = async (event) => {
    event.preventDefault();

    const loginIdentifier = String(loginDraft.username || '').trim();
    const password = String(loginDraft.password || '').trim();

    if (!loginIdentifier || !password) {
      setLoginError('Kullanıcı adı/e-posta ve şifre gir.');
      return;
    }

    setAuthLoginLoading(true);
    setLoginError('');

    try {
      const normalizedLoginIdentifier = normalizeCredentialText(loginIdentifier);
      const localMember = teamMembers.find((member) => {
        const isLocalAccount = member.authProvider === 'local' || String(member.id || '').startsWith('local-user-');

        return (
          isLocalAccount &&
          member.status !== 'Pasif' &&
          normalizeCredentialText(member.username) === normalizedLoginIdentifier &&
          String(member.password || '') === password
        );
      });

      const email = loginIdentifier.includes('@')
        ? loginIdentifier
        : `${normalizedLoginIdentifier}@zrc.local`;

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        const cleanMessage = String(signInError.message || '').toLocaleLowerCase('tr-TR');

        if (cleanMessage.includes('invalid login credentials') && localMember) {
          setSupabaseAuthUserId('');
          handleLoginAsMember(localMember);
          return;
        }

        if (cleanMessage.includes('invalid login credentials')) {
          setLoginError('Kullanıcı adı/e-posta veya şifre hatalı.');
        } else if (cleanMessage.includes('email not confirmed')) {
          setLoginError('Bu e-posta hesabı onaylanmamış görünüyor.');
        } else {
          setLoginError(`Supabase giriş hatası: ${signInError.message}`);
        }

        return;
      }

      const authUser = signInData?.user;
      setSupabaseAuthUserId(authUser?.id || '');

      if (!authUser) {
        setLoginError('Supabase kullanıcı bilgisi alınamadı.');
        return;
      }

      const supabaseMember = await fetchSupabaseMemberForUser(authUser);
      const detectedAccountType = getAccountTypeFromRole(supabaseMember.role);

      if (!['Patron', 'Ekip Üyesi', 'Müşteri'].includes(detectedAccountType)) {
        setLoginError('Hesap tipi tanınamadı.');
        return;
      }

      const normalizedMember = mergeSupabaseMemberIntoLocalState(supabaseMember);
      handleLoginAsMember(normalizedMember);
    } catch (error) {
      setLoginError(error?.message || 'Supabase giriş bağlantısında hata oluştu.');
    } finally {
      setAuthLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthSessionLoading(false);
    setSupabaseWorkspaceId('');
    setSupabaseAuthUserId('');
    removeStorageValue(NAVIGATION_STORAGE_KEYS.activeMenu);
    removeStorageValue(NAVIGATION_STORAGE_KEYS.activeContentMenu);
    removeStorageValue(NAVIGATION_STORAGE_KEYS.activeTab);
    setCurrentUserId('');
    setCurrentAssignedSupabaseTaskIds([]);
    removeStorageValue('currentUserId');
    setLoginDraft({ username: '', password: '' });
    setLoginError('');
    setIsPanelOpen(false);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
    setIsGlobalSearchOpen(false);
    setPendingTeamDeleteId(null);
    setPendingCustomerDeleteId(null);
  };

  const loginUsers = teamMembers.filter((member) => member.status !== 'Pasif');
  const visibleLoginUsers = loginUsers.length > 0 ? loginUsers : createDefaultTeamMembers().map(normalizeTeamMember);

  const handleMainClick = () => {
    setOpenMenuColumnId(null);
    setOpenTaskMenuId(null);
    setIsCalendarDisplayMenuOpen(false);
    setIsMenuCalendarFilterOpen(false);
    setIsMenuCalendarStatusOpen(false);
    setIsChatActionMenuOpen(false);
    setOpenProfileDropdown(null);
    setIsTimeChartFilterOpen(false);
    setIsTimeChartSettingsOpen(false);
    setIsNotificationsOpen(false);
    setIsGlobalSearchOpen(false);
  };

  const renderSupabaseConnectionBadge = () => null;

// zrc-v462-comfort-notification-refresh
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const normalizeButtonText = (value = '') =>
      String(value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr-TR');

    const isInsideNotificationArea = (button) => {
      let node = button;

      for (let index = 0; index < 9; index += 1) {
        if (!node) return false;

        const text = normalizeButtonText(node.textContent || '');

        if (
          text.includes('bildirim') ||
          text.includes('notification') ||
          text.includes('okunmadı') ||
          text.includes('okundu')
        ) {
          return true;
        }

        node = node.parentElement;
      }

      return false;
    };

    const hideNotificationActionButtons = () => {
      document.querySelectorAll('button').forEach((button) => {
        const text = normalizeButtonText(button.textContent || '');

        const isRefreshButton = text === 'yenile' && isInsideNotificationArea(button);
        const isMarkReadButton =
          text === 'tümü okundu yap' ||
          text === 'tumu okundu yap' ||
          text === 'tümünü okundu yap' ||
          text === 'tumunu okundu yap';

        if (!isRefreshButton && !isMarkReadButton) return;

        button.style.display = 'none';
        button.setAttribute('aria-hidden', 'true');
        button.setAttribute('data-zrc-v462-hidden-notification-action', 'true');
      });
    };

    hideNotificationActionButtons();

    const observer = new MutationObserver(() => {
      hideNotificationActionButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (authSessionLoading || !currentUserId) return undefined;
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    let isCancelled = false;
    let isRefreshing = false;
    let lastInteractionAt = Date.now();

    const markInteraction = () => {
      lastInteractionAt = Date.now();
    };

    const comfortableNotificationRefresh = async (reason = 'konforlu bildirim yenileme') => {
      if (isCancelled) return;
      if (document.visibilityState !== 'visible') return;
      if (isRefreshing) return;

      // Kullanıcı bildirim listesindeyken/ekrana dokunurken sürekli zıplatma yapma.
      if (Date.now() - lastInteractionAt < 1800) return;

      isRefreshing = true;

      try {
        await loadActivityLogsFromSupabase();
        setZrcMobileColumnRefreshKey((value) => value + 1);
      } catch (error) {
        console.warn(`[] ${reason} başarısız.`, error);
      } finally {
        isRefreshing = false;
      }
    };

    const handleFocusRefresh = () => {
      window.setTimeout(() => comfortableNotificationRefresh('ekran aktif oldu'), 700);
    };

    document.addEventListener('touchstart', markInteraction, { passive: true });
    document.addEventListener('pointerdown', markInteraction, { passive: true });
    document.addEventListener('scroll', markInteraction, { passive: true });
    document.addEventListener('visibilitychange', handleFocusRefresh);
    window.addEventListener('focus', handleFocusRefresh);

    // 1 saniye değil: konforlu yedek kontrol. Realtime zaten anlık getiriyor.
    const comfortTimer = window.setInterval(() => {
      comfortableNotificationRefresh('yedek bildirim kontrolü');
    }, 30000);

    handleFocusRefresh();

    return () => {
      isCancelled = true;

      document.removeEventListener('touchstart', markInteraction);
      document.removeEventListener('pointerdown', markInteraction);
      document.removeEventListener('scroll', markInteraction);
      document.removeEventListener('visibilitychange', handleFocusRefresh);
      window.removeEventListener('focus', handleFocusRefresh);
      window.clearInterval(comfortTimer);
    };
  }, [authSessionLoading, currentUserId, selectedProject, supabaseWorkspaceId]);


  // zrc-v463-stable-mobile-notification-badge
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const styleId = 'zrc-v463-stable-mobile-notification-badge-style';

    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @media (max-width: 768px) {
          [data-zrc-v463-notification-badge="true"],
          [data-zrc-v463-notification-badge="true"] * {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const normalizeText = (value = '') =>
      String(value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr-TR');

    const stabilizeNotificationBadge = () => {
      if (window.innerWidth > 768) return;

      const notificationButtons = Array.from(document.querySelectorAll('button')).filter((button) => {
        const text = normalizeText(button.textContent || '');

        return text.includes('bildirim') || text.includes('notifications') || text.includes('notification');
      });

      notificationButtons.forEach((button) => {
        button.style.animation = 'none';
        button.style.transition = 'none';

        const candidates = Array.from(button.querySelectorAll('*')).filter((element) => {
          const text = normalizeText(element.textContent || '');

          return /^[0-9]+$/.test(text) && Number(text) > 0;
        });

        candidates.forEach((badge) => {
          badge.setAttribute('data-zrc-v463-notification-badge', 'true');
          badge.style.animation = 'none';
          badge.style.transition = 'none';
          badge.style.opacity = '1';
          badge.style.visibility = 'visible';
          badge.style.transform = 'none';
          badge.style.willChange = 'auto';
        });
      });
    };

    stabilizeNotificationBadge();

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(stabilizeNotificationBadge);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    const timer = window.setInterval(stabilizeNotificationBadge, 2000);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);


  

  

  // zrc-v528: feature panellerine toplu prop spread objesi


  

  

  const zrcFeatureSpreadProps = {activeTab: typeof activeTab !== 'undefined' ? activeTab : undefined, currentAccountType: typeof currentAccountType !== 'undefined' ? currentAccountType : undefined, Raporlar: typeof Raporlar !== 'undefined' ? Raporlar : undefined, w: typeof w !== 'undefined' ? w : undefined, full: typeof full !== 'undefined' ? full : undefined, flex: typeof flex !== 'undefined' ? flex : undefined, px: typeof px !== 'undefined' ? px : undefined, items: typeof items !== 'undefined' ? items : undefined, center: typeof center !== 'undefined' ? center : undefined, justify: typeof justify !== 'undefined' ? justify : undefined, text: typeof text !== 'undefined' ? text : undefined, font: typeof font !== 'undefined' ? font : undefined, black: typeof black !== 'undefined' ? black : undefined, reportIntroText: typeof reportIntroText !== 'undefined' ? reportIntroText : undefined, setActiveTab: typeof setActiveTab !== 'undefined' ? setActiveTab : undefined, h: typeof h !== 'undefined' ? h : undefined, rounded: typeof rounded !== 'undefined' ? rounded : undefined, border: typeof border !== 'undefined' ? border : undefined, Git: typeof Git !== 'undefined' ? Git : undefined, reportSummaryCards: typeof reportSummaryCards !== 'undefined' ? reportSummaryCards : undefined, card: typeof card !== 'undefined' ? card : undefined, Genel: typeof Genel !== 'undefined' ? Genel : undefined, Tamamlanan: typeof Tamamlanan !== 'undefined' ? Tamamlanan : undefined, toplam: typeof toplam !== 'undefined' ? toplam : undefined, reportProgressPercentage: typeof reportProgressPercentage !== 'undefined' ? reportProgressPercentage : undefined, reportOpenTasks: typeof reportOpenTasks !== 'undefined' ? reportOpenTasks : undefined, Dosya: typeof Dosya !== 'undefined' ? Dosya : undefined, reportFileCount: typeof reportFileCount !== 'undefined' ? reportFileCount : undefined, reportCustomerCount: typeof reportCustomerCount !== 'undefined' ? reportCustomerCount : undefined, visibleProjectNames: typeof visibleProjectNames !== 'undefined' ? visibleProjectNames : undefined, Kolonlara: typeof Kolonlara !== 'undefined' ? Kolonlara : undefined, boardColumns: typeof boardColumns !== 'undefined' ? boardColumns : undefined, kolon: typeof kolon !== 'undefined' ? kolon : undefined, reportColumnStats: typeof reportColumnStats !== 'undefined' ? reportColumnStats : undefined, column: typeof column !== 'undefined' ? column : undefined, backgroundColor: typeof backgroundColor !== 'undefined' ? backgroundColor : undefined, reportPriorityTitle: typeof reportPriorityTitle !== 'undefined' ? reportPriorityTitle : undefined, reportUrgentTasks: typeof reportUrgentTasks !== 'undefined' ? reportUrgentTasks : undefined, reportPriorityStats: typeof reportPriorityStats !== 'undefined' ? reportPriorityStats : undefined, item: typeof item !== 'undefined' ? item : undefined, getReportPriorityStyle: typeof getReportPriorityStyle !== 'undefined' ? getReportPriorityStyle : undefined, reportUpcomingTasks: typeof reportUpcomingTasks !== 'undefined' ? reportUpcomingTasks : undefined, task: typeof task !== 'undefined' ? task : undefined, report: typeof report !== 'undefined' ? report : undefined, upcoming: typeof upcoming !== 'undefined' ? upcoming : undefined, openTaskDetail: typeof openTaskDetail !== 'undefined' ? openTaskDetail : undefined, getRoleAwareTaskMeta: typeof getRoleAwareTaskMeta !== 'undefined' ? getRoleAwareTaskMeta : undefined, formatCalendarDate: typeof formatCalendarDate !== 'undefined' ? formatCalendarDate : undefined, yok: typeof yok !== 'undefined' ? yok : undefined, Tarihli: typeof Tarihli !== 'undefined' ? Tarihli : undefined, burada: typeof burada !== 'undefined' ? burada : undefined, Gecikenler: typeof Gecikenler !== 'undefined' ? Gecikenler : undefined, reportOverdueTasks: typeof reportOverdueTasks !== 'undefined' ? reportOverdueTasks : undefined, overdue: typeof overdue !== 'undefined' ? overdue : undefined, getReportTaskDate: typeof getReportTaskDate !== 'undefined' ? getReportTaskDate : undefined, Geciken: typeof Geciken !== 'undefined' ? Geciken : undefined, Gantt: typeof Gantt !== 'undefined' ? Gantt : undefined, zinc: typeof zinc !== 'undefined' ? zinc : undefined, shadow: typeof shadow !== 'undefined' ? shadow : undefined, b: typeof b !== 'undefined' ? b : undefined, ganttSearch: typeof ganttSearch !== 'undefined' ? ganttSearch : undefined, setGanttSearch: typeof setGanttSearch !== 'undefined' ? setGanttSearch : undefined, ganttSearchPlaceholder: typeof ganttSearchPlaceholder !== 'undefined' ? ganttSearchPlaceholder : undefined, setGanttShowCompleted: typeof setGanttShowCompleted !== 'undefined' ? setGanttShowCompleted : undefined, prev: typeof prev !== 'undefined' ? prev : undefined, transition: typeof transition !== 'undefined' ? transition : undefined, all: typeof all !== 'undefined' ? all : undefined, ganttShowCompleted: typeof ganttShowCompleted !== 'undefined' ? ganttShowCompleted : undefined, hover: typeof hover !== 'undefined' ? hover : undefined, Tamamlananlar: typeof Tamamlananlar !== 'undefined' ? Tamamlananlar : undefined, goToPreviousGanttPeriod: typeof goToPreviousGanttPeriod !== 'undefined' ? goToPreviousGanttPeriod : undefined, ganttRangeTitle: typeof ganttRangeTitle !== 'undefined' ? ganttRangeTitle : undefined, ganttTasks: typeof ganttTasks !== 'undefined' ? ganttTasks : undefined, goToNextGanttPeriod: typeof goToNextGanttPeriod !== 'undefined' ? goToNextGanttPeriod : undefined, goToCurrentGanttPeriod: typeof goToCurrentGanttPeriod !== 'undefined' ? goToCurrentGanttPeriod : undefined, view: typeof view !== 'undefined' ? view : undefined, changeGanttView: typeof changeGanttView !== 'undefined' ? changeGanttView : undefined, ganttView: typeof ganttView !== 'undefined' ? ganttView : undefined, sm: typeof sm !== 'undefined' ? sm : undefined, relative: typeof relative !== 'undefined' ? relative : undefined, scrollGantt: typeof scrollGantt !== 'undefined' ? scrollGantt : undefined, left: typeof left !== 'undefined' ? left : undefined, translate: typeof translate !== 'undefined' ? translate : undefined, z: typeof z !== 'undefined' ? z : undefined, md: typeof md !== 'undefined' ? md : undefined, ref: typeof ref !== 'undefined' ? ref : undefined, ganttScrollRef: typeof ganttScrollRef !== 'undefined' ? ganttScrollRef : undefined, gridTemplateColumns: typeof gridTemplateColumns !== 'undefined' ? gridTemplateColumns : undefined, repeat: typeof repeat !== 'undefined' ? repeat : undefined, ganttPeriods: typeof ganttPeriods !== 'undefined' ? ganttPeriods : undefined, minmax: typeof minmax !== 'undefined' ? minmax : undefined, ganttPeriodConfig: typeof ganttPeriodConfig !== 'undefined' ? ganttPeriodConfig : undefined, minWidth: typeof minWidth !== 'undefined' ? minWidth : undefined, period: typeof period !== 'undefined' ? period : undefined, gantt: typeof gantt !== 'undefined' ? gantt : undefined, head: typeof head !== 'undefined' ? head : undefined, col: typeof col !== 'undefined' ? col : undefined, todayStart: typeof todayStart !== 'undefined' ? todayStart : undefined, getGanttTaskPlacement: typeof getGanttTaskPlacement !== 'undefined' ? getGanttTaskPlacement : undefined, row: typeof row !== 'undefined' ? row : undefined, getPremiumCalendarDotStyle: typeof getPremiumCalendarDotStyle !== 'undefined' ? getPremiumCalendarDotStyle : undefined, gridColumn: typeof gridColumn !== 'undefined' ? gridColumn : undefined, cell: typeof cell !== 'undefined' ? cell : undefined, self: typeof self !== 'undefined' ? self : undefined, mx: typeof mx !== 'undefined' ? mx : undefined, getGanttBarClassName: typeof getGanttBarClassName !== 'undefined' ? getGanttBarClassName : undefined, Bu: typeof Bu !== 'undefined' ? Bu : undefined, ganttUndatedTasks: typeof ganttUndatedTasks !== 'undefined' ? ganttUndatedTasks : undefined, Tarihsiz: typeof Tarihsiz !== 'undefined' ? Tarihsiz : undefined, undated: typeof undated !== 'undefined' ? undated : undefined, currentPermissions: typeof currentPermissions !== 'undefined' ? currentPermissions : undefined, selectedProject: typeof selectedProject !== 'undefined' ? selectedProject : undefined, Dosyalar: typeof Dosyalar !== 'undefined' ? Dosyalar : undefined, bg: typeof bg !== 'undefined' ? bg : undefined, setPendingFileDeleteKey: typeof setPendingFileDeleteKey !== 'undefined' ? setPendingFileDeleteKey : undefined, eklenen: typeof eklenen !== 'undefined' ? eklenen : undefined, proje: typeof proje !== 'undefined' ? proje : undefined, genelinde: typeof genelinde !== 'undefined' ? genelinde : undefined, ara: typeof ara !== 'undefined' ? ara : undefined, filtrele: typeof filtrele !== 'undefined' ? filtrele : undefined, ve: typeof ve !== 'undefined' ? ve : undefined, white: typeof white !== 'undefined' ? white : undefined, projectFiles: typeof projectFiles !== 'undefined' ? projectFiles : undefined, dosya: typeof dosya !== 'undefined' ? dosya : undefined, shrink: typeof shrink !== 'undefined' ? shrink : undefined, fileSearch: typeof fileSearch !== 'undefined' ? fileSearch : undefined, setFileSearch: typeof setFileSearch !== 'undefined' ? setFileSearch : undefined, projectFileTypeOptions: typeof projectFileTypeOptions !== 'undefined' ? projectFileTypeOptions : undefined, setFileTypeFilter: typeof setFileTypeFilter !== 'undefined' ? setFileTypeFilter : undefined, whitespace: typeof whitespace !== 'undefined' ? whitespace : undefined, nowrap: typeof nowrap !== 'undefined' ? nowrap : undefined, fileTypeFilter: typeof fileTypeFilter !== 'undefined' ? fileTypeFilter : undefined, setSelectedProjectFileKey: typeof setSelectedProjectFileKey !== 'undefined' ? setSelectedProjectFileKey : undefined, Temizle: typeof Temizle !== 'undefined' ? Temizle : undefined, filteredProjectFiles: typeof filteredProjectFiles !== 'undefined' ? filteredProjectFiles : undefined, file: typeof file !== 'undefined' ? file : undefined, selectedProjectFile: typeof selectedProjectFile !== 'undefined' ? selectedProjectFile : undefined, pendingFileDeleteKey: typeof pendingFileDeleteKey !== 'undefined' ? pendingFileDeleteKey : undefined, handleSelectProjectFile: typeof handleSelectProjectFile !== 'undefined' ? handleSelectProjectFile : undefined, group: typeof group !== 'undefined' ? group : undefined, getProjectFileIconStyle: typeof getProjectFileIconStyle !== 'undefined' ? getProjectFileIconStyle : undefined, getProjectFileSecondaryText: typeof getProjectFileSecondaryText !== 'undefined' ? getProjectFileSecondaryText : undefined, formatProjectFileSize: typeof formatProjectFileSize !== 'undefined' ? formatProjectFileSize : undefined, renderProfileAvatar: typeof renderProfileAvatar !== 'undefined' ? renderProfileAvatar : undefined, currentProfileInitials: typeof currentProfileInitials !== 'undefined' ? currentProfileInitials : undefined, getProfileNameForRecord: typeof getProfileNameForRecord !== 'undefined' ? getProfileNameForRecord : undefined, currentActorName: typeof currentActorName !== 'undefined' ? currentActorName : undefined, Silmek: typeof Silmek !== 'undefined' ? Silmek : undefined, tekrar: typeof tekrar !== 'undefined' ? tekrar : undefined, bas: typeof bas !== 'undefined' ? bas : undefined, projectFileEmptyTitle: typeof projectFileEmptyTitle !== 'undefined' ? projectFileEmptyTitle : undefined, projectFileEmptyDescription: typeof projectFileEmptyDescription !== 'undefined' ? projectFileEmptyDescription : undefined, Bilgileri: typeof Bilgileri !== 'undefined' ? Bilgileri : undefined, getProjectFileInfoRows: typeof getProjectFileInfoRows !== 'undefined' ? getProjectFileInfoRows : undefined, projedeki: typeof projedeki !== 'undefined' ? projedeki : undefined, Sadece: typeof Sadece !== 'undefined' ? Sadece : undefined, size: typeof size !== 'undefined' ? size : undefined, dosyalar: typeof dosyalar !== 'undefined' ? dosyalar : undefined, listelenir: typeof listelenir !== 'undefined' ? listelenir : undefined, projectFileTypeStats: typeof projectFileTypeStats !== 'undefined' ? projectFileTypeStats : undefined, bilgisi: typeof bilgisi !== 'undefined' ? bilgisi : undefined, downloadTaskFileFromSupabase: typeof downloadTaskFileFromSupabase !== 'undefined' ? downloadTaskFileFromSupabase : undefined, handleDeleteProjectFile: typeof handleDeleteProjectFile !== 'undefined' ? handleDeleteProjectFile : undefined, Soldan: typeof Soldan !== 'undefined' ? Soldan : undefined, bir: typeof bir !== 'undefined' ? bir : undefined, min: typeof min !== 'undefined' ? min : undefined, max: typeof max !== 'undefined' ? max : undefined, timeChartSearch: typeof timeChartSearch !== 'undefined' ? timeChartSearch : undefined, setTimeChartSearch: typeof setTimeChartSearch !== 'undefined' ? setTimeChartSearch : undefined, scheduleSearchPlaceholder: typeof scheduleSearchPlaceholder !== 'undefined' ? scheduleSearchPlaceholder : undefined, setIsTimeChartFilterOpen: typeof setIsTimeChartFilterOpen !== 'undefined' ? setIsTimeChartFilterOpen : undefined, setIsTimeChartSettingsOpen: typeof setIsTimeChartSettingsOpen !== 'undefined' ? setIsTimeChartSettingsOpen : undefined, isTimeChartFilterOpen: typeof isTimeChartFilterOpen !== 'undefined' ? isTimeChartFilterOpen : undefined, hideCompleted: typeof hideCompleted !== 'undefined' ? hideCompleted : undefined, hideArchived: typeof hideArchived !== 'undefined' ? hideArchived : undefined, hideNoDate: typeof hideNoDate !== 'undefined' ? hideNoDate : undefined, toggleTimeChartFilter: typeof toggleTimeChartFilter !== 'undefined' ? toggleTimeChartFilter : undefined, timeChartFilters: typeof timeChartFilters !== 'undefined' ? timeChartFilters : undefined, setTimeChartFilters: typeof setTimeChartFilters !== 'undefined' ? setTimeChartFilters : undefined, Filtreleri: typeof Filtreleri !== 'undefined' ? Filtreleri : undefined, goToPreviousTimeChartPeriod: typeof goToPreviousTimeChartPeriod !== 'undefined' ? goToPreviousTimeChartPeriod : undefined, timeChartRangeTitle: typeof timeChartRangeTitle !== 'undefined' ? timeChartRangeTitle : undefined, timeChartFilteredTasks: typeof timeChartFilteredTasks !== 'undefined' ? timeChartFilteredTasks : undefined, goToNextTimeChartPeriod: typeof goToNextTimeChartPeriod !== 'undefined' ? goToNextTimeChartPeriod : undefined, goToCurrentTimeChartPeriod: typeof goToCurrentTimeChartPeriod !== 'undefined' ? goToCurrentTimeChartPeriod : undefined, Hafta: typeof Hafta !== 'undefined' ? Hafta : undefined, changeTimeChartView: typeof changeTimeChartView !== 'undefined' ? changeTimeChartView : undefined, timeChartView: typeof timeChartView !== 'undefined' ? timeChartView : undefined, isTimeChartSettingsOpen: typeof isTimeChartSettingsOpen !== 'undefined' ? isTimeChartSettingsOpen : undefined, compactCards: typeof compactCards !== 'undefined' ? compactCards : undefined, toggleTimeChartSetting: typeof toggleTimeChartSetting !== 'undefined' ? toggleTimeChartSetting : undefined, timeChartSettings: typeof timeChartSettings !== 'undefined' ? timeChartSettings : undefined, scrollTimeChart: typeof scrollTimeChart !== 'undefined' ? scrollTimeChart : undefined, timeChartScrollRef: typeof timeChartScrollRef !== 'undefined' ? timeChartScrollRef : undefined, timeChartPeriods: typeof timeChartPeriods !== 'undefined' ? timeChartPeriods : undefined, time: typeof time !== 'undefined' ? time : undefined, isSameCalendarDay: typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined, timeChartMembers: typeof timeChartMembers !== 'undefined' ? timeChartMembers : undefined, member: typeof member !== 'undefined' ? member : undefined, py: typeof py !== 'undefined' ? py : undefined, createAvatarFromName: typeof createAvatarFromName !== 'undefined' ? createAvatarFromName : undefined, getTimeChartTasksForMemberAndPeriod: typeof getTimeChartTasksForMemberAndPeriod !== 'undefined' ? getTimeChartTasksForMemberAndPeriod : undefined, Sonu: typeof Sonu !== 'undefined' ? Sonu : undefined, getTimeChartTaskColor: typeof getTimeChartTaskColor !== 'undefined' ? getTimeChartTaskColor : undefined, Proje: typeof Proje !== 'undefined' ? Proje : undefined, getTimeChartTaskStartDate: typeof getTimeChartTaskStartDate !== 'undefined' ? getTimeChartTaskStartDate : undefined, getTimeChartTaskEndDate: typeof getTimeChartTaskEndDate !== 'undefined' ? getTimeChartTaskEndDate : undefined, openTaskModalForTimeChartPeriod: typeof openTaskModalForTimeChartPeriod !== 'undefined' ? openTaskModalForTimeChartPeriod : undefined, mb: typeof mb !== 'undefined' ? mb : undefined, setIsCalendarDisplayMenuOpen: typeof setIsCalendarDisplayMenuOpen !== 'undefined' ? setIsCalendarDisplayMenuOpen : undefined, gap: typeof gap !== 'undefined' ? gap : undefined, none: typeof none !== 'undefined' ? none : undefined, isCalendarDisplayMenuOpen: typeof isCalendarDisplayMenuOpen !== 'undefined' ? isCalendarDisplayMenuOpen : undefined, absolute: typeof absolute !== 'undefined' ? absolute : undefined, setCalendarDisplayOptions: typeof setCalendarDisplayOptions !== 'undefined' ? setCalendarDisplayOptions : undefined, prevOptions: typeof prevOptions !== 'undefined' ? prevOptions : undefined, colors: typeof colors !== 'undefined' ? colors : undefined, calendarDisplayOptions: typeof calendarDisplayOptions !== 'undefined' ? calendarDisplayOptions : undefined, bold: typeof bold !== 'undefined' ? bold : undefined, between: typeof between !== 'undefined' ? between : undefined, goToPreviousCalendarPeriod: typeof goToPreviousCalendarPeriod !== 'undefined' ? goToPreviousCalendarPeriod : undefined, tight: typeof tight !== 'undefined' ? tight : undefined, capitalize: typeof capitalize !== 'undefined' ? capitalize : undefined, calendarHeaderTitle: typeof calendarHeaderTitle !== 'undefined' ? calendarHeaderTitle : undefined, goToNextCalendarPeriod: typeof goToNextCalendarPeriod !== 'undefined' ? goToNextCalendarPeriod : undefined, goToCurrentCalendarPeriod: typeof goToCurrentCalendarPeriod !== 'undefined' ? goToCurrentCalendarPeriod : undefined, Ay: typeof Ay !== 'undefined' ? Ay : undefined, pressed: typeof pressed !== 'undefined' ? pressed : undefined, calendarView: typeof calendarView !== 'undefined' ? calendarView : undefined, changeCalendarView: typeof changeCalendarView !== 'undefined' ? changeCalendarView : undefined, blue: typeof blue !== 'undefined' ? blue : undefined, grid: typeof grid !== 'undefined' ? grid : undefined, dayName: typeof dayName !== 'undefined' ? dayName : undefined, last: typeof last !== 'undefined' ? last : undefined, calendarGridDays: typeof calendarGridDays !== 'undefined' ? calendarGridDays : undefined, day: typeof day !== 'undefined' ? day : undefined, getTasksForCalendarDay: typeof getTasksForCalendarDay !== 'undefined' ? getTasksForCalendarDay : undefined, calendarMonthDate: typeof calendarMonthDate !== 'undefined' ? calendarMonthDate : undefined, data: typeof data !== 'undefined' ? data : undefined, calendar: typeof calendar !== 'undefined' ? calendar : undefined, formatDateForTaskModal: typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined, zrc: typeof zrc !== 'undefined' ? zrc : undefined, canCreateTaskFromCalendar: typeof canCreateTaskFromCalendar !== 'undefined' ? canCreateTaskFromCalendar : undefined, cursor: typeof cursor !== 'undefined' ? cursor : undefined, pointer: typeof pointer !== 'undefined' ? pointer : undefined, ekle: typeof ekle !== 'undefined' ? ekle : undefined, openTaskModalForCalendarDay: typeof openTaskModalForCalendarDay !== 'undefined' ? openTaskModalForCalendarDay : undefined, inset: typeof inset !== 'undefined' ? inset : undefined, events: typeof events !== 'undefined' ? events : undefined, leading: typeof leading !== 'undefined' ? leading : undefined, space: typeof space !== 'undefined' ? space : undefined, onMouseDown: typeof onMouseDown !== 'undefined' ? onMouseDown : undefined, truncate: typeof truncate !== 'undefined' ? truncate : undefined, getCalendarTaskBarStyle: typeof getCalendarTaskBarStyle !== 'undefined' ? getCalendarTaskBarStyle : undefined, getPremiumCalendarTaskStyle: typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined, calendarWeekDays: typeof calendarWeekDays !== 'undefined' ? calendarWeekDays : undefined, week: typeof week !== 'undefined' ? week : undefined, mt: typeof mt !== 'undefined' ? mt : undefined, formatCalendarWeekday: typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined, handleCalendarDayClick: typeof handleCalendarDayClick !== 'undefined' ? handleCalendarDayClick : undefined, calendarFocusedDate: typeof calendarFocusedDate !== 'undefined' ? calendarFocusedDate : undefined, tabIndex: typeof tabIndex !== 'undefined' ? tabIndex : undefined, formatCalendarFullDate: typeof formatCalendarFullDate !== 'undefined' ? formatCalendarFullDate : undefined, calendarDayHelperText: typeof calendarDayHelperText !== 'undefined' ? calendarDayHelperText : undefined, Ekle: typeof Ekle !== 'undefined' ? Ekle : undefined, selectedDayCalendarTasks: typeof selectedDayCalendarTasks !== 'undefined' ? selectedDayCalendarTasks : undefined, l: typeof l !== 'undefined' ? l : undefined, Normal: typeof Normal !== 'undefined' ? Normal : undefined, dashed: typeof dashed !== 'undefined' ? dashed : undefined, calendarTasks: typeof calendarTasks !== 'undefined' ? calendarTasks : undefined, list: typeof list !== 'undefined' ? list : undefined, Takvimde: typeof Takvimde !== 'undefined' ? Takvimde : undefined, Tarihi: typeof Tarihi !== 'undefined' ? Tarihi : undefined, olan: typeof olan !== 'undefined' ? olan : undefined, animate: typeof animate !== 'undefined' ? animate : undefined, fade: typeof fade !== 'undefined' ? fade : undefined, overflow: typeof overflow !== 'undefined' ? overflow : undefined, hidden: typeof hidden !== 'undefined' ? hidden : undefined, pr: typeof pr !== 'undefined' ? pr : undefined, canCreateTaskInSelectedProject: typeof canCreateTaskInSelectedProject !== 'undefined' ? canCreateTaskInSelectedProject : undefined, setEditingTask: typeof setEditingTask !== 'undefined' ? setEditingTask : undefined, setIsTaskModalOpen: typeof setIsTaskModalOpen !== 'undefined' ? setIsTaskModalOpen : undefined, extrabold: typeof extrabold !== 'undefined' ? extrabold : undefined, scale: typeof scale !== 'undefined' ? scale : undefined, currentColor: typeof currentColor !== 'undefined' ? currentColor : undefined, round: typeof round !== 'undefined' ? round : undefined, showProjectSettingsControls: typeof showProjectSettingsControls !== 'undefined' ? showProjectSettingsControls : undefined, openGlobalSearch: typeof openGlobalSearch !== 'undefined' ? openGlobalSearch : undefined, setIsEditMode: typeof setIsEditMode !== 'undefined' ? setIsEditMode : undefined, isEditMode: typeof isEditMode !== 'undefined' ? isEditMode : undefined, setOpenMenuColumnId: typeof setOpenMenuColumnId !== 'undefined' ? setOpenMenuColumnId : undefined, modu: typeof modu !== 'undefined' ? modu : undefined, M3: typeof M3 !== 'undefined' ? M3 : undefined, setBoardView: typeof setBoardView !== 'undefined' ? setBoardView : undefined, boardView: typeof boardView !== 'undefined' ? boardView : undefined, pb: typeof pb !== 'undefined' ? pb : undefined, auto: typeof auto !== 'undefined' ? auto : undefined, custom: typeof custom !== 'undefined' ? custom : undefined, scrollbar: typeof scrollbar !== 'undefined' ? scrollbar : undefined, start: typeof start !== 'undefined' ? start : undefined, openAddStageModal: typeof openAddStageModal !== 'undefined' ? openAddStageModal : undefined, visibleBoardColumns: typeof visibleBoardColumns !== 'undefined' ? visibleBoardColumns : undefined, colIdx: typeof colIdx !== 'undefined' ? colIdx : undefined, calc: typeof calc !== 'undefined' ? calc : undefined, mobileActiveColumnId: typeof mobileActiveColumnId !== 'undefined' ? mobileActiveColumnId : undefined, openMenuColumnId: typeof openMenuColumnId !== 'undefined' ? openMenuColumnId : undefined, openTaskMenuId: typeof openTaskMenuId !== 'undefined' ? openTaskMenuId : undefined, e: typeof e !== 'undefined' ? e : undefined, handleDrop: typeof handleDrop !== 'undefined' ? handleDrop : undefined, tracking: typeof tracking !== 'undefined' ? tracking : undefined, color: typeof color !== 'undefined' ? color : undefined, getReadableColumnColor: typeof getReadableColumnColor !== 'undefined' ? getReadableColumnColor : undefined, getReadableColumnMutedColor: typeof getReadableColumnMutedColor !== 'undefined' ? getReadableColumnMutedColor : undefined, getColumnEditToolsStyle: typeof getColumnEditToolsStyle !== 'undefined' ? getColumnEditToolsStyle : undefined, handleMoveColumn: typeof handleMoveColumn !== 'undefined' ? handleMoveColumn : undefined, openEditStageModal: typeof openEditStageModal !== 'undefined' ? openEditStageModal : undefined, handleDeleteColumn: typeof handleDeleteColumn !== 'undefined' ? handleDeleteColumn : undefined, red: typeof red !== 'undefined' ? red : undefined, setOpenTaskMenuId: typeof setOpenTaskMenuId !== 'undefined' ? setOpenTaskMenuId : undefined, slate: typeof slate !== 'undefined' ? slate : undefined, handleCopyColumn: typeof handleCopyColumn !== 'undefined' ? handleCopyColumn : undefined, Kolonu: typeof Kolonu !== 'undefined' ? Kolonu : undefined, kopyala: typeof kopyala !== 'undefined' ? kopyala : undefined, handleArchiveColumnTasks: typeof handleArchiveColumnTasks !== 'undefined' ? handleArchiveColumnTasks : undefined, orange: typeof orange !== 'undefined' ? orange : undefined, handleArchiveColumn: typeof handleArchiveColumn !== 'undefined' ? handleArchiveColumn : undefined, M6: typeof M6 !== 'undefined' ? M6 : undefined, sil: typeof sil !== 'undefined' ? sil : undefined, selectedTasks: typeof selectedTasks !== 'undefined' ? selectedTasks : undefined, priorityOptions: typeof priorityOptions !== 'undefined' ? priorityOptions : undefined, getTaskCardDateParts: typeof getTaskCardDateParts !== 'undefined' ? getTaskCardDateParts : undefined, draggable: typeof draggable !== 'undefined' ? draggable : undefined, canCurrentUserModifyTask: typeof canCurrentUserModifyTask !== 'undefined' ? canCurrentUserModifyTask : undefined, showPermissionWarning: typeof showPermissionWarning !== 'undefined' ? showPermissionWarning : undefined, handleDragStart: typeof handleDragStart !== 'undefined' ? handleDragStart : undefined, handleDragOverTaskPreview: typeof handleDragOverTaskPreview !== 'undefined' ? handleDragOverTaskPreview : undefined, duration: typeof duration !== 'undefined' ? duration : undefined, handleTaskAction: typeof handleTaskAction !== 'undefined' ? handleTaskAction : undefined, Kopyala: typeof Kopyala !== 'undefined' ? Kopyala : undefined, Sil: typeof Sil !== 'undefined' ? Sil : undefined, Patron: typeof Patron !== 'undefined' ? Patron : undefined, wrap: typeof wrap !== 'undefined' ? wrap : undefined, Bit: typeof Bit !== 'undefined' ? Bit : undefined, end: typeof end !== 'undefined' ? end : undefined, mobile: typeof mobile !== 'undefined' ? mobile : undefined, MobileTaskMoveButtons: typeof MobileTaskMoveButtons !== 'undefined' ? MobileTaskMoveButtons : undefined, handleMoveTaskToColumn: typeof handleMoveTaskToColumn !== 'undefined' ? handleMoveTaskToColumn : undefined, setMobileActiveColumnId: typeof setMobileActiveColumnId !== 'undefined' ? setMobileActiveColumnId : undefined, buradan: typeof buradan !== 'undefined' ? buradan : undefined, geri: typeof geri !== 'undefined' ? geri : undefined, getirebilir: typeof getirebilir !== 'undefined' ? getirebilir : undefined, veya: typeof veya !== 'undefined' ? veya : undefined, olarak: typeof olarak !== 'undefined' ? olarak : undefined, silebilirsin: typeof silebilirsin !== 'undefined' ? silebilirsin : undefined, inceleyebilirsin: typeof inceleyebilirsin !== 'undefined' ? inceleyebilirsin : undefined, archivedTasks: typeof archivedTasks !== 'undefined' ? archivedTasks : undefined, TR: typeof TR !== 'undefined' ? TR : undefined, digit: typeof digit !== 'undefined' ? digit : undefined, long: typeof long !== 'undefined' ? long : undefined, numeric: typeof numeric !== 'undefined' ? numeric : undefined, Tarih: typeof Tarih !== 'undefined' ? Tarih : undefined, Eski: typeof Eski !== 'undefined' ? Eski : undefined, t: typeof t !== 'undefined' ? t : undefined, handleRestoreArchivedTask: typeof handleRestoreArchivedTask !== 'undefined' ? handleRestoreArchivedTask : undefined, Geri: typeof Geri !== 'undefined' ? Geri : undefined, Getir: typeof Getir !== 'undefined' ? Getir : undefined, handleDeleteArchivedTask: typeof handleDeleteArchivedTask !== 'undefined' ? handleDeleteArchivedTask : undefined, getirmek: typeof getirmek !== 'undefined' ? getirmek : undefined, tek: typeof tek !== 'undefined' ? tek : undefined, panoya: typeof panoya !== 'undefined' ? panoya : undefined, index: typeof index !== 'undefined' ? index : undefined, tab: typeof tab !== 'undefined' ? tab : undefined};



  

  

  if (!isLoggedIn) {
    return (
      <ZRCAppLoginScreen
        renderSupabaseConnectionBadge={renderSupabaseConnectionBadge}
        handleCredentialLogin={handleCredentialLogin}
        loginDraft={loginDraft}
        setLoginDraft={setLoginDraft}
        setLoginError={setLoginError}
        loginError={loginError}
        authLoginLoading={authLoginLoading}
        authSessionLoading={authSessionLoading}
      />
    );
  }


  const zrcAuthenticatedShellProps = {teamMembers: typeof teamMembers !== 'undefined' ? teamMembers : undefined, createAvatarFromName: typeof createAvatarFromName !== 'undefined' ? createAvatarFromName : undefined, renderSupabaseConnectionBadge: typeof renderSupabaseConnectionBadge !== 'undefined' ? renderSupabaseConnectionBadge : undefined, activeMenu: typeof activeMenu !== 'undefined' ? activeMenu : undefined, setActiveMenu: typeof setActiveMenu !== 'undefined' ? setActiveMenu : undefined, isPanelOpen: typeof isPanelOpen !== 'undefined' ? isPanelOpen : undefined, setIsPanelOpen: typeof setIsPanelOpen !== 'undefined' ? setIsPanelOpen : undefined, projects: typeof projects !== 'undefined' ? projects : undefined, visibleProjectNames: typeof visibleProjectNames !== 'undefined' ? visibleProjectNames : undefined, projectSettings: typeof projectSettings !== 'undefined' ? projectSettings : undefined, handleSidebarProjectsChange: typeof handleSidebarProjectsChange !== 'undefined' ? handleSidebarProjectsChange : undefined, setSelectedProject: typeof setSelectedProject !== 'undefined' ? setSelectedProject : undefined, setActiveContentMenu: typeof setActiveContentMenu !== 'undefined' ? setActiveContentMenu : undefined, setActiveTab: typeof setActiveTab !== 'undefined' ? setActiveTab : undefined, setPendingTeamDeleteId: typeof setPendingTeamDeleteId !== 'undefined' ? setPendingTeamDeleteId : undefined, setPendingCustomerDeleteId: typeof setPendingCustomerDeleteId !== 'undefined' ? setPendingCustomerDeleteId : undefined, openGlobalSearch: typeof openGlobalSearch !== 'undefined' ? openGlobalSearch : undefined, setTeamMembers: typeof setTeamMembers !== 'undefined' ? setTeamMembers : undefined, profileDraft: typeof profileDraft !== 'undefined' ? profileDraft : undefined, currentPermissions: typeof currentPermissions !== 'undefined' ? currentPermissions : undefined, currentUserRole: typeof currentUserRole !== 'undefined' ? currentUserRole : undefined, currentAccountType: typeof currentAccountType !== 'undefined' ? currentAccountType : undefined, currentUserId: typeof currentUserId !== 'undefined' ? currentUserId : undefined, setIsNotificationsOpen: typeof setIsNotificationsOpen !== 'undefined' ? setIsNotificationsOpen : undefined, setIsMessagesOpen: typeof setIsMessagesOpen !== 'undefined' ? setIsMessagesOpen : undefined, setIsGlobalSearchOpen: typeof setIsGlobalSearchOpen !== 'undefined' ? setIsGlobalSearchOpen : undefined, handleMainClick: typeof handleMainClick !== 'undefined' ? handleMainClick : undefined, unreadNotificationCount: typeof unreadNotificationCount !== 'undefined' ? unreadNotificationCount : undefined, isNotificationsOpen: typeof isNotificationsOpen !== 'undefined' ? isNotificationsOpen : undefined, loadActivityLogsFromSupabase: typeof loadActivityLogsFromSupabase !== 'undefined' ? loadActivityLogsFromSupabase : undefined, unreadMessageCount: typeof unreadMessageCount !== 'undefined' ? unreadMessageCount : undefined, isMessagesOpen: typeof isMessagesOpen !== 'undefined' ? isMessagesOpen : undefined, activeContentMenu: typeof activeContentMenu !== 'undefined' ? activeContentMenu : undefined, openMessagesPanel: typeof openMessagesPanel !== 'undefined' ? openMessagesPanel : undefined, handleLogout: typeof handleLogout !== 'undefined' ? handleLogout : undefined, selectedProject: typeof selectedProject !== 'undefined' ? selectedProject : undefined, isMobileProjectPickerOpen: typeof isMobileProjectPickerOpen !== 'undefined' ? isMobileProjectPickerOpen : undefined, setIsMobileProjectPickerOpen: typeof setIsMobileProjectPickerOpen !== 'undefined' ? setIsMobileProjectPickerOpen : undefined, boardColumns: typeof boardColumns !== 'undefined' ? boardColumns : undefined, normalizeColumnTitleForDisplay: typeof normalizeColumnTitleForDisplay !== 'undefined' ? normalizeColumnTitleForDisplay : undefined, renderProfileAvatar: typeof renderProfileAvatar !== 'undefined' ? renderProfileAvatar : undefined, moveMobileTaskToActiveColumn: typeof moveMobileTaskToActiveColumn !== 'undefined' ? moveMobileTaskToActiveColumn : undefined, setMobileTaskWizardData: typeof setMobileTaskWizardData !== 'undefined' ? setMobileTaskWizardData : undefined, setMobileTaskWizardStep: typeof setMobileTaskWizardStep !== 'undefined' ? setMobileTaskWizardStep : undefined, setIsMobileTaskWizardOpen: typeof setIsMobileTaskWizardOpen !== 'undefined' ? setIsMobileTaskWizardOpen : undefined, isMobileTaskWizardOpen: typeof isMobileTaskWizardOpen !== 'undefined' ? isMobileTaskWizardOpen : undefined, mobileTaskWizardStep: typeof mobileTaskWizardStep !== 'undefined' ? mobileTaskWizardStep : undefined, mobileTaskWizardData: typeof mobileTaskWizardData !== 'undefined' ? mobileTaskWizardData : undefined, activeTeamMembers: typeof activeTeamMembers !== 'undefined' ? activeTeamMembers : undefined, normalizeTeamRole: typeof normalizeTeamRole !== 'undefined' ? normalizeTeamRole : undefined, handleSaveTask: typeof handleSaveTask !== 'undefined' ? handleSaveTask : undefined, fixed: typeof fixed !== 'undefined' ? fixed : undefined, inset: typeof inset !== 'undefined' ? inset : undefined, z: typeof z !== 'undefined' ? z : undefined, setIsMessageTaskPickerOpen: typeof setIsMessageTaskPickerOpen !== 'undefined' ? setIsMessageTaskPickerOpen : undefined, Projeler: typeof Projeler !== 'undefined' ? Projeler : undefined, left: typeof left !== 'undefined' ? left : undefined, translate: typeof translate !== 'undefined' ? translate : undefined, w: typeof w !== 'undefined' ? w : undefined, bg: typeof bg !== 'undefined' ? bg : undefined, white: typeof white !== 'undefined' ? white : undefined, border: typeof border !== 'undefined' ? border : undefined, zinc: typeof zinc !== 'undefined' ? zinc : undefined, rounded: typeof rounded !== 'undefined' ? rounded : undefined, shadow: typeof shadow !== 'undefined' ? shadow : undefined, overflow: typeof overflow !== 'undefined' ? overflow : undefined, hidden: typeof hidden !== 'undefined' ? hidden : undefined, animate: typeof animate !== 'undefined' ? animate : undefined, fade: typeof fade !== 'undefined' ? fade : undefined, absolute: typeof absolute !== 'undefined' ? absolute : undefined, top: typeof top !== 'undefined' ? top : undefined, h: typeof h !== 'undefined' ? h : undefined, rotate: typeof rotate !== 'undefined' ? rotate : undefined, l: typeof l !== 'undefined' ? l : undefined, t: typeof t !== 'undefined' ? t : undefined, px: typeof px !== 'undefined' ? px : undefined, b: typeof b !== 'undefined' ? b : undefined, flex: typeof flex !== 'undefined' ? flex : undefined, items: typeof items !== 'undefined' ? items : undefined, center: typeof center !== 'undefined' ? center : undefined, justify: typeof justify !== 'undefined' ? justify : undefined, between: typeof between !== 'undefined' ? between : undefined, text: typeof text !== 'undefined' ? text : undefined, font: typeof font !== 'undefined' ? font : undefined, black: typeof black !== 'undefined' ? black : undefined, Mesajlar: typeof Mesajlar !== 'undefined' ? Mesajlar : undefined, mt: typeof mt !== 'undefined' ? mt : undefined, bold: typeof bold !== 'undefined' ? bold : undefined, mesaj: typeof mesaj !== 'undefined' ? mesaj : undefined, mesajlar: typeof mesajlar !== 'undefined' ? mesajlar : undefined, okundu: typeof okundu !== 'undefined' ? okundu : undefined, markAllMessagesAsRead: typeof markAllMessagesAsRead !== 'undefined' ? markAllMessagesAsRead : undefined, full: typeof full !== 'undefined' ? full : undefined, transition: typeof transition !== 'undefined' ? transition : undefined, all: typeof all !== 'undefined' ? all : undefined, Okundu: typeof Okundu !== 'undefined' ? Okundu : undefined, Yap: typeof Yap !== 'undefined' ? Yap : undefined, max: typeof max !== 'undefined' ? max : undefined, auto: typeof auto !== 'undefined' ? auto : undefined, custom: typeof custom !== 'undefined' ? custom : undefined, scrollbar: typeof scrollbar !== 'undefined' ? scrollbar : undefined, fbfcfd: typeof fbfcfd !== 'undefined' ? fbfcfd : undefined, messageItems: typeof messageItems !== 'undefined' ? messageItems : undefined, space: typeof space !== 'undefined' ? space : undefined, readMessageIds: typeof readMessageIds !== 'undefined' ? readMessageIds : undefined, handleMessageClick: typeof handleMessageClick !== 'undefined' ? handleMessageClick : undefined, blue: typeof blue !== 'undefined' ? blue : undefined, start: typeof start !== 'undefined' ? start : undefined, gap: typeof gap !== 'undefined' ? gap : undefined, shrink: typeof shrink !== 'undefined' ? shrink : undefined, currentProfileInitials: typeof currentProfileInitials !== 'undefined' ? currentProfileInitials : undefined, min: typeof min !== 'undefined' ? min : undefined, truncate: typeof truncate !== 'undefined' ? truncate : undefined, Mesaj: typeof Mesaj !== 'undefined' ? Mesaj : undefined, clamp: typeof clamp !== 'undefined' ? clamp : undefined, getProjectMessageDateLabel: typeof getProjectMessageDateLabel !== 'undefined' ? getProjectMessageDateLabel : undefined, col: typeof col !== 'undefined' ? col : undefined, mb: typeof mb !== 'undefined' ? mb : undefined, none: typeof none !== 'undefined' ? none : undefined, currentColor: typeof currentColor !== 'undefined' ? currentColor : undefined, round: typeof round !== 'undefined' ? round : undefined, M8: typeof M8 !== 'undefined' ? M8 : undefined, M21: typeof M21 !== 'undefined' ? M21 : undefined, yok: typeof yok !== 'undefined' ? yok : undefined, proje: typeof proje !== 'undefined' ? proje : undefined, yaz: typeof yaz !== 'undefined' ? yaz : undefined, handleSendProjectMessage: typeof handleSendProjectMessage !== 'undefined' ? handleSendProjectMessage : undefined, relative: typeof relative !== 'undefined' ? relative : undefined, selectedMessageTask: typeof selectedMessageTask !== 'undefined' ? selectedMessageTask : undefined, Genel: typeof Genel !== 'undefined' ? Genel : undefined, M6: typeof M6 !== 'undefined' ? M6 : undefined, isMessageTaskPickerOpen: typeof isMessageTaskPickerOpen !== 'undefined' ? isMessageTaskPickerOpen : undefined, right: typeof right !== 'undefined' ? right : undefined, bottom: typeof bottom !== 'undefined' ? bottom : undefined, setMessageLinkedTaskId: typeof setMessageLinkedTaskId !== 'undefined' ? setMessageLinkedTaskId : undefined, messageLinkedTaskId: typeof messageLinkedTaskId !== 'undefined' ? messageLinkedTaskId : undefined, messageTaskOptions: typeof messageTaskOptions !== 'undefined' ? messageTaskOptions : undefined, end: typeof end !== 'undefined' ? end : undefined, messageDraft: typeof messageDraft !== 'undefined' ? messageDraft : undefined, setMessageDraft: typeof setMessageDraft !== 'undefined' ? setMessageDraft : undefined, Enter: typeof Enter !== 'undefined' ? Enter : undefined, Proje: typeof Proje !== 'undefined' ? Proje : undefined, resize: typeof resize !== 'undefined' ? resize : undefined, py: typeof py !== 'undefined' ? py : undefined, outline: typeof outline !== 'undefined' ? outline : undefined, submit: typeof submit !== 'undefined' ? submit : undefined, cursor: typeof cursor !== 'undefined' ? cursor : undefined, not: typeof not !== 'undefined' ? not : undefined, allowed: typeof allowed !== 'undefined' ? allowed : undefined, Bildirim: typeof Bildirim !== 'undefined' ? Bildirim : undefined, Bildirimler: typeof Bildirimler !== 'undefined' ? Bildirimler : undefined, Yenile: typeof Yenile !== 'undefined' ? Yenile : undefined, d: typeof d !== 'undefined' ? d : undefined, event: typeof event !== 'undefined' ? event : undefined, fill: typeof fill !== 'undefined' ? fill : undefined, handleNotificationClick: typeof handleNotificationClick !== 'undefined' ? handleNotificationClick : undefined, isRead: typeof isRead !== 'undefined' ? isRead : undefined, markAllNotificationsAsRead: typeof markAllNotificationsAsRead !== 'undefined' ? markAllNotificationsAsRead : undefined, notification: typeof notification !== 'undefined' ? notification : undefined, notificationEmptyDescription: typeof notificationEmptyDescription !== 'undefined' ? notificationEmptyDescription : undefined, notificationItems: typeof notificationItems !== 'undefined' ? notificationItems : undefined, notificationPanelSummary: typeof notificationPanelSummary !== 'undefined' ? notificationPanelSummary : undefined, onClick: typeof onClick !== 'undefined' ? onClick : undefined, readNotificationIds: typeof readNotificationIds !== 'undefined' ? readNotificationIds : undefined, stroke: typeof stroke !== 'undefined' ? stroke : undefined, strokeLinecap: typeof strokeLinecap !== 'undefined' ? strokeLinecap : undefined, strokeLinejoin: typeof strokeLinejoin !== 'undefined' ? strokeLinejoin : undefined, strokeWidth: typeof strokeWidth !== 'undefined' ? strokeWidth : undefined, viewBox: typeof viewBox !== 'undefined' ? viewBox : undefined, yap: typeof yap !== 'undefined' ? yap : undefined, isGlobalSearchOpen: typeof isGlobalSearchOpen !== 'undefined' ? isGlobalSearchOpen : undefined, globalSearchQuery: typeof globalSearchQuery !== 'undefined' ? globalSearchQuery : undefined, setGlobalSearchQuery: typeof setGlobalSearchQuery !== 'undefined' ? setGlobalSearchQuery : undefined, globalSearchResults: typeof globalSearchResults !== 'undefined' ? globalSearchResults : undefined, navigateGlobalSearchResult: typeof navigateGlobalSearchResult !== 'undefined' ? navigateGlobalSearchResult : undefined, calendarDisplayOptions: typeof calendarDisplayOptions !== 'undefined' ? calendarDisplayOptions : undefined, calendarFocusedDate: typeof calendarFocusedDate !== 'undefined' ? calendarFocusedDate : undefined, calendarGridDays: typeof calendarGridDays !== 'undefined' ? calendarGridDays : undefined, calendarHeaderTitle: typeof calendarHeaderTitle !== 'undefined' ? calendarHeaderTitle : undefined, calendarMonthDate: typeof calendarMonthDate !== 'undefined' ? calendarMonthDate : undefined, calendarView: typeof calendarView !== 'undefined' ? calendarView : undefined, calendarWeekDays: typeof calendarWeekDays !== 'undefined' ? calendarWeekDays : undefined, changeCalendarView: typeof changeCalendarView !== 'undefined' ? changeCalendarView : undefined, createQuickNoteFromHome: typeof createQuickNoteFromHome !== 'undefined' ? createQuickNoteFromHome : undefined, deleteQuickNoteFromHome: typeof deleteQuickNoteFromHome !== 'undefined' ? deleteQuickNoteFromHome : undefined, editingQuickNoteId: typeof editingQuickNoteId !== 'undefined' ? editingQuickNoteId : undefined, formatMenuCalendarTaskTime: typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined, formatMenuCalendarWeekHeader: typeof formatMenuCalendarWeekHeader !== 'undefined' ? formatMenuCalendarWeekHeader : undefined, getMenuCalendarAllDayTasks: typeof getMenuCalendarAllDayTasks !== 'undefined' ? getMenuCalendarAllDayTasks : undefined, getMenuCalendarTasksForDay: typeof getMenuCalendarTasksForDay !== 'undefined' ? getMenuCalendarTasksForDay : undefined, getMenuCalendarTasksForHour: typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined, getPremiumCalendarDotStyle: typeof getPremiumCalendarDotStyle !== 'undefined' ? getPremiumCalendarDotStyle : undefined, getPremiumCalendarTaskStyle: typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined, goToNextCalendarPeriod: typeof goToNextCalendarPeriod !== 'undefined' ? goToNextCalendarPeriod : undefined, goToPreviousCalendarPeriod: typeof goToPreviousCalendarPeriod !== 'undefined' ? goToPreviousCalendarPeriod : undefined, homeAssignedTasks: typeof homeAssignedTasks !== 'undefined' ? homeAssignedTasks : undefined, isCalendarDisplayMenuOpen: typeof isCalendarDisplayMenuOpen !== 'undefined' ? isCalendarDisplayMenuOpen : undefined, isQuickNoteComposerOpen: typeof isQuickNoteComposerOpen !== 'undefined' ? isQuickNoteComposerOpen : undefined, isQuickNoteSearchOpen: typeof isQuickNoteSearchOpen !== 'undefined' ? isQuickNoteSearchOpen : undefined, isSameCalendarDay: typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined, menuCalendarHours: typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined, menuCalendarListGroups: typeof menuCalendarListGroups !== 'undefined' ? menuCalendarListGroups : undefined, openHomeCalendarQuickTaskForDate: typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined, openHomeTaskDetail: typeof openHomeTaskDetail !== 'undefined' ? openHomeTaskDetail : undefined, openMenuCalendarTask: typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined, openQuickNoteComposerForEdit: typeof openQuickNoteComposerForEdit !== 'undefined' ? openQuickNoteComposerForEdit : undefined, pendingDeleteQuickNoteId: typeof pendingDeleteQuickNoteId !== 'undefined' ? pendingDeleteQuickNoteId : undefined, quickNoteDraft: typeof quickNoteDraft !== 'undefined' ? quickNoteDraft : undefined, quickNoteSearch: typeof quickNoteSearch !== 'undefined' ? quickNoteSearch : undefined, quickNoteTitleDraft: typeof quickNoteTitleDraft !== 'undefined' ? quickNoteTitleDraft : undefined, quickNotes: typeof quickNotes !== 'undefined' ? quickNotes : undefined, resetQuickNoteComposer: typeof resetQuickNoteComposer !== 'undefined' ? resetQuickNoteComposer : undefined, setCalendarDisplayOptions: typeof setCalendarDisplayOptions !== 'undefined' ? setCalendarDisplayOptions : undefined, setIsCalendarDisplayMenuOpen: typeof setIsCalendarDisplayMenuOpen !== 'undefined' ? setIsCalendarDisplayMenuOpen : undefined, setIsQuickNoteComposerOpen: typeof setIsQuickNoteComposerOpen !== 'undefined' ? setIsQuickNoteComposerOpen : undefined, setIsQuickNoteSearchOpen: typeof setIsQuickNoteSearchOpen !== 'undefined' ? setIsQuickNoteSearchOpen : undefined, setPendingDeleteQuickNoteId: typeof setPendingDeleteQuickNoteId !== 'undefined' ? setPendingDeleteQuickNoteId : undefined, setQuickNoteDraft: typeof setQuickNoteDraft !== 'undefined' ? setQuickNoteDraft : undefined, setQuickNoteSearch: typeof setQuickNoteSearch !== 'undefined' ? setQuickNoteSearch : undefined, setQuickNoteTitleDraft: typeof setQuickNoteTitleDraft !== 'undefined' ? setQuickNoteTitleDraft : undefined, todayStart: typeof todayStart !== 'undefined' ? todayStart : undefined, getMenuCalendarHolidayLabel: typeof getMenuCalendarHolidayLabel !== 'undefined' ? getMenuCalendarHolidayLabel : undefined, handleCalendarDayClick: typeof handleCalendarDayClick !== 'undefined' ? handleCalendarDayClick : undefined, isMenuCalendarFilterOpen: typeof isMenuCalendarFilterOpen !== 'undefined' ? isMenuCalendarFilterOpen : undefined, isMenuCalendarStatusOpen: typeof isMenuCalendarStatusOpen !== 'undefined' ? isMenuCalendarStatusOpen : undefined, menuCalendarStatusFilter: typeof menuCalendarStatusFilter !== 'undefined' ? menuCalendarStatusFilter : undefined, menuCalendarStatusOptions: typeof menuCalendarStatusOptions !== 'undefined' ? menuCalendarStatusOptions : undefined, openMenuCalendarQuickTask: typeof openMenuCalendarQuickTask !== 'undefined' ? openMenuCalendarQuickTask : undefined, setCalendarFocusedDate: typeof setCalendarFocusedDate !== 'undefined' ? setCalendarFocusedDate : undefined, setCalendarMonthDate: typeof setCalendarMonthDate !== 'undefined' ? setCalendarMonthDate : undefined, setCalendarView: typeof setCalendarView !== 'undefined' ? setCalendarView : undefined, setIsMenuCalendarFilterOpen: typeof setIsMenuCalendarFilterOpen !== 'undefined' ? setIsMenuCalendarFilterOpen : undefined, setIsMenuCalendarStatusOpen: typeof setIsMenuCalendarStatusOpen !== 'undefined' ? setIsMenuCalendarStatusOpen : undefined, setMenuCalendarStatusFilter: typeof setMenuCalendarStatusFilter !== 'undefined' ? setMenuCalendarStatusFilter : undefined, canCreateChatGroups: typeof canCreateChatGroups !== 'undefined' ? canCreateChatGroups : undefined, canSendSelectedChatMessage: typeof canSendSelectedChatMessage !== 'undefined' ? canSendSelectedChatMessage : undefined, chatGroupDraft: typeof chatGroupDraft !== 'undefined' ? chatGroupDraft : undefined, chatGroupSearch: typeof chatGroupSearch !== 'undefined' ? chatGroupSearch : undefined, chatPageDraft: typeof chatPageDraft !== 'undefined' ? chatPageDraft : undefined, createChatGroupFromPage: typeof createChatGroupFromPage !== 'undefined' ? createChatGroupFromPage : undefined, filteredChatGroups: typeof filteredChatGroups !== 'undefined' ? filteredChatGroups : undefined, handleSendChatPageMessage: typeof handleSendChatPageMessage !== 'undefined' ? handleSendChatPageMessage : undefined, isChatActionMenuOpen: typeof isChatActionMenuOpen !== 'undefined' ? isChatActionMenuOpen : undefined, isChatGroupModalOpen: typeof isChatGroupModalOpen !== 'undefined' ? isChatGroupModalOpen : undefined, isCurrentProfileRecord: typeof isCurrentProfileRecord !== 'undefined' ? isCurrentProfileRecord : undefined, isProjectMessageVisibleForCurrentUser: typeof isProjectMessageVisibleForCurrentUser !== 'undefined' ? isProjectMessageVisibleForCurrentUser : undefined, projectMessages: typeof projectMessages !== 'undefined' ? projectMessages : undefined, selectedChatGroup: typeof selectedChatGroup !== 'undefined' ? selectedChatGroup : undefined, selectedChatGroupId: typeof selectedChatGroupId !== 'undefined' ? selectedChatGroupId : undefined, selectedChatMessages: typeof selectedChatMessages !== 'undefined' ? selectedChatMessages : undefined, setChatGroupDraft: typeof setChatGroupDraft !== 'undefined' ? setChatGroupDraft : undefined, setChatGroupSearch: typeof setChatGroupSearch !== 'undefined' ? setChatGroupSearch : undefined, setChatPageDraft: typeof setChatPageDraft !== 'undefined' ? setChatPageDraft : undefined, setIsChatActionMenuOpen: typeof setIsChatActionMenuOpen !== 'undefined' ? setIsChatActionMenuOpen : undefined, setIsChatGroupModalOpen: typeof setIsChatGroupModalOpen !== 'undefined' ? setIsChatGroupModalOpen : undefined, setSelectedChatGroupId: typeof setSelectedChatGroupId !== 'undefined' ? setSelectedChatGroupId : undefined, activeProfileTab: typeof activeProfileTab !== 'undefined' ? activeProfileTab : undefined, addProfileEmailAccount: typeof addProfileEmailAccount !== 'undefined' ? addProfileEmailAccount : undefined, emailAccountDraft: typeof emailAccountDraft !== 'undefined' ? emailAccountDraft : undefined, handleProfileAvatarChange: typeof handleProfileAvatarChange !== 'undefined' ? handleProfileAvatarChange : undefined, markSuspiciousEventAsMine: typeof markSuspiciousEventAsMine !== 'undefined' ? markSuspiciousEventAsMine : undefined, pendingProfileDelete: typeof pendingProfileDelete !== 'undefined' ? pendingProfileDelete : undefined, profileAvatarInputRef: typeof profileAvatarInputRef !== 'undefined' ? profileAvatarInputRef : undefined, profilePreferences: typeof profilePreferences !== 'undefined' ? profilePreferences : undefined, removeProfileEmailAccount: typeof removeProfileEmailAccount !== 'undefined' ? removeProfileEmailAccount : undefined, removeProfileSession: typeof removeProfileSession !== 'undefined' ? removeProfileSession : undefined, renderProfileSelect: typeof renderProfileSelect !== 'undefined' ? renderProfileSelect : undefined, saveProfileSection: typeof saveProfileSection !== 'undefined' ? saveProfileSection : undefined, setActiveProfileTab: typeof setActiveProfileTab !== 'undefined' ? setActiveProfileTab : undefined, setEmailAccountDraft: typeof setEmailAccountDraft !== 'undefined' ? setEmailAccountDraft : undefined, setPendingProfileDelete: typeof setPendingProfileDelete !== 'undefined' ? setPendingProfileDelete : undefined, setProfileDraft: typeof setProfileDraft !== 'undefined' ? setProfileDraft : undefined, setProfilePreferences: typeof setProfilePreferences !== 'undefined' ? setProfilePreferences : undefined, toggleProfilePreference: typeof toggleProfilePreference !== 'undefined' ? toggleProfilePreference : undefined, visibleProfileTabs: typeof visibleProfileTabs !== 'undefined' ? visibleProfileTabs : undefined, activeTab: typeof activeTab !== 'undefined' ? activeTab : undefined, archivedTasks: typeof archivedTasks !== 'undefined' ? archivedTasks : undefined, availableProjectTeamMembers: typeof availableProjectTeamMembers !== 'undefined' ? availableProjectTeamMembers : undefined, copyCredentialTextForCustomer: typeof copyCredentialTextForCustomer !== 'undefined' ? copyCredentialTextForCustomer : undefined, copyCredentialTextForMember: typeof copyCredentialTextForMember !== 'undefined' ? copyCredentialTextForMember : undefined, createCustomerFromCenter: typeof createCustomerFromCenter !== 'undefined' ? createCustomerFromCenter : undefined, createTeamMemberFromCenter: typeof createTeamMemberFromCenter !== 'undefined' ? createTeamMemberFromCenter : undefined, customerDraft: typeof customerDraft !== 'undefined' ? customerDraft : undefined, customerLinkNoneLabel: typeof customerLinkNoneLabel !== 'undefined' ? customerLinkNoneLabel : undefined, customerLinkOptions: typeof customerLinkOptions !== 'undefined' ? customerLinkOptions : undefined, customerPageItems: typeof customerPageItems !== 'undefined' ? customerPageItems : undefined, customers: typeof customers !== 'undefined' ? customers : undefined, deleteCustomerFromCenter: typeof deleteCustomerFromCenter !== 'undefined' ? deleteCustomerFromCenter : undefined, deleteTeamMemberFromCenter: typeof deleteTeamMemberFromCenter !== 'undefined' ? deleteTeamMemberFromCenter : undefined, getCustomerById: typeof getCustomerById !== 'undefined' ? getCustomerById : undefined, getCustomerByName: typeof getCustomerByName !== 'undefined' ? getCustomerByName : undefined, getCustomerIdByName: typeof getCustomerIdByName !== 'undefined' ? getCustomerIdByName : undefined, getCustomerLinkedAccount: typeof getCustomerLinkedAccount !== 'undefined' ? getCustomerLinkedAccount : undefined, getCustomerNameById: typeof getCustomerNameById !== 'undefined' ? getCustomerNameById : undefined, getMemberLinkedCustomer: typeof getMemberLinkedCustomer !== 'undefined' ? getMemberLinkedCustomer : undefined, handleArchiveProject: typeof handleArchiveProject !== 'undefined' ? handleArchiveProject : undefined, handleDeleteProject: typeof handleDeleteProject !== 'undefined' ? handleDeleteProject : undefined, handleSaveProjectSettings: typeof handleSaveProjectSettings !== 'undefined' ? handleSaveProjectSettings : undefined, isProjectTeamPickerOpen: typeof isProjectTeamPickerOpen !== 'undefined' ? isProjectTeamPickerOpen : undefined, openCustomerEditModal: typeof openCustomerEditModal !== 'undefined' ? openCustomerEditModal : undefined, openTeamMemberEditModal: typeof openTeamMemberEditModal !== 'undefined' ? openTeamMemberEditModal : undefined, passiveTeamMembers: typeof passiveTeamMembers !== 'undefined' ? passiveTeamMembers : undefined, pendingCustomerDeleteId: typeof pendingCustomerDeleteId !== 'undefined' ? pendingCustomerDeleteId : undefined, pendingTeamDeleteId: typeof pendingTeamDeleteId !== 'undefined' ? pendingTeamDeleteId : undefined, projectSettingsDraft: typeof projectSettingsDraft !== 'undefined' ? projectSettingsDraft : undefined, renderSoftSelect: typeof renderSoftSelect !== 'undefined' ? renderSoftSelect : undefined, selectedCustomer: typeof selectedCustomer !== 'undefined' ? selectedCustomer : undefined, selectedProjectTeamMembers: typeof selectedProjectTeamMembers !== 'undefined' ? selectedProjectTeamMembers : undefined, selectedTeamMemberId: typeof selectedTeamMemberId !== 'undefined' ? selectedTeamMemberId : undefined, setCustomerDraft: typeof setCustomerDraft !== 'undefined' ? setCustomerDraft : undefined, setIsProjectTeamPickerOpen: typeof setIsProjectTeamPickerOpen !== 'undefined' ? setIsProjectTeamPickerOpen : undefined, setProjectSettingsDraft: typeof setProjectSettingsDraft !== 'undefined' ? setProjectSettingsDraft : undefined, setSelectedCustomerId: typeof setSelectedCustomerId !== 'undefined' ? setSelectedCustomerId : undefined, setSelectedTeamMemberId: typeof setSelectedTeamMemberId !== 'undefined' ? setSelectedTeamMemberId : undefined, setTeamMemberDraft: typeof setTeamMemberDraft !== 'undefined' ? setTeamMemberDraft : undefined, showCustomerManagementPage: typeof showCustomerManagementPage !== 'undefined' ? showCustomerManagementPage : undefined, showProjectSettingsControls: typeof showProjectSettingsControls !== 'undefined' ? showProjectSettingsControls : undefined, showTeamManagementPage: typeof showTeamManagementPage !== 'undefined' ? showTeamManagementPage : undefined, teamMemberDraft: typeof teamMemberDraft !== 'undefined' ? teamMemberDraft : undefined, toggleTeamMemberStatus: typeof toggleTeamMemberStatus !== 'undefined' ? toggleTeamMemberStatus : undefined, visibleProjectTabs: typeof visibleProjectTabs !== 'undefined' ? visibleProjectTabs : undefined, zrcFeatureSpreadProps: typeof zrcFeatureSpreadProps !== 'undefined' ? zrcFeatureSpreadProps : undefined, boardView: typeof boardView !== 'undefined' ? boardView : undefined, handleBulkArchive: typeof handleBulkArchive !== 'undefined' ? handleBulkArchive : undefined, handleBulkDelete: typeof handleBulkDelete !== 'undefined' ? handleBulkDelete : undefined, selectedTasks: typeof selectedTasks !== 'undefined' ? selectedTasks : undefined, setSelectedTasks: typeof setSelectedTasks !== 'undefined' ? setSelectedTasks : undefined, addTaskComment: typeof addTaskComment !== 'undefined' ? addTaskComment : undefined, calendarNewTaskDate: typeof calendarNewTaskDate !== 'undefined' ? calendarNewTaskDate : undefined, calendarTaskModalContext: typeof calendarTaskModalContext !== 'undefined' ? calendarTaskModalContext : undefined, canCurrentUserModifyTask: typeof canCurrentUserModifyTask !== 'undefined' ? canCurrentUserModifyTask : undefined, changeCalendarTaskModalProject: typeof changeCalendarTaskModalProject !== 'undefined' ? changeCalendarTaskModalProject : undefined, closeCustomerEditModal: typeof closeCustomerEditModal !== 'undefined' ? closeCustomerEditModal : undefined, closeTaskDetail: typeof closeTaskDetail !== 'undefined' ? closeTaskDetail : undefined, closeTeamMemberEditModal: typeof closeTeamMemberEditModal !== 'undefined' ? closeTeamMemberEditModal : undefined, currentActorAvatar: typeof currentActorAvatar !== 'undefined' ? currentActorAvatar : undefined, currentActorId: typeof currentActorId !== 'undefined' ? currentActorId : undefined, currentActorName: typeof currentActorName !== 'undefined' ? currentActorName : undefined, currentCustomerKeys: typeof currentCustomerKeys !== 'undefined' ? currentCustomerKeys : undefined, customerEditDraft: typeof customerEditDraft !== 'undefined' ? customerEditDraft : undefined, deleteTaskComment: typeof deleteTaskComment !== 'undefined' ? deleteTaskComment : undefined, deleteTaskStoredFileFromSupabase: typeof deleteTaskStoredFileFromSupabase !== 'undefined' ? deleteTaskStoredFileFromSupabase : undefined, detailTaskInfo: typeof detailTaskInfo !== 'undefined' ? detailTaskInfo : undefined, downloadTaskFileFromSupabase: typeof downloadTaskFileFromSupabase !== 'undefined' ? downloadTaskFileFromSupabase : undefined, editTaskFromDetail: typeof editTaskFromDetail !== 'undefined' ? editTaskFromDetail : undefined, editingColumn: typeof editingColumn !== 'undefined' ? editingColumn : undefined, editingCustomer: typeof editingCustomer !== 'undefined' ? editingCustomer : undefined, editingTask: typeof editingTask !== 'undefined' ? editingTask : undefined, editingTeamMember: typeof editingTeamMember !== 'undefined' ? editingTeamMember : undefined, getProjectNameForTask: typeof getProjectNameForTask !== 'undefined' ? getProjectNameForTask : undefined, handleSaveStage: typeof handleSaveStage !== 'undefined' ? handleSaveStage : undefined, isStageModalOpen: typeof isStageModalOpen !== 'undefined' ? isStageModalOpen : undefined, isTaskModalOpen: typeof isTaskModalOpen !== 'undefined' ? isTaskModalOpen : undefined, saveCustomerEdit: typeof saveCustomerEdit !== 'undefined' ? saveCustomerEdit : undefined, saveTeamMemberEdit: typeof saveTeamMemberEdit !== 'undefined' ? saveTeamMemberEdit : undefined, setCalendarNewTaskDate: typeof setCalendarNewTaskDate !== 'undefined' ? setCalendarNewTaskDate : undefined, setCalendarTaskModalContext: typeof setCalendarTaskModalContext !== 'undefined' ? setCalendarTaskModalContext : undefined, setCustomerEditDraft: typeof setCustomerEditDraft !== 'undefined' ? setCustomerEditDraft : undefined, setEditingColumn: typeof setEditingColumn !== 'undefined' ? setEditingColumn : undefined, setEditingTask: typeof setEditingTask !== 'undefined' ? setEditingTask : undefined, setIsStageModalOpen: typeof setIsStageModalOpen !== 'undefined' ? setIsStageModalOpen : undefined, setIsTaskModalOpen: typeof setIsTaskModalOpen !== 'undefined' ? setIsTaskModalOpen : undefined, setTeamMemberEditDraft: typeof setTeamMemberEditDraft !== 'undefined' ? setTeamMemberEditDraft : undefined, taskModalTeamMembers: typeof taskModalTeamMembers !== 'undefined' ? taskModalTeamMembers : undefined, teamMemberEditDraft: typeof teamMemberEditDraft !== 'undefined' ? teamMemberEditDraft : undefined, updateTaskFromDetail: typeof updateTaskFromDetail !== 'undefined' ? updateTaskFromDetail : undefined, uploadTaskFilesToSupabase: typeof uploadTaskFilesToSupabase !== 'undefined' ? uploadTaskFilesToSupabase : undefined};

  return <ZRCAppAuthenticatedShell {...zrcAuthenticatedShellProps} />;
}

function ZRCAppShell() {


  useEffect(() => {
    // zrc-clear-bad-cursor-drag-classes-v1
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const cleanupBadCursorDragClasses = () => {
      document.documentElement.classList.remove('zrc-task-native-dragging');
      document.documentElement.classList.remove('zrc-hide-custom-cursor-during-drag');
      document.documentElement.classList.remove('zrc-desktop-task-dragging');
      document.documentElement.classList.remove('zrc-apple-spring-task-dragging');
      document.documentElement.classList.remove('zrc-task-drag-clone-hidden-active');
      document.body?.classList?.remove('zrc-pure-dot-cursor-down');
      document.body?.classList?.remove('zrc-pure-dot-cursor-clicked');
    };

    cleanupBadCursorDragClasses();

    window.addEventListener('drop', cleanupBadCursorDragClasses, true);
    window.addEventListener('dragend', cleanupBadCursorDragClasses, true);
    window.addEventListener('pointerup', cleanupBadCursorDragClasses, true);
    window.addEventListener('mouseup', cleanupBadCursorDragClasses, true);
    window.addEventListener('blur', cleanupBadCursorDragClasses, true);

    return () => {
      window.removeEventListener('drop', cleanupBadCursorDragClasses, true);
      window.removeEventListener('dragend', cleanupBadCursorDragClasses, true);
      window.removeEventListener('pointerup', cleanupBadCursorDragClasses, true);
      window.removeEventListener('mouseup', cleanupBadCursorDragClasses, true);
      window.removeEventListener('blur', cleanupBadCursorDragClasses, true);
    };
  }, []);


  useEffect(() => {
    // zrc-final-cursor-drag-class-cleanup-v1
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const cleanupDragCursorState = () => {
      document.documentElement.classList.remove('zrc-task-native-dragging');
      document.documentElement.classList.remove('zrc-hide-custom-cursor-during-drag');
      document.documentElement.classList.remove('zrc-desktop-task-dragging');
      document.documentElement.classList.remove('zrc-apple-spring-task-dragging');
      document.documentElement.classList.remove('zrc-task-drag-clone-hidden-active');

      document.body?.classList?.remove('zrc-pure-dot-cursor-down');
      document.body?.classList?.remove('zrc-pure-dot-cursor-clicked');

      document
        .querySelectorAll('[data-zrc-drag-hidden-clone="true"], .zrc-task-drag-in-list-copy-hidden')
        .forEach((element) => {
          element.classList.remove('zrc-task-drag-in-list-copy-hidden');
          element.removeAttribute('data-zrc-drag-hidden-clone');
        });
    };

    window.addEventListener('drop', cleanupDragCursorState, true);
    window.addEventListener('dragend', cleanupDragCursorState, true);
    window.addEventListener('pointerup', cleanupDragCursorState, true);
    window.addEventListener('mouseup', cleanupDragCursorState, true);
    window.addEventListener('blur', cleanupDragCursorState, true);

    document.addEventListener('keyup', (event) => {
      if (event?.key === 'Escape') cleanupDragCursorState();
    }, true);

    return () => {
      window.removeEventListener('drop', cleanupDragCursorState, true);
      window.removeEventListener('dragend', cleanupDragCursorState, true);
      window.removeEventListener('pointerup', cleanupDragCursorState, true);
      window.removeEventListener('mouseup', cleanupDragCursorState, true);
      window.removeEventListener('blur', cleanupDragCursorState, true);
    };
  }, []);


  return (
    <ZRCErrorBoundary buildLabel={ZRC_APP_BUILD_LABEL}>
      <App />
    </ZRCErrorBoundary>
  );
}

export default ZRCAppShell;
// zrc-v411-notes-messages-await-marker

// zrc-v413-customer-account-link-await

// zrc-v424-self-notification-dup-fix-marker
