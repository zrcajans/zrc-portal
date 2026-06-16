import React from 'react';

export default function CustomerEditModal(props) {
  const {
    editingCustomer,
    closeCustomerEditModal,
    saveCustomerEdit,
    customerEditDraft,
    setCustomerEditDraft
  } = props;

  if (!editingCustomer) return null;

  return (
    <div
      className="fixed inset-0 z-[760] bg-zinc-950/25 backdrop-blur-[2px] flex items-center justify-center animate-fade-in"
      onClick={closeCustomerEditModal}
    >
      <form
        onSubmit={saveCustomerEdit}
        onClick={(event) => event.stopPropagation()}
        className="w-[430px] bg-white border border-zinc-200 rounded-[18px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-hidden"
      >
        <div className="h-14 px-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <div className="text-[14px] font-black text-zinc-800">Müşteri Düzenle</div>
            <div className="mt-0.5 text-[10px] font-bold text-zinc-400">Bilgileri güncelle</div>
          </div>

          <button
            type="button"
            onClick={closeCustomerEditModal}
            className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-white hover:text-zinc-900 transition-all flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-3">
          <input
            value={customerEditDraft.name}
            onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Müşteri adı"
            className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
          />

          <input
            value={customerEditDraft.contact}
            onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, contact: event.target.value }))}
            placeholder="Yetkili kişi"
            className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
          />
          <input
            value={customerEditDraft.phone}
            onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="Telefon"
            className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
          />


          
          <textarea
            value={customerEditDraft.note}
            onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, note: event.target.value }))}
            placeholder="Not"
            rows={3}
            className="w-full resize-none rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
          />
        </div>

        <div className="h-14 px-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={closeCustomerEditModal}
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
