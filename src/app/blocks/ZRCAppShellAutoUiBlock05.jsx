export default function ZRCAppShellAutoUiBlock05({
  calendar,
  calendarFocusedDate,
  calendarView,
  data,
  event,
  formatCalendarWeekday,
  formatMenuCalendarTaskTime,
  getMenuCalendarHolidayLabel,
  getMenuCalendarTasksForHour,
  getPremiumCalendarTaskStyle,
  hour,
  hourTasks,
  menuCalendarHours,
  onClick,
  openMenuCalendarTask,
  task,
}) {
  return (
    <>
      {calendarView === 'Gün' && (
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
                            {menuCalendarHours.map((hour) => {
                              const hourTasks = getMenuCalendarTasksForHour(calendarFocusedDate, hour);
      
                              return (
                                <div key={`day-hour-${hour}`} className="grid grid-cols-[54px_1fr] h-[48px] border-b border-[#edf0f4]">
                                  <div className="px-2 pt-1.5 text-[10px] font-semibold text-[#4b5563] border-r border-[#edf0f4]">
                                    {hour}:00
                                  </div>
                                  <div className="relative bg-[repeating-linear-gradient(135deg,#fff_0,#fff_8px,#fbfbfb_8px,#fbfbfb_16px)]">
                                    {hourTasks.map((task) => (
                                      <button
                                        key={`day-task-${task.projectName}-${task.id}`}
                                        type="button"
                                        data-calendar-task-button="true"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          openMenuCalendarTask(task);
                                        }}
                                        className="absolute left-1 right-6 top-1 min-h-[32px] rounded-[8px] border border-[#e4e9f1] border-l-[3px] bg-white px-2 py-1 text-left text-[8px] font-black text-current overflow-hidden shadow-[0_8px_18px_rgba(15,23,42,0.055)] hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition-all"
                                        style={getPremiumCalendarTaskStyle(task)}
                                      >
                                        <div className="opacity-80">{formatMenuCalendarTaskTime(task)}</div>
                                        <div className="truncate">{task.title}</div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
    </>
  );
}
