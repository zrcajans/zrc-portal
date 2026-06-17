export default function ZRCAppShellAutoUiBlock04({
  Grubu,
  Grup,
  Kapat,
  Kaydet,
  autoFocus,
  canCreateChatGroups,
  chatGroupDraft,
  createChatGroupFromPage,
  event,
  isChatGroupModalOpen,
  onChange,
  onClick,
  onSubmit,
  setChatGroupDraft,
  setIsChatGroupModalOpen,
}) {
  return (
    <>
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
    </>
  );
}
