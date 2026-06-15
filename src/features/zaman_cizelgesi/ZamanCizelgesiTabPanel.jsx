import React from 'react';

export default function ZamanCizelgesiTabPanel(props) {
  const {
    activeTab,
    selectedProject,
    Zaman,
    w,
    full,
    h,
    min,
    flex,
    bg,
    f5f6f8,
    overflow,
    hidden,
    animate,
    fade,
    px,
    pt,
    pb,
    max,
    mx,
    auto,
    white,
    border,
    zinc,
    rounded,
    shadow,
    calc,
    col,
    b,
    items,
    center,
    justify,
    between,
    gap,
    shrink,
    text,
    blue,
    none,
    currentColor,
    round,
    M21,
    timeChartSearch,
    setTimeChartSearch,
    scheduleSearchPlaceholder,
    transparent,
    font,
    bold,
    focus,
    outline,
    relative,
    setIsTimeChartFilterOpen,
    prev,
    setIsTimeChartSettingsOpen,
    hover,
    transition,
    all,
    Filtrele,
    M3,
    isTimeChartFilterOpen,
    absolute,
    left,
    top,
    z,
    hideCompleted,
    Gizle,
    hideArchived,
    hideNoDate,
    Tarihsiz,
    item,
    toggleTimeChartFilter,
    colors,
    timeChartFilters,
    M5,
    setTimeChartFilters,
    mt,
    black,
    Filtreleri,
    goToPreviousTimeChartPeriod,
    capitalize,
    timeChartRangeTitle,
    timeChartFilteredTasks,
    goToNextTimeChartPeriod,
    Sonraki,
    goToCurrentTimeChartPeriod,
    Hafta,
    view,
    changeTimeChartView,
    timeChartView,
    sm,
    Ayarlar,
    M10,
    M15,
    isTimeChartSettingsOpen,
    right,
    showWeekends,
    Sonunu,
    compactCards,
    Kompakt,
    Kartlar,
    toggleTimeChartSetting,
    timeChartSettings,
    scrollTimeChart,
    translate,
    md,
    Sola,
    ref,
    timeChartScrollRef,
    custom,
    scrollbar,
    overscroll,
    contain,
    grid,
    gridTemplateColumns,
    repeat,
    timeChartPeriods,
    minmax,
    minWidth,
    period,
    time,
    head,
    day,
    isSameCalendarDay,
    todayStart,
    uppercase,
    timeChartMembers,
    member,
    py,
    renderProfileAvatar,
    createAvatarFromName,
    getTimeChartTasksForMemberAndPeriod,
    cell,
    repeating,
    linear,
    gradient,
    rgba,
    _0px,
    _8px,
    transparent_8px,
    transparent_16px,
    Sonu,
    space,
    task,
    openTaskDetail,
    getTimeChartTaskColor,
    truncate,
    Proje,
    formatCalendarDate,
    getTimeChartTaskStartDate,
    getTimeChartTaskEndDate,
    openTaskModalForTimeChartPeriod,
    dashed,
    Bu,
    alana,
    ekle
  } = props;

  return (
    activeTab === 'Zaman Çizelgesi' && (
                  <div className="w-full h-full min-h-0 flex-1 bg-[#f5f6f8] overflow-hidden animate-fade-in">
                    <div className="px-7 pt-3 pb-4 max-w-[1160px] mx-auto">
                      <div className="bg-white border border-zinc-200/70 rounded-[14px] shadow-[0_10px_32px_rgba(15,23,42,0.045)] overflow-hidden h-[calc(100vh-300px)] min-h-[500px] max-h-[640px] flex flex-col">
                        <div className="h-[58px] px-4 border-b border-zinc-100 flex items-center justify-between gap-3 shrink-0">
                          <div className="flex items-center gap-2">
                            <div className="w-[210px] h-8 rounded-[8px] bg-white border border-zinc-200 flex items-center px-2.5 gap-2">
                              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                              </svg>
                              <input
                                value={timeChartSearch}
                                onChange={(event) => setTimeChartSearch(event.target.value)}
                                placeholder={scheduleSearchPlaceholder}
                                className="w-full bg-transparent text-[11px] font-bold text-zinc-600 placeholder:text-zinc-300 focus:outline-none"
                              />
                            </div>

                            <div className="relative">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setIsTimeChartFilterOpen((prev) => !prev);
                                  setIsTimeChartSettingsOpen(false);
                                }}
                                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-400 hover:text-zinc-700 hover:bg-white border border-zinc-200 transition-all flex items-center justify-center"
                                title="Filtrele"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18l-7 8v5l-4 2v-7l-7-8z" />
                                </svg>
                              </button>

                              {isTimeChartFilterOpen && (
                                <div
                                  onClick={(event) => event.stopPropagation()}
                                  className="absolute left-0 top-[38px] w-[230px] bg-white border border-zinc-200 rounded-[8px] shadow-[0_18px_50px_rgba(15,23,42,0.16)] p-2 z-[540] animate-fade-in"
                                >
                                  {[
                                    { key: 'hideCompleted', label: 'Tamamlanmış Görevleri Gizle' },
                                    { key: 'hideArchived', label: 'Arşivlenmiş Görevleri Gizle' },
                                    { key: 'hideNoDate', label: 'Tarihsiz Görevleri Gizle' }
                                  ].map((item) => (
                                    <button
                                      key={item.key}
                                      type="button"
                                      onClick={() => toggleTimeChartFilter(item.key)}
                                      className="w-full h-7 rounded-[6px] px-1.5 flex items-center gap-2 text-left hover:bg-zinc-50 transition-colors"
                                    >
                                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                        timeChartFilters[item.key]
                                          ? 'bg-[#46b16f] border-[#46b16f] text-white'
                                          : 'bg-white border-zinc-300 text-transparent'
                                      }`}>
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      </span>

                                      <span className="text-[10.5px] font-bold text-zinc-500">{item.label}</span>
                                    </button>
                                  ))}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTimeChartSearch('');
                                      setTimeChartFilters({
                                        hideCompleted: false,
                                        hideArchived: true,
                                        hideNoDate: true
                                      });
                                    }}
                                    className="mt-1 w-full h-7 rounded-[6px] bg-zinc-50 text-[10.5px] font-black text-zinc-500 hover:bg-zinc-100 transition-all"
                                  >
                                    Filtreleri Sıfırla
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={goToPreviousTimeChartPeriod}
                                className="w-8 h-8 rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center justify-center"
                                title="Önceki"
                              >
                                ‹
                              </button>

                              <div className="min-w-[150px] text-center">
                                <div className="text-[12px] font-black text-zinc-800 capitalize">{timeChartRangeTitle}</div>
                                <div className="text-[9px] font-bold text-zinc-400">{timeChartFilteredTasks.length} görev</div>
                              </div>

                              <button
                                type="button"
                                onClick={goToNextTimeChartPeriod}
                                className="w-8 h-8 rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center justify-center"
                                title="Sonraki"
                              >
                                ›
                              </button>

                              <button
                                type="button"
                                onClick={goToCurrentTimeChartPeriod}
                                className="h-7 px-3 rounded-full bg-zinc-100 text-[9.5px] font-black text-zinc-400 hover:text-zinc-700 transition-all"
                              >
                                Bugün
                              </button>
                            </div>

                            <div className="flex items-center gap-1 rounded-full bg-zinc-100 p-1">
                              {['Gün', 'Hafta'].map((view) => (
                                <button
                                  key={view}
                                  type="button"
                                  onClick={() => changeTimeChartView(view)}
                                  className={`h-7 px-3 rounded-full text-[10px] font-black transition-all ${
                                    timeChartView === view
                                      ? 'bg-[#2563eb] text-white shadow-sm'
                                      : 'text-zinc-400 hover:text-zinc-700'
                                  }`}
                                >
                                  {view}
                                </button>
                              ))}
                            </div>

                            <div className="relative">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setIsTimeChartSettingsOpen((prev) => !prev);
                                  setIsTimeChartFilterOpen(false);
                                }}
                                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-400 hover:text-zinc-700 hover:bg-white border border-zinc-200 transition-all flex items-center justify-center"
                                title="Ayarlar"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.607 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>

                              {isTimeChartSettingsOpen && (
                                <div
                                  onClick={(event) => event.stopPropagation()}
                                  className="absolute right-0 top-[38px] w-[220px] bg-white border border-zinc-200 rounded-[8px] shadow-[0_18px_50px_rgba(15,23,42,0.16)] p-2 z-[540] animate-fade-in"
                                >
                                  {[
                                    { key: 'showWeekends', label: 'Hafta Sonunu Göster' },
                                    { key: 'compactCards', label: 'Kompakt Kartlar' }
                                  ].map((item) => (
                                    <button
                                      key={item.key}
                                      type="button"
                                      onClick={() => toggleTimeChartSetting(item.key)}
                                      className="w-full h-7 rounded-[6px] px-1.5 flex items-center gap-2 text-left hover:bg-zinc-50 transition-colors"
                                    >
                                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                        timeChartSettings[item.key]
                                          ? 'bg-[#46b16f] border-[#46b16f] text-white'
                                          : 'bg-white border-zinc-300 text-transparent'
                                      }`}>
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      </span>

                                      <span className="text-[10.5px] font-bold text-zinc-500">{item.label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="relative bg-white min-h-0 flex-1 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => scrollTimeChart('left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-[30] w-8 h-8 rounded-full bg-white/95 border border-zinc-200 text-zinc-500 shadow-md hover:text-zinc-900 transition-all flex items-center justify-center"
                            title="Sola kaydır"
                          >
                            ‹
                          </button>

                          <button
                            type="button"
                            onClick={() => scrollTimeChart('right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-[30] w-8 h-8 rounded-full bg-white/95 border border-zinc-200 text-zinc-500 shadow-md hover:text-zinc-900 transition-all flex items-center justify-center"
                            title="Sağa kaydır"
                          >
                            ›
                          </button>

                          <div ref={timeChartScrollRef} className="h-full overflow-auto custom-scrollbar min-h-0 overscroll-contain">
                            <div
                              className="grid pb-4"
                              style={{ gridTemplateColumns: `150px repeat(${Math.max(timeChartPeriods.length, 1)}, minmax(${timeChartView === 'Gün' ? '210px' : '250px'}, 1fr))`, minWidth: `${150 + Math.max(timeChartPeriods.length, 1) * (timeChartView === 'Gün' ? 210 : 250)}px` }}
                            >
                              <div className="h-10 border-r border-b border-zinc-100 bg-white px-4 flex items-center text-[11px] font-black text-zinc-500">
                                Üyeler
                              </div>

                              {timeChartPeriods.map((period) => (
                              <div
                                key={`time-head-${period.key}`}
                                className={`h-10 border-r border-b border-zinc-100 px-3 flex flex-col justify-center ${
                                  period.type === 'day' && isSameCalendarDay(period.date, todayStart) ? 'bg-blue-50/50' : 'bg-white'
                                }`}
                              >
                                <div className="text-[11px] font-black text-zinc-700 capitalize">
                                  {period.title}
                                </div>
                                <div className="text-[9px] font-black text-zinc-400 uppercase">
                                  {period.subtitle}
                                </div>
                              </div>
                            ))}

                            {timeChartMembers.map((member) => (
                              <React.Fragment key={member.id}>
                                <div className="min-h-[160px] border-r border-b border-zinc-100 bg-white px-4 py-5 flex flex-col items-center justify-center">
                                  <div className="w-11 h-11 rounded-full bg-[#8c5220] text-white text-[11px] font-black flex items-center justify-center shadow-sm overflow-hidden">
                                    {renderProfileAvatar(member.avatar, createAvatarFromName(member.name))}
                                  </div>
                                  <div className="mt-2 text-[11px] font-black text-zinc-700 text-center">{member.name}</div>
                                  <div className="mt-0.5 text-[9px] font-bold text-zinc-400">{member.role}</div>
                                </div>

                                {timeChartPeriods.map((period) => {
                                  const dayTasks = getTimeChartTasksForMemberAndPeriod(member.id, period);

                                  return (
                                    <div
                                      key={`time-cell-${member.id}-${period.key}`}
                                      className={`min-h-[160px] border-r border-b border-zinc-100 px-2 py-3 ${
                                        period.type === 'day' && (period.date.getDay() === 0 || period.date.getDay() === 6)
                                          ? 'bg-zinc-50/60 bg-[repeating-linear-gradient(135deg,rgba(148,163,184,0.04)_0px,rgba(148,163,184,0.04)_8px,transparent_8px,transparent_16px)]'
                                          : 'bg-white'
                                      }`}
                                    >
                                      {period.type === 'day' && (period.date.getDay() === 0 || period.date.getDay() === 6) ? (
                                        <div className="h-full min-h-[110px] flex items-center justify-center">
                                          <span className="text-[18px] font-black text-zinc-300">Hafta Sonu</span>
                                        </div>
                                      ) : dayTasks.length > 0 ? (
                                        <div className="space-y-2">
                                          {dayTasks.map((task) => (
                                            <button
                                              key={`time-task-${member.id}-${period.key}-${task.id}`}
                                              type="button"
                                              onClick={() => openTaskDetail(task, task.columnTitle)}
                                              className={`w-full rounded-[6px] border px-3 text-left shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all ${getTimeChartTaskColor(task)} ${
                                                timeChartSettings.compactCards ? 'py-2' : 'py-3'
                                              }`}
                                            >
                                              <div className="text-[11px] font-black truncate">{task.title}</div>
                                              <div className="mt-1 text-[9.5px] font-bold opacity-80 truncate">
                                                Proje: {selectedProject}
                                              </div>
                                              <div className="mt-0.5 text-[9.5px] font-bold opacity-80 truncate">
                                                {formatCalendarDate(getTimeChartTaskStartDate(task))} - {formatCalendarDate(getTimeChartTaskEndDate(task))}
                                              </div>
                                            </button>
                                          ))}

                                          <button
                                            type="button"
                                            onClick={(event) => openTaskModalForTimeChartPeriod(period, event)}
                                            className="w-full h-7 rounded-[6px] border border-dashed border-blue-100 bg-zinc-50 text-blue-400 text-[14px] font-black hover:bg-blue-50 transition-all"
                                            title="Bu alana görev ekle"
                                          >
                                            +
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={(event) => openTaskModalForTimeChartPeriod(period, event)}
                                          className="w-full h-full min-h-[110px] rounded-[8px] border border-dashed border-transparent hover:border-blue-200 hover:bg-zinc-50 text-transparent hover:text-blue-400 text-[20px] font-black transition-all"
                                          title="Bu güne görev ekle"
                                        >
                                          +
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </React.Fragment>
                            ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
  );
}
