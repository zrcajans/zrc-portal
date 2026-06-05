import React from 'react';

function TopNavbar({
  unreadNotificationCount = 0,
  isNotificationsOpen = false,
  onToggleNotifications,
  unreadMessageCount = 0,
  isMessagesOpen = false,
  onToggleMessages,
  onLogout
}) {
  return (
    <div className="w-full h-[40px] px-7 flex items-center justify-between shrink-0 bg-transparent relative">
      <div className="w-[150px]" />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
        <button
          onClick={onToggleMessages}
          className={`relative h-[27px] px-3.5 rounded-[7px] transition-all flex items-center gap-2 text-[11px] font-black tracking-[-0.01em] border ${
            isMessagesOpen
              ? 'bg-white text-[#2563eb] border-[#dbe7ff] shadow-[0_8px_20px_rgba(37,99,235,0.12)]'
              : 'bg-white/72 text-[#7d8898] border-[#e8edf4] hover:bg-white hover:text-[#2563eb] hover:border-[#dbe7ff] shadow-[0_7px_18px_rgba(15,23,42,0.045)]'
          }`}
          title="Mesajlar"
          type="button"
        >
          <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.15" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.924-.924 5.972 5.972 0 001.057-4.035A8.287 8.287 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>

          <span>Mesajlar</span>

          {unreadMessageCount > 0 && (
            <span className="ml-0.5 bg-[#2563eb] text-white text-[7px] font-black min-w-[14px] h-[14px] px-1 rounded-full flex items-center justify-center leading-none shadow-[0_4px_10px_rgba(37,99,235,0.25)]">
              {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
            </span>
          )}
        </button>

        <button
          onClick={onToggleNotifications}
          className={`relative h-[27px] px-3.5 rounded-[7px] transition-all flex items-center gap-2 text-[11px] font-black tracking-[-0.01em] border ${
            isNotificationsOpen
              ? 'bg-white text-[#ff3600] border-[#ffd8ce] shadow-[0_8px_20px_rgba(255,54,0,0.12)]'
              : 'bg-white/72 text-[#7d8898] border-[#e8edf4] hover:bg-white hover:text-[#ff3600] hover:border-[#ffd8ce] shadow-[0_7px_18px_rgba(15,23,42,0.045)]'
          }`}
          title="Bildirimler"
          type="button"
        >
          <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.15" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022 23.848 23.848 0 005.455 1.31m5.714 0a3 3 0 11-5.714 0" />
          </svg>

          <span>Bildirimler</span>

          {unreadNotificationCount > 0 && (
            <span className="ml-0.5 bg-[#ff3600] text-white text-[7px] font-black min-w-[14px] h-[14px] px-1 rounded-full flex items-center justify-center leading-none shadow-[0_4px_10px_rgba(255,54,0,0.22)]">
              {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-7 h-7 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-white/70 transition-all flex items-center justify-center" title="Tema" type="button">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </button>

        <button
          onClick={onLogout}
          className="text-zinc-400 hover:text-[#ff3600] flex items-center gap-1.5 text-[10px] font-black tracking-[0.04em] transition-all"
          type="button"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span>ÇIKIŞ</span>
        </button>
      </div>
    </div>
  );
}

export default TopNavbar;
