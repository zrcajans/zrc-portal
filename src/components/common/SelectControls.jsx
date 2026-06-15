import React from 'react';

export function ProfileSelect({
  id,
  label,
  value,
  options,
  onChange,
  wrapperClassName = '',
  openProfileDropdown,
  setOpenProfileDropdown
}) {
  return (
    <label className={`block relative ${wrapperClassName}`} onClick={(event) => event.stopPropagation()}>
      <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">{label}</span>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpenProfileDropdown((prev) => (prev === id ? null : id));
        }}
        className={`w-full h-8 rounded-[15px] border px-3 text-[10.5px] font-semibold flex items-center justify-between gap-2 transition-all ${
          openProfileDropdown === id
            ? 'border-[#9cc9ff] bg-white shadow-[0_0_0_3px_rgba(183,212,255,0.35)] text-current'
            : 'border-[#e4e7ec] bg-white text-[#394150] hover:border-[#cfd6e1]'
        }`}
      >
        <span className="truncate">{value}</span>
        <svg
          className={`w-3.5 h-3.5 text-[#9aa3b1] transition-transform ${openProfileDropdown === id ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {openProfileDropdown === id && (
        <div className="absolute left-0 right-0 top-[58px] z-[720] rounded-[10px] border border-[#e0e5ee] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] p-1.5 animate-fade-in">
          {options.map((option) => {
            const isSelected = option === value;

            return (
              <button
                key={option}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange(option);
                  setOpenProfileDropdown(null);
                }}
                className={`w-full h-8 rounded-[8px] px-2.5 flex items-center justify-between text-left text-[10.5px] font-bold transition-all ${
                  isSelected
                    ? 'bg-[#eef5ff] text-[#2f66cf]'
                    : 'text-[#4b5563] hover:bg-[#f7f9fc]'
                }`}
              >
                <span className="truncate">{option}</span>
                {isSelected && <span className="text-[#45b978] text-[11px]">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </label>
  );
}

export function SoftSelect({
  id,
  label = '',
  value,
  options,
  onChange,
  wrapperClassName = '',
  buttonClassName = 'h-10 rounded-[12px] bg-zinc-50 border border-zinc-200 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-zinc-300',
  openProfileDropdown,
  setOpenProfileDropdown
}) {
  return (
    <div className={`relative ${wrapperClassName}`} onClick={(event) => event.stopPropagation()}>
      {label && (
        <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-1.5">
          {label}
        </span>
      )}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpenProfileDropdown((prev) => (prev === id ? null : id));
        }}
        className={`w-full flex items-center justify-between gap-3 transition-all ${
          openProfileDropdown === id
            ? `${buttonClassName} bg-white border-[#ff3600] shadow-[0_0_0_4px_rgba(255,54,0,0.06)]`
            : buttonClassName
        }`}
      >
        <span className="truncate">{value || 'Seçiniz'}</span>
        <span className={`w-5 h-5 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 transition-transform ${openProfileDropdown === id ? 'rotate-180' : ''}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {openProfileDropdown === id && (
        <div className={`absolute left-0 right-0 ${label ? 'top-[62px]' : 'top-[calc(100%+7px)]'} z-[900] rounded-[14px] border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)] p-1.5 animate-fade-in`}>
          {options.map((option) => {
            const isSelected = option === value;

            return (
              <button
                key={option}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange(option);
                  setOpenProfileDropdown(null);
                }}
                className={`w-full h-9 rounded-[10px] px-3 flex items-center justify-between text-left text-[11px] font-black transition-all ${
                  isSelected
                    ? 'bg-[#fff3ef] text-[#ff3600]'
                    : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <span className="truncate">{option}</span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#ff3600] text-white text-[10px] flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
