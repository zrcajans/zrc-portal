import React from 'react';

export default function ZRCAppShellIsMessagesOpenSection(props) {
  const {
    isMessagesOpen,
    fixed,
    inset,
    z,
    setIsMessagesOpen,
    setIsMessageTaskPickerOpen,
    activeContentMenu,
    Projeler,
    left,
    translate,
    w,
    bg,
    white,
    border,
    zinc,
    rounded,
    shadow,
    overflow,
    hidden,
    animate,
    fade,
    absolute,
    top,
    h,
    rotate,
    l,
    t,
    px,
    b,
    flex,
    items,
    center,
    justify,
    between,
    text,
    font,
    black,
    Mesajlar,
    mt,
    bold,
    unreadMessageCount,
    mesaj,
    mesajlar,
    okundu,
    markAllMessagesAsRead,
    clearAllMessages,
    full,
    transition,
    all,
    Okundu,
    Yap,
    max,
    auto,
    custom,
    scrollbar,
    fbfcfd,
    messageItems,
    space,
    readMessageIds,
    handleMessageClick,
    blue,
    start,
    gap,
    shrink,
    renderProfileAvatar,
    currentProfileInitials,
    min,
    truncate,
    Mesaj,
    clamp,
    getProjectMessageDateLabel,
    col,
    mb,
    none,
    currentColor,
    round,
    M8,
    M21,
    yok,
    proje,
    yaz,
    handleSendProjectMessage,
    relative,
    selectedMessageTask,
    Genel,
    M6,
    isMessageTaskPickerOpen,
    right,
    bottom,
    setMessageLinkedTaskId,
    messageLinkedTaskId,
    messageTaskOptions,
    end,
    messageDraft,
    setMessageDraft,
    Enter,
    Proje,
    resize,
    py,
    outline,
    submit,
    cursor,
    not,
    allowed
  } = props;

  return (
    isMessagesOpen && (
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
              style={{ top: activeContentMenu === 'Projeler' ? 42 : 52, left: 'calc(50% - 54px)' }}
              className="zrc-message-panel fixed -translate-x-1/2 z-[681] w-[318px] bg-white/95 backdrop-blur-xl border border-zinc-200/55 rounded-[10px] shadow-[0_18px_46px_rgba(15,23,42,0.14)] overflow-hidden animate-fade-in"
            >
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white border-l border-t border-zinc-200/60" />

            <div className="h-[46px] px-3 border-b border-zinc-100/80 flex items-center justify-between">
              <div>
                <div className="text-[12.5px] font-black text-zinc-800">Mesajlar</div>
                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                  {unreadMessageCount > 0 ? `${unreadMessageCount} okunmamış mesaj` : 'Tüm mesajlar okundu'}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={clearAllMessages}
                  disabled={messageItems.length === 0}
                  className="h-6 px-2 rounded-full bg-zinc-100 border border-transparent text-[9px] font-black text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all"
                >
                  Temizle
                </button>

                <button
                  type="button"
                  onClick={markAllMessagesAsRead}
                  disabled={messageItems.length === 0}
                  className="h-7 px-2.5 rounded-full bg-zinc-50 border border-zinc-100 text-[9.5px] font-black text-zinc-500 hover:text-zinc-800 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Tümünü Okundu Yap
                </button>
              </div>
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
                        className={`w-full text-left rounded-[11px] border p-2.5 transition-all ${
                          isRead
                            ? 'bg-white border-zinc-100 hover:bg-zinc-50'
                            : 'bg-blue-50/45 border-blue-100 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#8c5220] text-white text-[8px] font-black flex items-center justify-center shrink-0 overflow-hidden">
                            {renderProfileAvatar(message.avatar, currentProfileInitials)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-[11px] font-black text-zinc-800 truncate">
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

            <form onSubmit={handleSendProjectMessage} className="p-2.5 border-t border-zinc-100 bg-white">
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
        )
  );
}
