import React from 'react';

export default function GanttCizelgesiTabPanel(props) {
  const ctx = props?.ctx || {};

  const {
    activeTab,
    currentAccountType,
    Gantt,
    w,
    full,
    flex,
    bg,
    f5f6f8,
    overflow,
    auto,
    custom,
    scrollbar,
    animate,
    fade,
    px,
    py,
    white,
    border,
    zinc,
    rounded,
    shadow,
    hidden,
    h,
    b,
    items,
    center,
    justify,
    between,
    gap,
    text,
    blue,
    none,
    currentColor,
    round,
    M21,
    ganttSearch,
    setGanttSearch,
    ganttSearchPlaceholder,
    transparent,
    font,
    bold,
    focus,
    outline,
    setGanttShowCompleted,
    prev,
    black,
    transition,
    all,
    ganttShowCompleted,
    emerald,
    hover,
    Tamamlananlar,
    goToPreviousGanttPeriod,
    min,
    capitalize,
    ganttRangeTitle,
    ganttTasks,
    goToNextGanttPeriod,
    Sonraki,
    goToCurrentGanttPeriod,
    Hafta,
    Ay,
    view,
    changeGanttView,
    ganttView,
    sm,
    relative,
    scrollGantt,
    left,
    absolute,
    top,
    translate,
    z,
    md,
    Sola,
    right,
    ref,
    ganttScrollRef,
    grid,
    gridTemplateColumns,
    repeat,
    ganttPeriods,
    minmax,
    ganttPeriodConfig,
    minWidth,
    sticky,
    period,
    gantt,
    head,
    col,
    todayStart,
    truncate,
    uppercase,
    task,
    getGanttTaskPlacement,
    row,
    openTaskDetail,
    shrink,
    getPremiumCalendarDotStyle,
    mt,
    getRoleAwareTaskMeta,
    gridColumn,
    cell,
    self,
    mx,
    getGanttBarClassName,
    formatCalendarDate,
    mb,
    M3,
    Bu,
    yok,
    Patron,
    veya,
    tarihi,
    olan,
    burada,
    olarak,
    Tarihi,
    ganttUndatedTasks,
    Tarihsiz,
    ekle,
    bulunmuyor,
    undated
  } = ctx;

  return (
    activeTab === 'Gantt Çizelgesi' && (
                  <div className="w-full flex-1 bg-[#f5f6f8] overflow-y-auto custom-scrollbar animate-fade-in">
                    <div className="px-6 py-5">
                      <div className="bg-white border border-zinc-200/70 rounded-[14px] shadow-[0_10px_32px_rgba(15,23,42,0.045)] overflow-hidden">
                        <div className="h-[60px] px-4 border-b border-zinc-100 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-[230px] h-8 rounded-[8px] bg-white border border-zinc-200 flex items-center px-2.5 gap-2">
                              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                              </svg>
                              <input
                                value={ganttSearch}
                                onChange={(event) => setGanttSearch(event.target.value)}
                                placeholder={ganttSearchPlaceholder}
                                className="w-full bg-transparent text-[11px] font-bold text-zinc-600 placeholder:text-zinc-300 focus:outline-none"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => setGanttShowCompleted((prev) => !prev)}
                              className={`h-8 px-3 rounded-full border text-[10px] font-black transition-all ${
                                ganttShowCompleted
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                  : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-700'
                              }`}
                            >
                              Tamamlananlar
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={goToPreviousGanttPeriod}
                                className="w-8 h-8 rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center justify-center"
                                title="Önceki"
                              >
                                ‹
                              </button>

                              <div className="min-w-[165px] text-center">
                                <div className="text-[12px] font-black text-zinc-800 capitalize">{ganttRangeTitle}</div>
                                <div className="text-[9px] font-bold text-zinc-400">{ganttTasks.length} görev</div>
                              </div>

                              <button
                                type="button"
                                onClick={goToNextGanttPeriod}
                                className="w-8 h-8 rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center justify-center"
                                title="Sonraki"
                              >
                                ›
                              </button>

                              <button
                                type="button"
                                onClick={goToCurrentGanttPeriod}
                                className="h-7 px-3 rounded-full bg-zinc-100 text-[9.5px] font-black text-zinc-400 hover:text-zinc-700 transition-all"
                              >
                                Bugün
                              </button>
                            </div>

                            <div className="flex items-center gap-1 rounded-full bg-zinc-100 p-1">
                              {['Gün', 'Hafta', 'Ay'].map((view) => (
                                <button
                                  key={view}
                                  type="button"
                                  onClick={() => changeGanttView(view)}
                                  className={`h-7 px-3 rounded-full text-[10px] font-black transition-all ${
                                    ganttView === view
                                      ? 'bg-[#2563eb] text-white shadow-sm'
                                      : 'text-zinc-400 hover:text-zinc-700'
                                  }`}
                                >
                                  {view}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="relative bg-white">
                          <button
                            type="button"
                            onClick={() => scrollGantt('left')}
                            className="absolute left-[268px] top-[52%] -translate-y-1/2 z-[30] w-8 h-8 rounded-full bg-white/95 border border-zinc-200 text-zinc-500 shadow-md hover:text-zinc-900 transition-all flex items-center justify-center"
                            title="Sola kaydır"
                          >
                            ‹
                          </button>

                          <button
                            type="button"
                            onClick={() => scrollGantt('right')}
                            className="absolute right-2 top-[52%] -translate-y-1/2 z-[30] w-8 h-8 rounded-full bg-white/95 border border-zinc-200 text-zinc-500 shadow-md hover:text-zinc-900 transition-all flex items-center justify-center"
                            title="Sağa kaydır"
                          >
                            ›
                          </button>

                          <div ref={ganttScrollRef} className="overflow-x-auto custom-scrollbar">
                            <div
                              className="grid"
                              style={{
                                gridTemplateColumns: `260px repeat(${Math.max(ganttPeriods.length, 1)}, minmax(${ganttPeriodConfig.width}px, 1fr))`,
                                minWidth: `${260 + Math.max(ganttPeriods.length, 1) * ganttPeriodConfig.width}px`
                              }}
                            >
                              <div className="h-11 sticky left-0 z-[20] bg-white border-r border-b border-zinc-100 px-4 flex items-center text-[11px] font-black text-zinc-500">
                                Görevler
                              </div>

                              {ganttPeriods.map((period) => (
                                <div
                                  key={`gantt-head-${period.key}`}
                                  className={`h-11 border-r border-b border-zinc-100 px-3 flex flex-col justify-center ${
                                    period.start <= todayStart && period.end >= todayStart ? 'bg-blue-50/50' : 'bg-white'
                                  }`}
                                >
                                  <div className="text-[11px] font-black text-zinc-700 capitalize truncate">{period.title}</div>
                                  <div className="text-[9px] font-black text-zinc-400 uppercase">{period.subtitle}</div>
                                </div>
                              ))}

                              {ganttTasks.length > 0 ? (
                                ganttTasks.map((task) => {
                                  const placement = getGanttTaskPlacement(task);

                                  return (
                                    <React.Fragment key={`gantt-row-${task.id}`}>
                                      <button
                                        type="button"
                                        onClick={() => openTaskDetail(task, task.columnTitle)}
                                        className="h-[58px] sticky left-0 z-[15] bg-white border-r border-b border-zinc-100 px-4 text-left hover:bg-zinc-50 transition-all"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <span
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={getPremiumCalendarDotStyle(task)}
                                          />
                                          <div className="min-w-0">
                                            <div className="text-[11.5px] font-black text-zinc-800 truncate">{task.title}</div>
                                            <div className="mt-0.5 text-[9.5px] font-bold text-zinc-400 truncate">
                                              {getRoleAwareTaskMeta(task)}
                                            </div>
                                          </div>
                                        </div>
                                      </button>

                                      <div
                                        className="h-[58px] grid relative border-b border-zinc-100"
                                        style={{
                                          gridColumn: `2 / span ${Math.max(ganttPeriods.length, 1)}`,
                                          gridTemplateColumns: `repeat(${Math.max(ganttPeriods.length, 1)}, minmax(${ganttPeriodConfig.width}px, 1fr))`
                                        }}
                                      >
                                        {ganttPeriods.map((period) => (
                                          <div
                                            key={`gantt-cell-${task.id}-${period.key}`}
                                            className={`border-r border-zinc-100 ${
                                              period.start <= todayStart && period.end >= todayStart ? 'bg-zinc-50' : 'bg-white'
                                            }`}
                                          />
                                        ))}

                                        <button
                                          type="button"
                                          onClick={() => openTaskDetail(task, task.columnTitle)}
                                          className={`relative z-[10] self-center h-8 rounded-[7px] border px-3 mx-1 text-left shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all ${getGanttBarClassName(task)}`}
                                          style={{ gridColumn: `${placement.columnStart} / span ${placement.span}` }}
                                          title={`${task.title} · ${formatCalendarDate(task.ganttStartDate)} - ${formatCalendarDate(task.ganttEndDate)}`}
                                        >
                                          <div className="flex items-center justify-between gap-2 min-w-0">
                                            <span className="text-[10.5px] font-black truncate">{task.title}</span>
                                            <span className="text-[9px] font-black opacity-70 shrink-0">
                                              {formatCalendarDate(task.ganttStartDate)}
                                            </span>
                                          </div>
                                        </button>
                                      </div>
                                    </React.Fragment>
                                  );
                                })
                              ) : (
                                <div
                                  className="col-span-full h-[260px] bg-white flex flex-col items-center justify-center text-center"
                                  style={{ gridColumn: `1 / span ${Math.max(ganttPeriods.length + 1, 2)}` }}
                                >
                                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 11h12M8 15h8M10 19h4" />
                                    </svg>
                                  </div>
                                  <div className="text-[13px] font-black text-zinc-700">Bu aralıkta Gantt görevi yok</div>
                                  <div className="text-[10.5px] font-bold text-zinc-400 mt-1">
                                    {currentAccountType === 'Patron'
                                      ? 'Başlangıç veya bitiş tarihi olan görevler burada çubuk olarak görünür.'
                                      : 'Tarihi olan görünür görevler burada çubuk olarak görünür.'}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {ganttUndatedTasks.length > 0 && (
                        <div className="mt-4 bg-white border border-zinc-200/70 rounded-[14px] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-[13px] font-black text-zinc-800">Tarihsiz Görevler</h4>
                              <p className="mt-0.5 text-[10.5px] font-bold text-zinc-400">
                                {currentAccountType === 'Patron'
                                  ? 'Gantt üzerinde görünmesi için başlangıç veya bitiş tarihi ekle.'
                                  : 'Bu görevlerde başlangıç veya bitiş tarihi bulunmuyor.'}
                              </p>
                            </div>

                            <span className="text-[10px] font-black text-zinc-400">{ganttUndatedTasks.length}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {ganttUndatedTasks.slice(0, 6).map((task) => (
                              <button
                                key={`gantt-undated-${task.id}`}
                                type="button"
                                onClick={() => openTaskDetail(task, task.columnTitle)}
                                className="rounded-[10px] border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-200 p-3 text-left transition-all"
                              >
                                <div className="text-[11px] font-black text-zinc-800 truncate">{task.title}</div>
                                <div className="mt-1 text-[9.5px] font-bold text-zinc-400 truncate">
                                  {getRoleAwareTaskMeta(task)}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
  );
}
