import React from 'react';

export default function ZRCAppShellCalendarViewHaftaBlock(props) {
  const {
    calendarView,
    Hafta,
    bg,
    white,
    grid,
    h,
    border,
    b,
    edf0f4,
    calendarWeekDays,
    week,
    head,
    setCalendarFocusedDate,
    text,
    center,
    font,
    black,
    formatCalendarDate,
    formatCalendarWeekday,
    px,
    flex,
    items,
    bold,
    getMenuCalendarAllDayTasks,
    getMenuCalendarHolidayLabel,
    allday,
    data,
    zrc,
    calendar,
    formatDateForTaskModal,
    openHomeCalendarQuickTaskForDate,
    gap,
    overflow,
    hidden,
    cursor,
    pointer,
    f8fbff,
    repeating,
    linear,
    gradient,
    fafafa_0,
    fafafa_6px,
    f6f6f6_6px,
    f6f6f6_12px,
    truncate,
    openMenuCalendarTask,
    w,
    full,
    rounded,
    e4e9f1,
    l,
    left,
    current,
    shadow,
    getPremiumCalendarTaskStyle,
    max,
    auto,
    custom,
    scrollbar,
    menuCalendarHours,
    pt,
    semibold,
    getMenuCalendarTasksForHour,
    relative,
    fff_0,
    fff_8px,
    fbfbfb_8px,
    fbfbfb_16px,
    absolute,
    right,
    top,
    min,
    py,
    transition,
    all,
    formatMenuCalendarTaskTime
  } = props;

  return (
    calendarView === 'Hafta' && (
                  <div className="bg-white">
                    <div className="grid grid-cols-[54px_repeat(7,1fr)] h-[36px] border-b border-[#edf0f4]">
                      <div className="border-r border-[#edf0f4]" />
                      {calendarWeekDays.map((day) => (
                        <button
                          key={`week-head-${day.toISOString()}`}
                          type="button"
                          onClick={() => setCalendarFocusedDate(day)}
                          className="border-r border-[#edf0f4] last:border-r-0 text-center text-[10px] font-black text-[#9aa3b1]"
                        >
                          {formatCalendarDate(day)} {formatCalendarWeekday(day)}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-[54px_repeat(7,1fr)] h-[32px] border-b border-[#edf0f4]">
                      <div className="px-2 flex items-center text-[10px] font-bold text-[#4b5563] border-r border-[#edf0f4]">
                        Tüm Gün
                      </div>
                      {calendarWeekDays.map((day) => {
                        const allDayTasks = getMenuCalendarAllDayTasks(day);
                        const holidayLabel = getMenuCalendarHolidayLabel(day);

                        return (
                          <div
                            key={`week-allday-${day.toISOString()}`}
                            data-zrc-calendar-day={formatDateForTaskModal(day)}
                            onClick={(event) => openHomeCalendarQuickTaskForDate(day, event)}
                            className={`px-2 flex items-center gap-1 border-r border-[#edf0f4] last:border-r-0 overflow-hidden cursor-pointer hover:bg-[#f8fbff] ${
                              holidayLabel ? 'bg-[repeating-linear-gradient(135deg,#fafafa_0,#fafafa_6px,#f6f6f6_6px,#f6f6f6_12px)]' : ''
                            }`}
                          >
                            {holidayLabel ? (
                              <span className="text-[9px] font-black text-[#374151] truncate">{holidayLabel}</span>
                            ) : allDayTasks[0] ? (
                              <button
                                type="button"
                                data-calendar-task-button="true"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openMenuCalendarTask(allDayTasks[0]);
                                }}
                                className="h-[22px] w-full rounded-[7px] border border-[#e4e9f1] border-l-[3px] bg-white px-2 text-left text-[8px] font-black text-current truncate shadow-[0_6px_14px_rgba(15,23,42,0.045)]"
                                style={getPremiumCalendarTaskStyle(allDayTasks[0])}
                              >
                                {allDayTasks[0].title}
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>

                    <div className="max-h-[560px] overflow-y-auto custom-scrollbar">
                      {menuCalendarHours.map((hour) => (
                        <div key={`week-hour-${hour}`} className="grid grid-cols-[54px_repeat(7,1fr)] h-[48px] border-b border-[#edf0f4]">
                          <div className="px-2 pt-1.5 text-[10px] font-semibold text-[#4b5563] border-r border-[#edf0f4]">
                            {hour}:00
                          </div>
                          {calendarWeekDays.map((day) => {
                            const hourTasks = getMenuCalendarTasksForHour(day, hour);

                            return (
                              <div
                                key={`week-hour-${day.toISOString()}-${hour}`}
                                data-zrc-calendar-day={formatDateForTaskModal(day)}
                                onClick={(event) => openHomeCalendarQuickTaskForDate(day, event)}
                                className="relative border-r border-[#edf0f4] last:border-r-0 bg-[repeating-linear-gradient(135deg,#fff_0,#fff_8px,#fbfbfb_8px,#fbfbfb_16px)] cursor-pointer hover:bg-[#f8fbff]"
                              >
                                {hourTasks.slice(0, 2).map((task) => (
                                  <button
                                    key={`week-task-${task.projectName}-${task.id}`}
                                    type="button"
                                    data-calendar-task-button="true"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openMenuCalendarTask(task);
                                    }}
                                    className="absolute left-1 right-1 top-1 min-h-[32px] rounded-[8px] border border-[#e4e9f1] border-l-[3px] bg-white px-2 py-1 text-left text-[8px] font-black text-current overflow-hidden shadow-[0_8px_18px_rgba(15,23,42,0.055)] hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition-all"
                                    style={getPremiumCalendarTaskStyle(task)}
                                  >
                                    <div className="opacity-80">{formatMenuCalendarTaskTime(task)}</div>
                                    <div className="truncate">{task.title}</div>
                                  </button>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )
  );
}
