import React from 'react';
import { createPortal } from 'react-dom';

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
    getPremiumCalendarLineStyle,
    getPremiumCalendarTaskStyle,
    getPremiumCalendarTaskTooltip,
    shrink,
    getPremiumCalendarDotStyle,
    black,
    current,
    truncate,
    formatMenuCalendarTaskTime,
    bold,
    b8bfca
  } = props;

  const [hoveredTaskTooltip, setHoveredTaskTooltip] = React.useState(null);

  const getSafeTooltipX = (clientX) => {
    if (typeof window === 'undefined') return clientX;
    return Math.min(Math.max(clientX, 156), window.innerWidth - 156);
  };

  const createTooltipState = (taskTooltip, clientX, clientY, placement = 'above') => ({
    text: taskTooltip,
    x: getSafeTooltipX(clientX),
    y: clientY,
    placement
  });

  const showTooltipFromPointer = (taskTooltip, event) => {
    if (!taskTooltip) return;
    setHoveredTaskTooltip(createTooltipState(taskTooltip, event.clientX, event.clientY - 4));
  };

  const showTooltipFromFocus = (taskTooltip, currentTarget) => {
    if (!taskTooltip || !currentTarget) return;
    const targetRect = currentTarget.getBoundingClientRect();
    const prefersBelow = targetRect.top < 90;

    setHoveredTaskTooltip(
      createTooltipState(
        taskTooltip,
        targetRect.left + (targetRect.width / 2),
        prefersBelow ? targetRect.bottom : targetRect.top,
        prefersBelow ? 'below' : 'above'
      )
    );
  };

  const hideTooltip = () => {
    setHoveredTaskTooltip(null);
  };

  const getTaskLineSegment = (task, day) => {
    const taskStart = task.calendarStartDate || task.homeDate || task.calendarEndDate;
    const taskEnd = task.calendarEndDate || task.homeDate || task.calendarStartDate;
    const toDayStamp = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const dayStamp = toDayStamp(day);
    const startsOnDay = taskStart && toDayStamp(taskStart) === dayStamp;
    const endsOnDay = taskEnd && toDayStamp(taskEnd) === dayStamp;
    const startsVisualSegment = startsOnDay || day.getDay() === 1;
    const endsVisualSegment = endsOnDay || day.getDay() === 0;

    return {
      startsOnDay,
      endsOnDay,
      startsVisualSegment,
      endsVisualSegment,
      style: {
        ...getPremiumCalendarLineStyle(task),
        borderRadius: '0px'
      }
    };
  };

  const getTaskLinePlacement = (segment, index) => ({
    top: `${index * 8}px`,
    left: segment.startsOnDay ? '10px' : '-13px',
    right: segment.endsOnDay ? '10px' : '-13px'
  });

  const getCalendarTaskKey = (task = {}) => {
    const taskId = task.id || task.supabaseId || task.title || 'task';
    return `${task.projectName || ''}-${taskId}`;
  };

  const calendarWeekTaskLayouts = (Array.isArray(calendarGridDays) ? calendarGridDays : []).reduce((layouts, day, dayIndex) => {
    const weekIndex = Math.floor(dayIndex / 7);
    const currentLayout = layouts[weekIndex] || {
      dayTasksByKey: new Map(),
      laneByTaskKey: new Map(),
      tasksByKey: new Map()
    };
    const dayKey = day.toISOString();
    const dayTasks = getMenuCalendarTasksForDay(day);

    currentLayout.dayTasksByKey.set(dayKey, dayTasks);
    dayTasks.forEach((task) => {
      const taskKey = getCalendarTaskKey(task);
      if (!currentLayout.tasksByKey.has(taskKey)) {
        currentLayout.tasksByKey.set(taskKey, task);
        currentLayout.laneByTaskKey.set(taskKey, currentLayout.laneByTaskKey.size);
      }
    });

    layouts[weekIndex] = currentLayout;
    return layouts;
  }, []);

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
                          {calendarGridDays.map((day, dayIndex) => {
                            const weekLayout = calendarWeekTaskLayouts[Math.floor(dayIndex / 7)];
                            const dayTasks = weekLayout?.dayTasksByKey.get(day.toISOString()) || [];
                            const overflowTaskCount = dayTasks.filter((task) => {
                              const laneIndex = weekLayout?.laneByTaskKey.get(getCalendarTaskKey(task));
                              return typeof laneIndex === 'number' && laneIndex >= 3;
                            }).length;
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
                                className={`relative min-h-0 border-r border-b border-[#eceff4] px-3 py-2 text-left transition-all hover:bg-[#fafcff] overflow-visible cursor-pointer ${
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

                                <div className="relative z-10 mt-3 h-[28px]">
                                  {dayTasks.map((task) => {
                                    const taskKey = getCalendarTaskKey(task);
                                    const laneIndex = weekLayout?.laneByTaskKey.get(taskKey);

                                    if (typeof laneIndex !== 'number' || laneIndex >= 3) return null;

                                    const lineSegment = getTaskLineSegment(task, day);
                                    const taskTooltip = getPremiumCalendarTaskTooltip(task);

                                    return (
                                      <button
                                      key={`home-cal-task-${day.toISOString()}-${taskKey}`}
                                      type="button"
                                      data-calendar-task-button="true"
                                      data-zrc-calendar-tooltip={taskTooltip}
                                      data-zrc-fixed-tooltip="true"
                                      data-zrc-line-start={lineSegment.startsOnDay ? 'true' : undefined}
                                      data-zrc-line-end={lineSegment.endsOnDay ? 'true' : undefined}
                                      onMouseUp={(event) => event.stopPropagation()}
                                      onMouseEnter={(event) => showTooltipFromPointer(taskTooltip, event)}
                                      onMouseMove={(event) => showTooltipFromPointer(taskTooltip, event)}
                                      onMouseLeave={hideTooltip}
                                      onFocus={(event) => showTooltipFromFocus(taskTooltip, event.currentTarget)}
                                      onBlur={hideTooltip}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        hideTooltip();
                                        openMenuCalendarTask(task);
                                      }}
                                      aria-label={taskTooltip}
                                      className="zrc-calendar-task-line absolute z-20 block h-[3px] border-0 text-left transition-all hover:brightness-95 hover:shadow-[0_1px_4px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2937]/25"
                                      style={{ ...lineSegment.style, ...getTaskLinePlacement(lineSegment, laneIndex) }}
                                    >
                                      <span className="sr-only">{taskTooltip}</span>
                                      </button>
                                    );
                                  })}

                                  {overflowTaskCount > 0 && (
                                    <div className="absolute left-0 top-[24px] px-1 text-[8px] font-bold text-[#b8bfca]">
                                      +{overflowTaskCount}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {hoveredTaskTooltip && typeof document !== 'undefined'
                          ? createPortal(
                              <div
                                className="pointer-events-none fixed z-[120] max-w-[280px] rounded-[8px] border border-white/15 bg-[rgba(31,41,55,0.82)] px-3 py-2 text-[11px] font-semibold leading-[1.35] text-white shadow-[0_14px_32px_rgba(15,23,42,0.18)] backdrop-blur-[8px]"
                                style={{
                                  left: `${hoveredTaskTooltip.x}px`,
                                  top: `${hoveredTaskTooltip.y}px`,
                                  maxWidth: 'min(280px, calc(100vw - 24px))',
                                  transform: hoveredTaskTooltip.placement === 'below'
                                    ? 'translate(-50%, 12px)'
                                    : 'translate(-50%, calc(-100% - 12px))'
                                }}
                              >
                                {hoveredTaskTooltip.text}
                              </div>,
                              document.body
                            )
                          : null}
                      </>
                    )
  );
}
