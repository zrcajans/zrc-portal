// Team Member List Section Block - Pure JSX rendering
// Props: teamMembers, selectedTeamMemberId, pendingTeamDeleteId
// Handlers: setSelectedTeamMemberId, copyCredentialTextForMember, 
// openTeamMemberEditModal, toggleTeamMemberStatus, deleteTeamMemberFromCenter
// Utils: renderProfileAvatar, createAvatarFromName, normalizeTeamRole,
// getMemberLinkedCustomer, getTeamRoleTone, getAccountTypeFromRole,
// getCustomerNameById, createUsernameFromMember

export default function ZRCAppShellTeamMemberListBlock({
  teamMembers = [],
  selectedTeamMemberId = '',
  pendingTeamDeleteId = '',
  setSelectedTeamMemberId = () => {},
  copyCredentialTextForMember = () => {},
  openTeamMemberEditModal = () => {},
  toggleTeamMemberStatus = () => {},
  deleteTeamMemberFromCenter = () => {},
  renderProfileAvatar = () => {},
  createAvatarFromName = () => {},
  normalizeTeamRole = () => {},
  getMemberLinkedCustomer = () => {},
  getTeamRoleTone = () => {},
  getAccountTypeFromRole = () => {},
  getCustomerNameById = () => {},
  createUsernameFromMember = () => {}
}) {
  return (
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
  );
}
