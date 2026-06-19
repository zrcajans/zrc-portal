import { getNotificationTone } from '../../utils/dashboardHelpers.js';




const ZRC_CLEARED_NOTIFICATION_IDS_KEY = 'zrcClearedNotificationIds';
const ZRC_CLEARED_NOTIFICATION_KEYS_KEY = 'zrcClearedNotificationKeys';
const ZRC_CLEARED_NOTIFICATION_TOKEN_PREFIX = 'cleared:';
const ZRC_CLEARED_NOTIFICATION_KEY_PREFIX = 'cleared-key:';
const ZRC_CLEARED_NOTIFICATION_BEFORE_PREFIX = 'cleared-before:';

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


const zrcBuildClearedNotificationState = (readNotificationIds = []) => {
  const ids = new Set(zrcReadJsonArray(ZRC_CLEARED_NOTIFICATION_IDS_KEY));
  const keys = new Set(zrcReadJsonArray(ZRC_CLEARED_NOTIFICATION_KEYS_KEY));

  for (const rawValue of readNotificationIds || []) {
    const value = String(rawValue || '');

    if (value.startsWith(ZRC_CLEARED_NOTIFICATION_TOKEN_PREFIX)) {
      const id = value.slice(ZRC_CLEARED_NOTIFICATION_TOKEN_PREFIX.length);
      if (id) ids.add(id);
    }

    if (value.startsWith(ZRC_CLEARED_NOTIFICATION_KEY_PREFIX)) {
      const key = value.slice(ZRC_CLEARED_NOTIFICATION_KEY_PREFIX.length);
      if (key) keys.add(key);
    }
  }

  return { ids, keys };
};


