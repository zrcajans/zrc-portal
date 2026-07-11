export default function ZRCAppShellAutoUiBlock05({
  calendarFocusedDate,
  calendarView,
  formatCalendarWeekday,
  getMenuCalendarHolidayLabel,
  getMenuCalendarTasksForHour,
  getPremiumCalendarLineStyle,
  getPremiumCalendarTaskTooltip,
  menuCalendarHours,
  openMenuCalendarTask
}) {
  const getCalendarTaskKey = (task = {}) => `${task.projectName || ''}-${task.id || task.supabaseId || task.title || 'task'}`;
  const dayHourLayouts = menuCalendarHours.map((hour) => {
    const hourTasks = getMenuCalendarTasksForHour(calendarFocusedDate, hour);
    const laneByTaskKey = new Map();

    hourTasks.forEach((task) => {
      const taskKey = getCalendarTaskKey(task);
      if (!laneByTaskKey.has(taskKey)) laneByTaskKey.set(taskKey, laneByTaskKey.size);
    });

    return { hourTasks, laneByTaskKey };
  });

  return (
    calendarView === 'Gün' && (
      <div className="bg-white">
        <div className="h-[36px] grid grid-cols-[54px_1fr] border-b border-[#edf0f4]">
          <div className="border-r border-[#edf0f4]" />
          <div className="flex items-center justify-center text-[10px] font-black text-[#9aa3b1]">
            {formatCalendarWeekday(calendarFocusedDate)}
          </div>
        </div>

        <div className="h-[32px] grid grid-cols-[54px_1fr] border-b border-[#edf0f4]">
          <div className="px-2 flex items-center text-[10px] font-bold text-[#4b5563] border-r border-[#edf0f4]">
            Tüm Gün
          </div>
          <div className="px-2 flex items-center bg-[repeating-linear-gradient(135deg,#fafafa_0,#fafafa_6px,#f6f6f6_6px,#f6f6f6_12px)]">
            {getMenuCalendarHolidayLabel(calendarFocusedDate) && (
              <span className="text-[10px] font-black text-[#374151]">
                {getMenuCalendarHolidayLabel(calendarFocusedDate)}
              </span>
            )}
          </div>
        </div>

        <div className="max-h-[560px] overflow-y-auto custom-scrollbar">
          {menuCalendarHours.map((hour, hourIndex) => {
            const hourLayout = dayHourLayouts[hourIndex];
            const hourTasks = hourLayout?.hourTasks || [];
            const overflowTaskCount = hourTasks.filter((task) => (hourLayout?.laneByTaskKey.get(getCalendarTaskKey(task)) ?? 999) >= 3).length;

            return (
              <div key={`day-hour-${hour}`} className="grid grid-cols-[54px_1fr] h-[48px] border-b border-[#edf0f4]">
                <div className="px-2 pt-1.5 text-[10px] font-semibold text-[#4b5563] border-r border-[#edf0f4]">
                  {hour}:00
                </div>
                <div className="relative bg-[repeating-linear-gradient(135deg,#fff_0,#fff_8px,#fbfbfb_8px,#fbfbfb_16px)]">
                  {hourTasks.map((task) => {
                    const laneIndex = hourLayout?.laneByTaskKey.get(getCalendarTaskKey(task));
                    if (typeof laneIndex !== 'number' || laneIndex >= 3) return null;

                    const taskTooltip = getPremiumCalendarTaskTooltip(task);

                    return (
                      <button
                        key={`day-task-${task.projectName}-${task.id}`}
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
              </div>
            );
          })}
        </div>
      </div>
    )
  );
}
