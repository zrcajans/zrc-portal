export default function ZRCAppShellAutoUiBlock02({
  Durumlar,
  Filtreler,
  calendarDisplayOptions,
  d,
  fill,
  filterEvent,
  isMenuCalendarFilterOpen,
  isMenuCalendarStatusOpen,
  menuCalendarStatusFilter,
  menuCalendarStatusOptions,
  onClick,
  prev,
  projectName,
  projects,
  setCalendarDisplayOptions,
  setIsMenuCalendarStatusOpen,
  setMenuCalendarStatusFilter,
  status,
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
  viewBox,
}) {
  return (
    <>
      {isMenuCalendarFilterOpen && (
                          <div
                            onClick={(filterEvent) => filterEvent.stopPropagation()}
                            className="absolute right-0 top-[34px] z-[650] w-[300px] rounded-[4px] bg-white border border-[#e1e5eb] shadow-[0_18px_45px_rgba(15,23,42,0.16)] text-left overflow-visible"
                          >
                            <div className="p-3">
                              <div className="text-[12px] font-black text-[#374151]">Filtreler</div>
      
                              <div className="mt-3 text-[10px] font-black text-[#7f8a9b]">Gösterim Şekli</div>
      
                              <div className="mt-2 space-y-2">
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
                                    key={option.keyName}
                                    type="button"
                                    onClick={() =>
                                      setCalendarDisplayOptions((prev) => ({
                                        ...prev,
                                        [option.keyName]: !prev[option.keyName]
                                      }))
                                    }
                                    className="w-full h-6 flex items-center gap-2 text-[10.5px] font-bold text-[#667085] hover:text-[#374151]"
                                  >
                                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                      option.checked
                                        ? 'bg-[#4fbd7d] border-[#4fbd7d] text-white'
                                        : 'bg-white border-[#cbd2dc] text-transparent'
                                    }`}>
                                      ✓
                                    </span>
                                    {option.label}
                                  </button>
                                ))}
                              </div>
      
                              <div className="mt-3 text-[10px] font-black text-[#7f8a9b]">Durumlar</div>
      
                              <div className="relative mt-1.5">
                                <button
                                  type="button"
                                  onClick={() => setIsMenuCalendarStatusOpen((prev) => !prev)}
                                  className="w-full h-8 rounded-[14px] bg-white border border-[#dfe3ea] px-3 flex items-center justify-between text-[10px] font-bold text-[#555f70]"
                                >
                                  {menuCalendarStatusFilter}
                                  <svg className="w-3 h-3 text-[#98a1b2]" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
      
                                {isMenuCalendarStatusOpen && (
                                  <div className="absolute left-0 right-0 top-[34px] z-[670] bg-white border border-[#dfe3ea] rounded-[4px] shadow-[0_14px_32px_rgba(15,23,42,0.14)] overflow-hidden">
                                    {menuCalendarStatusOptions.map((status) => (
                                      <button
                                        key={status}
                                        type="button"
                                        onClick={() => {
                                          setMenuCalendarStatusFilter(status);
                                          setIsMenuCalendarStatusOpen(false);
                                        }}
                                        className={`w-full h-8 px-3 text-left text-[10px] font-bold hover:bg-[#f7f8fa] ${
                                          menuCalendarStatusFilter === status ? 'text-[#2f66cf]' : 'text-[#555f70]'
                                        }`}
                                      >
                                        {status}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
      
                              <div className="mt-4 text-[10px] font-black text-[#7f8a9b]">İlgili</div>
      
                              <div className="mt-2 space-y-2">
                                {projects.slice(0, 5).map((projectName) => (
                                  <div key={`calendar-filter-project-${projectName}`} className="h-6 flex items-center gap-2 text-[10.5px] font-bold text-[#667085]">
                                    <span className="w-4 h-4 rounded-full bg-[#4fbd7d] text-white flex items-center justify-center text-[9px]">✓</span>
                                    <span className="truncate">{projectName}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
    </>
  );
}
