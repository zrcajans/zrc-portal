import React from 'react';

export default function ZRCAppShellCalendarViewAyBlock({
  calendarView,
  calendarGridDays,
  getMenuCalendarTasksForDay,
  getMenuCalendarHolidayLabel,
  calendarMonthDate,
  isSameCalendarDay,
  todayStart,
  handleCalendarDayClick,
  formatDateForTaskModal,
  openMenuCalendarTask,
  getPremiumCalendarLineStyle,
  getPremiumCalendarTaskTooltip
}) {
  const getCalendarTaskKey = (task = {}) => `${task.projectName || ''}-${task.id || task.supabaseId || task.title || 'task'}`;
  const toDayStamp = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  };

  const getTaskLineSegment = (task, day) => {
    const dayStamp = toDayStamp(day);
    const startStamp = toDayStamp(task.calendarStartDate || task.homeDate || task.calendarEndDate);
    const endStamp = toDayStamp(task.calendarEndDate || task.homeDate || task.calendarStartDate);

    return {
      startsOnDay: startStamp === dayStamp,
      endsOnDay: endStamp === dayStamp,
      style: {
        ...getPremiumCalendarLineStyle(task),
        borderRadius: '0px'
      }
    };
  };

  const getTaskLinePlacement = (segment, laneIndex) => ({
    top: `${laneIndex * 8}px`,
    left: segment.startsOnDay ? '10px' : '-13px',
    right: segment.endsOnDay ? '10px' : '-13px'
  });

  const safeCalendarGridDays = Array.isArray(calendarGridDays) ? calendarGridDays : [];
  const calendarWeekTaskLayouts = safeCalendarGridDays.reduce((layouts, day, dayIndex) => {
    const weekIndex = Math.floor(dayIndex / 7);
    const currentLayout = layouts[weekIndex] || {
      dayTasksByKey: new Map(),
      laneByTaskKey: new Map()
    };
    const dayTasks = getMenuCalendarTasksForDay(day);

    currentLayout.dayTasksByKey.set(day.toISOString(), dayTasks);
    dayTasks.forEach((task) => {
      const taskKey = getCalendarTaskKey(task);
      if (!currentLayout.laneByTaskKey.has(taskKey)) {
        currentLayout.laneByTaskKey.set(taskKey, currentLayout.laneByTaskKey.size);
      }
    });

    layouts[weekIndex] = currentLayout;
    return layouts;
  }, []);

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
          {safeCalendarGridDays.map((day, dayIndex) => {
            const weekLayout = calendarWeekTaskLayouts[Math.floor(dayIndex / 7)];
            const dayTasks = weekLayout?.dayTasksByKey.get(day.toISOString()) || [];
            const overflowTaskCount = dayTasks.filter((task) => (weekLayout?.laneByTaskKey.get(getCalendarTaskKey(task)) ?? 999) >= 3).length;
            const holidayLabel = getMenuCalendarHolidayLabel(day);
            const isCurrentMonth = day.getMonth() === calendarMonthDate.getMonth();
            const isToday = isSameCalendarDay(day, todayStart);

            return (
              <div
                key={`menu-calendar-month-${day.toISOString()}`}
                role="button"
                tabIndex={0}
                onClick={(event) => handleCalendarDayClick(event, day)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleCalendarDayClick(event, day);
                  }
                }}
                data-zrc-calendar-day={formatDateForTaskModal(day)}
                className={`relative p-1.5 border-r border-b border-[#edf0f4] text-left overflow-visible hover:bg-[#f8fbff] transition-all cursor-pointer ${
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

                <div className="relative z-10 mt-3 h-[28px]">
                  {dayTasks.map((task) => {
                    const taskKey = getCalendarTaskKey(task);
                    const laneIndex = weekLayout?.laneByTaskKey.get(taskKey);

                    if (typeof laneIndex !== 'number' || laneIndex >= 3) return null;

                    const lineSegment = getTaskLineSegment(task, day);
                    const taskTooltip = getPremiumCalendarTaskTooltip(task);

                    return (
                      <button
                        key={`menu-month-task-${day.toISOString()}-${taskKey}`}
                        type="button"
                        data-calendar-task-button="true"
                        data-zrc-calendar-tooltip={taskTooltip}
                        onClick={(event) => {
                          event.stopPropagation();
                          openMenuCalendarTask(task);
                        }}
                        aria-label={taskTooltip}
                        className="zrc-calendar-task-line absolute z-20 block h-[3px] border-0 text-left transition-all hover:brightness-95 hover:shadow-[0_1px_4px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2937]/25"
                        style={{ ...lineSegment.style, ...getTaskLinePlacement(lineSegment, laneIndex) }}
                      >
                        {lineSegment.startsOnDay && <span className="zrc-calendar-task-line-endpoint zrc-calendar-task-line-endpoint-start" />}
                        {lineSegment.endsOnDay && <span className="zrc-calendar-task-line-endpoint zrc-calendar-task-line-endpoint-end" />}
                        <span className="sr-only">{taskTooltip}</span>
                      </button>
                    );
                  })}

                  {overflowTaskCount > 0 && (
                    <div className="absolute left-0 top-[24px] px-1 text-[8px] font-bold text-[#9aa3b1]">
                      +{overflowTaskCount}
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
