import React from 'react';

export default function ZRCAppShellCalendarViewHaftaBlock({
  calendarView,
  calendarWeekDays,
  formatCalendarDate,
  formatCalendarWeekday,
  setCalendarFocusedDate,
  getMenuCalendarAllDayTasks,
  getMenuCalendarHolidayLabel,
  formatDateForTaskModal,
  openHomeCalendarQuickTaskForDate,
  menuCalendarHours,
  getMenuCalendarTasksForHour,
  openMenuCalendarTask,
  getPremiumCalendarLineStyle,
  getPremiumCalendarTaskTooltip
}) {
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
                className="px-2 flex items-center gap-1 border-r border-[#edf0f4] last:border-r-0 overflow-hidden cursor-pointer hover:bg-[#f8fbff]"
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
                  >
                    {allDayTasks[0].title}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="max-h-[560px] overflow-y-auto custom-scrollbar">
          {menuCalendarHours.map((hour, hourIndex) => (
            <div key={`week-hour-${hour}`} className="grid grid-cols-[54px_repeat(7,1fr)] h-[48px] border-b border-[#edf0f4]">
              <div className="px-2 pt-1.5 text-[10px] font-semibold text-[#4b5563] border-r border-[#edf0f4]">
                {hour}:00
              </div>
              {calendarWeekDays.map((day) => {
                const hourLayout = weekHourLayouts[hourIndex];
                const hourTasks = hourLayout?.dayTasksByKey.get(day.toISOString()) || [];
                const overflowTaskCount = hourTasks.filter((task) => (hourLayout?.laneByTaskKey.get(getCalendarTaskKey(task)) ?? 999) >= 3).length;

                return (
                  <div
                    key={`week-hour-${day.toISOString()}-${hour}`}
                    data-zrc-calendar-day={formatDateForTaskModal(day)}
                    onClick={(event) => openHomeCalendarQuickTaskForDate(day, event)}
                    className="relative border-r border-[#edf0f4] last:border-r-0 bg-[repeating-linear-gradient(135deg,#fff_0,#fff_8px,#fbfbfb_8px,#fbfbfb_16px)] cursor-pointer hover:bg-[#f8fbff]"
                  >
                    {hourTasks.map((task) => {
                      const laneIndex = hourLayout?.laneByTaskKey.get(getCalendarTaskKey(task));
                      if (typeof laneIndex !== 'number' || laneIndex >= 3) return null;

                      const taskTooltip = getPremiumCalendarTaskTooltip(task);

                      return (
                        <button
                          key={`week-task-${task.projectName}-${task.id}`}
                          type="button"
                          data-calendar-task-button="true"
                          data-zrc-calendar-tooltip={taskTooltip}
                          onClick={(event) => {
                            event.stopPropagation();
                            openMenuCalendarTask(task);
                          }}
                          aria-label={taskTooltip}
                          className="zrc-calendar-task-line absolute left-1 right-1 block h-[4px] rounded-full border-0 text-left transition-all hover:brightness-95"
                          style={{ ...getPremiumCalendarLineStyle(task), top: `${8 + (laneIndex * 8)}px` }}
                        >
                          <span className="sr-only">{taskTooltip}</span>
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
