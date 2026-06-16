import React from 'react';

export default function TeamMemberEditModal(props) {
  const {
    editingTeamMember,
    closeTeamMemberEditModal,
    saveTeamMemberEdit,
    teamMemberEditDraft,
    setTeamMemberEditDraft,
    normalizeCredentialText,
    getCustomerNameById,
    teamRoleOptions,
    renderSoftSelect,
    customerLinkNoneLabel,
    customerLinkOptions,
    getCustomerIdByName,
    getCustomerById
  } = props;

  if (!editingTeamMember) return null;

  return (
    <div
      className="fixed inset-0 z-[760] bg-zinc-950/25 backdrop-blur-[2px] flex items-center justify-center animate-fade-in"
      onClick={closeTeamMemberEditModal}
    >
      <form
        onSubmit={saveTeamMemberEdit}
        onClick={(event) => event.stopPropagation()}
        className="w-[460px] bg-white border border-zinc-200 rounded-[18px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-visible"
      >
        <div className="h-14 px-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <div className="text-[14px] font-black text-zinc-800">Kişi Düzenle</div>
            <div className="mt-0.5 text-[10px] font-bold text-zinc-400">Ekip üyesi bilgilerini güncelle</div>
          </div>

          <button
            type="button"
            onClick={closeTeamMemberEditModal}
            className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-white hover:text-zinc-900 transition-all flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-3">
          {teamMemberEditDraft.role !== 'Müşteri/Misafir' ? (
            <input
              value={teamMemberEditDraft.name}
              onChange={(event) => setTeamMemberEditDraft((prev) => ({
                ...prev,
                name: event.target.value,
                username: prev.username || normalizeCredentialText(event.target.value)
              }))}
              placeholder="Ad Soyad"
              className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
            />
          ) : (
            <div className="rounded-[12px] border border-blue-100 bg-blue-50/55 px-3 py-2.5">
              <div className="text-[9.5px] font-black text-blue-500 uppercase tracking-[0.08em]">Ad Soyad otomatik</div>
              <div className="mt-1 text-[12px] font-black text-zinc-700">
                {getCustomerNameById(teamMemberEditDraft.customerId) || 'Aşağıdan müşteri seç'}
              </div>
              <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                İsim bağlı müşteri kartından güncellenir.
              </div>
            </div>
          )}

          {renderSoftSelect({
            id: 'team-edit-role',
            value: teamMemberEditDraft.role,
            options: teamRoleOptions,
            onChange: (role) => setTeamMemberEditDraft((prev) => ({
              ...prev,
              role,
              name: role === 'Müşteri/Misafir' ? '' : prev.name,
              customerId: role === 'Müşteri/Misafir' ? prev.customerId : ''
            })),
            buttonClassName: 'h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-[#ff3600]'
          })}

          {teamMemberEditDraft.role === 'Müşteri/Misafir' && renderSoftSelect({
            id: 'team-edit-customer-link',
            label: 'Bağlı Müşteri',
            value: getCustomerNameById(teamMemberEditDraft.customerId) || customerLinkNoneLabel,
            options: customerLinkOptions,
            onChange: (customerName) => {
              const selectedCustomerId = customerName === customerLinkNoneLabel ? '' : getCustomerIdByName(customerName);
              const selectedCustomer = getCustomerById(selectedCustomerId);

              setTeamMemberEditDraft((prev) => ({
                ...prev,
                customerId: selectedCustomerId,
                username: prev.username || normalizeCredentialText(selectedCustomer?.name || ''),
                email: prev.email || selectedCustomer?.email || ''
              }));
            },
            buttonClassName: 'h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-[#ff3600]'
          })}

          <input
            value={teamMemberEditDraft.email}
            onChange={(event) => setTeamMemberEditDraft((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="E-posta"
            className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              value={teamMemberEditDraft.username}
              onChange={(event) => setTeamMemberEditDraft((prev) => ({ ...prev, username: normalizeCredentialText(event.target.value) }))}
              placeholder="Kullanıcı adı"
              className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
            />

            <input
              value={teamMemberEditDraft.password}
              onChange={(event) => setTeamMemberEditDraft((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="Şifre"
              className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
            />
          </div>
        </div>

        <div className="h-14 px-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={closeTeamMemberEditModal}
            className="h-9 px-4 rounded-[11px] bg-white border border-zinc-200 text-[11px] font-black text-zinc-500 hover:text-zinc-800 transition-all"
          >
            İptal
          </button>

          <button
            type="submit"
            className="h-9 px-5 rounded-[11px] bg-[#ff3600] text-white text-[11px] font-black hover:bg-[#e03000] active:scale-[0.98] transition-all"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
