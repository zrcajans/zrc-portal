import { getNotificationTone } from '../../utils/dashboardHelpers.js';
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
  return (
    <>
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
    </>
  );
}
