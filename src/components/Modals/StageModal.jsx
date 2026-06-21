import React, { useEffect, useState } from 'react';

const MINI_COLOR_PALETTE = [
  '#34d399',
  '#064e3b',
  '#bfdbfe',
  '#1d4ed8',
  '#a78bfa',
  '#fdba74',
  '#f87171',
  '#fde68a',
  '#cbd5e1',
  '#334155',
  '#f9a8d4'
];

function StageModal({ isOpen, onClose, onSave, columnData }) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    color: '#34d399',
    desc: '',
    tasks: []
  });

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      id: columnData?.id || `col-${Date.now()}`,
      title: columnData?.title || '',
      color: columnData?.color || '#34d399',
      desc: columnData?.desc || 'Bu aşamada bekleyen işler yer alır.',
      tasks: columnData?.tasks || []
    });
  }, [isOpen, columnData]);

  if (!isOpen) return null;

  const isNewColumn = !columnData?.title;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanTitle = formData.title.trim();

    if (!cleanTitle) {
      await window.zrcAlert('Kolon adı boş olamaz.');
      return;
    }

    await onSave({
      ...formData,
      title: cleanTitle,
      desc: formData.desc?.trim() || 'Bu aşamada bekleyen işler yer alır.',
      tasks: formData.tasks || []
    });
  };

  return (
    <div
      className="fixed inset-0 z-[620] bg-zinc-950/35 backdrop-blur-[3px] flex items-start justify-center px-5 pt-[130px] animate-overlay-in"
      onMouseDown={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-[360px] bg-white rounded-[13px] shadow-[0_24px_80px_rgba(15,23,42,0.24)] overflow-hidden animate-modal"
      >
        <div className="h-[56px] px-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-black text-slate-800 tracking-tight">
              {isNewColumn ? 'Kolon Ekle' : 'Kolonu Düzenle'}
            </h3>
            <p className="mt-0.5 text-[10px] font-bold text-slate-400">
              Kolon bilgilerini düzenle.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.7" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-3">
          <label className="block">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.08em] mb-1.5">
              Kolon Adı
            </span>
            <input
              autoFocus
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Örn: Aktif"
              className="w-full h-9 rounded-[8px] bg-slate-50 border border-slate-200 px-3 text-[12px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </label>

          <label className="block">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.08em] mb-1.5">
              Açıklama
            </span>
            <textarea
              value={formData.desc}
              onChange={(event) => setFormData((prev) => ({ ...prev, desc: event.target.value }))}
              placeholder="Bu kolonda hangi görevler yer alır?"
              className="w-full h-[54px] resize-none rounded-[8px] bg-slate-50 border border-slate-200 px-3 py-2 text-[12px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 transition-all custom-scrollbar"
            />
          </label>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.08em]">
                Renk
              </span>
              <span className="text-[9.5px] font-black text-slate-400 uppercase">
                {formData.color}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {MINI_COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-5 h-5 rounded-full border transition-all ${
                    formData.color === color
                      ? 'border-slate-800 ring-2 ring-slate-900/10 scale-110'
                      : 'border-white hover:scale-110 hover:ring-2 hover:ring-slate-900/5'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}

              <input
                type="color"
                value={formData.color}
                onChange={(event) => setFormData((prev) => ({ ...prev, color: event.target.value }))}
                className="w-6 h-6 rounded-full border border-slate-200 bg-white p-0.5 cursor-pointer ml-1"
                title="Özel renk"
              />
            </div>
          </div>
        </div>

        <div className="h-[52px] px-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3.5 rounded-full bg-white border border-slate-200 text-slate-500 text-[10.5px] font-black hover:text-slate-800 hover:border-slate-300 transition-all"
          >
            İptal
          </button>

          <button
            type="submit"
            className="h-8 px-4 rounded-full bg-[#2563eb] text-white text-[10.5px] font-black hover:bg-[#1d4ed8] shadow-[0_9px_20px_rgba(37,99,235,0.20)] transition-all"
          >
            {isNewColumn ? 'Ekle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StageModal;
