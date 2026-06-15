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

import RaporlarTabPanel from '../features/raporlar/RaporlarTabPanel';
import GanttCizelgesiTabPanel from '../features/gantt_cizelgesi/GanttCizelgesiTabPanel';
import DosyalarTabPanel from '../features/dosyalar/DosyalarTabPanel';
import ZamanCizelgesiTabPanel from '../features/zaman_cizelgesi/ZamanCizelgesiTabPanel';
import TakvimTabPanel from '../features/takvim/TakvimTabPanel';
import GorevlerTabPanel from '../features/gorevler/GorevlerTabPanel';
import ZRCAppShellActiveProfileTabVeriYonetimiBlock from './blocks/ZRCAppShellActiveProfileTabVeriYonetimiBlock';
import ZRCAppShellActiveProfileTabHesapBlock from './blocks/ZRCAppShellActiveProfileTabHesapBlock';
import ZRCAppShellCalendarViewHaftaBlock from './blocks/ZRCAppShellCalendarViewHaftaBlock';
import ZRCAppShellCalendarViewAyBlock from './blocks/ZRCAppShellCalendarViewAyBlock';
import ZRCAppShellCalendarViewGunBlock from './blocks/ZRCAppShellCalendarViewGunBlock';
import ZRCAppShellCalendarViewHaftaBlock2 from './blocks/ZRCAppShellCalendarViewHaftaBlock2';
import ZRCAppShellCalendarViewAyBlock2 from './blocks/ZRCAppShellCalendarViewAyBlock2';
function App() {

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
        window.prompt('ZRC teknik bilgi:', text);
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
        window.prompt('PWA kurtarma adresi:', recoveryUrl);
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

  const setBoardColumns = (updater) => {
    if (!selectedProject) return;

    setProjectBoards((prevBoards) => {
      const existingBoard = prevBoards[selectedProject] || createDefaultProjectBoard();
      const nextColumns = typeof updater === 'function' ? updater(existingBoard.columns) : updater;

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

  const [openMenuColumnId, setOpenMenuColumnId] = useState(null);
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

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

  // --- MODAL YÖNETİM STATE'LERİ ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [detailTaskInfo, setDetailTaskInfo] = useState(null);

  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);

  const priorityOptions = [
    { label: 'En Düşük', color: '#9ca3af' },
    { label: 'Düşük', color: '#10b981' },
    { label: 'Orta', color: '#f59e0b' },
    { label: 'Yüksek', color: '#f97316' },
    { label: 'Acil', color: '#ef4444' }
  ];

  // --- YARDIMCI FONKSİYONLAR ---
  const formatDateStringShort = (dateStr) => {
    if (!dateStr) return '';

    if (
      dateStr.includes('Ocak') ||
      dateStr.includes('Şubat') ||
      dateStr.includes('Mart') ||
      dateStr.includes('Nisan') ||
      dateStr.includes('Mayıs') ||
      dateStr.includes('Haziran') ||
      dateStr.includes('Temmuz') ||
      dateStr.includes('Ağustos') ||
      dateStr.includes('Eylül') ||
      dateStr.includes('Ekim') ||
      dateStr.includes('Kasım') ||
      dateStr.includes('Aralık')
    ) {
      return dateStr;
    }

    return dateStr;
  };

  const getTaskCardDateParts = (task = {}) => {
    const startDate = formatDateStringShort(task.startDate || task.start || task.baslangicTarihi || '');
    const endDate = formatDateStringShort(
      task.endDate ||
      task.dueDate ||
      task.deadline ||
      task.bitisTarihi ||
      task.date ||
      ''
    );

    return {
      startDate,
      endDate,
      hasAnyDate: Boolean(startDate || endDate)
    };
  };

  // --- STİLLER ---
  const customStyles = (
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght=400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f5f6f8; overflow: hidden; }
        .apple-dock-effect { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s, color 0.25s, box-shadow 0.3s, border-color 0.25s ease; }
        .hover-grow:hover { transform: scale(1.12); }
        .apple-dock-btn:hover:not(.active-menu-btn) { background-color: transparent !important; color: #ffffff !important; }
        .active-menu-btn:hover { background-color: #ffffff !important; color: #ff3600 !important; }
        .mac-genie-panel { transform-origin: 0% 30%; transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.15, 1), opacity 0.3s; }
        .genie-collapsed { transform: perspective(1000px) scaleX(0) scaleY(0.01) skewY(8deg); opacity: 0; visibility: hidden; }
        .genie-expanded { transform: perspective(1000px) scaleX(1) scaleY(1) skewY(0deg); opacity: 1; visibility: visible; }
        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes overlayFadeOut { from { opacity: 1; } to { opacity: 0; } }
        .animate-overlay-in { animation: overlayFadeIn 0.2s ease-out forwards; }
        .animate-overlay-out { animation: overlayFadeOut 0.2s ease-in forwards; }
        @keyframes modalScaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes modalScaleOut { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.95) translateY(10px); } }
        .animate-modal { animation: modalScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-modal-out { animation: modalScaleOut 0.2s ease-in forwards; }
        @keyframes premiumFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: premiumFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes zrcNotePop { from { opacity: 0; transform: translateY(-10px) scale(0.96) rotate(-1.5deg); } to { opacity: 1; transform: translateY(0) scale(1) rotate(-1deg); } }
        @keyframes zrcSoftFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        .zrc-home-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .zrc-home-card:hover { transform: translateY(-2px); box-shadow: 0 16px 38px rgba(30,43,70,0.085); }
        .zrc-note-composer-float { animation: zrcNotePop 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .zrc-note-mini-float { animation: zrcSoftFloat 2.8s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.12); border-radius: 4px; }
        .task-menu-item { display: flex; align-items: center; padding: 10px 14px; cursor: pointer; transition: background-color 0.15s ease; color: #3f3f46; font-size: 13px; font-weight: 500; gap: 10px; width: 100%; user-select: none; }
        .task-menu-item:hover { background-color: #f4f4f5; }
        .task-menu-item svg { color: #71717a; flex-shrink: 0; }
        .task-menu-item.danger { color: #dc2626; border-top: 1px solid #f3f4f6; }
        .task-menu-item.danger:hover { background-color: #fef2f2; }
        .task-menu-item.danger svg { color: #dc2626; }
        .rte-btn { padding: 4px 8px; border-radius: 4px; color: #4b5563; font-weight: bold; font-size: 11.5px; transition: background-color 0.15s; cursor: pointer; }
        .rte-btn:hover { background-color: #e5e7eb; }
        [contenteditable=true]:empty:before { content: attr(placeholder); color: #9ca3af; pointer-events: none; display: block; }
      `}
    </style>
  );

  const isSupabaseUuid = (value = '') =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value || ''));

  const getCurrentSupabaseWorkspaceId = () =>
    supabaseWorkspaceId || currentRoleMember?.workspaceId || '';

  const setSupabaseWriteInfo = (state, label) => {
    setSupabaseWriteStatus({ state, label });
  };

  const getSafeSupabasePriority = (priority = '') => {
    const cleanPriority = String(priority || '').trim();
    return ['Düşük', 'Normal', 'Yüksek', 'Acil'].includes(cleanPriority) ? cleanPriority : 'Normal';
  };

  const getPlainTaskDescription = (value) => {
    if (!value) return '';

    if (typeof value === 'string') {
      return value === '[object Object]' ? '' : value;
    }

    if (Array.isArray(value)) {
      return value.map(getPlainTaskDescription).filter(Boolean).join('\n');
    }

    if (typeof value === 'object') {
      if (typeof value.text === 'string') return value.text;
      if (typeof value.plainText === 'string') return value.plainText;
      if (typeof value.description === 'string') return value.description;
      if (typeof value.content === 'string') return value.content;

      if (Array.isArray(value.blocks)) {
        return value.blocks.map(getPlainTaskDescription).filter(Boolean).join('\n');
      }

      if (Array.isArray(value.children)) {
        return value.children.map(getPlainTaskDescription).filter(Boolean).join('\n');
      }

      return '';
    }

    return '';
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
        updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null
      };

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


  const updateSupabaseTaskColumn = async (task, targetColumn) => {
    if (!task?.supabaseId || !targetColumn?.title) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase görev durumu güncelleniyor');

    try {
      const projectId = await ensureSupabaseProject(selectedProject);
      const targetColumnIndex = Math.max(0, boardColumns.findIndex((column) => column.id === targetColumn.id || column.title === targetColumn.title));
      const columnId = await ensureSupabaseColumn(projectId, targetColumn, targetColumnIndex);

      const { error } = await supabase
        .from('tasks')
        .update({
          column_id: columnId || null,
          status: targetColumn.title,
          is_archived: false,
          updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null
        })
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
    if (!task?.supabaseId) return false;

    zrcSetSupabaseWriteInfo('saving', 'Supabase görev arşivleniyor');

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          is_archived: true,
          archived_at: new Date().toISOString(),
          updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null
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
          updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null
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

  const formatSupabaseDateTimeParts = (value = '') => {
    const date = value ? new Date(value) : new Date();

    return {
      date: `${date.getDate()} ${date.toLocaleString('tr-TR', { month: 'long' })} ${date.getFullYear()}`,
      time: date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
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

  const mapSupabaseStepToLocalStep = (step = {}) => ({
    id: `supabase-step-${step.id}`,
    supabaseId: step.id,
    text: step.text || '',
    completed: step.is_completed === true
  });

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
            updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null
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

  const getSupabaseFileTypeLabel = (fileName = '') => {
    const extension = String(fileName || '').split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) return 'Görsel';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return 'Video';
    if (['pdf'].includes(extension)) return 'PDF';
    if (['doc', 'docx'].includes(extension)) return 'Word';
    if (['xls', 'xlsx'].includes(extension)) return 'Excel';
    if (['ppt', 'pptx'].includes(extension)) return 'Sunum';

    return extension ? extension.toUpperCase() : 'Dosya';
  };

  const sanitizeStorageFileName = (fileName = 'dosya') =>
    String(fileName || 'dosya')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 140) || 'dosya';

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
      window.alert('Bu dosyanın Supabase yükleme yolu bulunamadı. Eski metadata kaydı olabilir.');
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

  const mapSupabaseCustomerToLocal = (customer = {}) =>
    normalizeCustomerRecord({
      id: customer.id,
      supabaseId: customer.id,
      name: customer.name || 'Müşteri',
      contact: customer.contact_name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      note: customer.note || '',
      status: customer.status || 'Aktif',
      accountUserId: customer.account_user_id || ''
    });

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

  const mapSupabaseWorkspaceMemberToLocal = (member = {}) => {
    const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
    const memberName = profile?.display_name || member.username || profile?.email || 'Kullanıcı';

    return normalizeTeamMember({
      id: member.user_id,
      workspaceId: member.workspace_id,
      name: memberName,
      email: profile?.email || '',
      username: member.username || profile?.email || '',
      password: '',
      role: member.role || 'Ekip Üyesi',
      customerId: member.customer_id || '',
      avatar: profile?.avatar_url || createAvatarFromName(memberName),
      status: member.status || 'Aktif'
    });
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

  const normalizeProjectNameList = (projectList = []) =>
    Array.from(
      new Set(
        (Array.isArray(projectList) ? projectList : [])
          .map((projectName) => String(projectName || '').trim())
          .filter(Boolean)
      )
    );

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

  const mergeUniqueByKey = (existingItems = [], incomingItems = [], getKey = (item) => item?.id) => {
    const seenKeys = new Set();
    const result = [];

    [...incomingItems, ...existingItems].forEach((item) => {
      const key = getKey(item) || item?.id || JSON.stringify(item);

      if (seenKeys.has(key)) return;

      seenKeys.add(key);
      result.push(item);
    });

    return result;
  };

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
    if (!isSupabaseConfigured) return false;

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
  const sanitizeProfileDraftForSafeApi = (draft = {}) => ({
    ...draft,
    firstName: String(draft.firstName || '').trim(),
    lastName: String(draft.lastName || '').trim(),
    email: String(draft.email || '').trim(),
    title: String(draft.title || '').trim(),
    language: draft.language || 'Türkçe',
    status: draft.status || 'Hiçbiri',
    dateFormat: draft.dateFormat || 'DD/MM/YYYY (30/05/2026)',
    timeFormat: draft.timeFormat || '24-Saat Formatı (02:21)',
    timezone: draft.timezone || 'UTC+03:00',
    password: '',
    currentPassword: '',
    newPassword: '',
    repeatPassword: ''
  });

  const sanitizeProfilePreferencesForSafeApi = (preferences = {}) => {
    const clone = { ...(preferences || {}) };

    delete clone.password;
    delete clone.currentPassword;
    delete clone.newPassword;
    delete clone.repeatPassword;
    delete clone.token;
    delete clone.secret;
    delete clone.serviceRoleKey;

    return clone;
  };

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
      alert(safeApiResult.message || 'Bu profil ayarı için yetkin yok.');
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

  const mapSupabaseQuickNoteToLocal = (note = {}) => ({
    id: `supabase-note-${note.id}`,
    supabaseId: note.id,
    text: note.text || '',
    createdAt: note.created_at || new Date().toISOString()
  });

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

  const mapSupabaseActivityLogToLocal = (log = {}) => {
    const payload = log.payload || {};

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

      const mappedLogs = (logs || []).map(mapSupabaseActivityLogToLocal);

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
            preferenceReadIds = normalizeStorageArray(preferences.readNotificationIds || [], []);
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

  const createSupabaseHealthRow = (key, label, state, detail = '') => ({
    key,
    label,
    state,
    detail,
    checkedAt: new Date().toISOString()
  });

  const getSupabaseHealthStateClass = (state = 'idle') => {
    if (state === 'ok') return 'bg-emerald-50 border-emerald-100 text-emerald-700';
    if (state === 'warning') return 'bg-zinc-100 border-zinc-200 text-zinc-700';
    if (state === 'error') return 'bg-red-50 border-red-100 text-red-600';

    return 'bg-slate-50 border-slate-100 text-slate-600';
  };

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

  const runSupabaseHealthCheck = async () => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    setSupabaseHealthLoading(true);
    zrcSetSupabaseWriteInfo('saving', 'Supabase sağlık kontrolü yapılıyor');

    const rows = [];

    try {
      if (!workspaceId) {
        rows.push(createSupabaseHealthRow('workspace', 'Workspace bağlantısı', 'error', 'Aktif workspace bulunamadı.'));
        setSupabaseHealthReport(rows);
        zrcSetSupabaseWriteInfo('error', 'Supabase sağlık kontrolü: workspace yok');
        return;
      }

      rows.push(createSupabaseHealthRow('workspace', 'Workspace bağlantısı', 'ok', workspaceId));

      const tableChecks = [
        ['projects', 'Projeler'],
        ['board_columns', 'Kolonlar'],
        ['tasks', 'Görevler'],
        ['task_comments', 'Yorumlar'],
        ['task_steps', 'Adımlar'],
        ['files', 'Dosya kayıtları'],
        ['customers', 'Müşteriler'],
        ['messages', 'Mesajlar'],
        ['activity_logs', 'Aktivite kayıtları'],
        ['quick_notes', 'Hızlı notlar']
      ];

      for (const [tableName, label] of tableChecks) {
        try {
          const { count, error } = await countSupabaseTableRows(tableName);

          if (error) {
            rows.push(createSupabaseHealthRow(tableName, label, 'error', error.message || 'Okuma hatası'));
          } else {
            rows.push(createSupabaseHealthRow(tableName, label, 'ok', `${count || 0} kayıt`));
          }
        } catch (error) {
          rows.push(createSupabaseHealthRow(tableName, label, 'error', error?.message || 'Kontrol edilemedi'));
        }
      }

      try {
        const { data, error } = await supabase.storage
          .from('project-files')
          .list(workspaceId, { limit: 1 });

        if (error) {
          rows.push(createSupabaseHealthRow('storage', 'Storage / project-files', 'error', error.message || 'Storage erişim hatası'));
        } else {
          rows.push(createSupabaseHealthRow('storage', 'Storage / project-files', 'ok', `${Array.isArray(data) ? data.length : 0} örnek klasör/dosya göründü`));
        }
      } catch (error) {
        rows.push(createSupabaseHealthRow('storage', 'Storage / project-files', 'warning', error?.message || 'Storage listesi kontrol edilemedi'));
      }

      rows.push(createSupabaseHealthRow(
        'realtime',
        'Realtime canlı senkron',
        supabaseRealtimeStatus.state === 'connected' ? 'ok' : supabaseRealtimeStatus.state === 'error' ? 'error' : 'warning',
        supabaseRealtimeStatus.label
      ));

      rows.push(createSupabaseHealthRow(
        'pwa',
        'Mobil/PWA kurulum',
        pwaInstallStatus.state === 'installed' || pwaInstallStatus.state === 'ready' ? 'ok' : 'warning',
        pwaInstallStatus.label
      ));

      const hasError = rows.some((row) => row.state === 'error');
      const hasWarning = rows.some((row) => row.state === 'warning');

      setSupabaseHealthReport(rows);
      zrcSetSupabaseWriteInfo(
        hasError ? 'error' : hasWarning ? 'saved' : 'saved',
        hasError ? 'Supabase sağlık kontrolünde hata var' : 'Supabase sağlık kontrolü tamamlandı'
      );
    } finally {
      setSupabaseHealthLoading(false);
    }
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

  const downloadJsonSnapshot = (snapshot, fileNamePrefix = 'zrc-yedek') => {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${fileNamePrefix}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const readSupabaseTableForBackup = async (tableName, mode = 'workspace') => {
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
  };

  const buildSupabaseBackupSnapshot = async () => {
    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId) {
      throw new Error('Supabase workspace bulunamadı.');
    }

    const backupTables = [
      ['workspaces', 'customWorkspace'],
      ['profiles', 'currentUser'],
      ['workspace_members', 'workspace'],
      ['customers', 'workspace'],
      ['projects', 'workspace'],
      ['project_members', 'workspace'],
      ['project_customers', 'workspace'],
      ['board_columns', 'workspace'],
      ['tasks', 'workspace'],
      ['task_assignees', 'taskOnly'],
      ['task_followers', 'taskOnly'],
      ['task_comments', 'workspace'],
      ['task_steps', 'workspace'],
      ['files', 'workspace'],
      ['messages', 'workspace'],
      ['chat_groups', 'workspace'],
      ['chat_group_members', 'chatGroupOnly'],
      ['notifications', 'workspace'],
      ['activity_logs', 'workspace'],
      ['quick_notes', 'workspace'],
      ['user_preferences', 'currentUserPreference']
    ];

    const tables = {};
    const errors = [];

    const { data: taskRowsForRelations } = await supabase
      .from('tasks')
      .select('id')
      .eq('workspace_id', workspaceId);

    const taskIds = (taskRowsForRelations || []).map((task) => task.id).filter(Boolean);

    const { data: chatRowsForRelations } = await supabase
      .from('chat_groups')
      .select('id')
      .eq('workspace_id', workspaceId);

    const chatGroupIds = (chatRowsForRelations || []).map((group) => group.id).filter(Boolean);

    for (const [tableName, mode] of backupTables) {
      try {
        let result = null;

        if (mode === 'customWorkspace') {
          result = await supabase.from(tableName).select('*').eq('id', workspaceId);
        } else if (mode === 'taskOnly') {
          result = taskIds.length
            ? await supabase.from(tableName).select('*').in('task_id', taskIds)
            : { data: [], error: null };
        } else if (mode === 'chatGroupOnly') {
          result = chatGroupIds.length
            ? await supabase.from(tableName).select('*').in('chat_group_id', chatGroupIds)
            : { data: [], error: null };
        } else {
          result = await readSupabaseTableForBackup(tableName, mode);
        }

        if (result?.error) {
          errors.push({ table: tableName, message: result.error.message || 'Okuma hatası' });
          tables[tableName] = [];
        } else {
          tables[tableName] = result?.data || [];
        }
      } catch (error) {
        errors.push({ table: tableName, message: error?.message || 'Okuma hatası' });
        tables[tableName] = [];
      }
    }

    let storage = {
      bucket: 'project-files',
      root: workspaceId,
      items: [],
      error: ''
    };

    try {
      const { data, error } = await supabase.storage
        .from('project-files')
        .list(workspaceId, { limit: 100 });

      if (error) {
        storage.error = error.message || 'Storage listelenemedi';
      } else {
        storage.items = data || [];
      }
    } catch (error) {
      storage.error = error?.message || 'Storage listelenemedi';
    }

    return {
      source: 'zrc-supabase-backup',
      appDataVersion: APP_DATA_VERSION,
      exportedAt: new Date().toISOString(),
      workspaceId,
      currentUserId,
      tables,
      storage,
      errors
    };
  };

  const downloadSupabaseBackupSnapshot = async () => {
    if (!ensureCanManageLocalData()) return;

    setSupabaseBackupLoading(true);
    zrcSetSupabaseWriteInfo('saving', 'Supabase yedeği hazırlanıyor');

    try {
      const snapshot = await buildSupabaseBackupSnapshot();

      downloadJsonSnapshot(snapshot, 'zrc-supabase-yedek');
      setSupabaseLastBackupAt(snapshot.exportedAt);

      setProfilePreferences((prev) => ({
        ...prev,
        lastSupabaseBackupAt: snapshot.exportedAt,
        lastSavedAt: new Date().toISOString()
      }));

      zrcSetSupabaseWriteInfo(
        snapshot.errors?.length ? 'error' : 'saved',
        snapshot.errors?.length
          ? `Supabase yedeği alındı ama ${snapshot.errors.length} tablo uyarı verdi`
          : 'Supabase yedeği indirildi'
      );
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase yedek hatası: ${error?.message || 'bilinmeyen hata'}`);
    } finally {
      setSupabaseBackupLoading(false);
    }
  };

  const copySupabaseBackupSnapshot = async () => {
    if (!ensureCanManageLocalData()) return;

    setSupabaseBackupLoading(true);
    zrcSetSupabaseWriteInfo('saving', 'Supabase yedeği kopyalanıyor');

    try {
      const snapshot = await buildSupabaseBackupSnapshot();

      await copyTextToClipboard(
        JSON.stringify(snapshot, null, 2),
        snapshot.errors?.length
          ? `Supabase yedeği kopyalandı ama ${snapshot.errors.length} tablo uyarı verdi.`
          : 'Supabase yedeği kopyalandı.'
      );

      setSupabaseLastBackupAt(snapshot.exportedAt);

      setProfilePreferences((prev) => ({
        ...prev,
        lastSupabaseBackupAt: snapshot.exportedAt,
        lastSavedAt: new Date().toISOString()
      }));

      zrcSetSupabaseWriteInfo('saved', 'Supabase yedeği kopyalandı');
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase yedek kopyalama hatası: ${error?.message || 'bilinmeyen hata'}`);
    } finally {
      setSupabaseBackupLoading(false);
    }
  };

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
      updated_by: isSupabaseUuid(currentUserId) ? currentUserId : null
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

    const confirmed = window.confirm(
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

    const refreshDelay = Number.isFinite(options?.delay) ? options.delay : 80;

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
      'user_preferences'
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

      window.alert(iosInstallMessage);
      return;
    }

    if (!pwaInstallPrompt) {
      setPwaInstallStatus({
        state: 'error',
        label: 'Kurulum hazır değil: sayfayı yenileyip tekrar dene'
      });

      window.alert('Kurulum penceresi şu an hazır değil. Chrome/Edge kullanıyorsan sayfayı bir kez yenileyip tekrar dene. iPhone kullanıyorsan Safari > Paylaş > Ana Ekrana Ekle yolunu kullan.');
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

  const formatSupabaseDateForLocalTask = (value = '') => {
    const cleanValue = String(value || '').trim();

    if (!cleanValue) return '';

    const [year, month, day] = cleanValue.split('-').map(Number);

    if (!year || !month || !day) return cleanValue;

    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(year, month - 1, day));
  };

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

  const mergeSupabaseBoardIntoLocalState = (projectName, dbColumns = [], dbTasks = []) => {
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

          if (hasSupabaseIdentity) return false;

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
          columns: nextColumns,
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
  };

  const handleSaveStage = async (updatedColumn) => {
    if (!requirePermission('manageColumns', 'Kolonları sadece Yönetici düzenleyebilir.')) return;

    const columnToSave = {
      ...(editingColumn || {}),
      ...(updatedColumn || {}),
      id: editingColumn?.id || updatedColumn?.id || `col-${Date.now()}`,
      title: normalizeColumnTitleForDisplay(updatedColumn?.title || editingColumn?.title || 'Yeni Görev'),
      tasks: updatedColumn?.tasks || editingColumn?.tasks || []
    };

    const deletedColumnStorageKey = `zrc-deleted-column-titles-${selectedProject}`;
    const savedColumnTitleKey = normalizeColumnTitleForDisplay(columnToSave.title);
    const cleanedDeletedColumnTitles = normalizeStorageArray(readStorageValue(deletedColumnStorageKey, []), [])
      .filter((title) => normalizeColumnTitleForDisplay(title) !== savedColumnTitleKey);
    writeStorageValue(deletedColumnStorageKey, cleanedDeletedColumnTitles);

    const zrcV458IsNewColumn = !boardColumns.some(
      (col) => col.id === columnToSave.id || normalizeColumnTitleForDisplay(col.title) === normalizeColumnTitleForDisplay(columnToSave.title)
    );

    setBoardColumns((prev) => {
      const exists = prev.some((col) => col.id === columnToSave.id);

      if (exists) {
        return prev.map((col) => (col.id === columnToSave.id ? { ...col, ...columnToSave } : col));
      }

      return [...prev, { ...columnToSave, tasks: columnToSave.tasks || [] }];
    });

    // zrc-v458-mobile-new-column-live-capsule
    if (zrcV458IsNewColumn) {
      setMobileActiveColumnId(columnToSave.id);
    }

    setZrcMobileColumnRefreshKey((value) => value + 1);

    window.setTimeout(() => {
      setZrcMobileColumnRefreshKey((value) => value + 1);
    }, 120);

    const didSaveStageToSupabase = await saveStageToSupabase(columnToSave);

    if (didSaveStageToSupabase) {
      setTimeout(() => {
        loadSelectedProjectBoardFromSupabase();
        // zrc-v458-mobile-refresh-after-supabase-reload
        setZrcMobileColumnRefreshKey((value) => value + 1);
      }, 500);
    }

    setIsStageModalOpen(false);
    setEditingColumn(null);
  };


  const openAddStageModal = () => {
    if (!requirePermission('manageColumns', 'Yeni kolon ekleme yetkisi sadece Yönetici rolünde var.')) return;

    setEditingColumn({
      id: `col-${Date.now()}`,
      title: '',
      color: '#64748b',
      desc: 'Bu aşamada bekleyen işler yer alır.',
      tasks: []
    });
    setIsStageModalOpen(true);
    setOpenMenuColumnId(null);
  };

  const openEditStageModal = (column) => {
    if (!requirePermission('manageColumns', 'Kolon düzenleme yetkisi sadece Yönetici rolünde var.')) return;

    setEditingColumn(column);
    setIsStageModalOpen(true);
    setOpenMenuColumnId(null);
  };

  // --- SÜTUN İŞLEMLERİ ---
  const handleMoveColumn = (index, direction) => {
    if (!requirePermission('manageColumns', 'Kolon sıralama yetkisi sadece Yönetici rolünde var.')) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= boardColumns.length) return;

    setBoardColumns((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleDeleteColumn = async (columnId) => {
    if (!requirePermission('manageColumns', 'Kolon silme yetkisi sadece Yönetici rolünde var.')) return;

    const columnToDelete = boardColumns.find((column) => column.id === columnId);
    const confirmed = window.confirm('Bu kolonu ve içindeki tüm görevleri kalıcı olarak silmek istediğine emin misin?');
    if (!confirmed) return;

    const deletedColumnTitleKey = normalizeColumnTitleForDisplay(columnToDelete?.title || '');
    const deletedColumnStorageKey = `zrc-deleted-column-titles-${selectedProject}`;
    const previousDeletedColumnTitles = normalizeStorageArray(readStorageValue(deletedColumnStorageKey, []), []);

    if (deletedColumnTitleKey && !previousDeletedColumnTitles.map(normalizeColumnTitleForDisplay).includes(deletedColumnTitleKey)) {
      writeStorageValue(deletedColumnStorageKey, [...previousDeletedColumnTitles, deletedColumnTitleKey]);
    }

    setBoardColumns((prev) => prev.filter((col) => col.id !== columnId));
    setOpenMenuColumnId(null);

    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId || !selectedProject || !columnToDelete) {
      zrcSetSupabaseWriteInfo('saved', 'Kolon yerelden silindi');
      return;
    }

    zrcSetSupabaseWriteInfo('saving', 'Supabase kolon siliniyor');

    try {
      const projectId = await ensureSupabaseProject(selectedProject);
      if (!projectId) throw new Error('Proje ID bulunamadı');

      const { data: projectColumns, error: columnsSelectError } = await supabase
        .from('board_columns')
        .select('id, title')
        .eq('project_id', projectId);

      if (columnsSelectError) throw columnsSelectError;

      const targetTitleKey = normalizeColumnTitleForDisplay(columnToDelete.title);
      const columnIdsToDelete = (projectColumns || [])
        .filter((column) => {
          const columnTitleKey = normalizeColumnTitleForDisplay(column.title);
          return column.id === columnId || columnTitleKey === targetTitleKey;
        })
        .map((column) => column.id)
        .filter(isSupabaseUuid);

      const localTaskIdsToDelete = (columnToDelete.tasks || [])
        .map((task) => task.supabaseId)
        .filter(isSupabaseUuid);

      let dbTaskIdsToDelete = [];

      if (columnIdsToDelete.length > 0) {
        const { data: columnTasks, error: columnTasksError } = await supabase
          .from('tasks')
          .select('id')
          .in('column_id', columnIdsToDelete);

        if (columnTasksError) throw columnTasksError;

        dbTaskIdsToDelete = (columnTasks || []).map((task) => task.id).filter(isSupabaseUuid);
      }

      const taskIdsToDelete = [...new Set([...localTaskIdsToDelete, ...dbTaskIdsToDelete])];

      if (taskIdsToDelete.length > 0) {
        const { error: taskDeleteError } = await supabase
          .from('tasks')
          .delete()
          .in('id', taskIdsToDelete);

        if (taskDeleteError) throw taskDeleteError;
      }

      if (columnIdsToDelete.length > 0) {
        const { error: columnDeleteError } = await supabase
          .from('board_columns')
          .delete()
          .in('id', columnIdsToDelete);

        if (columnDeleteError) throw columnDeleteError;
      } else {
        const titleCandidates = [...new Set([
          columnToDelete.title,
          normalizeColumnTitleForDisplay(columnToDelete.title),
          targetTitleKey === 'Yeni Görev' ? 'Bekliyor' : ''
        ].filter(Boolean))];

        const { error: titleDeleteError } = await supabase
          .from('board_columns')
          .delete()
          .eq('project_id', projectId)
          .in('title', titleCandidates);

        if (titleDeleteError) throw titleDeleteError;
      }

      zrcSetSupabaseWriteInfo('saved', 'Supabase kolon silindi');
      setTimeout(() => loadSelectedProjectBoardFromSupabase(), 700);
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase kolon silme hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
  };


  const handleCopyColumn = (column, index) => {
    if (!requirePermission('manageColumns', 'Kolon kopyalama yetkisi sadece Yönetici rolünde var.')) return;

    const now = Date.now();

    const copiedColumn = {
      id: `col-${now}`,
      title: `${column.title} - Kopya`,
      color: column.color,
      desc: column.desc,
      tasks: (column.tasks || []).map((task, taskIndex) => ({
        ...task,
        id: `task-${now}-${taskIndex}`,
        title: `${task.title} - Kopya`,
        history: [
          {
            id: `history-${now}-${taskIndex}`,
            type: 'description',
            title: 'Görev kopyalandı',
            description: `${task.title} görevinden kolon kopyası içinde yeni görev oluşturuldu.`,
            actor: currentActorName,
            avatar: currentActorAvatar,
            userId: currentActorId,
            date: `${new Date().getDate()} ${new Date().toLocaleString('tr-TR', { month: 'long' })} ${new Date().getFullYear()}`,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          },
          ...(task.history || [])
        ]
      }))
    };

    setBoardColumns((prev) => {
      const updated = [...prev];
      updated.splice(index + 1, 0, copiedColumn);
      return updated;
    });

    setOpenMenuColumnId(null);
  };

  const handleArchiveColumnTasks = (column) => {
    if (!requirePermission('deleteTasks', 'Kolondaki görevleri arşivleme yetkisi sadece Yönetici rolünde var.')) return;

    const tasksToArchive = column.tasks || [];

    if (tasksToArchive.length === 0) {
      alert('Bu kolonda arşivlenecek görev yok.');
      setOpenMenuColumnId(null);
      return;
    }

    const confirmed = window.confirm(`${column.title} kolonundaki tüm görevleri arşivlemek istediğine emin misin?`);
    if (!confirmed) return;

    setArchivedTasks((prev) => [
      ...tasksToArchive.map((task) => ({
        ...task,
        archivedAt: new Date().toISOString(),
        sourceColumnId: column.id,
        sourceColumnTitle: column.title
      })),
      ...prev
    ]);

    tasksToArchive.forEach((task) => archiveSupabaseTask({
      ...task,
      sourceColumnId: column.id,
      sourceColumnTitle: column.title
    }));

    setBoardColumns((prev) =>
      prev.map((col) =>
        col.id === column.id ? { ...col, tasks: [] } : col
      )
    );

    setOpenMenuColumnId(null);
  };

  const handleArchiveColumn = async (column) => {
    if (!requirePermission('manageColumns', 'Kolon arşivleme yetkisi sadece Yönetici rolünde var.')) return;

    const confirmed = window.confirm(`${column.title} kolonunu arşivlemek istediğine emin misin? Kolondaki görevler de Arşiv sekmesine taşınır.`);
    if (!confirmed) return;

    const tasksToArchive = column.tasks || [];

    if (tasksToArchive.length > 0) {
      setArchivedTasks((prev) => [
        ...tasksToArchive.map((task) => ({
          ...task,
          archivedAt: new Date().toISOString(),
          sourceColumnId: column.id
        })),
        ...prev
      ]);

      tasksToArchive.forEach((task) => archiveSupabaseTask({
        ...task,
        sourceColumnId: column.id,
        sourceColumnTitle: column.title
      }));
    }

    setBoardColumns((prev) => prev.filter((col) => col.id !== column.id));
    setOpenMenuColumnId(null);

    if (!isSupabaseUuid(column.id)) return;

    zrcSetSupabaseWriteInfo('saving', 'Supabase kolon arşivleniyor');

    try {
      const { error } = await supabase
        .from('board_columns')
        .update({ is_archived: true })
        .eq('id', column.id);

      if (error) throw error;

      zrcSetSupabaseWriteInfo('saved', 'Supabase kolon arşivlendi');
      setTimeout(() => loadSelectedProjectBoardFromSupabase(), 500);
    } catch (error) {
      zrcSetSupabaseWriteInfo('error', `Supabase kolon arşiv hatası: ${error?.message || 'bilinmeyen hata'}`);
    }
  };


  const openTaskDetail = (task, columnTitle) => {
    if (task && !isTaskAccessibleForCurrentUser(task)) {
      showPermissionWarning('Bu görevi görüntüleme yetkin yok.');
      return;
    }

    setOpenTaskMenuId(null);
    setOpenMenuColumnId(null);
    setDetailTaskInfo({ task, columnTitle });
  };

  const closeTaskDetail = () => {
    setDetailTaskInfo(null);
  };

  const editTaskFromDetail = () => {
    if (!detailTaskInfo?.task) return;
    if (!requirePermission('editTasks', 'Bu rol görev düzenleyemez.')) return;

    if (currentAccountType === 'Ekip Üyesi' && !isCurrentUserProjectMember(selectedProject)) {
      showPermissionWarning('Bu projede görev düzenleme yetkin yok.');
      return;
    }

    if (!canCurrentUserModifyTask(detailTaskInfo.task, getProjectNameForTask(detailTaskInfo.task) || selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için düzenleyemezsin.');
      return;
    }

    setEditingTask({
      ...detailTaskInfo.task,
      status: detailTaskInfo.columnTitle || 'Bekliyor'
    });

    setDetailTaskInfo(null);
    setIsTaskModalOpen(true);
  };

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

  const getIdentityValuesFromRecord = (record = {}) =>
    [
      record.id,
      record.userId,
      record.senderId,
      record.ownerId,
      record.creatorId,
      record.createdById,
      record.memberId,
      record.name,
      record.fullName,
      record.author,
      record.sender,
      record.actor,
      record.email,
      record.username
    ]
      .filter(Boolean)
      .map((value) => normalizeCredentialText(value));

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
    if (currentAccountType === 'Patron') return true;
    if (currentAccountType === 'Ekip Üyesi') return isCurrentUserProjectMember(projectName);
    if (currentAccountType === 'Müşteri') return isCurrentCustomerProject(projectName);

    return false;
  };

  const visibleProjectNames = projects.filter((projectName) => isProjectVisibleForCurrentUser(projectName));


  const moveMobileTaskToActiveColumn = async (taskToMove = {}) => {
    const activeProjectName = selectedProject;

    if (!activeProjectName || !taskToMove?.id) return;

    const activeColumn = (boardColumns || []).find(
      (column) => normalizeColumnTitleForDisplay(column.title) === 'Aktif'
    );

    if (!activeColumn) {
      alert('Aktif kolonu bulunamadı.');
      return;
    }

    const targetStatus = activeColumn.title || 'Aktif';
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
      columnTitle: targetStatus,
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

      const targetIndex = nextColumns.findIndex(
        (column) => normalizeColumnTitleForDisplay(column.title) === 'Aktif'
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
          (boardColumns || []).findIndex((column) => normalizeColumnTitleForDisplay(column.title) === 'Aktif')
        );
        const activeColumnId = await ensureSupabaseColumn(projectId, activeColumn, targetColumnIndex);

        const { error } = await supabase
          .from('tasks')
          .update({
            column_id: activeColumnId,
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

  const visibleBoardColumns = boardColumns.map((column) => ({
    ...column,
    tasks: (column.tasks || []).filter((task) => isTaskVisibleForProject(task, selectedProject))
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

  const ensureCanCreateTaskInSelectedProject = (permissionMessage = 'Bu rol görev oluşturamaz.') => {
    if (!requirePermission('createTasks', permissionMessage)) return false;

    if (!selectedProject) {
      alert('Görev oluşturmak için önce proje seçmelisin.');
      return false;
    }

    if (currentAccountType === 'Ekip Üyesi' && !isCurrentUserProjectMember(selectedProject)) {
      alert('Bu projede görev oluşturmak için önce Proje Ayarları > Proje Ekibi alanına eklenmelisin.');
      return false;
    }

    if (currentAccountType === 'Müşteri') {
      alert('Müşteri/Misafir hesabı görev oluşturamaz.');
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

  const showPermissionWarning = (message = 'Bu işlem için yetkin yok.') => {
    if (shouldShowPermissionWarnings) {
      alert(message);
    }
  };

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

  const getActivityDateLabel = (createdAt) => {
    const date = createdAt ? new Date(createdAt) : new Date();

    if (Number.isNaN(date.getTime())) return 'Şimdi';

    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };


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

  const updateTaskFromDetail = (taskId, updates, historyEntry = null) => {
    if (historyEntry?.type?.startsWith('file') && !requirePermission('manageFiles', 'Bu rol dosya ekleyemez veya silemez.')) return;
    if (['description', 'step', 'step-delete'].includes(historyEntry?.type) && !requirePermission('editTasks', 'Bu rol görev detaylarını düzenleyemez.')) return;

    const sourceTask = detailTaskInfo?.task || reportTasks.find((task) => task.id === taskId) || null;
    const sourceColumnTitle = detailTaskInfo?.columnTitle || sourceTask?.columnTitle || '';

    if (sourceTask && !isTaskAccessibleForCurrentUser(sourceTask)) {
      showPermissionWarning('Bu görev üzerinde işlem yapma yetkin yok.');
      return;
    }

    if (sourceTask && !canCurrentUserModifyTask(sourceTask, getProjectNameForTask(sourceTask) || selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için işlem yapamazsın.');
      return;
    }

    setBoardColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => {
          if (task.id !== taskId) return task;

          const nextTask = { ...task, ...updates };

          if (historyEntry) {
            nextTask.history = [historyEntry, ...(task.history || [])];
          }

          return nextTask;
        })
      }))
    );

    setDetailTaskInfo((prev) => {
      if (prev?.task?.id !== taskId) return prev;

      const nextTask = { ...prev.task, ...updates };

      if (historyEntry) {
        nextTask.history = [historyEntry, ...(prev.task.history || [])];
      }

      return { ...prev, task: nextTask };
    });

    if (historyEntry?.type === 'file') {
      createActivityNotification({
        type: 'file',
        title: historyEntry.title || 'Dosya eklendi',
        text: historyEntry.description || sourceTask?.title || 'Dosya',
        meta: `${sourceTask?.title || 'Görev'} · ${selectedProject}`,
        task: sourceTask ? { ...sourceTask, ...updates } : null,
        columnTitle: sourceColumnTitle,
        actor: getProfileNameForRecord(historyEntry, currentProfileName),
        avatar: getProfileAvatarForRecord(historyEntry, currentProfileAvatar),
        targetUserIds: getTaskAssigneeUserIdsForNotification(sourceTask || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
        sortWeight: 780
      });
    }

    if (historyEntry?.type === 'description') {
      createActivityNotification({
        type: 'history',
        title: historyEntry.title || 'Görev güncellendi',
        text: sourceTask?.title || 'Görev',
        meta: `${sourceColumnTitle || 'Görev'} · ${selectedProject}`,
        task: sourceTask ? { ...sourceTask, ...updates } : null,
        columnTitle: sourceColumnTitle,
        actor: getProfileNameForRecord(historyEntry, currentProfileName),
        avatar: getProfileAvatarForRecord(historyEntry, currentProfileAvatar),
        targetUserIds: getTaskAssigneeUserIdsForNotification(sourceTask || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
        sortWeight: 520
      });
    }

    const shouldSyncDetailUpdate =
      Array.isArray(updates.comments) ||
      Array.isArray(updates.steps) ||
      Array.isArray(updates.files) ||
      historyEntry?.type === 'description';

    if (shouldSyncDetailUpdate) {
      syncTaskDetailsToSupabase(taskId, updates, {
        syncDescription: historyEntry?.type === 'description'
      });
    }
  };

  const addTaskComment = (taskId, commentText) => {
    const sourceTask = detailTaskInfo?.task || reportTasks.find((task) => task.id === taskId) || null;

    if (sourceTask && !canCurrentUserModifyTask(sourceTask, getProjectNameForTask(sourceTask) || selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için yorum ekleyemezsin.');
      return;
    }

    const cleanComment = commentText.trim();
    if (!cleanComment) return;

    const now = new Date();

    const newComment = {
      id: `comment-${Date.now()}`,
      author: currentProfileName,
      avatar: currentProfileAvatar,
      userId: currentActorId,
      text: cleanComment,
      createdAt: now.toISOString(),
      date: `${now.getDate()} ${now.toLocaleString('tr-TR', { month: 'long' })} ${now.getFullYear()}`,
      time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    const currentComments = detailTaskInfo?.task?.comments || [];
    updateTaskFromDetail(
      taskId,
      { comments: [...currentComments, newComment] },
      createHistoryEntry('comment', 'Yorum eklendi', cleanComment)
    );

    createActivityNotification({
      type: 'comment',
      title: 'Yeni yorum',
      text: cleanComment,
      meta: `${detailTaskInfo?.task?.title || 'Görev'} · ${currentProfileName}`,
      task: detailTaskInfo?.task || null,
      columnTitle: detailTaskInfo?.columnTitle || '',
      targetUserIds: getTaskAssigneeUserIdsForNotification(detailTaskInfo?.task || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
      sortWeight: 860
    });
  };

  const deleteTaskComment = (taskId, commentId) => {
    const sourceTask = detailTaskInfo?.task || reportTasks.find((task) => task.id === taskId) || null;

    if (sourceTask && !canCurrentUserModifyTask(sourceTask, getProjectNameForTask(sourceTask) || selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için yorum silemezsin.');
      return;
    }

    const currentComments = detailTaskInfo?.task?.comments || [];
    const deletedComment = currentComments.find((comment) => comment.id === commentId);

    updateTaskFromDetail(
      taskId,
      {
        comments: currentComments.filter((comment) => comment.id !== commentId)
      },
      createHistoryEntry('comment-delete', 'Yorum silindi', deletedComment?.text || '')
    );
  };















  const handleMoveTaskToColumn = (sourceColumnId, targetColumnId, task = {}) => {
    setOpenTaskMenuId(null);

    if (!currentPermissions.editTasks) {
      showPermissionWarning('Bu rol görev durumunu değiştiremez.');
      return;
    }

    const sourceColumn = boardColumns.find((column) => column.id === sourceColumnId);
    const targetColumn = boardColumns.find((column) => column.id === targetColumnId);

    if (!sourceColumn || !targetColumn || sourceColumnId === targetColumnId) return;

    const sourceTask = sourceColumn.tasks.find((item) => item.id === task.id) || task;

    if (!sourceTask?.id) return;

    if (!canCurrentUserModifyTask(sourceTask, selectedProject)) {
      showPermissionWarning('Bu görev sana atanmadığı için durumunu değiştiremezsin.');
      return;
    }

    const movedTask = {
      ...sourceTask,
      status: targetColumn.title,
      columnTitle: targetColumn.title
    };

    setBoardColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((column) => ({
        ...column,
        tasks: [...(column.tasks || [])]
      }));

      const nextSourceColumn = updatedColumns.find((column) => column.id === sourceColumnId);
      const nextTargetColumn = updatedColumns.find((column) => column.id === targetColumnId);

      if (!nextSourceColumn || !nextTargetColumn) return prevColumns;

      nextSourceColumn.tasks = nextSourceColumn.tasks.filter((item) => item.id !== sourceTask.id);
      nextTargetColumn.tasks = [...nextTargetColumn.tasks, movedTask];

      return updatedColumns;
    });

    createActivityNotification({
      type: 'status',
      title: 'Görev durumu değişti',
      text: sourceTask.title || 'Adsız görev',
      meta: `${sourceColumn.title || 'Eski durum'} → ${targetColumn.title || 'Yeni durum'}`,
      task: movedTask,
      columnTitle: targetColumn.title,
      targetUserIds: getTaskAssigneeUserIdsForNotification(sourceTask || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
      sortWeight: 820
    });

    updateSupabaseTaskColumn(movedTask, targetColumn);
  };


  // --- KART (GÖREV) İŞLEMLERİ ---
  const handleTaskAction = (action, columnId, task) => {
    setOpenTaskMenuId(null);

    const columnTitle = boardColumns.find((column) => column.id === columnId)?.title || task.status || 'Yeni Görev';

    if (action === 'detay') {
      openTaskDetail(task, columnTitle);
      return;
    }

    if (action === 'duzenle') {
      if (!requirePermission('editTasks', 'Bu rol görev düzenleyemez.')) return;

      if (currentAccountType === 'Ekip Üyesi' && !isCurrentUserProjectMember(selectedProject)) {
        showPermissionWarning('Bu projede görev düzenleme yetkin yok.');
        return;
      }

      if (!canCurrentUserModifyTask(task, selectedProject)) {
        showPermissionWarning('Bu görev sana atanmadığı için düzenleyemezsin.');
        return;
      }

      setEditingTask({ ...task, status: columnTitle });
      setIsTaskModalOpen(true);
      return;
    }

    if (action === 'kopyala') {
      if (!ensureCanCreateTaskInSelectedProject('Bu rol görev kopyalayamaz.')) return;

      if (currentAccountType === 'Ekip Üyesi' && !canCurrentUserModifyTask(task, selectedProject)) {
        showPermissionWarning('Bu görev sana atanmadığı için kopyalayamazsın.');
        return;
      }

      const copiedTask = {
        ...task,
        id: `task-${Date.now()}`,
        assignees: normalizeAssigneesForCurrentAccountSave(task.assignees || [], [], false),
        followers: [],
        title: `${task.title} - Kopya`,
        comments: [],
        files: [],
        history: [
          {
            id: `history-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            type: 'description',
            title: 'Görev kopyalandı',
            description: `${task.title} görevinden kopya oluşturuldu.`,
            actor: currentActorName,
            avatar: currentActorAvatar,
            userId: currentActorId,
            date: `${new Date().getDate()} ${new Date().toLocaleString('tr-TR', { month: 'long' })} ${new Date().getFullYear()}`,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };

      setBoardColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, tasks: [copiedTask, ...col.tasks] } : col
        )
      );
      return;
    }

    if (action === 'arsivle') {
      if (!requirePermission('deleteTasks', 'Görev arşivleme yetkisi sadece Yönetici rolünde var.')) return;

      setArchivedTasks((prev) => [{ ...task, archivedAt: new Date().toISOString(), sourceColumnId: columnId, sourceColumnTitle: columnTitle }, ...prev]);

      setBoardColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((item) => item.id !== task.id) }
            : col
        )
      );

      archiveSupabaseTask({ ...task, sourceColumnId: columnId, sourceColumnTitle: columnTitle });

      setSelectedTasks((prev) => prev.filter((id) => id !== task.id));
      if (detailTaskInfo?.task?.id === task.id) setDetailTaskInfo(null);
      return;
    }

    if (action === 'sil') {
      if (!requirePermission('deleteTasks', 'Görev silme yetkisi sadece Yönetici rolünde var.')) return;

      const confirmed = window.confirm('Bu görevi silmek istediğine emin misin?');
      if (!confirmed) return;

      setBoardColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((item) => item.id !== task.id) }
            : col
        )
      );

      deleteSupabaseTask(task);

      setSelectedTasks((prev) => prev.filter((id) => id !== task.id));
      if (detailTaskInfo?.task?.id === task.id) setDetailTaskInfo(null);
    }
  };

  // --- TOPLU İŞLEMLER ---
  const handleBulkDelete = () => {
    if (!requirePermission('deleteTasks', 'Toplu görev silme yetkisi sadece Yönetici rolünde var.')) return;

    if (window.confirm(`${selectedTasks.length} görevi silmek istediğinize emin misiniz?`)) {
      const tasksToDelete = [];

      boardColumns.forEach((col) => {
        col.tasks.forEach((task) => {
          if (selectedTasks.includes(task.id)) {
            tasksToDelete.push(task);
          }
        });
      });

      tasksToDelete.forEach((task) => deleteSupabaseTask(task));

      setBoardColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.filter((t) => !selectedTasks.includes(t.id))
        }))
      );

      setSelectedTasks([]);
    }
  };

  const handleBulkArchive = () => {
    if (!requirePermission('deleteTasks', 'Toplu görev arşivleme yetkisi sadece Yönetici rolünde var.')) return;

    const tasksToArchive = [];

    boardColumns.forEach((col) => {
      col.tasks.forEach((t) => {
        if (selectedTasks.includes(t.id)) {
          tasksToArchive.push({
            ...t,
            archivedAt: new Date().toISOString(),
            sourceColumnId: col.id,
            sourceColumnTitle: col.title
          });
        }
      });
    });

    tasksToArchive.forEach((task) => archiveSupabaseTask(task));

    setArchivedTasks((prev) => [...prev, ...tasksToArchive]);

    setBoardColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => !selectedTasks.includes(t.id))
      }))
    );

    setSelectedTasks([]);
    alert(`${tasksToArchive.length} görev arşivlendi.`);
  };

  const handleRestoreArchivedTask = (task) => {
    if (!requirePermission('deleteTasks', 'Arşivden geri getirme yetkisi sadece Yönetici rolünde var.')) return;

    const restoredTask = { ...task };
    delete restoredTask.archivedAt;
    delete restoredTask.sourceColumnId;
    delete restoredTask.sourceColumnTitle;

    setArchivedTasks((prev) => prev.filter((archivedTask) => archivedTask.id !== task.id));

    setBoardColumns((prev) => {
      const updatedColumns = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));
      const originalColumnIndex = updatedColumns.findIndex((col) => col.id === task.sourceColumnId);
      const waitingColumnIndex = updatedColumns.findIndex((col) => col.title === 'Bekliyor' || col.title.includes('Bekliyor'));
      const targetIndex = originalColumnIndex !== -1 ? originalColumnIndex : waitingColumnIndex !== -1 ? waitingColumnIndex : 0;

      const targetColumn = updatedColumns[targetIndex];
      restoreSupabaseTask(restoredTask, targetColumn);

      updatedColumns[targetIndex].tasks.push(restoredTask);

      return updatedColumns;
    });
  };

  const handleDeleteArchivedTask = (taskId) => {
    const confirmed = window.confirm('Bu arşiv kaydını kalıcı olarak silmek istediğine emin misin?');
    if (!confirmed) return;

    const archivedTask = archivedTasks.find((task) => task.id === taskId);

    if (archivedTask) {
      deleteSupabaseTask(archivedTask);
    }

    setArchivedTasks((prev) => prev.filter((archivedTask) => archivedTask.id !== taskId));
  };


  // --- SÜRÜKLE BIRAK ---
  const draggedTaskInfo = useRef(null);
  const supabaseRealtimeRefreshTimer = useRef(null);

  const handleDragStart = (e, taskId, sourceColId) => {
    const sourceColumn = boardColumns.find((column) => column.id === sourceColId);
    const sourceTask = sourceColumn?.tasks.find((task) => task.id === taskId) || null;

    if (!sourceTask || !canCurrentUserModifyTask(sourceTask, selectedProject)) {
      draggedTaskInfo.current = null;
      e.preventDefault();
      showPermissionWarning('Bu görev sana atanmadığı için durumunu değiştiremezsin.');
      return;
    }

    draggedTaskInfo.current = { taskId, sourceColId };
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetColId, targetTaskId = null) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTaskInfo.current) return;

    const { taskId, sourceColId } = draggedTaskInfo.current;

    if (sourceColId === targetColId && taskId === targetTaskId) return;

    const sourceColumnBeforeMove = boardColumns.find((column) => column.id === sourceColId);
    const targetColumnBeforeMove = boardColumns.find((column) => column.id === targetColId);
    const taskBeforeMove = sourceColumnBeforeMove?.tasks.find((task) => task.id === taskId) || null;

    if (taskBeforeMove && !canCurrentUserModifyTask(taskBeforeMove, selectedProject)) {
      draggedTaskInfo.current = null;
      showPermissionWarning('Bu görev sana atanmadığı için durumunu değiştiremezsin.');
      return;
    }

    setBoardColumns((prevColumns) => {
      const updatedCols = prevColumns.map((col) => ({ ...col, tasks: [...col.tasks] }));
      const sourceColumn = updatedCols.find((c) => c.id === sourceColId);
      const targetColumn = updatedCols.find((c) => c.id === targetColId);

      if (!sourceColumn || !targetColumn) return prevColumns;

      const taskToMoveIndex = sourceColumn.tasks.findIndex((t) => t.id === taskId);
      if (taskToMoveIndex === -1) return prevColumns;

      const taskToMove = sourceColumn.tasks[taskToMoveIndex];

      sourceColumn.tasks.splice(taskToMoveIndex, 1);

      if (targetTaskId) {
        const targetIdx = targetColumn.tasks.findIndex((t) => t.id === targetTaskId);

        if (targetIdx !== -1) {
          targetColumn.tasks.splice(targetIdx, 0, taskToMove);
        } else {
          targetColumn.tasks.push(taskToMove);
        }
      } else {
        targetColumn.tasks.push(taskToMove);
      }

      return updatedCols;
    });

    if (taskBeforeMove && sourceColId !== targetColId) {
      createActivityNotification({
        type: 'status',
        title: 'Görev durumu değişti',
        text: taskBeforeMove.title || 'Adsız görev',
        meta: `${sourceColumnBeforeMove?.title || 'Eski durum'} → ${targetColumnBeforeMove?.title || 'Yeni durum'}`,
        task: { ...taskBeforeMove, columnTitle: targetColumnBeforeMove?.title },
        columnTitle: targetColumnBeforeMove?.title,
        targetUserIds: getTaskAssigneeUserIdsForNotification(taskBeforeMove || {}).filter((userId) => !isCurrentSupabaseUserId(userId)),
        sortWeight: 820
      });

      if (targetColumnBeforeMove) {
        updateSupabaseTaskColumn(taskBeforeMove, targetColumnBeforeMove);
      }
    }

    draggedTaskInfo.current = null;
  };

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

  const goToPreviousCalendarPeriod = () => {
    if (calendarView === 'Hafta') {
      setCalendarFocusedDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setDate(prevDate.getDate() - 7);
        return nextDate;
      });
      return;
    }

    if (calendarView === 'Gün') {
      setCalendarFocusedDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setDate(prevDate.getDate() - 1);
        return nextDate;
      });
      return;
    }

    setCalendarMonthDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextCalendarPeriod = () => {
    if (calendarView === 'Hafta') {
      setCalendarFocusedDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setDate(prevDate.getDate() + 7);
        return nextDate;
      });
      return;
    }

    if (calendarView === 'Gün') {
      setCalendarFocusedDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setDate(prevDate.getDate() + 1);
        return nextDate;
      });
      return;
    }

    setCalendarMonthDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const goToCurrentCalendarPeriod = () => {
    const now = new Date();
    setCalendarMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setCalendarFocusedDate(now);
  };

  const changeCalendarView = (view) => {
    setCalendarView(view);
    setIsCalendarDisplayMenuOpen(false);

    if (view === 'Ay') {
      setCalendarMonthDate(new Date(calendarFocusedDate.getFullYear(), calendarFocusedDate.getMonth(), 1));
    }
  };

  const getCalendarTaskBarStyle = (priority, isArchivedTask = false) => {
    if (isArchivedTask) return 'bg-slate-50 text-slate-500 border-slate-200 border-l-[3px] shadow-[0_8px_18px_rgba(15,23,42,0.045)]';

    return 'bg-white text-current border-[#dfe5ee] border-l-[3px] shadow-[0_8px_18px_rgba(15,23,42,0.055)] hover:border-[#cbd5e1] hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)]';
  };

  const handleCalendarDayClick = (event, date) => {
    const target = event.target;

    if (target?.closest?.('[data-calendar-task-button="true"]')) {
      return;
    }

    event.stopPropagation();
    setCalendarFocusedDate(date);
    openTaskModalForCalendarDay(date);
  };

  const handleCalendarGridClick = (event) => {
    const target = event.target;

    if (target?.closest?.('[data-calendar-task-button="true"]')) {
      return;
    }

    const dayElement = target?.closest?.('[data-calendar-day]');
    const dateValue = dayElement?.getAttribute?.('data-calendar-day');

    if (!dateValue) return;

    event.stopPropagation();

    const [year, month, day] = dateValue.split('-').map(Number);
    openTaskModalForCalendarDay(new Date(year, month - 1, day));
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
      currentAccountType,
      projectBoards,
      selectedProject,
      setCalendarFocusedDate,
      setCalendarNewTaskDate,
      setCalendarTaskModalContext,
      setEditingTask,
      setIsTaskModalOpen,
      setSelectedProject
    });



  const changeCalendarTaskModalProject = (projectName) => {
    setSelectedProject(projectName);
    setCalendarTaskModalContext((prevContext) => ({
      ...prevContext,
      projectName
    }));
  };

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

  const openTaskModalForCalendarDay = (date, event = null) => {
    openCalendarQuickTaskCreator(date, event);
  };

  const closeCalendarQuickTaskCreator = () => {
    setCalendarQuickTaskDraft({
      isOpen: false,
      projectName: '',
      title: '',
      description: '',
      status: '',
      date: ''
    });
    setCalendarNewTaskDate(null);
  };

  const updateCalendarQuickTaskProject = (projectName) => {
    const statusOptions = getCalendarQuickTaskStatusOptions(projectName);

    setCalendarQuickTaskDraft((prevDraft) => ({
      ...prevDraft,
      projectName,
      status: statusOptions.includes(prevDraft.status) ? prevDraft.status : statusOptions[0] || 'Yeni Görev'
    }));
  };

  const saveCalendarQuickTaskFromModal = async (event) => {
    event.preventDefault();

    const projectName = calendarQuickTaskDraft.projectName;
    const title = calendarQuickTaskDraft.title.trim();
    const description = calendarQuickTaskDraft.description.trim();
    const taskDate = calendarQuickTaskDraft.date || formatDateForTaskModal(new Date());

    if (!projectName) {
      alert('Lütfen görev için bir proje seç.');
      return;
    }

    if (!title) {
      alert('Lütfen görev başlığı yaz.');
      return;
    }

    if (currentAccountType === 'Ekip Üyesi' && !isCurrentUserProjectMember(projectName)) {
      alert('Bu projede görev oluşturmak için önce Proje Ayarları > Proje Ekibi alanına eklenmelisin.');
      return;
    }

    const projectBoard = projectBoards[projectName] || createDefaultProjectBoard();
    const projectColumns = projectBoard.columns || createDefaultProjectBoard().columns || [];
    const targetStatus = calendarQuickTaskDraft.status || projectColumns[0]?.title || 'Yeni Görev';
    const targetColumn = projectColumns.find((column) => column.title === targetStatus) || projectColumns[0] || {
      id: `col-${Date.now()}`,
      title: targetStatus,
      color: '#55ace8',
      tasks: []
    };

    const nextTask = {
      id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      description,
      note: description,
      priority: 'Normal',
      status: targetColumn.title,
      startDate: taskDate,
      dueDate: '',
      endDate: '',
      date: '',
      assignees: normalizeAssigneesForCurrentAccountSave([], [], false),
      followers: [],
      tags: [],
      customer: '',
      customerId: '',
      steps: [],
      comments: [],
      files: [],
      createdAt: new Date().toISOString()
    };

    setProjectBoards((prevBoards) => {
      const existingBoard = prevBoards[projectName] || createDefaultProjectBoard();
      const existingColumns = existingBoard.columns || createDefaultProjectBoard().columns || [];
      const safeColumns = existingColumns.length > 0 ? existingColumns : [targetColumn];
      const targetColumnIndex = Math.max(0, safeColumns.findIndex((column) => column.title === targetColumn.title));

      return {
        ...prevBoards,
        [projectName]: {
          ...existingBoard,
          columns: safeColumns.map((column, index) =>
            index === targetColumnIndex
              ? {
                  ...column,
                  tasks: [
                    ...(column.tasks || []),
                    nextTask
                  ]
                }
              : column
          )
        }
      };
    });

    setSelectedProject(projectName);

    createActivityNotification({
      type: 'task',
      title: 'Yeni görev oluşturuldu',
      text: nextTask.title,
      meta: `${projectName} · ${targetColumn.title}`,
      task: { ...nextTask, projectName, columnTitle: targetColumn.title },
      columnTitle: targetColumn.title,
      sortWeight: 740
    });

    await saveTaskToSupabaseForProject(projectName, nextTask, targetColumn.title);
    closeCalendarQuickTaskCreator();
  };

  const reportTasks = visibleBoardColumns.flatMap((column) =>
    column.tasks.map((task) => ({
      ...task,
      columnTitle: column.title,
      columnColor: column.color
    }))
  );

  const isReportTaskCompleted = (task) => {
    const statusText = String(task.status || '').toLocaleLowerCase('tr-TR');
    return task.completed === true || statusText.includes('tamam');
  };





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

  const getReportPriorityStyle = (priority) => {
    if (priority === 'Acil') return 'bg-red-50 text-red-600 border-red-100';
    if (priority === 'Yüksek') return 'bg-zinc-100 text-zinc-700 border-orange-100';
    if (priority === 'Düşük') return 'bg-emerald-50 text-emerald-600 border-emerald-100';

    return 'bg-zinc-100 text-zinc-700 border-blue-100';
  };

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
    ...reportTasks.flatMap((task) => {
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
          sortWeight: 500,
          task,
          projectName: selectedProject,
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
          sortWeight: 420,
          task,
          projectName: selectedProject,
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
          sortWeight: 360,
          task,
          projectName: selectedProject,
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

  const unreadNotificationCount = notificationItems.filter((item) => !readNotificationIds.includes(item.id)).length;

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
    const supabaseNotificationIds = notificationItems
      .map((item) => String(item.id || ''))
      .filter((id) => id.startsWith('supabase-notification-'))
      .map((id) => id.replace('supabase-notification-', ''))
      .filter(isSupabaseUuid);

    if (supabaseNotificationIds.length > 0) {
      supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', currentUserId)
        .in('id', supabaseNotificationIds)
        .then(() => {});
    }

    setReadNotificationIds((prevIds) => {
      const nextIds = Array.from(new Set([...prevIds, ...notificationItems.map((item) => item.id)]));
      saveUserPreferencesToSupabase({ readNotificationIds: nextIds });
      return nextIds;
    });
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
      alert('Müşteri/Misafir hesabı için bağlı müşteri seçmelisin.');
      return;
    }

    if (!name) {
      alert(role === 'Müşteri/Misafir' ? 'Bağlı müşteri kaydı bulunamadı.' : 'Ad Soyad boş olamaz.');
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

    const isCustomerAlreadyLinked = customerId
      ? customers.some((customer) => customer.id === customerId && customer.accountUserId) ||
        teamMembers.some((member) => member.customerId === customerId)
      : false;

    if (isCustomerAlreadyLinked) {
      alert('Bu müşteri zaten başka bir giriş hesabına bağlı.');
      return;
    }

    const hasDuplicateUsername = teamMembers.some(
      (member) => normalizeCredentialText(member.username) === username
    );

    if (hasDuplicateUsername) {
      alert('Bu kullanıcı adı zaten kullanılıyor.');
      return;
    }

    const workspaceId = getCurrentSupabaseWorkspaceId();

    if (!workspaceId) {
      alert('Workspace bilgisi alınamadı. Önce ZRC AJANS hesabıyla yeniden giriş yap.');
      return;
    }

    try {
      zrcSetSupabaseWriteInfo('saving', 'Merkezi ekip hesabı oluşturuluyor');

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || '';

      if (!accessToken) {
        alert('Yönetici oturumu bulunamadı. Çıkış yapıp ZRC AJANS hesabıyla tekrar giriş yap.');
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
    } catch (error) {
      const errorMessage = error?.message || 'Merkezi ekip hesabı oluşturulamadı.';
      alert(errorMessage);
      zrcSetSupabaseWriteInfo('error', errorMessage);
    }
  };

  const toggleTeamMemberStatus = (memberId) => {
    if (!requirePermission('manageTeam', 'Ekip durumunu sadece Yönetici değiştirebilir.')) return;

    const targetMember = teamMembers.find((member) => member.id === memberId);
    if (targetMember?.status !== 'Pasif' && isLastActiveAdmin(targetMember)) {
      showPermissionWarning('Son aktif yöneticiyi pasif yapamazsın.');
      return;
    }

    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId
          ? {
              ...member,
              status: member.status === 'Pasif' ? 'Aktif' : 'Pasif'
            }
          : member
      )
    );

    if (currentUserId === memberId && targetMember?.status !== 'Pasif') {
      setCurrentUserId('');
      removeStorageValue('currentUserId');
    }

    setPendingTeamDeleteId(null);
  };

  const deleteTeamMemberFromCenter = (memberId) => {
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
  };

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
  };

  const toggleCustomerStatus = async (customerId) => {
    const targetCustomer = customers.find((customer) => customer.id === customerId);
    const nextStatus = targetCustomer?.status === 'Pasif' ? 'Aktif' : 'Pasif';

    if (targetCustomer) {
      await updateCustomerStatusInSupabase(targetCustomer, nextStatus);
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
  };

  const deleteCustomerFromCenter = (customerId) => {
    if (!requirePermission('manageCustomers', 'Müşteri silme yetkisi sadece Yönetici rolünde var.')) return;

    if (pendingCustomerDeleteId !== customerId) {
      setPendingCustomerDeleteId(customerId);
      return;
    }

    const deletedCustomer = customers.find((customer) => customer.id === customerId);

    if (deletedCustomer) {
      rememberDeletedCustomer(deletedCustomer);
      deleteCustomerFromSupabase(deletedCustomer);
    }

    setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== customerId));

    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.customerId === customerId || member.id === deletedCustomer?.accountUserId
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
  };



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

  const openHomeTaskDetail = (task) => {
    if (!task) return;

    if (task.projectName) {
      setSelectedProject(task.projectName);
    }

    setActiveContentMenu('Projeler');
    setActiveMenu('Projeler');
    setActiveTab('Görevler');
    openTaskDetail(task, task.columnTitle);
  };








  const resetQuickNoteComposer = () => {
    setQuickNoteTitleDraft('');
    setQuickNoteDraft('');
    setEditingQuickNoteId(null);
    setPendingDeleteQuickNoteId(null);
  };

  const openQuickNoteComposerForEdit = (note = {}) => {
    const parsedNote = parseQuickNoteContent(note);

    setQuickNoteTitleDraft(parsedNote.title === 'Başlıksız not' ? '' : parsedNote.title);
    setQuickNoteDraft(parsedNote.detail || '');
    setEditingQuickNoteId(note.id);
    setPendingDeleteQuickNoteId(null);
    setIsQuickNoteComposerOpen(true);
  };

  const createQuickNoteFromHome = async (event) => {
    event.preventDefault();

    const title = quickNoteTitleDraft.trim();
    const detail = quickNoteDraft.trim();

    if (!title && !detail) return;

    const safeTitle = title || detail.split('\n')[0]?.slice(0, 42) || 'Başlıksız not';
    const text = buildQuickNoteText(safeTitle, detail);

    if (editingQuickNoteId) {
      const existingNote = quickNotes.find((note) => note.id === editingQuickNoteId);
      const updatedNote = {
        ...(existingNote || {}),
        id: editingQuickNoteId,
        title: safeTitle,
        detail,
        text,
        updatedAt: new Date().toISOString()
      };

      setQuickNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === editingQuickNoteId ? updatedNote : note))
      );

      await updateQuickNoteInSupabase(updatedNote);

      resetQuickNoteComposer();
      setIsQuickNoteComposerOpen(false);
      return;
    }

    const nextNote = {
      id: `quick-note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: safeTitle,
      detail,
      text,
      createdAt: new Date().toISOString()
    };

    setQuickNotes((prevNotes) => [
      nextNote,
      ...prevNotes
    ]);

    await saveQuickNoteToSupabase(nextNote);
    resetQuickNoteComposer();
    setIsQuickNoteComposerOpen(false);
  };

  const deleteQuickNoteFromHome = (noteId) => {
    const noteToDelete = quickNotes.find((note) => note.id === noteId);

    if (noteToDelete) {
      deleteQuickNoteFromSupabase(noteToDelete);
    }

    setQuickNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    setPendingDeleteQuickNoteId(null);
  };

  const openQuickTaskFromHome = () => {
    if (!ensureCanCreateTaskInSelectedProject('Bu rol hızlı görev oluşturamaz.')) return;

    setActiveContentMenu('Projeler');
    setActiveMenu('Projeler');
    setActiveTab('Görevler');
    setEditingTask(null);
    setCalendarNewTaskDate(null);
    setIsTaskModalOpen(true);
  };

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

  const openMenuCalendarTask = (task) => {
    if (!task) return;

    if (task.projectName) {
      setSelectedProject(task.projectName);
    }

    setActiveContentMenu('Projeler');
    setActiveMenu('Projeler');
    setActiveTab('Görevler');
    openTaskDetail(task, task.columnTitle);
  };

  const openMenuCalendarQuickTask = (event = null) => {
    openCalendarQuickTaskCreator(calendarFocusedDate, event);
  };

  const openHomeCalendarQuickTaskForDate = (targetDate, event = null) => {
    openCalendarQuickTaskCreator(targetDate, event);
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
      alert('Bu isimde bir yazışma grubu zaten var.');
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

  const addProfileEmailAccount = (event) => {
    event.preventDefault();

    const cleanEmail = emailAccountDraft.trim();

    if (!cleanEmail) return;

    if (!cleanEmail.includes('@')) {
      alert('Geçerli bir e-posta adresi yaz.');
      return;
    }

    if (profilePreferences.emailAccounts.some((account) => account.email.toLocaleLowerCase('tr-TR') === cleanEmail.toLocaleLowerCase('tr-TR'))) {
      alert('Bu e-posta hesabı zaten ekli.');
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

  const handleProfileAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Lütfen bir görsel dosyası seç.');
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

  const renderProfileSelect = (props) => (
    <ProfileSelect
      {...props}
      openProfileDropdown={openProfileDropdown}
      setOpenProfileDropdown={setOpenProfileDropdown}
    />
  );

  const renderSoftSelect = (props) => (
    <SoftSelect
      {...props}
      openProfileDropdown={openProfileDropdown}
      setOpenProfileDropdown={setOpenProfileDropdown}
    />
  );







  const ensureCanManageLocalData = () => {
    if (currentAccountType !== 'Patron') {
      showPermissionWarning('Veri yönetimi işlemlerini sadece Patron hesabı yapabilir.');
      return false;
    }

    return true;
  };

  const copyCurrentDataSnapshot = () => {
    if (!ensureCanManageLocalData()) return;

    const snapshot = getCurrentDataSnapshot();

    copyTextToClipboard(
      JSON.stringify(snapshot, null, 2),
      'Uygulama veri yedeği kopyalandı.'
    );

    setProfilePreferences((prev) => ({
      ...prev,
      lastDataExportAt: snapshot.exportedAt,
      lastSavedAt: new Date().toISOString()
    }));
  };

  const downloadCurrentDataSnapshot = () => {
    if (!ensureCanManageLocalData()) return;

    const snapshot = getCurrentDataSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `zrc-veri-yedegi-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setProfilePreferences((prev) => ({
      ...prev,
      lastDataExportAt: snapshot.exportedAt,
      lastSavedAt: new Date().toISOString()
    }));
  };

  const restoreDataSnapshot = (snapshot) => {
    const data = snapshot?.data || snapshot;

    if (!data || typeof data !== 'object') {
      alert('Yedek dosyası okunamadı.');
      return;
    }

    const importedProjects = normalizeStorageArray(data.projects, ['E-Ticaret Arayüz Tasarımı']);
    const importedSelectedProject = importedProjects.includes(data.selectedProject)
      ? data.selectedProject
      : importedProjects[0] || '';

    writeStorageValue('projects', importedProjects);
    writeStorageValue('teamMembers', normalizeStorageArray(data.teamMembers, createDefaultTeamMembers()).map(normalizeTeamMember));
    writeStorageValue('customers', normalizeStorageArray(data.customers, createDefaultCustomers()).map(normalizeCustomerRecord).filter((customer) => !isLegacyDemoCustomerRecord(customer)));
    writeStorageValue('selectedProject', importedSelectedProject);
    writeStorageValue('projectSettings', normalizeStorageObject(data.projectSettings, {}));
    writeStorageValue('projectBoards', normalizeStorageObject(data.projectBoards, {}));
    writeStorageValue('quickNotes', normalizeStorageArray(data.quickNotes, []));
    writeStorageValue('activityNotifications', normalizeStorageArray(data.activityNotifications, []));
    writeStorageValue('readNotifications', normalizeStorageArray(data.readNotificationIds || data.readNotifications, []));
    writeStorageValue('projectMessages', normalizeStorageArray(data.projectMessages, []));
    writeStorageValue('readMessages', normalizeStorageArray(data.readMessageIds || data.readMessages, []));
    writeStorageValue('chatGroups', normalizeStorageArray(data.chatGroups, []));
    writeStorageValue('profileDraft', normalizeStorageObject(data.profileDraft, profileDraft));
    writeStorageValue('profilePreferences', {
      ...profilePreferences,
      ...normalizeStorageObject(data.profilePreferences, {}),
      lastDataImportAt: new Date().toISOString(),
      lastSavedAt: new Date().toISOString()
    });
    writeStorageValue('dataVersion', snapshot?.version || APP_DATA_VERSION);

    alert('Yedek geri yüklendi. Sayfa şimdi yenilenecek.');
    window.location.reload();
  };

  const handleDataImportFile = (event) => {
    if (!ensureCanManageLocalData()) {
      event.target.value = '';
      return;
    }

    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const snapshot = JSON.parse(String(reader.result || '{}'));
        const confirmed = window.confirm('Bu yedek dosyası mevcut yerel verilerin üzerine yazılacak. Devam edilsin mi?');

        if (!confirmed) return;

        restoreDataSnapshot(snapshot);
      } catch {
        alert('Yedek dosyası geçerli JSON formatında değil.');
      } finally {
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      alert('Yedek dosyası okunamadı.');
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  const resetLocalApplicationData = () => {
    if (!ensureCanManageLocalData()) return;

    const confirmed = window.confirm('Tüm yerel veriler sıfırlansın mı? Bu işlem geri alınamaz.');

    if (!confirmed) return;

    Object.keys(STORAGE_KEYS).forEach((key) => removeStorageValue(key));

    alert('Yerel veri sıfırlandı. Sayfa şimdi yenilenecek.');
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

  const copyCredentialTextForCustomer = (customer) => {
    const linkedAccount = getCustomerLinkedAccount(customer);

    if (!linkedAccount) {
      alert('Bu müşteriye bağlı giriş hesabı yok.');
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
        console.warn(`[ZRC v462] ${reason} başarısız.`, error);
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


  

  

  // zrc-v524: feature panellerine tek context objesi


  

  

  const zrcFeatureContext = {


  

  

    activeTab: typeof activeTab !== 'undefined' ? activeTab : undefined,


  

  

    currentAccountType: typeof currentAccountType !== 'undefined' ? currentAccountType : undefined,


  

  

    Raporlar: typeof Raporlar !== 'undefined' ? Raporlar : undefined,


  

  

    w: typeof w !== 'undefined' ? w : undefined,


  

  

    full: typeof full !== 'undefined' ? full : undefined,


  

  

    flex: typeof flex !== 'undefined' ? flex : undefined,


  

  

    bg: typeof bg !== 'undefined' ? bg : undefined,


  

  

    f5f6f8: typeof f5f6f8 !== 'undefined' ? f5f6f8 : undefined,


  

  

    overflow: typeof overflow !== 'undefined' ? overflow : undefined,


  

  

    auto: typeof auto !== 'undefined' ? auto : undefined,


  

  

    custom: typeof custom !== 'undefined' ? custom : undefined,


  

  

    scrollbar: typeof scrollbar !== 'undefined' ? scrollbar : undefined,


  

  

    animate: typeof animate !== 'undefined' ? animate : undefined,


  

  

    fade: typeof fade !== 'undefined' ? fade : undefined,


  

  

    max: typeof max !== 'undefined' ? max : undefined,


  

  

    mx: typeof mx !== 'undefined' ? mx : undefined,


  

  

    px: typeof px !== 'undefined' ? px : undefined,


  

  

    py: typeof py !== 'undefined' ? py : undefined,


  

  

    items: typeof items !== 'undefined' ? items : undefined,


  

  

    center: typeof center !== 'undefined' ? center : undefined,


  

  

    justify: typeof justify !== 'undefined' ? justify : undefined,


  

  

    between: typeof between !== 'undefined' ? between : undefined,


  

  

    mb: typeof mb !== 'undefined' ? mb : undefined,


  

  

    text: typeof text !== 'undefined' ? text : undefined,


  

  

    font: typeof font !== 'undefined' ? font : undefined,


  

  

    black: typeof black !== 'undefined' ? black : undefined,


  

  

    zinc: typeof zinc !== 'undefined' ? zinc : undefined,


  

  

    tracking: typeof tracking !== 'undefined' ? tracking : undefined,


  

  

    tight: typeof tight !== 'undefined' ? tight : undefined,


  

  

    mt: typeof mt !== 'undefined' ? mt : undefined,


  

  

    bold: typeof bold !== 'undefined' ? bold : undefined,


  

  

    reportIntroText: typeof reportIntroText !== 'undefined' ? reportIntroText : undefined,


  

  

    setActiveTab: typeof setActiveTab !== 'undefined' ? setActiveTab : undefined,


  

  

    h: typeof h !== 'undefined' ? h : undefined,


  

  

    rounded: typeof rounded !== 'undefined' ? rounded : undefined,


  

  

    white: typeof white !== 'undefined' ? white : undefined,


  

  

    border: typeof border !== 'undefined' ? border : undefined,


  

  

    hover: typeof hover !== 'undefined' ? hover : undefined,


  

  

    transition: typeof transition !== 'undefined' ? transition : undefined,


  

  

    all: typeof all !== 'undefined' ? all : undefined,


  

  

    Git: typeof Git !== 'undefined' ? Git : undefined,


  

  

    grid: typeof grid !== 'undefined' ? grid : undefined,


  

  

    gap: typeof gap !== 'undefined' ? gap : undefined,


  

  

    reportSummaryCards: typeof reportSummaryCards !== 'undefined' ? reportSummaryCards : undefined,


  

  

    card: typeof card !== 'undefined' ? card : undefined,


  

  

    shadow: typeof shadow !== 'undefined' ? shadow : undefined,


  

  

    none: typeof none !== 'undefined' ? none : undefined,


  

  

    currentColor: typeof currentColor !== 'undefined' ? currentColor : undefined,


  

  

    round: typeof round !== 'undefined' ? round : undefined,


  

  

    M4: typeof M4 !== 'undefined' ? M4 : undefined,


  

  

    leading: typeof leading !== 'undefined' ? leading : undefined,


  

  

    space: typeof space !== 'undefined' ? space : undefined,


  

  

    Genel: typeof Genel !== 'undefined' ? Genel : undefined,


  

  

    Tamamlanan: typeof Tamamlanan !== 'undefined' ? Tamamlanan : undefined,


  

  

    toplam: typeof toplam !== 'undefined' ? toplam : undefined,


  

  

    emerald: typeof emerald !== 'undefined' ? emerald : undefined,


  

  

    reportProgressPercentage: typeof reportProgressPercentage !== 'undefined' ? reportProgressPercentage : undefined,


  

  

    hidden: typeof hidden !== 'undefined' ? hidden : undefined,


  

  

    duration: typeof duration !== 'undefined' ? duration : undefined,


  

  

    uppercase: typeof uppercase !== 'undefined' ? uppercase : undefined,


  

  

    reportOpenTasks: typeof reportOpenTasks !== 'undefined' ? reportOpenTasks : undefined,


  

  

    Dosya: typeof Dosya !== 'undefined' ? Dosya : undefined,


  

  

    reportFileCount: typeof reportFileCount !== 'undefined' ? reportFileCount : undefined,


  

  

    Patron: typeof Patron !== 'undefined' ? Patron : undefined,


  

  

    Proje: typeof Proje !== 'undefined' ? Proje : undefined,


  

  

    reportCustomerCount: typeof reportCustomerCount !== 'undefined' ? reportCustomerCount : undefined,


  

  

    visibleProjectNames: typeof visibleProjectNames !== 'undefined' ? visibleProjectNames : undefined,


  

  

    Kolonlara: typeof Kolonlara !== 'undefined' ? Kolonlara : undefined,


  

  

    boardColumns: typeof boardColumns !== 'undefined' ? boardColumns : undefined,


  

  

    kolon: typeof kolon !== 'undefined' ? kolon : undefined,


  

  

    pr: typeof pr !== 'undefined' ? pr : undefined,


  

  

    reportColumnStats: typeof reportColumnStats !== 'undefined' ? reportColumnStats : undefined,


  

  

    column: typeof column !== 'undefined' ? column : undefined,


  

  

    min: typeof min !== 'undefined' ? min : undefined,


  

  

    shrink: typeof shrink !== 'undefined' ? shrink : undefined,


  

  

    backgroundColor: typeof backgroundColor !== 'undefined' ? backgroundColor : undefined,


  

  

    truncate: typeof truncate !== 'undefined' ? truncate : undefined,


  

  

    reportPriorityTitle: typeof reportPriorityTitle !== 'undefined' ? reportPriorityTitle : undefined,


  

  

    reportUrgentTasks: typeof reportUrgentTasks !== 'undefined' ? reportUrgentTasks : undefined,


  

  

    reportPriorityStats: typeof reportPriorityStats !== 'undefined' ? reportPriorityStats : undefined,


  

  

    item: typeof item !== 'undefined' ? item : undefined,


  

  

    getReportPriorityStyle: typeof getReportPriorityStyle !== 'undefined' ? getReportPriorityStyle : undefined,


  

  

    reportUpcomingTasks: typeof reportUpcomingTasks !== 'undefined' ? reportUpcomingTasks : undefined,


  

  

    task: typeof task !== 'undefined' ? task : undefined,


  

  

    report: typeof report !== 'undefined' ? report : undefined,


  

  

    upcoming: typeof upcoming !== 'undefined' ? upcoming : undefined,


  

  

    openTaskDetail: typeof openTaskDetail !== 'undefined' ? openTaskDetail : undefined,


  

  

    left: typeof left !== 'undefined' ? left : undefined,


  

  

    start: typeof start !== 'undefined' ? start : undefined,


  

  

    getRoleAwareTaskMeta: typeof getRoleAwareTaskMeta !== 'undefined' ? getRoleAwareTaskMeta : undefined,


  

  

    formatCalendarDate: typeof formatCalendarDate !== 'undefined' ? formatCalendarDate : undefined,


  

  

    dashed: typeof dashed !== 'undefined' ? dashed : undefined,


  

  

    yok: typeof yok !== 'undefined' ? yok : undefined,


  

  

    Tarihli: typeof Tarihli !== 'undefined' ? Tarihli : undefined,


  

  

    burada: typeof burada !== 'undefined' ? burada : undefined,


  

  

    Gecikenler: typeof Gecikenler !== 'undefined' ? Gecikenler : undefined,


  

  

    red: typeof red !== 'undefined' ? red : undefined,


  

  

    reportOverdueTasks: typeof reportOverdueTasks !== 'undefined' ? reportOverdueTasks : undefined,


  

  

    overdue: typeof overdue !== 'undefined' ? overdue : undefined,


  

  

    getReportTaskDate: typeof getReportTaskDate !== 'undefined' ? getReportTaskDate : undefined,


  

  

    Geciken: typeof Geciken !== 'undefined' ? Geciken : undefined,


  

  

    Gantt: typeof Gantt !== 'undefined' ? Gantt : undefined,


  

  

    b: typeof b !== 'undefined' ? b : undefined,


  

  

    blue: typeof blue !== 'undefined' ? blue : undefined,


  

  

    M21: typeof M21 !== 'undefined' ? M21 : undefined,


  

  

    ganttSearch: typeof ganttSearch !== 'undefined' ? ganttSearch : undefined,


  

  

    setGanttSearch: typeof setGanttSearch !== 'undefined' ? setGanttSearch : undefined,


  

  

    ganttSearchPlaceholder: typeof ganttSearchPlaceholder !== 'undefined' ? ganttSearchPlaceholder : undefined,


  

  

    transparent: typeof transparent !== 'undefined' ? transparent : undefined,


  

  

    focus: typeof focus !== 'undefined' ? focus : undefined,


  

  

    outline: typeof outline !== 'undefined' ? outline : undefined,


  

  

    setGanttShowCompleted: typeof setGanttShowCompleted !== 'undefined' ? setGanttShowCompleted : undefined,


  

  

    prev: typeof prev !== 'undefined' ? prev : undefined,


  

  

    ganttShowCompleted: typeof ganttShowCompleted !== 'undefined' ? ganttShowCompleted : undefined,


  

  

    Tamamlananlar: typeof Tamamlananlar !== 'undefined' ? Tamamlananlar : undefined,


  

  

    goToPreviousGanttPeriod: typeof goToPreviousGanttPeriod !== 'undefined' ? goToPreviousGanttPeriod : undefined,


  

  

    capitalize: typeof capitalize !== 'undefined' ? capitalize : undefined,


  

  

    ganttRangeTitle: typeof ganttRangeTitle !== 'undefined' ? ganttRangeTitle : undefined,


  

  

    ganttTasks: typeof ganttTasks !== 'undefined' ? ganttTasks : undefined,


  

  

    goToNextGanttPeriod: typeof goToNextGanttPeriod !== 'undefined' ? goToNextGanttPeriod : undefined,


  

  

    Sonraki: typeof Sonraki !== 'undefined' ? Sonraki : undefined,


  

  

    goToCurrentGanttPeriod: typeof goToCurrentGanttPeriod !== 'undefined' ? goToCurrentGanttPeriod : undefined,


  

  

    Hafta: typeof Hafta !== 'undefined' ? Hafta : undefined,


  

  

    Ay: typeof Ay !== 'undefined' ? Ay : undefined,


  

  

    view: typeof view !== 'undefined' ? view : undefined,


  

  

    changeGanttView: typeof changeGanttView !== 'undefined' ? changeGanttView : undefined,


  

  

    ganttView: typeof ganttView !== 'undefined' ? ganttView : undefined,


  

  

    sm: typeof sm !== 'undefined' ? sm : undefined,


  

  

    relative: typeof relative !== 'undefined' ? relative : undefined,


  

  

    scrollGantt: typeof scrollGantt !== 'undefined' ? scrollGantt : undefined,


  

  

    absolute: typeof absolute !== 'undefined' ? absolute : undefined,


  

  

    top: typeof top !== 'undefined' ? top : undefined,


  

  

    translate: typeof translate !== 'undefined' ? translate : undefined,


  

  

    z: typeof z !== 'undefined' ? z : undefined,


  

  

    md: typeof md !== 'undefined' ? md : undefined,


  

  

    Sola: typeof Sola !== 'undefined' ? Sola : undefined,


  

  

    right: typeof right !== 'undefined' ? right : undefined,


  

  

    ref: typeof ref !== 'undefined' ? ref : undefined,


  

  

    ganttScrollRef: typeof ganttScrollRef !== 'undefined' ? ganttScrollRef : undefined,


  

  

    gridTemplateColumns: typeof gridTemplateColumns !== 'undefined' ? gridTemplateColumns : undefined,


  

  

    repeat: typeof repeat !== 'undefined' ? repeat : undefined,


  

  

    ganttPeriods: typeof ganttPeriods !== 'undefined' ? ganttPeriods : undefined,


  

  

    minmax: typeof minmax !== 'undefined' ? minmax : undefined,


  

  

    ganttPeriodConfig: typeof ganttPeriodConfig !== 'undefined' ? ganttPeriodConfig : undefined,


  

  

    minWidth: typeof minWidth !== 'undefined' ? minWidth : undefined,


  

  

    sticky: typeof sticky !== 'undefined' ? sticky : undefined,


  

  

    period: typeof period !== 'undefined' ? period : undefined,


  

  

    gantt: typeof gantt !== 'undefined' ? gantt : undefined,


  

  

    head: typeof head !== 'undefined' ? head : undefined,


  

  

    col: typeof col !== 'undefined' ? col : undefined,


  

  

    todayStart: typeof todayStart !== 'undefined' ? todayStart : undefined,


  

  

    getGanttTaskPlacement: typeof getGanttTaskPlacement !== 'undefined' ? getGanttTaskPlacement : undefined,


  

  

    row: typeof row !== 'undefined' ? row : undefined,


  

  

    getPremiumCalendarDotStyle: typeof getPremiumCalendarDotStyle !== 'undefined' ? getPremiumCalendarDotStyle : undefined,


  

  

    gridColumn: typeof gridColumn !== 'undefined' ? gridColumn : undefined,


  

  

    cell: typeof cell !== 'undefined' ? cell : undefined,


  

  

    self: typeof self !== 'undefined' ? self : undefined,


  

  

    getGanttBarClassName: typeof getGanttBarClassName !== 'undefined' ? getGanttBarClassName : undefined,


  

  

    M3: typeof M3 !== 'undefined' ? M3 : undefined,


  

  

    Bu: typeof Bu !== 'undefined' ? Bu : undefined,


  

  

    veya: typeof veya !== 'undefined' ? veya : undefined,


  

  

    tarihi: typeof tarihi !== 'undefined' ? tarihi : undefined,


  

  

    olan: typeof olan !== 'undefined' ? olan : undefined,


  

  

    olarak: typeof olarak !== 'undefined' ? olarak : undefined,


  

  

    Tarihi: typeof Tarihi !== 'undefined' ? Tarihi : undefined,


  

  

    ganttUndatedTasks: typeof ganttUndatedTasks !== 'undefined' ? ganttUndatedTasks : undefined,


  

  

    Tarihsiz: typeof Tarihsiz !== 'undefined' ? Tarihsiz : undefined,


  

  

    ekle: typeof ekle !== 'undefined' ? ekle : undefined,


  

  

    bulunmuyor: typeof bulunmuyor !== 'undefined' ? bulunmuyor : undefined,


  

  

    undated: typeof undated !== 'undefined' ? undated : undefined,


  

  

    currentPermissions: typeof currentPermissions !== 'undefined' ? currentPermissions : undefined,


  

  

    selectedProject: typeof selectedProject !== 'undefined' ? selectedProject : undefined,


  

  

    Dosyalar: typeof Dosyalar !== 'undefined' ? Dosyalar : undefined,


  

  

    setPendingFileDeleteKey: typeof setPendingFileDeleteKey !== 'undefined' ? setPendingFileDeleteKey : undefined,


  

  

    eklenen: typeof eklenen !== 'undefined' ? eklenen : undefined,


  

  

    proje: typeof proje !== 'undefined' ? proje : undefined,


  

  

    genelinde: typeof genelinde !== 'undefined' ? genelinde : undefined,


  

  

    ara: typeof ara !== 'undefined' ? ara : undefined,


  

  

    filtrele: typeof filtrele !== 'undefined' ? filtrele : undefined,


  

  

    ve: typeof ve !== 'undefined' ? ve : undefined,


  

  

    projectFiles: typeof projectFiles !== 'undefined' ? projectFiles : undefined,


  

  

    dosya: typeof dosya !== 'undefined' ? dosya : undefined,


  

  

    fileSearch: typeof fileSearch !== 'undefined' ? fileSearch : undefined,


  

  

    setFileSearch: typeof setFileSearch !== 'undefined' ? setFileSearch : undefined,


  

  

    projectFileTypeOptions: typeof projectFileTypeOptions !== 'undefined' ? projectFileTypeOptions : undefined,


  

  

    setFileTypeFilter: typeof setFileTypeFilter !== 'undefined' ? setFileTypeFilter : undefined,


  

  

    whitespace: typeof whitespace !== 'undefined' ? whitespace : undefined,


  

  

    nowrap: typeof nowrap !== 'undefined' ? nowrap : undefined,


  

  

    fileTypeFilter: typeof fileTypeFilter !== 'undefined' ? fileTypeFilter : undefined,


  

  

    setSelectedProjectFileKey: typeof setSelectedProjectFileKey !== 'undefined' ? setSelectedProjectFileKey : undefined,


  

  

    Temizle: typeof Temizle !== 'undefined' ? Temizle : undefined,


  

  

    fbfcfd: typeof fbfcfd !== 'undefined' ? fbfcfd : undefined,


  

  

    filteredProjectFiles: typeof filteredProjectFiles !== 'undefined' ? filteredProjectFiles : undefined,


  

  

    file: typeof file !== 'undefined' ? file : undefined,


  

  

    selectedProjectFile: typeof selectedProjectFile !== 'undefined' ? selectedProjectFile : undefined,


  

  

    pendingFileDeleteKey: typeof pendingFileDeleteKey !== 'undefined' ? pendingFileDeleteKey : undefined,


  

  

    handleSelectProjectFile: typeof handleSelectProjectFile !== 'undefined' ? handleSelectProjectFile : undefined,


  

  

    group: typeof group !== 'undefined' ? group : undefined,


  

  

    ring: typeof ring !== 'undefined' ? ring : undefined,


  

  

    getProjectFileIconStyle: typeof getProjectFileIconStyle !== 'undefined' ? getProjectFileIconStyle : undefined,


  

  

    M19: typeof M19 !== 'undefined' ? M19 : undefined,


  

  

    getProjectFileSecondaryText: typeof getProjectFileSecondaryText !== 'undefined' ? getProjectFileSecondaryText : undefined,


  

  

    wrap: typeof wrap !== 'undefined' ? wrap : undefined,


  

  

    formatProjectFileSize: typeof formatProjectFileSize !== 'undefined' ? formatProjectFileSize : undefined,


  

  

    renderProfileAvatar: typeof renderProfileAvatar !== 'undefined' ? renderProfileAvatar : undefined,


  

  

    currentProfileInitials: typeof currentProfileInitials !== 'undefined' ? currentProfileInitials : undefined,


  

  

    getProfileNameForRecord: typeof getProfileNameForRecord !== 'undefined' ? getProfileNameForRecord : undefined,


  

  

    currentActorName: typeof currentActorName !== 'undefined' ? currentActorName : undefined,


  

  

    Silmek: typeof Silmek !== 'undefined' ? Silmek : undefined,


  

  

    tekrar: typeof tekrar !== 'undefined' ? tekrar : undefined,


  

  

    bas: typeof bas !== 'undefined' ? bas : undefined,


  

  

    colors: typeof colors !== 'undefined' ? colors : undefined,


  

  

    M18: typeof M18 !== 'undefined' ? M18 : undefined,


  

  

    projectFileEmptyTitle: typeof projectFileEmptyTitle !== 'undefined' ? projectFileEmptyTitle : undefined,


  

  

    projectFileEmptyDescription: typeof projectFileEmptyDescription !== 'undefined' ? projectFileEmptyDescription : undefined,


  

  

    words: typeof words !== 'undefined' ? words : undefined,


  

  

    Bilgileri: typeof Bilgileri !== 'undefined' ? Bilgileri : undefined,


  

  

    getProjectFileInfoRows: typeof getProjectFileInfoRows !== 'undefined' ? getProjectFileInfoRows : undefined,


  

  

    projedeki: typeof projedeki !== 'undefined' ? projedeki : undefined,


  

  

    Sadece: typeof Sadece !== 'undefined' ? Sadece : undefined,


  

  

    size: typeof size !== 'undefined' ? size : undefined,


  

  

    dosyalar: typeof dosyalar !== 'undefined' ? dosyalar : undefined,


  

  

    listelenir: typeof listelenir !== 'undefined' ? listelenir : undefined,


  

  

    projectFileTypeStats: typeof projectFileTypeStats !== 'undefined' ? projectFileTypeStats : undefined,


  

  

    bilgisi: typeof bilgisi !== 'undefined' ? bilgisi : undefined,


  

  

    pt: typeof pt !== 'undefined' ? pt : undefined,


  

  

    downloadTaskFileFromSupabase: typeof downloadTaskFileFromSupabase !== 'undefined' ? downloadTaskFileFromSupabase : undefined,


  

  

    handleDeleteProjectFile: typeof handleDeleteProjectFile !== 'undefined' ? handleDeleteProjectFile : undefined,


  

  

    Tekrar: typeof Tekrar !== 'undefined' ? Tekrar : undefined,


  

  

    Bas: typeof Bas !== 'undefined' ? Bas : undefined,


  

  

    Sil: typeof Sil !== 'undefined' ? Sil : undefined,


  

  

    M15: typeof M15 !== 'undefined' ? M15 : undefined,


  

  

    Soldan: typeof Soldan !== 'undefined' ? Soldan : undefined,


  

  

    bir: typeof bir !== 'undefined' ? bir : undefined,


  

  

    Zaman: typeof Zaman !== 'undefined' ? Zaman : undefined,


  

  

    pb: typeof pb !== 'undefined' ? pb : undefined,


  

  

    calc: typeof calc !== 'undefined' ? calc : undefined,


  

  

    timeChartSearch: typeof timeChartSearch !== 'undefined' ? timeChartSearch : undefined,


  

  

    setTimeChartSearch: typeof setTimeChartSearch !== 'undefined' ? setTimeChartSearch : undefined,


  

  

    scheduleSearchPlaceholder: typeof scheduleSearchPlaceholder !== 'undefined' ? scheduleSearchPlaceholder : undefined,


  

  

    setIsTimeChartFilterOpen: typeof setIsTimeChartFilterOpen !== 'undefined' ? setIsTimeChartFilterOpen : undefined,


  

  

    setIsTimeChartSettingsOpen: typeof setIsTimeChartSettingsOpen !== 'undefined' ? setIsTimeChartSettingsOpen : undefined,


  

  

    Filtrele: typeof Filtrele !== 'undefined' ? Filtrele : undefined,


  

  

    isTimeChartFilterOpen: typeof isTimeChartFilterOpen !== 'undefined' ? isTimeChartFilterOpen : undefined,


  

  

    hideCompleted: typeof hideCompleted !== 'undefined' ? hideCompleted : undefined,


  

  

    Gizle: typeof Gizle !== 'undefined' ? Gizle : undefined,


  

  

    hideArchived: typeof hideArchived !== 'undefined' ? hideArchived : undefined,


  

  

    hideNoDate: typeof hideNoDate !== 'undefined' ? hideNoDate : undefined,


  

  

    toggleTimeChartFilter: typeof toggleTimeChartFilter !== 'undefined' ? toggleTimeChartFilter : undefined,


  

  

    timeChartFilters: typeof timeChartFilters !== 'undefined' ? timeChartFilters : undefined,


  

  

    M5: typeof M5 !== 'undefined' ? M5 : undefined,


  

  

    setTimeChartFilters: typeof setTimeChartFilters !== 'undefined' ? setTimeChartFilters : undefined,


  

  

    Filtreleri: typeof Filtreleri !== 'undefined' ? Filtreleri : undefined,


  

  

    goToPreviousTimeChartPeriod: typeof goToPreviousTimeChartPeriod !== 'undefined' ? goToPreviousTimeChartPeriod : undefined,


  

  

    timeChartRangeTitle: typeof timeChartRangeTitle !== 'undefined' ? timeChartRangeTitle : undefined,


  

  

    timeChartFilteredTasks: typeof timeChartFilteredTasks !== 'undefined' ? timeChartFilteredTasks : undefined,


  

  

    goToNextTimeChartPeriod: typeof goToNextTimeChartPeriod !== 'undefined' ? goToNextTimeChartPeriod : undefined,


  

  

    goToCurrentTimeChartPeriod: typeof goToCurrentTimeChartPeriod !== 'undefined' ? goToCurrentTimeChartPeriod : undefined,


  

  

    changeTimeChartView: typeof changeTimeChartView !== 'undefined' ? changeTimeChartView : undefined,


  

  

    timeChartView: typeof timeChartView !== 'undefined' ? timeChartView : undefined,


  

  

    Ayarlar: typeof Ayarlar !== 'undefined' ? Ayarlar : undefined,


  

  

    M10: typeof M10 !== 'undefined' ? M10 : undefined,


  

  

    isTimeChartSettingsOpen: typeof isTimeChartSettingsOpen !== 'undefined' ? isTimeChartSettingsOpen : undefined,


  

  

    showWeekends: typeof showWeekends !== 'undefined' ? showWeekends : undefined,


  

  

    Sonunu: typeof Sonunu !== 'undefined' ? Sonunu : undefined,


  

  

    compactCards: typeof compactCards !== 'undefined' ? compactCards : undefined,


  

  

    Kompakt: typeof Kompakt !== 'undefined' ? Kompakt : undefined,


  

  

    Kartlar: typeof Kartlar !== 'undefined' ? Kartlar : undefined,


  

  

    toggleTimeChartSetting: typeof toggleTimeChartSetting !== 'undefined' ? toggleTimeChartSetting : undefined,


  

  

    timeChartSettings: typeof timeChartSettings !== 'undefined' ? timeChartSettings : undefined,


  

  

    scrollTimeChart: typeof scrollTimeChart !== 'undefined' ? scrollTimeChart : undefined,


  

  

    timeChartScrollRef: typeof timeChartScrollRef !== 'undefined' ? timeChartScrollRef : undefined,


  

  

    overscroll: typeof overscroll !== 'undefined' ? overscroll : undefined,


  

  

    contain: typeof contain !== 'undefined' ? contain : undefined,


  

  

    timeChartPeriods: typeof timeChartPeriods !== 'undefined' ? timeChartPeriods : undefined,


  

  

    time: typeof time !== 'undefined' ? time : undefined,


  

  

    day: typeof day !== 'undefined' ? day : undefined,


  

  

    isSameCalendarDay: typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined,


  

  

    timeChartMembers: typeof timeChartMembers !== 'undefined' ? timeChartMembers : undefined,


  

  

    member: typeof member !== 'undefined' ? member : undefined,


  

  

    createAvatarFromName: typeof createAvatarFromName !== 'undefined' ? createAvatarFromName : undefined,


  

  

    getTimeChartTasksForMemberAndPeriod: typeof getTimeChartTasksForMemberAndPeriod !== 'undefined' ? getTimeChartTasksForMemberAndPeriod : undefined,


  

  

    repeating: typeof repeating !== 'undefined' ? repeating : undefined,


  

  

    linear: typeof linear !== 'undefined' ? linear : undefined,


  

  

    gradient: typeof gradient !== 'undefined' ? gradient : undefined,


  

  

    rgba: typeof rgba !== 'undefined' ? rgba : undefined,


  

  

    _0px: typeof _0px !== 'undefined' ? _0px : undefined,


  

  

    _8px: typeof _8px !== 'undefined' ? _8px : undefined,


  

  

    transparent_8px: typeof transparent_8px !== 'undefined' ? transparent_8px : undefined,


  

  

    transparent_16px: typeof transparent_16px !== 'undefined' ? transparent_16px : undefined,


  

  

    Sonu: typeof Sonu !== 'undefined' ? Sonu : undefined,


  

  

    getTimeChartTaskColor: typeof getTimeChartTaskColor !== 'undefined' ? getTimeChartTaskColor : undefined,


  

  

    getTimeChartTaskStartDate: typeof getTimeChartTaskStartDate !== 'undefined' ? getTimeChartTaskStartDate : undefined,


  

  

    getTimeChartTaskEndDate: typeof getTimeChartTaskEndDate !== 'undefined' ? getTimeChartTaskEndDate : undefined,


  

  

    openTaskModalForTimeChartPeriod: typeof openTaskModalForTimeChartPeriod !== 'undefined' ? openTaskModalForTimeChartPeriod : undefined,


  

  

    alana: typeof alana !== 'undefined' ? alana : undefined,


  

  

    Takvim: typeof Takvim !== 'undefined' ? Takvim : undefined,


  

  

    end: typeof end !== 'undefined' ? end : undefined,


  

  

    setIsCalendarDisplayMenuOpen: typeof setIsCalendarDisplayMenuOpen !== 'undefined' ? setIsCalendarDisplayMenuOpen : undefined,


  

  

    isCalendarDisplayMenuOpen: typeof isCalendarDisplayMenuOpen !== 'undefined' ? isCalendarDisplayMenuOpen : undefined,


  

  

    hideLongTasks: typeof hideLongTasks !== 'undefined' ? hideLongTasks : undefined,


  

  

    Uzun: typeof Uzun !== 'undefined' ? Uzun : undefined,


  

  

    hideCompletedTasks: typeof hideCompletedTasks !== 'undefined' ? hideCompletedTasks : undefined,


  

  

    hideArchivedTasks: typeof hideArchivedTasks !== 'undefined' ? hideArchivedTasks : undefined,


  

  

    setCalendarDisplayOptions: typeof setCalendarDisplayOptions !== 'undefined' ? setCalendarDisplayOptions : undefined,


  

  

    prevOptions: typeof prevOptions !== 'undefined' ? prevOptions : undefined,


  

  

    calendarDisplayOptions: typeof calendarDisplayOptions !== 'undefined' ? calendarDisplayOptions : undefined,


  

  

    goToPreviousCalendarPeriod: typeof goToPreviousCalendarPeriod !== 'undefined' ? goToPreviousCalendarPeriod : undefined,


  

  

    calendarHeaderTitle: typeof calendarHeaderTitle !== 'undefined' ? calendarHeaderTitle : undefined,


  

  

    goToNextCalendarPeriod: typeof goToNextCalendarPeriod !== 'undefined' ? goToNextCalendarPeriod : undefined,


  

  

    goToCurrentCalendarPeriod: typeof goToCurrentCalendarPeriod !== 'undefined' ? goToCurrentCalendarPeriod : undefined,


  

  

    Liste: typeof Liste !== 'undefined' ? Liste : undefined,


  

  

    pressed: typeof pressed !== 'undefined' ? pressed : undefined,


  

  

    calendarView: typeof calendarView !== 'undefined' ? calendarView : undefined,


  

  

    changeCalendarView: typeof changeCalendarView !== 'undefined' ? changeCalendarView : undefined,


  

  

    Pzt: typeof Pzt !== 'undefined' ? Pzt : undefined,


  

  

    Sal: typeof Sal !== 'undefined' ? Sal : undefined,


  

  

    Per: typeof Per !== 'undefined' ? Per : undefined,


  

  

    Cum: typeof Cum !== 'undefined' ? Cum : undefined,


  

  

    Cmt: typeof Cmt !== 'undefined' ? Cmt : undefined,


  

  

    Paz: typeof Paz !== 'undefined' ? Paz : undefined,


  

  

    dayName: typeof dayName !== 'undefined' ? dayName : undefined,


  

  

    last: typeof last !== 'undefined' ? last : undefined,


  

  

    calendarGridDays: typeof calendarGridDays !== 'undefined' ? calendarGridDays : undefined,


  

  

    getTasksForCalendarDay: typeof getTasksForCalendarDay !== 'undefined' ? getTasksForCalendarDay : undefined,


  

  

    calendarMonthDate: typeof calendarMonthDate !== 'undefined' ? calendarMonthDate : undefined,


  

  

    data: typeof data !== 'undefined' ? data : undefined,


  

  

    calendar: typeof calendar !== 'undefined' ? calendar : undefined,


  

  

    formatDateForTaskModal: typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined,


  

  

    zrc: typeof zrc !== 'undefined' ? zrc : undefined,


  

  

    canCreateTaskFromCalendar: typeof canCreateTaskFromCalendar !== 'undefined' ? canCreateTaskFromCalendar : undefined,


  

  

    cursor: typeof cursor !== 'undefined' ? cursor : undefined,


  

  

    pointer: typeof pointer !== 'undefined' ? pointer : undefined,


  

  

    openTaskModalForCalendarDay: typeof openTaskModalForCalendarDay !== 'undefined' ? openTaskModalForCalendarDay : undefined,


  

  

    inset: typeof inset !== 'undefined' ? inset : undefined,


  

  

    events: typeof events !== 'undefined' ? events : undefined,


  

  

    onMouseDown: typeof onMouseDown !== 'undefined' ? onMouseDown : undefined,


  

  

    getCalendarTaskBarStyle: typeof getCalendarTaskBarStyle !== 'undefined' ? getCalendarTaskBarStyle : undefined,


  

  

    getPremiumCalendarTaskStyle: typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined,


  

  

    calendarWeekDays: typeof calendarWeekDays !== 'undefined' ? calendarWeekDays : undefined,


  

  

    week: typeof week !== 'undefined' ? week : undefined,


  

  

    formatCalendarWeekday: typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined,


  

  

    handleCalendarDayClick: typeof handleCalendarDayClick !== 'undefined' ? handleCalendarDayClick : undefined,


  

  

    calendarFocusedDate: typeof calendarFocusedDate !== 'undefined' ? calendarFocusedDate : undefined,


  

  

    tabIndex: typeof tabIndex !== 'undefined' ? tabIndex : undefined,


  

  

    formatCalendarFullDate: typeof formatCalendarFullDate !== 'undefined' ? formatCalendarFullDate : undefined,


  

  

    calendarDayHelperText: typeof calendarDayHelperText !== 'undefined' ? calendarDayHelperText : undefined,


  

  

    Ekle: typeof Ekle !== 'undefined' ? Ekle : undefined,


  

  

    selectedDayCalendarTasks: typeof selectedDayCalendarTasks !== 'undefined' ? selectedDayCalendarTasks : undefined,


  

  

    l: typeof l !== 'undefined' ? l : undefined,


  

  

    Normal: typeof Normal !== 'undefined' ? Normal : undefined,


  

  

    calendarTasks: typeof calendarTasks !== 'undefined' ? calendarTasks : undefined,


  

  

    list: typeof list !== 'undefined' ? list : undefined,


  

  

    Takvimde: typeof Takvimde !== 'undefined' ? Takvimde : undefined,


  

  

    pl: typeof pl !== 'undefined' ? pl : undefined,


  

  

    canCreateTaskInSelectedProject: typeof canCreateTaskInSelectedProject !== 'undefined' ? canCreateTaskInSelectedProject : undefined,


  

  

    setEditingTask: typeof setEditingTask !== 'undefined' ? setEditingTask : undefined,


  

  

    setIsTaskModalOpen: typeof setIsTaskModalOpen !== 'undefined' ? setIsTaskModalOpen : undefined,


  

  

    extrabold: typeof extrabold !== 'undefined' ? extrabold : undefined,


  

  

    active: typeof active !== 'undefined' ? active : undefined,


  

  

    scale: typeof scale !== 'undefined' ? scale : undefined,


  

  

    M12: typeof M12 !== 'undefined' ? M12 : undefined,


  

  

    showProjectSettingsControls: typeof showProjectSettingsControls !== 'undefined' ? showProjectSettingsControls : undefined,


  

  

    Pano: typeof Pano !== 'undefined' ? Pano : undefined,


  

  

    openGlobalSearch: typeof openGlobalSearch !== 'undefined' ? openGlobalSearch : undefined,


  

  

    Ara: typeof Ara !== 'undefined' ? Ara : undefined,


  

  

    setIsEditMode: typeof setIsEditMode !== 'undefined' ? setIsEditMode : undefined,


  

  

    isEditMode: typeof isEditMode !== 'undefined' ? isEditMode : undefined,


  

  

    setOpenMenuColumnId: typeof setOpenMenuColumnId !== 'undefined' ? setOpenMenuColumnId : undefined,


  

  

    ff3600: typeof ff3600 !== 'undefined' ? ff3600 : undefined,


  

  

    Kolon: typeof Kolon !== 'undefined' ? Kolon : undefined,


  

  

    modu: typeof modu !== 'undefined' ? modu : undefined,


  

  

    M16: typeof M16 !== 'undefined' ? M16 : undefined,


  

  

    setBoardView: typeof setBoardView !== 'undefined' ? setBoardView : undefined,


  

  

    boardView: typeof boardView !== 'undefined' ? boardView : undefined,


  

  

    openAddStageModal: typeof openAddStageModal !== 'undefined' ? openAddStageModal : undefined,


  

  

    Yeni: typeof Yeni !== 'undefined' ? Yeni : undefined,


  

  

    transform: typeof transform !== 'undefined' ? transform : undefined,


  

  

    visibleBoardColumns: typeof visibleBoardColumns !== 'undefined' ? visibleBoardColumns : undefined,


  

  

    colIdx: typeof colIdx !== 'undefined' ? colIdx : undefined,


  

  

    mobileActiveColumnId: typeof mobileActiveColumnId !== 'undefined' ? mobileActiveColumnId : undefined,


  

  

    openMenuColumnId: typeof openMenuColumnId !== 'undefined' ? openMenuColumnId : undefined,


  

  

    openTaskMenuId: typeof openTaskMenuId !== 'undefined' ? openTaskMenuId : undefined,


  

  

    e: typeof e !== 'undefined' ? e : undefined,


  

  

    handleDrop: typeof handleDrop !== 'undefined' ? handleDrop : undefined,


  

  

    color: typeof color !== 'undefined' ? color : undefined,


  

  

    getReadableColumnColor: typeof getReadableColumnColor !== 'undefined' ? getReadableColumnColor : undefined,


  

  

    getReadableColumnMutedColor: typeof getReadableColumnMutedColor !== 'undefined' ? getReadableColumnMutedColor : undefined,


  

  

    getColumnEditToolsStyle: typeof getColumnEditToolsStyle !== 'undefined' ? getColumnEditToolsStyle : undefined,


  

  

    handleMoveColumn: typeof handleMoveColumn !== 'undefined' ? handleMoveColumn : undefined,


  

  

    openEditStageModal: typeof openEditStageModal !== 'undefined' ? openEditStageModal : undefined,


  

  

    handleDeleteColumn: typeof handleDeleteColumn !== 'undefined' ? handleDeleteColumn : undefined,


  

  

    setOpenTaskMenuId: typeof setOpenTaskMenuId !== 'undefined' ? setOpenTaskMenuId : undefined,


  

  

    semibold: typeof semibold !== 'undefined' ? semibold : undefined,


  

  

    visible: typeof visible !== 'undefined' ? visible : undefined,


  

  

    slate: typeof slate !== 'undefined' ? slate : undefined,


  

  

    M7: typeof M7 !== 'undefined' ? M7 : undefined,


  

  

    handleCopyColumn: typeof handleCopyColumn !== 'undefined' ? handleCopyColumn : undefined,


  

  

    M8: typeof M8 !== 'undefined' ? M8 : undefined,


  

  

    Kolonu: typeof Kolonu !== 'undefined' ? Kolonu : undefined,


  

  

    kopyala: typeof kopyala !== 'undefined' ? kopyala : undefined,


  

  

    my: typeof my !== 'undefined' ? my : undefined,


  

  

    handleArchiveColumnTasks: typeof handleArchiveColumnTasks !== 'undefined' ? handleArchiveColumnTasks : undefined,


  

  

    orange: typeof orange !== 'undefined' ? orange : undefined,


  

  

    handleArchiveColumn: typeof handleArchiveColumn !== 'undefined' ? handleArchiveColumn : undefined,


  

  

    M20: typeof M20 !== 'undefined' ? M20 : undefined,


  

  

    M6: typeof M6 !== 'undefined' ? M6 : undefined,


  

  

    sil: typeof sil !== 'undefined' ? sil : undefined,


  

  

    selectedTasks: typeof selectedTasks !== 'undefined' ? selectedTasks : undefined,


  

  

    priorityOptions: typeof priorityOptions !== 'undefined' ? priorityOptions : undefined,


  

  

    getTaskCardDateParts: typeof getTaskCardDateParts !== 'undefined' ? getTaskCardDateParts : undefined,


  

  

    draggable: typeof draggable !== 'undefined' ? draggable : undefined,


  

  

    canCurrentUserModifyTask: typeof canCurrentUserModifyTask !== 'undefined' ? canCurrentUserModifyTask : undefined,


  

  

    showPermissionWarning: typeof showPermissionWarning !== 'undefined' ? showPermissionWarning : undefined,


  

  

    sana: typeof sana !== 'undefined' ? sana : undefined,


  

  

    durumunu: typeof durumunu !== 'undefined' ? durumunu : undefined,


  

  

    handleDragStart: typeof handleDragStart !== 'undefined' ? handleDragStart : undefined,


  

  

    bottom: typeof bottom !== 'undefined' ? bottom : undefined,


  

  

    overlay: typeof overlay !== 'undefined' ? overlay : undefined,


  

  

    handleTaskAction: typeof handleTaskAction !== 'undefined' ? handleTaskAction : undefined,


  

  

    detay: typeof detay !== 'undefined' ? detay : undefined,


  

  

    M2: typeof M2 !== 'undefined' ? M2 : undefined,


  

  

    duzenle: typeof duzenle !== 'undefined' ? duzenle : undefined,


  

  

    Ekip: typeof Ekip !== 'undefined' ? Ekip : undefined,


  

  

    Kopyala: typeof Kopyala !== 'undefined' ? Kopyala : undefined,


  

  

    arsivle: typeof arsivle !== 'undefined' ? arsivle : undefined,


  

  

    snug: typeof snug !== 'undefined' ? snug : undefined,


  

  

    Bit: typeof Bit !== 'undefined' ? Bit : undefined,


  

  

    v517d: typeof v517d !== 'undefined' ? v517d : undefined,


  

  

    mobile: typeof mobile !== 'undefined' ? mobile : undefined,


  

  

    move: typeof move !== 'undefined' ? move : undefined,


  

  

    buttons: typeof buttons !== 'undefined' ? buttons : undefined,


  

  

    component: typeof component !== 'undefined' ? component : undefined,


  

  

    MobileTaskMoveButtons: typeof MobileTaskMoveButtons !== 'undefined' ? MobileTaskMoveButtons : undefined,


  

  

    handleMoveTaskToColumn: typeof handleMoveTaskToColumn !== 'undefined' ? handleMoveTaskToColumn : undefined,


  

  

    setMobileActiveColumnId: typeof setMobileActiveColumnId !== 'undefined' ? setMobileActiveColumnId : undefined,


  

  

    buradan: typeof buradan !== 'undefined' ? buradan : undefined,


  

  

    geri: typeof geri !== 'undefined' ? geri : undefined,


  

  

    getirebilir: typeof getirebilir !== 'undefined' ? getirebilir : undefined,


  

  

    silebilirsin: typeof silebilirsin !== 'undefined' ? silebilirsin : undefined,


  

  

    inceleyebilirsin: typeof inceleyebilirsin !== 'undefined' ? inceleyebilirsin : undefined,


  

  

    archivedTasks: typeof archivedTasks !== 'undefined' ? archivedTasks : undefined,


  

  

    xl: typeof xl !== 'undefined' ? xl : undefined,


  

  

    TR: typeof TR !== 'undefined' ? TR : undefined,


  

  

    digit: typeof digit !== 'undefined' ? digit : undefined,


  

  

    month: typeof month !== 'undefined' ? month : undefined,


  

  

    long: typeof long !== 'undefined' ? long : undefined,


  

  

    year: typeof year !== 'undefined' ? year : undefined,


  

  

    numeric: typeof numeric !== 'undefined' ? numeric : undefined,


  

  

    hour: typeof hour !== 'undefined' ? hour : undefined,


  

  

    minute: typeof minute !== 'undefined' ? minute : undefined,


  

  

    Tarih: typeof Tarih !== 'undefined' ? Tarih : undefined,


  

  

    Eski: typeof Eski !== 'undefined' ? Eski : undefined,


  

  

    t: typeof t !== 'undefined' ? t : undefined,


  

  

    handleRestoreArchivedTask: typeof handleRestoreArchivedTask !== 'undefined' ? handleRestoreArchivedTask : undefined,


  

  

    Geri: typeof Geri !== 'undefined' ? Geri : undefined,


  

  

    Getir: typeof Getir !== 'undefined' ? Getir : undefined,


  

  

    handleDeleteArchivedTask: typeof handleDeleteArchivedTask !== 'undefined' ? handleDeleteArchivedTask : undefined,


  

  

    getirmek: typeof getirmek !== 'undefined' ? getirmek : undefined,


  

  

    tek: typeof tek !== 'undefined' ? tek : undefined,


  

  

    panoya: typeof panoya !== 'undefined' ? panoya : undefined,


  

  

    v454c: typeof v454c !== 'undefined' ? v454c : undefined,


  

  

    strip: typeof strip !== 'undefined' ? strip : undefined,


  

  

    fixed: typeof fixed !== 'undefined' ? fixed : undefined,


  

  

    env: typeof env !== 'undefined' ? env : undefined,


  

  

    safe: typeof safe !== 'undefined' ? safe : undefined,


  

  

    area: typeof area !== 'undefined' ? area : undefined,


  

  

    backdrop: typeof backdrop !== 'undefined' ? backdrop : undefined,


  

  

    blur: typeof blur !== 'undefined' ? blur : undefined,


  

  

    index: typeof index !== 'undefined' ? index : undefined,


  

  

    tab: typeof tab !== 'undefined' ? tab : undefined,


  

  

  };



  

  

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#f4f6fb] font-[Inter] flex items-center justify-center p-6">
        {customStyles}
        {renderSupabaseConnectionBadge()}

        <style>{`
          @keyframes loginLightFastOne {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(58px, 34px, 0) scale(1.12); }
          }

          @keyframes loginLightFastTwo {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(-52px, 38px, 0) scale(1.10); }
          }

          @keyframes loginLightFastThree {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(42px, -38px, 0) scale(1.08); }
          }

          @keyframes loginPanelGlowOrbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes loginPanelGlowBreathe {
            0%, 100% { opacity: .78; filter: blur(32px); }
            50% { opacity: .95; filter: blur(38px); }
          }

          .login-input:focus,
          .login-input:focus-visible {
            outline: none !important;
            box-shadow: none !important;
          }
        `}</style>

        <div className="absolute inset-0">
          <div className="absolute -top-28 -left-24 w-[470px] h-[470px] rounded-full bg-[#ff3600]/34 blur-[82px]" style={{ animation: 'loginLightFastOne 4.2s ease-in-out infinite' }} />
          <div className="absolute top-[14%] -right-24 w-[520px] h-[520px] rounded-full bg-[#5b7cfa]/30 blur-[88px]" style={{ animation: 'loginLightFastTwo 4.8s ease-in-out infinite' }} />
          <div className="absolute -bottom-28 left-[28%] w-[560px] h-[560px] rounded-full bg-[#22c55e]/22 blur-[105px]" style={{ animation: 'loginLightFastThree 5.4s ease-in-out infinite' }} />
          <div className="absolute top-[46%] left-[8%] w-[310px] h-[310px] rounded-full bg-[#f59e0b]/18 blur-[78px]" style={{ animation: 'loginLightFastTwo 5.2s ease-in-out infinite reverse' }} />
          <div className="absolute inset-0 opacity-[0.46] bg-[linear-gradient(to_right,#c7cfdf_1px,transparent_1px),linear-gradient(to_bottom,#c7cfdf_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 opacity-[0.22] bg-[linear-gradient(to_right,#9ca8bd_1px,transparent_1px),linear-gradient(to_bottom,#9ca8bd_1px,transparent_1px)] bg-[size:160px_160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,rgba(244,246,251,0.42)_56%,rgba(244,246,251,0.90)_100%)]" />
        </div>

        <div className="relative w-full max-w-[380px]">
          <div className="pointer-events-none absolute -inset-10 rounded-[54px]" style={{ animation: 'loginPanelGlowOrbit 10s linear infinite' }}>
            <div className="absolute -top-3 left-10 w-44 h-44 rounded-full bg-[#ff3600]/48" style={{ animation: 'loginPanelGlowBreathe 4.8s ease-in-out infinite' }} />
            <div className="absolute -bottom-4 right-10 w-48 h-48 rounded-full bg-[#5b7cfa]/44" style={{ animation: 'loginPanelGlowBreathe 5.4s ease-in-out infinite reverse' }} />
          </div>
          <div className="pointer-events-none absolute -inset-8 rounded-[50px]" style={{ animation: 'loginPanelGlowOrbit 14s linear infinite reverse' }}>
            <div className="absolute top-12 -right-3 w-28 h-28 rounded-full bg-[#ff3600]/24 blur-[28px]" />
            <div className="absolute bottom-10 -left-2 w-32 h-32 rounded-full bg-[#5b7cfa]/24 blur-[30px]" />
          </div>
          <div className="absolute -inset-[1px] rounded-[31px] bg-gradient-to-br from-[#ff3600]/34 via-white/70 to-[#5b7cfa]/32" />

          <form
            onSubmit={handleCredentialLogin}
            noValidate
            className="relative rounded-[30px] border border-white/90 bg-white/90 backdrop-blur-2xl shadow-[0_30px_90px_rgba(15,23,42,0.18)] p-7"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[17px] bg-[#ff3600] text-white flex items-center justify-center text-[13px] font-black shadow-[0_14px_30px_rgba(255,54,0,0.25)]">
                ZRC
              </div>

              <div className="h-8 px-3 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-black text-zinc-500 flex items-center">
                Giriş Paneli
              </div>
            </div>

            <div className="mt-7">
              <h1 className="text-[26px] font-black text-zinc-950 tracking-[-0.06em]">
                Hoş geldin
              </h1>
              <p className="mt-1 text-[11px] font-bold text-zinc-400">
                Kullanıcı adı veya e-posta ile giriş yap.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <input
                type="text"
                value={loginDraft.username}
                onChange={(event) => {
                  setLoginDraft((prev) => ({ ...prev, username: event.target.value }));
                  setLoginError('');
                }}
                placeholder="Kullanıcı adı veya e-posta"
                autoComplete="username"
                className="login-input w-full h-12 rounded-[16px] border border-zinc-200 bg-zinc-50 px-4 text-[13px] font-bold text-zinc-800 placeholder:text-zinc-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-[#ff3600]/45 focus:bg-white transition-all"
              />

              <input
                type="password"
                value={loginDraft.password}
                onChange={(event) => {
                  setLoginDraft((prev) => ({ ...prev, password: event.target.value }));
                  setLoginError('');
                }}
                placeholder="Şifre"
                autoComplete="current-password"
                className="login-input w-full h-12 rounded-[16px] border border-zinc-200 bg-zinc-50 px-4 text-[13px] font-bold text-zinc-800 placeholder:text-zinc-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-[#ff3600]/45 focus:bg-white transition-all"
              />

              {loginError && (
                <div className="h-10 rounded-[14px] bg-red-50 border border-red-100 text-red-600 text-[11px] font-black flex items-center px-3">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoginLoading || authSessionLoading}
                className="w-full h-12 rounded-[16px] bg-[#ff3600] text-white text-[12px] font-black hover:bg-[#e03000] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_16px_32px_rgba(255,54,0,0.24)]"
              >
                {authSessionLoading ? 'Oturum kontrol ediliyor...' : authLoginLoading ? 'Giriş kontrol ediliyor...' : 'Giriş Yap'}
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between text-[10px] font-black text-zinc-400">
              <span>Ekip hesabı / Yönetici girişi</span>
              <span>Kullanıcı adı veya e-posta</span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const getMobileTaskCardAssignees = (task = {}) =>
    resolveMobileTaskCardAssignees(task, teamMembers, createAvatarFromName);

return (
    <div className="min-h-screen flex bg-[#f5f6f8] antialiased selection:bg-[#ff3600] overflow-x-hidden relative font-[Inter]">
      {customStyles}
      {renderSupabaseConnectionBadge()}

      <style>{`
        .zrc-main-shell > div:not([class*="fixed"]) {
          padding-left: 44px;
          box-sizing: border-box;
        }

        .zrc-project-board-page,
        .zrc-team-center-page,
        .zrc-customer-center-page {
          padding-left: 0 !important;
          box-sizing: border-box;
        }

        .zrc-project-board-page > div:not([class*="fixed"]) {
          padding-left: 44px !important;
          box-sizing: border-box;
        }

        .zrc-team-center-page,
        .zrc-customer-center-page {
          width: 100%;
        }

        .zrc-team-center-page > .zrc-center-card,
        .zrc-customer-center-page > .zrc-center-card {
          margin-left: auto !important;
          margin-right: auto !important;
        }
      `}</style>

      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        projects={projects}
        visibleProjects={visibleProjectNames}
        projectSettings={projectSettings}
        setProjects={handleSidebarProjectsChange}
        setSelectedProject={(project) => {
          setSelectedProject(project);
          setActiveContentMenu('Projeler');
          setActiveTab('Görevler');
          setPendingTeamDeleteId(null);
          setPendingCustomerDeleteId(null);
        }}
        onSearchClick={openGlobalSearch}
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        profileDraft={profileDraft}
        permissions={currentPermissions}
        currentUserRole={currentUserRole}
        currentAccountType={currentAccountType}
        currentUserId={currentUserId}
        onProfileSelect={() => {
          setActiveMenu('Profil');
          setActiveContentMenu('Profil');
          setActiveTab('Görevler');
          setIsPanelOpen(false);
          setIsNotificationsOpen(false);
          setIsMessagesOpen(false);
          setIsGlobalSearchOpen(false);
          setPendingTeamDeleteId(null);
          setPendingCustomerDeleteId(null);
        }}
        onProjectMenuSelect={() => {
          setPendingTeamDeleteId(null);
          setPendingCustomerDeleteId(null);
        }}
        onSimpleMenuSelect={(menuId) => {
          setActiveContentMenu(menuId);
          setActiveTab('Görevler');
          setIsPanelOpen(false);
          setIsNotificationsOpen(false);
          setIsMessagesOpen(false);
          setIsGlobalSearchOpen(false);
          setPendingTeamDeleteId(null);
          setPendingCustomerDeleteId(null);
        }}
        onOtherSectionSelect={(section) => {
          setActiveContentMenu('Diğer');
          setActiveTab(section);
          setIsPanelOpen(false);
          setIsNotificationsOpen(false);
          setIsMessagesOpen(false);
          setIsGlobalSearchOpen(false);
          setPendingTeamDeleteId(null);
          setPendingCustomerDeleteId(null);
        }}
      />

      <main onClick={handleMainClick} className="zrc-main-shell flex-1 pl-[68px] min-h-screen bg-white transition-colors duration-300 flex flex-col overflow-hidden">
        <TopNavbar
          unreadNotificationCount={unreadNotificationCount}
          isNotificationsOpen={isNotificationsOpen}
          onToggleNotifications={(event) => {
            event.stopPropagation();
            setIsMessagesOpen(false);
            setIsNotificationsOpen((prev) => {
              const nextState = !prev;

              if (nextState) {
                loadActivityLogsFromSupabase();
              }

              return nextState;
            });
          }}
          unreadMessageCount={unreadMessageCount}
          isMessagesOpen={isMessagesOpen}
          activeContentMenu={activeContentMenu}
          onToggleMessages={(event) => {
            event.stopPropagation();
            openMessagesPanel();
          }}
          onLogout={handleLogout}
        />


        
        
        <MobileWorkspace
          unreadNotificationCount={unreadNotificationCount}
          loadActivityLogsFromSupabase={loadActivityLogsFromSupabase}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          visibleProjectNames={visibleProjectNames}
          projects={projects}
          isMobileProjectPickerOpen={isMobileProjectPickerOpen}
          setIsMobileProjectPickerOpen={setIsMobileProjectPickerOpen}
          boardColumns={boardColumns}
          normalizeColumnTitleForDisplay={normalizeColumnTitleForDisplay}
          renderProfileAvatar={renderProfileAvatar}
          createAvatarFromName={createAvatarFromName}
          getMobileTaskCardAssignees={getMobileTaskCardAssignees}
          moveMobileTaskToActiveColumn={moveMobileTaskToActiveColumn}
          setMobileTaskWizardData={setMobileTaskWizardData}
          setMobileTaskWizardStep={setMobileTaskWizardStep}
          setIsMobileTaskWizardOpen={setIsMobileTaskWizardOpen}
          isMobileTaskWizardOpen={isMobileTaskWizardOpen}
          mobileTaskWizardStep={mobileTaskWizardStep}
          mobileTaskWizardData={mobileTaskWizardData}
          activeTeamMembers={activeTeamMembers}
          teamMembers={teamMembers}
          normalizeTeamRole={normalizeTeamRole}
          handleSaveTask={handleSaveTask}
          setActiveMenu={setActiveMenu}
          setActiveContentMenu={setActiveContentMenu}
          setActiveTab={setActiveTab}
          setIsPanelOpen={setIsPanelOpen}
          setIsMessagesOpen={setIsMessagesOpen}
          setIsNotificationsOpen={setIsNotificationsOpen}
          setIsGlobalSearchOpen={setIsGlobalSearchOpen}
        />

        {isMessagesOpen && (
          <>
            <div
              className="fixed inset-0 z-[670]"
              onClick={() => {
                setIsMessagesOpen(false);
                setIsMessageTaskPickerOpen(false);
              }}
            />

            <div
              onClick={(event) => event.stopPropagation()}
              style={{ top: activeContentMenu === 'Projeler' ? 43 : 55 }}
              className="fixed left-1/2 -translate-x-1/2 z-[681] w-[390px] bg-white border border-zinc-200 rounded-[14px] shadow-[0_24px_70px_rgba(15,23,42,0.20)] overflow-hidden animate-fade-in"
            >
            <span className="absolute -top-1.5 left-[43%] -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-l border-t border-zinc-200" />

            <div className="h-[54px] px-4 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-black text-zinc-800">Mesajlar</div>
                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                  {unreadMessageCount > 0 ? `${unreadMessageCount} okunmamış mesaj` : 'Tüm mesajlar okundu'}
                </div>
              </div>

              <button
                type="button"
                onClick={markAllMessagesAsRead}
                className="h-7 px-3 rounded-full bg-zinc-50 border border-zinc-100 text-[9.5px] font-black text-zinc-500 hover:text-zinc-800 hover:bg-white transition-all"
              >
                Tümünü Okundu Yap
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 bg-[#fbfcfd]">
              {messageItems.length > 0 ? (
                <div className="space-y-1.5">
                  {messageItems.map((message) => {
                    const isRead = readMessageIds.includes(message.id);

                    return (
                      <button
                        key={message.id}
                        type="button"
                        onClick={() => handleMessageClick(message)}
                        className={`w-full text-left rounded-[11px] border p-3 transition-all ${
                          isRead
                            ? 'bg-white border-zinc-100 hover:bg-zinc-50'
                            : 'bg-blue-50/45 border-blue-100 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#8c5220] text-white text-[8px] font-black flex items-center justify-center shrink-0 overflow-hidden">
                            {renderProfileAvatar(message.avatar, currentProfileInitials)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-[11.5px] font-black text-zinc-800 truncate">
                                {message.title || message.sender || 'Mesaj'}
                              </div>

                              {!isRead && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                              )}
                            </div>

                            <div className="mt-0.5 text-[11px] font-bold text-zinc-600 line-clamp-2">
                              {message.text}
                            </div>

                            <div className="mt-1 flex items-center justify-between gap-2">
                              <span className="text-[9.5px] font-bold text-zinc-400 truncate">
                                {message.meta}
                              </span>
                              <span className="text-[9px] font-black text-zinc-300 shrink-0">
                                {getProjectMessageDateLabel(message.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[210px] flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.924-.924 5.972 5.972 0 001.057-4.035A8.287 8.287 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  </div>

                  <div className="text-[12px] font-black text-zinc-600">Henüz mesaj yok</div>
                  <div className="mt-1 text-[10.5px] font-bold text-zinc-400">
                    İlk proje mesajını aşağıdan yaz.
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendProjectMessage} className="p-3 border-t border-zinc-100 bg-white">
              <div className="relative mb-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMessageTaskPickerOpen((prev) => !prev);
                  }}
                  className="w-full h-8 rounded-[8px] bg-zinc-50 border border-zinc-100 px-3 text-left flex items-center justify-between gap-2 hover:bg-white hover:border-zinc-200 transition-all"
                >
                  <span className="text-[10.5px] font-black text-zinc-500 truncate">
                    {selectedMessageTask ? `Bağlı görev: ${selectedMessageTask.title}` : 'Genel proje mesajı'}
                  </span>
                  <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isMessageTaskPickerOpen && (
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="absolute left-0 right-0 bottom-[38px] z-[695] max-h-[210px] overflow-y-auto custom-scrollbar bg-white border border-zinc-200 rounded-[10px] shadow-[0_18px_50px_rgba(15,23,42,0.16)] p-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMessageLinkedTaskId('');
                        setIsMessageTaskPickerOpen(false);
                      }}
                      className={`w-full h-8 rounded-[7px] px-2.5 text-left text-[10.5px] font-black transition-all ${
                        !messageLinkedTaskId ? 'bg-zinc-100 text-zinc-700' : 'text-zinc-500 hover:bg-zinc-50'
                      }`}
                    >
                      Genel proje mesajı
                    </button>

                    {messageTaskOptions.map((task) => (
                      <button
                        key={`message-task-${task.id}`}
                        type="button"
                        onClick={() => {
                          setMessageLinkedTaskId(task.id);
                          setIsMessageTaskPickerOpen(false);
                        }}
                        className={`w-full h-8 rounded-[7px] px-2.5 text-left text-[10.5px] font-black transition-all truncate ${
                          messageLinkedTaskId === task.id ? 'bg-zinc-100 text-zinc-700' : 'text-zinc-500 hover:bg-zinc-50'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSendProjectMessage(event);
                    }
                  }}
                  placeholder="Proje mesajı yaz..."
                  rows={2}
                  className="w-full resize-none rounded-[10px] border border-zinc-200 bg-white px-3 py-2 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-blue-300"
                />

                <button
                  type="submit"
                  disabled={!messageDraft.trim()}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    messageDraft.trim()
                      ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-[0_9px_20px_rgba(37,99,235,0.20)]'
                      : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                  }`}
                  title="Gönder"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.77 59.77 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          </>
        )}

        {isNotificationsOpen && (
          <div
            onClick={(event) => event.stopPropagation()}
            style={{ top: activeContentMenu === 'Projeler' ? 43 : 55 }}
            className="zrc-notification-panel fixed left-1/2 -translate-x-1/2 z-[680] w-[360px] bg-white border border-zinc-200 rounded-[14px] shadow-[0_24px_70px_rgba(15,23,42,0.20)] overflow-hidden animate-fade-in"
          >
            <span className="absolute -top-1.5 left-[57%] -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-l border-t border-zinc-200" />
            <div className="h-[54px] px-4 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-black text-zinc-800">Bildirimler</div>
                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                  {notificationPanelSummary}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={loadActivityLogsFromSupabase}
                  className="h-7 px-3 rounded-full bg-white border border-zinc-100 text-[9.5px] font-black text-zinc-500 hover:text-zinc-900 hover:border-zinc-200 transition-all"
                >
                  Yenile
                </button>

                {notificationItems.length > 0 && unreadNotificationCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="h-7 px-3 rounded-full bg-zinc-900 border border-zinc-900 text-[9.5px] font-black text-white hover:bg-zinc-700 transition-all"
                  >
                    Tümünü okundu yap
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto custom-scrollbar p-2">
              {notificationItems.length > 0 ? (
                <div className="space-y-1.5">
                  {notificationItems.map((notification) => {
                    const isRead = readNotificationIds.includes(notification.id);

                    return (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left rounded-[10px] border p-3 transition-all ${
                          isRead
                            ? 'bg-white border-zinc-100 hover:bg-zinc-50'
                            : 'bg-blue-50/45 border-blue-100 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-[10px] border flex items-center justify-center shrink-0 overflow-hidden ${getNotificationTone(notification.type)}`}>
                            {notification.source === 'activity' && notification.avatar ? (
                              renderProfileAvatar(notification.avatar, currentProfileInitials)
                            ) : notification.type === 'comment' && notification.avatar ? (
                              renderProfileAvatar(notification.avatar, currentProfileInitials)
                            ) : notification.type === 'comment' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.924-.924 5.972 5.972 0 001.057-4.035A8.287 8.287 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                              </svg>
                            ) : notification.type === 'file' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.552 18.32a1.5 1.5 0 11-2.121-2.121l9.546-9.546" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 21a9 9 0 100-18 9 9 0 000 18z" />
                              </svg>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-[11.5px] font-black text-zinc-800 truncate">
                                {notification.title}
                              </div>

                              {!isRead && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                              )}
                            </div>

                            <div className="mt-0.5 text-[11px] font-bold text-zinc-600 truncate">
                              {notification.text}
                            </div>

                            <div className="mt-1 text-[9.5px] font-bold text-zinc-400 truncate">
                              {currentAccountType === 'Patron'
                                ? notification.meta
                                : notification.projectName || notification.meta}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[220px] flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-300 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022 23.848 23.848 0 005.455 1.31m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                  </div>

                  <div className="text-[12px] font-black text-zinc-600">Bildirim yok</div>
                  <div className="mt-1 text-[10.5px] font-bold text-zinc-400">
                    {notificationEmptyDescription}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isGlobalSearchOpen && (
          <div
            className="fixed inset-0 z-[690] bg-zinc-950/25 backdrop-blur-[2px] flex items-start justify-center pt-[82px] animate-fade-in"
            onClick={closeGlobalSearch}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="w-[720px] max-w-[calc(100vw-150px)] bg-white border border-zinc-200 rounded-[17px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-hidden"
            >
              <div className="h-[66px] px-5 border-b border-zinc-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[11px] bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                  </svg>
                </div>

                <input
                  autoFocus
                  value={globalSearchQuery}
                  onChange={(event) => setGlobalSearchQuery(event.target.value)}
                  placeholder={globalSearchPlaceholder}
                  className="w-full bg-transparent text-[16px] font-black text-zinc-800 placeholder:text-zinc-300 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={closeGlobalSearch}
                  className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                  {globalSearchFilterOptions.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setGlobalSearchFilter(filter)}
                      className={`h-8 px-3 rounded-full border text-[10px] font-black whitespace-nowrap transition-all ${
                        globalSearchFilter === filter
                          ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-sm'
                          : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="text-[10px] font-black text-zinc-400 shrink-0">
                  {globalSearchQuery.trim() ? `${filteredGlobalSearchItems.length} sonuç` : 'Son görevler'}
                </div>
              </div>

              <div className="max-h-[430px] overflow-y-auto custom-scrollbar p-3">
                {filteredGlobalSearchItems.length > 0 ? (
                  <div className="space-y-1.5">
                    {filteredGlobalSearchItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleGlobalSearchItemClick(item)}
                        className="w-full rounded-[12px] border border-zinc-100 bg-white hover:bg-zinc-50 hover:border-zinc-200 p-3 text-left transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-[11px] border flex items-center justify-center shrink-0 ${getGlobalSearchTypeStyle(item.type)}`}>
                            {item.type === 'Dosya' ? (
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.552 18.32a1.5 1.5 0 11-2.121-2.121l9.546-9.546" />
                              </svg>
                            ) : item.type === 'Yorum' ? (
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.924-.924 5.972 5.972 0 001.057-4.035A8.287 8.287 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                              </svg>
                            ) : (
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M8.25 4.5h7.5A2.25 2.25 0 0118 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-7.5A2.25 2.25 0 016 17.25V6.75A2.25 2.25 0 018.25 4.5z" />
                              </svg>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-[12.5px] font-black text-zinc-800 truncate group-hover:text-zinc-950">
                                  {item.title}
                                </div>
                                <div className="mt-0.5 text-[10.5px] font-bold text-zinc-500 truncate">
                                  {item.subtitle}
                                </div>
                              </div>

                              <span className="h-5 px-2 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400 shrink-0">
                                {item.type}
                              </span>
                            </div>

                            <div className="mt-2 text-[9.5px] font-bold text-zinc-400 truncate">
                              {item.meta}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-[240px] flex flex-col items-center justify-center text-center">
                    <div className="w-15 h-15 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-300 flex items-center justify-center mb-3">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                      </svg>
                    </div>

                    <div className="text-[13px] font-black text-zinc-700">Sonuç bulunamadı</div>
                    <div className="mt-1 text-[10.5px] font-bold text-zinc-400 max-w-[330px]">
                      {currentAccountType === 'Patron'
                        ? 'Başka bir görev adı, müşteri, dosya, yorum veya kolon adıyla tekrar ara.'
                        : 'Sadece erişimin olan projelerde arama yapılır. Başka bir görev, dosya veya yorum adıyla tekrar ara.'}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-[42px] px-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                <div className="text-[9.5px] font-bold text-zinc-400">
                  {currentAccountType === 'Patron' ? 'Enter gerekmez, yazdıkça arar.' : 'Arama sadece erişimin olan kayıtları gösterir.'}
                </div>
                <div className="text-[9.5px] font-black text-zinc-400">ESC ile kapat</div>
              </div>
            </div>
          </div>
        )}

        {activeContentMenu === 'Ana Sayfa' ? (
          <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#f3f4f6] animate-fade-in">
            <div className="min-h-full pl-4 pr-[76px] pt-4 pb-8">
              <div className="max-w-[1560px] mx-auto grid grid-cols-[minmax(430px,0.96fr)_minmax(520px,0.78fr)] items-start gap-6">
                <div className="min-w-0">
                  <section className="mb-8">
                    <div className="h-7 mb-2 flex items-center gap-2">
                      <h2 className="text-[13px] font-bold text-[#293241] tracking-[-0.01em]">Size Atanan Görevler</h2>
                      <span className="h-[18px] min-w-[27px] px-2 rounded-full bg-[#f28b57] text-white text-[9px] font-black flex items-center justify-center leading-none">
                        {homeAssignedTasks.length}
                      </span>
                    </div>

                    <div className="zrc-home-card bg-white rounded-[13px] shadow-[0_12px_32px_rgba(30,43,70,0.06)] overflow-hidden">
                      <div className="h-[46px] px-5 border-b border-[#eef1f5] bg-[#ffffff] grid grid-cols-[36px_minmax(0,1fr)_142px] items-center">
                        <div className="text-[10.5px] font-black text-[#9aa4b2]"> </div>
                        <div className="text-[13px] font-bold text-[#8c96a6] flex items-center gap-1.5">
                          Durum / Ad
                          <span className="text-[9px] text-[#a9b2bf] leading-none">◆</span>
                        </div>
                        <div className="text-right text-[13px] font-bold text-[#8c96a6] flex items-center justify-end gap-1.5">
                          Bitiş
                          <span className="text-[9px] text-[#a9b2bf] leading-none">◆</span>
                        </div>
                      </div>

                      <div>
                        {homeAssignedTasks.length > 0 ? (
                          homeAssignedTasks.slice(0, 3).map((task, index) => (
                            <button
                              key={`home-assigned-photoshop-${task.projectName}-${task.id}`}
                              type="button"
                              onClick={() => openHomeTaskDetail(task)}
                              className="w-full h-[40px] px-5 grid grid-cols-[36px_minmax(0,1fr)_142px] items-center border-b border-[#eef1f5] hover:bg-[#fafbfc] transition-all text-left"
                            >
                              <div className="text-[12px] font-semibold text-[#8b94a3]">{index + 1}.</div>
                              <div className="min-w-0 flex items-center gap-2.5">
                                <span
                                  className="w-[10px] h-[10px] rounded-full shrink-0"
                                  style={{ backgroundColor: task.homeDate && task.homeDate < todayStart ? '#ef4444' : task.columnColor || '#f6b15f' }}
                                />
                                <span className="min-w-0 text-[13px] font-semibold text-[#3d4552] truncate tracking-[-0.01em]">
                                  {task.title}
                                </span>
                              </div>

                              <div className="text-right text-[12.5px] font-semibold text-[#444b57] truncate">
                                {task.homeDate
                                  ? `${new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(task.homeDate)}, ${new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(task.homeDate)}`
                                  : '-'}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="h-[120px] flex items-center justify-center text-[12px] font-semibold text-[#98a1b2]">
                            Gösterilecek görev yok
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveContentMenu('Projeler');
                          setActiveMenu('Projeler');
                          setActiveTab('Görevler');
                        }}
                        className="h-[38px] w-full bg-[#fbfcfd] text-[12px] font-semibold text-[#a1aab8] hover:text-[#2f66cf] hover:bg-[#f8fafc] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="text-[10px] leading-none">⌄</span>
                        Daha Fazla Göster
                      </button>
                    </div>
                  </section>

                  <section>
                    <div className="h-7 mb-2 flex items-center justify-between">
                      <h2 className="text-[13px] font-bold text-[#293241] tracking-[-0.01em]">Yapışkan Notlar</h2>

                      <div className="flex items-center gap-1.5 text-[#b7bfcc]">
                        <button
                          type="button"
                          onClick={() => setIsQuickNoteSearchOpen((prev) => !prev)}
                          className={`w-7 h-7 rounded-[7px] transition-all flex items-center justify-center ${
                            isQuickNoteSearchOpen ? 'bg-white text-[#55ace8] shadow-sm' : 'hover:bg-white hover:text-[#55ace8]'
                          }`}
                          title="Notlarda ara"
                        >
                          <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (!isQuickNoteComposerOpen) {
                              resetQuickNoteComposer();
                            }
                            setIsQuickNoteComposerOpen((prev) => !prev);
                          }}
                          className={`w-7 h-7 rounded-[7px] transition-all flex items-center justify-center ${
                            isQuickNoteComposerOpen ? 'bg-[#55ace8] text-white shadow-sm' : 'hover:bg-white hover:text-[#55ace8]'
                          }`}
                          title="Yeni hızlı not"
                        >
                          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="zrc-home-card relative bg-white rounded-[13px] shadow-[0_12px_32px_rgba(30,43,70,0.06)] overflow-visible">
                      {(isQuickNoteSearchOpen || isQuickNoteComposerOpen) && (
                        <div className={`${isQuickNoteSearchOpen ? 'px-4 pt-4 space-y-3' : 'h-0'} relative z-[640]`}>
                          {isQuickNoteSearchOpen && (
                            <div className="h-[38px] rounded-[12px] bg-[#f7f9fc] border border-[#e7ebf1] px-3 flex items-center gap-2">
                              <svg className="w-[15px] h-[15px] text-[#9aa4b2] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Z" />
                              </svg>
                              <input
                                value={quickNoteSearch}
                                onChange={(event) => setQuickNoteSearch(event.target.value)}
                                placeholder="Notlarda hızlı ara..."
                                className="min-w-0 flex-1 h-full bg-transparent text-[12px] font-semibold text-[#3d4552] placeholder:text-[#b6beca] outline-none"
                              />
                              {quickNoteSearch.trim() && (
                                <button
                                  type="button"
                                  onClick={() => setQuickNoteSearch('')}
                                  className="w-6 h-6 rounded-full text-[#a9b2bf] hover:bg-white hover:text-[#ef4444] transition-all flex items-center justify-center"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          )}

                          {isQuickNoteComposerOpen && (
                            <form
                              onSubmit={createQuickNoteFromHome}
                              className="zrc-note-composer-float absolute right-1 top-[-44px] z-[680] w-[382px] max-w-[calc(100vw-48px)] rounded-[18px] shadow-[0_28px_56px_rgba(55,81,145,0.22)] p-4 overflow-hidden"
                              style={{
                                backgroundColor: '#f7f4ea',
                                backgroundImage:
                                  'radial-gradient(circle at 14% 18%, rgba(47,102,207,0.13) 0 1px, transparent 1.2px), radial-gradient(circle at 82% 24%, rgba(255,54,0,0.11) 0 1px, transparent 1.3px), radial-gradient(circle at 38% 76%, rgba(41,50,65,0.08) 0 1px, transparent 1.3px), linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(238,247,255,0.92) 42%, rgba(255,245,235,0.95) 100%)',
                                backgroundSize: '26px 26px, 31px 31px, 35px 35px, 100% 100%'
                              }}
                            >
                              <div className="absolute -top-2 right-7 w-4 h-4 rotate-45 bg-[#f8f5ed]" />
                              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#5fb7ff]/22 blur-2xl" />
                              <div className="absolute -bottom-12 -left-10 w-28 h-28 rounded-full bg-[#ff7a45]/14 blur-2xl" />
                              <div className="absolute inset-0 opacity-[0.18] pointer-events-none bg-[linear-gradient(90deg,rgba(41,50,65,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(41,50,65,0.06)_1px,transparent_1px)] bg-[length:18px_18px]" />
                              <div className="absolute top-3 right-4 w-11 h-2 rounded-full bg-white/80 shadow-[0_5px_14px_rgba(66,86,130,0.14)] rotate-[3deg]" />

                              <div className="relative z-10 flex items-start gap-3">
                                <div className="zrc-note-mini-float mt-1 w-9 h-9 rounded-[12px] bg-[#2f66cf] text-white shadow-[0_10px_22px_rgba(47,102,207,0.22)] flex items-center justify-center">
                                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10a2 2 0 0 1 2 2v12l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2Z" />
                                  </svg>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="text-[10px] font-black text-[#778399] mb-2">
                                    {editingQuickNoteId ? 'Notu düzenle' : 'Yeni hızlı not'}
                                  </div>

                                  <input
                                    value={quickNoteTitleDraft}
                                    onChange={(event) => setQuickNoteTitleDraft(event.target.value)}
                                    placeholder="Başlık"
                                    className="w-full h-[34px] bg-white/74 backdrop-blur rounded-[12px] px-3 text-[13px] font-black text-[#334155] placeholder:text-[#9aa8bd] outline-none focus:bg-white/95 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                                  />

                                  <textarea
                                    value={quickNoteDraft}
                                    onChange={(event) => setQuickNoteDraft(event.target.value)}
                                    onKeyDown={(event) => {
                                      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                                        event.preventDefault();
                                        createQuickNoteFromHome(event);
                                      }
                                    }}
                                    placeholder="Detaylı açıklama yaz..."
                                    rows={4}
                                    className="mt-2 w-full resize-none bg-white/70 backdrop-blur rounded-[13px] px-3 py-2.5 text-[12.5px] font-semibold leading-5 text-[#334155] placeholder:text-[#9aa8bd] outline-none focus:bg-white/94 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                                  />

                                  <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-[#7b8799]">
                                      {editingQuickNoteId ? 'Başlık + detay güncellenecek' : 'Başlık + detay olarak sabitlenecek'}
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          resetQuickNoteComposer();
                                          setIsQuickNoteComposerOpen(false);
                                        }}
                                        className="h-[28px] px-3 rounded-full bg-white/70 text-[#7b8799] text-[10px] font-black hover:bg-white transition-all"
                                      >
                                        Vazgeç
                                      </button>

                                      <button
                                        type="submit"
                                        className="h-[28px] px-4 rounded-full bg-[#2f66cf] text-white text-[10px] font-black hover:bg-[#285cc0] active:scale-[0.98] transition-all shadow-[0_10px_18px_rgba(47,102,207,0.18)]"
                                      >
                                        {editingQuickNoteId ? 'Güncelle' : 'Sabitle'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          )}
                        </div>
                      )}

                      <div className={`${
                        quickNotes.filter((note) =>
                          !quickNoteSearch.trim() ||
                          `${getQuickNoteTitle(note)} ${getQuickNoteDetail(note)}`.toLocaleLowerCase('tr-TR').includes(quickNoteSearch.trim().toLocaleLowerCase('tr-TR'))
                        ).length > 0 ? 'max-h-[330px] overflow-y-auto custom-scrollbar p-4' : 'p-4'
                      }`}>
                        {quickNotes.filter((note) =>
                          !quickNoteSearch.trim() ||
                          `${getQuickNoteTitle(note)} ${getQuickNoteDetail(note)}`.toLocaleLowerCase('tr-TR').includes(quickNoteSearch.trim().toLocaleLowerCase('tr-TR'))
                        ).length > 0 ? (
                          <div className="grid grid-cols-1 gap-2.5">
                            {quickNotes
                              .filter((note) =>
                                !quickNoteSearch.trim() ||
                                `${getQuickNoteTitle(note)} ${getQuickNoteDetail(note)}`.toLocaleLowerCase('tr-TR').includes(quickNoteSearch.trim().toLocaleLowerCase('tr-TR'))
                              )
                              .map((note) => (
                                <div
                                  key={note.id}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => openQuickNoteComposerForEdit(note)}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                      event.preventDefault();
                                      openQuickNoteComposerForEdit(note);
                                    }
                                  }}
                                  className="min-h-[46px] rounded-[11px] bg-[#fcfdff] px-3 py-2 transition-all hover:-translate-y-[1px] hover:shadow-[0_10px_22px_rgba(30,43,70,0.06)] cursor-pointer"
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#40aee8] shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[11.5px] font-black leading-5 text-[#354052] truncate">
                                        {getQuickNoteTitle(note)}
                                      </div>
                                      {getQuickNoteDetail(note) && (
                                        <div className="text-[10.5px] font-semibold leading-4 text-[#7b8799] line-clamp-2 whitespace-pre-wrap">
                                          {getQuickNoteDetail(note)}
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setPendingDeleteQuickNoteId(note.id);
                                      }}
                                      className="w-5 h-5 rounded-[5px] text-[#c2c8d2] hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
                                    >
                                      ×
                                    </button>
                                  </div>

                                  {pendingDeleteQuickNoteId === note.id && (
                                    <div
                                      onClick={(event) => event.stopPropagation()}
                                      className="mt-2 ml-3 rounded-[10px] bg-[#fff5f5] px-2.5 py-2 flex items-center justify-between gap-2"
                                    >
                                      <span className="text-[10px] font-bold text-[#b42318]">Bu not silinsin mi?</span>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setPendingDeleteQuickNoteId(null)}
                                          className="h-[24px] px-2.5 rounded-full bg-white text-[#7b8799] text-[9px] font-black hover:bg-[#f8fafc] transition-all"
                                        >
                                          Vazgeç
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteQuickNoteFromHome(note.id)}
                                          className="h-[24px] px-2.5 rounded-full bg-[#ef4444] text-white text-[9px] font-black hover:bg-[#dc2626] transition-all"
                                        >
                                          Sil
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="h-[296px] flex flex-col items-center justify-center text-center">
                            <div className="relative w-[244px] h-[130px] mb-5">
                              <div className="absolute left-[38px] top-[14px] w-[74px] h-[76px] bg-[#eef1f5] rounded-[2px]" />
                              <div className="absolute left-[82px] top-[0px] w-[78px] h-[62px] bg-[#f2f4f7] rounded-[2px]" />
                              <div className="absolute left-[92px] top-[52px] w-[104px] h-[70px] bg-[#fbfcfd] rounded-[2px] border border-[#eceff4]" />
                              <div className="absolute left-[112px] top-[68px] w-[58px] h-[3px] rounded bg-[#d9dee7]" />
                              <div className="absolute left-[112px] top-[86px] w-[86px] h-[3px] rounded bg-[#d9dee7]" />
                              <div className="absolute left-[112px] top-[104px] w-[58px] h-[3px] rounded bg-[#d9dee7]" />
                              <div className="absolute left-[16px] top-[42px] space-y-4">
                                <span className="block w-[4px] h-[4px] rounded-full bg-[#40aee8]" />
                                <span className="block w-[4px] h-[4px] rounded-full bg-[#40aee8]" />
                                <span className="block w-[4px] h-[4px] rounded-full bg-[#40aee8]" />
                              </div>
                              <div className="absolute right-[36px] top-[28px] w-[26px] h-[26px] rounded-full bg-[#2f3a45]" />
                              <div className="absolute right-[20px] top-[26px] w-[24px] h-[30px] rounded-full bg-[#2f3a45]" />
                              <div className="absolute right-[42px] top-[52px] w-[32px] h-[46px] bg-[#27aee9] rounded-t-[18px]" />
                              <div className="absolute right-[64px] top-[76px] w-[34px] h-[6px] bg-[#27aee9] rounded-full -rotate-[13deg]" />
                              <div className="absolute right-[42px] top-[96px] w-[8px] h-[40px] bg-[#bdc3cc] rotate-[4deg] origin-top" />
                              <div className="absolute right-[62px] top-[96px] w-[8px] h-[40px] bg-[#bdc3cc] -rotate-[14deg] origin-top" />
                              <div className="absolute right-[70px] top-[130px] w-[22px] h-[4px] bg-[#2f3a45] rounded-full" />
                              <div className="absolute right-[32px] top-[130px] w-[20px] h-[4px] bg-[#2f3a45] rounded-full" />
                            </div>
                            <div className="text-[13px] font-semibold text-[#2f3744]">
                              {quickNoteSearch.trim() ? 'Aramanızla eşleşen not yok.' : 'Görüntülenecek hiçbir notunuz yok!'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>

                <section className="min-w-0">
                  <div className="h-7 mb-2 flex items-center justify-between">
                    <h2 className="text-[13px] font-bold text-[#293241] tracking-[-0.01em]">Takvimim</h2>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsCalendarDisplayMenuOpen((prev) => !prev);
                        }}
                        className="h-[27px] px-3 rounded-[6px] bg-[#2f66cf] text-white text-[11px] font-bold hover:bg-[#285cc0] transition-all flex items-center gap-2.5 shadow-[0_8px_18px_rgba(47,102,207,0.18)]"
                      >
                        Gösterim Şekli
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h12M10 19h4" />
                        </svg>
                      </button>

                      {isCalendarDisplayMenuOpen && (
                        <div
                          onClick={(menuEvent) => menuEvent.stopPropagation()}
                          className="absolute right-0 top-[40px] z-[620] w-[248px] rounded-[10px] bg-white border border-[#e6e9ee] shadow-[0_18px_38px_rgba(15,23,42,0.14)] px-4 py-3"
                        >
                          <div className="absolute -top-2 right-[72px] w-4 h-4 rotate-45 bg-white border-l border-t border-[#e6e9ee]" />

                          <div className="space-y-2.5 relative z-10">
                            {[
                              {
                                label: 'Uzun Süreli Görevleri Gizle',
                                checked: calendarDisplayOptions.hideLongTasks,
                                keyName: 'hideLongTasks'
                              },
                              {
                                label: 'Tamamlanmış Görevleri Gizle',
                                checked: calendarDisplayOptions.hideCompletedTasks,
                                keyName: 'hideCompletedTasks'
                              },
                              {
                                label: 'Arşivlenmiş Görevleri Gizle',
                                checked: calendarDisplayOptions.hideArchivedTasks,
                                keyName: 'hideArchivedTasks'
                              }
                            ].map((option) => (
                              <button
                                key={`home-display-option-${option.keyName}`}
                                type="button"
                                onClick={() =>
                                  setCalendarDisplayOptions((prev) => ({
                                    ...prev,
                                    [option.keyName]: !prev[option.keyName]
                                  }))
                                }
                                className="w-full flex items-center gap-2.5 text-left text-[13px] font-bold text-[#7a8495] hover:text-[#4b5563] transition-all"
                              >
                                <span
                                  className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    option.checked
                                      ? 'bg-[#4fbd7d] border-[#4fbd7d] text-white'
                                      : 'bg-white border-[#c4ccd7] text-transparent'
                                  }`}
                                >
                                  <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="zrc-home-card min-h-[660px] bg-white rounded-[13px] shadow-[0_12px_32px_rgba(30,43,70,0.06)] overflow-hidden">
                    <div className="h-[64px] px-6 border-b border-[#eceff4] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={goToPreviousCalendarPeriod}
                          className="w-8 h-8 rounded-[6px] text-[#293241] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[28px] leading-none"
                        >
                          ‹
                        </button>

                        <div className="min-w-[168px] text-center text-[20px] font-bold text-[#293241] capitalize tracking-[-0.02em]">
                          {calendarHeaderTitle}
                        </div>

                        <button
                          type="button"
                          onClick={goToNextCalendarPeriod}
                          className="w-8 h-8 rounded-[6px] text-[#293241] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[28px] leading-none"
                        >
                          ›
                        </button>
                      </div>

                      <div className="h-[26px] rounded-full flex items-center gap-2">
                        {['Ay', 'Hafta', 'Gün', 'Liste'].map((viewName) => (
                          <button
                            key={`home-calendar-view-${viewName}`}
                            type="button"
                            onClick={() => changeCalendarView(viewName)}
                            className={`h-[24px] px-4 rounded-full text-[11px] font-bold transition-all ${
                              calendarView === viewName
                                ? 'bg-[#56a8e8] text-white shadow-sm'
                                : 'bg-[#f0f1f3] text-[#8f98a6] hover:bg-[#e8eaee]'
                            }`}
                          >
                            {viewName}
                          </button>
                        ))}
                      </div>
                    </div>

                                        {/* zrc-v523-block-calendarview-ay */}
                    <ZRCAppShellCalendarViewAyBlock2
                      calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                      Ay={typeof Ay !== 'undefined' ? Ay : undefined}
                      grid={typeof grid !== 'undefined' ? grid : undefined}
                      h={typeof h !== 'undefined' ? h : undefined}
                      bg={typeof bg !== 'undefined' ? bg : undefined}
                      white={typeof white !== 'undefined' ? white : undefined}
                      border={typeof border !== 'undefined' ? border : undefined}
                      b={typeof b !== 'undefined' ? b : undefined}
                      eceff4={typeof eceff4 !== 'undefined' ? eceff4 : undefined}
                      Pzt={typeof Pzt !== 'undefined' ? Pzt : undefined}
                      Sal={typeof Sal !== 'undefined' ? Sal : undefined}
                      Per={typeof Per !== 'undefined' ? Per : undefined}
                      Cum={typeof Cum !== 'undefined' ? Cum : undefined}
                      Cmt={typeof Cmt !== 'undefined' ? Cmt : undefined}
                      Paz={typeof Paz !== 'undefined' ? Paz : undefined}
                      home={typeof home !== 'undefined' ? home : undefined}
                      calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                      head={typeof head !== 'undefined' ? head : undefined}
                      flex={typeof flex !== 'undefined' ? flex : undefined}
                      items={typeof items !== 'undefined' ? items : undefined}
                      center={typeof center !== 'undefined' ? center : undefined}
                      justify={typeof justify !== 'undefined' ? justify : undefined}
                      text={typeof text !== 'undefined' ? text : undefined}
                      font={typeof font !== 'undefined' ? font : undefined}
                      semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                      repeat={typeof repeat !== 'undefined' ? repeat : undefined}
                      calendarGridDays={typeof calendarGridDays !== 'undefined' ? calendarGridDays : undefined}
                      getMenuCalendarTasksForDay={typeof getMenuCalendarTasksForDay !== 'undefined' ? getMenuCalendarTasksForDay : undefined}
                      calendarMonthDate={typeof calendarMonthDate !== 'undefined' ? calendarMonthDate : undefined}
                      isSameCalendarDay={typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined}
                      todayStart={typeof todayStart !== 'undefined' ? todayStart : undefined}
                      month={typeof month !== 'undefined' ? month : undefined}
                      tabIndex={typeof tabIndex !== 'undefined' ? tabIndex : undefined}
                      data={typeof data !== 'undefined' ? data : undefined}
                      zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                      formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                      openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                      onMouseUp={typeof onMouseUp !== 'undefined' ? onMouseUp : undefined}
                      Enter={typeof Enter !== 'undefined' ? Enter : undefined}
                      min={typeof min !== 'undefined' ? min : undefined}
                      px={typeof px !== 'undefined' ? px : undefined}
                      py={typeof py !== 'undefined' ? py : undefined}
                      left={typeof left !== 'undefined' ? left : undefined}
                      transition={typeof transition !== 'undefined' ? transition : undefined}
                      all={typeof all !== 'undefined' ? all : undefined}
                      fafcff={typeof fafcff !== 'undefined' ? fafcff : undefined}
                      overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                      hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                      cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                      pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                      fbfcfe={typeof fbfcfe !== 'undefined' ? fbfcfe : undefined}
                      start={typeof start !== 'undefined' ? start : undefined}
                      end={typeof end !== 'undefined' ? end : undefined}
                      w={typeof w !== 'undefined' ? w : undefined}
                      rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                      full={typeof full !== 'undefined' ? full : undefined}
                      c4cbd5={typeof c4cbd5 !== 'undefined' ? c4cbd5 : undefined}
                      mt={typeof mt !== 'undefined' ? mt : undefined}
                      space={typeof space !== 'undefined' ? space : undefined}
                      cal={typeof cal !== 'undefined' ? cal : undefined}
                      openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                      gap={typeof gap !== 'undefined' ? gap : undefined}
                      e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                      l={typeof l !== 'undefined' ? l : undefined}
                      shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                      getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                      shrink={typeof shrink !== 'undefined' ? shrink : undefined}
                      getPremiumCalendarDotStyle={typeof getPremiumCalendarDotStyle !== 'undefined' ? getPremiumCalendarDotStyle : undefined}
                      black={typeof black !== 'undefined' ? black : undefined}
                      current={typeof current !== 'undefined' ? current : undefined}
                      truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                      formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                      bold={typeof bold !== 'undefined' ? bold : undefined}
                      b8bfca={typeof b8bfca !== 'undefined' ? b8bfca : undefined}
                    />

                                        {/* zrc-v523-block-calendarview-hafta */}
                    <ZRCAppShellCalendarViewHaftaBlock2
                      calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                      Hafta={typeof Hafta !== 'undefined' ? Hafta : undefined}
                      bg={typeof bg !== 'undefined' ? bg : undefined}
                      white={typeof white !== 'undefined' ? white : undefined}
                      grid={typeof grid !== 'undefined' ? grid : undefined}
                      h={typeof h !== 'undefined' ? h : undefined}
                      border={typeof border !== 'undefined' ? border : undefined}
                      b={typeof b !== 'undefined' ? b : undefined}
                      edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                      calendarWeekDays={typeof calendarWeekDays !== 'undefined' ? calendarWeekDays : undefined}
                      isSameCalendarDay={typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined}
                      todayStart={typeof todayStart !== 'undefined' ? todayStart : undefined}
                      home={typeof home !== 'undefined' ? home : undefined}
                      week={typeof week !== 'undefined' ? week : undefined}
                      head={typeof head !== 'undefined' ? head : undefined}
                      data={typeof data !== 'undefined' ? data : undefined}
                      zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                      calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                      formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                      openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                      text={typeof text !== 'undefined' ? text : undefined}
                      center={typeof center !== 'undefined' ? center : undefined}
                      font={typeof font !== 'undefined' ? font : undefined}
                      bold={typeof bold !== 'undefined' ? bold : undefined}
                      transition={typeof transition !== 'undefined' ? transition : undefined}
                      all={typeof all !== 'undefined' ? all : undefined}
                      f8fbff={typeof f8fbff !== 'undefined' ? f8fbff : undefined}
                      fafcff={typeof fafcff !== 'undefined' ? fafcff : undefined}
                      formatCalendarDate={typeof formatCalendarDate !== 'undefined' ? formatCalendarDate : undefined}
                      formatCalendarWeekday={typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined}
                      px={typeof px !== 'undefined' ? px : undefined}
                      flex={typeof flex !== 'undefined' ? flex : undefined}
                      items={typeof items !== 'undefined' ? items : undefined}
                      getMenuCalendarAllDayTasks={typeof getMenuCalendarAllDayTasks !== 'undefined' ? getMenuCalendarAllDayTasks : undefined}
                      allday={typeof allday !== 'undefined' ? allday : undefined}
                      gap={typeof gap !== 'undefined' ? gap : undefined}
                      overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                      hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                      cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                      pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                      onPointerUp={typeof onPointerUp !== 'undefined' ? onPointerUp : undefined}
                      openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                      w={typeof w !== 'undefined' ? w : undefined}
                      full={typeof full !== 'undefined' ? full : undefined}
                      rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                      left={typeof left !== 'undefined' ? left : undefined}
                      black={typeof black !== 'undefined' ? black : undefined}
                      current={typeof current !== 'undefined' ? current : undefined}
                      truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                      max={typeof max !== 'undefined' ? max : undefined}
                      auto={typeof auto !== 'undefined' ? auto : undefined}
                      custom={typeof custom !== 'undefined' ? custom : undefined}
                      scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
                      menuCalendarHours={typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined}
                      pt={typeof pt !== 'undefined' ? pt : undefined}
                      semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                      getMenuCalendarTasksForHour={typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined}
                      relative={typeof relative !== 'undefined' ? relative : undefined}
                      repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                      linear={typeof linear !== 'undefined' ? linear : undefined}
                      gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                      fff_0={typeof fff_0 !== 'undefined' ? fff_0 : undefined}
                      fff_8px={typeof fff_8px !== 'undefined' ? fff_8px : undefined}
                      fbfbfb_8px={typeof fbfbfb_8px !== 'undefined' ? fbfbfb_8px : undefined}
                      fbfbfb_16px={typeof fbfbfb_16px !== 'undefined' ? fbfbfb_16px : undefined}
                      absolute={typeof absolute !== 'undefined' ? absolute : undefined}
                      right={typeof right !== 'undefined' ? right : undefined}
                      top={typeof top !== 'undefined' ? top : undefined}
                      min={typeof min !== 'undefined' ? min : undefined}
                      e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                      l={typeof l !== 'undefined' ? l : undefined}
                      py={typeof py !== 'undefined' ? py : undefined}
                      shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                      getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                      formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                    />

                                        {/* zrc-v523-block-calendarview-gun */}
                    <ZRCAppShellCalendarViewGunBlock
                      calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                      bg={typeof bg !== 'undefined' ? bg : undefined}
                      white={typeof white !== 'undefined' ? white : undefined}
                      data={typeof data !== 'undefined' ? data : undefined}
                      zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                      calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                      day={typeof day !== 'undefined' ? day : undefined}
                      formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                      calendarFocusedDate={typeof calendarFocusedDate !== 'undefined' ? calendarFocusedDate : undefined}
                      openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                      w={typeof w !== 'undefined' ? w : undefined}
                      full={typeof full !== 'undefined' ? full : undefined}
                      h={typeof h !== 'undefined' ? h : undefined}
                      grid={typeof grid !== 'undefined' ? grid : undefined}
                      border={typeof border !== 'undefined' ? border : undefined}
                      b={typeof b !== 'undefined' ? b : undefined}
                      edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                      fafcff={typeof fafcff !== 'undefined' ? fafcff : undefined}
                      transition={typeof transition !== 'undefined' ? transition : undefined}
                      all={typeof all !== 'undefined' ? all : undefined}
                      flex={typeof flex !== 'undefined' ? flex : undefined}
                      items={typeof items !== 'undefined' ? items : undefined}
                      center={typeof center !== 'undefined' ? center : undefined}
                      justify={typeof justify !== 'undefined' ? justify : undefined}
                      text={typeof text !== 'undefined' ? text : undefined}
                      font={typeof font !== 'undefined' ? font : undefined}
                      bold={typeof bold !== 'undefined' ? bold : undefined}
                      formatCalendarWeekday={typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined}
                      px={typeof px !== 'undefined' ? px : undefined}
                      cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                      pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                      getMenuCalendarAllDayTasks={typeof getMenuCalendarAllDayTasks !== 'undefined' ? getMenuCalendarAllDayTasks : undefined}
                      home={typeof home !== 'undefined' ? home : undefined}
                      allday={typeof allday !== 'undefined' ? allday : undefined}
                      openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                      mr={typeof mr !== 'undefined' ? mr : undefined}
                      rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                      e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                      l={typeof l !== 'undefined' ? l : undefined}
                      left={typeof left !== 'undefined' ? left : undefined}
                      black={typeof black !== 'undefined' ? black : undefined}
                      current={typeof current !== 'undefined' ? current : undefined}
                      truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                      shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                      getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                      max={typeof max !== 'undefined' ? max : undefined}
                      overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                      auto={typeof auto !== 'undefined' ? auto : undefined}
                      custom={typeof custom !== 'undefined' ? custom : undefined}
                      scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
                      menuCalendarHours={typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined}
                      getMenuCalendarTasksForHour={typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined}
                      pt={typeof pt !== 'undefined' ? pt : undefined}
                      semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                      relative={typeof relative !== 'undefined' ? relative : undefined}
                      repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                      linear={typeof linear !== 'undefined' ? linear : undefined}
                      gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                      fff_0={typeof fff_0 !== 'undefined' ? fff_0 : undefined}
                      fff_8px={typeof fff_8px !== 'undefined' ? fff_8px : undefined}
                      fbfbfb_8px={typeof fbfbfb_8px !== 'undefined' ? fbfbfb_8px : undefined}
                      fbfbfb_16px={typeof fbfbfb_16px !== 'undefined' ? fbfbfb_16px : undefined}
                      absolute={typeof absolute !== 'undefined' ? absolute : undefined}
                      right={typeof right !== 'undefined' ? right : undefined}
                      top={typeof top !== 'undefined' ? top : undefined}
                      min={typeof min !== 'undefined' ? min : undefined}
                      py={typeof py !== 'undefined' ? py : undefined}
                      hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                      formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                    />

                    {calendarView === 'Liste' && (
                      <div className="bg-white min-h-[590px]">
                        {menuCalendarListGroups.length > 0 ? (
                          menuCalendarListGroups.map((group) => (
                            <div key={`home-list-group-${group.day.toISOString()}`}>
                              <button
                                type="button"
                                data-zrc-calendar-day={formatDateForTaskModal(group.day)}
                                onClick={(event) => openHomeCalendarQuickTaskForDate(group.day, event)}
                                className="w-full h-[30px] px-3.5 bg-[#f1f3f6] border-b border-[#d6dce5] hover:bg-[#e9edf3] transition-all flex items-center justify-between"
                              >
                                <div className="text-[10.5px] font-bold text-[#374151] capitalize">
                                  {new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(group.day)}
                                </div>
                                <div className="text-[10px] font-bold text-[#374151]">
                                  {formatMenuCalendarWeekHeader(group.day)}
                                </div>
                              </button>

                              {group.tasks.map((task) => (
                                <button
                                  key={`home-list-task-${group.day.toISOString()}-${task.projectName}-${task.id}`}
                                  type="button"
                                  onClick={() => openMenuCalendarTask(task)}
                                  className="w-full h-[34px] grid grid-cols-[64px_1fr] items-center border-b border-[#e6e9ef] text-left hover:bg-[#fafcff]"
                                >
                                  <div className="px-3 text-[10px] font-bold text-[#596270]">
                                    {formatMenuCalendarTaskTime(task) || ' '}
                                  </div>
                                  <div className="min-w-0 text-[10px] font-semibold text-[#596270] truncate">
                                    <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: task.columnColor || '#55ace8' }} />
                                    {task.title}
                                  </div>
                                </button>
                              ))}
                            </div>
                          ))
                        ) : (
                          <div className="h-[240px] flex items-center justify-center text-[11px] font-semibold text-[#9aa3b1]">
                            Bu aralıkta planlı görev yok.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : activeContentMenu === 'Takvimim' ? (
          <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(47,102,207,0.05),transparent_34%),linear-gradient(180deg,#f7f8fb_0%,#eef1f5_100%)] overflow-hidden animate-fade-in">
            <div className="h-full pl-5 pr-[76px] pt-4 pb-6 overflow-y-auto custom-scrollbar">
              <div className="h-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={openMenuCalendarQuickTask}
                  className="h-8 px-4 rounded-full bg-[#1f9d61] text-white text-[10.5px] font-black hover:bg-[#188b55] transition-all flex items-center gap-2 shadow-[0_10px_24px_rgba(31,157,97,0.18)]"
                >
                  Görev Oluştur
                  <span className="text-[13px] leading-none">+</span>
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuCalendarFilterOpen((prev) => !prev);
                    setIsMenuCalendarStatusOpen(false);
                  }}
                  className="relative h-8 px-4 rounded-full bg-[#2563eb] text-white text-[10.5px] font-black hover:bg-[#1d56d6] transition-all flex items-center gap-2 shadow-[0_10px_24px_rgba(37,99,235,0.18)]"
                >
                  Filtreler
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
                  </svg>

                  {isMenuCalendarFilterOpen && (
                    <div
                      onClick={(filterEvent) => filterEvent.stopPropagation()}
                      className="absolute right-0 top-[34px] z-[650] w-[300px] rounded-[4px] bg-white border border-[#e1e5eb] shadow-[0_18px_45px_rgba(15,23,42,0.16)] text-left overflow-visible"
                    >
                      <div className="p-3">
                        <div className="text-[12px] font-black text-[#374151]">Filtreler</div>

                        <div className="mt-3 text-[10px] font-black text-[#7f8a9b]">Gösterim Şekli</div>

                        <div className="mt-2 space-y-2">
                          {[
                            {
                              label: 'Uzun Süreli Görevleri Gizle',
                              checked: calendarDisplayOptions.hideLongTasks,
                              keyName: 'hideLongTasks'
                            },
                            {
                              label: 'Tamamlanmış Görevleri Gizle',
                              checked: calendarDisplayOptions.hideCompletedTasks,
                              keyName: 'hideCompletedTasks'
                            },
                            {
                              label: 'Arşivlenmiş Görevleri Gizle',
                              checked: calendarDisplayOptions.hideArchivedTasks,
                              keyName: 'hideArchivedTasks'
                            }
                          ].map((option) => (
                            <button
                              key={option.keyName}
                              type="button"
                              onClick={() =>
                                setCalendarDisplayOptions((prev) => ({
                                  ...prev,
                                  [option.keyName]: !prev[option.keyName]
                                }))
                              }
                              className="w-full h-6 flex items-center gap-2 text-[10.5px] font-bold text-[#667085] hover:text-[#374151]"
                            >
                              <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                option.checked
                                  ? 'bg-[#4fbd7d] border-[#4fbd7d] text-white'
                                  : 'bg-white border-[#cbd2dc] text-transparent'
                              }`}>
                                ✓
                              </span>
                              {option.label}
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 text-[10px] font-black text-[#7f8a9b]">Durumlar</div>

                        <div className="relative mt-1.5">
                          <button
                            type="button"
                            onClick={() => setIsMenuCalendarStatusOpen((prev) => !prev)}
                            className="w-full h-8 rounded-[14px] bg-white border border-[#dfe3ea] px-3 flex items-center justify-between text-[10px] font-bold text-[#555f70]"
                          >
                            {menuCalendarStatusFilter}
                            <svg className="w-3 h-3 text-[#98a1b2]" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {isMenuCalendarStatusOpen && (
                            <div className="absolute left-0 right-0 top-[34px] z-[670] bg-white border border-[#dfe3ea] rounded-[4px] shadow-[0_14px_32px_rgba(15,23,42,0.14)] overflow-hidden">
                              {menuCalendarStatusOptions.map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => {
                                    setMenuCalendarStatusFilter(status);
                                    setIsMenuCalendarStatusOpen(false);
                                  }}
                                  className={`w-full h-8 px-3 text-left text-[10px] font-bold hover:bg-[#f7f8fa] ${
                                    menuCalendarStatusFilter === status ? 'text-[#2f66cf]' : 'text-[#555f70]'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 text-[10px] font-black text-[#7f8a9b]">İlgili</div>

                        <div className="mt-2 space-y-2">
                          {projects.slice(0, 5).map((projectName) => (
                            <div key={`calendar-filter-project-${projectName}`} className="h-6 flex items-center gap-2 text-[10.5px] font-bold text-[#667085]">
                              <span className="w-4 h-4 rounded-full bg-[#4fbd7d] text-white flex items-center justify-center text-[9px]">✓</span>
                              <span className="truncate">{projectName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>

              <div className="mt-3 bg-white border border-white/80 rounded-[18px] shadow-[0_24px_60px_rgba(15,23,42,0.08)] overflow-hidden ring-1 ring-slate-200/70">
                <div className="h-[56px] px-5 flex items-center justify-between border-b border-[#edf0f4] bg-white/95">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goToPreviousCalendarPeriod}
                      className="w-8 h-8 rounded-full text-[#3b4452] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[20px] leading-none"
                    >
                      ‹
                    </button>

                    <div className="text-[15px] font-black text-[#303949] min-w-[160px] capitalize">
                      {calendarHeaderTitle}
                    </div>

                    <button
                      type="button"
                      onClick={goToNextCalendarPeriod}
                      className="w-8 h-8 rounded-full text-[#3b4452] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[20px] leading-none"
                    >
                      ›
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        setCalendarMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
                        setCalendarFocusedDate(now);
                      }}
                      className="h-6 px-3 rounded-full bg-[#f1f2f4] text-[9px] font-black text-[#b4bbc7] hover:text-[#6b7280] transition-all"
                    >
                      Bugün
                    </button>
                  </div>

                  <div className="h-7 p-0.5 rounded-full bg-[#eef0f4] flex items-center gap-0.5">
                    {['Ay', 'Hafta', 'Gün', 'Liste'].map((view) => (
                      <button
                        key={`menu-calendar-view-${view}`}
                        type="button"
                        onClick={() => setCalendarView(view)}
                        className={`h-6 px-3 rounded-full text-[9px] font-black transition-all ${
                          calendarView === view
                            ? 'bg-[#55ace8] text-white shadow-sm'
                            : 'text-[#8f98a6] hover:bg-white hover:text-[#4b5563]'
                        }`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>

                                {/* zrc-v523-block-calendarview-ay */}
                <ZRCAppShellCalendarViewAyBlock
                  calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                  Ay={typeof Ay !== 'undefined' ? Ay : undefined}
                  grid={typeof grid !== 'undefined' ? grid : undefined}
                  h={typeof h !== 'undefined' ? h : undefined}
                  bg={typeof bg !== 'undefined' ? bg : undefined}
                  white={typeof white !== 'undefined' ? white : undefined}
                  border={typeof border !== 'undefined' ? border : undefined}
                  b={typeof b !== 'undefined' ? b : undefined}
                  edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                  Pzt={typeof Pzt !== 'undefined' ? Pzt : undefined}
                  Sal={typeof Sal !== 'undefined' ? Sal : undefined}
                  Per={typeof Per !== 'undefined' ? Per : undefined}
                  Cum={typeof Cum !== 'undefined' ? Cum : undefined}
                  Cmt={typeof Cmt !== 'undefined' ? Cmt : undefined}
                  Paz={typeof Paz !== 'undefined' ? Paz : undefined}
                  px={typeof px !== 'undefined' ? px : undefined}
                  flex={typeof flex !== 'undefined' ? flex : undefined}
                  items={typeof items !== 'undefined' ? items : undefined}
                  center={typeof center !== 'undefined' ? center : undefined}
                  justify={typeof justify !== 'undefined' ? justify : undefined}
                  text={typeof text !== 'undefined' ? text : undefined}
                  font={typeof font !== 'undefined' ? font : undefined}
                  black={typeof black !== 'undefined' ? black : undefined}
                  repeat={typeof repeat !== 'undefined' ? repeat : undefined}
                  calendarGridDays={typeof calendarGridDays !== 'undefined' ? calendarGridDays : undefined}
                  getMenuCalendarTasksForDay={typeof getMenuCalendarTasksForDay !== 'undefined' ? getMenuCalendarTasksForDay : undefined}
                  getMenuCalendarHolidayLabel={typeof getMenuCalendarHolidayLabel !== 'undefined' ? getMenuCalendarHolidayLabel : undefined}
                  calendarMonthDate={typeof calendarMonthDate !== 'undefined' ? calendarMonthDate : undefined}
                  isSameCalendarDay={typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined}
                  todayStart={typeof todayStart !== 'undefined' ? todayStart : undefined}
                  menu={typeof menu !== 'undefined' ? menu : undefined}
                  calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                  month={typeof month !== 'undefined' ? month : undefined}
                  handleCalendarDayClick={typeof handleCalendarDayClick !== 'undefined' ? handleCalendarDayClick : undefined}
                  data={typeof data !== 'undefined' ? data : undefined}
                  zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                  formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                  relative={typeof relative !== 'undefined' ? relative : undefined}
                  left={typeof left !== 'undefined' ? left : undefined}
                  overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                  hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                  f8fbff={typeof f8fbff !== 'undefined' ? f8fbff : undefined}
                  transition={typeof transition !== 'undefined' ? transition : undefined}
                  all={typeof all !== 'undefined' ? all : undefined}
                  cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                  pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                  fbfcfe={typeof fbfcfe !== 'undefined' ? fbfcfe : undefined}
                  repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                  linear={typeof linear !== 'undefined' ? linear : undefined}
                  gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                  fafafa_0={typeof fafafa_0 !== 'undefined' ? fafafa_0 : undefined}
                  fafafa_6px={typeof fafafa_6px !== 'undefined' ? fafafa_6px : undefined}
                  f6f6f6_6px={typeof f6f6f6_6px !== 'undefined' ? f6f6f6_6px : undefined}
                  f6f6f6_12px={typeof f6f6f6_12px !== 'undefined' ? f6f6f6_12px : undefined}
                  start={typeof start !== 'undefined' ? start : undefined}
                  between={typeof between !== 'undefined' ? between : undefined}
                  w={typeof w !== 'undefined' ? w : undefined}
                  rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                  c5cad3={typeof c5cad3 !== 'undefined' ? c5cad3 : undefined}
                  mt={typeof mt !== 'undefined' ? mt : undefined}
                  leading={typeof leading !== 'undefined' ? leading : undefined}
                  space={typeof space !== 'undefined' ? space : undefined}
                  openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                  full={typeof full !== 'undefined' ? full : undefined}
                  gap={typeof gap !== 'undefined' ? gap : undefined}
                  e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                  l={typeof l !== 'undefined' ? l : undefined}
                  shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                  translate={typeof translate !== 'undefined' ? translate : undefined}
                  getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                  shrink={typeof shrink !== 'undefined' ? shrink : undefined}
                  getPremiumCalendarDotStyle={typeof getPremiumCalendarDotStyle !== 'undefined' ? getPremiumCalendarDotStyle : undefined}
                  current={typeof current !== 'undefined' ? current : undefined}
                  formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                  min={typeof min !== 'undefined' ? min : undefined}
                  truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                />

                                {/* zrc-v523-block-calendarview-hafta */}
                <ZRCAppShellCalendarViewHaftaBlock
                  calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                  Hafta={typeof Hafta !== 'undefined' ? Hafta : undefined}
                  bg={typeof bg !== 'undefined' ? bg : undefined}
                  white={typeof white !== 'undefined' ? white : undefined}
                  grid={typeof grid !== 'undefined' ? grid : undefined}
                  h={typeof h !== 'undefined' ? h : undefined}
                  border={typeof border !== 'undefined' ? border : undefined}
                  b={typeof b !== 'undefined' ? b : undefined}
                  edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                  calendarWeekDays={typeof calendarWeekDays !== 'undefined' ? calendarWeekDays : undefined}
                  week={typeof week !== 'undefined' ? week : undefined}
                  head={typeof head !== 'undefined' ? head : undefined}
                  setCalendarFocusedDate={typeof setCalendarFocusedDate !== 'undefined' ? setCalendarFocusedDate : undefined}
                  text={typeof text !== 'undefined' ? text : undefined}
                  center={typeof center !== 'undefined' ? center : undefined}
                  font={typeof font !== 'undefined' ? font : undefined}
                  black={typeof black !== 'undefined' ? black : undefined}
                  formatCalendarDate={typeof formatCalendarDate !== 'undefined' ? formatCalendarDate : undefined}
                  formatCalendarWeekday={typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined}
                  px={typeof px !== 'undefined' ? px : undefined}
                  flex={typeof flex !== 'undefined' ? flex : undefined}
                  items={typeof items !== 'undefined' ? items : undefined}
                  bold={typeof bold !== 'undefined' ? bold : undefined}
                  getMenuCalendarAllDayTasks={typeof getMenuCalendarAllDayTasks !== 'undefined' ? getMenuCalendarAllDayTasks : undefined}
                  getMenuCalendarHolidayLabel={typeof getMenuCalendarHolidayLabel !== 'undefined' ? getMenuCalendarHolidayLabel : undefined}
                  allday={typeof allday !== 'undefined' ? allday : undefined}
                  data={typeof data !== 'undefined' ? data : undefined}
                  zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                  calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                  formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                  openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                  gap={typeof gap !== 'undefined' ? gap : undefined}
                  overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                  hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                  cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                  pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                  f8fbff={typeof f8fbff !== 'undefined' ? f8fbff : undefined}
                  repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                  linear={typeof linear !== 'undefined' ? linear : undefined}
                  gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                  fafafa_0={typeof fafafa_0 !== 'undefined' ? fafafa_0 : undefined}
                  fafafa_6px={typeof fafafa_6px !== 'undefined' ? fafafa_6px : undefined}
                  f6f6f6_6px={typeof f6f6f6_6px !== 'undefined' ? f6f6f6_6px : undefined}
                  f6f6f6_12px={typeof f6f6f6_12px !== 'undefined' ? f6f6f6_12px : undefined}
                  truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                  openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                  w={typeof w !== 'undefined' ? w : undefined}
                  full={typeof full !== 'undefined' ? full : undefined}
                  rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                  e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                  l={typeof l !== 'undefined' ? l : undefined}
                  left={typeof left !== 'undefined' ? left : undefined}
                  current={typeof current !== 'undefined' ? current : undefined}
                  shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                  getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                  max={typeof max !== 'undefined' ? max : undefined}
                  auto={typeof auto !== 'undefined' ? auto : undefined}
                  custom={typeof custom !== 'undefined' ? custom : undefined}
                  scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
                  menuCalendarHours={typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined}
                  pt={typeof pt !== 'undefined' ? pt : undefined}
                  semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                  getMenuCalendarTasksForHour={typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined}
                  relative={typeof relative !== 'undefined' ? relative : undefined}
                  fff_0={typeof fff_0 !== 'undefined' ? fff_0 : undefined}
                  fff_8px={typeof fff_8px !== 'undefined' ? fff_8px : undefined}
                  fbfbfb_8px={typeof fbfbfb_8px !== 'undefined' ? fbfbfb_8px : undefined}
                  fbfbfb_16px={typeof fbfbfb_16px !== 'undefined' ? fbfbfb_16px : undefined}
                  absolute={typeof absolute !== 'undefined' ? absolute : undefined}
                  right={typeof right !== 'undefined' ? right : undefined}
                  top={typeof top !== 'undefined' ? top : undefined}
                  min={typeof min !== 'undefined' ? min : undefined}
                  py={typeof py !== 'undefined' ? py : undefined}
                  transition={typeof transition !== 'undefined' ? transition : undefined}
                  all={typeof all !== 'undefined' ? all : undefined}
                  formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                />

                {calendarView === 'Gün' && (
                  <div className="bg-white">
                    <div className="h-[36px] grid grid-cols-[54px_1fr] border-b border-[#edf0f4]">
                      <div className="border-r border-[#edf0f4]" />
                      <div className="flex items-center justify-center text-[10px] font-black text-[#9aa3b1]">
                        {formatCalendarWeekday(calendarFocusedDate)}
                      </div>
                    </div>

                    <div className="h-[32px] grid grid-cols-[54px_1fr] border-b border-[#edf0f4]">
                      <div className="px-2 flex items-center text-[10px] font-bold text-[#4b5563] border-r border-[#edf0f4]">
                        Tüm Gün
                      </div>
                      <div className="px-2 flex items-center bg-[repeating-linear-gradient(135deg,#fafafa_0,#fafafa_6px,#f6f6f6_6px,#f6f6f6_12px)]">
                        {getMenuCalendarHolidayLabel(calendarFocusedDate) && (
                          <span className="text-[10px] font-black text-[#374151]">
                            {getMenuCalendarHolidayLabel(calendarFocusedDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[560px] overflow-y-auto custom-scrollbar">
                      {menuCalendarHours.map((hour) => {
                        const hourTasks = getMenuCalendarTasksForHour(calendarFocusedDate, hour);

                        return (
                          <div key={`day-hour-${hour}`} className="grid grid-cols-[54px_1fr] h-[48px] border-b border-[#edf0f4]">
                            <div className="px-2 pt-1.5 text-[10px] font-semibold text-[#4b5563] border-r border-[#edf0f4]">
                              {hour}:00
                            </div>
                            <div className="relative bg-[repeating-linear-gradient(135deg,#fff_0,#fff_8px,#fbfbfb_8px,#fbfbfb_16px)]">
                              {hourTasks.map((task) => (
                                <button
                                  key={`day-task-${task.projectName}-${task.id}`}
                                  type="button"
                                  data-calendar-task-button="true"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openMenuCalendarTask(task);
                                  }}
                                  className="absolute left-1 right-6 top-1 min-h-[32px] rounded-[8px] border border-[#e4e9f1] border-l-[3px] bg-white px-2 py-1 text-left text-[8px] font-black text-current overflow-hidden shadow-[0_8px_18px_rgba(15,23,42,0.055)] hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition-all"
                                  style={getPremiumCalendarTaskStyle(task)}
                                >
                                  <div className="opacity-80">{formatMenuCalendarTaskTime(task)}</div>
                                  <div className="truncate">{task.title}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {calendarView === 'Liste' && (
                  <div className="bg-white min-h-[560px]">
                    {menuCalendarListGroups.length > 0 ? (
                      menuCalendarListGroups.map((group) => (
                        <div key={`list-group-${group.day.toISOString()}`}>
                          <div className="h-[30px] px-3.5 bg-[#f1f3f6] border-b border-[#d6dce5] flex items-center justify-between">
                            <div className="text-[10.5px] font-black text-[#374151] capitalize">
                              {new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(group.day)}
                            </div>
                            <div className="text-[10px] font-black text-[#374151]">
                              {formatMenuCalendarWeekHeader(group.day)}
                            </div>
                          </div>

                          {group.tasks.map((task) => (
                            <button
                              key={`list-task-${group.day.toISOString()}-${task.projectName}-${task.id}`}
                              type="button"
                              onClick={() => openMenuCalendarTask(task)}
                              className="w-full min-h-[38px] grid grid-cols-[64px_1fr] items-center bg-white border-b border-[#edf0f4] border-l-[3px] text-left hover:bg-[#f8fafc] transition-all"
                            >
                              <div className="px-3 text-[10px] font-black text-slate-600">
                                {formatMenuCalendarTaskTime(task) || ' '}
                              </div>
                              <div className="min-w-0 text-[10px] font-black text-current truncate">
                                <span className="inline-block w-2 h-2 rounded-full mr-2 shadow-[0_0_0_2px_rgba(15,23,42,0.04)]" style={getPremiumCalendarDotStyle(task)} />
                                {task.title}
                              </div>
                            </button>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="h-[240px] flex items-center justify-center text-[11px] font-bold text-[#9aa3b1]">
                        Bu aralıkta planlı görev yok.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeContentMenu === 'Yazışmalar' ? (
          <div className="w-full h-full bg-[#f2f3f5] overflow-hidden animate-fade-in">
            <div className="h-full px-4 pt-3 pb-6">
              <div className="h-full bg-white border border-[#e4e7ec] rounded-[7px] shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden flex">
                <aside className="w-[255px] border-r border-[#e8ebf0] bg-white flex flex-col">
                  <div className="h-[52px] px-4 flex items-center justify-between shrink-0">
                    <div className="text-[15px] font-bold text-current">Mesajlar</div>

                    <div className="relative flex items-center gap-1.5">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-[5px] text-[#b3bbc7] hover:bg-[#f5f7fa] hover:text-[#687386] transition-all flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      </button>

                      {canCreateChatGroups && (
                        <>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setIsChatActionMenuOpen((prev) => !prev);
                            }}
                            className="w-7 h-7 rounded-[5px] text-[#b3bbc7] hover:bg-[#f5f7fa] hover:text-[#687386] transition-all flex items-center justify-center"
                          >
                            ⋮
                          </button>

                          {isChatActionMenuOpen && (
                            <div
                              onClick={(event) => event.stopPropagation()}
                              className="absolute right-0 top-[30px] z-[620] w-[170px] bg-white border border-[#dfe3ea] rounded-[4px] shadow-[0_14px_34px_rgba(15,23,42,0.16)] overflow-hidden py-1"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setIsChatGroupModalOpen(true);
                                  setIsChatActionMenuOpen(false);
                                }}
                                className="w-full h-8 px-3 text-left text-[11px] font-bold text-[#394150] hover:bg-[#f6f8fb] flex items-center gap-2"
                              >
                                <span className="text-[#6f7a89]">⊞</span>
                                Yeni Yazışma Grubu
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pb-2">
                    <input
                      value={chatGroupSearch}
                      onChange={(event) => setChatGroupSearch(event.target.value)}
                      placeholder="Yazışma ara..."
                      className="w-full h-8 rounded-[4px] border border-[#e4e7ec] bg-[#fafbfc] px-2.5 text-[10px] font-semibold text-[#45505f] placeholder:text-[#b4bbc7] focus:outline-none focus:border-[#b7d4ff] focus:bg-white"
                    />
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                    {filteredChatGroups.map((group) => {
                      const isSelected = selectedChatGroupId === group.id;
                      const groupMessages = projectMessages
                        .filter((message) => message.chatGroupId === group.id)
                        .filter(isProjectMessageVisibleForCurrentUser);
                      const lastMessage = groupMessages[groupMessages.length - 1];

                      return (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => setSelectedChatGroupId(group.id)}
                          className={`w-full h-[58px] px-4 flex items-center gap-3 text-left border-b border-[#f0f2f5] transition-all ${
                            isSelected ? 'bg-[#f2f7ff]' : 'bg-white hover:bg-[#fafbfc]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#a9ddf4] border border-[#6fbce2] flex items-center justify-center shrink-0 overflow-hidden">
                            <div className="relative w-full h-full">
                              <span className="absolute left-[7px] top-[7px] w-3 h-3 rounded-full bg-[#2e8fc5]" />
                              <span className="absolute right-[6px] top-[8px] w-3 h-3 rounded-full bg-[#51b2dc]" />
                              <span className="absolute left-[5px] bottom-[5px] w-[22px] h-[12px] rounded-t-full bg-[#2e8fc5]/80" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-[11.5px] font-bold text-[#2f3847] truncate">{group.name}</div>
                            <div className="mt-0.5 text-[9px] font-semibold text-[#9aa3b1] truncate">
                              {lastMessage ? lastMessage.text : group.type === 'project' ? 'Proje yazışma grubu' : 'Özel yazışma grubu'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {canCreateChatGroups && (
                    <div className="p-4 border-t border-[#edf0f4] shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsChatGroupModalOpen(true)}
                        className="w-full h-8 rounded-[5px] bg-[#4aa5e8] text-white text-[10px] font-black hover:bg-[#3c98dc] transition-all flex items-center justify-center gap-2"
                      >
                        Yeni Yazışma Grubu
                        <span className="text-[14px] leading-none">+</span>
                      </button>
                    </div>
                  )}
                </aside>

                <section className="flex-1 min-w-0 bg-white flex flex-col">
                  {selectedChatGroup ? (
                    <>
                      <div className="h-[54px] px-5 border-b border-[#edf0f4] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#a9ddf4] border border-[#6fbce2] flex items-center justify-center text-[9px] font-black text-[#1f6c96]">
                            {selectedChatGroup.avatar || createAvatarFromName(selectedChatGroup.name)}
                          </div>

                          <div>
                            <div className="text-[14px] font-black text-current">{selectedChatGroup.name}</div>
                            <div className="mt-0.5 text-[9.5px] font-bold text-[#9aa3b1]">
                              {(selectedChatGroup.members || []).length} üye
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedChatGroupId('')}
                          className="h-7 px-3 rounded-[4px] bg-[#f4f6f8] text-[9px] font-black text-[#7d8795] hover:text-[#394150]"
                        >
                          Kapat
                        </button>
                      </div>

                      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-[#fbfcfe] p-5">
                        {selectedChatMessages.length > 0 ? (
                          <div className="space-y-3">
                            {selectedChatMessages.map((message) => {
                              const isMe = isCurrentProfileRecord(message);

                              return (
                                <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[520px] rounded-[8px] px-3 py-2 shadow-sm ${
                                    isMe ? 'bg-[#4aa5e8] text-white' : 'bg-white border border-[#e4e7ec] text-[#394150]'
                                  }`}>
                                    <div className={`text-[9px] font-black mb-1 ${isMe ? 'text-white/75' : 'text-[#9aa3b1]'}`}>
                                      {message.sender || 'Ekip'} · {getProjectMessageDateLabel(message.createdAt)}
                                    </div>
                                    <div className="text-[11px] font-semibold leading-5">{message.text}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-full min-h-[360px] flex items-center justify-center">
                            <div className="text-center max-w-[420px]">
                              <div className="mx-auto w-[160px] h-[110px] relative mb-5">
                                <div className="absolute left-8 top-2 w-[100px] h-[58px] border-[3px] border-[#d8edff] bg-[#f8fcff]" />
                                <div className="absolute left-[58px] top-[48px] w-[62px] h-[48px] rounded-t-[28px] bg-[#5f91f3]" />
                                <div className="absolute left-[70px] top-[38px] w-[28px] h-[28px] rounded-full bg-[#263244]" />
                                <div className="absolute left-[40px] top-[10px] w-[28px] h-[28px] bg-[#4d82ff] rotate-[-20deg]" />
                                <div className="absolute right-[28px] top-[18px] w-[48px] h-[26px] rounded-[5px] bg-[#4d82ff]" />
                                <div className="absolute left-[48px] bottom-0 w-[86px] h-[2px] bg-[#b8d9ff]" />
                              </div>

                              <div className="text-[18px] font-black text-current">Yazışmalar</div>
                              <p className="mt-2 text-[11px] font-semibold leading-5 text-[#3f4858]">
                                {canSendSelectedChatMessage
                                  ? 'Bu yazışma grubunda henüz mesaj yok. İlk mesajı yazarak konuşmayı başlat.'
                                  : 'Bu yazışma grubunda henüz mesaj yok.'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {canSendSelectedChatMessage && (
                        <form onSubmit={handleSendChatPageMessage} className="h-[62px] px-4 border-t border-[#edf0f4] bg-white flex items-center gap-2 shrink-0">
                          <input
                            value={chatPageDraft}
                            onChange={(event) => setChatPageDraft(event.target.value)}
                            placeholder="Mesaj yaz..."
                            className="flex-1 h-10 rounded-[6px] border border-[#e4e7ec] bg-[#fafbfc] px-3 text-[11px] font-semibold text-[#394150] placeholder:text-[#b4bbc7] focus:outline-none focus:border-[#b7d4ff] focus:bg-white"
                          />

                          <button
                            type="submit"
                            disabled={!chatPageDraft.trim()}
                            className={`h-10 px-4 rounded-[6px] text-white text-[10px] font-black transition-all ${
                              chatPageDraft.trim()
                                ? 'bg-[#4aa5e8] hover:bg-[#3c98dc]'
                                : 'bg-zinc-300 cursor-not-allowed'
                            }`}
                          >
                            Gönder
                          </button>
                        </form>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 min-h-0 flex items-center justify-center">
                      <div className="text-center max-w-[560px] px-6">
                        <div className="mx-auto w-[260px] h-[155px] relative mb-7">
                          <div className="absolute left-[56px] top-0 w-[136px] h-[78px] border-[4px] border-[#d8edff] bg-[#f9fdff]" />
                          <div className="absolute left-[94px] top-[62px] w-[76px] h-[62px] rounded-t-[34px] bg-[#5f91f3]" />
                          <div className="absolute left-[110px] top-[48px] w-[32px] h-[32px] rounded-full bg-[#263244]" />
                          <div className="absolute left-[70px] top-[14px] w-[40px] h-[40px] bg-[#4d82ff] rotate-[-20deg]" />
                          <div className="absolute right-[58px] top-[26px] w-[66px] h-[34px] rounded-[5px] bg-[#4d82ff]" />
                          <div className="absolute left-[72px] bottom-0 w-[140px] h-[2px] bg-[#b8d9ff]" />
                        </div>

                        <div className="text-[18px] font-black text-current">Yazışmalar</div>
                        <p className="mt-2 text-[11px] font-semibold leading-5 text-[#3f4858]">
                          Yazışmalarınızı görüntülemek ve yazışmaya başlamak için soldaki yazışma listesinden bir yazışmayı seçin.
                        </p>

                        <div className="mt-8 text-[18px] font-black text-current">Yazışma Grupları</div>
                        <p className="mt-2 text-[11px] font-semibold leading-5 text-[#3f4858]">
                          {canCreateChatGroups
                            ? 'Soldaki liste mevcut projelerinizden otomatik oluşur. Ayrıca özel yazışma grubu da oluşturabilirsiniz.'
                            : 'Soldaki listede sadece erişiminiz olan proje yazışmaları görünür.'}
                        </p>

                        {canCreateChatGroups && (
                          <button
                            type="button"
                            onClick={() => setIsChatGroupModalOpen(true)}
                            className="mt-5 h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all inline-flex items-center gap-2"
                          >
                            Yazışma Grubu Oluştur
                            <span className="text-[13px] leading-none">+</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>

            {isChatGroupModalOpen && canCreateChatGroups && (
              <div className="fixed inset-0 z-[760] bg-zinc-950/45 flex items-start justify-center pt-[115px]" onClick={() => setIsChatGroupModalOpen(false)}>
                <form
                  onSubmit={createChatGroupFromPage}
                  onClick={(event) => event.stopPropagation()}
                  className="w-[390px] bg-white rounded-[15px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-hidden"
                >
                  <div className="h-12 px-5 flex items-center justify-center relative">
                    <div className="text-[12px] font-black text-current flex items-center gap-1.5">
                      <span className="text-[#7d8795]">⌕</span>
                      Yazışma Grubu
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsChatGroupModalOpen(false)}
                      className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#eef0f4] text-[#778293] hover:bg-white hover:text-current transition-all shadow-sm"
                    >
                      ×
                    </button>
                  </div>

                  <div className="px-5 pb-5">
                    <label className="block text-[10px] font-black text-[#677282] mb-1.5">Grup Adı</label>
                    <input
                      value={chatGroupDraft}
                      onChange={(event) => setChatGroupDraft(event.target.value)}
                      placeholder="Grup adını girin..."
                      autoFocus
                      className="w-full h-8 rounded-[8px] border border-[#8bbcff] px-3 text-[10px] font-semibold text-[#394150] placeholder:text-[#aab3c0] focus:outline-none focus:ring-2 focus:ring-[#dcebff]"
                    />

                    <div className="mt-4 text-[10px] font-black text-[#677282] mb-1.5">Grup Üyeleri</div>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-[#45b978] text-white text-[18px] leading-none font-bold hover:bg-[#38a86b] transition-all flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <div className="h-[50px] px-5 bg-[#f8f9fb] border-t border-[#edf0f4] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsChatGroupModalOpen(false)}
                      className="h-8 px-4 rounded-full bg-[#eef0f4] text-[10px] font-black text-[#667085] hover:bg-[#e3e7ee] transition-all flex items-center gap-3"
                    >
                      Kapat
                      <span>×</span>
                    </button>

                    <button
                      type="submit"
                      className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all flex items-center gap-3"
                    >
                      Kaydet
                      <span>▣</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : activeContentMenu === 'Profil' ? (
          <div className="zrc-profile-page-safe-v326 zrc-profile-page-safe-v328 w-full h-full min-h-0 bg-[#f2f3f5] overflow-y-auto custom-scrollbar animate-fade-in">
            <div className="zrc-profile-shell-safe-v326 zrc-profile-shell-safe-v328 max-w-[1240px] mx-auto px-5 py-4 pb-20 space-y-4 min-w-[980px]">
              <div className="zrc-profile-header-card-safe-v328 bg-white border border-[#e5e8ee] rounded-[8px] shadow-[0_8px_24px_rgba(15,23,42,0.06)] px-5 py-4">
                <div className="grid grid-cols-[300px_1fr] gap-7 items-center">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => profileAvatarInputRef.current?.click()}
                        className="group relative w-[118px] h-[118px] rounded-[12px] border-[3px] border-[#7c4dff] bg-[#4a3920] shadow-sm flex items-center justify-center overflow-hidden"
                      >
                        {profileDraft.avatarDataUrl ? (
                          <img
                            src={profileDraft.avatarDataUrl}
                            alt="Profil"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="relative w-[86px] h-[74px]">
                            <div className="absolute inset-x-1 top-2 h-[54px] rounded-[50%] bg-[#b7a482]" />
                            <div className="absolute left-6 top-10 w-3 h-3 rounded-full bg-[#263244]" />
                            <div className="absolute right-6 top-10 w-3 h-3 rounded-full bg-[#263244]" />
                            <div className="absolute left-9 top-[53px] w-5 h-2 rounded-b-full border-b-2 border-[#263244]" />
                            <div className="absolute left-1 top-0 w-11 h-9 rounded-full bg-[#8b7a5c] rotate-[-18deg]" />
                            <div className="absolute right-1 top-0 w-11 h-9 rounded-full bg-[#8b7a5c] rotate-[18deg]" />
                          </div>
                        )}

                        <span className="absolute inset-x-0 bottom-0 h-8 bg-zinc-950/55 text-white text-[9px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Resmi Değiştir
                        </span>
                      </button>

                      <input
                        ref={profileAvatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileAvatarChange}
                        className="hidden"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[13px] font-black text-current">Profil Detayları</div>
                      <div className="mt-1 text-[11px] font-bold text-[#7c8798] truncate">
                        {profileDraft.firstName} {profileDraft.lastName}
                      </div>
                      <div className="mt-2 text-[10px] font-bold text-[#9aa3b1]">
                        {profileDraft.email}
                      </div>
                      {profilePreferences.lastSavedAt && (
                        <div className="mt-2 text-[10px] font-black text-[#45b978]">Kaydedildi</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                    <label className="block">
                      <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">Ad</span>
                      <input
                        value={profileDraft.firstName}
                        onChange={(event) => setProfileDraft((prev) => ({ ...prev, firstName: event.target.value }))}
                        className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">Soyad</span>
                      <input
                        value={profileDraft.lastName}
                        onChange={(event) => setProfileDraft((prev) => ({ ...prev, lastName: event.target.value }))}
                        className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                      />
                    </label>

                    {renderProfileSelect({
                      id: 'profile-language',
                      label: 'Dil',
                      value: profileDraft.language,
                      options: ['Türkçe', 'English'],
                      onChange: (value) => setProfileDraft((prev) => ({ ...prev, language: value }))
                    })}

                    {renderProfileSelect({
                      id: 'profile-status',
                      label: 'Durum',
                      value: profileDraft.status,
                      options: ['Hiçbiri', 'Müsait', 'Meşgul', 'Rahatsız Etmeyin'],
                      onChange: (value) => setProfileDraft((prev) => ({ ...prev, status: value }))
                    })}

                    <label className="block col-span-3">
                      <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">İş Ünvanı</span>
                      <input
                        value={profileDraft.title}
                        onChange={(event) => setProfileDraft((prev) => ({ ...prev, title: event.target.value }))}
                        className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                      />
                    </label>

                    <div className="flex items-end justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="h-8 px-4 rounded-full bg-white border border-zinc-200 text-zinc-500 text-[10px] font-black hover:text-[#ff3600] hover:border-[#ff3600] transition-all"
                      >
                        Kullanıcı Değiştir
                      </button>

                      <button
                        type="button"
                        onClick={saveProfileSection}
                        className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all flex items-center gap-2"
                      >
                        Güncelle
                        <span>▣</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="zrc-profile-tab-card-safe-v328 bg-white border border-[#e5e8ee] rounded-[8px] shadow-[0_8px_24px_rgba(15,23,42,0.06)] overflow-hidden">
                <div className="h-[46px] px-5 border-b border-[#e5e8ee] flex items-end">
                  <div className="flex items-end gap-6 overflow-x-auto custom-scrollbar">
                    {visibleProfileTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveProfileTab(tab)}
                        className={`relative h-[46px] px-1 text-[11.5px] font-bold transition-all whitespace-nowrap ${
                          activeProfileTab === tab ? 'text-[#8e69e8]' : 'text-[#7c8798] hover:text-[#394150]'
                        }`}
                      >
                        {tab}
                        {activeProfileTab === tab && (
                          <span className="absolute left-0 right-0 -bottom-px h-[4px] rounded-t-full bg-[#a98bf4]" />
                        )}
                      </button>
                    ))}
                  </div>

                </div>

                <div className="zrc-profile-tab-content-safe-v328 p-5">
                                    {/* zrc-v523-block-activeprofiletab-hesap */}
                  <ZRCAppShellActiveProfileTabHesapBlock
                    activeProfileTab={typeof activeProfileTab !== 'undefined' ? activeProfileTab : undefined}
                    Hesap={typeof Hesap !== 'undefined' ? Hesap : undefined}
                    space={typeof space !== 'undefined' ? space : undefined}
                    text={typeof text !== 'undefined' ? text : undefined}
                    font={typeof font !== 'undefined' ? font : undefined}
                    black={typeof black !== 'undefined' ? black : undefined}
                    current={typeof current !== 'undefined' ? current : undefined}
                    mb={typeof mb !== 'undefined' ? mb : undefined}
                    E={typeof E !== 'undefined' ? E : undefined}
                    Posta={typeof Posta !== 'undefined' ? Posta : undefined}
                    Bilgilerini={typeof Bilgilerini !== 'undefined' ? Bilgilerini : undefined}
                    grid={typeof grid !== 'undefined' ? grid : undefined}
                    gap={typeof gap !== 'undefined' ? gap : undefined}
                    block={typeof block !== 'undefined' ? block : undefined}
                    a1aabb={typeof a1aabb !== 'undefined' ? a1aabb : undefined}
                    posta={typeof posta !== 'undefined' ? posta : undefined}
                    profileDraft={typeof profileDraft !== 'undefined' ? profileDraft : undefined}
                    setProfileDraft={typeof setProfileDraft !== 'undefined' ? setProfileDraft : undefined}
                    w={typeof w !== 'undefined' ? w : undefined}
                    full={typeof full !== 'undefined' ? full : undefined}
                    h={typeof h !== 'undefined' ? h : undefined}
                    rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                    border={typeof border !== 'undefined' ? border : undefined}
                    e4e7ec={typeof e4e7ec !== 'undefined' ? e4e7ec : undefined}
                    px={typeof px !== 'undefined' ? px : undefined}
                    semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                    outline={typeof outline !== 'undefined' ? outline : undefined}
                    none={typeof none !== 'undefined' ? none : undefined}
                    b7d4ff={typeof b7d4ff !== 'undefined' ? b7d4ff : undefined}
                    password={typeof password !== 'undefined' ? password : undefined}
                    mt={typeof mt !== 'undefined' ? mt : undefined}
                    bold={typeof bold !== 'undefined' ? bold : undefined}
                    adresini={typeof adresini !== 'undefined' ? adresini : undefined}
                    girmelisiniz={typeof girmelisiniz !== 'undefined' ? girmelisiniz : undefined}
                    flex={typeof flex !== 'undefined' ? flex : undefined}
                    justify={typeof justify !== 'undefined' ? justify : undefined}
                    end={typeof end !== 'undefined' ? end : undefined}
                    saveProfileSection={typeof saveProfileSection !== 'undefined' ? saveProfileSection : undefined}
                    bg={typeof bg !== 'undefined' ? bg : undefined}
                    white={typeof white !== 'undefined' ? white : undefined}
                    transition={typeof transition !== 'undefined' ? transition : undefined}
                    all={typeof all !== 'undefined' ? all : undefined}
                    t={typeof t !== 'undefined' ? t : undefined}
                    edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                    pt={typeof pt !== 'undefined' ? pt : undefined}
                    currentPassword={typeof currentPassword !== 'undefined' ? currentPassword : undefined}
                    newPassword={typeof newPassword !== 'undefined' ? newPassword : undefined}
                    Yeni={typeof Yeni !== 'undefined' ? Yeni : undefined}
                    repeatPassword={typeof repeatPassword !== 'undefined' ? repeatPassword : undefined}
                    tekrar={typeof tekrar !== 'undefined' ? tekrar : undefined}
                    keyName={typeof keyName !== 'undefined' ? keyName : undefined}
                    renderProfileSelect={typeof renderProfileSelect !== 'undefined' ? renderProfileSelect : undefined}
                    profile={typeof profile !== 'undefined' ? profile : undefined}
                    date={typeof date !== 'undefined' ? date : undefined}
                    format={typeof format !== 'undefined' ? format : undefined}
                    Tarih={typeof Tarih !== 'undefined' ? Tarih : undefined}
                    DD={typeof DD !== 'undefined' ? DD : undefined}
                    MM={typeof MM !== 'undefined' ? MM : undefined}
                    YYYY={typeof YYYY !== 'undefined' ? YYYY : undefined}
                    time={typeof time !== 'undefined' ? time : undefined}
                    Zaman={typeof Zaman !== 'undefined' ? Zaman : undefined}
                    Saat={typeof Saat !== 'undefined' ? Saat : undefined}
                    AM={typeof AM !== 'undefined' ? AM : undefined}
                    timezone={typeof timezone !== 'undefined' ? timezone : undefined}
                    Dilimi={typeof Dilimi !== 'undefined' ? Dilimi : undefined}
                    UTC={typeof UTC !== 'undefined' ? UTC : undefined}
                    items={typeof items !== 'undefined' ? items : undefined}
                    center={typeof center !== 'undefined' ? center : undefined}
                    haneli={typeof haneli !== 'undefined' ? haneli : undefined}
                    kod={typeof kod !== 'undefined' ? kod : undefined}
                    isteyerek={typeof isteyerek !== 'undefined' ? isteyerek : undefined}
                    hesap={typeof hesap !== 'undefined' ? hesap : undefined}
                    e5e7eb={typeof e5e7eb !== 'undefined' ? e5e7eb : undefined}
                    setProfilePreferences={typeof setProfilePreferences !== 'undefined' ? setProfilePreferences : undefined}
                    profilePreferences={typeof profilePreferences !== 'undefined' ? profilePreferences : undefined}
                    red={typeof red !== 'undefined' ? red : undefined}
                    Sil={typeof Sil !== 'undefined' ? Sil : undefined}
                    silme={typeof silme !== 'undefined' ? silme : undefined}
                    geri={typeof geri !== 'undefined' ? geri : undefined}
                    setPendingProfileDelete={typeof setPendingProfileDelete !== 'undefined' ? setPendingProfileDelete : undefined}
                    pendingProfileDelete={typeof pendingProfileDelete !== 'undefined' ? pendingProfileDelete : undefined}
                    Emin={typeof Emin !== 'undefined' ? Emin : undefined}
                    misin={typeof misin !== 'undefined' ? misin : undefined}
                  />

                  {activeProfileTab === 'E-Posta Bildirimi' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[14px] font-black text-current">E-Posta Bildirimi</div>
                        <button
                          type="button"
                          onClick={() =>
                            setProfilePreferences((prev) => ({
                              ...prev,
                              emailInstant: false,
                              emailChat: false,
                              emailActivity: false,
                              emailLeave: false,
                              emailReminder: false,
                              emailImportant: false,
                              lastSavedAt: new Date().toISOString()
                            }))
                          }
                          className="h-8 px-4 rounded-full bg-red-600 text-white text-[10px] font-black"
                        >
                          E-posta Bildirimlerini Kapat
                        </button>
                      </div>

                      <div className="h-10 px-3 rounded-[4px] border border-blue-200 bg-blue-50 flex items-center text-[10.5px] font-semibold text-[#475467]">
                        ⓘ Uygulama açık değilse bildirimler e-posta ile gönderilir.
                      </div>

                      <div className="mt-4 divide-y divide-[#edf0f4]">
                        {[
                          ['emailInstant', 'E-posta Bildirimlerini Anlık Olarak Gönder'],
                          ['emailChat', 'Yazışma Bildirimlerini Gönder'],
                          ['emailActivity', 'Aktivite Bildirimlerini Gönder'],
                          ['emailLeave', 'İzin Talebi Bildirimlerini Gönder'],
                          ['emailReminder', 'Son Tarihi Yaklaşan İşler için Hatırlatma Gönder'],
                          ['emailImportant', 'Yönettiğim Projelerdeki Önemli Bildirimleri Gönder']
                        ].map(([keyName, label]) => (
                          <button
                            key={keyName}
                            type="button"
                            onClick={() => toggleProfilePreference(keyName)}
                            className="w-full h-10 flex items-center gap-2 text-left"
                          >
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                              profilePreferences[keyName] ? 'bg-[#45b978] border-[#45b978] text-white' : 'bg-white border-[#cbd2dc] text-transparent'
                            }`}>
                              ✓
                            </span>
                            <span className="text-[10.5px] font-bold text-[#394150]">{label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button type="button" onClick={saveProfileSection} className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black">
                          Ayarları kaydet
                        </button>
                      </div>
                    </div>
                  )}

                  {activeProfileTab === 'Tarayıcı Bildirimi' && (
                    <div>
                      <div className="text-[14px] font-black text-current mb-2">Web Tarayıcısı Bildirimleri</div>
                      <div className="text-[10.5px] font-semibold text-[#7c8798] mb-4">
                        Aktivite ve chat bildirimlerini bilgisayar ekranınızın köşesinde görebilirsiniz.
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleProfilePreference('browserEnabled')}
                        className={`w-full h-10 px-3 rounded-[4px] border flex items-center text-[10.5px] font-semibold ${
                          profilePreferences.browserEnabled
                            ? 'border-emerald-200 bg-emerald-50 text-[#28664b]'
                            : 'border-blue-200 bg-blue-50 text-[#475467]'
                        }`}
                      >
                        {profilePreferences.browserEnabled ? '✓ Web tarayıcısı bildirimleri aktif.' : '○ Web tarayıcısı bildirimleri kapalı.'}
                      </button>

                      <div className="mt-5 grid grid-cols-[1fr_200px] gap-4 items-center border-t border-[#edf0f4] pt-5">
                        <div>
                          <div className="text-[12px] font-black text-current">Rahatsız Etme Modu</div>
                          <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">
                            Aktifken bildirim sesi kapatılır.
                          </div>
                        </div>

                        {renderProfileSelect({
                          id: 'profile-do-not-disturb',
                          label: 'Mod',
                          value: profilePreferences.doNotDisturb,
                          options: ['Kapalı', 'Açık', 'Hafta içi 18:00 sonrası'],
                          wrapperClassName: 'w-[200px]',
                          onChange: (value) =>
                            setProfilePreferences((prev) => ({
                              ...prev,
                              doNotDisturb: value,
                              lastSavedAt: new Date().toISOString()
                            }))
                        })}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button type="button" onClick={saveProfileSection} className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black">
                          Güncelle
                        </button>
                      </div>
                    </div>
                  )}

                  {activeProfileTab === 'E-Posta Kutusu' && (
                    <div>
                      <div className="text-[14px] font-black text-current mb-2">E-posta Hesapları</div>
                      <div className="text-[10.5px] font-semibold text-[#7c8798] mb-4">
                        E-posta hesabı ekleyerek toplantı ve takvim kayıtlarını takip edebilirsiniz.
                      </div>

                      <form onSubmit={addProfileEmailAccount} className="h-10 flex items-center gap-2">
                        <input
                          value={emailAccountDraft}
                          onChange={(event) => setEmailAccountDraft(event.target.value)}
                          placeholder="ornek@firma.com"
                          className="flex-1 h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                        />
                        <button type="submit" className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black">
                          E-posta Hesabı Ekle +
                        </button>
                      </form>

                      <div className="mt-5">
                        {profilePreferences.emailAccounts.length > 0 ? (
                          <div className="border border-[#edf0f4] rounded-[6px] overflow-hidden">
                            {profilePreferences.emailAccounts.map((account) => (
                              <div key={account.id} className="h-12 px-3 border-b last:border-b-0 border-[#edf0f4] flex items-center justify-between">
                                <div>
                                  <div className="text-[11px] font-black text-[#394150]">{account.email}</div>
                                  <div className="text-[9px] font-bold text-[#45b978]">{account.status}</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeProfileEmailAccount(account.id)}
                                  className="h-8 px-3 rounded-full border border-red-200 text-red-500 text-[9.5px] font-black hover:bg-red-50"
                                >
                                  Kaldır
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-[210px] flex flex-col items-center justify-center text-center">
                            <div className="w-[108px] h-[74px] rounded-[6px] bg-[#f4f7fb] border border-[#edf0f4] flex items-center justify-center text-[36px]">
                              ✉
                            </div>
                            <div className="mt-4 text-[10.5px] font-semibold text-[#475467]">
                              Henüz hiçbir e-posta hesabınız bağlanmadı.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeProfileTab === 'Özelleştirmeler' && (
                    <div>
                      <div className="text-[14px] font-black text-current mb-5">Özelleştirmeler</div>

                      <div className="flex items-center justify-between border-b border-[#edf0f4] pb-5">
                        <div>
                          <div className="text-[12px] font-black text-current">Uygulama Teması</div>
                          <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">Tema tercihini kaydeder.</div>
                        </div>

                        <div className="h-9 rounded-full bg-[#e5e7eb] p-0.5 flex">
                          {['Açık Mod', 'Koyu Mod', 'Sistem Varsayılanı'].map((theme) => (
                            <button
                              key={theme}
                              type="button"
                              onClick={() => {
                                const nextProfileDraft = { ...profileDraft, theme };
                                setProfileDraft((prev) => ({ ...prev, theme }));
                                saveProfileSection({ profileDraft: nextProfileDraft });
                              }}
                              className={`h-8 px-4 rounded-full text-[10px] font-black ${profileDraft.theme === theme ? 'bg-[#45b978] text-white' : 'text-[#6b7280]'}`}
                            >
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-5">
                        <div className="text-[12px] font-black text-current">Navigasyon Rengi</div>
                        <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">
                          Bu seçim şimdilik profil tercihi olarak kaydedilir; sistem rengini değiştirmez.
                        </div>

                        <div className="mt-4 grid grid-cols-5 gap-3">
                          {[
                            ['Gece Siyahı', '#1f2937'],
                            ['Kadife Üzüm', '#6d2556'],
                            ['Kızıl Tuğla', '#7c2d2d'],
                            ['Yakut Alevi', '#be123c'],
                            ['Orman Yosunu', '#486b55'],
                            ['Cubicl Mavisi', '#2f66cf'],
                            ['Çelik Mavi', '#536b7b'],
                            ['Derin Deniz', '#27706c'],
                            ['Kehribar Işığı', '#c26b23'],
                            ['Kurşun Gri', '#4b5563']
                          ].map(([name, color]) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => {
                                const nextProfileDraft = { ...profileDraft, color: name };
                                setProfileDraft((prev) => ({ ...prev, color: name }));
                                saveProfileSection({ profileDraft: nextProfileDraft });
                              }}
                              className={`h-8 rounded-full border px-3 flex items-center gap-2 text-[10px] font-bold ${
                                profileDraft.color === name ? 'border-[#2f66cf] text-[#2f66cf]' : 'border-[#d7dce5] text-[#394150]'
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                                    {/* zrc-v523-block-activeprofiletab-veri-yonetimi */}
                  <ZRCAppShellActiveProfileTabVeriYonetimiBlock
                    currentAccountType={typeof currentAccountType !== 'undefined' ? currentAccountType : undefined}
                    activeProfileTab={typeof activeProfileTab !== 'undefined' ? activeProfileTab : undefined}
                    Veri={typeof Veri !== 'undefined' ? Veri : undefined}
                    flex={typeof flex !== 'undefined' ? flex : undefined}
                    items={typeof items !== 'undefined' ? items : undefined}
                    start={typeof start !== 'undefined' ? start : undefined}
                    justify={typeof justify !== 'undefined' ? justify : undefined}
                    between={typeof between !== 'undefined' ? between : undefined}
                    gap={typeof gap !== 'undefined' ? gap : undefined}
                    mb={typeof mb !== 'undefined' ? mb : undefined}
                    text={typeof text !== 'undefined' ? text : undefined}
                    font={typeof font !== 'undefined' ? font : undefined}
                    black={typeof black !== 'undefined' ? black : undefined}
                    current={typeof current !== 'undefined' ? current : undefined}
                    mt={typeof mt !== 'undefined' ? mt : undefined}
                    semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                    leading={typeof leading !== 'undefined' ? leading : undefined}
                    Proje={typeof Proje !== 'undefined' ? Proje : undefined}
                    ekip={typeof ekip !== 'undefined' ? ekip : undefined}
                    ve={typeof ve !== 'undefined' ? ve : undefined}
                    bildirim={typeof bildirim !== 'undefined' ? bildirim : undefined}
                    verilerini={typeof verilerini !== 'undefined' ? verilerini : undefined}
                    yedekle={typeof yedekle !== 'undefined' ? yedekle : undefined}
                    veya={typeof veya !== 'undefined' ? veya : undefined}
                    geri={typeof geri !== 'undefined' ? geri : undefined}
                    h={typeof h !== 'undefined' ? h : undefined}
                    px={typeof px !== 'undefined' ? px : undefined}
                    rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                    full={typeof full !== 'undefined' ? full : undefined}
                    bg={typeof bg !== 'undefined' ? bg : undefined}
                    f6f7fb={typeof f6f7fb !== 'undefined' ? f6f7fb : undefined}
                    border={typeof border !== 'undefined' ? border : undefined}
                    e5e8ee={typeof e5e8ee !== 'undefined' ? e5e8ee : undefined}
                    center={typeof center !== 'undefined' ? center : undefined}
                    shrink={typeof shrink !== 'undefined' ? shrink : undefined}
                    v={typeof v !== 'undefined' ? v : undefined}
                    APP_DATA_VERSION={typeof APP_DATA_VERSION !== 'undefined' ? APP_DATA_VERSION : undefined}
                    grid={typeof grid !== 'undefined' ? grid : undefined}
                    dataManagementStats={typeof dataManagementStats !== 'undefined' ? dataManagementStats : undefined}
                    data={typeof data !== 'undefined' ? data : undefined}
                    management={typeof management !== 'undefined' ? management : undefined}
                    edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                    fafbfc={typeof fafbfc !== 'undefined' ? fafbfc : undefined}
                    py={typeof py !== 'undefined' ? py : undefined}
                    uppercase={typeof uppercase !== 'undefined' ? uppercase : undefined}
                    tracking={typeof tracking !== 'undefined' ? tracking : undefined}
                    Supabase={typeof Supabase !== 'undefined' ? Supabase : undefined}
                    Kontrol={typeof Kontrol !== 'undefined' ? Kontrol : undefined}
                    Merkezi={typeof Merkezi !== 'undefined' ? Merkezi : undefined}
                    Storage={typeof Storage !== 'undefined' ? Storage : undefined}
                    manuel={typeof manuel !== 'undefined' ? manuel : undefined}
                    senkronu={typeof senkronu !== 'undefined' ? senkronu : undefined}
                    tek={typeof tek !== 'undefined' ? tek : undefined}
                    yerden={typeof yerden !== 'undefined' ? yerden : undefined}
                    kontrol={typeof kontrol !== 'undefined' ? kontrol : undefined}
                    et={typeof et !== 'undefined' ? et : undefined}
                    wrap={typeof wrap !== 'undefined' ? wrap : undefined}
                    end={typeof end !== 'undefined' ? end : undefined}
                    runSupabaseHealthCheck={typeof runSupabaseHealthCheck !== 'undefined' ? runSupabaseHealthCheck : undefined}
                    supabaseHealthLoading={typeof supabaseHealthLoading !== 'undefined' ? supabaseHealthLoading : undefined}
                    supabaseBackupLoading={typeof supabaseBackupLoading !== 'undefined' ? supabaseBackupLoading : undefined}
                    white={typeof white !== 'undefined' ? white : undefined}
                    cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                    not={typeof not !== 'undefined' ? not : undefined}
                    allowed={typeof allowed !== 'undefined' ? allowed : undefined}
                    transition={typeof transition !== 'undefined' ? transition : undefined}
                    all={typeof all !== 'undefined' ? all : undefined}
                    runFullSupabaseRefresh={typeof runFullSupabaseRefresh !== 'undefined' ? runFullSupabaseRefresh : undefined}
                    ff3600={typeof ff3600 !== 'undefined' ? ff3600 : undefined}
                    Yenile={typeof Yenile !== 'undefined' ? Yenile : undefined}
                    downloadSupabaseBackupSnapshot={typeof downloadSupabaseBackupSnapshot !== 'undefined' ? downloadSupabaseBackupSnapshot : undefined}
                    Yedek={typeof Yedek !== 'undefined' ? Yedek : undefined}
                    copySupabaseBackupSnapshot={typeof copySupabaseBackupSnapshot !== 'undefined' ? copySupabaseBackupSnapshot : undefined}
                    dfe4ec={typeof dfe4ec !== 'undefined' ? dfe4ec : undefined}
                    b7d4ff={typeof b7d4ff !== 'undefined' ? b7d4ff : undefined}
                    Kopyala={typeof Kopyala !== 'undefined' ? Kopyala : undefined}
                    migrateLocalDataToSupabase={typeof migrateLocalDataToSupabase !== 'undefined' ? migrateLocalDataToSupabase : undefined}
                    eef6ff={typeof eef6ff !== 'undefined' ? eef6ff : undefined}
                    cfe4ff={typeof cfe4ff !== 'undefined' ? cfe4ff : undefined}
                    Yereli={typeof Yereli !== 'undefined' ? Yereli : undefined}
                    e={typeof e !== 'undefined' ? e : undefined}
                    Aktar={typeof Aktar !== 'undefined' ? Aktar : undefined}
                    handleInstallPwa={typeof handleInstallPwa !== 'undefined' ? handleInstallPwa : undefined}
                    Telefon={typeof Telefon !== 'undefined' ? Telefon : undefined}
                    bilgisayara={typeof bilgisayara !== 'undefined' ? bilgisayara : undefined}
                    uygulama={typeof uygulama !== 'undefined' ? uygulama : undefined}
                    gibi={typeof gibi !== 'undefined' ? gibi : undefined}
                    kur={typeof kur !== 'undefined' ? kur : undefined}
                    pwaInstallStatus={typeof pwaInstallStatus !== 'undefined' ? pwaInstallStatus : undefined}
                    installed={typeof installed !== 'undefined' ? installed : undefined}
                    Kurulu={typeof Kurulu !== 'undefined' ? Kurulu : undefined}
                    isIosDevice={typeof isIosDevice !== 'undefined' ? isIosDevice : undefined}
                    iPhone={typeof iPhone !== 'undefined' ? iPhone : undefined}
                    Kurulum={typeof Kurulum !== 'undefined' ? Kurulum : undefined}
                    Mobil={typeof Mobil !== 'undefined' ? Mobil : undefined}
                    getSupabaseHealthSummary={typeof getSupabaseHealthSummary !== 'undefined' ? getSupabaseHealthSummary : undefined}
                    Son={typeof Son !== 'undefined' ? Son : undefined}
                    toplu={typeof toplu !== 'undefined' ? toplu : undefined}
                    supabaseLastFullRefreshAt={typeof supabaseLastFullRefreshAt !== 'undefined' ? supabaseLastFullRefreshAt : undefined}
                    TR={typeof TR !== 'undefined' ? TR : undefined}
                    yok={typeof yok !== 'undefined' ? yok : undefined}
                    supabaseLastBackupAt={typeof supabaseLastBackupAt !== 'undefined' ? supabaseLastBackupAt : undefined}
                    profilePreferences={typeof profilePreferences !== 'undefined' ? profilePreferences : undefined}
                    Yerel={typeof Yerel !== 'undefined' ? Yerel : undefined}
                    verisini={typeof verisini !== 'undefined' ? verisini : undefined}
                    getSupabaseRealtimeClass={typeof getSupabaseRealtimeClass !== 'undefined' ? getSupabaseRealtimeClass : undefined}
                    supabaseRealtimeStatus={typeof supabaseRealtimeStatus !== 'undefined' ? supabaseRealtimeStatus : undefined}
                    supabaseLastRealtimeAt={typeof supabaseLastRealtimeAt !== 'undefined' ? supabaseLastRealtimeAt : undefined}
                    getPwaInstallClass={typeof getPwaInstallClass !== 'undefined' ? getPwaInstallClass : undefined}
                    PWA={typeof PWA !== 'undefined' ? PWA : undefined}
                    kurulum={typeof kurulum !== 'undefined' ? kurulum : undefined}
                    durumu={typeof durumu !== 'undefined' ? durumu : undefined}
                    supabaseHealthReport={typeof supabaseHealthReport !== 'undefined' ? supabaseHealthReport : undefined}
                    getSupabaseHealthStateClass={typeof getSupabaseHealthStateClass !== 'undefined' ? getSupabaseHealthStateClass : undefined}
                    bold={typeof bold !== 'undefined' ? bold : undefined}
                    truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                    Detay={typeof Detay !== 'undefined' ? Detay : undefined}
                    Yedekleme={typeof Yedekleme !== 'undefined' ? Yedekleme : undefined}
                    Mevcut={typeof Mevcut !== 'undefined' ? Mevcut : undefined}
                    olarak={typeof olarak !== 'undefined' ? olarak : undefined}
                    indir={typeof indir !== 'undefined' ? indir : undefined}
                    panoya={typeof panoya !== 'undefined' ? panoya : undefined}
                    kopyala={typeof kopyala !== 'undefined' ? kopyala : undefined}
                    downloadCurrentDataSnapshot={typeof downloadCurrentDataSnapshot !== 'undefined' ? downloadCurrentDataSnapshot : undefined}
                    copyCurrentDataSnapshot={typeof copyCurrentDataSnapshot !== 'undefined' ? copyCurrentDataSnapshot : undefined}
                    Veriyi={typeof Veriyi !== 'undefined' ? Veriyi : undefined}
                    Geri={typeof Geri !== 'undefined' ? Geri : undefined}
                    Daha={typeof Daha !== 'undefined' ? Daha : undefined}
                    indirilen={typeof indirilen !== 'undefined' ? indirilen : undefined}
                    mevcut={typeof mevcut !== 'undefined' ? mevcut : undefined}
                    verinin={typeof verinin !== 'undefined' ? verinin : undefined}
                    yazar={typeof yazar !== 'undefined' ? yazar : undefined}
                    ref={typeof ref !== 'undefined' ? ref : undefined}
                    dataImportInputRef={typeof dataImportInputRef !== 'undefined' ? dataImportInputRef : undefined}
                    file={typeof file !== 'undefined' ? file : undefined}
                    accept={typeof accept !== 'undefined' ? accept : undefined}
                    application={typeof application !== 'undefined' ? application : undefined}
                    json={typeof json !== 'undefined' ? json : undefined}
                    handleDataImportFile={typeof handleDataImportFile !== 'undefined' ? handleDataImportFile : undefined}
                    hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                    red={typeof red !== 'undefined' ? red : undefined}
                    Tehlikeli={typeof Tehlikeli !== 'undefined' ? Tehlikeli : undefined}
                    veriyi={typeof veriyi !== 'undefined' ? veriyi : undefined}
                    proje={typeof proje !== 'undefined' ? proje : undefined}
                    temizler={typeof temizler !== 'undefined' ? temizler : undefined}
                    resetLocalApplicationData={typeof resetLocalApplicationData !== 'undefined' ? resetLocalApplicationData : undefined}
                    Patron={typeof Patron !== 'undefined' ? Patron : undefined}
                    amber={typeof amber !== 'undefined' ? amber : undefined}
                    sadece={typeof sadece !== 'undefined' ? sadece : undefined}
                    aktiftir={typeof aktiftir !== 'undefined' ? aktiftir : undefined}
                  />

                  {activeProfileTab === 'Oturumlar' && (
                    <div>
                      <div className="text-[14px] font-black text-current mb-4">Aktif Oturumlar</div>

                      <div className="overflow-hidden border border-[#edf0f4] rounded-[6px]">
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_150px] h-9 bg-[#fafbfc] border-b border-[#edf0f4] items-center px-3 text-[10px] font-black text-[#6b7280]">
                          <div>Cihaz Tipi</div>
                          <div>İşletim Sistemi</div>
                          <div>Tarayıcı</div>
                          <div>Giriş Tarihi</div>
                          <div>Konum</div>
                          <div></div>
                        </div>

                        {profilePreferences.sessions.length > 0 ? (
                          profilePreferences.sessions.map((session) => (
                            <div key={session.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_150px] h-11 border-b last:border-b-0 border-[#edf0f4] items-center px-3 text-[10px] font-semibold text-[#394150]">
                              <div>▱ {session.device}</div>
                              <div>{session.os}</div>
                              <div>{session.browser}</div>
                              <div>{session.date}</div>
                              <div>{session.location}</div>
                              <button
                                type="button"
                                onClick={() => removeProfileSession(session.id)}
                                className="h-8 px-3 rounded-full bg-red-600 text-white text-[9px] font-black"
                              >
                                Oturumu Sonlandır
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="h-16 flex items-center justify-center text-[10.5px] font-bold text-[#9aa3b1]">
                            Aktif oturum yok.
                          </div>
                        )}
                      </div>

                      <div className="text-[14px] font-black text-current mt-7 mb-4">Son 2 Ay İçindeki Şüpheli Etkinlikler</div>

                      <div className="overflow-hidden border border-[#edf0f4] rounded-[6px]">
                        {profilePreferences.suspiciousEvents.length > 0 ? (
                          profilePreferences.suspiciousEvents.map((event) => (
                            <div key={event.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_150px] h-11 border-b last:border-b-0 border-[#edf0f4] items-center px-3 text-[10px] font-semibold text-[#394150]">
                              <div>▱ {event.device}</div>
                              <div>{event.os}</div>
                              <div>{event.browser}</div>
                              <div>{event.date}</div>
                              <div>{event.location}</div>
                              <div>{event.event}</div>
                              <button
                                type="button"
                                onClick={() => markSuspiciousEventAsMine(event.id)}
                                className="h-8 px-3 rounded-full bg-[#55ace8] text-white text-[9px] font-black"
                              >
                                Etkinlik Bana Ait
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="h-16 flex items-center justify-center text-[10.5px] font-bold text-[#9aa3b1]">
                            Şüpheli etkinlik yok.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (activeContentMenu === 'Projeler' || activeContentMenu === 'Diğer') ? (
          selectedProject ? (
            <div className="zrc-project-board-page w-full h-full min-h-0 bg-white animate-fade-in flex flex-col flex-1 overflow-hidden">
                            {activeContentMenu === 'Projeler' && (
<div className="w-full px-7 flex items-end justify-center shrink-0 h-[56px] bg-white relative z-20 border-b border-[#f5f6f8]">
                <div className="flex items-end justify-center gap-1">
                  {visibleProjectTabs.map((tab) => {
                    const tabWidths = {
                      'Görevler': 'min-w-[86px]',
                      'Dosyalar': 'min-w-[94px]',
                      'Gantt Çizelgesi': 'min-w-[128px]',
                      'Zaman Çizelgesi': 'min-w-[138px]',
                      'Takvim': 'min-w-[82px]',
                      'Raporlar': 'min-w-[90px]',
                      'Ayarlar': 'min-w-[84px]'
                    };

                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${tabWidths[tab]} h-[36px] px-3.5 text-[12px] font-extrabold tracking-tight rounded-t-xl rounded-b-none focus:outline-none select-none transition-all border border-b-0 ${
                          activeTab === tab
                            ? 'bg-[#f5f6f8] text-[#ff3600] border-[#f5f6f8] border-b-[#f5f6f8] shadow-none'
                            : 'bg-white text-zinc-400 border-[#f5f6f8] hover:text-zinc-700 hover:bg-zinc-50 hover:border-[#f5f6f8]'
                        }`}
                      >
                        <span className="relative inline-flex items-center justify-center">
                          {tab}
                          {activeTab === tab && (
                            <span className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+5px)] w-1.5 h-1.5 rounded-full bg-[#ff3600]" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

              <div className="flex-1 min-h-0 bg-[#f5f6f8] flex flex-col overflow-hidden h-full">
                                {/* zrc-v521-feature-gorevler */}
                <GorevlerTabPanel ctx={zrcFeatureContext} />



                                {/* zrc-v521-feature-takvim */}
                <TakvimTabPanel ctx={zrcFeatureContext} />


                                {/* zrc-v521-feature-zaman_cizelgesi */}
                <ZamanCizelgesiTabPanel ctx={zrcFeatureContext} />

                                {/* zrc-v521-feature-dosyalar */}
                <DosyalarTabPanel ctx={zrcFeatureContext} />



                                {/* zrc-v521-feature-gantt_cizelgesi */}
                <GanttCizelgesiTabPanel ctx={zrcFeatureContext} />


                                {/* zrc-v521-feature-raporlar */}
                <RaporlarTabPanel ctx={zrcFeatureContext} />

                {activeContentMenu === 'Diğer' && activeTab === 'Ekip' && showTeamManagementPage && (
                  <div className="zrc-team-center-page w-full h-full overflow-y-auto custom-scrollbar bg-[#f5f6f8] animate-fade-in">
                    <div className="zrc-center-card max-w-[1180px] mx-auto px-8 py-7">
                      <div className="rounded-[22px] bg-white border border-zinc-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-6">
                          <div>
                            <div className="text-[10px] font-black tracking-[0.22em] uppercase text-[#ff3600]">Diğer / Ekip</div>
                            <h1 className="mt-1.5 text-[25px] font-black tracking-tight text-zinc-900">Ekip Yönetimi</h1>
                            <p className="mt-1.5 text-[11.5px] font-bold text-zinc-400 max-w-[520px]">
                              Görevlerde seçilecek kişileri buradan yönet. Pasif kişiler seçim listesinde görünmez.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-[86px] rounded-[14px] bg-[#fff3ef] border border-[#ff3600] p-3">
                              <div className="text-[21px] font-black text-[#ff3600]">{teamMembers.length}</div>
                              <div className="text-[9px] font-black text-white/80">Toplam</div>
                            </div>

                            <div className="w-[86px] rounded-[14px] bg-emerald-50 border border-emerald-100 p-3">
                              <div className="text-[21px] font-black text-emerald-600">{activeTeamMembers.length}</div>
                              <div className="text-[9px] font-black text-emerald-500/70">Aktif</div>
                            </div>

                            <div className="w-[86px] rounded-[14px] bg-zinc-50 border border-zinc-200 p-3">
                              <div className="text-[21px] font-black text-zinc-600">{passiveTeamMembers.length}</div>
                              <div className="text-[9px] font-black text-zinc-400">Pasif</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        {[
                          {
                            role: 'Yönetici',
                            desc: 'Projeler, kolonlar, görev silme, ekip ve müşteri yönetimi açık.',
                            active: currentUserRole === 'Yönetici'
                          },
                          {
                            role: 'Ekip Üyesi',
                            desc: 'Görev oluşturur/düzenler, dosya ekler, yorum ve yazışma kullanır.',
                            active: currentUserRole === 'Ekip Üyesi'
                          },
                          {
                            role: 'Müşteri/Misafir',
                            desc: 'Sadece görüntüleme, yorum ve yazışma odaklı sınırlı erişim.',
                            active: currentUserRole === 'Müşteri/Misafir'
                          }
                        ].map((item) => (
                          <div
                            key={item.role}
                            className={`rounded-[15px] border p-3 ${
                              item.active
                                ? 'bg-[#fff8f5] border-[#ff3600] shadow-sm'
                                : 'bg-white border-zinc-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={`h-6 px-2.5 rounded-full border text-[9px] font-black flex items-center ${getTeamRoleTone(item.role)}`}>
                                {item.role}
                              </span>
                              {item.active && (
                                <span className="text-[9px] font-black text-[#ff3600]">Aktif rolün</span>
                              )}
                            </div>
                            <p className="mt-2 text-[10px] font-bold text-zinc-400 leading-4">{item.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 grid grid-cols-[360px_minmax(0,1fr)] gap-5">
                        <form onSubmit={createTeamMemberFromCenter} className={`bg-white border border-zinc-200 rounded-[20px] p-5 shadow-sm h-fit ${!currentPermissions.manageTeam ? 'opacity-70' : ''}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="text-[15px] font-black text-zinc-800">Yeni Kişi</div>
                              <div className="mt-1 text-[10.5px] font-bold text-zinc-400">Kullanıcı adı ve şifre ile giriş hesabı oluştur</div>
                            </div>

                            <div className="w-11 h-11 rounded-[15px] bg-[#ff3600] text-white flex items-center justify-center">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {teamMemberDraft.role !== 'Müşteri/Misafir' ? (
                              <input
                                value={teamMemberDraft.name}
                                onChange={(event) => setTeamMemberDraft((prev) => ({
                                  ...prev,
                                  name: event.target.value,
                                  username: prev.username || normalizeCredentialText(event.target.value)
                                }))}
                                placeholder="Ad Soyad"
                                className="w-full h-11 rounded-[13px] border border-zinc-200 bg-zinc-50 px-4 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />
                            ) : (
                              <div className="rounded-[13px] border border-blue-100 bg-blue-50/55 px-3.5 py-3">
                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.08em]">Ad Soyad otomatik</div>
                                <div className="mt-1 text-[12px] font-black text-zinc-700">
                                  {getCustomerNameById(teamMemberDraft.customerId) || 'Aşağıdan müşteri seç'}
                                </div>
                                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                                  Müşteri/Misafir hesabında isim bağlı müşteri kartından alınır.
                                </div>
                              </div>
                            )}

                            {renderSoftSelect({
                              id: 'team-new-role',
                              value: teamMemberDraft.role,
                              options: teamRoleOptions,
                              onChange: (role) => setTeamMemberDraft((prev) => ({
                                ...prev,
                                role,
                                name: role === 'Müşteri/Misafir' ? '' : prev.name,
                                customerId: role === 'Müşteri/Misafir' ? prev.customerId : ''
                              })),
                              buttonClassName: 'h-11 rounded-[13px] bg-zinc-50 border border-zinc-200 px-4 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-[#ff3600]'
                            })}

                            {teamMemberDraft.role === 'Müşteri/Misafir' && renderSoftSelect({
                              id: 'team-new-customer-link',
                              label: 'Bağlı Müşteri',
                              value: getCustomerNameById(teamMemberDraft.customerId) || customerLinkNoneLabel,
                              options: customerLinkOptions,
                              onChange: (customerName) => {
                                const selectedCustomerId = customerName === customerLinkNoneLabel ? '' : getCustomerIdByName(customerName);
                                const selectedCustomer = getCustomerById(selectedCustomerId);

                                setTeamMemberDraft((prev) => ({
                                  ...prev,
                                  customerId: selectedCustomerId,
                                  username: prev.username || normalizeCredentialText(selectedCustomer?.name || '')
                                }));
                              },
                              buttonClassName: 'h-11 rounded-[13px] bg-zinc-50 border border-zinc-200 px-4 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-[#ff3600]'
                            })}

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                value={teamMemberDraft.username}
                                onChange={(event) => setTeamMemberDraft((prev) => ({ ...prev, username: normalizeCredentialText(event.target.value) }))}
                                placeholder="Kullanıcı adı"
                                className="w-full h-11 rounded-[13px] border border-zinc-200 bg-zinc-50 px-4 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />

                              <input
                                value={teamMemberDraft.password}
                                onChange={(event) => setTeamMemberDraft((prev) => ({ ...prev, password: event.target.value }))}
                                placeholder="Şifre"
                                className="w-full h-11 rounded-[13px] border border-zinc-200 bg-zinc-50 px-4 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="mt-4 w-full h-11 rounded-[13px] bg-[#ff3600] text-white text-[12px] font-black hover:bg-[#e03000] active:scale-[0.98] transition-all shadow-sm"
                          >
                            {currentPermissions.manageTeam ? 'Kişiyi Ekle' : 'Sadece Yönetici Ekleyebilir'}
                          </button>
                        </form>

                        <div className="bg-white border border-zinc-200 rounded-[18px] shadow-sm overflow-hidden">
                          <div className="h-12 px-4 border-b border-zinc-100 flex items-center justify-between">
                            <div>
                              <div className="text-[13.5px] font-black text-zinc-800">Ekip Listesi</div>
                              <div className="mt-0.5 text-[9.5px] font-bold text-zinc-400">Seç, düzenle veya durum değiştir</div>
                            </div>

                            <span className="h-6 px-2.5 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400 flex items-center">
                              {teamMembers.length} kişi
                            </span>
                          </div>

                          <div className="p-2.5 space-y-1 max-h-[calc(100vh-330px)] min-h-[360px] overflow-y-auto custom-scrollbar">
                            {teamMembers.length > 0 ? (
                              teamMembers.map((member) => {
                                const isPassive = member.status === 'Pasif';
                                const isPendingDelete = pendingTeamDeleteId === member.id;
                                const isSelected = selectedTeamMemberId === member.id;

                                return (
                                  <div
                                    key={member.id}
                                    onClick={() => setSelectedTeamMemberId(member.id)}
                                    className={`rounded-[10px] border transition-all cursor-pointer overflow-hidden ${
                                      isSelected
                                        ? 'bg-white border-zinc-300 shadow-[0_1px_0_rgba(15,23,42,0.03)]'
                                        : 'bg-white border-transparent hover:bg-zinc-50 hover:border-zinc-200'
                                    }`}
                                  >
                                    <div className="h-[46px] px-2.5 flex items-center gap-2.5">
                                      <div className={`w-7 h-7 rounded-[9px] text-white text-[8px] font-black flex items-center justify-center shrink-0 overflow-hidden ${
                                        isPassive ? 'bg-zinc-300' : 'bg-[#8c5220]'
                                      }`}>
                                        {renderProfileAvatar(member.avatar, createAvatarFromName(member.name))}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className={`text-[11.5px] font-black truncate ${isPassive ? 'text-zinc-400' : 'text-zinc-800'}`}>
                                          {normalizeTeamRole(member.role) === 'Müşteri/Misafir'
                                            ? getMemberLinkedCustomer(member)?.name || member.name
                                            : member.name}
                                        </div>
                                        <div className={`mt-0.5 inline-flex max-w-full h-5 px-2 rounded-full border text-[8px] font-black truncate ${getTeamRoleTone(member.role)}`}>
                                          {normalizeTeamRole(member.role)}
                                        </div>
                                      </div>

                                      <span className={`h-6 px-2 rounded-[8px] text-[8px] font-black border shrink-0 ${
                                        isPassive
                                          ? 'bg-zinc-50 border-zinc-200 text-zinc-400'
                                          : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                      }`}>
                                        {isPassive ? 'Pasif' : 'Aktif'}
                                      </span>

                                      <svg className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-zinc-500' : 'text-zinc-300'}`} fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>

                                    {isSelected && (
                                      <div className="h-[32px] px-2.5 border-t border-zinc-100 bg-zinc-50/60 flex items-center gap-2">
                                        <div className="min-w-0 flex-1 flex items-center gap-1.5 text-[8.5px] font-bold text-zinc-400">
                                          <span className="truncate">{member.email || 'E-posta yok'}</span>
                                          <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                                          <span className="truncate">@{member.username || createUsernameFromMember(member)}</span>
                                          <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                                          <span className={`h-5 px-2 rounded-full border text-[8px] font-black flex items-center shrink-0 ${getTeamRoleTone(member.role)}`}>
                                            {getAccountTypeFromRole(member.role)}
                                          </span>
                                          {normalizeTeamRole(member.role) === 'Müşteri/Misafir' && (
                                            <>
                                              <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                                              <span className="truncate">
                                                {getCustomerNameById(member.customerId) || getMemberLinkedCustomer(member)?.name || 'Müşteri bağlı değil'}
                                              </span>
                                            </>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                          <button
                                            type="button"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              copyCredentialTextForMember(member);
                                            }}
                                            className="h-6 px-2.5 rounded-[8px] bg-[#ff3600] border border-[#ff3600] text-white hover:bg-[#ff3600] hover:text-white text-[8px] font-black transition-all"
                                          >
                                            Giriş Bilgisi
                                          </button>

                                          <button
                                            type="button"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              openTeamMemberEditModal(member);
                                            }}
                                            className="h-6 px-2.5 rounded-[8px] bg-white border border-zinc-200 text-zinc-600 hover:text-blue-600 hover:border-blue-100 text-[8px] font-black transition-all"
                                          >
                                            Düzenle
                                          </button>

                                          <button
                                            type="button"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              toggleTeamMemberStatus(member.id);
                                            }}
                                            className="h-6 px-2.5 rounded-[8px] bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-800 text-[8px] font-black transition-all"
                                          >
                                            {isPassive ? 'Aktif Yap' : 'Pasif Yap'}
                                          </button>

                                          <button
                                            type="button"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              deleteTeamMemberFromCenter(member.id);
                                            }}
                                            className={`h-6 px-2.5 rounded-[8px] text-[8px] font-black border transition-all ${
                                              isPendingDelete
                                                ? 'bg-red-500 border-red-500 text-white'
                                                : 'bg-white border-zinc-200 text-zinc-500 hover:text-red-500 hover:border-red-100'
                                            }`}
                                          >
                                            {isPendingDelete ? 'Tekrar' : 'Sil'}
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="h-[250px] rounded-[16px] bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                                <div className="text-[13px] font-black text-zinc-700">Henüz kişi yok</div>
                                <div className="mt-1 text-[10.5px] font-bold text-zinc-400">Sol taraftaki formdan ekip üyesi ekle.</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeContentMenu === 'Diğer' && activeTab === 'Müşteriler' && showCustomerManagementPage && (
                  <div className="zrc-customer-center-page w-full h-full overflow-y-auto custom-scrollbar bg-[#f5f6f8] animate-fade-in">
                    <div className="zrc-center-card max-w-[1120px] mx-auto px-6 py-5">
                      <div className="rounded-[22px] bg-white border border-zinc-200 px-5 py-4 shadow-sm">
                        <div className="flex items-center justify-between gap-5">
                          <div>
                            <div className="text-[10px] font-black tracking-[0.22em] uppercase text-[#ff3600]">Diğer / Müşteriler</div>
                            <h1 className="mt-1 text-[24px] font-black tracking-tight text-zinc-900">Müşteri Yönetimi</h1>
                            <p className="mt-1 text-[11px] font-bold text-zinc-400">
                              Müşterileri ekle, durumlarını yönet ve görev bağlantılarını takip et.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-[86px] rounded-[13px] bg-zinc-950 text-white px-3 py-2.5">
                              <div className="text-[20px] font-black">{customers.length}</div>
                              <div className="text-[8.5px] font-black text-white/45">Kayıt</div>
                            </div>

                            <div className="w-[86px] rounded-[13px] bg-[#fff3ef] border border-[#ff3600] px-3 py-2.5">
                              <div className="text-[20px] font-black text-[#ff3600]">{customerPageItems.length}</div>
                              <div className="text-[8.5px] font-black text-white/80">Liste</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-[320px_minmax(0,1fr)] gap-4">
                        <div className="space-y-4">
                          <form onSubmit={createCustomerFromCenter} className="bg-white border border-zinc-200 rounded-[18px] p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-[13.5px] font-black text-zinc-800">Yeni Müşteri</div>
                                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">Müşteri kartı ve isteğe bağlı giriş hesabı oluştur</div>
                              </div>

                              <div className="w-9 h-9 rounded-[12px] bg-[#ff3600] text-white flex items-center justify-center">
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <input
                                value={customerDraft.name}
                                onChange={(event) => setCustomerDraft((prev) => ({ ...prev, name: event.target.value }))}
                                placeholder="Müşteri adı"
                                className="w-full h-9 rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />

                              <input
                                value={customerDraft.contact}
                                onChange={(event) => setCustomerDraft((prev) => ({ ...prev, contact: event.target.value }))}
                                placeholder="Yetkili kişi"
                                className="w-full h-9 rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />
                              <input
                                value={customerDraft.phone}
                                onChange={(event) => setCustomerDraft((prev) => ({ ...prev, phone: event.target.value }))}
                                placeholder="Telefon"
                                className="w-full h-9 rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  value={customerDraft.username}
                                  onChange={(event) => setCustomerDraft((prev) => ({ ...prev, username: normalizeCredentialText(event.target.value) }))}
                                  placeholder="Müşteri kullanıcı adı"
                                  className="h-9 rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                                />

                                <input
                                  value={customerDraft.password}
                                  onChange={(event) => setCustomerDraft((prev) => ({ ...prev, password: event.target.value }))}
                                  placeholder="Müşteri şifresi"
                                  className="h-9 rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                                />
                              </div>

                              <div className="rounded-[11px] border border-orange-100 bg-orange-50 px-3 py-2 text-[10px] font-bold text-orange-600 leading-4">
                                Kullanıcı adı ve şifre girersen bu müşteri için giriş hesabı da açılır.
                              </div>


                              
                              <textarea
                                value={customerDraft.note}
                                onChange={(event) => setCustomerDraft((prev) => ({ ...prev, note: event.target.value }))}
                                placeholder="Not"
                                rows={2}
                                className="w-full resize-none rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />
                            </div>

                            <button
                              type="submit"
                              className="mt-3 w-full h-9 rounded-[11px] bg-[#ff3600] text-white text-[11px] font-black hover:bg-[#e03000] active:scale-[0.98] transition-all shadow-sm"
                            >
                              Müşteri Ekle
                            </button>
                          </form>

                          {selectedCustomer && (
                            <div className="bg-white border border-zinc-200 rounded-[18px] p-4 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="text-[13.5px] font-black text-zinc-800">Seçili Müşteri</div>
                                <button
                                  type="button"
                                  onClick={() => copyCredentialTextForCustomer(selectedCustomer)}
                                  className="h-6 px-2.5 rounded-full bg-[#fff3ef] border border-[#ff3600] text-[9px] font-black text-[#ff3600] hover:bg-[#ff3600] hover:text-white transition-all"
                                >
                                  Giriş Bilgisi
                                </button>
                              </div>

                              <div className="mt-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[13px] bg-[#ff3600] text-white flex items-center justify-center text-[11px] font-black">
                                  {selectedCustomer.avatar || createAvatarFromName(selectedCustomer.name)}
                                </div>

                                <div className="min-w-0">
                                  <div className="text-[13px] font-black text-zinc-800 truncate">{selectedCustomer.name}</div>
                                  <div className="mt-0.5 text-[10px] font-bold text-zinc-400 truncate">
                                    {selectedCustomer.contact || 'Yetkili yok'}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 space-y-1.5 text-[10.5px] font-bold">

                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-zinc-400">Telefon</span>
                                  <span className="text-zinc-700 truncate">{selectedCustomer.phone || '-'}</span>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-3 gap-2">
                                <div className="rounded-[10px] bg-zinc-50 border border-zinc-100 p-2">
                                  <div className="text-[14px] font-black text-zinc-800">{selectedCustomer.taskStats?.total || 0}</div>
                                  <div className="text-[8px] font-black text-zinc-400">Görev</div>
                                </div>

                                <div className="rounded-[10px] bg-blue-50 border border-blue-100 p-2">
                                  <div className="text-[14px] font-black text-blue-600">{selectedCustomer.taskStats?.active || 0}</div>
                                  <div className="text-[8px] font-black text-blue-400">Açık</div>
                                </div>

                                <div className="rounded-[10px] bg-emerald-50 border border-emerald-100 p-2">
                                  <div className="text-[14px] font-black text-emerald-600">{selectedCustomer.taskStats?.completed || 0}</div>
                                  <div className="text-[8px] font-black text-emerald-500/70">Biten</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-[18px] shadow-sm overflow-hidden">
                          <div className="h-11 px-4 border-b border-zinc-100 flex items-center justify-between">
                            <div>
                              <div className="text-[13px] font-black text-zinc-800">Müşteri Listesi</div>
                              <div className="mt-0.5 text-[9px] font-bold text-zinc-400">Seç, düzenle veya sil</div>
                            </div>

                            <span className="h-6 px-2.5 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400 flex items-center">
                              {customerPageItems.length} kayıt
                            </span>
                          </div>

                          <div className="p-2.5 space-y-1 max-h-[calc(100vh-325px)] min-h-[360px] overflow-y-auto custom-scrollbar">
                            {customerPageItems.length > 0 ? (
                              customerPageItems.map((customer) => {
                                const isPendingDelete = pendingCustomerDeleteId === customer.id;
                                const isSelected = selectedCustomer?.id === customer.id;
                                const isAutoCustomer = customer.source === 'task';

                                return (
                                  <div
                                    key={customer.id}
                                    onClick={() => setSelectedCustomerId(customer.id)}
                                    className={`rounded-[10px] border transition-all cursor-pointer overflow-hidden ${
                                      isSelected
                                        ? 'bg-white border-zinc-300 shadow-[0_1px_0_rgba(15,23,42,0.03)]'
                                        : 'bg-white border-transparent hover:bg-zinc-50 hover:border-zinc-200'
                                    }`}
                                  >
                                    <div className="h-[46px] px-2.5 flex items-center gap-2.5">
                                      <div className="w-7 h-7 rounded-[9px] bg-zinc-100 text-zinc-600 text-[8px] font-black flex items-center justify-center shrink-0">
                                        {customer.avatar || createAvatarFromName(customer.name)}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className="text-[11.5px] font-black text-zinc-800 truncate">
                                          {customer.name}
                                        </div>
                                        <div className="mt-0.5 text-[8.5px] font-bold text-zinc-400 truncate">
                                          {customer.contact || customer.email || customer.phone || 'İletişim yok'}
                                        </div>
                                      </div>

                                      <div className="hidden xl:flex items-center gap-1 text-[9px] font-black text-zinc-400 shrink-0">
                                        <span>{customer.taskStats?.total || 0}</span>
                                        <span className="text-zinc-200">/</span>
                                        <span>{customer.taskStats?.active || 0}</span>
                                        <span className="text-zinc-200">/</span>
                                        <span>{customer.taskStats?.completed || 0}</span>
                                      </div>

                                      {customer.taskStats?.overdue > 0 && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" title={`${customer.taskStats.overdue} geciken`} />
                                      )}

                                      <svg className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-zinc-500' : 'text-zinc-300'}`} fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>

                                    {isSelected && (
                                      <div className="h-[32px] px-2.5 border-t border-zinc-100 bg-zinc-50/60 flex items-center gap-2">
                                        <div className="min-w-0 flex-1 flex items-center gap-1.5 text-[8.5px] font-bold text-zinc-400">
                                          <span className="truncate">{customer.phone || 'Telefon yok'}</span>
                                          <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                                          <span className="truncate">
                                            {getCustomerLinkedAccount(customer)?.username ? `@${getCustomerLinkedAccount(customer)?.username}` : 'Kullanıcı adı yok'}
                                          </span>
                                        </div>

                                        {isAutoCustomer ? (
                                          <span className="h-6 px-2 rounded-[8px] bg-white border border-zinc-100 text-zinc-400 text-[8px] font-black shrink-0 flex items-center">
                                            Otomatik
                                          </span>
                                        ) : (
                                          <div className="flex items-center gap-1 shrink-0">
                                            <button
                                              type="button"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                copyCredentialTextForCustomer(customer);
                                              }}
                                              className="h-6 px-2.5 rounded-[8px] bg-[#ff3600] border border-[#ff3600] text-white hover:bg-[#ff3600] hover:text-white text-[8px] font-black transition-all"
                                            >
                                              Giriş Bilgisi
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                openCustomerEditModal(customer);
                                              }}
                                              className="h-6 px-2.5 rounded-[8px] bg-white border border-zinc-200 text-zinc-600 hover:text-blue-600 hover:border-blue-100 text-[8px] font-black transition-all"
                                            >
                                              Düzenle
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                deleteCustomerFromCenter(customer.id);
                                              }}
                                              className={`h-6 px-2.5 rounded-[8px] text-[8px] font-black border transition-all ${
                                                isPendingDelete
                                                  ? 'bg-red-500 border-red-500 text-white'
                                                  : 'bg-white border-zinc-200 text-zinc-500 hover:text-red-500 hover:border-red-100'
                                              }`}
                                            >
                                              {isPendingDelete ? 'Tekrar' : 'Sil'}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="h-[250px] rounded-[16px] bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                                <div className="text-[13px] font-black text-zinc-700">Henüz müşteri yok</div>
                                <div className="mt-1 text-[10.5px] font-bold text-zinc-400">Sol taraftaki formdan müşteri ekle.</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Ayarlar' && showProjectSettingsControls && (
                  <div className="w-full flex-1 bg-[#f5f6f8] overflow-y-auto custom-scrollbar animate-fade-in">
                    <div className="max-w-[980px] mx-auto px-7 py-7">
                      <div className="bg-white border border-zinc-200/70 rounded-[16px] shadow-[0_10px_32px_rgba(15,23,42,0.045)] overflow-hidden">
                        <div className="h-[70px] px-6 border-b border-zinc-100 flex items-center justify-between">
                          <div>
                            <h3 className="text-[15px] font-black text-zinc-800 tracking-tight">Proje Ayarları</h3>
                            <p className="mt-0.5 text-[11px] font-bold text-zinc-400">Seçili projenin temel bilgilerini düzenle.</p>
                          </div>

                          <div
                            className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white shadow-sm"
                            style={{ backgroundColor: projectSettingsDraft.color || '#ff3600' }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5M6 5.25h12A2.25 2.25 0 0120.25 7.5v9A2.25 2.25 0 0118 18.75H6A2.25 2.25 0 013.75 16.5v-9A2.25 2.25 0 016 5.25z" />
                            </svg>
                          </div>
                        </div>

                        <div className="p-6 grid grid-cols-[1fr_280px] gap-6">
                          <div className="space-y-2.5">
                            <label className="block">
                              <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-1.5">Proje Adı</span>
                              <input
                                value={projectSettingsDraft.title}
                                onChange={(event) => setProjectSettingsDraft((prevDraft) => ({ ...prevDraft, title: event.target.value }))}
                                className="w-full h-10 rounded-[9px] bg-zinc-50 border border-zinc-200 px-3 text-[12.5px] font-bold text-zinc-700 focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 transition-all"
                              />
                            </label>

                            <label className="block">
                              <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-1.5">Açıklama</span>
                              <textarea
                                value={projectSettingsDraft.description}
                                onChange={(event) => setProjectSettingsDraft((prevDraft) => ({ ...prevDraft, description: event.target.value }))}
                                placeholder="Bu proje hakkında kısa açıklama..."
                                className="w-full h-[92px] resize-none rounded-[9px] bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 text-[12px] font-medium text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 transition-all custom-scrollbar"
                              />
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                              {renderSoftSelect({
                                id: 'project-settings-customer',
                                label: 'Müşteri',
                                value: projectSettingsDraft.customer || 'Müşteri Yok',
                                options: ['Müşteri Yok', ...customers.map((customer) => customer.name)],
                                onChange: (customerName) => {
                                  const linkedCustomer = getCustomerByName(customerName);

                                  setProjectSettingsDraft((prevDraft) => ({
                                    ...prevDraft,
                                    customer: customerName === 'Müşteri Yok' ? '' : customerName,
                                    customerId: linkedCustomer?.id || ''
                                  }));
                                },
                                wrapperClassName: 'block',
                                buttonClassName: 'h-10 rounded-[9px] bg-zinc-50 border border-zinc-200 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-blue-300'
                              })}

                              {renderSoftSelect({
                                id: 'project-settings-status',
                                label: 'Durum',
                                value: projectSettingsDraft.status,
                                options: ['Aktif', 'Beklemede', 'Tamamlandı', 'Arşiv'],
                                onChange: (status) => setProjectSettingsDraft((prevDraft) => ({ ...prevDraft, status })),
                                wrapperClassName: 'block',
                                buttonClassName: 'h-10 rounded-[9px] bg-zinc-50 border border-zinc-200 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-blue-300'
                              })}
                            </div>

                            <div className="relative rounded-[13px] border border-zinc-200 bg-zinc-50/70 p-3">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em]">Proje Ekibi</div>
                                  <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                                    Kurucu hesap listelenmez; sadece projede çalışacak ekip üyeleri seçilir.
                                  </div>
                                </div>

                                <span className="h-6 px-2.5 rounded-full bg-white border border-zinc-200 text-[9px] font-black text-zinc-500">
                                  {selectedProjectTeamMembers.length} kişi
                                </span>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2 min-h-[38px] rounded-[10px] bg-white border border-zinc-200 px-2 py-2">
                                {selectedProjectTeamMembers.length > 0 ? (
                                  selectedProjectTeamMembers.map((member) => (
                                    <div
                                      key={`selected-project-member-${member.id}`}
                                      className="h-8 pl-1.5 pr-2 rounded-full bg-zinc-50 border border-zinc-200 flex items-center gap-2 shadow-[0_6px_14px_rgba(15,23,42,0.035)]"
                                    >
                                      <span className="w-6 h-6 rounded-full bg-zinc-800 text-white text-[8px] font-black flex items-center justify-center overflow-hidden shrink-0">
                                        {renderProfileAvatar(member.avatar, createAvatarFromName(member.name))}
                                      </span>
                                      <span className="text-[10px] font-black text-zinc-700 max-w-[130px] truncate">
                                        {member.name}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!currentPermissions.manageProjectSettings) return;

                                          setProjectSettingsDraft((prevDraft) => {
                                            const currentIds = Array.isArray(prevDraft.teamMemberIds) ? prevDraft.teamMemberIds.map(String) : [];

                                            return {
                                              ...prevDraft,
                                              teamMemberIds: currentIds.filter((id) => id !== String(member.id))
                                            };
                                          });
                                        }}
                                        disabled={!currentPermissions.manageProjectSettings}
                                        className="w-5 h-5 rounded-full bg-white text-zinc-400 hover:text-[#ff3600] hover:bg-[#fff3ef] flex items-center justify-center text-[13px] font-black transition-all disabled:opacity-40"
                                        title="Projeden çıkar"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <div className="h-8 px-2 flex items-center text-[10px] font-bold text-zinc-400">
                                    Henüz ekip üyesi eklenmedi.
                                  </div>
                                )}
                              </div>

                              <div className="mt-2 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!currentPermissions.manageProjectSettings) return;
                                    setIsProjectTeamPickerOpen(true);
                                  }}
                                  disabled={!currentPermissions.manageProjectSettings || availableProjectTeamMembers.length === 0}
                                  className={`h-7 px-3.5 rounded-[8px] text-[10px] font-black flex items-center justify-center gap-1.5 transition-all ${
                                    currentPermissions.manageProjectSettings && availableProjectTeamMembers.length > 0
                                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-[0_8px_16px_rgba(15,23,42,0.10)]'
                                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                  }`}
                                >
                                  <span className="text-[13px] leading-none">+</span>
                                  <span>{availableProjectTeamMembers.length > 0 ? 'Ekip Üyesi Ekle' : 'Eklenebilir üye yok'}</span>
                                </button>
                              </div>

                              {isProjectTeamPickerOpen && currentPermissions.manageProjectSettings && availableProjectTeamMembers.length > 0 &&
                                createPortal((
                                  <div
                                    className="fixed inset-0 z-[2147483000] flex items-center justify-center bg-slate-900/35 backdrop-blur-[3px]"
                                  onMouseDown={(event) => {
                                    if (event.target === event.currentTarget) {
                                      setIsProjectTeamPickerOpen(false);
                                    }
                                  }}
                                >
                                  <div
                                    className="w-[360px] max-w-[calc(100vw-32px)] rounded-[18px] border border-zinc-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] overflow-hidden"
                                    onMouseDown={(event) => event.stopPropagation()}
                                  >
                                    <div className="h-12 px-4 border-b border-zinc-100 bg-zinc-50/80 flex items-center justify-between gap-3">
                                      <div>
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.08em]">Ekip Üyesi Seç</div>
                                        <div className="mt-0.5 text-[8.5px] font-bold text-zinc-400">
                                          Zaten ekli olan kişiler listelenmez.
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => setIsProjectTeamPickerOpen(false)}
                                        className="w-7 h-7 rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 flex items-center justify-center text-[15px] font-black transition-all"
                                        title="Kapat"
                                      >
                                        ×
                                      </button>
                                    </div>

                                    <div className="max-h-[260px] overflow-y-auto custom-scrollbar p-2">
                                      {availableProjectTeamMembers.map((member) => (
                                        <button
                                          key={`available-project-member-${member.id}`}
                                          type="button"
                                          onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();

                                            setProjectSettingsDraft((prevDraft) => {
                                              const currentIds = Array.isArray(prevDraft.teamMemberIds) ? prevDraft.teamMemberIds.map(String) : [];
                                              const memberId = String(member.id);

                                              if (currentIds.includes(memberId)) return prevDraft;

                                              return {
                                                ...prevDraft,
                                                teamMemberIds: [...currentIds, memberId]
                                              };
                                            });

                                            setIsProjectTeamPickerOpen(false);
                                          }}
                                          className="w-full min-h-[46px] rounded-[13px] px-2.5 py-2 flex items-center gap-2.5 text-left hover:bg-zinc-50 active:bg-zinc-100 transition-all"
                                        >
                                          <span className="w-9 h-9 rounded-full bg-zinc-900 text-white text-[9px] font-black flex items-center justify-center overflow-hidden shrink-0">
                                            {renderProfileAvatar(member.avatar, createAvatarFromName(member.name))}
                                          </span>

                                          <span className="min-w-0 flex-1">
                                            <span className="block text-[11.5px] font-black text-zinc-700 truncate">{member.name}</span>
                                            <span className="block text-[8.5px] font-bold text-zinc-400 truncate">@{member.username || createUsernameFromMember(member)}</span>
                                          </span>

                                          <span className="w-7 h-7 rounded-full bg-[#fff3ef] text-[#ff3600] text-[16px] font-black flex items-center justify-center shrink-0">
                                            +
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  </div>
                                ),
                                  document.body
                                )}
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={handleArchiveProject}
                                className="h-9 px-4 rounded-full bg-white border border-orange-100 text-orange-500 hover:bg-orange-50 text-[11px] font-black transition-all"
                              >
                                Arşivle
                              </button>

                              <button
                                type="button"
                                onClick={handleDeleteProject}
                                className="h-9 px-4 rounded-full bg-white border border-red-100 text-red-500 hover:bg-red-50 text-[11px] font-black transition-all"
                              >
                                Sil
                              </button>

                              <button
                                type="button"
                                onClick={handleSaveProjectSettings}
                                className="h-9 px-5 rounded-full bg-[#2563eb] text-white text-[11px] font-black hover:bg-[#1d4ed8] shadow-[0_9px_20px_rgba(37,99,235,0.18)] transition-all"
                              >
                                Kaydet
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            <div className="rounded-[14px] border border-zinc-200 bg-zinc-50 p-4">
                              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-3">Proje Rengi</div>

                              <div className="flex items-center gap-2 flex-wrap">
                                {['#ff3600', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#0f172a', '#64748b'].map((color) => (
                                  <button
                                    key={color}
                                    type="button"
                                    onClick={() => setProjectSettingsDraft((prevDraft) => ({ ...prevDraft, color }))}
                                    className={`w-7 h-7 rounded-full border transition-all ${
                                      projectSettingsDraft.color === color
                                        ? 'border-zinc-900 ring-2 ring-zinc-900 scale-110'
                                        : 'border-white hover:scale-110 hover:ring-4 hover:ring-zinc-900/5'
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}

                                <input
                                  type="color"
                                  value={projectSettingsDraft.color}
                                  onChange={(event) => setProjectSettingsDraft((prevDraft) => ({ ...prevDraft, color: event.target.value }))}
                                  className="w-8 h-8 rounded-full border border-zinc-200 bg-white p-1 cursor-pointer"
                                />
                              </div>
                            </div>

                            <div className="rounded-[14px] border border-zinc-200 bg-white p-4">
                              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-3">Özet</div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-zinc-400">Kolon</span>
                                  <span className="text-zinc-700">{boardColumns.length}</span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-zinc-400">Aktif görev</span>
                                  <span className="text-zinc-700">{boardColumns.reduce((total, column) => total + column.tasks.length, 0)}</span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-zinc-400">Arşiv</span>
                                  <span className="text-zinc-700">{archivedTasks.length}</span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-zinc-400">Durum</span>
                                  <span className="text-zinc-700">{projectSettingsDraft.status}</span>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-[14px] border border-zinc-200 bg-white p-4">
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em]">Proje Geçmişi</div>
                                <span className="h-5 px-2 rounded-full bg-zinc-50 border border-zinc-100 text-[8px] font-black text-zinc-400">
                                  {(projectSettingsDraft.teamHistory || []).length}
                                </span>
                              </div>

                              <div className="space-y-2 max-h-[190px] overflow-y-auto custom-scrollbar pr-1">
                                {(projectSettingsDraft.teamHistory || []).length > 0 ? (
                                  (projectSettingsDraft.teamHistory || []).slice(0, 8).map((entry) => (
                                    <div key={entry.id} className="rounded-[11px] bg-zinc-50 border border-zinc-100 p-2.5">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className={`text-[9px] font-black ${
                                          entry.type === 'team-remove' ? 'text-red-500' : 'text-[#ff3600]'
                                        }`}>
                                          {entry.title}
                                        </div>
                                        <div className="text-[8px] font-black text-zinc-300">{entry.time}</div>
                                      </div>

                                      <div className="mt-1 text-[9.5px] font-bold text-zinc-500 leading-4">
                                        {entry.description}
                                      </div>

                                      <div className="mt-1 text-[8px] font-black text-zinc-300">
                                        {entry.actor || 'Sistem'} · {entry.date}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="h-16 rounded-[11px] bg-zinc-50 border border-dashed border-zinc-200 flex items-center justify-center text-[9.5px] font-black text-zinc-400">
                                    Henüz ekip geçmişi yok
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-center animate-fade-in p-8">
              <h2 className="text-[15px] font-black text-zinc-700 tracking-tight">Görüntülenecek Proje Seçilmedi</h2>
            </div>
          )
        ) : (
          <div className="w-full min-h-screen flex flex-col items-center justify-center text-center animate-fade-in p-8 bg-[#f5f6f8]">
            <h2 className="text-[15px] font-black text-zinc-700 tracking-tight select-none">Bu Sayfa Boş</h2>
          </div>
        )}

        {selectedTasks.length > 0 && currentPermissions.deleteTasks && boardView === 'Tüm Görevler' && activeContentMenu === 'Projeler' && (
          <div className="fixed bottom-6 right-6 bg-white border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-xl p-5 w-[380px] z-[90] animate-modal">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[13px] font-black text-zinc-800">{selectedTasks.length} Görev Seçildi</h4>

              <button onClick={() => setSelectedTasks([])} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                ×
              </button>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <button onClick={handleBulkArchive} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-3.5 py-1.5 rounded-md text-[10.5px] font-bold shadow-sm">
                Arşivle
              </button>

              <button onClick={handleBulkDelete} className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3.5 py-1.5 rounded-md text-[10.5px] font-bold shadow-sm">
                Sil
              </button>
            </div>
          </div>
        )}
      </main>

      {editingTeamMember && (
        <div
          className="fixed inset-0 z-[760] bg-zinc-950/25 backdrop-blur-[2px] flex items-center justify-center animate-fade-in"
          onClick={closeTeamMemberEditModal}
        >
          <form
            onSubmit={saveTeamMemberEdit}
            onClick={(event) => event.stopPropagation()}
            className="w-[460px] bg-white border border-zinc-200 rounded-[18px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-visible"
          >
            <div className="h-14 px-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-black text-zinc-800">Kişi Düzenle</div>
                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">Ekip üyesi bilgilerini güncelle</div>
              </div>

              <button
                type="button"
                onClick={closeTeamMemberEditModal}
                className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-white hover:text-zinc-900 transition-all flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-3">
              {teamMemberEditDraft.role !== 'Müşteri/Misafir' ? (
                <input
                  value={teamMemberEditDraft.name}
                  onChange={(event) => setTeamMemberEditDraft((prev) => ({
                    ...prev,
                    name: event.target.value,
                    username: prev.username || normalizeCredentialText(event.target.value)
                  }))}
                  placeholder="Ad Soyad"
                  className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                />
              ) : (
                <div className="rounded-[12px] border border-blue-100 bg-blue-50/55 px-3 py-2.5">
                  <div className="text-[9.5px] font-black text-blue-500 uppercase tracking-[0.08em]">Ad Soyad otomatik</div>
                  <div className="mt-1 text-[12px] font-black text-zinc-700">
                    {getCustomerNameById(teamMemberEditDraft.customerId) || 'Aşağıdan müşteri seç'}
                  </div>
                  <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                    İsim bağlı müşteri kartından güncellenir.
                  </div>
                </div>
              )}

              {renderSoftSelect({
                id: 'team-edit-role',
                value: teamMemberEditDraft.role,
                options: teamRoleOptions,
                onChange: (role) => setTeamMemberEditDraft((prev) => ({
                  ...prev,
                  role,
                  name: role === 'Müşteri/Misafir' ? '' : prev.name,
                  customerId: role === 'Müşteri/Misafir' ? prev.customerId : ''
                })),
                buttonClassName: 'h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-[#ff3600]'
              })}

              {teamMemberEditDraft.role === 'Müşteri/Misafir' && renderSoftSelect({
                id: 'team-edit-customer-link',
                label: 'Bağlı Müşteri',
                value: getCustomerNameById(teamMemberEditDraft.customerId) || customerLinkNoneLabel,
                options: customerLinkOptions,
                onChange: (customerName) => {
                  const selectedCustomerId = customerName === customerLinkNoneLabel ? '' : getCustomerIdByName(customerName);
                  const selectedCustomer = getCustomerById(selectedCustomerId);

                  setTeamMemberEditDraft((prev) => ({
                    ...prev,
                    customerId: selectedCustomerId,
                    username: prev.username || normalizeCredentialText(selectedCustomer?.name || ''),
                    email: prev.email || selectedCustomer?.email || ''
                  }));
                },
                buttonClassName: 'h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-[#ff3600]'
              })}

              <input
                value={teamMemberEditDraft.email}
                onChange={(event) => setTeamMemberEditDraft((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="E-posta"
                className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  value={teamMemberEditDraft.username}
                  onChange={(event) => setTeamMemberEditDraft((prev) => ({ ...prev, username: normalizeCredentialText(event.target.value) }))}
                  placeholder="Kullanıcı adı"
                  className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                />

                <input
                  value={teamMemberEditDraft.password}
                  onChange={(event) => setTeamMemberEditDraft((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Şifre"
                  className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                />
              </div>
            </div>

            <div className="h-14 px-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeTeamMemberEditModal}
                className="h-9 px-4 rounded-[11px] bg-white border border-zinc-200 text-[11px] font-black text-zinc-500 hover:text-zinc-800 transition-all"
              >
                İptal
              </button>

              <button
                type="submit"
                className="h-9 px-5 rounded-[11px] bg-[#ff3600] text-white text-[11px] font-black hover:bg-[#e03000] active:scale-[0.98] transition-all"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {editingCustomer && (
        <div
          className="fixed inset-0 z-[760] bg-zinc-950/25 backdrop-blur-[2px] flex items-center justify-center animate-fade-in"
          onClick={closeCustomerEditModal}
        >
          <form
            onSubmit={saveCustomerEdit}
            onClick={(event) => event.stopPropagation()}
            className="w-[430px] bg-white border border-zinc-200 rounded-[18px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-hidden"
          >
            <div className="h-14 px-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-black text-zinc-800">Müşteri Düzenle</div>
                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">Bilgileri güncelle</div>
              </div>

              <button
                type="button"
                onClick={closeCustomerEditModal}
                className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-white hover:text-zinc-900 transition-all flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-3">
              <input
                value={customerEditDraft.name}
                onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Müşteri adı"
                className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
              />

              <input
                value={customerEditDraft.contact}
                onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, contact: event.target.value }))}
                placeholder="Yetkili kişi"
                className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
              />
              <input
                value={customerEditDraft.phone}
                onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Telefon"
                className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
              />


              
              <textarea
                value={customerEditDraft.note}
                onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, note: event.target.value }))}
                placeholder="Not"
                rows={3}
                className="w-full resize-none rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
              />
            </div>

            <div className="h-14 px-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeCustomerEditModal}
                className="h-9 px-4 rounded-[11px] bg-white border border-zinc-200 text-[11px] font-black text-zinc-500 hover:text-zinc-800 transition-all"
              >
                İptal
              </button>

              <button
                type="submit"
                className="h-9 px-5 rounded-[11px] bg-[#ff3600] text-white text-[11px] font-black hover:bg-[#e03000] active:scale-[0.98] transition-all"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      <TaskDetailModal
        isOpen={Boolean(detailTaskInfo)}
        task={detailTaskInfo?.task}
        columnTitle={detailTaskInfo?.columnTitle}
        onClose={closeTaskDetail}
        onEdit={editTaskFromDetail}
        onUpdate={updateTaskFromDetail}
        onAddComment={addTaskComment}
        onDeleteComment={deleteTaskComment}
        canEditTask={Boolean(currentPermissions.editTasks && detailTaskInfo?.task && canCurrentUserModifyTask(detailTaskInfo.task, getProjectNameForTask(detailTaskInfo.task) || selectedProject))}
        canManageFiles={Boolean(currentPermissions.manageFiles && detailTaskInfo?.task && canCurrentUserModifyTask(detailTaskInfo.task, getProjectNameForTask(detailTaskInfo.task) || selectedProject))}
        canComment={Boolean(currentPermissions.comment && detailTaskInfo?.task && canCurrentUserModifyTask(detailTaskInfo.task, getProjectNameForTask(detailTaskInfo.task) || selectedProject))}
        currentAccountType={currentAccountType}
        currentActorId={currentActorId}
        currentActorName={currentActorName}
        currentActorAvatar={currentActorAvatar}
        onUploadFiles={uploadTaskFilesToSupabase}
        onDownloadFile={downloadTaskFileFromSupabase}
        onDeleteFile={deleteTaskStoredFileFromSupabase}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setCalendarNewTaskDate(null);
          setCalendarTaskModalContext({
            isOpen: false,
            pendingOpen: false,
            projectName: '',
            date: ''
          });
        }}
        onSave={handleSaveTask}
        initialData={editingTask}
        calendarDefaultDate={calendarNewTaskDate}
        projectName={calendarTaskModalContext.isOpen ? calendarTaskModalContext.projectName : selectedProject}
        projectOptions={visibleProjectNames}
        canChangeProject={Boolean(calendarTaskModalContext.isOpen && !editingTask)}
        onProjectChange={changeCalendarTaskModalProject}
        statusOptions={boardColumns.map((column) => ({
          label: column.title,
          bg: column.color,
          text: getReadableColumnColor(column.color)
        }))}
        teamMembers={taskModalTeamMembers}
        customers={currentAccountType === 'Müşteri' ? customers.filter((customer) => currentCustomerKeys.includes(normalizeCredentialText(customer.id)) || currentCustomerKeys.includes(normalizeCredentialText(customer.name))) : customers}
      />

      <StageModal
        isOpen={isStageModalOpen}
        onClose={() => {
          setIsStageModalOpen(false);
          setEditingColumn(null);
        }}
        onSave={handleSaveStage}
        columnData={editingColumn}
      />
    </div>
  );
}

function ZRCAppShell() {
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
