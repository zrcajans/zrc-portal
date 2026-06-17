import { createAvatarFromName } from '../../utils/avatarHelpers';
import ZRCAppShellAutoUiBlock04 from '../blocks/ZRCAppShellAutoUiBlock04';

export default function ZRCAppMessagesPageSection({
  Grubu,
  Grup,
  Kapat,
  Kaydet,
  autoFocus,
  canCreateChatGroups,
  canSendSelectedChatMessage,
  chatGroupDraft,
  chatGroupSearch,
  chatPageDraft,
  createChatGroupFromPage,
  event,
  filteredChatGroups,
  getProjectMessageDateLabel,
  handleSendChatPageMessage,
  isChatActionMenuOpen,
  isChatGroupModalOpen,
  isCurrentProfileRecord,
  isProjectMessageVisibleForCurrentUser,
  onChange,
  onClick,
  onSubmit,
  projectMessages,
  selectedChatGroup,
  selectedChatGroupId,
  selectedChatMessages,
  setChatGroupDraft,
  setChatGroupSearch,
  setChatPageDraft,
  setIsChatActionMenuOpen,
  setIsChatGroupModalOpen,
  setSelectedChatGroupId,
}) {
  return (
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

            <ZRCAppShellAutoUiBlock04
        Grubu={typeof Grubu !== 'undefined' ? Grubu : undefined}
        Grup={typeof Grup !== 'undefined' ? Grup : undefined}
        Kapat={typeof Kapat !== 'undefined' ? Kapat : undefined}
        Kaydet={typeof Kaydet !== 'undefined' ? Kaydet : undefined}
        autoFocus={typeof autoFocus !== 'undefined' ? autoFocus : undefined}
        canCreateChatGroups={typeof canCreateChatGroups !== 'undefined' ? canCreateChatGroups : undefined}
        chatGroupDraft={typeof chatGroupDraft !== 'undefined' ? chatGroupDraft : undefined}
        createChatGroupFromPage={typeof createChatGroupFromPage !== 'undefined' ? createChatGroupFromPage : undefined}
        event={typeof event !== 'undefined' ? event : undefined}
        isChatGroupModalOpen={typeof isChatGroupModalOpen !== 'undefined' ? isChatGroupModalOpen : undefined}
        onChange={typeof onChange !== 'undefined' ? onChange : undefined}
        onClick={typeof onClick !== 'undefined' ? onClick : undefined}
        onSubmit={typeof onSubmit !== 'undefined' ? onSubmit : undefined}
        setChatGroupDraft={typeof setChatGroupDraft !== 'undefined' ? setChatGroupDraft : undefined}
        setIsChatGroupModalOpen={typeof setIsChatGroupModalOpen !== 'undefined' ? setIsChatGroupModalOpen : undefined}
      />
          </div>
  );
}
