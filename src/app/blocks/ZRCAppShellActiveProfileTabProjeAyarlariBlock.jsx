import React from 'react';
import { createPortal } from 'react-dom';

export default function ZRCAppShellActiveProfileTabProjeAyarlariBlock(props) {
  const {
    activeTab,
    showProjectSettingsControls,
    projectSettingsDraft,
    setProjectSettingsDraft,
    customers,
    getCustomerByName,
    renderSoftSelect,
    selectedProjectTeamMembers,
    currentPermissions,
    setIsProjectTeamPickerOpen,
    isProjectTeamPickerOpen,
    availableProjectTeamMembers,
    renderProfileAvatar,
    createAvatarFromName,
    createUsernameFromMember,
    handleArchiveProject,
    handleDeleteProject,
    handleSaveProjectSettings,
    boardColumns,
    archivedTasks
  } = props;

  if (!(activeTab === 'Ayarlar' && showProjectSettingsControls)) {
    return null;
  }

  return (
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
  );
}
