export default function ZRCAppShellAutoUiBlock03({
  createQuickNoteFromHome,
  d,
  editingQuickNoteId,
  event,
  fill,
  isQuickNoteComposerOpen,
  onChange,
  onClick,
  onKeyDown,
  onSubmit,
  quickNoteDraft,
  quickNoteTitleDraft,
  resetQuickNoteComposer,
  setIsQuickNoteComposerOpen,
  setQuickNoteDraft,
  setQuickNoteTitleDraft,
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
  viewBox,
}) {
  return (
    <>
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
    </>
  );
}
