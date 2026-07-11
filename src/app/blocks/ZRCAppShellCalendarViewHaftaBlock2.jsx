import React from 'react';

export default function ZRCAppShellCalendarViewHaftaBlock2(props) {
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
    isSameCalendarDay,
    todayStart,
    home,
    week,
    head,
    data,
    zrc,
    calendar,
    formatDateForTaskModal,
    openHomeCalendarQuickTaskForDate,
    text,
    center,
    font,
    bold,
    transition,
    all,
    f8fbff,
    fafcff,
    formatCalendarDate,
    formatCalendarWeekday,
    px,
    flex,
    items,
    getMenuCalendarAllDayTasks,
    allday,
    gap,
    overflow,
    hidden,
    cursor,
    pointer,
    onPointerUp,
    openMenuCalendarTask,
    w,
    full,
    rounded,
    left,
    black,
    current,
    truncate,
    max,
    auto,
    custom,
    scrollbar,
    menuCalendarHours,
    pt,
    semibold,
    getMenuCalendarTasksForHour,
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
    e4e9f1,
    l,
    py,
    shadow,
    getPremiumCalendarLineStyle,
    getPremiumCalendarTaskStyle,
    getPremiumCalendarTaskTooltip,
    formatMenuCalendarTaskTime
  } = props;

  const getCalendarTaskKey = (task = {}) => `${task.projectName || ''}-${task.id || task.supabaseId || task.title || 'task'}`;
  const weekHourLayouts = menuCalendarHours.map((hour) => {
    const dayTasksByKey = new Map();
    const laneByTaskKey = new Map();

    calendarWeekDays.forEach((day) => {
      const dayKey = day.toISOString();
      const hourTasks = getMenuCalendarTasksForHour(day, hour);
      dayTasksByKey.set(dayKey, hourTasks);

      hourTasks.forEach((task) => {
        const taskKey = getCalendarTaskKey(task);
        if (!laneByTaskKey.has(taskKey)) laneByTaskKey.set(taskKey, laneByTaskKey.size);
      });
    });

    return { dayTasksByKey, laneByTaskKey };
  });

  return (
    calendarView === 'Hafta' && (
                      <div className="bg-white">
                        <div className="grid grid-cols-[54px_repeat(7,1fr)] h-[36px] border-b border-[#edf0f4]">
                          <div className="border-r border-[#edf0f4]" />
                          {calendarWeekDays.map((day) => {
                            const isToday = isSameCalendarDay(day, todayStart);

                            return (
                              <button
                                key={`home-week-head-${day.toISOString()}`}
                                type="button"
                                data-zrc-calendar-day={formatDateForTaskModal(day)}
                                onClick={(event) => openHomeCalendarQuickTaskForDate(day, event)}
                                className={`border-r border-[#edf0f4] last:border-r-0 text-center text-[10px] font-bold transition-all ${
                                  isToday ? 'text-[#56a8e8] bg-[#f8fbff]' : 'text-[#9aa3b1] hover:bg-[#fafcff]'
                                }`}
                              >
                                {formatCalendarDate(day)} {formatCalendarWeekday(day)}
                              </button>
                            );
                          })}
                        </div>

                        <div className="grid grid-cols-[54px_repeat(7,1fr)] h-[34px] border-b border-[#edf0f4]">
                          <div className="px-2 flex items-center text-[10px] font-bold text-[#4b5563] border-r border-[#edf0f4]">
                            Tüm Gün
                          </div>
                          {calendarWeekDays.map((day) => {
                            const allDayTasks = getMenuCalendarAllDayTasks(day);

                            return (
                              <div
                                key={`home-week-allday-${day.toISOString()}`}
                                data-zrc-calendar-day={formatDateForTaskModal(day)}
                                onClick={(event) => openHomeCalendarQuickTaskForDate(day, event)}
                                className="px-2 flex items-center gap-1 border-r border-[#edf0f4] last:border-r-0 overflow-hidden cursor-pointer hover:bg-[#fafcff]"
                              >
                                {allDayTasks[0] ? (
                                  <button
                                    type="button"
                                    data-calendar-task-button="true"
                                    onPointerUp={(event) => event.stopPropagation()}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openMenuCalendarTask(allDayTasks[0]);
                                    }}
                                    className="h-[20px] w-full rounded-[2px] px-2 text-left text-[8px] font-black text-current truncate"
                                    style={{ backgroundColor: `${allDayTasks[0].columnColor || '#8ecae6'}24` }}
                                  >
                                    {allDayTasks[0].title}
                                  </button>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>

                        <div className="max-h-[528px] overflow-y-auto custom-scrollbar">
                          {menuCalendarHours.map((hour, hourIndex) => (
                            <div key={`home-week-hour-${hour}`} className="grid grid-cols-[54px_repeat(7,1fr)] h-[48px] border-b border-[#edf0f4]">
                              <div className="px-2 pt-1.5 text-[10px] font-semibold text-[#4b5563] border-r border-[#edf0f4]">
                                {hour}:00
                              </div>
                              {calendarWeekDays.map((day) => {
                                const hourLayout = weekHourLayouts[hourIndex];
                                const hourTasks = hourLayout?.dayTasksByKey.get(day.toISOString()) || [];
                                const overflowTaskCount = hourTasks.filter((task) => (hourLayout?.laneByTaskKey.get(getCalendarTaskKey(task)) ?? 999) >= 3).length;

                                return (
                                  <div
                                    key={`home-week-hour-${day.toISOString()}-${hour}`}
                                    data-zrc-calendar-day={formatDateForTaskModal(day)}
                                    onClick={(event) => openHomeCalendarQuickTaskForDate(day, event)}
                                    className="relative border-r border-[#edf0f4] last:border-r-0 bg-[repeating-linear-gradient(135deg,#fff_0,#fff_8px,#fbfbfb_8px,#fbfbfb_16px)] cursor-pointer hover:bg-[#fafcff]"
                                  >
                                    {hourTasks.map((task) => {
                                      const laneIndex = hourLayout?.laneByTaskKey.get(getCalendarTaskKey(task));

                                      if (typeof laneIndex !== 'number' || laneIndex >= 3) return null;

                                      return (
                                      <button
                                        key={`home-week-task-${task.projectName}-${task.id}`}
                                        type="button"
                                        data-calendar-task-button="true"
                                        data-zrc-calendar-tooltip={getPremiumCalendarTaskTooltip(task)}
                                        onPointerUp={(event) => event.stopPropagation()}
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          openMenuCalendarTask(task);
                                        }}
                                        aria-label={getPremiumCalendarTaskTooltip(task)}
                                        className="zrc-calendar-task-line absolute left-1 right-1 block h-[4px] rounded-full border-0 text-left transition-all hover:brightness-95"
                                        style={{ ...getPremiumCalendarLineStyle(task), top: `${8 + (laneIndex * 8)}px` }}
                                      >
                                        <span className="sr-only">{getPremiumCalendarTaskTooltip(task)}</span>
                                      </button>
                                      );
                                    })}

                                    {overflowTaskCount > 0 && (
                                      <span className="absolute right-1 bottom-1 text-[8px] font-black text-[#9aa3b1]">+{overflowTaskCount}</span>
                                    )}
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
