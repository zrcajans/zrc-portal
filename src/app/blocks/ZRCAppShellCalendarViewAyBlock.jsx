import React from 'react';

export default function ZRCAppShellCalendarViewAyBlock(props) {
  const {
    calendarView,
    Ay,
    grid,
    h,
    bg,
    white,
    border,
    b,
    edf0f4,
    Pzt,
    Sal,
    Per,
    Cum,
    Cmt,
    Paz,
    px,
    flex,
    items,
    center,
    justify,
    text,
    font,
    black,
    repeat,
    calendarGridDays,
    getMenuCalendarTasksForDay,
    getMenuCalendarHolidayLabel,
    calendarMonthDate,
    isSameCalendarDay,
    todayStart,
    menu,
    calendar,
    month,
    handleCalendarDayClick,
    data,
    zrc,
    formatDateForTaskModal,
    relative,
    left,
    overflow,
    hidden,
    f8fbff,
    transition,
    all,
    cursor,
    pointer,
    fbfcfe,
    repeating,
    linear,
    gradient,
    fafafa_0,
    fafafa_6px,
    f6f6f6_6px,
    f6f6f6_12px,
    start,
    between,
    w,
    rounded,
    c5cad3,
    mt,
    leading,
    space,
    openMenuCalendarTask,
    full,
    gap,
    e4e9f1,
    l,
    shadow,
    translate,
    getPremiumCalendarTaskStyle,
    shrink,
    getPremiumCalendarDotStyle,
    current,
    formatMenuCalendarTaskTime,
    min,
    truncate
  } = props;

  return (
    calendarView === 'Ay' && (
                  <>
                    <div className="grid grid-cols-7 h-[32px] bg-white border-b border-[#edf0f4]">
                      {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((dayName) => (
                        <div key={dayName} className="px-3 flex items-center justify-center text-[10px] font-black text-[#9aa3b1] border-r border-[#edf0f4] last:border-r-0">
                          {dayName}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 grid-rows-[repeat(6,92px)] bg-white">
                      {calendarGridDays.map((day) => {
                        const dayTasks = getMenuCalendarTasksForDay(day);
                        const holidayLabel = getMenuCalendarHolidayLabel(day);
                        const isCurrentMonth = day.getMonth() === calendarMonthDate.getMonth();
                        const isToday = isSameCalendarDay(day, todayStart);

                        return (
                          <button
                            key={`menu-calendar-month-${day.toISOString()}`}
                            type="button"
                            onClick={(event) => handleCalendarDayClick(event, day)}
                            data-zrc-calendar-day={formatDateForTaskModal(day)}
                            className={`relative p-1.5 border-r border-b border-[#edf0f4] text-left overflow-hidden hover:bg-[#f8fbff] transition-all cursor-pointer ${
                              isCurrentMonth ? 'bg-white' : 'bg-[#fbfcfe]'
                            } ${holidayLabel ? 'bg-[repeating-linear-gradient(135deg,#fafafa_0,#fafafa_6px,#f6f6f6_6px,#f6f6f6_12px)]' : ''}`}
                          >
                            <div className="flex items-start justify-between">
                              <span
                                className={`w-5 h-5 rounded-[4px] flex items-center justify-center text-[8.5px] font-black ${
                                  isToday
                                    ? 'bg-[#55ace8] text-white'
                                    : isCurrentMonth
                                      ? 'text-[#4b5563]'
                                      : 'text-[#c5cad3]'
                                }`}
                              >
                                {day.getDate()}
                              </span>
                            </div>

                            {holidayLabel && (
                              <div className="mt-1 text-[9.5px] font-black leading-4 text-[#374151] text-center">
                                {holidayLabel}
                              </div>
                            )}

                            <div className="mt-1 space-y-1">
                              {dayTasks.slice(0, 3).map((task) => (
                                <button
                                  key={`menu-month-task-${day.toISOString()}-${task.projectName}-${task.id}`}
                                  type="button"
                                  data-calendar-task-button="true"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openMenuCalendarTask(task);
                                  }}
                                  className="h-[21px] w-full rounded-[7px] px-1.5 flex items-center gap-1.5 overflow-hidden border border-[#e4e9f1] border-l-[3px] bg-white text-left shadow-[0_6px_14px_rgba(15,23,42,0.045)] hover:shadow-[0_9px_18px_rgba(15,23,42,0.075)] hover:-translate-y-[1px] transition-all"
                                  style={getPremiumCalendarTaskStyle(task)}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={getPremiumCalendarDotStyle(task)} />
                                  <span className="text-[7.5px] font-black text-current shrink-0">
                                    {formatMenuCalendarTaskTime(task)}
                                  </span>
                                  <span className="min-w-0 flex-1 text-[8.5px] font-black text-current truncate">
                                    {task.title}
                                  </span>
                                </button>
                              ))}

                              {dayTasks.length > 3 && (
                                <div className="text-[8px] font-black text-[#9aa3b1] px-1">
                                  +{dayTasks.length - 3}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )
  );
}
