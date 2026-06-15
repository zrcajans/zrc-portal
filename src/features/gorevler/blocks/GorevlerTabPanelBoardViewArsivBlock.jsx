import React from 'react';

export default function GorevlerTabPanelBoardViewArsivBlock(props) {
  const {
    boardView,
    currentPermissions,
    currentAccountType,
    w,
    full,
    h,
    animate,
    fade,
    overflow,
    auto,
    custom,
    scrollbar,
    max,
    mx,
    flex,
    items,
    center,
    justify,
    between,
    mb,
    text,
    font,
    black,
    zinc,
    tracking,
    tight,
    bold,
    mt,
    buradan,
    geri,
    getirebilir,
    veya,
    olarak,
    silebilirsin,
    inceleyebilirsin,
    px,
    rounded,
    bg,
    white,
    border,
    gap,
    shadow,
    sm,
    orange,
    none,
    currentColor,
    round,
    M3,
    archivedTasks,
    grid,
    TR,
    digit,
    long,
    numeric,
    Tarih,
    yok,
    transition,
    all,
    hidden,
    left,
    start,
    min,
    leading,
    truncate,
    wrap,
    Eski,
    kolon,
    slate,
    shrink,
    Patron,
    Proje,
    M6,
    t,
    end,
    handleRestoreArchivedTask,
    scale,
    Geri,
    Getir,
    handleDeleteArchivedTask,
    red,
    Sil,
    col,
    burada,
    getirmek,
    tek,
    panoya
  } = props;

  return (
    boardView === 'Arşiv' && (
                        <div className="w-full h-full animate-fade-in p-6 overflow-y-auto custom-scrollbar">
                          <div className="w-full max-w-6xl mx-auto">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h2 className="text-[18px] font-black text-zinc-700 tracking-tight">Arşiv</h2>
                                <p className="text-[11px] font-bold text-zinc-400 mt-1">
                                  {currentPermissions.deleteTasks
                                    ? 'Arşivlenen görevleri buradan geri getirebilir veya kalıcı olarak silebilirsin.'
                                    : 'Arşivlenen görevleri buradan inceleyebilirsin.'}
                                </p>
                              </div>

                              <div className="h-9 px-3.5 rounded-full bg-white border border-zinc-200 text-[10.5px] font-black text-zinc-500 flex items-center gap-2 shadow-sm">
                                <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M5.25 7.5v11.25A1.5 1.5 0 006.75 20.25h10.5a1.5 1.5 0 001.5-1.5V7.5M9 11.25h6" />
                                </svg>
                                {archivedTasks.length} görev
                              </div>
                            </div>

                            {archivedTasks.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {archivedTasks.map((task) => {
                                  const archivedDate = task.archivedAt
                                    ? new Date(task.archivedAt).toLocaleString('tr-TR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    : 'Tarih yok';

                                  return (
                                    <div
                                      key={task.id}
                                      className="w-full bg-white rounded-[12px] border border-zinc-200 shadow-[0_8px_24px_rgba(15,23,42,0.045)] hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)] transition-all overflow-hidden text-left"
                                    >
                                      <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="min-w-0">
                                            <h4 className="text-[12.5px] font-black text-zinc-800 leading-tight truncate">
                                              {task.title}
                                            </h4>

                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                              <span className="h-6 px-2.5 rounded-full bg-zinc-100 text-zinc-700 text-[9.5px] font-black flex items-center">
                                                {task.sourceColumnTitle || 'Eski kolon'}
                                              </span>

                                              {task.priority && (
                                                <span className="h-6 px-2.5 rounded-full bg-slate-50 text-slate-500 text-[9.5px] font-black flex items-center">
                                                  {task.priority}
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M5.25 7.5v11.25A1.5 1.5 0 006.75 20.25h10.5a1.5 1.5 0 001.5-1.5V7.5M9 11.25h6" />
                                            </svg>
                                          </div>
                                        </div>

                                        {currentAccountType === 'Patron' && task.customer && task.customer !== 'Müşteri Seçin...' && (
                                          <div className="mt-3 text-[11px] font-bold text-zinc-500">
                                            {currentAccountType === 'Patron' ? 'Müşteri' : 'Proje'}: <span className="text-zinc-700">{task.customer}</span>
                                          </div>
                                        )}

                                        {(task.startDate || task.endDate || task.date) && (
                                          <div className="mt-2 text-[10.5px] font-bold text-zinc-400 flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5A1.5 1.5 0 0120.25 6.75v12A1.5 1.5 0 0118.75 20.25H5.25A1.5 1.5 0 013.75 18.75v-12A1.5 1.5 0 015.25 5.25z" />
                                            </svg>
                                            <span>{task.startDate || task.date}{task.endDate ? ` - ${task.endDate}` : ''}</span>
                                          </div>
                                        )}

                                        <div className="mt-3 text-[10.5px] font-bold text-zinc-400">
                                          Arşivlenme: <span className="text-zinc-500">{archivedDate}</span>
                                        </div>
                                      </div>

                                      {currentPermissions.deleteTasks && (
                                        <div className="h-[48px] px-3 border-t border-zinc-100 bg-zinc-50/55 flex items-center justify-end gap-2">
                                          <button
                                            type="button"
                                            onClick={() => handleRestoreArchivedTask(task)}
                                            className="h-8 px-3 rounded-[8px] bg-[#10b981] hover:bg-[#059669] text-white text-[10.5px] font-black shadow-sm transition-all active:scale-[0.98]"
                                          >
                                            Geri Getir
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => handleDeleteArchivedTask(task.id)}
                                            className="h-8 px-3 rounded-[8px] bg-white border border-red-100 text-red-500 hover:bg-red-50 text-[10.5px] font-black shadow-sm transition-all active:scale-[0.98]"
                                          >
                                            Kalıcı Sil
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="h-[420px] bg-white border border-zinc-200 rounded-[14px] shadow-[0_8px_24px_rgba(15,23,42,0.04)] flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center mb-3">
                                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M5.25 7.5v11.25A1.5 1.5 0 006.75 20.25h10.5a1.5 1.5 0 001.5-1.5V7.5M9 11.25h6" />
                                  </svg>
                                </div>

                                <div className="text-[14px] font-black text-zinc-700">Arşiv boş</div>
                                <div className="text-[11px] font-bold text-zinc-400 mt-1 max-w-[340px]">
                                  Arşivlediğin görevler burada görünecek. Geri getirmek istediğinde tek tıkla panoya taşıyabilirsin.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
  );
}
