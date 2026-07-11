import React from 'react';

export default function ZRCAppShellCalendarViewGunBlock(props) {
  const {
    calendarView,
    bg,
    white,
    data,
    zrc,
    calendar,
    day,
    formatDateForTaskModal,
    calendarFocusedDate,
    openHomeCalendarQuickTaskForDate,
    w,
    full,
    h,
    grid,
    border,
    b,
    edf0f4,
    fafcff,
    transition,
    all,
    flex,
    items,
    center,
    justify,
    text,
    font,
    bold,
    formatCalendarWeekday,
    px,
    cursor,
    pointer,
    getMenuCalendarAllDayTasks,
    home,
    allday,
    openMenuCalendarTask,
    mr,
    rounded,
    e4e9f1,
    l,
    left,
    black,
    current,
    truncate,
    shadow,
    getPremiumCalendarTaskStyle,
    max,
    overflow,
    auto,
    custom,
    scrollbar,
    menuCalendarHours,
    getMenuCalendarTasksForHour,
    pt,
    semibold,
    relative,
    repeating,
    linear,
    gradient,
    fff_0,
    fff_8px,
    fbfbfb_8px,
    fbfbfb_16px,
    absolute,
    right,
    top,
    min,
    py,
    hidden,
    formatMenuCalendarTaskTime
  } = props;

  return (
    calendarView === 'Gün' && (
                      <div className="bg-white">
                        <button
                          type="button"
                          data-zrc-calendar-day={formatDateForTaskModal(calendarFocusedDate)}
                          onClick={(event) => openHomeCalendarQuickTaskForDate(calendarFocusedDate, event)}
                          className="w-full h-[36px] grid grid-cols-[54px_1fr] border-b border-[#edf0f4] hover:bg-[#fafcff] transition-all"
                        >
                          <div className="border-r border-[#edf0f4]" />
                          <div className="flex items-center justify-center text-[10px] font-bold text-[#9aa3b1]">
                            {formatCalendarWeekday(calendarFocusedDate)}
                          </div>
                        </button>

                        <div className="h-[34px] grid grid-cols-[54px_1fr] border-b border-[#edf0f4]">
                          <div className="px-2 flex items-center text-[10px] font-bold text-[#4b5563] border-r border-[#edf0f4]">
                            Tüm Gün
                          </div>
                          <div
                            data-zrc-calendar-day={formatDateForTaskModal(calendarFocusedDate)}
                            onClick={(event) => openHomeCalendarQuickTaskForDate(calendarFocusedDate, event)}
                            className="px-2 flex items-center cursor-pointer hover:bg-[#fafcff]"
                          >
                            {getMenuCalendarAllDayTasks(calendarFocusedDate).slice(0, 2).map((task) => (
                              <button
                                key={`home-day-allday-${task.projectName}-${task.id}`}
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openMenuCalendarTask(task);
                                }}
                                data-calendar-task-button="true"
                                className="h-[22px] mr-1 rounded-[7px] border border-[#e4e9f1] border-l-[3px] bg-white px-2 text-left text-[8px] font-black text-current truncate shadow-[0_6px_14px_rgba(15,23,42,0.045)]"
                                style={getPremiumCalendarTaskStyle(task)}
                              >
                                {task.title}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="max-h-[528px] overflow-y-auto custom-scrollbar">
                          {menuCalendarHours.map((hour) => {
                            const hourTasks = getMenuCalendarTasksForHour(calendarFocusedDate, hour);

                            return (
                              <div key={`home-day-hour-${hour}`} className="grid grid-cols-[54px_1fr] h-[48px] border-b border-[#edf0f4]">
                                <div className="px-2 pt-1.5 text-[10px] font-semibold text-[#4b5563] border-r border-[#edf0f4]">
                                  {hour}:00
                                </div>
                                <div
                                  data-zrc-calendar-day={formatDateForTaskModal(calendarFocusedDate)}
                                  onClick={(event) => openHomeCalendarQuickTaskForDate(calendarFocusedDate, event)}
                                  className="relative bg-[repeating-linear-gradient(135deg,#fff_0,#fff_8px,#fbfbfb_8px,#fbfbfb_16px)] cursor-pointer hover:bg-[#fafcff]"
                                >
                                  {hourTasks.map((task) => (
                                    <button
                                      key={`home-day-task-${task.projectName}-${task.id}`}
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        openMenuCalendarTask(task);
                                      }}
                                      title={getPremiumCalendarTaskTooltip(task)}
                                      className="absolute left-1 right-6 top-2 h-[8px] rounded-full border border-transparent border-l-[4px] text-left overflow-hidden transition-all hover:opacity-85"
                                      style={getPremiumCalendarLineStyle(task)}
                                    >
                                      <span className="sr-only">{getPremiumCalendarTaskTooltip(task)}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
  );
}
