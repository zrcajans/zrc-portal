import React from 'react';

export default function TakvimTabPanelCalendarViewGunBlock(props) {
  const {
    calendarView,
    canCreateTaskFromCalendar,
    handleCalendarDayClick,
    calendarFocusedDate,
    tabIndex,
    min,
    h,
    bg,
    white,
    transition,
    colors,
    text,
    font,
    black,
    formatCalendarFullDate,
    calendarDayHelperText,
    data,
    calendar,
    onMouseDown,
    openTaskModalForCalendarDay,
    px,
    rounded,
    full,
    Bu,
    Ekle,
    selectedDayCalendarTasks,
    day,
    openTaskDetail,
    border,
    getPremiumCalendarTaskStyle,
    getRoleAwareTaskMeta,
    shrink,
    getCalendarTaskBarStyle,
    yok,
  } = props;

  return (
    calendarView === 'Gün' && (
                          <div
                            onClick={(event) => {
                              if (!canCreateTaskFromCalendar) return;
                              handleCalendarDayClick(event, calendarFocusedDate);
                            }}
                            role="button"
                            tabIndex={0}
                            className={`min-h-[430px] bg-white p-5 transition-colors ${
                              canCreateTaskFromCalendar ? 'cursor-pointer hover:bg-zinc-50' : 'cursor-default'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-[13px] font-black text-zinc-800 capitalize">{formatCalendarFullDate(calendarFocusedDate)}</div>
                                <div className="mt-1 text-[10.5px] font-bold text-zinc-400">{calendarDayHelperText}</div>
                              </div>

                              {canCreateTaskFromCalendar && (
                                <button
                                  type="button"
                                  data-calendar-task-button="true"
                                  onMouseDown={(event) => event.stopPropagation()}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openTaskModalForCalendarDay(calendarFocusedDate);
                                  }}
                                  className="h-8 px-3.5 rounded-full bg-[#2563eb] text-white text-[10.5px] font-black hover:bg-[#1d4ed8] transition-all"
                                >
                                  Bu Güne Görev Ekle
                                </button>
                              )}
                            </div>

                            <div className="space-y-2">
                              {selectedDayCalendarTasks.map((task) => (
                                <button
                                  key={`day-task-${task.id}`}
                                  type="button"
                                  onMouseDown={(event) => event.stopPropagation()}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openTaskDetail(task, task.columnTitle);
                                  }}
                                  className="w-full bg-white border border-zinc-200 border-l-[3px] rounded-[10px] p-3 text-left hover:border-zinc-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all"
                                  style={getPremiumCalendarTaskStyle(task)}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="text-[12px] font-black text-zinc-800 truncate">{task.title}</div>
                                      <div className="mt-1 text-[10px] font-bold text-zinc-400 truncate">
                                        {getRoleAwareTaskMeta(task)}
                                      </div>
                                    </div>

                                    <span className={`shrink-0 h-5 px-2 rounded-full border text-[9px] font-black ${getCalendarTaskBarStyle(task.priority, task.isArchivedCalendarTask)}`}>
                                      {task.priority || 'Normal'}
                                    </span>
                                  </div>
                                </button>
                              ))}

                              {selectedDayCalendarTasks.length === 0 && (
                                <div className="h-[180px] rounded-[12px] border border-dashed border-zinc-200 bg-zinc-50/60 flex items-center justify-center text-[11px] font-bold text-zinc-400">
                                  Bu gün için görev yok.
                                </div>
                              )}
                            </div>
                          </div>
                        )
  );
}