const zrcIsPushSubscriptionNotification = (notification = {}) => {
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

const zrcGetNotificationTimeMs = (notification = {}) => {
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

const zrcGetClearedBeforeMs = (readNotificationIds = []) => {
  let maxValue = 0;

  for (const rawValue of readNotificationIds || []) {
    const value = String(rawValue || '');
    if (!value.startsWith(ZRC_CLEARED_NOTIFICATION_BEFORE_PREFIX)) continue;

    const parsed = Date.parse(value.slice(ZRC_CLEARED_NOTIFICATION_BEFORE_PREFIX.length));
    if (Number.isFinite(parsed)) maxValue = Math.max(maxValue, parsed);
  }

  return maxValue;
};

const zrcIsNotificationCleared = (notification, readNotificationIds = []) => {
  if (zrcIsPushSubscriptionNotification(notification)) return true;

  const clearedBeforeMs = zrcGetClearedBeforeMs(readNotificationIds);
  const notificationTimeMs = zrcGetNotificationTimeMs(notification);

  if (clearedBeforeMs && notificationTimeMs && notificationTimeMs <= clearedBeforeMs) return true;

  // zrc-notification-panel-cleared-before-fallback-v1
  // Temizle başka cihazdan geldiyse, zaman bilgisi olmayan eski activity kalemleri de id/key ile aşağıda yakalanır.
  // Burada fallback kasıtlı olarak tüm bildirimleri körlemesine gizlemez; yeni bildirimlerin yanlış kaybolmasını engeller.
  const state = zrcBuildClearedNotificationState(readNotificationIds);
  const variants = zrcNotificationIdVariants(notification);
  const fingerprint = zrcNotificationFingerprint(notification);

  if (variants.some((id) => state.ids.has(String(id)))) return true;
  if (state.keys.has(String(fingerprint))) return true;

  return false;
};



function zrcSafeNotificationTone(type) {
  const raw = String(type || '').toLowerCase();

  if (raw.includes('comment') || raw.includes('yorum') || raw.includes('message') || raw.includes('mesaj')) {
    return 'bg-blue-50 text-blue-600 border-blue-100';
  }

  if (raw.includes('file') || raw.includes('dosya')) {
    return 'bg-purple-50 text-purple-600 border-purple-100';
  }

  if (raw.includes('task') || raw.includes('görev') || raw.includes('gorev')) {
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  }

  if (raw.includes('error') || raw.includes('hata') || raw.includes('delete') || raw.includes('sil')) {
    return 'bg-red-50 text-red-600 border-red-100';
  }

  return 'bg-[#fff3ef] text-[#ff3600] border-orange-100';
}


export default function ZRCAppShellAutoUiBlock01({
  Bildirim,
  Bildirimler,
  Yenile,
  activeContentMenu,
  currentAccountType,
  currentProfileInitials,
  d,
  event,
  fill,
  handleNotificationClick,
  isNotificationsOpen,
  isRead,
  loadActivityLogsFromSupabase,
  markAllNotificationsAsRead,
  notification,
  notificationEmptyDescription,
  notificationItems,
  notificationPanelSummary,
  okundu,
  onClick,
  readNotificationIds,
  renderProfileAvatar,
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
  unreadNotificationCount,
  viewBox,
  yap,
  yok,
}) {
  const zrcVisibleNotificationItems = (Array.isArray(notificationItems) ? notificationItems : []).filter(
    (item) => !zrcIsNotificationCleared(item, readNotificationIds)
  );

  const zrcHasVisibleNotifications = zrcVisibleNotificationItems.length > 0;

  const zrcNotificationPanelSummary =
    zrcHasVisibleNotifications
      ? `${zrcVisibleNotificationItems.length} bildirim`
      : 'Bildirim yok';


  return (
    <>
      {isNotificationsOpen && (
                <div
                  onClick={(event) => event.stopPropagation()}
                  style={{ top: activeContentMenu === 'Projeler' ? 42 : 52, left: 'calc(50% + 54px)' }}
                  className="zrc-notification-panel fixed -translate-x-1/2 z-[680] w-[318px] bg-white/95 backdrop-blur-xl border border-zinc-200/55 rounded-[12px] shadow-[0_18px_46px_rgba(15,23,42,0.14)] overflow-hidden animate-fade-in"
                >
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white border-l border-t border-zinc-200/60" />
                  <div className="h-[46px] px-3 border-b border-zinc-100/80 flex items-center justify-between">
                    <div>
                      <div className="text-[12.5px] font-black text-zinc-800">Bildirimler</div>
                      <div className="mt-0.5 text-[9.5px] font-bold text-zinc-400">
                        {zrcNotificationPanelSummary}
                      </div>
                    </div>
      
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={loadActivityLogsFromSupabase}
                        className="h-6 px-2.5 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-500 hover:text-zinc-900 hover:border-zinc-200 transition-all"
                      >
                        Yenile
                      </button>
      
                      {zrcHasVisibleNotifications && (
                        <button
                          type="button"
                          onClick={markAllNotificationsAsRead}
                          className="h-6 px-2 rounded-full bg-zinc-100 border border-transparent text-[9px] font-black text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all"
                        >
                          Temizle
                        </button>
                      )}
                    </div>
                  </div>
      
                  <div className="max-h-[330px] overflow-y-auto custom-scrollbar p-1.5">
                    {zrcHasVisibleNotifications ? (
                      <div className="space-y-1.5">
                        {zrcVisibleNotificationItems.map((notification) => {
                          const isRead = readNotificationIds.includes(notification.id);
      
                          return (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() => handleNotificationClick(notification)}
                              className={`w-full text-left rounded-[10px] border p-2.5 transition-all ${
                                isRead
                                  ? 'bg-white border-zinc-100 hover:bg-zinc-50'
                                  : 'bg-blue-50/45 border-blue-100 hover:bg-blue-50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className={`w-8 h-8 rounded-[9px] border flex items-center justify-center shrink-0 overflow-hidden ${zrcSafeNotificationTone(notification.type)}`}>
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
                                    <div className="text-[11px] font-black text-zinc-800 truncate">
                                      {notification.title}
                                    </div>
      
                                    {!isRead && (
                                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                                    )}
                                  </div>
      
                                  <div className="mt-0.5 text-[10.5px] font-bold text-zinc-600 truncate">
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
                      <div className="h-[170px] flex flex-col items-center justify-center text-center">
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
    </>
  );
}
