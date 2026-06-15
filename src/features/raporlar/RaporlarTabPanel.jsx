import React from 'react';

export default function RaporlarTabPanel(props) {
  const {
    activeTab,
    currentAccountType,
    Raporlar,
    w,
    full,
    flex,
    px,
    items,
    center,
    justify,
    text,
    font,
    black,
    reportIntroText,
    setActiveTab,
    h,
    rounded,
    border,
    Git,
    reportSummaryCards,
    card,
    Genel,
    Tamamlanan,
    toplam,
    reportProgressPercentage,
    reportOpenTasks,
    Dosya,
    reportFileCount,
    reportCustomerCount,
    visibleProjectNames,
    Kolonlara,
    boardColumns,
    kolon,
    reportColumnStats,
    column,
    backgroundColor,
    reportPriorityTitle,
    reportUrgentTasks,
    reportPriorityStats,
    item,
    getReportPriorityStyle,
    reportUpcomingTasks,
    task,
    report,
    upcoming,
    openTaskDetail,
    getRoleAwareTaskMeta,
    formatCalendarDate,
    yok,
    Tarihli,
    burada,
    Gecikenler,
    reportOverdueTasks,
    overdue,
    getReportTaskDate,
    Geciken,
  } = props;

  return (
    activeTab === 'Raporlar' && (
                  <div className="w-full flex-1 bg-[#f5f6f8] overflow-y-auto custom-scrollbar animate-fade-in">
                    <div className="max-w-[1120px] mx-auto px-7 py-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-[18px] font-black text-zinc-800 tracking-tight">Raporlar</h3>
                          <p className="mt-1 text-[11px] font-bold text-zinc-400">
                            {reportIntroText}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveTab('Görevler')}
                          className="h-9 px-4 rounded-full bg-white border border-zinc-200 text-[11px] font-black text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 transition-all"
                        >
                          Görevlere Git
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-3">
                        {reportSummaryCards.map((card) => (
                          <div
                            key={card.title}
                            className="bg-white border border-zinc-200/70 rounded-[14px] p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                          >
                            <div className="flex items-center justify-between">
                              <div className={`w-8 h-8 rounded-[9px] flex items-center justify-center ${card.tone}`}>
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              </div>

                              <span className="text-[20px] font-black text-zinc-800 leading-none">{card.value}</span>
                            </div>

                            <div className="mt-2.5 text-[11.5px] font-black text-zinc-700">{card.title}</div>
                            <div className="mt-0.5 text-[10px] font-bold text-zinc-400">{card.description}</div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-[1fr_320px] gap-4">
                        <div className="space-y-2.5">
                          <div className="bg-white border border-zinc-200/70 rounded-[15px] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="text-[13px] font-black text-zinc-800">Genel İlerleme</h4>
                                <p className="mt-0.5 text-[10.5px] font-bold text-zinc-400">
                                  Tamamlanan görevlerin toplam görevlere oranı.
                                </p>
                              </div>

                              <span className="text-[22px] font-black text-emerald-600">{reportProgressPercentage}%</span>
                            </div>

                            <div className="h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#46b16f] transition-all duration-300"
                                style={{ width: `${reportProgressPercentage}%` }}
                              />
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2">
                              <div className="rounded-[9px] bg-zinc-50 border border-zinc-100 p-2.5">
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em]">Açık</div>
                                <div className="mt-1 text-[15px] font-black text-zinc-800">{reportOpenTasks}</div>
                              </div>

                              <div className="rounded-[9px] bg-zinc-50 border border-zinc-100 p-2.5">
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em]">Dosya</div>
                                <div className="mt-1 text-[15px] font-black text-zinc-800">{reportFileCount}</div>
                              </div>

                              <div className="rounded-[9px] bg-zinc-50 border border-zinc-100 p-2.5">
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em]">
                                  {currentAccountType === 'Patron' ? 'Müşteri' : 'Proje'}
                                </div>
                                <div className="mt-1 text-[15px] font-black text-zinc-800">
                                  {currentAccountType === 'Patron' ? reportCustomerCount : visibleProjectNames.length}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white border border-zinc-200/70 rounded-[15px] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="text-[13px] font-black text-zinc-800">Kolonlara Göre Dağılım</h4>
                                <p className="mt-0.5 text-[10.5px] font-bold text-zinc-400">
                                  Görevlerin aşamalara göre yoğunluğu.
                                </p>
                              </div>

                              <span className="text-[10px] font-black text-zinc-400">{boardColumns.length} kolon</span>
                            </div>

                            <div className="space-y-2.5 max-h-[190px] overflow-y-auto custom-scrollbar pr-1">
                              {reportColumnStats.map((column) => (
                                <div key={column.id}>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: column.color }}
                                      />
                                      <span className="text-[11px] font-black text-zinc-700 truncate">{column.title}</span>
                                    </div>

                                    <span className="text-[10.5px] font-black text-zinc-400">{column.count}</span>
                                  </div>

                                  <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-300"
                                      style={{ width: `${column.percentage}%`, backgroundColor: column.color }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="bg-white border border-zinc-200/70 rounded-[15px] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[13px] font-black text-zinc-800">{reportPriorityTitle}</h4>
                              <span className="text-[10px] font-black text-zinc-400">{reportUrgentTasks.length} önemli</span>
                            </div>

                            <div className="space-y-2.5">
                              {reportPriorityStats.map((item) => (
                                <div key={item.priority}>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className={`h-5 px-2 rounded-full border text-[9px] font-black ${getReportPriorityStyle(item.priority)}`}>
                                      {item.priority}
                                    </span>
                                    <span className="text-[10.5px] font-black text-zinc-400">{item.count}</span>
                                  </div>

                                  <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-zinc-700 transition-all duration-300"
                                      style={{ width: `${item.percentage}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white border border-zinc-200/70 rounded-[15px] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[13px] font-black text-zinc-800">Yaklaşan Görevler</h4>
                              <span className="text-[10px] font-black text-zinc-400">{reportUpcomingTasks.length}</span>
                            </div>

                            <div className="space-y-2">
                              {reportUpcomingTasks.length > 0 ? (
                                reportUpcomingTasks.map((task) => (
                                  <button
                                    key={`report-upcoming-${task.id}`}
                                    type="button"
                                    onClick={() => openTaskDetail(task, task.columnTitle)}
                                    className="w-full text-left rounded-[9px] border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-200 px-3 py-2 transition-all"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0">
                                        <div className="text-[11px] font-black text-zinc-800 truncate">{task.title}</div>
                                        <div className="mt-1 text-[9.5px] font-bold text-zinc-400 truncate">
                                          {getRoleAwareTaskMeta(task)}
                                        </div>
                                      </div>

                                      <span className="shrink-0 text-[9px] font-black text-zinc-400">
                                        {formatCalendarDate(task.reportDate)}
                                      </span>
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="h-[72px] rounded-[10px] border border-dashed border-zinc-200 bg-zinc-50/60 flex items-center justify-center text-center">
                                  <div>
                                    <div className="text-[11px] font-black text-zinc-500">Yaklaşan görev yok</div>
                                    <div className="mt-1 text-[10px] font-bold text-zinc-400">
                                      Tarihli görevler burada görünür.
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-white border border-zinc-200/70 rounded-[15px] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[13px] font-black text-zinc-800">Gecikenler</h4>
                              <span className="text-[10px] font-black text-red-500">
                                {reportOverdueTasks.length > 2 ? `2 / ${reportOverdueTasks.length}` : reportOverdueTasks.length}
                              </span>
                            </div>

                            {reportOverdueTasks.length > 0 ? (
                              <div className="space-y-2">
                                {reportOverdueTasks.slice(0, 2).map((task) => (
                                  <button
                                    key={`report-overdue-${task.id}`}
                                    type="button"
                                    onClick={() => openTaskDetail(task, task.columnTitle)}
                                    className="w-full text-left rounded-[9px] border border-red-100 bg-red-50/50 hover:bg-white px-3 py-2 transition-all"
                                  >
                                    <div className="text-[11px] font-black text-zinc-800 truncate">{task.title}</div>
                                    <div className="mt-1 text-[9.5px] font-bold text-red-400">
                                      {formatCalendarDate(getReportTaskDate(task))}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="h-[54px] rounded-[10px] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[11px] font-black text-emerald-600">
                                Geciken görev yok
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
  );
}
