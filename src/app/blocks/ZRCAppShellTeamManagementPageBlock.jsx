import ZRCAppShellTeamMemberListBlock from './ZRCAppShellTeamMemberListBlock';

export default function ZRCAppShellTeamManagementPageBlock({
  activeContentMenu,
  activeTab,
  showTeamManagementPage,
  teamMembers,
  activeTeamMembers,
  passiveTeamMembers,
  currentUserRole,
  getTeamRoleTone,
  currentPermissions,
  createTeamMemberFromCenter,
  teamMemberDraft,
  setTeamMemberDraft,
  normalizeCredentialText,
  getCustomerNameById,
  renderSoftSelect,
  teamRoleOptions,
  customerLinkNoneLabel,
  customerLinkOptions,
  getCustomerIdByName,
  getCustomerById,
  selectedTeamMemberId,
  pendingTeamDeleteId,
  setSelectedTeamMemberId,
  copyCredentialTextForMember,
  openTeamMemberEditModal,
  toggleTeamMemberStatus,
  deleteTeamMemberFromCenter,
  renderProfileAvatar,
  createAvatarFromName,
  normalizeTeamRole,
  getMemberLinkedCustomer,
  getAccountTypeFromRole,
  createUsernameFromMember,
}) {
  return (
    <>
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
      
                              <ZRCAppShellTeamMemberListBlock
                                teamMembers={teamMembers}
                                selectedTeamMemberId={selectedTeamMemberId}
                                pendingTeamDeleteId={pendingTeamDeleteId}
                                setSelectedTeamMemberId={setSelectedTeamMemberId}
                                copyCredentialTextForMember={copyCredentialTextForMember}
                                openTeamMemberEditModal={openTeamMemberEditModal}
                                toggleTeamMemberStatus={toggleTeamMemberStatus}
                                deleteTeamMemberFromCenter={deleteTeamMemberFromCenter}
                                renderProfileAvatar={renderProfileAvatar}
                                createAvatarFromName={createAvatarFromName}
                                normalizeTeamRole={normalizeTeamRole}
                                getMemberLinkedCustomer={getMemberLinkedCustomer}
                                getTeamRoleTone={getTeamRoleTone}
                                getAccountTypeFromRole={getAccountTypeFromRole}
                                getCustomerNameById={getCustomerNameById}
                                createUsernameFromMember={createUsernameFromMember}
                              />
                            </div>
                          </div>
                        </div>
                      )}
    </>
  );
}
