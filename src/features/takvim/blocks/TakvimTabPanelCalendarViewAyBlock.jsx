import React from 'react';

export default function TakvimTabPanelCalendarViewAyBlock(props) {
  const {
    calendarView,
    calendarGridDays,
    getTasksForCalendarDay,
    calendarMonthDate,
    isSameCalendarDay,
    todayStart,
    data,
    calendar,
    formatDateForTaskModal,
    zrc,
    group,
    min,
    h,
    border,
    b,
    zinc,
    px,
    py,
    relative,
    canCreateTaskFromCalendar,
    transition,
    colors,
    ekle,
    openTaskModalForCalendarDay,
    z,
    rounded,
    flex,
    items,
    center,
    justify,
    w,
    full,
    text,
    font,
    black,
    onMouseDown,
    openTaskDetail,
    left,
    truncate,
    all,
    getCalendarTaskBarStyle,
    getPremiumCalendarTaskStyle,
  } = props;

  return (
    calendarView === 'Ay' && (
                          <div
                            className="grid grid-cols-7 bg-white"
                          >
                            {calendarGridDays.map((day) => {
                              const dayTasks = getTasksForCalendarDay(day);
                              const isCurrentMonth = day.getMonth() === calendarMonthDate.getMonth();
                              const isToday = isSameCalendarDay(day, todayStart);

                              return (
                                <div
                                  key={day.toISOString()}
                                  data-calendar-day={formatDateForTaskModal(day)}
                                  data-zrc-calendar-day={formatDateForTaskModal(day)}
                                  className={`group min-h-[86px] border-r border-b border-zinc-100 last:border-r-0 px-2 py-1.5 relative ${
                                    canCreateTaskFromCalendar ? 'cursor-pointer hover:bg-zinc-50' : 'cursor-default'
                                  } transition-colors ${
                                    isCurrentMonth ? 'bg-white' : 'bg-zinc-50/60'
                                  }`}
                                >
                                  {canCreateTaskFromCalendar && (
                                    <button
                                      type="button"
                                      data-zrc-calendar-day={formatDateForTaskModal(day)}
                                      aria-label={`${day.getDate()} için görev ekle`}
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        openTaskModalForCalendarDay(day);
                                      }}
                                      className="absolute inset-0 z-10 cursor-pointer rounded-[4px]"
                                    />
                                  )}

                                  <div className="relative z-20 pointer-events-none flex items-center justify-between mb-1">
                                    <span
                                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                        isToday
                                          ? 'bg-blue-500 text-white'
                                          : isCurrentMonth
                                            ? 'text-zinc-500'
                                            : 'text-zinc-300'
                                      }`}
                                    >
                                      {day.getDate()}
                                    </span>

                                    {dayTasks.length > 3 ? (
                                      <span className="text-[9px] font-black text-zinc-300">
                                        +{dayTasks.length - 3}
                                      </span>
                                    ) : (
                                      canCreateTaskFromCalendar ? (
                                        <span className="opacity-0 group-hover:opacity-100 text-[13px] leading-none font-black text-blue-400 transition-opacity">
                                          +
                                        </span>
                                      ) : null
                                    )}
                                  </div>

                                  <div className="relative z-30 space-y-1">
                                    {dayTasks.slice(0, 3).map((task) => (
                                      <button
                                        key={`${day.toISOString()}-${task.id}`}
                                        type="button"
                                        data-calendar-task-button="true"
                                        onMouseDown={(event) => event.stopPropagation()}
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          openTaskDetail(task, task.columnTitle);
                                        }}
                                        className={`relative z-40 w-full h-[21px] px-1.5 rounded-[7px] border text-left text-[9px] font-black truncate transition-all ${getCalendarTaskBarStyle(task.priority, task.isArchivedCalendarTask)}`}
                                        style={getPremiumCalendarTaskStyle(task)}
                                        title={task.title}
                                      >
                                        {task.title}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )
  );
}
