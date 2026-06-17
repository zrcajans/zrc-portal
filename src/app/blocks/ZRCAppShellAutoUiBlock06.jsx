export default function ZRCAppShellAutoUiBlock06({
  calendarDisplayOptions,
  d,
  fill,
  isCalendarDisplayMenuOpen,
  menuEvent,
  onClick,
  prev,
  setCalendarDisplayOptions,
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
  viewBox,
}) {
  return (
    <>
      {isCalendarDisplayMenuOpen && (
                              <div
                                onClick={(menuEvent) => menuEvent.stopPropagation()}
                                className="absolute right-0 top-[40px] z-[620] w-[248px] rounded-[10px] bg-white border border-[#e6e9ee] shadow-[0_18px_38px_rgba(15,23,42,0.14)] px-4 py-3"
                              >
                                <div className="absolute -top-2 right-[72px] w-4 h-4 rotate-45 bg-white border-l border-t border-[#e6e9ee]" />
      
                                <div className="space-y-2.5 relative z-10">
                                  {[
                                    {
                                      label: 'Uzun Süreli Görevleri Gizle',
                                      checked: calendarDisplayOptions.hideLongTasks,
                                      keyName: 'hideLongTasks'
                                    },
                                    {
                                      label: 'Tamamlanmış Görevleri Gizle',
                                      checked: calendarDisplayOptions.hideCompletedTasks,
                                      keyName: 'hideCompletedTasks'
                                    },
                                    {
                                      label: 'Arşivlenmiş Görevleri Gizle',
                                      checked: calendarDisplayOptions.hideArchivedTasks,
                                      keyName: 'hideArchivedTasks'
                                    }
                                  ].map((option) => (
                                    <button
                                      key={`home-display-option-${option.keyName}`}
                                      type="button"
                                      onClick={() =>
                                        setCalendarDisplayOptions((prev) => ({
                                          ...prev,
                                          [option.keyName]: !prev[option.keyName]
                                        }))
                                      }
                                      className="w-full flex items-center gap-2.5 text-left text-[13px] font-bold text-[#7a8495] hover:text-[#4b5563] transition-all"
                                    >
                                      <span
                                        className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 ${
                                          option.checked
                                            ? 'bg-[#4fbd7d] border-[#4fbd7d] text-white'
                                            : 'bg-white border-[#c4ccd7] text-transparent'
                                        }`}
                                      >
                                        <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      </span>
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
    </>
  );
}
