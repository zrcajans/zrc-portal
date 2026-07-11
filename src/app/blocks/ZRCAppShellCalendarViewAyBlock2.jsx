import React from 'react';

export default function ZRCAppShellCalendarViewAyBlock2(props) {
  const {
    calendarView,
    Ay,
    grid,
    h,
    bg,
    white,
    border,
    b,
    eceff4,
    Pzt,
    Sal,
    Per,
    Cum,
    Cmt,
    Paz,
    home,
    calendar,
    head,
    flex,
    items,
    center,
    justify,
    text,
    font,
    semibold,
    repeat,
    calendarGridDays,
    getMenuCalendarTasksForDay,
    calendarMonthDate,
    isSameCalendarDay,
    todayStart,
    month,
    tabIndex,
    data,
    zrc,
    formatDateForTaskModal,
    openHomeCalendarQuickTaskForDate,
    onMouseUp,
    Enter,
    min,
    px,
    py,
    left,
    transition,
    all,
    fafcff,
    overflow,
    hidden,
    cursor,
    pointer,
    fbfcfe,
    start,
    end,
    w,
    rounded,
    full,
    c4cbd5,
    mt,
    space,
    cal,
    openMenuCalendarTask,
    gap,
    e4e9f1,
    l,
    shadow,
    getPremiumCalendarTaskStyle,
    shrink,
    getPremiumCalendarDotStyle,
    black,
    current,
    truncate,
    formatMenuCalendarTaskTime,
    bold,
    b8bfca
  } = props;

  return (
    calendarView === 'Ay' && (
                      <>
                        <div className="grid grid-cols-7 h-[36px] bg-white border-b border-[#eceff4]">
                          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((dayName) => (
                            <div
                              key={`home-calendar-head-${dayName}`}
                              className="border-r border-[#eceff4] last:border-r-0 flex items-center justify-center text-[13px] font-semibold text-[#9aa4b2]"
                            >
                              {dayName}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 grid-rows-[repeat(6,93px)]">
                          {calendarGridDays.map((day) => {
                            const dayTasks = getMenuCalendarTasksForDay(day);
                            const isCurrentMonth = day.getMonth() === calendarMonthDate.getMonth();
                            const isToday = isSameCalendarDay(day, todayStart);

                            return (
                              <div
                                key={`home-calendar-month-${day.toISOString()}`}
                                role="button"
                                tabIndex={0}
                                data-zrc-calendar-day={formatDateForTaskModal(day)}
                                onClick={(event) => openHomeCalendarQuickTaskForDate(day, event)}
                                onMouseUp={(event) => {
                                  if (event.target?.closest?.('[data-calendar-task-button="true"]')) return;
                                  openHomeCalendarQuickTaskForDate(day, event);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    openHomeCalendarQuickTaskForDate(day, event);
                                  }
                                }}
                                className={`min-h-0 border-r border-b border-[#eceff4] px-3 py-2 text-left transition-all hover:bg-[#fafcff] overflow-hidden cursor-pointer ${
                                  isCurrentMonth ? 'bg-white' : 'bg-[#fbfcfe]'
                                }`}
                              >
                                <div className="flex items-start justify-end">
                                  <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[13px] font-semibold ${
                                      isToday
                                        ? 'bg-[#56a8e8] text-white'
                                        : isCurrentMonth
                                          ? 'text-[#293241]'
                                          : 'text-[#c4cbd5]'
                                    }`}
                                  >
                                    {day.getDate()}
                                  </span>
                                </div>

                                <div className="mt-2 space-y-1">
                                  {dayTasks.slice(0, 3).map((task) => (
                                    <button
                                      key={`home-cal-task-${day.toISOString()}-${task.projectName}-${task.id}`}
                                      type="button"
                                      data-calendar-task-button="true"
                                      onMouseUp={(event) => event.stopPropagation()}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        openMenuCalendarTask(task);
                                      }}
                                      title={getPremiumCalendarTaskTooltip(task)}
                                      className="w-full h-[8px] overflow-hidden rounded-full border border-transparent border-l-[4px] text-left transition-all hover:opacity-85"
                                      style={getPremiumCalendarLineStyle(task)}
                                    >
                                      <span className="sr-only">{getPremiumCalendarTaskTooltip(task)}</span>
                                    </button>
                                  ))}

                                  {dayTasks.length > 3 && (
                                    <div className="text-[8px] font-bold text-[#b8bfca] px-1">
                                      +{dayTasks.length - 3}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )
  );
}
